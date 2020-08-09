# Vue.js 源码剖析-虚拟 DOM

## 什么是虚拟 DOM

虚拟 DOM(Virtual DOM) 是使用 JavaScript 对象来描述 DOM，虚拟 DOM 的本质就是 JavaScript 对象，使用 JavaScript 对象来描述 DOM 的结构。应用的各种状态变化首先作用于虚拟 DOM，最终映射到 DOM。Vue.js 中的虚拟 DOM 借鉴了 Snabbdom，并添加了一些 Vue.js 中的特性，例如：指令和组件机制。

Vue 1.x 中细粒度监测数据的变化，每一个属性对应一个 watcher，开销太大 Vue 2.x 中每个组件对应一个 watcher，状态变化通知到组件，再引入虚拟 DOM 进行比对和渲染

## 为什么要使用虚拟 DOM

- 使用虚拟 DOM，可以避免用户直接操作 DOM，开发过程关注在业务代码的实现，不需要关注如何操作 DOM，从而提高开发效率

- 作为一个中间层可以跨平台，除了 Web 平台外，还支持 SSR、Weex。

- 关于性能方面，在首次渲染的时候肯定不如直接操作 DOM，因为要维护一层额外的虚拟 DOM，如果后续有频繁操作 DOM 的操作，这个时候可能会有性能的提升，虚拟 DOM 在更新真实 DOM 之前会通过 Diff 算法对比新旧两个虚拟 DOM 树的差异，最终把差异更新到真实 DOM

## [vue 虚拟 DOM 使用](https://cn.vuejs.org/v2/guide/render-function.html)

```javascript
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level, // 标签名称
      this.$slots.default, // 子节点数组
    );
  },
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
});
```

### createElement

```javascript
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar',
      },
    }),
  ],
);
```

## 虚拟 DOM 创建过程

## vue 虚拟 DOM 源码分析

### createElement

在 vm.\_render() 中调用了用户传递的(或者编译生成的) render 函数，这个时候传递了 createElement

#### [src/core/instance/render.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/instance/render.js)

```javascript
// 对编译生成的render进行渲染的方法
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
// 对手写render函数进行渲染的方法
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
```

#### [src/core/vdom/create-element.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/vdom/create-element.js)

使用 createElement 创建 VNode，并返回给 vm.\_update，最终传递给 Watcher 对象

