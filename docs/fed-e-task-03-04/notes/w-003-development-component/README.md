# 封装 Vue.js 组件库

## 组件库介绍

### 开源组件库

- Element-UI
- IView
- Vant

### CDD(组件设计文档)

- 自下而上
- 从组件级别开始，到页面级别结束

#### CDD 的好处

- 组件在最大程度上被重用
- 并行开发
- 可视化测试

## 处理组件边界情况

vue 中处理组件边界情况的 API

### `$root`

当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。

### `$parent`

父实例，如果当前实例有的话。

### `$children`

当前实例的直接子组件。需要注意 `$children` 并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用 `$children` 来进行数据绑定，考虑使用一个数组配合 `v-for` 来生成子组件，并且使用 `Array` 作为真正的来源。

### `$ref`

一个对象，持有注册过 ref attribute 的所有 DOM 元素和组件实例。

### provide / inject

:::danger
`provide` 和 `inject` 主要在开发高阶插件/组件库时使用。并不推荐用于普通应用程序代码中。
:::

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。

`provide` 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的 `property`。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作。

`inject` 选项应该是：

- 一个字符串数组，或
- 一个对象，对象的 key 是本地的绑定名，value 是：
  - 在可用的注入内容中搜索用的 key (字符串或 Symbol)，或
  - 一个对象，该对象的：
    - `from` property 是在可用的注入内容中搜索用的 key (字符串或 Symbol)
    - `default` property 是降级情况下使用的 value

:::tip
提示：`provide` 和 `inject` 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。
:::

