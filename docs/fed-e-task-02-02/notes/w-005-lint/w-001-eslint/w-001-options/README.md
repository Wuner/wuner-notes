# ESLint 配置

## [parserOptions](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-parser-options)

ESLint 允许你指定你想要支持的 JavaScript 语言选项。默认情况下，ESLint 支持 ECMAScript 5 语法。你可以覆盖该设置，以启用对 ECMAScript 其它版本和 JSX 的支持。

## [parser](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-parser)

ESLint 默认使用 Espree 作为其解析器，你可以在配置文件中指定一个不同的解析器，只要该解析器符合下列要求：

1. 它必须是一个 Node 模块，可以从它出现的配置文件中加载。通常，这意味着应该使用 npm 单独安装解析器包。
2. 它必须符合 parser interface。

## [processor](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-processor)

插件可以提供处理器。处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。或者处理器可以在预处理中转换 JavaScript 代码。

若要在配置文件中指定处理器，请使用 processor 键，并使用由插件名和处理器名组成的串接字符串加上斜杠。

## [env](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-environments)

一个环境定义了一组预定义的全局变量。

## [globals](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-globals)

当访问当前源文件内未定义的变量时，no-undef 规则将发出警告。如果你想在一个源文件里使用全局变量，推荐你在 ESLint 中定义这些全局变量，这样 ESLint 就不会发出警告了。你可以使用注释或在配置文件中定义全局变量。

## [plugins](https://eslint.bootcss.com/docs/user-guide/configuring#configuring-plugins)

ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。

## [rules](https://eslint.bootcss.com/docs/user-guide/configuring#configuring-rules)

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。

为了在文件注释里配置规则，使用以下格式的注释：

```javascript
/* eslint eqeqeq: "off", curly: "error" */
```

在这个例子里，eqeqeq 规则被关闭，curly 规则被打开，定义为错误级别。你也可以使用对应的数字定义规则严重程度：

```javascript
/* eslint eqeqeq: 0, curly: 2 */
```

这个例子和上个例子是一样的，只不过它是用的数字而不是字符串。eqeqeq 规则是关闭的，curly 规则被设置为错误级别。

如果一个规则有额外的选项，你可以使用数组字面量指定它们，比如：

```javascript
/* eslint quotes: ["error", "double"], curly: 2 */
```

这条注释为规则 quotes 指定了 “double”选项。数组的第一项总是规则的严重程度（数字或字符串）。

## [settings](https://eslint.bootcss.com/docs/user-guide/configuring#adding-shared-settings)

ESLint 支持在配置文件添加共享设置。你可以添加 settings 对象到配置文件，它将提供给每一个将被执行的规则。如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置。

## [extends](https://eslint.bootcss.com/docs/user-guide/configuring#extending-configuration-files)

一个配置文件可以被基础配置中的已启用的规则继承。
