# Webpack [开发一个 Loader](https://www.webpackjs.com/contribute/writing-a-loader/)

loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 loader API，并通过 this 上下文访问。

这里开发一个解析 md 文件 loader

## 安装

```
npm i marked -D
```

## 编写 loader

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
