# Vue 3.x 介绍

## Vue.js 3.x 源码组织方式

- 源码采用 TypeScript 重写
- 使用 Monorepo 管理项目结构

### packages 目录结构

```
packages
|----compiler-core.....和平台无关的编译器
|----compiler-dom......浏览器平台下的编译器，依赖于compiler-core
|----compiler-sfc......sfc(SingleFileComponent)是单文件组件的意思，用来编译单文件组件，依赖于compiler-core和compiler-dom
|----compiler-ssr......服务端渲染编译器，依赖于compiler-dom
|----reactivity........数据响应式系统，可独立使用
|----runtime-core......和平台无关的运行时
|----runtime-dom.......针对浏览器的运行时，处理原生 dom api 事件等
|----runtime-test......是一个专门为测试编译的轻量级运行时，由于这个运行时渲染出来的 DOM 树其实是一个JS 对象，所以这个js 对象可以运行在所有的环境里，可以用来测试是否渲染正确，可以用来序列化dom 以及记录某次dom 中的操作
|----server-renderer...服务端渲染
|----shared............vue内部使用公共api
|----size-check........私有的包，不会发布到npm上，用于在tree shake后，检查包的大小
|----template-explorer.浏览器里运行的实时编译组件，会输出render函数
|----vue...............用来构建完整版的vue，依赖于compiler和runtime
```

## Vue3.x 不同构建版本

- `Vue3.x` 和 `Vue2.x` 构建版本时，`Vue3.x` 不再构建 UMD 模式、因为 UMD 模块化模式，会让代码冗余
- 在 packages dist 目录文件中，存放了 `Vue3.x` 的所有构建版本

### cjs(CommonJS)

- vue.cjs.js——开发版，代码未压缩
- vue.cjs.prod.js——生产版，代码压缩

### global

可通过 `script` 标签导入，导入后，会增加一个全局的 `vue` 对象

- 完整版 `vue`，包括运行时和编译器
  - vue.global.js——开发版，代码未压缩
  - vue.global.prod.js——生产版，代码压缩
- 只有运行时
  - vue.runtime.global.js——开发版，代码未压缩
  - vue.runtime.global.prod.js——生产版，代码压缩

### browser

- 浏览器原生模块化的方式，可通过 `script` 标签导入
- esm-->EsModule
- 完整版 `vue`，包括运行时和编译器
  - vue.esm-browser.js
  - vue.esm-browser.prod.js
- 只有运行时
  - vue.runtime.esm-browser.js
  - vue.runtime.esm-browser.prod.js

### bundler

- 未打包所有代码，需要配合打包工具使用
- 内部通过 import 的方式导入 runtime-core
- vue.esm-bundler.js
  - 内部还导入了 runtime-compiler
- vue.runtime.esm-bundler.js
  - 只导入了运行时
  - vue 的最小版本
  - 脚手架默认导入的是该文件

## Composition API 设计动机

