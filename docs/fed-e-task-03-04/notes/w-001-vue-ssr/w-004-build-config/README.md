# 构建配置

## 安装依赖

### 安装生产依赖

#### yarn

```
yarn add vue vue-server-renderer express cross-env
```

#### npm

```
npm i vue vue-server-renderer express cross-env
```

| 包                  | 说明                                |
| ------------------- | ----------------------------------- |
| vue                 | Vue.js 核心库                       |
| vue-server-renderer | Vue 服务端渲染工具                  |
| express             | 基于 Node 的 Web 服务框架           |
| cross-env           | 通过 npm scripts 设置跨平台环境变量 |

### 安装开发依赖

#### yarn

```
yarn add webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin -D
```

#### npm

```cmd
npm i webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin -D
```

| 包                                                                                        | 说明                                   |
| ----------------------------------------------------------------------------------------- | -------------------------------------- |
| webpack                                                                                   | webpack 核心包                         |
| webpack-cli                                                                               | webpack 的命令行工具                   |
| webpack-merge                                                                             | webpack 配置信息合并工具               |
| webpack-node-externals                                                                    | 排除 webpack 中的 Node 模块            |
| rimraf                                                                                    | 基于 Node 封装的一个跨平台 rm -rf 工具 |
| friendly-errors-webpack-plugin                                                            | 友好的 webpack 错误提示                |
| @babel/core <br> @babel/plugin-transform-runtime <br> @babel/preset-env <br> babel-loader | Babel 相关工具                         |
| vue-loader <br> vue-template-compiler                                                     | 处理 .vue 资源                         |
| file-loader                                                                               | 处理字体资源                           |
| css-loader                                                                                | 处理 CSS 资源                          |
| url-loader                                                                                | 处理图片资源                           |

## 配置文件及打包命令

```
build
├── webpack.base.config.js # 公共配置
├── webpack.client.config.js # 客户端打包配置文件
└── webpack.server.config.js # 服务端打包配置文件
```

### 公共配置

webpack.base.config.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/25 12:10
 * @description 公共配置
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const resolve = (file) => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('../dist/'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      // 路径别名，@ 指向 src
      '@': resolve('../src/'),
    },
    // 可以省略的扩展名
    // 当省略扩展名的时候，按照从前往后的顺序依次解析
    extensions: ['.js', '.vue', '.json'],
  },
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      // 处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // 处理 CSS 资源
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/preprocessors.html
      // 例如处理 Less 资源
      // {
      // test: /\.less$/,
      // use: [
      // 'vue-style-loader',
      // 'css-loader',
      // 'less-loader'
      // ]
      // },
    ],
  },
  plugins: [new VueLoaderPlugin(), new FriendlyErrorsWebpackPlugin()],
};
```

### 客户端打包配置文件

webpack.client.config.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/25 12:15
 * @description 客户端打包配置文件
 */
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js',
  },
  module: {
    rules: [
      // ES6 转 ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity,
    },
  },
  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
  ],
});
```

### 服务端打包配置文件

