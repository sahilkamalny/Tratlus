// ESLint configuration specifically for Radix UI custom rules
import { commonIgnores, commonLanguageOptions } from './base.config.js';
import radixRules from './rules/radix-ui.js';

export default [
  {
    ignores: commonIgnores,
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'radix-custom': {
        rules: radixRules
      }
    },
    languageOptions: commonLanguageOptions,
    rules: {
      'radix-custom/no-empty-select-item': 'error'
    }
  }
];