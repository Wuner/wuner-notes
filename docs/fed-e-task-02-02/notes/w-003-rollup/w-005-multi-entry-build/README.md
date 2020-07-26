# 多入口打包

Rollup 多入口打包时，即使不使用动态导入，也会帮我们进行[代码拆分](../w-004-code-splitting)

`rollup.config.js`

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: ['src/index.js', 'src/hello.js'],
  output: {
    dir: 'dist',
    format: 'amd', // 构建浏览器使用的文件
  },
  plugins: [nodeResolve()],
};
```

`src/hello.js`

```javascript
import _ from 'lodash-es';

console.log(_.last([1, 2, 3]));
```

`src/index.js`

```javascript
import _ from 'lodash-es';

console.log(_.first([1, 2, 3]));
```
