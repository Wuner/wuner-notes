# [Webpack](https://www.webpackjs.com/concepts/entry-points/)
本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

## 入口起点(entry points)

在 webpack 配置中有多种方式定义 entry 属性

#### 单个入口（简写）语法

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

#### 对象语法

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

#### 常见场景

###### 分离 应用程序(app) 和 第三方库(vendor) 入口

```javascript
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js',
  },
};
```

#### 多页面应用程序

```javascript
const config = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js',
  },
};
```

## 输出(output)

配置 output 选项可以控制 webpack 如何向硬盘写入编译文件。注意，虽然可以存在多个入口起点，但只指定一个输出配置。

#### 用法(Usage)

在 webpack 中配置 output 属性的最低要求是，将它的值设置为一个对象，包括以下两点：

- filename 用于输出文件的文件名。 -目标输出目
- path 的绝对路径。

webpack.config.js

```javascript
const config = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};

module.exports = config;
```

#### 多个入口起点

如果配置创建了多个单独的 "chunk"（例如，使用多个入口起点或使用像 splitChuckPlugin ---> webpack 4.0 后提供 这样的插件），则应该使用[占位符(substitutions)](https://www.webpackjs.com/configuration/output/##output-filename)来确保每个文件具有唯一的名称。

```javascript
const config = {
  entry: {
    app: './src/app.js',
    search: './src/search.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
};

// 写入到硬盘：./dist/app.js, ./dist/search.js
```
