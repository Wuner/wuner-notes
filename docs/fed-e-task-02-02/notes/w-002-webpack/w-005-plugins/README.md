# [插件(plugins)](https://www.webpack.js.org/plugins/)

插件是 webpack 的[支柱](https://github.com/webpack/tapable)功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！

插件目的在于解决 [loader](../w-004-loader) 无法实现的其他事。

## 剖析

webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

## 用法

由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。

根据你的 webpack 用法，这里有多种方式使用插件。

### 配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 yarn或者npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};

module.exports = config;
```

### Node API

> 即便使用 Node API，用户也应该在配置中传入 plugins 属性。compiler.apply 并不是推荐的使用方式。

some-node-script.js

```javascript
const webpack = require('webpack'); //访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);
compiler.apply(new webpack.ProgressPlugin());

compiler.run(function (err, stats) {
  // ...
});
```

> 以上看到的示例和[webpack 自身运行时(runtime)](https://github.com/webpack/webpack/blob/e7087ffeda7fa37dfe2ca70b5593c6e899629a2c/bin/webpack.js#L290-L292) 极其类似。[webpack 源码](https://github.com/webpack/webpack) 中隐藏有大量使用示例，你可以用在自己的配置和脚本中。

