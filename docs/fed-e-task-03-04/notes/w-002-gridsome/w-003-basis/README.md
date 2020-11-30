# Gridsome 基础

## 目录结构

```shell
.
├── package.json # 包说明文件
├── gridsome.config.js # Gridsome 配置文件
├── gridsome.server.js # 自定义 Gridsome 编译
├── static/ # 静态资源存储目录，该目录中的资源不做构建处理
└── src/
    ├── main.js # 应用入口
    ├── index.html # 公共页面
    ├── App.vue # 根组件
    ├── layouts/ # 布局组件
    │   └── Default.vue
    ├── pages/ # 路由页面
    │   ├── Index.vue
    │   └── Blog.vue
    └── templates/ # 模板
        └── BlogPost.vue
```

## 项目配置

Gridsome 需要 gridsome.config.js 才能工作。插件和项目设置位于此处。基本配置文件如下所示:

```js
module.exports = {
  siteName: 'Gridsome',
  siteUrl: 'https://www.gridsome.org',
  plugins: [],
};
```

| 属性                     | 类型               | 默认值                | 说明                                                                                                                                                                                                                                                |
| ------------------------ | ------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| siteName                 | string             | `<dirname>`           | 该名称通常在标题标签中使用。                                                                                                                                                                                                                        |
| siteDescription          | string             | `''`                  | 页面描述，`<meta name="description" content="xxx">`                                                                                                                                                                                                 |
| pathPrefix               | string             | `''`                  | Gridsome 假定您的项目是从域的根目录提供的。如果您的项目将托管在名为 my-app 的子目录中，则将此选项更改为“ / my-app”。                                                                                                                                |
| titleTemplate            | string             | `%s - <siteName>`     | 设置标题标签的模板。 ％s 占位符将替换为您在页面中设置的 metaInfo 的标题。                                                                                                                                                                           |
| plugins                  | Array              | `[]`                  | 通过将插件添加到 plugins 数组来激活插件。                                                                                                                                                                                                           |
| templates                | object             | `{}`                  | 定义 collections 的路由和模板。                                                                                                                                                                                                                     |
| metadata                 | object             | `{}`                  | 将全局元数据添加到 GraphQL 模式。                                                                                                                                                                                                                   |
| icon                     | string \| object   | `'./src/favicon.png'` | Gridsome 默认情况下会将位于 src / favicon.png 的任何图像用作 favicon 和 touchicon，但您可以定义其他路径或大小等。图标应为正方形且至少 16 个像素。网站图标将调整为 16、32、96 像素。默认情况下，触摸图标的大小将调整为 76、152、120、167、180 像素。 |
| configureWebpack         | object \| Function |                       | 如果该选项是一个对象，它将与内部配置合并。                                                                                                                                                                                                          |
| chainWebpack             | Function           |                       | 该函数将接收由 webpack-chain 驱动的 ChainableConfig 实例。                                                                                                                                                                                          |
| runtimeCompiler          | boolean            | false                 | 在运行时包括 Vue 模板编译器。                                                                                                                                                                                                                       |
| configureServer          | Function           |                       | 配置开发服务器。                                                                                                                                                                                                                                    |
| permalinks.trailingSlash | boolean            | true                  | 默认情况下，在页面和模板后添加斜杠。启用此选项后，具有动态路由的页面将不包含尾部斜杠，并且服务器上必须具有额外的重写规则才能正常工作。另外，`<g-link>`的静态路径不会自动包含尾部斜杠，而应包含在路径中:                                             |
| permalinks.slugify       |                    |                       | 使用自定义的 Slugify 方法。默认是 [@sindresorhus/slugify](https://github.com/sindresorhus/slugify)                                                                                                                                                  |
| css.split                | boolean            | false                 | 将 CSS 分成多个块。默认情况下禁用拆分。拆分 CSS 可能会导致奇怪的行为。                                                                                                                                                                              |
| css.loaderOptions        | Object             | {}                    | 将选项传递给与 CSS 相关的 loader                                                                                                                                                                                                                    |
| host                     | string             | localhost             |                                                                                                                                                                                                                                                     |
| port                     | number             | 8080                  |                                                                                                                                                                                                                                                     |
| outputDir                | string             | `‘dist’`              | 运行 gridsome 构建时将在其中生成生产构建文件的目录。                                                                                                                                                                                                |

插件示例:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/**/*.md',
        route: '/blog/:year/:month/:day/:slug',
        typeName: 'Post',
      },
    },
  ],
};
```

注意事项:

- 开发过程中修改配置需要重启服务

## Pages 页面

页面负责在 URL 上显示您的数据。每个页面将静态生成，并具有自己的带有标记的 index.html 文件。

在 Gridsome 中创建页面有两种选择:

- 单文件组件
- 使用 Pages API 以编程方式创建页面

### pages 中的单文件组件

`src/pages` 目录中的单文件组件将自动具有其自己的 URL。文件路径用于生成 URL，以下是一些基本示例:

- `src/pages/Index.vue` becomes `/`_(The frontpage)_
- `src/pages/AboutUs.vue` becomes `/about-us/`
- `src/pages/about/Vision.vue` becomes `/about/vision/`
- `src/pages/blog/Index.vue` becomes `/blog/`

> 大小自动转小写，驼峰命名会自动使用短横杠分割

src/pages 中的页面通常用于诸如 /about/ 之类的固定 URL，或用于在 /blog/ 等处列出博客文章。

### 使用 Pages API 创建页面

可以使用 `gridsome.server.js` 中的 `createPages` 钩子以编程方式创建页面。如果您要从外部 API 手动创建页面而不使用 GraphQL 数据层，则此功能很有用。

```js
module.exports = function (api) {
  api.createPages(({ createPage }) => {
    createPage({
      path: '/my-page',
      component: './src/templates/MyPage.vue',
    });
  });
};
```

### 动态路由

动态路由对于仅需要客户端路由的页面很有用。例如，根据 URL 中的细分从生产环境中的外部 API 获取信息的页面。

#### 通过文件创建动态路由

动态页面用于客户端路由。可以通过将名称包装在方括号中来将路由参数放置在文件和目录名称中。例如:

- `src/pages/user/[id].vue` becomes `/user/:id`.
- `src/pages/user/[id]/settings.vue` becomes `/user/:id/settings`.

注意事项:

- 在构建时，这将生成 `user/_id.html` 和 `user/_id/settings.html`，并且您必须具有重写规则以使其正常运行。

- 具有动态路由的页面的优先级低于固定路由。例如，如果您有一个 `/user/create` 路由和 `/user/:id` 路由，则 `/user/create` 路由将具有优先级。

这是一个基本的页面组件，它使用路由中的 id 参数来获取客户端的用户信息:

```html
<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: null,
      };
    },
    async mounted() {
      const { id } = this.$route.params;
      const response = await fetch(`https://api.example.com/user/${id}`);

      this.user = await response.json();
    },
  };
