# ES Module

## ES Module 基本特性

- ESM 自动采用严格模式，忽略 'use strict'
- 每个 ES Module 都是运行在单独的私有作用域中
- ESM 是通过 CORS 的方式请求外部 JS 模块的
- ESM 的 script 标签会延迟执行脚本(浏览器页面渲染后执行)

## [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)

在创建 JavaScript 模块时，export 语句用于从模块中导出实时绑定的函数、对象或原始值，以便其他程序可以通过 import 语句使用它们。被导出的绑定值依然可以在本地进行修改。在使用 import 进行导入时，这些绑定值只能被导入模块所读取，但在 export 导出模块中对这些绑定值进行修改，所修改的值也会实时地更新。

无论您是否声明，导出的模块都处于严格模式。 export 语句不能用在嵌入式脚本中。

```
// 导出单个特性
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

// 导出列表
export { name1, name2, …, nameN };

// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN };

// 解构导出并重命名
export const { name1, name2: bar } = o;

// 默认导出
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// 合并 modules
export * from …; // does not set the default export
export * as name1 from …;
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

## [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)

静态的 import 语句用于导入由另一个模块导出的绑定。无论是否声明了 strict mode ，导入的模块都运行在严格模式下。在浏览器中，import 语句只能在声明了 type="module" 的 script 的标签中使用。

此外，还有一个类似函数的动态 import()，它不需要依赖 type="module" 的 script 标签。

在 script 标签中使用 nomodule 属性，可以确保向后兼容。

在您希望按照一定的条件或者按需加载模块的时候，动态 import() 是非常有用的。而静态型的 import 是初始化加载依赖项的最优选择，使用静态 import 更容易从代码静态分析工具和 tree shaking 中受益。

```
// 导入整个模块的内容
import * as myModule from '/modules/my-module.js';

// 导入单个接口
import {myExport} from '/modules/my-module.js';
// 导入多个接口

import {foo, bar} from '/modules/my-module.js';

// 导入带有别名的接口
import {reallyReallyLongModuleExportName as shortName} from '/modules/my-module.js';

// 导入时重命名多个接口
import {
  reallyReallyLongModuleMemberName as shortName,
  anotherLongModuleName as short
} from '/modules/my-module.js';

// 仅为副作用而导入一个模块
// 整个模块仅为副作用（中性词，无贬义含义）而导入，而不导入模块中的任何内容（接口）。 这将运行模块中的全局代码, 但实际上不导入任何值。
import '/modules/my-module.js';

// 导入默认值
import myDefault from '/modules/my-module.js';
import myDefault, * as myModule from '/modules/my-module.js';
// myModule used as a namespace
import myDefault, {foo, bar} from '/modules/my-module.js';
// specific, named imports

// 动态import
import('/modules/my-module.js')
  .then((module) => {
    // Do something with the module.
  });
let module = await import('/modules/my-module.js');
```

## node 环境下

### es module 使用

index.mjs

```javascript
// 第一，将文件的扩展名由 .js 改为 .mjs；
// 第二，启动时需要额外添加 `--experimental-modules` 参数；

import { foo, bar } from './module.mjs';

console.log(foo, bar);

// 此时我们也可以通过 esm 加载内置模块了
import fs from 'fs';
fs.writeFileSync('./foo.txt', 'es module working');

// 也可以直接提取模块内的成员，内置模块兼容了 ESM 的提取成员方式
import { writeFileSync } from 'fs';
writeFileSync('./bar.txt', 'es module working');

// 对于第三方的 NPM 模块也可以通过 esm 加载
import _ from 'lodash';
_.camelCase('ES Module');

// 不支持，因为第三方模块都是导出默认成员
// import { camelCase } from 'lodash'
// console.log(camelCase('ES Module'))
```

### 与 CommonJS 交互

- ES Module 中可以导入 CommonJS 模块
- CommonJS 中不能导入 ES Module 模块
- CommonJS 始终只会导出一个默认成员
- 注意 import 不是解构导出对象

commonjs.js

```javascript
// CommonJS 模块始终只会导出一个默认成员

// module.exports = {
//   foo: 'commonjs exports value'
// }

// exports.foo = 'commonjs exports value'

// 不能在 CommonJS 模块中通过 require 载入 ES Module

// const mod = require('./es-module.mjs')
// console.log(mod)
```

es-module.mjs

```javascript
// ES Module 中可以导入 CommonJS 模块

// import mod from './commonjs.js'
// console.log(mod)

// 不能直接提取成员，注意 import 不是解构导出对象

// import { foo } from './commonjs.js'
// console.log(foo)

// export const foo = 'es module export value'
```

### 与 CommonJS 的差异

esm.mjs

```javascript
// ESM 中没有模块全局成员了

// // 加载模块函数
// console.log(require)

// // 模块对象
// console.log(module)

// // 导出对象别名
// console.log(exports)

// // 当前文件的绝对路径
// console.log(__filename)

// // 当前文件所在目录
// console.log(__dirname)

// -------------

// require, module, exports 自然是通过 import 和 export 代替

// __filename 和 __dirname 通过 import 对象的 meta 属性获取
// const currentUrl = import.meta.url
// console.log(currentUrl)

// 通过 url 模块的 fileURLToPath 方法转换为路径
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename);
console.log(__dirname);
```

Node v12 之后的版本，可以通过`package.json`中添加`type`字段为`module`，将默认模块系统修改为`ES Module`，此时就不需要修改文件扩展名为`.mjs`了

如果需要在`type=module`的情况下继续使用`CommonJS`，需要将文件扩展名修改为`.cjs`

对于早期的 Node.js 版本，可以使用 Babel 实现 ES Module 的兼容

```
// 配置：第一种方式
{
  "plugins": [
    "@babel/plugin-transform-modules-commonjs"
  ]
}
// 配置：第二种方式（合集）
{
"presets":["@babel/preset-env"]
}
```
