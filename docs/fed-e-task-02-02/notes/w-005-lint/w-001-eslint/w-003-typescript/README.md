# ESLint 检查 TypeScript

在初始化 eslint 的时候选择 TypeScript

![note](./imgs/1.png)

`.eslintrc.js`

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
  plugins: ['@typescript-eslint'],
};
```
