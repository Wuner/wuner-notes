# [MiniCssExtractPlugin(CSS 提取)](https://webpack.js.org/plugins/mini-css-extract-plugin/)

该插件将 CSS 提取到单独的文件中。 它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。 它支持 CSS 和 SourceMap 的按需加载。

基于 webpack v4。

与`extract-text-webpack-plugin`比较：

- 异步加载
- 没有重复的编译（性能）
- 更容易使用
- 特定于 CSS

## 安装

```
npm i mini-css-extract-plugin -D
```

## 用法

`webpack.config.js`

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

## 在 production 环境 压缩

因为 webpack 的 production 只会压缩 JS 代码，所以我们这边需要自己配置`optimize-css-assets-webpack-plugin`插件来压缩 CSS

webpack 官方建议我们放在 optimization 里，当 optimization 开启时，才压缩。

因为我们在 optimization 使用数组配置了[optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 插件，webpack 认为我们需要自定义配置，所以导致 JS 压缩失效，相对的我们需要使用[terser-webpack-plugin](https://webpack.js.org/plugins/terser-webpack-plugin/#root) 插件来压缩 JS 代码

```javascript
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```
