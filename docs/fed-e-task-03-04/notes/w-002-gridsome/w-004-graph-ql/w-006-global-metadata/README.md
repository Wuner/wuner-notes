# 全局 meta 数据

Gridsome 使您可以使用 [Data store API](https://gridsome.org/docs/data-store-api/) 添加全局 meta 数据。要使用该 API，您需要在 Gridsome 项目的根文件夹中有一个 `gridsome.server.js` 文件。meta 数据是静态的，不能从客户端更新或更改。

:::tip
如果您有想要全局访问的数据，而不必包含在任何 GraphQL 集合中，则填充 meta 数据非常有用。
:::

这是一个例子：

```javascript
module.exports = function (api) {
  api.loadSource(async (store) => {
    store.addMetadata('message', 'This is a global text');
  });
};
```

meta 数据将在 meta 数据 GraphQL 根字段中可用。可以像其他任何数据一样获取 meta 数据。

这是有关如何在 Vue 组件中使用它的示例：

```vue
<template>
  <h1 v-html="$static.metadata.message" />
</template>

<static-query>
query {
  metadata {
    message
  }
}
</static-query>
```
