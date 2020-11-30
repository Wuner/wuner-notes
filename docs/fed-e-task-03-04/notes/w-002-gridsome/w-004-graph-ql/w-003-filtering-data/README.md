# 筛选资料

GraphQL 模式中的每个集合都有一个 `filter` 参数，可用于过滤结果。您可以按任何自定义字段进行过滤。每种字段类型都支持不同的运算符。

`filter` 的语法基于 [mongodb](https://docs.mongodb.com/manual/reference/operator/query/) 查询语法。

## String 字段

| Operator      | 描述                                   |
| ------------- | -------------------------------------- |
| eq(equal)     | 查找具有（strict）相等字段的节点。     |
| ne(not equal) | 查找字段不等于提供的值的节点。         |
| in            | 查找字段匹配提供的任何值的节点。       |
| nin(not in)   | 查找字段与提供的任何值都不匹配的节点。 |
| regex         | 筛选属性匹配正则表达式的节点。         |
| len(length)   | 过滤具有指定长度的字符串字段的节点。   |

```javascript
query {
  allPost(filter: { id: { in: ["1", "2"] }}) {
    edges {
      node {
        title
      }
    }
  }
}
```

本示例将查询 `id` 为 1 或 2 的节点。

## Date 字段

| Operator                | 描述                                     |     |
| ----------------------- | ---------------------------------------- | --- |
| gt(greater than)        | 查找字段大于提供的值的节点。             |
| gte(greater or equal)   | 查找字段大于或等于提供的值的节点。       |
| lt(less than)           | 查找字段小于提供的值的节点。             |
| lte(less than or equal) | 查找字段小于或等于提供的值的节点。       |
| dteq(equal dates)       | 按等于提供的日期值的 date 属性过滤节点。 |
| between                 | 查找字段值在提供的值之间的节点。         |

```javascript
query {
  allPost(filter: { date: { gte: "2017" }}) {
    edges {
      node {
        title
      }
    }
  }
}
```

本示例将仅查询 `date` 大于或等于 2017 的节点。

## Boolean 字段

| Operator      | Description                            |
| ------------- | -------------------------------------- |
| eq(equal)     | 查找具有（strict）相等字段的节点。     |
| ne(not equal) | 查找字段不等于提供的值的节点。         |
| in            | 查找字段匹配提供的任何值的节点。       |
| nin(not in)   | 查找字段与提供的任何值都不匹配的节点。 |

```javascript
query {
  allPost(filter: { featured: { eq: true }}) {
    edges {
      node {
        title
        featured
      }
    }
  }
}
```

本示例将仅查询 `featured` 为 true 的节点。

## Number 字段

| Operator                | 描述                                   |
| ----------------------- | -------------------------------------- |
| eq(equal)               | 查找具有（strict）相等字段的节点。     |
| ne(not equal)           | 查找字段不等于提供的值的节点。         |
| in                      | 查找字段匹配提供的任何值的节点。       |
| nin(not in)             | 查找字段与提供的任何值都不匹配的节点。 |
| gt(greater than)        | 查找字段大于提供的值的节点。           |
| gte(greater or equal)   | 查找字段大于或等于提供的值的节点。     |
| lt(less than)           | 查找字段小于提供的值的节点。           |
| lte(less than or equal) | 查找字段小于或等于提供的值的节点。     |
| between                 | 查找字段值在提供的值之间的节点。       |

```javascript
query {
  allProduct(filter: { price: { between: [49, 99] }}) {
    edges {
      node {
        title
        price
      }
    }
  }
}
```

本示例将仅查询 `price` 的值在 49 到 99 之间的节点。

## Array 字段

| Operator     | 描述                                   |
| ------------ | -------------------------------------- |
| size         | 过滤具有指定大小的数组属性的节点。     |
| contains     | 查找字段包含提供的值的节点。           |
| containsAny  | 查找包含包含任何提供的值的字段的节点。 |
| containsNone | 查找字段不包含任何提供的值的节点。     |

```javascript
query {
  allPost(filter: { keywords: { contains: ["gridsome"] }}) {
    edges {
      node {
        title
        keywords
      }
    }
  }
}
```

本示例将仅查询具有 gridsome `keyword` 的节点。
