# [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)

HtmlWebpackPlugin 简化了 HTML 文件的创建，以便为你的 webpack 包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 你可以让插件为你生成一个 HTML 文件，使用 lodash 模板提供你自己的模板，或使用你自己的 loader。

## [使用非 lodash 模板](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)

## 安装

```
npm i html-webpack-plugin -D
```

## 用法

该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包。 只需添加插件到你的 webpack 配置如下：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [new HtmlWebpackPlugin()],
};
```
