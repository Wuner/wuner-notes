# [外部扩展(Externals)](https://webpack.js.org/configuration/externals/)

`externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法。相反，所创建的 bundle 依赖于那些存在于用户环境(consumer's environment)中的依赖。此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。

> 用户(consumer)，在这里是指，引用了「使用 webpack 打包的 library」的所有终端用户的应用程序(end user application)。

## externals

`string` `array` `object` `function` `regex`

防止将某些 `import` 的包(package)打包到 `bundle` 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

### 例如，从 CDN 引入 jQuery，而不是把它打包：

`index.html`

```
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

`webpack.config.js`

```
externals: {
  jquery: 'jQuery'
}
```

这样就剥离了那些不需要改动的依赖模块，换句话，下面展示的代码还可以正常运行：

```
import $ from 'jquery';

$('.my-element').animate(...);
```
