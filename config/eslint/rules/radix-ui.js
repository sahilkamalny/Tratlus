/**
 * Custom ESLint Rules for Radix UI Components
 * 
 * These rules enforce proper usage patterns for Radix UI components
 * to prevent common mistakes and ensure consistent implementation.
 */

export default {
  "no-empty-select-item": {
    meta: {
      type: "problem",
      docs: {
        description: "Prevent SelectItem components from having empty string values",
        category: "Best Practices",
        recommended: true,
      },
      fixable: "code",
      schema: [],
      messages: {
        emptySelectValue: 'SelectItem cannot have empty string value. Use a non-empty value like "none" instead.',
      },
    },
    create: function(context) {
      return {
        JSXElement(node) {
          if (node.openingElement.name.name === 'SelectItem') {
            const valueAttr = node.openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'value'
            );
            
            if (valueAttr && valueAttr.value) {
              // Check if value is an empty string
              if (valueAttr.value.type === 'Literal' && valueAttr.value.value === '') {
                const filename = context.getFilename();
                const loc = valueAttr.loc;
                
                const hasFix = process.argv.includes('--fix');
                
                context.report({
                  node: valueAttr,
                  messageId: 'emptySelectValue',
                  fix: hasFix ? function(fixer) {
                    // Print when fixing, but respect quiet mode
                    const isQuiet = process.argv.includes('--quiet');
                    if (!isQuiet) {
                      console.error(`  ✓ Fixed empty SelectItem value at ${filename}:${loc.start.line}:${loc.start.column}`);
                    }
                    return fixer.replaceText(valueAttr.value, '"none"');
                  } : undefined
                });
              }
            }
          }
        }
      };
    }
  }
}; 