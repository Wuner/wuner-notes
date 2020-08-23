# 扩展

## 一、Yeoman 之类的工具到底有啥用？

### Yeoman 之类工具的定位

1. vue-cli 或者 create-react-app 创建出来的都是适用于绝大部分项目的基础结构，所以生成的结构往往是极简的（不包含基础代码的）
   1. 只是针对特定框架类型的项目
   2. 对于实际业务项目开发来说，生成的项目结构过于简单
2. 而很多时候我们在同一个公司的不同项目中还有很多基础设施都是相同的，例如 axios 的包装、路由鉴权等，所以也应该放进脚手架模版中
3. 这种情况下，很多公司或团队就会选择开发自己的脚手架工具，以符合自身需要

### 常用实践

- 基于 Yeoman 写 Generator
  - yeoman 是一个脚手架平台
- 自己造轮子
  - Metalsmith

---

## 二、Gulp vs. Webpack

- Gulp 不具备任何具体功能，完全自主，自定义性强
  - Tasks Runner
  - 需要开发者自己实现各种功能
  - 对 Node.js 储备要求高
  - 强调任务的概念，Gulp 本身实际上是一个任务调度工具（tasks runner）
  - 通俗点说：Gulp 就是你想干什么就干什么～
- Webpack 从模块打包出发，通过插件实现一部分 Web 项目的自动化任务
  - 开箱即用，相对门槛更低
  - 主要应对 SPA 类应用的模块打包

因为近几年 Webpack 的插件生态很好，

以往我们使用 Gulp 去实现的常用自动化工作现在都可以使用 Webpack 配合插件实现

让开发者产生二者「类似」这个误会的原因：Webpack 一直在突破边界。

### Gulp 常见场景

- 如果只是传统的静态页面开发（多页应用），注重的是页面结构与样式，建议采用 Gulp
- 小程序项目中使用 Sass / Less，Gulp
- 再者就是日常的综合事务：文件重命名 / 前后缀
- 取代：批处理/shell

### 最佳实践

- 工具层面没有唯一标准答案
- 充分掌握 Gulp 与 Webpack，因地制宜
- SPA 类使用 Webpack
- MPA 类使用 Gulp
- 如果只是个别的需求直接使用 npm scripts 配合个别工具就好
  - 例如：只需要校验代码，单独使用 ESLint 的 CLI 就可以
  - npm scripts 就是小型 tasks runner

```json
{
  "scripts": {
    "clean": "rimraf lib",
    "lint": "eslint \"**/*.ts\"",
    "compile": "tsc --project .",
    "build": "run-s clean lint compile",
    "test:unit": "jest src",
    "test:integration": "jest test",
    "test": "run-s test:*",
    "coverage": "jest --coverage",
    "preship": "run-s build",
    "ship": "npm publish --registry https://registry.npmjs.org"
  }
}
```

每一个 script 都可以有 prexxx postxxx 钩子。

Node.js

---

## 三、近期常见问题

### npm or yarn

包管理工具

`yarn.lock / package-lock.json`

yarn / npx

yarn 可以自动找到 node_modules/.bin 下的可执行文件，npx 也可以

npx 可以直接执行 远端（线上）模块，一次性使用

### 全局安装 or 本地安装

全局安装模块：只有本地经常用到，而且**与某一个特定项目无关**的工具或者模块

脚手架类型的工具，建议使用 npx / yarn create，一次性使用

其他所有的模块都应该安装到项目本地。也就是在 package.json 声明这个依赖，便于后期管理

### 全局安装模块 cli 找不到的问题

```shell
$ npm config get prefix # 获取 npm 全局目录
$ yarn config get prefix
```

解决办法：先找到你这个模块具体安装到哪了，然后确保这个路径出现在 PATH

执行一个命令：

1. 先去找当前 cwd 中有没有这样一个可执行文件，例如`.exe`,`.cmd`
2. 如果找到了就直接执行这个文件
3. 找不到就会读取环境变量当中的 PATH
4. 依次去找 PATH 中配置的每一个路径
5. 找不到报错

