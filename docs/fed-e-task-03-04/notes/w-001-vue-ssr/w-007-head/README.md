# [管理页面 Head](https://ssr.vuejs.org/zh/guide/head.html)

[项目 demo](https://gitee.com/Wuner/vue-ssr-demo/tree/ssr-head/)

无论是服务端渲染还是客户端渲染，它们都使用的同一个页面模板。

页面中的 body 是动态渲染出来的，但是页面的 head 是写死的，也就说我们希望不同的页面可以拥有自己的 head 内容，例如页面的 title、meta 等内容，所以下面我们来了解一下如何让不同的页面来定制自己的 head 头部内容。

官方文档这里专门描述了关于页面 Head 的处理，相对于来讲更原生一些，使用比较麻烦。

这里主要给大家介绍一个第三方解决方案：[vue-meta](https://github.com/nuxt/vue-meta)

Vue Meta 是一个支持 SSR 的第三方 Vue.js 插件，可让你轻松的实现不同页面的 head 内容管理。

使用它的方式非常简单，而只需在页面组件中使用 metaInfo 属性配置页面的 head 内容即可。

## 安装依赖

```
yarn add vue-meta -D
```

## src/app.js

在通用入口中通过插件的方式将 vue-meta 注册到 Vue 中。

```javascript
import VueMeta from 'vue-meta';

Vue.use(VueMeta);

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s - vue-ssr-demo',
  },
});
```

## src/entry-server.js

在服务端渲染入口模块中适配 vue-meta

```javascript
context.meta = app.$meta();
```

## index.template.html

在模板页面中注入 meta 信息

```
{{{ meta.inject().title.text() }}}
{{{ meta.inject().meta.text() }}}
```

## 配置 Vue

直接在组件中使用即可

### src/view/Home.vue

```vue
metaInfo: { title: '首页', }
```

### src/view/About.vue

```vue
metaInfo: { title: '关于', }
```

关于使用 vue-meta 管理页面 Head 我们就介绍这些，大家可以根据自己的需求，多查阅文档，灵活使用即可。
