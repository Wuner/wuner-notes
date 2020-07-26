# [RollupPluginNodeResolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

告诉 Rollup 如何查找外部模块

## 安装

```
npm i @rollup/plugin-node-resolve -D
```

## 案例

`rollup.config.js`

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [nodeResolve()],
};
```

`src/index.js`

```javascript
import _ from 'lodash-es';

console.log(_.first([1, 2, 3]));
```

## [Options](https://github.com/rollup/plugins/tree/master/packages/node-resolve#options)