</script>
```

始终使用 `mounted` 来获取客户端数据。由于在生成静态 HTML 时执行数据，因此在 `created` 中获取数据会引起问题。

#### 通过编程方式创建动态路由

以编程方式创建带有动态路由的页面，以获取更高级的路径。动态参数使用 `:` 来指定。

每个参数都可以具有一个自定义的正则表达式，以仅匹配数字或某些值。

```js
module.exports = function (api) {
  api.createPages(({ createPage }) => {
    createPage({
      path: '/user/:id(\\d+)',
      component: './src/templates/User.vue',
    });
  });
};
```

#### 生成重写规则

Gridsome 无法为动态路由的每种可能的变体生成 HTML 文件，这意味着直接访问 URL 时最有可能显示 404 页。而是，Gridsome 生成一个 HTML 文件，该文件可用于重写规则。例如，类似/ user /:id 的路由将生成位于/user/\_id.html 的 HTML 文件。您可以具有重写规则，以将所有与/ user /:id 匹配的路径映射到该文件。

由于每种服务器类型都有自己的语法，因此必须手动生成重写规则。 afterBuild 挂钩中的 redirects 数组包含应生成的所有必要的重写规则。

```js
const fs = require('fs');

module.exports = {
  afterBuild({ redirects }) {
    for (const rule of redirects) {
      // rule.from   - The dynamic path
      // rule.to     - The HTML file path
      // rule.status - 200 if rewrite rule
    }
  },
};
```

### 页面 meta 信息

Gridsome 使用 [vue-meta](https://vue-meta.nuxtjs.org/) 处理有关页面的元信息。

```html
<template>
  <div>
    <h1>Hello, world!</h1>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: 'Hello, world!',
      meta: [{ name: 'author', content: 'John Doe' }],
    },
  };
