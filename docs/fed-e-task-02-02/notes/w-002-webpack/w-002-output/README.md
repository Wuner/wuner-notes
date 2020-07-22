# 输出(output)

配置 output 选项可以控制 webpack 如何向硬盘写入编译文件。注意，虽然可以存在多个入口起点，但只指定一个输出配置。

## 用法(Usage)

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

## 多个入口起点

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
