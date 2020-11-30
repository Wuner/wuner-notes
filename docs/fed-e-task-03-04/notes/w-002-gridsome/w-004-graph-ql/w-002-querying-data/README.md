# 查询数据

您可以将数据从 GraphQL 数据层查询到任何页面，模板或组件中。在 Vue 组件中，使用`<page-query>`或`<static-query>`中添加查询。

- 在页面和模板中使用`<page-query>`。
- 在组件中使用`<static-query>`。

## 如何用 GraphQL 查询

在 Gridsome 中使用 GraphQL 很容易，并且您不需要了解 GraphQL。这是一个如何在页面的页面查询中使用 GraphQL 的示例:

```vue
<template>
  <div>
    <div v-for="edge in $page.posts.edges" :key="edge.node.id">
      <h2>{{ edge.node.title }}</h2>
    </div>
  </div>
</template>

<page-query>
query {
  posts: allWordPressPost {
    edges {
      node {
        id
        title
      }
    }
  }
}
</page-query>
```

使用 GraphQL，您仅查询所需的数据。这使得处理数据更加容易和整洁。查询总是以 `query` 开始，然后是 `Posts`（可以是任何东西）。然后，您编写类似`posts:allWordPressPost`。 `allWordPressPost`是您要查询的 GraphQL 集合的名称。`posts:`部分是可选的别名。将帖子用作别名时，您的数据将位于 `$page.posts`（如果使用`<static-query>`，则为 `$static.posts`）。否则，它将在`$page.allWordPressPost`上可用。

[了解有关 GraphQL 查询的更多信息](https://graphql.org/learn/queries/)

## 查询集合

您会注意到，您架构中的某些根字段都以全部作为前缀。使用它们来获取集合中节点的列表。

| Argument | Default | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| sortBy   | "date"  | 按节点字段排序。                                     |
| order    | DESC    | 按 order 字段排序 (DESC or ASC).                     |
| sort     |         | 按多个节点字段排序。                                 |
| skip     | 0       | 跳过多少个节点。                                     |
| limit    |         | 要获得多少个节点。                                   |
| page     |         | 获取哪个页面。                                       |
| perPage  |         | 每页显示多少个节点。如果未提供 `page` 参数，则省略。 |
| filter   | {}      | [更多](../w-003-filtering-data)                      |

查找按标题排序的节点

```javascript
query {
  allPost(sortBy: "title", order: DESC) {
    edges {
      node {
        title
      }
    }
  }
}
```

按多个字段对集合进行排序

```javascript
query {
  allPost(sort: [{ by: "featured" }, { by: "date" }]) {
    edges {
      node {
        title
      }
    }
  }
}

```

## 查询单个节点

并非 `all` 开头的其他字段是您的单个条目。模板通常使用它们来获取当前页面的数据。您必须提供 `id` 或 `path` 作为参数来查找节点。

| Argument | Default | Description        |
| -------- | ------- | ------------------ |
| id       | null    | 按 `id` 获取节点。 |

查询示例

```javascript
query {
  post(id: "1") {
    title
  }
}

```

## 查询页面组件中的数据

每个页面都可以具有一个带有 GraphQL 查询的`<page-query>`块，以从数据源获取数据。结果将存储在页面组件内的 `$page` 属性中。

```vue
<template>
  <Layout>
    <h2>Latest blog posts</h2>
    <ul>
      <li v-for="edge in $page.posts.edges" :key="edge.node.id">
        {{ edge.node.title }}
      </li>
    </ul>
  </Layout>
</template>

<page-query>
query {
  posts: allWordPressPost {
    edges {
      node {
        id
        title
      }
    }
  }
}
</page-query>
```

## 页面组件中的多个查询

如果您需要进行多个 GraphQL 查询，请按以下步骤进行。结果将存储在页面组件内的`$page`属性中，您可以通过指定查询名称来进一步区分。

```vue
<template>
  <Layout>
    <h2>Latest blog posts</h2>
    <ul>
      <li v-for="edge in $page.posts.edges" :key="edge.node.id">
        {{ edge.node.title }}
      </li>
    </ul>

    <h2>Latest book reviews</h2>
    <ul>
      <li v-for="edge in $page.books.edges" :key="edge.node.id">
        {{ edge.node.title }}
      </li>
    </ul>
  </Layout>
</template>

<page-query>
query {
  posts: allWordPressPost {
    edges {
      node {
        id
        title
      }
    }
  }
  books: allBooks {
    edges {
      node {
        id
        title
      }
    }
  }
}
</page-query>
```

## 查询任何组件中的数据

每个 Vue 组件都可以具有一个带有 GraphQL 查询的`<static-query>`块，以从数据源获取数据。结果将存储在组件内部的`$static`属性中。 `<static-query>`名为`static`，因为它不能接受任何变量。

```vue
<template>
  <div v-html="$static.post.content" />
</template>

<static-query>
query {
  post(id: "1") {
    content
  }
}
</static-query>
```
