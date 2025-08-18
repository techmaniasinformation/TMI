module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'sonarjs'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:sonarjs/recommended'
  ],
  rules: {
    'complexity': ['error', { max: 10 }],
    'max-depth': ['error', 4],
    'max-params': ['error', 3],
    'sonarjs/cognitive-complexity': ['error', 15],
    'react/jsx-max-depth': ['error', { max: 4 }],
    'sonarjs/max-switch-cases': ['error', 10]
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 