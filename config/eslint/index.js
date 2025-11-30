/**
 * ESLint Configuration Index
 * 
 * Centralized configuration management for different linting contexts.
 * This provides a single entry point for all ESLint configurations.
 */

import baseConfig from './base.config.js';
import mcpConfig from './eslint.mcp.config.js';
import radixConfig from './eslint.radix.config.js';
import radixRules from './rules/radix-ui.js';

export { baseConfig, mcpConfig, radixConfig };

// Default export combines base configuration with Radix validation
export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'radix-custom': {
        rules: radixRules
      }
    },
    rules: {
      'radix-custom/no-empty-select-item': 'error'
    }
  }
]; 