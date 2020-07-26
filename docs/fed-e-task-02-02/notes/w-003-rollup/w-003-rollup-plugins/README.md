# 插件(Plugins)

目前为止，我们通过相对路径，将一个入口文件和一个模块创建成了一个简单的 bundle。随着构建更复杂的 bundle，通常需要更大的灵活性——引入 npm 安装的模块、通过 Babel 编译代码、和 JSON 文件打交道等。

为此，我们可以用 插件(plugins) 在打包的关键过程中更改 Rollup 的行为。the Rollup wiki 维护了可用的插件列表。

| plugin                                                            | 描述                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| [@rollup/plugin-json](./w-001-rollup-plugin-json)                 | 将.json 文件转换为 ES6 模块，使 rollup 可以从 JSON 文件中读取数据 |
| [@rollup/plugin-node-resolve](./w-002-rollup-plugin-node-resolve) | 告诉 Rollup 如何查找外部模块                                      |
| [@rollup/plugin-commonjs]()                                       | 用于将 CommonJS 模块转换为 ES6                                    |
