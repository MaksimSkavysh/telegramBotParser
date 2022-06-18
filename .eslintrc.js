module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    // 'airbnb-base',
    'standard',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/first': 'off',
    'no-return-assign': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
