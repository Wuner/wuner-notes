# [路由和代码分割](https://ssr.vuejs.org/zh/guide/routing.html)

接下来我们来了解一下如何处理通用应用中的路由。

官方文档给出的解决方案肯定还是使用 vue-router，整体使用方式和纯客户端的使用方式基本一致，只需要在少许的位置做一些配置就可以了。文档中已经把配置的方式描述的很清楚了，建议大家认真看一下文档，下面我把具体的实现来演示一下。

## 安装依赖

```
yarn add vue-router
```

## src/router/index.js

```javascript
/**
 * ..author Wuner
 * ..date 2020/10/28 8:18
 * ..description 路由
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../view/Home';

Vue.use(VueRouter);

export const createRouter = () => {
  return new VueRouter({
    mode: 'history', // 兼容前后端
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home,
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../view/About'), // 路由懒加载
      },
      {
        path: '*',
        name: 'error404',
        component: () => import('../view/404'),
      },
    ],
  });
};
```

## src/app.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:51
 * @description
 */
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter();
  const app = new Vue({
    router, // 把路由挂载到 Vue 根实例中
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  });
  return { app, router };
}
```

## src/entry-server.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:57
 * @description 服务端配置
 */
import { createApp } from './app';

// async...await
export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router } = createApp();

  // 设置服务器端 router 的位置
  router.push(context.url);

  // 等到 router 将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router));

  return app;
};

// Promise
// export default (context) => {
//   // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
//   // 以便服务器能够等待所有的内容在渲染前，
//   // 就已经准备就绪。
//   return new Promise((resolve, reject) => {
//     const { app, router } = createApp();
//
//     // 设置服务器端 router 的位置
//     router.push(context.url);
//
//     // 等到 router 将可能的异步组件和钩子函数解析完
//     router.onReady(() => {
//       const matchedComponents = router.getMatchedComponents();
//       // 匹配不到的路由，执行 reject 函数，并返回 404
//       if (!matchedComponents.length) {
//         return reject({ code: 404 });
//       }
//
//       // Promise 应该 resolve 应用程序实例，以便它可以渲染
//       resolve(app);
//     }, reject);
//   });
// };
```

## service.js

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

const render = async (req, res) => {
  // 设置响应头，解决中文乱码
  res.setHeader('Content-Type', 'text/html;charset=utf8');

  // 第 3 步：将 Vue 实例渲染为 HTML
  // 这里的Vue实例，使用的是src/entry-server.js 中挂载的Vue实例
  // 这里无需传入Vue实例，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  context.url = req.url; // 将url传递给 entry-server.js
  try {
    const html = await renderer.renderToString(context);
    // 返回HTML, 该html的值 将是注入应用程序内容的完整页面
    res.end(html);
  } catch (err) {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    res.status(500).end('Internal Server Error');
  }
};

// express.static 处理的是物理磁盘中的资源文件
service.use('/dist', express.static('./dist'));
// 服务端路由设置为 *，意味着所有的路由都会进入这里
service.get('*', async (req, res) => {
  await onReady;
  render(req, res);
});

// 绑定并监听指定主机和端口上的连接
service.listen(3000, () =>
  console.log(`service listening at http://localhost:3000`),
);
```

## src/entry-client.js

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 17:55
 * @description 客户端配置
 */
import { createApp } from './app';

// 客户端特定引导逻辑……

const { app, router } = createApp();

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
  app.$mount('#app');
});
```

## App.vue

最后要在 App.vue 根组件中来设置路由的出口，因为没有路由出口的话，匹配到的路由组件就不知道要渲染到哪里。

```vue
<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
    </ul>

    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
```

配置好出口以后，启动应用：

```
yarn start:dev
```

启动成功，访问页面。

测试路由导航，可以看到正常工作，那说明我们同构应用中的路由产生作用了。

现在我们的应用就非常的厉害了，当你首次访问页面的时候，它是通过服务端渲染出来的，服务端渲染拥有了更快的渲染速度以及更好的 SEO，当服务端渲染的内容来到客户端以后被客户端 Vue 结合 Vue Router 激活，摇身一变成为了一个客户端 SPA 应用，之后的页面导航也不需要重新刷新整个页面。这样我们的网站就既拥有了更好的渲染速度，也拥有了更好的用户体验。

除此之外，我们在路由中配置的异步组件（也叫路由懒加载）也是非常有意义，它们会被分割为独立的 chunk（也就是单独的文件），只有在需要的时候才会进行加载。这样就能够避免在初始渲染的时候客户端加载的脚本过大导致激活速度变慢的问题。关于它也可以来验证一下，通过 npm run build 打包构建，我们发现它们确实被分割成了独立的 chunk。然后再来看一下在运行期间这些 chunk 文件是如何加载的。

你会发现除了 app 主资源外，其它的资源也被下载下来了，你是不是要想说：不是应该在需要的时候才加载吗？为什么一上来就加载了。

原因是在页面的头部中的带有 preload 和 prefetch 的 link 标签。

我们期望客户端 JavaScript 脚本尽快加载尽早的接管服务端渲染的内容，让其拥有动态交互能力，但是如果你把 script 标签放到这里的话，浏览器会去下载它，然后执行里面的代码，这个过程会阻塞页面的渲染。

所以看到真正的 script 标签是在页面的底部的。而这里只是告诉浏览器可以去预加载这个资源。但是不要执行里面的代码，也不要影响网页的正常渲染。直到遇到真正的 script 标签加载该资源的时候才会去执行里面的代码，这个时候可能已经预加载好了，直接使用就可以了，如果没有加载好，也不会造成重复加载，所以不用担心这个问题。

而 prefetch 资源是加载下一个页面可能用到的资源，浏览器会在空闲的时候对其进行加载，所以它并不一定会把资源加载出来，而 preload 一定会预加载。所以你可以看到当我们去访问 about 页面的时候，它的资源是通过 prefetch 预取过来的，提高了客户端页面导航的响应速度。

好了，关于同构应用中路由的处理，以及代码分割功能就介绍到这里。
