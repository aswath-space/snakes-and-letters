// ESLint configuration enforcing code quality and style rules
module.exports = {
  root: true,
  // Parse TypeScript files
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    // Base recommended rules
    'eslint:recommended',
    // Additional rules for TypeScript
    'plugin:@typescript-eslint/recommended',
    // React-specific linting
    'plugin:react/recommended',
    // Allow automatic runtime for JSX
    'plugin:react/jsx-runtime',
    // Integrate with Prettier formatting
    'prettier',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      // Automatically detect installed React version
      version: 'detect',
    },
  },
};
