module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@modules', './src/modules'],
          ['@shared', './src/shared'],
          ['@core', './src/core'],
          ['@config', './src/config'],
          ['@utils', './src/shared/utils'],
          ['@middlewares', './src/shared/middlewares'],
          ['@exceptions', './src/shared/exceptions'],
          ['@constants', './src/shared/constants'],
          ['@helpers', './src/shared/helpers'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
};