Windows

- CMD：set PATH
- PowerShell：\$env: PATH
- where xxx 找到这个命令所在的路径(cmd 支持)

macOS

- echo \$PATH
- which xxx 找到这个命令所在的路径

### `yarn <cli-name>` 或者 `npx <cli-name>`

Node CLI 类型的模块都会提供了一个或多个 CLI 程序，所以本地安装完这些过后，在项目的 node_modules 下的 .bin 目录里就会多出一个或者多个可执行文件。后续我们可以直接通过命令去使用这个 CLI 程序。

当然了，通过前面的介绍你应该了解过，对于 node_modules 下 .bin 目录里的可执行文件，我们可以通过 npx 或者 yarn 命令快速找到，不必使用完整的路径去访问。

那如果你使用的是 yarn，你就可以直接执行 yarn `<cli-name>`，这样的话 yarn 会自动找到 bin 目录下的 `<cli-name>` 文件。

我这里使用的是 npm 工具，所以我需要使用 `npx <cli-name>`。注意这里是 npx 命令，而不是 npm。

npx 是 npm 最新版本中集成的一个工具，也就是说你只要安装了最新版的 npm 工具，你就可以直接使用 npx 命令。

### yarn link / npm link

chmod 755 cli.js

chmod +x cli.js

### node cli 程序的权限问题

![note](./imgs/1.png)

http://c.biancheng.net/view/757.html

### 控制台卡死问题

![note](./imgs/2.png)

只要左上角的标题栏变成选择 xxx，这个时候就像是截图一样，cmd 会停留在快照状态

## 四、补充内容

- https://github.com/zce/zce-cli
- https://github.com/zce/m2i

---

## 五、Node.js 的定位

> 目前前端开发对 Node.js 的定位？

### Node 是什么？

~~框架，库，语言~~

**Node.js 是一个 JavaScript 运行平台 / 运行时。**

### 什么是平台 / 运行时？

![note](./imgs/3.png)

平台一般就是指一个运行环境，开发者可以使用某一门指定的编程语言，基于这个环境开发应用。

换个角度来说**平台就是为编程语言「赋能」，让编程语言具备实际「能力」**。

![note](./imgs/4.png)

![note](./imgs/5.png)

### Node.js 可以做什么？

平台的作用就是提供舞台，所以理论上平台没有绝对只能干什么的说法。

但是不同的平台在提供 APIs 不同，所以我们能够做的事情也不同。例如：浏览器作为一个运行环境，我们能够使用 JavaScript 操作界面上的 DOM 元素，但是没有办法通过 JavaScript 代码实现用户本地磁盘文件的读写。

而且每个平台都有各自的特点，这些特点决定了它更适合做什么事情。

- 从技术角度来说 Node.js 平台的特点是非阻塞 IO，所以适合处理高并发请求。
- 从人员角度来说 Node.js 平台采用的语言是 JavaScript，所以适合前端开发者使用。

综上所述，Node.js 适合开发服务器端的应用层。

![note](./imgs/6.png)

## 六、开发行业必要的计算机基础

### Windows 环境变量配置

### macOS 环境变量配置

.bashrc .bash_profile

.zshrc

```shell
## load nvm
export NVM_DIR=$HOME/.nvm
[ -s $(brew --prefix nvm)/nvm.sh ] && . $(brew --prefix nvm)/nvm.sh
[ -s $(brew --prefix nvm)/bash_completion ] && . $(brew --prefix nvm)/bash_completion

## yarn global path
export PATH=$(yarn global bin):$PATH

## export mirrors
export NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
# export IOJS_ORG_MIRROR=http://npm.taobao.org/mirrors/iojs
export NVM_NODEJS_ORG_MIRROR=$NODEJS_ORG_MIRROR
# export NVM_IOJS_ORG_MIRROR=$IOJS_ORG_MIRROR
```
