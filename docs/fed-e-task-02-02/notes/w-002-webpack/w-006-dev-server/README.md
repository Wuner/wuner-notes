# 开发工具

在每次编译代码时，手动运行 npm run build 会显得很麻烦。

webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

- webpack watch mode(webpack 观察模式)
- webpack-dev-server
- webpack-dev-middleware

大多数场景下我们会使用 webpack-dev-server

## 使用 watch mode(观察模式)

你可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。

启动 webpack watch mode

```
webpack --watch
```

如果能够自动刷新浏览器就更好了，因此可以通过 [browser-sync](http://www.browsersync.cn/docs/options/) 实现此功能。

缺点: 每次编译都要读写磁盘

## 使用 webpack-dev-server

webpack-dev-server 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能。

### 安装

```
npm i webpack-dev-server -D
```

webpack.config.js

```javascript
module.exports = {
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

webpack-dev-server 具有许多可配置的选项。关于其他更多配置，请查看[配置文档](https://webpack.docschina.org/configuration/dev-server/)

> [模块热替换(hot module replacement)](https://webpack.docschina.org/guides/hot-module-replacement/)

## [使用 webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware)