- [RFC](https://github.com/vuejs/rfcs) (Request For Comments) 通过 RFC 的确认

- Composition [API](https://composition-api.vuejs.org) RFC

### 设计动机

#### Options API

- Options API 包含一个描述组件选项 (data、methods、props 等)的对象
- Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

#### Options API Demo

```vue
<script>
export default {
  data() {
    return {
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    window.addEventListener('mousemove', this.handle);
  },
  destroyed() {
    window.removeEventListener('mousemove', this.handle);
  },
  methods: {
    handle(e) {
      this.position.x = e.pageX;
      this.positions.y = e.pageY;
    },
  },
};
</script>
```

#### Composition API

- Vue.js 3.x 新增的一组 API
- 一组基于函数的 API
- 可以更灵活的组织组件的逻辑

#### Composition Demo

```vue
<script>
import { reactive, onMounted, onUnmounted } from 'vue';
function useMousePosition() {
  const position = reactive({
    x: 0,
    y: 0,
  });
  const update = (e) => {
    position.x = e.pageX;
    position.y = e.pageY;
  };
  onMounted(() => {
    window.addEventListener('mousemove', update);
  });
  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });
  return position;
}

export default {
  setup() {
    const position = useMousePosition();
    return {
      position,
    };
  },
};

// useMousePosition提取到公共模块中，然后直接导入即可
</script>
```

#### 两种 api 代码分布对比

`Composition API` 提供了一个基于函数 `API`，让我们可以更灵活组织组件的逻辑，使用 `Composition API` 可以更合理的组织代码结构，还可把一些功能提取出来，方便其他组件复用

![note](./imgs/1.png)

## 性能提升

### 响应式系统升级

- Vue.js 2.x 中响应式吸用的核心 defineProperty
- Vue.js 3.x 中使用 Proxy 对象重写响应式系统
  - 可以监听懂爱新增的属性
  - 可以监听删除的属性
  - 可以监听数组的索引和 length 属性

## 编译优化

- Vue.js 2.x 中通过标记静态根节点，优化 diff 的过程
- Vue.js 3.x 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容

  - Fragments (升级 vetur 插件)
  - 静态提升
  - Patch flag
  - 缓存事件处理函数

- [Vue 3 Template Explorer 模板编译沙盒](https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Ctemplate%3E%5Cr%5Cn%20%20%3Cdiv%20id%3D%5C%22app%5C%22%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3E%20static%20root%5Cr%5Cn%20%20%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cbutton%20%40click%3D%5C%22handle%5C%22%3Ebutton%3C%2Fbutton%3E%5Cr%5Cn%20%20%3C%2Fdiv%3E%5Cr%5Cn%3C%2Ftemplate%3E%5Cr%5Cn%22%2C%22ssr%22%3Afalse%2C%22options%22%3A%7B%22mode%22%3A%22function%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup%22%2C%22foo%22%3A%22setup%22%2C%22bar%22%3A%22props%22%7D%7D%7D)

::: details Vue 3 Template Explorer

<iframe src="https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Ctemplate%3E%5Cr%5Cn%20%20%3Cdiv%20id%3D%5C%22app%5C%22%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3E%20static%20root%5Cr%5Cn%20%20%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cdiv%3Estatic%20node%3C%2Fdiv%3E%5Cr%5Cn%20%20%20%20%3Cbutton%20%40click%3D%5C%22handle%5C%22%3Ebutton%3C%2Fbutton%3E%5Cr%5Cn%20%20%3C%2Fdiv%3E%5Cr%5Cn%3C%2Ftemplate%3E%5Cr%5Cn%22%2C%22ssr%22%3Afalse%2C%22options%22%3A%7B%22mode%22%3A%22function%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup%22%2C%22foo%22%3A%22setup%22%2C%22bar%22%3A%22props%22%7D%7D%7D" style="width: 100%; height: 500px; border: 0px; border-radius: 4px; overflow: hidden; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial;" title="vue-20-template-compilation" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left=""></iframe>

:::

## 源码体积的优化

- Vue.js 中移除了一些不常用的 API
  - 例如: inline-template 、filter 等，可以最终让代码的体积变小
- Tree-shaking 依赖 ES Module，也就是 import export 通过编译阶段的静态的分析，找到没有引用的代码，直接打包的时候过滤调，让体积更小

## Vite

Vite 是一个构建工具，它比 webpack-cli 更快

- 现代浏览器都支持 ES Module (IE 不支持)
- 通过下面的方式加载模块
  - `<script type=" module" src="…" ></script>`
- 支持模块的 script 默认延迟加载
  - 类似于 script 标签设置 defer
  - 在文档解析完成后，触发 DOMContentLoaded 事件前执行

### Vite 介绍

Vite 使用现代浏览器支持的 ES Module 的方式，避免开发环境打包，从而提升开发速度

#### Vite as Vue-Cli

- Vite 在开发模式下不需要打包可以直接运行
- Vue-Cli 开发模式下必须对项目打包才可以运行

#### Vite 的特点

- 快速冷启动
- 按需编译
- 模块热更新
- Vite 在生产环境下使用 Rollup 打包
- 基于 ES Module 的方式打包
- Vue-Cli 使用 Webpack 打包

#### Vite 创建项目

npm

```shell
  npm init vite-app <project-name>
  cd <project-name>
  npm install
  npm run dev
```

yarn

```shell
yarn create vite-app <project-name>
cd <project-name>
yarn
yarn dev
```

基于模版创建项目

```
npm init vite-app --template react
npm init vite-app --template preact
```