webpack.server.config.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/25 12:17
 * @description 服务端打包配置文件
 */
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config.js');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',
  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  output: {
    filename: 'server-bundle.js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2',
  },
  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [
    nodeExternals({
      // 白名单中的资源依然正常打包
      allowlist: [/\.css$/],
    }),
  ],
  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
  ],
});
```

### 配置打包命令

package.json

```json
{
  "scripts": {
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
    "build": "rimraf dist && npm run build:client && npm run build:server"
  }
}
```

### 测试编译

#### 编译服务端

```
yarn build:server
```

#### 编译客户端

```
yarn build:client
```

#### 同时编译服务端和客户端

```
yarn build
```

### 启动应用

`service.js`

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 16:13
 * @description
 */

const express = require('express');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const template = require('fs').readFileSync('./index.template.html', 'utf-8');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const { createBundleRenderer } = require('vue-server-renderer');

// 第 1 步：创建一个 renderer
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
  template, // （可选）页面模板
  clientManifest, // （可选）客户端构建 manifest
});
// 第2步：创建 service
const service = require('express')();

const context = {
  title: 'vue ssr demo',
  metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};
service.use('/dist', express.static('./dist'));
service.get('/', (req, res) => {
  // 设置响应头，解决中文乱码
  res.setHeader('Content-Type', 'text/html;charset=utf8');

  // 第 3 步：将 Vue 实例渲染为 HTML
  // 这里的Vue实例，使用的是src/entry-server.js 中挂载的Vue实例
  // 这里无需传入Vue实例，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  renderer.renderToString(context, (err, html) => {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    if (err) {
      console.log(err);
      res.status(500).end('Internal Server Error');
      return;
    }

    // 返回HTML, 该html的值 将是注入应用程序内容的完整页面
    res.end(html);
  });
});

// 绑定并监听指定主机和端口上的连接
service.listen(3000, () =>
  console.log(`service listening at http://localhost:3000`),
);
```

### 解析渲染流程

#### 服务端渲染

- renderer.renderToString 渲染了什么？

  - [renderer.renderToString](https://ssr.vuejs.org/zh/api/#renderer-rendertostring) 将 bundle 渲染为字符串。

- renderer 是如何拿到 entry-server 模块的？

  - const renderer = createBundleRenderer(serverBundle, { /\* 选项 \*/ })

- serverBundle(vue-ssr-server-bundle.json) 是 Vue SSR 构建的一个特殊的 JSON 文件

  - entry：入口

  - files：所有构建结果资源列表

  - maps：源代码 source map 信息

- vue-ssr-server-bundle.json 就是通过 server.entry.js 构建出来的结果文件

- 最终把渲染结果注入到模板中

#### 客户端渲染

- vue-ssr-client-manifest.json

- publicPath：访问静态资源的根相对路径，与 webpack 配置中的 publicPath 一致

- all：打包后的所有静态资源文件路径

- initial：页面初始化时需要加载的文件，会在页面加载时配置到 preload 中

- async：页面跳转时需要加载的文件，会在页面加载时配置到 prefetch 中

- modules：项目的各个模块包含的文件的序号，对应 all 中文件的顺序；moduleIdentifier 和 和 all 数组中文件的映射关系（modules 对象是我们查找文件引用的重要数据）

### 热更新构建

`service.js`

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 16:13
 * @description
 */

const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');

const createServer = require('./build/create-server');

// 第 1 步：创建一个 renderer
let renderer;
let onReady;
// 第2步：创建 service
const service = require('express')();

onReady = createServer(
  service,
  (serverBundle, options) =>
    (renderer = createBundleRenderer(serverBundle, options)),
);
const context = {
  title: 'vue ssr demo',
  metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

const render = (req, res) => {
  // 设置响应头，解决中文乱码
  res.setHeader('Content-Type', 'text/html;charset=utf8');

  // 第 3 步：将 Vue 实例渲染为 HTML
  // 这里的Vue实例，使用的是src/entry-server.js 中挂载的Vue实例
  // 这里无需传入Vue实例，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  renderer.renderToString(context, (err, html) => {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    if (err) {
      console.error(err);
      res.status(500).end('Internal Server Error');
      return;
    }

    // 返回HTML, 该html的值 将是注入应用程序内容的完整页面
    res.end(html);
  });
};
service.use('/dist', express.static('./dist'));
service.get('/', async (req, res) => {
  await onReady;
  render(req, res);
});

// 绑定并监听指定主机和端口上的连接
service.listen(3000, () =>
  console.log(`service listening at http://localhost:3000`),
);
```

`build/create-server.js`

```javascript
/**
 * @author Wuner
 * @date 2020/9/27 11:46
 * @description 异步创建
 */

