# 源码结构

[项目 demo](https://gitee.com/Wuner/vue-ssr-demo/tree/build-config/)

## 介绍构建步骤

到目前为止，我们还没有讨论过如何将相同的 Vue 应用程序提供给客户端。为了做到这一点，我们需要使用 webpack 来打包我们的 Vue 应用程序。事实上，我们可能需要在服务器上使用 webpack 打包 Vue 应用程序，因为：

- 通常 Vue 应用程序是由 webpack 和 vue-loader 构建，并且许多 webpack 特定功能不能直接在 Node.js 中运行（例如通过 file-loader 导入文件，通过 css-loader 导入 CSS）。

- 尽管 Node.js 最新版本能够完全支持 ES2015 特性，我们还是需要转译客户端代码以适应老版浏览器。这也会涉及到构建步骤。

所以基本看法是，对于客户端应用程序和服务器应用程序，我们都要使用 webpack 打包 - 服务器需要「服务器 bundle」然后用于服务器端渲染(SSR)，而「客户端 bundle」会发送给浏览器，用于混合静态标记。

![note](./imgs/1.png)

### 使用 webpack 的源码结构

现在我们正在使用 webpack 来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，可以使用 webpack 支持的所有功能。同时，在编写通用代码时，有一些 [事项](https://ssr.vuejs.org/zh/guide/universal.html) 要牢记在心。

一个基本项目可能像是这样：

```
src
├── components
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```

#### app.js

`app.js` 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。`app.js` 简单地使用 export 导出一个 `createApp` 函数：

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:51
 * @description
 */
import Vue from 'vue';
import App from './App.vue';

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  });
  return { app };
}
```

#### entry-client.js:

客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:55
 * @description
 */
import { createApp } from './app';

// 客户端特定引导逻辑……

const { app } = createApp();

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app');
```

#### entry-server.js:

服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:57
 * @description
 */
import { createApp } from './app';

export default (context) => {
  const { app } = createApp();
  return app;
};
```

#### server.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 16:13
 * @description
 */

const Vue = require('vue');
// 第 1 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
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

service.get('/', (req, res) => {
  // 设置响应头，解决中文乱码
  res.setHeader('Content-Type', 'text/html;charset=utf8');

  // 第 3 步：创建一个 Vue 实例
  const app = new Vue({
    template: `
      <div>{{ message }}</div>`,
    data: {
      message: 'Hello World',
    },
  });

  // 第 4 步：将 Vue 实例渲染为 HTML
  renderer.renderToString(app, context, (err, html) => {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    if (err) {
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