```javascript
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number,
): VNode {
  // 如果data存在，且存在__ob__属性，创建一个空虚拟DOM节点
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(
          data,
        )}\n` + 'Always create fresh vnode data objects in each render!',
        context,
      );
    return createEmptyVNode();
  }
  // object syntax in v-bind
  // 如果data存在，并且存在is属性，将其赋值给tag(标签)
  // <component v-bind:is="currentTabComponent"></component>
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  // 如果不存在tag，创建一个空虚拟DOM节点
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // warn against non-primitive key
  if (
    process.env.NODE_ENV !== 'production' &&
    isDef(data) &&
    isDef(data.key) &&
    !isPrimitive(data.key)
  ) {
    // 避免使用非原始值作为key
    warn(
      'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
      context,
    );
  }
  // support single function children as default scoped slot
  // 如果children是一个数组，并且数组的第一位元素是一个函数
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  // ALWAYS_NORMALIZE代表用户传入的render
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 当手写 render 函数的时候调用
    // 判断 children 的类型，如果是原始值的话转换成 VNode 的数组
    // 如果是数组的话，继续处理数组中的元素
    // 如果数组中的子元素又是数组(slot template)，递归处理
    // 如果连续两个节点都是字符串会合并文本节点
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 将二维数组转换为一维数组并返回
    // 如果 children 中有函数组件的话，函数组件会返回数组形式
    // 这时候 children 就是一个二维数组，只需要把二维数组转换为一维数组
    children = simpleNormalizeChildren(children);
  }
  let vnode, ns;
  if (typeof tag === 'string') {
    let Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    //  如果是浏览器的保留标签，创建对应的 VNode
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      // 创建vnode对象
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context,
      );
    } else if (
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // component
      // 如果是自定义组件
      // 查找自定义组件构造函数的声明
      // 根据Ctor创建组件的VNode
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    // 如果tag不是字符串，即代表其是一个组件
    // 创建组件的VNode
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) applyNS(vnode, ns);
    return vnode;
  } else {
    return createEmptyVNode();
  }
}
```

normalizeChildren

```javascript
export function normalizeChildren(children: any): ?Array<VNode> {
  // 如果children是原始值，则创建文本虚拟DOM节点，并返回
  // 如果是数组，使用normalizeArrayChildren方法，递归children并创建的文本虚拟DOM节点的一维数组，并返回
  // 否则返回undefined
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
    ? normalizeArrayChildren(children)
    : undefined;
}
```

normalizeArrayChildren

```javascript
function normalizeArrayChildren(
  children: any,
  nestedIndex?: string,
): Array<VNode> {
  const res = [];
  let i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    // 如果c为undefined或者null，或者是Boolean类型，则跳过该循环，执行下一次循环
    if (isUndef(c) || typeof c === 'boolean') continue;
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    // 如果c是一个数组，递归
    if (Array.isArray(c) && c.length > 0) {
      c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`);
      // merge adjacent text nodes
      // 合并相邻的文本节点
      if (isTextNode(c[0]) && isTextNode(last)) {
        // 创建文本虚拟DOM节点
        res[lastIndex] = createTextVNode(last.text + (c[0]: any).text);
        // 删除数组的第一个元素
        c.shift();
      }
      // 合并两个数组
      res.push.apply(res, c);
    } else if (isPrimitive(c)) {
      // 如果c是原始值
      // r如果last是文本节点
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        // 合并相邻的文本节点
        // 这对于SSR水化来说是必需的
        // 因为文本节点在呈现为HTML字符串时基本上已经合并
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        // 创建文本虚拟DOM节点，并添加到res数组中
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        // 合并相邻的文本节点
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (
          isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)
        ) {
          c.key = `__vlist${nestedIndex}_${i}__`;
        }
        res.push(c);
      }
    }
  }
  return res;
}
```

### update

- update 方法的作用是通过 patch 方法把 VNode 渲染成真实的 DOM

- 首次渲染和数据更新都会调用\_update

- [src/core/instance/lifecycle.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/instance/lifecycle.js)

```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  if (vm._isMounted) {
    callHook(vm, 'beforeUpdate');
  }
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  // 如果当前vue实例不存在vnode，则代表是首次渲染
  if (!prevVnode) {
    // initial render
    // 这时使用vm.__patch__方法传入真实DOM(vm.$el)，并转换为虚拟DOM，与传入的vnode进行比较
    // 返回真实DOM赋值给vm.$el
    vm.$el = vm.__patch__(
      vm.$el,
      vnode,
      hydrating,
      false /* removeOnly */,
      vm.$options._parentElm,
      vm.$options._refElm,
    );
    // no need for the ref nodes after initial patch
    // this prevents keeping a detached DOM tree in memory (#5851)
    vm.$options._parentElm = vm.$options._refElm = null;
  } else {
    // updates
    // 使用vm.__patch__方法传入新旧vnode进行比较
    // 返回真实DOM赋值给vm.$el
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  activeInstance = prevActiveInstance;
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

### patch

#### 功能

- 如果是首次渲染的话，会把真实 DOM 先转换成
  VNode
- 传入新旧 VNode，对比差异，把差异渲染到 DOM
- 返回新的 VNode 的真实 DOM

#### patch 初始化过程

- [src/platforms/web/runtime/index.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/platforms/web/runtime/index.js)

```javascript
// __patch__方法将虚拟dom转换为真实dom
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

- [src/platforms/web/runtime/patch.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/platforms/web/runtime/patch.js)

```javascript
/* @flow */
// nodeOps里是各种DOM操作函数
import * as nodeOps from 'web/runtime/node-ops';
import { createPatchFunction } from 'core/vdom/patch';
// 指令和钩子函数
import baseModules from 'core/vdom/modules/index';
// DOM节点的属性/事件/样式的操作
import platformModules from 'web/runtime/modules/index';

// the directive module should be applied last, after all
// built-in modules have been applied.
// 合并指令和钩子函数和DOM节点的属性/事件/样式的操作
const modules = platformModules.concat(baseModules);

export const patch: Function = createPatchFunction({ nodeOps, modules });
```

- [src/core/vdom/patch.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/vdom/patch.js)

```javascript
export function createPatchFunction(backend) {
  let i, j;
  const cbs = {};

  // modules 节点的属性/事件/样式的操作
  // nodeOps 节点操作
  const { modules, nodeOps } = backend;

  for (i = 0; i < hooks.length; ++i) {
    // 初始化create、activate、update、remove、destroy钩子函数回调数组
    // cbs['update'] = []
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        // 把模块中的钩子函数全部设置到 cbs 中，将来统一触发
        // cbs['update'] = [updateAttrs, updateClass, update...]
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

...

return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {...}
}
```

#### patch 执行过程

```javascript
function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
  // 如果新的虚拟节点不存在，并且旧的虚拟节点存在，则执行destroy钩子函数，并直接返回，阻止向下执行
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
    return;
  }

  let isInitialPatch = false;
  // 新插入虚拟节点队列数组
  const insertedVnodeQueue = [];

  // 如果旧的虚拟节点不存在
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    // 标记当前虚拟节点已创建，只存储在内存中，未挂载到DOM树上
    isInitialPatch = true;
    // 将新的虚拟节点转换为真实DOM
    createElm(vnode, insertedVnodeQueue, parentElm, refElm);
  } else {
    // 如果存在nodeType，则是真实DOM
    const isRealElement = isDef(oldVnode.nodeType);
    // 如果不是真实DOM，并且新旧虚拟节点相同
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      // 调用patchVnode，通过diff算法，对比新旧节点的差异，并更新
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
    } else {
      // 否则
      // 如果是真实DOM
      if (isRealElement) {
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        // 如果是元素节点，并且该节点存在data-server-rendered属性
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          // 移除data-server-rendered属性
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode;
          } else if (process.env.NODE_ENV !== 'production') {
            warn(
              'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.',
            );
          }
        }
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        // 将真实DOM转换为虚拟节点并赋值给旧的虚拟节点
        oldVnode = emptyNodeAt(oldVnode);
      }
      // replacing existing element
      // 获取旧的虚拟节点的真实DOM元素
      const oldElm = oldVnode.elm;
      // 获取旧的虚拟节点的父元素节点
      const parentElm = nodeOps.parentNode(oldElm);
      // 调用createElm方法将新的虚拟节点转换为真实DOM，并挂载到旧的虚拟节点的父元素节点上
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm),
      );

      if (isDef(vnode.parent)) {
        // component root element replaced.
        // update parent placeholder node element, recursively
        let ancestor = vnode.parent;
        const patchable = isPatchable(vnode);
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          ancestor = ancestor.parent;
        }
      }

      // 如果存在旧的虚拟节点的父元素节点
      if (isDef(parentElm)) {
        // 移除DOM树上对应的旧虚拟节点的真实DOM节点
        removeVnodes(parentElm, [oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        // 如果不存在旧的虚拟节点的父元素节点，并且存在tag
        // 触发destroy钩子函数
        invokeDestroyHook(oldVnode);
      }
    }
  }

  // 遍历insertedVnodeQueue数组，执行insert钩子函数
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm;
}
```

### createElm

将虚拟节点转换为真实 DOM，并挂载到 DOM 树上

```javascript
function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
  vnode.isRootInsert = !nested; // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return;
  }

  const data = vnode.data;
  const children = vnode.children;
  const tag = vnode.tag;
  // 如果是标签节点
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        inPre++;
      }
      if (
        !inPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some((ignore) => {
            return isRegExp(ignore) ? ignore.test(tag) : ignore === tag;
          })
        ) &&
        config.isUnknownElement(tag)
      ) {
        warn(
          'Unknown custom element: <' +
            tag +
            '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
          vnode.context,
        );
      }
    }
    // 如果存在ns属性，创建一个具有指定的命名空间URI和限定名称的元素，否则创建创建元素，并赋值给vnode.elm
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode);
    // 设置样式的作用域
    setScope(vnode);

    /* istanbul ignore if */
    if (__WEEX__) {
      // in Weex, the default insertion order is parent-first.
      // List items can be optimized to use children-first insertion
      // with append="tree".
      const appendAsTree = isDef(data) && isTrue(data.appendAsTree);
      if (!appendAsTree) {
        if (isDef(data)) {
          // 触发create钩子函数
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        // 将元素节点挂载到父元素节点上
        insert(parentElm, vnode.elm, refElm);
      }
      // 创建子节点真实DOM元素
      createChildren(vnode, children, insertedVnodeQueue);
      if (appendAsTree) {
        if (isDef(data)) {
          // 触发create钩子函数
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        // 将元素节点挂载到父元素节点上
        insert(parentElm, vnode.elm, refElm);
      }
    } else {
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
      insert(parentElm, vnode.elm, refElm);
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      inPre--;
    }
  } else if (isTrue(vnode.isComment)) {
    // 如果是注释节点
    // 创建注释节点，并赋值给vnode.elm
    vnode.elm = nodeOps.createComment(vnode.text);
    // 将元素节点挂载到父元素节点上
    insert(parentElm, vnode.elm, refElm);
  } else {
    // 否则
    // 创建文本节点，并赋值给vnode.elm
    vnode.elm = nodeOps.createTextNode(vnode.text);
    // 将元素节点挂载到父元素节点上
    insert(parentElm, vnode.elm, refElm);
  }
}
```

### patchVnode

对比新旧节点的差异，并更新

```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // 如果新旧虚拟节点相等，直接返回，阻止向下执行
  if (oldVnode === vnode) {
    return;
  }

  const elm = (vnode.elm = oldVnode.elm);

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return;
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  let i;
  const data = vnode.data;
  // 执行用户传过来的钩子函数
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }

  // 获取旧虚拟节点的子节点
  const oldCh = oldVnode.children;
  // 获取新虚拟节点的子节点
  const ch = vnode.children;
  if (isDef(data) && isPatchable(vnode)) {
    // 执行update钩子函数，操作节点的属性/样式/事件....
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    // 执行用户自定义的钩子函数
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  // 如果新虚拟节点不存在text属性
  if (isUndef(vnode.text)) {
    // 新旧虚拟节点都存在子节点
    if (isDef(oldCh) && isDef(ch)) {
      // 如果新旧虚拟节点的子节点不一致，调用 updateChildren方法，对子节点进行 diff 操作，并更新
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    } else if (isDef(ch)) {
      // 如果新虚拟节点存在子节点，旧虚拟节点不存在子节点
      // 如果旧虚拟节点存在text属性，清空旧节点 DOM 的文本内容
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
      // 为子节点创建真实DOM元素，并挂载到DOM树上
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      // 如果旧虚拟节点存在子节点，新虚拟节点不存在子节点
      // 移除旧虚拟节点的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      // 如果新旧虚拟节点不存在子节点，并且旧虚拟节点存在text属性
      // 清空旧节点 DOM 的文本内容
      nodeOps.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // 如果新旧虚拟节点的text属性都存在，并且不一致
    // 修改文本内容
    nodeOps.setTextContent(elm, vnode.text);
  }
  // 触发用户传入的postpatch钩子函数
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}
```

### [updateChildren](../../../fed-e-task-03-01/notes/w-003-virtual-dom/w-002-resolve-snabbdom-souce/#updatechildren)

该方法与 Snabbdom 中的 updateChildren 整体算法 一致。

在 patch 函数中，调用 patchVnode 之前，会首先调用 sameVnode()判断当前的新旧虚拟节点是否是相同节点，sameVnode() 中会首先判断 key 是否相同。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>key</title>
  </head>
  <body>
    <div id="app">
      <button @click="handler">按钮</button>
      <ul>
        <!-- <li v-for="value in arr">{{value}}</li> -->
        <li v-for="value in arr" :key="value">{{value}}</li>
      </ul>
    </div>
    <script src="../../dist/vue.js"></script>
    <script>
      const vm = new Vue({
        el: '#app',
        data: {
          arr: ['a', 'b', 'c', 'd'],
        },
        methods: {
          handler() {
            this.arr.splice(1, 0, 'x');
            // this.arr = ['a', 'x', 'b', 'c', 'd']
          },
        },
      });
    </script>
  </body>
</html>
```

> 当没有设置 key 的时候，在 updateChildren 中比较子节点的时候，会做三次更新 DOM 操作和一次插入 DOM 的操作

> 当设置 key 的时候，在 updateChildren 中比较子节点的时候，因为 oldVnode 的子节点的 b,c,d 和 newVnode 的 b,c,d 的 key 相同，所以只做比较，没有更新 DOM 的操作，当遍历完毕后，会再把 x 插入到 DOM 上，DOM 操作只有一次插入操作。

### 总结

![note](./imgs/1.png)
