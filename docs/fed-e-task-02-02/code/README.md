# Webpack 构建 Vue 项目

## 安装 webpack 和 webpack-cli

```
npm i webpack webpack-cli -D
```

## 配置入口起点

创建一个`webpack.config.js`文件

```javascript
module.exports = {
  entry: './src/main.js',
};
```

## 配置 output

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
};
```

## 配置 mode

提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。

| 选项        | 描述                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。                                                                                                                            |
| production  | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin. |
| none        | 会将 process.env.NODE_ENV 的值设为 none，不做任何处理                                                                                                                                                                     |

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
};
```

## 样式文件处理

### 安装

```text
npm i style-loader less less-loader css-loader -D
```

- 将 less 转换为 css
- 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- 将模块的导出作为样式添加到 DOM 中

### 配置

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

## CSS 提取

### 安装

```
npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin terser-webpack-plugin -D
```

### 配置

因为 webpack 的 production 只会压缩 JS 代码，所以我们这边需要自己配置 `optimize-css-assets-webpack-plugin` 插件来压缩 CSS

webpack 官方建议我们放在`optimization` 里，当 `optimization`开启时，才压缩。

因为我们在 optimization 使用数组配置了 `optimize-css-assets-webpack-plugin` 插件，webpack 认为我们需要自定义配置，所以导致 JS 压缩失效，相对的我们需要使用 `terser-webpack-plugin` 插件来压缩 JS 代码

`webpack.config.js`

```javascript
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
```

## 处理文件资源

### 安装

```
npm i url-loader file-loader -D
```

### 配置

当文件资源大于 10000byte 时，生成文件到指定目录

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false,
          name: 'imgs/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
    ],
  },
};
```

## 处理 vue 文件

### 安装

```
npm i vue-loader vue-template-compiler -D
```

### 配置

指定加载`src`目录下的，忽略`node_modules`目录

`webpack.config.js`

```javascript
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
  ],
};
```

## 处理 js 文件

将 es6+ 转换为 es5

### 安装

```
npm i babel-loader @babel/core @babel/preset-env -D
```

### 配置

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
};
```

配置 babel 使用插件集合将 es6+ 转换为 es5

`babel.config.js`

```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      },
    ],
  ],
};
```

## HTML 文件的创建

### 安装

```
npm i html-webpack-plugin -D
```

### 配置

使用模板创建`html`，并注入`BASE_URL`

我将原 html 文件中的`<%= BASE_URL %>`改为`<%= htmlWebpackPlugin.options.BASE_URL %>`

`webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      BASE_URL: 'public/',
      inject: true,
      template: 'public/index.html',
    }),
  ],
};
```

## 将无需编译的文件复制到打包目录下

### 安装

```
npm i copy-webpack-plugin -D
```

### 配置

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

## 删除构建文件夹。

### 安装

```
npm i clean-webpack-plugin -D
```

### 配置

`babel.config.js`

```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
};
```

## 浏览器同步测试工具

### 安装

```
npm i webpack-dev-server -D
```

### 配置

这里我开启了模块热替换，对于样式更改，不会进行浏览器刷新

`babel.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  devServer: {
    // 当使用内联模式(inline mode)时，控制台(console)将显示消息，可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      index: `index.html`,
    },
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。我们这里直接禁用掉
    contentBase: false,
    // 一切服务都启用gzip 压缩：
    compress: true,
    // 指定使用一个 host。默认是 localhost
    host: 'localhost',
    // 指定要监听请求的端口号
    port: '8000',
    // local服务器自动打开浏览器。
    open: true,
    // 当出现编译器错误或警告时，在浏览器中显示全屏遮罩层。默认情况下禁用。
    overlay: false,
    // 浏览器中访问的相对路径
    publicPath: '',
    // 代理配置
    proxy: {
      '/api/': {
        target: 'https://github.com/',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
    // 除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 我们配置 FriendlyErrorsPlugin 来显示错误信息到控制台
    quiet: true,
    // webpack 使用文件系统(file system)获取文件改动的通知。监视文件 https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true,
  },
};
```

## Devtool

具体配置请移步到[Devtool](../notes/w-002-webpack/w-007-dev-tool)笔记

### 配置

这里我们使用`eval-source-map`

