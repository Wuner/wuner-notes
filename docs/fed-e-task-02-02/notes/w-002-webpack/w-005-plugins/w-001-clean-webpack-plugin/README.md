# [CleanWebpackPlugin](https://github.com/johnagan/clean-webpack-plugin)

一个 webpack 插件，用于删除/清理您的构建文件夹。

> 注意：支持 Node v8+和 webpack v3+。

## 安装

```
npm i clean-webpack-plugin -D
```

## 用法

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```
