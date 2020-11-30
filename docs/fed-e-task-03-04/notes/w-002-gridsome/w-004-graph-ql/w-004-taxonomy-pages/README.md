# 分类页面

GraphQL 模式中的字段可以引用其他节点。这是组织页面并在页面之间建立链接的好方法。每个节点都有一个 `belongsTo` 字段，该字段能够列出引用它的所有其他节点。`belongsTo` 字段的工作方式类似于具有 `totalCount`，`pageInfo` 和 `edge` 的集合，但是 `edge` 字段始终是 [并集字段](https://graphql.org/learn/schema/#union-types) ，可以是任何节点类型

## 创建分类页面

在此示例中，我们将创建两个集合，即 `Post` 和 `Tag` 类型。我们在 `gridsome.server.js` 文件的 `loadSource` 钩子中执行此操作。 `Post` 节点将具有一个 `tags` 字段，该字段将是 `Tag` id 数组。

```javascript
api.loadSource(actions => {
  const posts = actions.addCollection('Post')
  const tags = actions.addCollection('Tag')

  // makes all ids in the `tags` field reference a `Tag`
  posts.addReference('tags', 'Tag')

  tags.addNode({
    id: '1',
    title: 'The author'
  })

  posts.addNode({
    id: '1',
    title: 'A post',
    tags: ['1']
  })
}
```

现在，我们在 `src/templates` 中创建一个 `Tag.vue` 文件，以此为我们的标签页提供模板。每个标签页面都会有一个列表，其中包含对其进行引用的帖子

```vue
<template>
  <Layout>
    <h1>{{ $page.tag.title }}</h1>
    <ul>
      <li v-for="edge in $page.tag.belongsTo.edges" :key="edge.node.id">
        <g-link :to="edge.node.path">
          {{ edge.node.title }}
        </g-link>
      </li>
    </ul>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  tag(id: $id) {
    title
    belongsTo {
      edges {
        node {
          ... on Post {
            id
            title
            path
          }
        }
      }
    }
  }
}
</page-query>
```

上方的标签页将显示帖子列表及其链接。

## 分页的分类页面

将 `@paginate` 指令放置在 `belongsTo` 字段之后以激活分页。该查询将有一个 `$page` 变量可用于传递到 `belongsTo page` 参数。

```javascript
query ($id: ID!, $page: Int) {
  tag(id: $id) {
    title
    belongsTo(page: $page) @paginate {
      totalCount
      pageInfo {
        totalPages
        currentPage
      }
      edges {
        node {
          ... on Post {
            id
            title
            path
          }
        }
      }
    }
  }
}

```

## belongsTo 的参数

| Argument | Default | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| sortBy   | "date"  | 按节点字段排序。                                     |
| order    | DESC    | 按 order 字段排序 (DESC or ASC).                     |
| sort     |         | 按多个节点字段排序                                   |
| skip     | 0       | 跳过多少个节点                                       |
| limit    |         | 要获得多少个节点。                                   |
| page     |         | 获取哪个页面。                                       |
| perPage  |         | 每页显示多少个节点。如果未提供 `page` 参数，则省略。 |
| filter   | {}      | 按 `id` 或 `typeName` 过滤节点。                     |