</script>
```

### 自定义 404 页面

创建一个 `src/pages/404.vue` 组件以具有一个自定义 404 页面。

## Collections 集合

集合是一组节点，每个节点都包含带有自定义数据的字段。如果您要在网站上放置博客文章，标签，产品等，则集合很有用。

### 添加集合

集合可以通过 [source plugins](https://gridsome.org/plugins/) 添加，也可以使用 [Data Store API](https://gridsome.org/docs/data-store-api/) 自己添加。

在开发和构建期间，这些集合存储在本地内存数据存储中。节点可以来自本地文件（Markdown，JSON，YAML 等）或任何外部 API。

![Collections](../w-002-get-started/imgs/1.png)

### 使用 source plugins 添加集合

将集合添加到 Gridsome 的最简单方法是使用源插件。本示例从 WordPress 网站创建集合。源插件的 typeName 选项通常用于为插件添加的集合名称添加前缀。

```js
// gridsome.config.js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-wordpress',
      options: {
        baseUrl: 'YOUR_WEBSITE_URL',
        typeName: 'WordPress',
      },
    },
  ],
};
```

你可以在[这里](https://gridsome.org/plugins)浏览插件列表。

### 使用 Data Store API 添加集合

您可以从任何外部 API 手动添加集合。

本示例创建一个名为 Post 的集合，该集合从 API 获取内容并将结果作为节点添加到该集合中。

```js
// gridsome.server.js
const axios = require('axios');

