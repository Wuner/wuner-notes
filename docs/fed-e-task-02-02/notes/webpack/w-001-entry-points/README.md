# 入口起点(entry points)

在 webpack 配置中有多种方式定义 entry 属性

## 单个入口（简写）语法

用法：`entry: string|Array<string>`

webpack.config.js

```javascript
const config = {
  entry: './src/index.js',
};

module.exports = config;
```

entry 属性的单个入口语法，是下面的简写：

```javascript
const config = {
  entry: {
    main: './src/index.js',
  },
};
```

## 对象语法

用法：`entry: {[entryChunkName: string]: string|Array<string>}`

```javascript
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js',
  },
};
```

> “可扩展的 webpack 配置”是指，可重用并且可以与其他配置组合使用。这是一种流行的技术，用于将关注点(concern)从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 webpack-merge）将它们合并。

## 常见场景

## 分离 应用程序(app) 和 第三方库(vendor) 入口

```javascript
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js',
  },
};
```

## 多页面应用程序

```javascript
const config = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js',
  },
};
```
