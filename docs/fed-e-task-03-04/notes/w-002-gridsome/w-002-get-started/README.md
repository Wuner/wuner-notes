# 起步

快速了解 Gridsome 项目

## 安装 Gridsome CLI 工具

### 使用 YARN

```
yarn global add @gridsome/cli
```

### 使用 NPM

```
npm install --global @gridsome/cli
```

### 查看是否安装成功

```
gridsome -v
```

## 创建一个 Gridsome 项目

### 创建一个新项目

```
gridsome create my-gridsome-site
```

#### 创建失败时

> gridsome 项目安装依赖注意事项：
>
> - 配置 node-gyp 编译环境
>
>   - https://github.com/nodejs/node-gyp
>
> - 配置环境变量：
>   - https://sharp.pixelplumbing.com/install#chinese-mirror
>     - `npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"`
>     - `npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"`
> - 配置 hosts：`199.232.68.133 raw.githubusercontent.com`
>   - https://www.ipaddress.com/

### 打开文件夹

```
cd my-gridsome-site
```

### 启动开发模式

```
yarn develop
```

或

```
npm run develop
```

或

```
gridsome develop
```

## [目录结构](https://gridsome.org/docs/directory-structure/)

```bash
.
├── src
│   ├── components # 公共组件
│   ├── layouts # 布局组件
│   ├── pages # 页面路由组件
│   ├── templates # 模板文件
│   ├── favicon.png # 网站图标
│   └── main.js # 应用入口
├── static # 静态资源存储目录，该目录中的资源不做构建处理
├── README.md
├── gridsome.config.js # 应用配置文件
├── gridsome.server.js # 针对服务端的配置文件
├── package-lock.json
└── package.json
```

## 创建路由

在 `src/pages` 目录中创建一个 `.vue` 文件

## 构建

```
yarn build
```

构建结果默认输出到 `dist` 目录中。

Gridsome 会把每个路由文件构建为独立的 HTML 页面。

## 部署

可以把构建结果 `dist` 放到任何 Web 服务器中进行部署。

例如我们这里使用 Node.js 命令行工具 [serve](https://github.com/vercel/serve) 来测试构建结果。

或者可以部署到其它第三方托管平台：https://gridsome.org/docs/deployment/。

或是自己的服务器，都可以！

### 全局安装 serve

```
yarn add global serve
```

### 启动

```
serve dist
```

## 核心概念

学习 Gridsome 的核心概念

### Pages

通过在 `src/pages` 文件夹中添加 Vue 组件来创建页面。他们使用基于文件的路由系统。例如，`src/pages/About.vue` 将是 `mywebsite.com/about/`。页面用于简单页面和列出集合的页面（例如`/blog/`）。

[了解有关页面的更多信息](https://gridsome.org/docs/pages/)

### Collections

如果您要在网站上放置博客文章，标签，产品等，则收藏很有用。可以使用 [Source 插件](https://gridsome.org/plugins) 或 [Data Store API](https://gridsome.org/docs/data-store-api/) 从任何 Headless CMS，内容 API 或 Markdown 文件中获取集合。

![notes](./imgs/1.png)

集合存储在临时的本地 GraphQL 数据层中，可以在任何地方查询，过滤，分页或有关系。

### Templates

模板负责显示集合的节点（单个页面）。模板通常位于 `src/templates` 中。如果未在模板配置中指定组件，则 Gridsome 尝试查找与集合名称相同的文件。

这是一个例子：

```html
<!-- src/templates/Post.vue -->
<template>
  <Layout>
    <h1 v-html="$page.post.title" />
  </Layout>
</template>

<page-query>
  query ($id: ID!) { post(id: $id) { title } }
</page-query>
```

[更多关于 Templates 的内容](https://gridsome.org/docs/templates/)

### Layouts

布局是在页面和模板内部用于包装内容的 Vue 组件。布局通常包含页眉和页脚。

页面中通常按以下方式使用布局：

```html
<template>
  <Layout>
    <h1>About us</h1>
  </Layout>
</template>

<script>
  import Layout from '~/layouts/Default.vue';

  export default {
    components: {
      Layout,
    },
  };
</script>
```

:::tip

> 也可以在全球范围内使用布局，因此您无需每页导入它们。
>
> 请注意，Gridsome CLI 创建的默认模板将使用全局布局组件。

:::

更多关于 Layouts 的内容：https://gridsome.org/docs/layouts/。

### Images

Gridsome 具有内置的 `<g-image>` 组件，可输出优化的逐行图像。如果更改宽度和高度，则在开发时还可以实时调整大小和裁剪。 `<g-images>` 创建一个超小型模糊的嵌入式 base64 图像，然后在视图中使用 IntersectionObserver 延迟加载图像。

更多关于 Images 的内容：https://gridsome.org/docs/images/。

### Linking

Gridsome 具有内置的 `<g-link>` 组件，该组件在查看链接时使用 IntersectionObserver 来预取链接的页面。这使得在 Gridsome 站点中浏览非常快，因为单击的页面已经下载。

更多关于 `<g-link>` 的内容：https://gridsome.org/docs/linking/。

## 部署

> https://gridsome.org/docs/deployment/
