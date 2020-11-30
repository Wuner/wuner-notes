# 分页数据

在 GraphQL 查询中使用 `@paginate` 指令可为集合添加自动分页。该查询将收到 `$page:Int` 变量，可用于加载特定页面的源。每页的默认节点为 `25`。

## 分页采集

将 `@paginate` 指令放置在要分页的集合之后。

```javascript
query ($page: Int) {
  allBlogPost(perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        path
      }
    }
  }
}

```

## 分页分类页面

将 `@paginate` 指令放置在您要分页的 `belongsTo` 字段之后。

```javascript
query ($page: Int) {
  category {
    title
    belongsTo(perPage: 10, page: $page) @paginate {
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

## 分页组件

Gridsome 具有内置的 `Pager` 组件，可轻松进行分页。从我们的组件中的 gridsome 导入它以使用它。该组件至少需要 `pageInfo.totalPages` 和 `pageInfo.currentPage` 字段才能正确呈现。

示例

```vue
<template>
  <Layout>
    <ul>
      <li v-for="edge in $page.allBlogPost.edges" :key="edge.node.id">
        {{ edge.node.title }}
      </li>
    </ul>
    <Pager :info="$page.allBlogPost.pageInfo" />
  </Layout>
</template>

<script>
import { Pager } from 'gridsome';

export default {
  components: {
    Pager,
  },
};
</script>

<page-query>
query ($page: Int) {
  allBlogPost(perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
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

| 属性             | 默认     | 描述                                  |
| ---------------- | -------- | ------------------------------------- |
| info             | required | 来自 GraphQL 结果和页面总数的页面信息 |
| showLinks        | true     | 显示导航链接                          |
| showNavigation   | true     | 显示上一个和下一个链接                |
| range            | 5        | 显示多少个链接                        |
| linkClass        |          | 将自定义类添加到链接                  |
| firstLabel       | «        |
| prevLabel        | ‹        |
| nextLabel        | ›        |
| lastLabel        | »        |
| ariaLabel        |          | 分页导航                              |
| ariaLinkLabel    |          | 转到第几页                            |
| ariaFirstLabel   |          | 转到第一页                            |
| ariaCurrentLabel |          | 当前页面。第几页                      |
| ariaPrevLabel    |          | 转到上一页。第几页                    |
| ariaNextLabel    |          | 转到下一页。第几页                    |
| ariaLastLabel    |          | 转到最后一页。第几页                  |
