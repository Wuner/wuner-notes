# 作业

## [学习笔记](/fed-e-task-02-02/notes/README.md)

## 题目

### 简答题

1. Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

   1. `webpack`构建时，`entry`来指定`webpack`从哪个模块开始递归的构建其内部依赖关系图；
   2. `webpack`会找出入口点直接或间接依赖的模块和库, 每找到一个模块，就会根据 `module.rules` 里配置的`loader`进行相应的转换处理，并将有效模块添加到依赖关系图；
   3. `webpack`在整个构建过程中，会在恰当的时机执行 plugins 里配置的插件进行优化任务；
   4. 递归完后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 `entry` 配置生成代码块 `chunk`；
   5. 最后`webpack`会将所有的`chunk`转换成文件输出到`output`指定的输出路径的文件夹中。

1. Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

   loader 用于对模块的源代码进行转换；插件目的在于解决 loader 无法实现的其他事。

   - [开发一个 Loader](./notes/w-002-webpack/w-004-loader/w-008-customize)
   - [开发一个插件](./notes/w-002-webpack/w-005-plugins/w-100-customize)

### 编程题

使用 Webpack 实现 Vue 项目打包任务
