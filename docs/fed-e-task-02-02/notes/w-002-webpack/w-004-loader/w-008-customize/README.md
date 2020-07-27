# Webpack [开发一个 Loader](https://www.webpackjs.com/contribute/writing-a-loader/)

loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 loader API，并通过 this 上下文访问。

## 简单用法

当一个 loader 在资源中使用，这个 loader 只能传入一个参数 - 这个参数是一个包含包含资源文件内容的字符串

同步 loader 可以简单的返回一个代表模块转化后的值。在更复杂的情况下，loader 也可以通过使用 this.callback(err, values...) 函数，返回任意数量的值。错误要么传递给这个 this.callback 函数，要么扔进同步 loader 中。

loader 会返回一个或者两个值。第一个值的类型是 JavaScript 代码的字符串或者 buffer。第二个参数值是 SourceMap，它是个 JavaScript 对象。

## 复杂用法

当链式调用多个 loader 的时候，请记住它们会以相反的顺序执行。取决于数组写法格式，从右向左或者从下向上执行。

- 最后的 loader 最早调用，将会传入原始资源内容。
- 第一个 loader 最后调用，期望值是传出 JavaScript 和 source map（可选）。
- 中间的 loader 执行时，会传入前一个 loader 传出的结果。

## 案例

这里开发一个解析 md 文件 loader

### 安装

```
npm i marked -D
```

### 编写 loader

markdown-loader.js

```javascript
/**
 * @author Wuner
 * @date 2020/7/23 11:28
 * @description
 */
const marked = require('marked');
module.exports = function (source) {
  const content = marked(source);
  // 需要返回包含默认导出文本的 JavaScript 模块
  return `module.exports = ${JSON.stringify(content)}`;
};
```

## 用法

```javascript
import md from './md/README.md';
```

webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: { loader: './src/loader/markdown-loader' },
      },
    ],
  },
};
```
