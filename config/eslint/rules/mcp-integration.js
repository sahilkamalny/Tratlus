/**
 * ESLint Rule: MCP Integration Validation
 * 
 * Enforces that MCP integrations include verification comments showing
 * that endpoints were tested before implementation.
 * 
 * This rule prevents the common MCP integration failure pattern where
 * developers assume parameter names without testing.
 */

export default {
  "mcp-test-first": {
    meta: {
      type: "problem",
      docs: {
        description: "Require MCP endpoint testing verification before integration",
        category: "Best Practices",
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        missingVerification: 'MCP integration must include verification comment showing endpoint was tested. Add a comment like: "// VERIFIED: Tested with curl - correct parameter names for {{toolName}}"',
        missingToolName: 'MCP integration verification comment should include the tool name being called',
        assumedParameters: 'MCP integration uses common parameter names ({{params}}) that should be verified. These often differ from standard REST API patterns.',
      },
    },
    create(context) {
      // Common parameter names that are often assumed incorrectly
      const COMMON_ASSUMED_PARAMS = [
        'to', 'from', 'subject', 'body', 'content', 'message',
        'name', 'filename', 'file_name', 'data', 'id',
        'url', 'path', 'folder', 'parent'
      ];

      // MCP verification keywords that indicate testing was done
      const VERIFICATION_KEYWORDS = [
        'VERIFIED', 'Tested with curl', 'confirmed by testing',
        'curl testing', 'parameter names', 'tested with'
      ];

      /**
       * Check if a comment contains MCP verification
       */
      function hasVerificationComment(comments) {
        return comments.some(comment => 
          VERIFICATION_KEYWORDS.some(keyword => 
            comment.value.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }

      /**
       * Extract tool name from MCP call
       */
      function extractToolName(node) {
        // Look for callMCPTool(serverUrl, mcpId, "TOOL_NAME", args)
        if (node.arguments.length >= 3 && 
            node.arguments[2].type === 'Literal' && 
            typeof node.arguments[2].value === 'string') {
          return node.arguments[2].value;
        }
        return null;
      }

      /**
       * Check if arguments contain commonly assumed parameter names
       */
      function getAssumedParams(argsNode) {
        const assumedParams = [];
        
        if (argsNode && argsNode.type === 'ObjectExpression') {
          argsNode.properties.forEach(prop => {
            if (prop.type === 'Property' && 
                prop.key.type === 'Literal' && 
                COMMON_ASSUMED_PARAMS.includes(prop.key.value)) {
              assumedParams.push(prop.key.value);
            }
          });
        }
        
        return assumedParams;
      }

      return {
        CallExpression(node) {
          // Check for callTool function calls
          if ((node.callee.name === 'callTool' || 
               (node.callee.type === 'MemberExpression' && 
                node.callee.property.name === 'callTool')) &&
              node.arguments.length >= 1) {
            
            // Check if first argument contains MCP server URL
            const firstArg = node.arguments[0];
            if (firstArg.type === 'Literal' && 
                typeof firstArg.value === 'string' &&
                firstArg.value.includes('mcp.composio.dev')) {
              
              // Get comments before this call or before parent AwaitExpression
              const sourceCode = context.getSourceCode();
              let comments = sourceCode.getCommentsBefore(node);
              
              // If no comments found and parent is AwaitExpression, check before parent
              if (comments.length === 0 && node.parent && node.parent.type === 'AwaitExpression') {
                comments = sourceCode.getCommentsBefore(node.parent);
              }
              
              // If still no comments and parent's parent is VariableDeclarator, check before that
              if (comments.length === 0 && node.parent && node.parent.parent && 
                  node.parent.parent.type === 'VariableDeclarator') {
                const variableDeclaration = node.parent.parent.parent;
                if (variableDeclaration && variableDeclaration.type === 'VariableDeclaration') {
                  comments = sourceCode.getCommentsBefore(variableDeclaration);
                }
              }
              
              const hasVerification = hasVerificationComment(comments);
              const toolName = extractToolName(node);
              const argsNode = node.arguments[2]; // Third argument should be parameters
              const assumedParams = getAssumedParams(argsNode);

              // Check for missing verification comment
              if (!hasVerification) {
                context.report({
                  node,
                  messageId: "missingVerification",
                  data: {
                    toolName: toolName || 'UNKNOWN_TOOL'
                  }
                });
              }

              // Check for commonly assumed parameters
              if (assumedParams.length > 0) {
                context.report({
                  node: argsNode,
                  messageId: "assumedParameters",
                  data: {
                    params: assumedParams.join(', ')
                  }
                });
              }

              // Check if verification comment includes tool name
              if (hasVerification && toolName) {
                const hasToolNameInComment = comments.some(comment =>
                  comment.value.includes(toolName)
                );
                
                if (!hasToolNameInComment) {
                  context.report({
                    node,
                    messageId: "missingToolName"
                  });
                }
              }
            }
          }
        }
      };
    }
  }
};