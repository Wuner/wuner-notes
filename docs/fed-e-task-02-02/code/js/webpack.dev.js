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
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      index: 'index.html',
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
