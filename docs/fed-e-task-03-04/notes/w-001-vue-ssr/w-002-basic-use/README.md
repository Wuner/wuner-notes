# Vue SSR 基本使用

[项目 demo](https://gitee.com/Wuner/vue-ssr-demo/tree/base-use/)

## 安装

### yarn

```
yarn add vue vue-server-renderer
```

### npm

```
npm i vue vue-server-renderer
```

:::warning 注意

- 推荐使用 Node.js 版本 6+。
- vue-server-renderer 和 vue 必须匹配版本。
- vue-server-renderer 依赖一些 Node.js 原生模块，因此只能在 Node.js 中使用。我们可能会提供一个更简单的构建，可以在将来在其他「JavaScript 运行时(runtime)」运行。

:::

## 渲染一个 Vue 实例

`server.js`

```js
/**
 * @author Wuner
 * @date 2020/9/8 16:13
 * @description
 */

const Vue = require('vue');

// 第 1 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer();

// 第 2 步：创建一个 Vue 实例
const app = new Vue({
  template: `<div>{{ message }}</div>`,
  data: {
    message: 'Hello World',
  },
});

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err;
  console.log(html);
  // => <div data-server-rendered="true">Hello World</div>
});

// 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
renderer
  .renderToString(app)
  .then((html) => {
    console.log(html);
  })
  .catch((err) => {
    console.error(err);
  });
```

## 与服务器集成

在 Node.js 服务器中使用时相当简单直接，例如 [Express](https://expressjs.com/) ：

### 安装 express

#### yarn

```
yarn add express
```

#### npm

```
npm i express
```

在 Web 服务中渲染 Vue 实例：

```javascript
/**
 * @author Wuner
 * @date 2020/9/8 16:13
 * @description
 */

const Vue = require('vue');
// 第 1 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer();
// 第2步：创建 service
const service = require('express')();

service.get('/', (req, res) => {
  // 第 3 步：创建一个 Vue 实例
  const app = new Vue({
    template: `
      <div>{{ message }}</div>`,
    data: {
      message: 'Hello World',
    },
  });

  // 第 4 步：将 Vue 实例渲染为 HTML
  renderer.renderToString(app, (err, html) => {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    if (err) {
      res.status(500).end('Internal Server Error');
      return;
    }

    // 返回HTML
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `);
  });
});

// 绑定并监听指定主机和端口上的连接
service.listen(3000, () =>
  console.log(`service listening at http://localhost:3000`),
);
```

启动服务

```
node service.js
```

此时可以看到页面展示着 Hello World

不过使用中文时，会出现中文乱码

### 如何解决中文乱码

- meta 设置编码字符集为 utf-8

```js
// 返回HTML
res.end(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Hello</title>
      <meta charset="UTF-8" />
    </head>
    <body>${html}</body>
  </html>
`);
```

- 设置服务端响应头

```javascript
// 设置响应头，解决中文乱码
res.setHeader('Content-Type', 'text/html;charset=utf8');
```

## 使用一个页面模板

当你在渲染 Vue 应用程序时，renderer 只从应用程序生成 HTML 标记 (markup)。在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。

为了简化这些，你可以直接在创建 renderer 时提供一个页面模板。多数时候，我们会将页面模板放在特有的文件中，例如 index.template.html：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

::: warning 注意

`<!--vue-ssr-outlet-->` 注释 -- 这里将是应用程序 HTML 标记注入的地方。

:::

然后，我们可以读取和传输文件到 Vue renderer 中：

```javascript
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
});

// 返回HTML, 该html的值 将是注入应用程序内容的完整页面
res.end(html);
```

### 模板插值

模板还支持简单插值。给定如下模板：

```html
<html>
  <head>
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>

    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

我们可以通过传入一个"渲染上下文对象"，作为 renderToString 函数的第二个参数，来提供插值数据：

```javascript
const context = {
  title: 'vue ssr demo',
  metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

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
```

也可以与 Vue 应用程序实例共享 context 对象，允许模板插值中的组件动态地注册数据。

此外，模板支持一些高级特性，例如：

- 在使用 \*.vue 组件时，自动注入「关键的 CSS(critical CSS)」；
- 在使用 clientManifest 时，自动注入「资源链接(asset links)和资源预加载提示(resource hints)」；
- 在嵌入 Vuex 状态进行客户端融合(client-side hydration)时，自动注入以及 XSS 防御。

## 完整实例代码

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
