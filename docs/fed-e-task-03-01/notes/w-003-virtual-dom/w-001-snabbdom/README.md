# [Snabbdom](https://github.com/snabbdom/snabbdom)

[中文翻译](https://github.com/coconilu/Blog/issues/152)

## Snabbdom 基本使用

为了方便使用[parcel](../../../../fed-e-task-02-02/notes/w-004-parcel)打包工具

### 安装

```
npm i snabbdom -D
```

### 导入 Snabbdom

```js
import { init } from 'snabbdom/init';
import { h } from 'snabbdom/h'; // helper function for creating vnodes
```

如果遇到下面的错误

**Cannot resolve dependency 'snabbdom/init'**

因为模块路径并不是 snabbdom/int，这个路径是作者在 package.json 中的 exports 字段设置的，而我们使用的打包工具不支持 exports 这个字段，webpack 4 也不支持，webpack 5 beta 支持该字段。该字段在导入 snabbdom/init 的时候会补全路径成 snabbdom/build/package/init.js。

```json
{
  "exports": {
    "./init": "./build/package/init.js",
    "./h": "./build/package/h.js",
    "./helpers/attachto": "./build/package/helpers/attachto.js",
    "./hooks": "./build/package/hooks.js",
    "./htmldomapi": "./build/package/htmldomapi.js",
    "./is": "./build/package/is.js",
    "./jsx": "./build/package/jsx.js",
    "./modules/attributes": "./build/package/modules/attributes.js",
    "./modules/class": "./build/package/modules/class.js",
    "./modules/dataset": "./build/package/modules/dataset.js",
    "./modules/eventlisteners": "./build/package/modules/eventlisteners.js",
    "./modules/hero": "./build/package/modules/hero.js",
    "./modules/module": "./build/package/modules/module.js",
    "./modules/props": "./build/package/modules/props.js",
    "./modules/style": "./build/package/modules/style.js",
    "./thunk": "./build/package/thunk.js",
    "./tovnode": "./build/package/tovnode.js",
    "./vnode": "./build/package/vnode.js"
  }
}
```

**解决方法一**：安装 Snabbdom@v0.7.4 版本

**解决方法二**：导入 init、h，以及模块只要把把路径补全即可。

```js
import { h } from 'snabbdom/build/package/h';
import { init } from 'snabbdom/build/package/init';
import { classModule } from 'snabbdom/build/package/modules/class';
```

[作者关于该问题的回复](https://github.com/snabbdom/snabbdom/issues/723)

### 使用

- init() 是一个高阶函数，返回 patch()
- h() 返回虚拟节点 VNode，这个函数我们在使用 Vue.js 的时候见过

```javascript
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
```

- thunk() 是一种优化策略，可以在处理不可变数据时使用

### demo

```javascript
/**
 * @author Wuner
 * @date 2020/8/1 10:05
 * @description
 */
import { h } from 'snabbdom/build/package/h';
import { init } from 'snabbdom/build/package/init';
// 使用init()函数创建patch()
// init()的参数是一个数组，用于导入模块，处理属性/样式/事件等
let patch = init([]);

// 使用h()函数创建Vnode
let vnode = h('div#second', [h('h1', '基本使用2'), h('p', 'hello world')]);

let appEl = document.querySelector('#app');

// 把vnode渲染到空的DOM元素（替换）
// 会返回新的vnode
let oldVnode = patch(appEl, vnode);

setTimeout(() => {
  vnode = h('div#second', [h('h1', '基本使用2'), h('p', 'hello snabbdom')]);
  // 把老的视图更新到新的状态
  oldVnode = patch(oldVnode, vnode);

  setTimeout(() => {
    // 卸载DOM，文档中patch(oldVnode,null)有误
    // h('!')创建注释
    patch(oldVnode, h('!'));
  }, 1000);
}, 2000);
```

## Snabbdom 模块使用

Snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果需要处理的话，可以使用模块

### 常用模块

- 官方提供了 6 个模块
  - attributes
    - 设置 DOM 元素的属性，使用 setAttribute ()
    - 处理布尔类型的属性
  - props
    - 和 attributes 模块相似，设置 DOM 元素的属性 element[attr] = value
    - 不处理布尔类型的属性
  - class
    - 切换类样式
    - 注意：给元素设置类样式是通过 sel 选择器
  - dataset
    - 设置 data-\* 的自定义属性
  - eventListeners
    - 注册和移除事件
  - style
    - 设置行内样式，支持动画
    - delayed/remove/destroy

### demo

```javascript
/**
 * @author Wuner
 * @date 2020/8/1 11:40
 * @description
 */
import { init } from 'snabbdom/build/package/init';
import { h } from 'snabbdom/build/package/h';

// 导入需要的模块
import { styleModule } from 'snabbdom/build/package/modules/style';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners';

// 使用 init() 函数创建 patch()
// init() 的参数是数组，将来可以传入模块，处理属性/样式/事件等
let patch = init([
  // 注册模块
  styleModule,
  eventListenersModule,
]);

// 使用 h() 函数创建 vnode
let vnode = h(
  'div#third',
  {
    // 设置 DOM 元素的行内样式
    style: {
      backgroundColor: '#999',
    },
    // 注册事件
    on: {
      click: clickHandel,
    },
  },
  [h('h1', '模块使用'), h('p', 'hello snabbdom module use')],
);

function clickHandel() {
  // 此处的 this 指向对应的 vnode
  console.log('我点击了', this.elm.innerHTML);
}

let appEl = document.querySelector('#app');
patch(appEl, vnode);
```