[示例](https://cn.vuejs.org/v2/api/#provide-inject)

### `$attrs`

把父组件中非 `prop` 属性绑定到内部组件

包含了父作用域中不作为 `prop` 被识别 (且获取) 的 `attribute` 绑定 (`class` 和 `style` 除外)。当一个组件没有声明任何 `prop` 时，这里会包含所有父作用域的绑定 (`class` 和 `style` 除外)，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建高级别的组件时非常有用。

### `$listeners`

把父组件中的的 DOM 对象的原生事件绑定到内部组件

包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。

## [快速原型开发](https://cli.vuejs.org/zh/guide/)

- VueCLI 中提供了一个插件可以进行原型快速开发
- 需要先额外安装一个全局的扩展:
  ```
  npm install -g @vue/cli-service-global
  ```

### Vue serve

- Vue serve 如果不指定参数默认会在当前目录找一下的入口文件
  - main.js、index.js、App.vue、app.vue
- 可以指定要加载的组件

  ```
  vue serve ./src/login.vue
  ```

你所需要的仅仅是一个 App.vue 文件：

```vue
<template>
  <h1>Hello!</h1>
</template>
```

然后在这个 App.vue 文件所在的目录下运行：

```
vue serve
```

## 组件开发

### 组件分类

- 第三方组件
- 基础组件
- 业务组件

### 步骤条例子

Steps.vue

```vue
<template>
  <div class="lg-steps">
    <div class="lg-steps-line"></div>
    <div
      class="lg-step"
      v-for="index in count"
      :key="index"
      :style="{ color: active >= index ? activeColor : defaultColor }"
    >
      {{ index }}
    </div>
  </div>
</template>

<script>
import './steps.css';
export default {
  name: 'LgSteps',
  props: {
    count: {
      type: Number,
      default: 3,
    },
    active: {
      type: Number,
      default: 0,
    },
    activeColor: {
      type: String,
      default: 'red',
    },
    defaultColor: {
      type: String,
      default: 'green',
    },
  },
};
</script>
```

steps.css

```css
.lg-steps {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.lg-steps-line {
  position: absolute;
  height: 2px;
  top: 50%;
  left: 24px;
  right: 24px;
  transform: translateY(-50%);
  z-index: 1;
  background: rgb(223, 231, 239);
}

.lg-step {
  border: 2px solid;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  z-index: 2;
  background-color: white;
  box-sizing: border-box;
}
```

Steps-test.vue

```vue
<template>
  <div>
    <steps :count="count" :active="active"></steps>
    <button @click="next">下一步</button>
  </div>
</template>

<script>
import Steps from './Steps.vue';
export default {
  components: {
    Steps,
  },
  data() {
    return {
      count: 4,
      active: 0,
    };
  },
  methods: {
    next() {
      this.active++;
    },
  },
};
</script>
```

## Monorepo

Monorepo 是管理项目代码的一个方式，指在一个项目仓库 (repo) 中管理多个模块/包 (package)，不同于常见的每个模块建一个 repo。

### 两种项目的组织方式

- Multirepo(Multiple Repository)
  - 每一个包对应一个项目
- Monorepo(Monolithic Repository)
  - 一个项目仓库管理多个模块/包
  - 一般在根目录下有个文件夹 packages，里面放所有的模块

## [Storybook](https://storybook.js.org/docs/react/get-started/introduction)

- 可视化的组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件
- 支持的框架
  - React, React Native, Vue, Angular
  - Ember, HTML, Svelte, Mithril, Riot

```
npx -p @storybook/cli sb init --type vue
```

使用 yarn 来安装依赖，因为后面会用到 yarn 的工作区

```
yarn add vue
```

```
yarn add vue-loader vue-template-compiler -D
```

启动项目

```
yarn storybook
```

## yarn workspaces

### 开启 yarn 的工作区

package.json

```
"private": true, //将来提交npm和git禁止把当前根目录内容进行提交
"workspaces": [
	"./packages/*"
]
```

### yarn workspaces 使用

给工作区根目录安装开发依赖

```
yarn add jest -D -W
```

给指定的工作区安装依赖

```
yarn workspace myy-button add lodash@4
```

给所有的工作区安装依赖

```
yarn install
```

:::tip
jest 是单元测试工具 -D 开发依赖 -W 工作区

`Monorepo` 项目都会结合 `workspaces` 来使用，`workspaces` 可以方便管理依赖，将每个工作区中的依赖提升到根目录中的 `node_modules` 中。`workspaces` 还可以管理 `scripts` 命令。
:::

## [Lerna](https://lernajs.bootcss.com/)

Lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目。

### 入门

推荐使用 Lerna 2.x 版本。

```
yarn add --global lerna
```

接下来，我们将创建一个新的 git 代码仓库：

```
git init lerna-repo && cd lerna-repo
```

现在，我们将上述仓库转变为一个 Lerna 仓库：

```
lerna init
```

### 发布

为已经更新过的软件包创建一个新版本。提示 输入新版本号并更新 git 和 npm 上的所有软件包。

参数

`--npm-tag [tagname]` — 使用给定的 npm dist-tag （默认为 latest）发布到 npm。

`--canary/-c` – 创建一个 canary 版本。

`--skip-git` – 不要运行任何 git 命令。

`--force-publish [packages]` — 强制发布 指定的一个或多个软件包（以逗号分隔）或使用 \* 表示所有软件包（对于修改过的软件包跳过 git diff 检查）。

```
lerna publish
```

## [Vue 组件的单元测试](https://vue-test-utils.vuejs.org/zh/)

使用单元测试工具对组件的状态和行为进行测试，确保组件发布之后，在项目中使用组件过程中不会出现错误。

### 组件单元测试的好处

- 提供描述组件行为的文档
- 节省手动测试的时间
- 减少研发新特性时产生的 bug
- 改进设计
- 促进重构

### 安装依赖

```
yarn add jest @vue/test-utils vue-jest babel-jest -D -W
```

### 配置测试脚本

package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Jest 配置文件

jest.config.js

```js
module.exports = {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  moduleFileExtensions: [
    'js',
    'json',
    // 告诉Jest处理`*.vue`文件
    'vue',
  ],
  transform: {
    // 用`vue-jest`处理`*.vue`文件
    '.*\\.(vue)$': 'vue-jest',
    // 用`babel-jest`处理js
    '.*\\.(js)$': 'babel-jest',
  },
};
```

### Babel 配置文件

babel.config.js

```js
module.exports = {
  presets: [['@babel/preset-env']],
};
```

Babel 桥接

```
yarn add babel-core@bridge -D -W
```

### Jest 常见 API

- 全局函数
  - describe(name, fn) 把相关测试组合在一起
  - test(name, fn) 测试方法
  - expect(value) 断言
- 匹配器
  - toBe(value) 判断值是否相等
  - toEqual(obj) 判断对象是否相等
  - toContain(value) 判断数组或者字符串是否包含
- 快照
  - toMatchSnapshot()

### Vue Test Utils 常用 API

- mount() 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
- Wrapper
  - vm : wrapper 包裹的组件实例
  - props() : 返回 Vue 实例选项中的 props 对象
  - html() : 组件生成的 HTML 标签
  - find() : 通过选择器返回匹配到的组件中的 DOM 元素
  - trigger() : 触发 DOM 原生事件，自定义事件 wrapper.vm.\$emit()

## Rollup 打包

- Rollup 是一个模块打包器
- Rollup 支持 Tree-Shaking
- 打包的结果比 Webpack 要小
- 开发框架/组件库的时候使用 Rollup 更合适

### 安装依赖

- rollup
- rollup-plugin-terser 对代码进行压缩
- rollup-plugin-vue@5.1.9 是把 vue2.x 的组件编译成 js 代码
- vue-template-compiler 把 template 转换成 render 函数

```
yarn add rollup rollup-plugin-terser rollup-plugin-vue@5.1.9 vue-template-compiler -D -W
```

### 配置

rollup.config.js 写在每个组件的目录下

```js
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';
module.exports = [
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
      },
    ],
    plugins: [
      vue({
        css: true,
        compileTemplate: true,
      }),
      terser(),
    ],
  },
];
```

然后在每个组件的 package.json 中配置脚本命令

```json
{ "scripts": { "build": "rollup -c" } }
```

### 打包

```
yarn workspace lg-steps run build
```

单个组件打包太过繁琐，现在在根目录下配置统一打包

安装依赖

```
yarn add @rollup/plugin-json rollup-plugin-postcss @rollup/plugin-node-resolve @rollup/plugin-commonjs -D -W
```

安装 cross-env，可以跨平台配置环境变量

```
yarn add cross-env -D -W
```

修改 package.json 中的打包命令

```json
{
  "scripts": {
    "build:prod": "cross-env NODE_ENV=production rollup -c",
    "build:dev": "cross-env NODE_ENV=development rollup -c"
  }
}
```

根目录创建 rollup.config.js

```js
import fs from 'fs';
import path from 'path';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'; //解析 commonjs模块的形式的包

const isDev = process.env.NODE_ENV !== 'production';

// 公共插件配置
const plugins = [
  vue({
    css: true,

    compileTemplate: true,
  }),
  json(),
  nodeResolve(),
  postcss({
    // 把css插入到style中
    // inject: true,
    // 把css放到和js同一级目录
    extract: true,
  }),
  commonjs(),
];

// 如果不是开发环境，开启压缩
isDev || plugins.push(terser());

// pacakges 文件夹路径
const root = path.resolve(__dirname, 'packages');

module.exports = fs
  .readdirSync(root)
  // 过滤，只保留文件夹
  .filter((item) => fs.statSync(path.resolve(root, item)).isDirectory())
  // 为每一个文件夹创建对应额配置
  .map((item) => {
    const pkg = require(path.resolve(root, item, 'package.json'));
    return {
      input: path.resolve(root, item, 'index.js'),
      output: [
        {
          exports: 'auto',
          file: path.resolve(root, item, pkg.main), // 读取package.json中的main属性
          format: 'cjs',
        },
        {
          exports: 'auto',
          file: path.resolve(root, item, pkg.module), // 读取package.json中的module属性
          format: 'es',
        },
      ],
      plugins: plugins,
    };
  });
```

在每个组件的 package.json 里配置 main 和 module 属性 main 当我们引用依赖时的文件地址 CommonJS 规范，module 是 es 的规范

```json
{ "main": "dist/cjs/index.js", "module": "dist/es/index.js" }
```

打包

生成的代码是压缩过的

```
yarn build:prod
```

生成的代码是没有压缩过的

```
yarn build:dev
```

## 清理组件里的文件

删除组件中的 `node_modules`

在每个组件的 package.json 中配置命令：

```json
{
  "scripts": { "clean": "lerna clean" }
}
```

现在要来安装 rimraf，来删除指定的目录

```
yarn add rimraf -D -W
```

在每个组件的 package.json 中配置命令：

```json
{
  "scripts": { "del": "rimraf dist" }
}
```

```
yarn workspaces run del
```

## 基于模板生成组件基本结构

### 安装依赖

```
yarn add plop -W -D
```

### 配置

plopfile.js

```js
module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'create a custom component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name',
        default: 'MyComponent',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{name}}/src/{{name}}.vue',
        templateFile: 'plop-template/component/src/component.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/__tests__/{{name}}.test.js',
        templateFile: 'plop-template/component/__tests__/component.test.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/stories/{{name}}.stories.js',
        templateFile: 'plop-template/component/stories/component.stories.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/index.js',
        templateFile: 'plop-template/component/index.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/LICENSE',
        templateFile: 'plop-template/component/LICENSE',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/package.json',
        templateFile: 'plop-template/component/package.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/README.md',
        templateFile: 'plop-template/component/README.hbs',
      },
    ],
  });
};
```

## 发布

```
yarn build:prod
git add .
git commit -m"最后发布"
yarn lerna
```
