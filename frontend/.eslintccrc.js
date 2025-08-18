module.exports = {
  rules: 'logic',
  eslintOptions: {
    useEslintrc: false,
    overrideConfig: {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'complexity': ['error', { max: 10 }],
        'max-depth': ['error', 4],
        'max-params': ['error', 3]
      }
    }
  }
};