const chokidar = require('chokidar');
const isProd = process.env.NODE_ENV === 'production';
const { readFileSync } = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = (filePath) => path.join(__dirname, filePath);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((resolve) => (ready = resolve));
  let templatePath = path.resolve(__dirname, '../index.template.html');
  let serverBundlePath = path.resolve(
    __dirname,
    '../dist/vue-ssr-server-bundle.json',
  );
  let clientManifestPath = path.resolve(
    __dirname,
    '../dist/vue-ssr-client-manifest.json',
  );
  let serverBundle, template, clientManifest;

  const update = () => {
    // 构建完毕，通知 server 可以 render 渲染了
    if (serverBundle && template && clientManifest) {
      ready();
      // 更新 server 中的 Renderer
      callback(serverBundle, {
        runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
        template, // （可选）页面模板
        clientManifest, // （可选）客户端构建 manifest
      });
    }
  };

  // 开发模式
  // 打包构建（客户端 + 服务端） -> 创建渲染器
  // 监视构建 template，调用 update -> 更新 Renderer

  // 监视构建 serverBundle，调用 update -> 更新 Renderer

  // 监视构建 clientManifest，调用 update -> 更新 Renderer

  return onReady;
};
```

#### 更新模板

- 可以使用 node 原生 api 监听文件变更
  - fs.watch
  - fs.watchFile
- 可以使用第三方包，监听文件变更
  - chokidar

原生的 api 有点缺陷，这里我们使用第三方包

```
yarn add chokidar -D
```

```javascript
// 监视构建 template，调用 update -> 更新 Renderer
template = readFileSync(templatePath, 'utf-8');
update();
chokidar.watch(templatePath).on('change', (event, path) => {
  template = readFileSync(templatePath, 'utf-8');
  console.log(event, path);
});
```

#### 更新服务端打包

##### 使用磁盘读写

使用磁盘读写时，在开发环境下，会时常更新文件，这将导致频繁读写磁盘，效率低下。

```javascript
// 监视构建 serverBundle，调用 update -> 更新 Renderer
const serverConfig = require('./webpack.server.config');
const serverCompiler = webpack(serverConfig);
serverCompiler.watch({}, (err, status) => {
  if (err) throw err;
  if (status.hasErrors()) return false;
  // 这里不要使用require读取文件，require读取出来的内容会有缓存，失去了更新的意义
  const serverBundle = JSON.parse(
    readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'),
  );
  update();
```

##### 使用内存读写

- [webpack 英文官方文档](https://webpack.js.org/api/node/#custom-file-systems) (推荐)
- [webpack 中文官方文档](https://www.webpackjs.com/api/node/#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F-custom-file-systems-) (不是最新)

默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘。但是，还可以使用不同类型的文件系统（内存(memory), webDAV 等）来更改输入或输出行为。为了实现这一点，可以改变 inputFileSystem 或 outputFileSystem。例如，可以使用 [memfs](https://github.com/streamich/memfs) 替换默认的 outputFileSystem，以将文件写入到内存中，而不是写入到磁盘。

```javascript
const { createFsFromVolume, Volume } = require('memfs');
const webpack = require('webpack');

const fs = createFsFromVolume(new Volume());
const compiler = webpack({
  /* options */
});

compiler.outputFileSystem = fs;
compiler.run((err, stats) => {
  // Read the output later:
  const content = fs.readFileSync('...');
});
```

由于 memfs 配置相对麻烦，我们这里使用官方提供的 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 插件

```
yarn add webpack-dev-middleware -D
```

```javascript
// 内存读写
const { fileSystem } = middleware(serverCompiler, {
  logLevel: 'silent', // 关闭日志输出
});
serverCompiler.hooks.done.tap('serverCompiler', () => {
  serverBundle = JSON.parse(
    fileSystem.readFileSync(
      resolve('../dist/vue-ssr-server-bundle.json'),
      'utf-8',
    ),
  );
  update();
});
```

#### 更新客户端打包

```javascript
// 监视构建 clientManifest，调用 update -> 更新 Renderer
const clientConfig = require('./webpack.client.config');
const clientCompiler = webpack(clientConfig);
const clientMiddleware = middleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  logLevel: 'silent', // 关闭日志输出
});
clientCompiler.hooks.done.tap('clientCompiler', () => {
  clientManifest = JSON.parse(
    clientMiddleware.fileSystem.readFileSync(
      resolve('../dist/vue-ssr-client-manifest.json'),
      'utf-8',
    ),
  );
  update();
});

// !!!将 clientMiddleware挂载到express服务中，提供对其内部内存中的数据的访问
server.use(clientMiddleware);
```

#### 热更新

热更新功能需要使用到 [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) 工具包。

```
yarn add webpack-hot-middleware -D
```

```javascript
// 热更新配置
clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
clientConfig.entry.app = [
  'webpack-hot-middleware/client?reload=true&quiet=true', // 和服务端交互处理热更新一个客户端脚本
  clientConfig.entry.app,
];
clientConfig.output.filename = '[name].js';

