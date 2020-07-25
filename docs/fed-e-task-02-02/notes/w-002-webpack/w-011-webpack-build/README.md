# Webpack 多环境多配置文件

开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。建议为每个环境编写彼此独立的 webpack 配置。

因为生产环境和开发环境的配置只有略微区别，所以将共用部分的配置作为一个通用配置。使用`webpack-merge`工具，将这些配置合并在一起。通过通用配置，我们不必在不同环境的配置中重复代码。

## 安装`webpack-merge`

```
npm i webpack-merge -D
```

## 示例

`build/webpack.base.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'main.js',
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.txt$/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: require.resolve('../src/answer.js'),
        use: {
          loader: 'val-loader',
        },
      },
      {
        test: /\.(png|jpge|jpg|git|svg)$/,
        use: {
          loader: 'file-loader',
          options: {},
        },
      },
    ],
  },
};
```

`webpack.dev.config.js`

```javascript
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: false,
    hot: true,
    open: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
```

`webpack.pro.config.js`

```javascript
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  plugins: [new UglifyJSPlugin()],
});
```
