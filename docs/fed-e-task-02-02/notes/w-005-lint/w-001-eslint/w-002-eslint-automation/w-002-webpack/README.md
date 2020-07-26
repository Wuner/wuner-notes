# ESLint 结合 Webpack

## 安装

```
npm i eslint eslint-loader -D
```

## 用法

webpack.config.js

```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'eslint-loader' },
        enforce: 'pre',
      },
    ],
  },
};
```

## react 项目使用

除了上述配置外，还需配置.eslintrc.js

### 安装

```
npm i eslint-plugin-react -D
```

### 配置一

.eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['standard', ''],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
};
```

## 配置二

.eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['standard', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
};
```
