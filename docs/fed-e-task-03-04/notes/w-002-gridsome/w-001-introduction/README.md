# 介绍

## Gridsome 是什么

- Gridsome 是由 Vue.js 驱动的 Jamstack 框架，用于构建默认情况下快速生成的静态生成的网站和应用。

- Gridsome 是 Vue 提供支持的静态站点生成器，用于为任何无头 CMS，本地文件或 API 构建可用于 CDN 的网站

- 使用 Vue.js，webpack 和 Node.js 等现代工具构建网站。通过 npm 进行热重载并访问任何软件包，并使用自动前缀在您喜欢的预处理器（如 Sass 或 Less）中编写 CSS。

- 基于 Vue.js 的 Jamstack 框架

- Gridsome 使开发人员可以轻松构建默认情况下快速生成的静态生成的网站和应用程序

- Gridsome 允许在内容里面引用任何 CMS 或数据源。从 WordPress，Contentful 或任何其他无头 CMS 或 API 中提取数据，并在组件和页面中使用 GraphQL 访问它。

## 为什么选择 Gridsome

- 用于前端的 Vue.js——最简单，最容易理解的前端框架。

- 数据来源——使用任何 Headless CMS，API 或 Markdown 文件存储数据。

- 通过热重载进行本地开发——实时查看代码更改。

- 基于文件的页面路由——在`src/pages`中的任何 `Name.vue` 文件都是静态路由。

- 动态路由——在`src/pages`中的任何 `[param].vue` 文件都是动态路由。

- 静态文件生成——可部署到 CDN 或静态 Web 主机。

- GraphQL 数据层——具有集中式数据层的简单数据管理。

- 自动代码拆分——将超高性能构建到每个页面中。

- 插件生态系统——生态圈完善。

## 什么是 Jamstack

Gridsome 是一个 Jamstack 框架。 Jamstack 使您可以通过预渲染文件并直接从 CDN 直接提供文件来构建快速安全的站点和应用程序，而无需管理或运行 Web 服务器。

[Learn more about the Jamstack](https://gridsome.org/docs/jamstack).

## 它是如何工作的

Gridsome 生成静态 HTML，一旦加载到浏览器中，该 HTML 就会渗入 Vue SPA。这意味着您可以使用 Gridsome 构建静态网站和动态应用程序。

Gridsome 为每个页面构建一个.html 文件和一个.json 文件。加载第一页后，它仅使用.json 文件来预取和加载下一页的数据。它还为需要它的每个页面构建一个.js 包（代码拆分）。

它使用 vue-router 进行 SPA 路由，并使用 vue-meta 来管理`<head>`。

Gridsome 默认添加最小 57kB 的 gzip JS 捆绑包大小（vue.js，vue-router，vue-meta 和一些用于图像延迟加载的文件）。

[详细了解其工作原理](https://gridsome.org/docs/how-it-works)

## 预备知识

您应该具有有关 HTML，CSS，[Vue.js](https://cn.vuejs.org/) 以及如何使用[终端](https://www.linode.com/docs/guides/using-the-terminal/) 的基本知识。了解 [GraphQL](https://www.graphql.com/) 的工作原理是有好处的，但不是必需的。 Gridsome 是学习它的好方法。

Gridsome 需要 [Node.js](https://nodejs.org/zh-cn/) （v8.3 +），并建议使用 [Yarn](https://yarnpkg.com/) 。

## 备选方案

- [VuePress](https://vuepress.vuejs.org/)
- [Nuxt](https://nuxtjs.org/)
- [Gatsby.js](https://www.gatsbyjs.org/)

## 使用场景

- 不适合管理系统
- 简单页面展示
- 想要有更好的 SEO
- 想要有更好的渲染性能
