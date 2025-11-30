/**
 * ESLint Configuration for MCP Integration Validation
 * 
 * This configuration specifically validates MCP integrations to ensure
 * proper testing and verification before implementation.
 * 
 * Usage: npm run eslint:mcp
 */

import { commonIgnores, commonLanguageOptions } from './base.config.js';
import mcpRules from './rules/mcp-integration.js';

export default [
  {
    ignores: [
      ...commonIgnores,
      '**/*.config.js',
      '**/*.config.ts',
    ],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: commonLanguageOptions,
    rules: {
      // Reduce noise from unused variables in generated/imported code
      'no-unused-vars': 'off',
      // Allow redeclaration in generated files (common in protobuf-generated code)
      'no-redeclare': 'off',
      // Allow useless escapes in regex patterns
      'no-useless-escape': 'off',
    },
  },
  {
    // More lenient rules for generated DAL/ORM code
    files: ['src/components/data/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Turn off unused vars for generated enum constants and type definitions
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
  {
    // Lenient rules for type definition files
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    // MCP-specific rules
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'mcp-integration': {
        rules: mcpRules,
      },
    },
    rules: {
      // Enable MCP validation rule
      'mcp-integration/mcp-test-first': 'error',
      
      // Disable other rules to focus on MCP validation
      'no-console': 'off',
    },
  }
];