# [RollupPluginJson](https://github.com/rollup/plugins/tree/master/packages/json)

从 JSON 文件中读取数据

## 安装

```
npm i rollup-plugin-json -D
```

## 案例

`rollup.config.js`

```javascript
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [json()],
};
```

`src/index.js`

```javascript
import { foo } from './foo';
import { version, name } from '../package.json';

foo();

console.log(version, name);
```

构建生成文件内容

```javascript
(function () {
  'use strict';

  const foo = () => {
    console.log('hello rollup');
  };

  var name = 'rollup-sample';
  var version = '1.0.0';

  foo();

  console.log(version, name);
})();
```

> 我们实际需要的数据只有 name 和 version ， package.json 里的其它数据被忽略了。这是 tree-shaking 起了作用。

## Options

`compact`

- Type: Boolean
- Default: false

如果为 true，则指示插件忽略缩进并生成最小的代码。

`exclude`

- Type: String | Array[...String]
- Default: null

用于指定插件应忽略的构建文件。 默认情况下，不会忽略任何文件

`include`

- Type: String | Array[...String]
- Default: null

用于指定插件需要被构建的文件。 默认情况下，所有文件。

`indent`

- Type: String
- Default: '\t'

指定生成的文件默认导出的缩进。

`namedExports`

- Type: Boolean
- Default: true

如果为 true，则指示插件为 JSON 对象的每个属性生成命名导出。

`preferConst`

- Type: Boolean
- Default: false

如果为 true，则指示插件使用 var 或 const 将属性声明为变量。 这与`tree-shaking`有关。
