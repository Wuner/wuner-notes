module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'prettier',
    'eslint:recommended',
    'eslint-config-prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': 'off',
    'prettier/prettier': 'warn',
    'no-useless-escape': 'off', // 关闭禁止转义字符
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