module.exports = function (api) {
  api.loadSource(async (actions) => {
    const collection = actions.addCollection('Post');

    const { data } = await axios.get('https://api.example.com/posts');

    for (const item of data) {
      collection.addNode({
        id: item.id,
        title: item.title,
        content: item.content,
      });
    }
  });
};
```

了解有关 [Data Store API](https://gridsome.org/docs/data-store-api/) 的更多信息。

### GraphQL 中的集合

每个集合将向 [GraphQL schema](https://gridsome.org/docs/data-layer/) 添加两个根字段，这些根字段用于检索页面中的节点。

字段名称是根据集合名称自动生成的。如果您将集合命名为 Post，那么在架构中将具有以下可用字段:

- `post` 通过 ID 获取单个节点。
- `allPost` 获取节点列表（可以排序和过滤等）。

**自动生成 schema**

**探索可用的类型和字段**

您可以通过在 [GraphQL 资源管理器](https://gridsome.org/docs/data-layer#the-graphql-explorer)中打开架构选项卡来浏览可用字段。

阅读有关如何在 GraphQL 中查询节点的更多信息:https://gridsome.org/docs/querying-data/。

## Templates（模板）

模板用于为集合中的节点创建单个页面。节点需要相应的页面才能显示在其自己的 URL 上。

### 设置模板

以下示例将为 Post 的集合设置路由和模板。如果未指定组件，则将 `src/templates/{Collection}.vue`组件作为模板。

```javascript
// gridsome.config.js
module.exports = {
  templates: {
    Post: '/blog/:year/:month/:title',
  },
};
```

指定自定义组件路径:

```javascript
// gridsome.config.js
module.exports = {
  templates: {
    Post: [
      {
        path: '/blog/:year/:month/:title',
        component: './src/other/location/Post.vue',
      },
    ],
  },
};
```

为一个集合设置多个模板:

```javascript
// gridsome.config.js
module.exports = {
  templates: {
    Product: [
      {
        path: '/product/:slug',
        component: './src/templates/Product.vue',
      },
      {
        name: 'reviews',
        path: '/product/:slug/reviews',
        component: './src/templates/ProductReviews.vue',
      },
    ],
  },
};
```

模板路径在 GraphQL 模式中具有 `path` 字段。使用 `to` 参数获取集合的其他模板的路径。

```javascript
query ($id: ID!) {
  product(id: $id) {
    path               # 默认模板的路径
    path(to:"reviews") # reviews模板的路径
  }
}
```

可用的模板选项包括:

- path - 定义动态路由，并使用任何节点字段作为参数。
- component - 指定要用作每个页面模板的组件。
- name - 为模板指定名称，以获取 GraphQL 中的路径。

:::tip

默认情况下，路径参数为 `slugged`，但是可以通过添加`_raw` 后缀来使用原始值，例如`:title_raw`。通过使用双下划线（`__`）分隔属性或索引来访问深层对象或数组中的值。date 字段有一组速记助手。 `:year`，`:month`和`:day`。

- `:id`解析为`node.id`
- `:value`解析为`node.value`（细分值）
- `:value_raw`解析为`node.value`（原始值）
- `:object__value`解析为`node.object.value`
- `:array__3__id`解析为`node.array[3].id`

:::

`path`选项可以是一个函数，该函数将节点作为第一个参数接收并返回路径。

```javascript
// gridsome.config.js
module.exports = {
  templates: {
    Post: [
      {
        path: (node) => {
          return `/product/${node.slug}/reviews`;
        },
      },
    ],
  },
};
```

每个节点将在 GraphQL 模式中获得一个`path`字段，其中包含生成的 URL。

### 将数据添加到模板

通过模板配置生成的页面将在页面查询块中将节点 `id` 用作[查询变量](https://graphql.org/learn/queries/#variables) 。使用 `$id` 变量获取当前页面的节点:

```vue
<template>
  <div>
    <h1 v-html="$page.post.title" />
    <div v-html="$page.post.content" />
  </div>
</template>

<page-query>
query ($id: ID!) {
  post(id: $id) {
    title
    content
  }
}
</page-query>
```

:::tip

其他节点字段也可用作查询变量。通过使用双下划线（`__`）分隔属性或索引来访问深层对象或数组中的值。

- `$id`解析为`node.id`
- `$value`解析为`node.value`（细分值）
- `$object__value`解析为`node.object.value`
- `$array__3__id`解析为`node.array[3].id`

:::

### 节点字段作为 meta info

`metaInfo`选项必须是一个函数才能访问查询结果:

```vue
<script>
export default {
  metaInfo() {
    return {
      title: this.$page.post.title,
    };
  },
};
</script>
```

## Layouts（布局）

布局组件用于包装页面。布局应将整个网站中使用的组件包含在内，例如页眉，页脚或侧边栏。

布局只是位于`src/layouts`中的`.vue`组件，需要声明为全局组件或在页面中导入。

每个布局都需要一个`<slot>`组件。这是将页面和模板的内容插入的位置。布局可以具有多个插槽。

```vue
<!-- Layout -->
<template>
  <div>
    <header />
    <slot><!-- 页面内容将插入此处 --></slot>
    <footer />
  </div>
</template>
```

### 导入布局

创建布局后，需要将其导入到页面和模板中。这是在`<script>`标记内完成的。

```vue
<!-- Page -->
<template>
  <Layout>
    Add page content here
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

