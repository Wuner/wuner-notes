# [RollupPluginCommonJS](https://github.com/rollup/plugins/tree/master/packages/commonjs)

用于将 CommonJS 模块转换为 ES6

## 安装

```
npm i @rollup/plugin-commonjs -D
```

## 案例

`rollup.config.js`

```javascript
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [commonjs()],
};
```

`src/bar.js`

```javascript
module.exports = {
  bar: 'foo',
};
```

`src/index.js`

```javascript
import bar from './bar';

console.log(bar);
```

构建生成文件内容

```javascript
(function () {
  'use strict';

  var bar = {
    bar: 'foo',
  };

  console.log(bar);
})();
```

## [Options](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)