server.use(
  hotMiddleware(clientCompiler, {
    log: false, // 关闭日志输出
  }),
);
```

工作原理：

- 中间件将自身安装为 webpack 插件，并侦听编译器事件。
- 每个连接的客户端都有一个 Server Sent Events 连接，服务器将在编译器事件上向连接的客户端发布通知。
  - [MDN - 使用服务器发送事件](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)
  - [Server-Sent Events 教程](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
- 当客户端收到消息时，它将检查本地代码是否为最新。如果不是最新版本，它将触发 webpack 热模块重新加载。

#### 完整配置

`build/create-server.js`

```javascript
/**
 * @author Wuner
 * @date 2020/9/27 11:46
 * @description 异步创建
 */

const chokidar = require('chokidar');
const isProd = process.env.NODE_ENV === 'production';
const { readFileSync } = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = (filePath) => path.join(__dirname, filePath);
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((resolve) => (ready = resolve));
  let templatePath = path.resolve(__dirname, '../index.template.html');
  let serverBundlePath = path.resolve(
    __dirname,
    '../dist/vue-ssr-server-bundle.json',
  );
  let clientManifestPath = path.resolve(
    __dirname,
    '../dist/vue-ssr-client-manifest.json',
  );
  let serverBundle, template, clientManifest;

  const update = () => {
    // 构建完毕，通知 server 可以 render 渲染了
    if (serverBundle && template && clientManifest) {
      ready();
      // 更新 server 中的 Renderer
      callback(serverBundle, {
        runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
        template, // （可选）页面模板
        clientManifest, // （可选）客户端构建 manifest
      });
    }
  };

  if (isProd) {
    serverBundle = require(serverBundlePath);
    template = readFileSync(templatePath, 'utf-8');
    clientManifest = require(clientManifestPath);
    // 生产模式，直接基于已构建好的包创建渲染器
    update();
  } else {
    // 开发模式
    // 打包构建（客户端 + 服务端） -> 创建渲染器
    // 监视构建 template，调用 update -> 更新 Renderer
    template = readFileSync(templatePath, 'utf-8');
    update();
    chokidar.watch(templatePath).on('change', (event, path) => {
      template = readFileSync(templatePath, 'utf-8');
      console.log(event, path);
    });
    // 监视构建 serverBundle，调用 update -> 更新 Renderer
    const serverConfig = require('./webpack.server.config');
    const serverCompiler = webpack(serverConfig);
    // 磁盘读写方式
    // serverCompiler.watch({}, (err, status) => {
    //   if (err) throw err;
    //   if (status.hasErrors()) return false;
    //   // 这里不要使用require读取文件，require读取出来的内容会有缓存，失去了更新的意义
    //   serverBundle = JSON.parse(
    //     readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'),
    //   );
    //   console.log(serverBundle);
    //   update();
    // });

    // 内存读写
    const { fileSystem } = middleware(serverCompiler, {
      logLevel: 'silent', // 关闭日志输出
    });
    serverCompiler.hooks.done.tap('serverCompiler', () => {
      serverBundle = JSON.parse(
        fileSystem.readFileSync(
          resolve('../dist/vue-ssr-server-bundle.json'),
          'utf-8',
        ),
      );
      update();
    });

    // 监视构建 clientManifest，调用 update -> 更新 Renderer
    const clientConfig = require('./webpack.client.config');
    // 热更新配置
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    clientConfig.entry.app = [
      'webpack-hot-middleware/client?reload=true&quiet=true', // 和服务端交互处理热更新一个客户端脚本
      clientConfig.entry.app,
    ];
    clientConfig.output.filename = '[name].js';

    const clientCompiler = webpack(clientConfig);
    const clientMiddleware = middleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      logLevel: 'silent', // 关闭日志输出
    });
    clientCompiler.hooks.done.tap('clientCompiler', () => {
      clientManifest = JSON.parse(
        clientMiddleware.fileSystem.readFileSync(
          resolve('../dist/vue-ssr-client-manifest.json'),
          'utf-8',
        ),
      );
      update();
    });

    // !!!将 clientMiddleware挂载到express服务中，提供对其内部内存中的数据的访问
    server.use(clientMiddleware);

    // 热更新配置
    server.use(
      hotMiddleware(clientCompiler, {
        log: false, // 关闭日志输出
      }),
    );
  }

  return onReady;
};
```
