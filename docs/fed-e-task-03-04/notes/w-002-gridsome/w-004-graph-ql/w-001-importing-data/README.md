# 导入数据

Gridsome 允许您将数据从任何数据源导入 GraphQL 数据层。

## 导入源插件

向 Gridsome 添加数据的最简单方法是使用源插件。 Gridsome 数据源插件添加在 `gridsome.config.js` 中。您可以在 [Plugins](https://gridsome.org/plugins) 目录中找到可用的数据源插件。

这是添加到 config 的 [file-system](https://gridsome.org/plugins/@gridsome/source-filesystem) 源的示例：

```javascript
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'docs/**/*.md',
        typeName: 'DocPage',
      },
    },
  ],
};
```

`typeName`将是 GraphQL 集合的名称，并且必须是唯一的。本示例将添加一个 DocPage 集合。

每个数据源都有不同的选项，因此请查看其文档以了解更多信息。

## 从 API 导入

使用 [Data store API](https://gridsome.org/docs/data-store-api/) 将数据从任何内容 `API` 导入到 GraphQL 数据层。要使用该 `API`，您需要在 Gridsome 项目的根文件夹中有一个 `gridsome.server.js` 文件。

这是一个导入数据的示例 `gridsome.server.js` 文件：

```javascript
const axios = require('axios');

module.exports = function (api) {
  api.loadSource(async (actions) => {
    const { posts } = await axios.get('https://api.example.com/posts');

    const collection = actions.addCollection({
      typeName: 'BlogPosts',
    });

    for (const post of posts) {
      collection.addNode({
        id: post.id,
        title: post.title,
      });
    }
  });
};
```

:::warning
启动开发服务器或生产构建时将获取数据。您需要重新启动服务器才能使 `gridsome.server.js` 中的更改生效。
:::

## [更多](https://gridsome.org/docs/fetching-data/)