### 全局布局

如果您不想将布局导入每个页面或模板，则可以将布局设为全局。要使布局成为全局布局，请转至`src/main.js`并将布局文件导入此文件。

例如:

```javascript
// src/main.js

import Layout from '~/layouts/Default.vue';

export default function (Vue, { head, router, isServer }) {
  Vue.component('Layout', Layout);
}
```

现在，您可以在 Gridsome 项目中的任何位置使用`<Layout>`，而无需将其导入每个页面:

```vue
<!-- Page -->
<template>
  <Layout>
    在此处添加页面内容
  </Layout>
</template>
```

### 将 Props 传递到布局

由于布局就像组件一样工作，因此可以将 Props 传递给布局。例如，页面如下所示:

```vue
<!-- Page -->
<template>
  <Layout :sidebar="true">
    在此处添加页面内容
  </Layout>
</template>
```

这会将 Prop 传递到`sidebar = true`的布局。在布局组件中，可能看起来像这样:

```vue
<!-- Layout -->
<template>
  <div>
    <div class="main-content">
      <slot></slot>
    </div>
    <div v-if="sidebar">
      让我们显示侧边栏
    </div>
  </div>
</template>

<script>
export default {
  props: ['sidebar'],
};
</script>
```

### 多个内容槽

要将多个插槽添加到布局中，您需要为其命名。在此示例中，我们添加了一个侧边栏插槽，仅在页面具有侧边栏内容时才会显示。

```vue
<!-- Layout -->
<template>
  <div>
    <!-- Default slot -->
    <slot />
    <div class="sidebar" v-if="$slots.sidebar">
      <!-- Sidebar slot -->
      <slot name="sidebar"></slot>
    </div>
  </div>
</template>
```

页面现在可以将内容添加到此插槽中，如下所示

```vue
<!-- Page -->
<template>
  <Layout>
    这是默认内容

    <template slot="sidebar">
      这将从页面添加到侧边栏插槽
    </template>
  </Layout>
</template>
```

### 主布局

您可以通过将`App.vue`文件添加到`src`根目录来创建主布局。这样一来，您就可以在所有页面上保留页眉，页脚并添加页面过渡。

一个简单的 `App.vue` 文件如下所示:

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>
```

## Components(组件)

Gridsome 使用 [Vue 单个文件组件](https://vuejs.org/v2/guide/single-file-components.html) 。这意味着您将 HTML，JavaScript 和 CSS 添加到同一文件中。这使您的项目更易于维护和测试，并且组件也可重用。这也可在构建过程中进行代码拆分。

这是一个文件示例，我们在`src/components/`中将其称为`Card.vue`:

```vue
<template>
  <div class="card">
    {{ message }}
    <button @click="onClick">
      Change
    </button>
  </div>
</template>

<script>
export default {
  name: 'Card',
  data() {
    return {
      message: 'Try change me!',
    };
  },
  methods: {
    onClick() {
      this.message = 'Here you go :)';
    },
  },
};
</script>

<style>
.card {
  padding: 20px;
  background: #fff;
}
</style>
```

### 导入其他页面或组件

创建组件后，可以轻松将其导入页面。在 Gridsome 项目中，建议将所有`.vue`组件放在`src/components`文件夹中，然后将它们导入到`Pages`或`Layouts`中，如下所示:

```vue
<template>
  <Card />
</template>

<script>
import Card from '~/components/Card.vue';

export default {
  components: {
    Card,
  },
};
</script>
```

### 将 GraphQL 添加到组件

每个组件都可以具有一个带有 GraphQL 查询的`<static-query>`块，从数据源获取数据。结果将存储在组件内部的`$static`属性中。

```vue
<template>
  <div v-html="$static.post.content" />
</template>

