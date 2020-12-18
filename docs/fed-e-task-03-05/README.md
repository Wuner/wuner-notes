# 作业

## 1、Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 响应式系统升级
   - Vue3.0 中使用 Proxy(ES6 新增)对象重写响应式系统，提升了性能和功能：
     - 可以监听动态新增的属性
     - 可以监听删除的属性
     - 可以监听数组的索引和 length 属性
   - Proxy 本身的性能就比 defineProperty 要好，另外代理对象可以拦截属性的访问、赋值、删除等操作，不需要初始化的时候遍历所有的属性，多个属性嵌套的话，只有访问某个属性的时候才会递归处理下一级的属性
   - vue2 中想要动态监听属性的变化需要使用.set 方法进行处理，而且监听不到属性的删除，对数组的索引和 length 属性的也监听不到
2. 编译优化
   - Vue.js 2.x 中通过标记静态根节点，优化 diff 的过程
   - Vue.js 3.0 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容
     - Fragments 片段，模板中可以直接放文本内容或同级标签(升级 vetur 插件)
     - 静态节点提升到 render 函数外部，只在初始化时执行一次，再次 render 无需再次执行
     - Patch flag，标记动态节点，diff 时跳过静态根节点 只需关心动态节点内容
     - 缓存事件处理函数，减少了不必要的更新操作
3. 源码体积的优化
   - Vue.js 中移除了一些不常用的 API
     - 例如: inline-template 、filter 等，可以最终让代码的体积变小
   - Tree-shaking 依赖 ES Module，也就是 import export 通过编译阶段的静态的分析，找到没有引用的代码，直接打包的时候过滤调，让体积更小

## 2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x 使用的 Options Api 有什么区别？

- Options Api
  - Options API 包含一个描述组件选项 (data、methods、props 等)的对象
  - Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项
  - 特定的区域写特定的代码，随着业务复杂度提高，会导致后续维护复杂、复用性不高
- Composition Api
  - 提供了一组基于函数的 API，更灵活的组织组件的逻辑
  - 同一功能的代码不需要拆分，有利于对代码的提取和复用
  - 提高可读性和可维护性

代码分布图

![note](./notes/w-001-vue3.x-Introduction/imgs/1.png)

## 3、Proxy 相对于 Object.defineProperty 有哪些优点？

- Proxy 可以直接监听整个对象而非属性。
- Proxy 是以非侵入的方式监管了对象的读写，不会修改原对象
- Proxy 可以直接监听数组的变化。
- Proxy 除了有 set 和 get 监听之外，还有 ownKeys、deleteProperty、has 等是 Object.defineProperty 不具备的

## 4、Vue 3.0 在编译方面有哪些优化？

- Vue.js 3.0 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容
- Fragments 片段，模板中可以直接放文本内容或同级标签(升级 vetur 插件)
- 静态节点提升到 render 函数外部，只在初始化时执行一次，再次 render 无需再次执行
- Patch flag，标记动态节点，diff 时跳过静态根节点 只需关心动态节点内容
- 缓存事件处理函数，减少了不必要的更新操作

## 5、Vue.js 3.0 响应式系统的实现原理？

- vue 3.0 通过 proxy 或 Object.defineProperty（为了支持 IE 浏览器），对数据进行劫持
- Proxy 对象实现属性监听，不需要初始化的时候就遍历所有的属性将其转换为响应式数据
- Proxy 多层属性嵌套，只有在访问属性过程中处理下一级属性
- Proxy 在 get 中调用 track 函数收集依赖
- Proxy 在 set 中调用 trigger 函数触发更新
