# CopyWebpackPlugin

复制文件

## 安装

```
npm i copy-webpack-plugin -D
```

## 配置

`babel.config.js`

```javascript
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: 'public',
        },
      ],
    }),
  ],
};
```