<static-query>
query {
  post (id: "1") {
    content
  }
}
</static-query>
```

## Linking

`<g-link>`组件在您的所有页面，模板和组件中全局可用。它是来自`Vue Router`的 [router-link](https://router.vuejs.org/api/#router-link-props) 的包装。

## 动态路由

> 动态路由对于仅需要客户端路由的页面很有用。例如，根据 URL 中的细分从生产中的外部 API 获取信息的页面。

### 基于文件的动态路由

动态页面用于客户端路由。路由参数可以通过将名称包装在方括号中来放置在文件和目录名称中。例如:

- `src/pages/user/[id].vue` 变成 `/user/:id`.
- `src/pages/user/[id]/settings.vue` 变成 `/user/:id/settings`.

在构建时，这将生成`user/_id.html`和`user/_id/settings.html`，并且您必须具有重写规则以使其正常运行。

具有动态路由的页面的优先级低于固定路由。例如，如果您有一个`/user/create`路由和`/user/:id`路由，则`/user/create`路由将具有优先级。

这是一个基本的页面组件，它使用路由中的`id`参数在客户端获取用户信息:

```vue
<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    const response = await fetch(`https://api.example.com/user/${id}`);

    this.user = await response.json();
  },
};
</script>
```

:::warning
始终使用`mounted`钩子来获取客户端数据。在`created`钩子中获取数据会导致问题，因为生成静态 HTML 时会执行数据。
:::

### 编程式动态路由

以编程方式创建带有动态路由的页面，以获取更高级的路径。动态参数通过在段前面使用`:`来指定。每个参数都可以有一个自定义的正则表达式，以仅匹配数字或某些值

```javascript
module.exports = function (api) {
  api.createPages(({ createPage }) => {
    createPage({
      path: '/user/:id(\\d+)',
      component: './src/templates/User.vue',
    });
  });
};
```

### 生成重写规则

Gridsome 无法为动态路由的每种可能的变体生成 HTML 文件，这意味着直接访问 URL 时最有可能显示 404 页。而是，Gridsome 生成一个 HTML 文件，该文件可用于重写规则。例如，类似`/user/:id`的路由将生成位于`/user/_id.html`的 HTML 文件。您可以具有重写规则，以将所有与`/user/:id`匹配的路径映射到该文件。

由于每种服务器类型都有自己的语法，因此必须手动生成重写规则。 `afterBuild`钩子中的`redirects`数组包含应生成的所有必要的重写规则。

```javascript
const fs = require('fs');

module.exports = {
  afterBuild({ redirects }) {
    for (const rule of redirects) {
      // rule.from   - The dynamic path
      // rule.to     - The HTML file path
      // rule.status - 200 if rewrite rule
    }
  },
};
```

## [图片处理](https://gridsome.org/docs/images/)

## [页面 Head 管理](https://gridsome.org/docs/head/)

### [添加全局头部元数据](https://gridsome.org/docs/head/#add-global-head-metadata)

### [将 meta data 添加到 pages 和 templates](https://gridsome.org/docs/head/#add-head-meta-data-to-pages--templates)

### [从子组件覆盖 meta data](https://gridsome.org/docs/head/#how-to-overwrite-from-child-component)

### 可用属性

| Property      | Description        | Link                                                   |
| :------------ | :----------------- | :----------------------------------------------------- |
| style         | Adds a style tag   | [Docs](https://vue-meta.nuxtjs.org/api/#style)         |
| script        | Adds a script tag  | [Docs](https://vue-meta.nuxtjs.org/api/#script)        |
| meta          | Adds a meta tag    | [Docs](https://vue-meta.nuxtjs.org/api/#meta)          |
| title         | Changes title text | [Docs](https://vue-meta.nuxtjs.org/api/#title)         |
| titleTemplate | Dynamic title text | [Docs](https://vue-meta.nuxtjs.org/api/#titletemplate) |
| link          | Adds a link tag    | [Docs](https://vue-meta.nuxtjs.org/api/#link)          |

## [环境变量](https://gridsome.org/docs/environment-variables/)