每个模块使用 eval() 执行，并且 source map 转换为 DataUrl 后添加到 eval() 中。初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。它会生成用于开发环境的最佳品质的 source map。

`webpack.config.js`

```javascript
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  devtool: 'eval-source-map',
};
```

## `webpack.config.js`和`babel.config.js`完整示例

`webpack.config.js`

```javascript
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  devtool: 'eval-source-map',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  devServer: {
    // 当使用内联模式(inline mode)时，控制台(console)将显示消息，可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      index: `index.html`,
    },
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。我们这里直接禁用掉
    contentBase: false,
    // 一切服务都启用gzip 压缩：
    compress: true,
    // 指定使用一个 host。默认是 localhost
    host: 'localhost',
    // 指定要监听请求的端口号
    port: '8000',
    // local服务器自动打开浏览器。
    open: true,
    // 当出现编译器错误或警告时，在浏览器中显示全屏遮罩层。默认情况下禁用。
    overlay: false,
    // 浏览器中访问的相对路径
    publicPath: '',
    // 代理配置
    proxy: {
      '/api/': {
        target: 'https://github.com/',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
    // 除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 我们配置 FriendlyErrorsPlugin 来显示错误信息到控制台
    quiet: true,
    // webpack 使用文件系统(file system)获取文件改动的通知。监视文件 https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false,
          name: 'imgs/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      BASE_URL: 'public/',
      inject: true,
      template: 'public/index.html',
    }),
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
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

`babel.config.js`

```javascript
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      },
    ],
  ],
};
```

## Webpack 多环境多配置文件

开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。建议为每个环境编写彼此独立的 webpack 配置。

因为生产环境和开发环境的配置只有略微区别，所以将共用部分的配置作为一个通用配置。使用 webpack-merge 工具，将这些配置合并在一起。通过通用配置，我们不必在不同环境的配置中重复代码。

`webpack.common.js`

```javascript
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false,
          name: 'imgs/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      BASE_URL: 'public/',
      inject: true,
      template: 'public/index.html',
    }),
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
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

`webpack.dev.js`

```javascript
const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    // 当使用内联模式(inline mode)时，控制台(console)将显示消息，可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      index: `index.html`,
    },
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。我们这里直接禁用掉
    contentBase: false,
    // 一切服务都启用gzip 压缩：
    compress: true,
    // 指定使用一个 host。默认是 localhost
    host: 'localhost',
    // 指定要监听请求的端口号
    port: '8000',
    // local服务器自动打开浏览器。
    open: true,
    // 当出现编译器错误或警告时，在浏览器中显示全屏遮罩层。默认情况下禁用。
    overlay: false,
    // 浏览器中访问的相对路径
    publicPath: '',
    // 代理配置
    proxy: {
      '/api/': {
        target: 'https://github.com/',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
    // 除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 我们配置 FriendlyErrorsPlugin 来显示错误信息到控制台
    quiet: true,
    // webpack 使用文件系统(file system)获取文件改动的通知。监视文件 https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
});
```

`webpack.prod.js`

```javascript
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  devtool: 'none',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
});
```

配置`scripts`

`package.json`

```json
{
  "scripts": {
    "serve": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

## ESLint

- 最为主流的 JavaScript Lint 工具 监测 JS 代码质量
- ESLint 很容易统一开发者的编码风格
- ESLint 可以帮助开发者提升编码能力

### 安装

```
npm i eslint eslint-loader babel-eslint eslint-plugin-vue eslint-plugin-vue-libs -D
```

### 初始化 eslint 配置

在初始化 eslint 的时候选择 Vue

```
eslint --init
```

### 配置

`webpack.prod.js`

```javascript
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  devtool: 'none',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(js|vue)$/,
        use: { loader: 'eslint-loader' },
        enforce: 'pre',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
});
```

`package.json`

```json
{
  "scripts": {
    "lint": "eslint --ext .vue,.js src --fix"
  }
}
```

### 使用

我在`webpack.prod.js`配置了 eslint 校验，所以每次 build 的时候都会进行 eslint 校验

```
npm run build
```

`package.json`配置了自动修复格式问题

```
npm run lint
```

## [配置文件传送门](https://gitee.com/wuner/wuner-notes/tree/master/docs/fed-e-task-02-02/code/js)
