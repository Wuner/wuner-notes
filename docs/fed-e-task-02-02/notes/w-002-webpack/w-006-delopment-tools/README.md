# 开发工具

在每次编译代码时，手动运行 npm run build 会显得很麻烦。

webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

- webpack watch mode(webpack 观察模式)
- webpack-dev-server
- webpack-dev-middleware

大多数场景下我们会使用 webpack-dev-server

## 使用 watch mode(观察模式)

你可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。

启动 webpack watch mode

```text
webpack --watch
```

如果能够自动刷新浏览器就更好了，因此接下来我们会尝试通过 webpack-dev-server 实现此功能。

缺点:

- 每次编译都要读写磁盘
- 为了看到修改后的实际效果，你需要刷新浏览器

## 使用 webpack-dev-server
