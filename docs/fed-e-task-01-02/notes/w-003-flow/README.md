# [Flow](https://flow.org/en/)

Flow 是 JavaScript 的静态类型检查器

## 安装

安装和配置项目的流程

### 安装编译器

首先，您需要配置一个编译器以剥离 Flow 类型。您可以在 Babel 和 flow-remove-types 之间进行选择。

这边以 Babel 为例：

Babel 是 JavaScript 代码的编译器，具有对 Flow 的支持。Babel 可以将关于 Flow 代码剔除。

首先安装@babel/core，@babel/cli 并@babel/preset-flow 使用 Yarn 或 npm。

```
npm install --save-dev @babel/core @babel/cli @babel/preset-flow
```

接下来，你需要在你的项目的根文件下创建一个.babelrc。

```json
{
  "presets": ["@babel/preset-flow"]
}
```

剔除命令运行

```
babel 输入需剔除的文件或文件夹路径 -d 输出文件夹
```

### 配置流程

安装 flow-bin

```
npm install --save-dev flow-bin
```

将"flow"脚本添加到您的 package.json：

```json
{
  "scripts": {
    "flow": "flow"
  }
}
```

首次安装后，需要先初始化

```
npm run flow init
```

init 之后，运行 flow

```
npm run flow
```

## 使用

### Type Annotations(类型注解)

```javascript
/**
 * Type Annotations(类型注解)
 * flow
 */
// 参数添加类型注解
function add(x: number, y: number) {
  return x + y;
}

// 正确
add(100, 100);
// 报错
// add('100', 100);

// 声明基本类型数据时添加类型注解
let num: number = 100; // 正确
// num = '100'; // 报错

// 声明函数时添加类型注解
function sum(): number {
  return 100; // 只能返回number类型数据
  // return '100'; // 报错
}
```

### Primitive Types(原始类型)

- Booleans
- Strings
- Numbers
- null
- undefined (void in Flow types)
- Symbols (new in ECMAScript 2015)

```javascript
/**
 * Primitive Types(原始类型)
 * @flow
 */
const bol: boolean = true; // false Boolean(0) Boolean(1)

const str: string = 'abs';

const nums: number = 1; // 3.14 NaN Infinity

const emt: null = null;

const un: void = undefined;

const syb: symbol = Symbol(); // Symbol.isConcatSpreadable
```

### Literal Types(文字类型)

Flow 具有文字值的原始类型，但也可以将文字值用作类型。

例如，number 除了接受类型，我们可以只接受文字值 2。

```javascript
/**
 * Literal Types(文字类型)
 * @flow
 */
function acceptsTwo(value: 2) {
  // ...
}

acceptsTwo(2); // Works!
// $ExpectError
acceptsTwo(3); // Error!
// $ExpectError
acceptsTwo('2'); // Error!
```

将它们与联合类型一起使用

```javascript
/**
 * Literal Types(文字类型)
 * @flow
 */
function getColor(name: 'success' | 'warning' | 'danger') {
  switch (name) {
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'danger':
      return 'red';
  }
}

getColor('success'); // Works!
getColor('danger'); // Works!
// $ExpectError
getColor('error'); // Error!
```

### Mixed Types(混合类型)

mixed 将接受任何类型的值。字符串，数字，对象，函数等。

```javascript
/**
 * Mixed Types(混合类型)
 * @flow
 */
function stringify(value: mixed) {
  // ...
}

stringify('foo');
stringify(3.14);
stringify(null);
stringify({});
```

当您尝试使用 mixed 类型的值时，必须首先弄清楚实际的类型是什么，否则最终会出错。

```javascript
/**
 * Mixed Types(混合类型)
 * @flow
 */
function stringify(value: mixed) {
  return '' + value; // Error!
}

stringify('foo');
```

通过 typeof 来确保该值是某种类型

```javascript
/**
 * Mixed Types(混合类型)
 * @flow
 */
function stringify(value: mixed) {
  if (typeof value === 'string') {
    return '' + value; // Works!
  } else {
    return '';
  }
}

stringify('foo');
```

### Any Types(任何类型)

`使用any是完全不安全的，应尽可能避免使用。`

```javascript
/**
 * Any Types(任何类型)
 * @flow
 */
function division(one: any, two: any): number {
  return one / two;
}

division(1, 2); // Works.
division('1', '2'); // Works.
division({}, []); // Works.
```

### Maybe Types(可能类型)

使用 Flow 可以将 Maybe 类型用于这些值。可能类型可以与其他任何类型一起使用，只需在其前面加上一个问号即可，例如?number 某种修饰符。

例如：?number 就意味着 number，null 或 undefined。

```javascript
/**
 * Maybe Types(可能类型)
 * @flow
 */
function acceptsMaybeNumber(value: ?number) {
  // ...
}

acceptsMaybeNumber(42); // Works!
acceptsMaybeNumber(); // Works!
acceptsMaybeNumber(undefined); // Works!
acceptsMaybeNumber(null); // Works!
acceptsMaybeNumber('42'); // Error!
```

### Function Types(函数类型)

```javascript
function concat(a: string, b: string): string {
  return a + b;
}

concat('foo', 'bar'); // Works!
// $ExpectError
concat(true, false); // Error!

function method(func: (...args: Array<any>) => any) {
  func(1, 2); // Works.
  func('1', '2'); // Works.
  func({}, []); // Works.
}

method(function (a: number, b: number) {
  // ...
});
```

### Object Types(对象类型)

```javascript
/**
 * Object Types(对象类型)
 * @flow
 */
let obj1: { foo: boolean } = { foo: true }; // Works.
obj1.bar = true; // Error!
obj1.foo = 'hello'; // Error!

let obj2: {
  foo: number,
  bar: boolean,
  baz: string,
} = {
  foo: 1,
  bar: true,
  baz: 'three',
}; // Works.

let obj3: { foo: string, bar: boolean };
obj3 = { foo: 'foo', bar: true };
obj3 = { foo: 'foo' };
```

### 更多类型查看[types](https://flow.org/en/docs/types/)
