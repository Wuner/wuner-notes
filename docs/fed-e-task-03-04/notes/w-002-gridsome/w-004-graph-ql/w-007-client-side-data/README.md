# 客户端数据

## 从内部页面获取

从其他内部 `page-query` 页面查询结果和 `page context`。以下示例从 `/other-page` 获取数据并存储结果。

```javascript
export default {
  data() {
    return {
      otherPage: null,
    };
  },
  async mounted() {
    try {
      const results = await this.$fetch('/other-page');
      this.otherPage = results.data;
    } catch (error) {
      console.log(error);
    }
  },
};
```

`fetch` 方法也可以从 gridsome 导入。

```javascript
import { fetch } from 'gridsome';

export default {
  async mounted() {
    const results = await fetch('/other-page');
    console.log(results.data);
  },
};
```

阅读有关 [\$fetch()](https://gridsome.org/docs/client-api#fetchpath) 方法的更多信息。

## [更多](https://gridsome.org/docs/client-side-data/)
