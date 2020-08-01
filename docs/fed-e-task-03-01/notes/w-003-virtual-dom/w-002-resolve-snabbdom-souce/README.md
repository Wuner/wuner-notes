# Snabbdom 源码解析

## 如何学习源码

- 先宏观了解
- 带着目标看源码
- 看源码的过程要不求甚解
- 调试
- 参考资料

## Snabbdom 的核心

- 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

## Snabbdom 源码结构

```
│-----h.ts h() -----------函数，用来创建 VNode
│-----hooks.ts -----------所有钩子函数的定义
│-----htmldomapi.ts ------对 DOM API 的包装
│-----init.ts ------------设置模块，创建 patch()
│-----is.ts --------------判断数组和原始值的函数
│-----jsx-global.d.ts ----jsx 的类型声明文件
│-----jsx.ts -------------处理 jsx
│-----thunk.ts -----------优化处理，对复杂视图不可变值得优化
│-----tovnode.ts ---------DOM 转换成 VNode
│-----vnode.ts -----------虚拟节点定义
│
|-----helpers
│----------attachto.ts ---定义了 vnode.ts 中 AttachData 的数据结构
│
|-----modules ------------所有模块定义
|----------attributes.ts
|----------class.ts
|----------dataset.ts
|----------eventlisteners.ts
|----------hero.ts --------example 中使用到的自定义钩子
|----------module.ts ------定义了模块中用到的钩子函数
|----------props.ts
|----------style.ts
```

## h 函数

- h() 函数介绍

  - 在使用 Vue 的时候见过 h() 函数

    ```javascript
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
    ```

  - h() 函数最早见于 [hyperscript](https://github.com/hyperhype/hyperscript) ，使用 JavaScript 创建超文本

  - Snabbdom 中的 h() 函数不是用来创建超文本，而是创建 VNode

- 函数重载

  - 概念
    - 参数个数或类型不同的函数
    - JavaScript 中没有重载的概念
    - TypeScript 中有重载，不过重载的实现还是通过代码调整参数
  - 重载的示意

    ```javascript
    function add(a, b) {
      console.log(a + b);
    }
    function add(a, b, c) {
      console.log(a + b + c);
    }
    add(1, 2);
    add(1, 2, 3);
    ```

源码解析`src/package/h.ts`

```typescript
  import ...

  export type VNodes = VNode[];
  export type VNodeChildElement = VNode | string | number | undefined | null;
  export type ArrayOrElement<T> = T | T[];
  export type VNodeChildren = ArrayOrElement<VNodeChildElement>;

  function addNS(
    data: any,
    children: VNodes | undefined,
    sel: string | undefined,
  ): void {...}

  // h函数的重载
  export function h(sel: string): VNode;
  export function h(sel: string, data: VNodeData | null): VNode;
  export function h(sel: string, children: VNodeChildren): VNode;
  export function h(
    sel: string,
    data: VNodeData | null,
    children: VNodeChildren,
  ): VNode;
  export function h(sel: any, b?: any, c?: any): VNode {
    var data: VNodeData = {};
    var children: any;
    var text: any;
    var i: number;
    //处理参数，实现重载的机制
    if (c !== undefined) {
      // 处理三个参数的情况
      // sel、data、children/text
      if (b !== null) {
        data = b;
      }
      // 如果c是数组，则将c赋值给children
      if (is.array(c)) {
        children = c;
      } else if (is.primitive(c)) {
        // 如果c是数字或字符串类型，则将c赋值给text
        text = c;
      } else if (c && c.sel) {
        // 如果c是vnode，则将c放到数组里，赋值给children
        children = [c];
      }
    } else if (b !== undefined && b !== null) {
      // 处理两个参数的情况
      // 如果b是数组，则将b赋值给children
      if (is.array(b)) {
        children = b;
      } else if (is.primitive(b)) {
        // 如果b是数字或字符串类型，则将b赋值给text
        text = b;
      } else if (b && b.sel) {
        // 如果b是vnode，则将b放到数组里，赋值给children
        children = [b];
      } else {
        data = b;
      }
    }
    if (children !== undefined) {
      // 处理children里的原始值（string/number）
      for (i = 0; i < children.length; ++i) {
        // 如果children里的值是字符串或者数字（string/number）类型，则创建文本节点
        if (is.primitive(children[i]))
          children[i] = vnode(
            undefined,
            undefined,
            undefined,
            children[i],
            undefined,
          );
      }
    }
    if (
      sel[0] === 's' &&
      sel[1] === 'v' &&
      sel[2] === 'g' &&
      (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
    ) {
      // 如果是svg，则添加命名空间
      addNS(data, children, sel);
    }
    // 返回vnode（虚拟节点）
    return vnode(sel, data, children, text, undefined);
  }
```

## VNode

一个 VNode 就是一个虚拟节点用来描述一个 DOM 元素，如果这个 VNode 有 children 就是 Virtual DOM

源码解析`src/package/vnode.ts`

```typescript
import ...

export type Key = string | number;

export interface VNode {
  // 选择器
  sel: string | undefined;
  // 节点数据，属性、样式、事件机制等
  data: VNodeData | undefined;
  // 子节点，其和text属性互斥，只能存在一个
  children: Array<VNode | string> | undefined;
  // 记录vnode对应的真实DOM
  elm: Node | undefined;
  // 节点中的内容，其和children属性互斥，只能存在一个
  text: string | undefined;
  // 用于优化
  key: Key | undefined;
}

export interface VNodeData {...}

export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined,
): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
```

## init(src/package/init.ts)

- patch(oldVnode, newVnode)
- 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧 VNode 是否相同节点(节点的 key 和 sel 相同)
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

![note](./imgs/1.png)

### init()

- 功能：init(modules, domApi)，返回 patch() 函数（高阶函数）
- 为什么要使用高阶函数？
  - 因为 patch() 函数再外部会调用多次，每次调用依赖一些参数，比如：modules/domApi/cbs
  - 通过高阶函数让 init() 内部形成闭包，返回的 patch() 可以访问到 modules/domApi/cbs，而不需要重新创建
- init() 在返回 patch() 之前，首先收集了所有模块中的钩子函数存储到 cbs 对象中

源码解析

```typescript
import ...

type NonUndefined<T> = T extends undefined ? never : T;

function isUndef(s: any): boolean {...}
function isDef<A>(s: A): s is NonUndefined<A> {...}

type VNodeQueue = VNode[];

const emptyNode = vnode('', {}, [], undefined, undefined);

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {...}

function isVnode(vnode: any): vnode is VNode {...}

type KeyToIndexMap = { [key: string]: number };

type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>;
};

type ModuleHooks = ArraysOf<Required<Module>>;

function createKeyToOldIdx(
  children: VNode[],
  beginIdx: number,
  endIdx: number,
): KeyToIndexMap {...}

const hooks: Array<keyof Module> = [
  'create',
  'update',
  'remove',
  'destroy',
  'pre',
  'post',
];

export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number;
  let j: number;
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  // 初始化转换虚拟节点的api
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;

  // 把传入的所有模块的钩子函数，统一存储到cbs(callbacks)对象中
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      // modules传入的模块数组
      // 读取模块值的hook函数
      // 例如 hook = modules[0][create]
      const hook = modules[j][hooks[i]];
      if (hook !== undefined) {
        // 把获取到的hook函数放到cbs对应的钩子函数数组中
        (cbs[hooks[i]] as any[]).push(hook);
      }
    }
  }

  function emptyNodeAt(elm: Element) {...}

  function createRmCb(childElm: Node, listeners: number) {...}

  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {...}

  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue,
  ) {...}

  function invokeDestroyHook(vnode: VNode) {...}

  function removeVnodes(
    parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
  ): void {...}

  function updateChildren(
    parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue,
  ) {...}

  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNodeQueue,
  ) {...}

  // init内部返回patch函数，把vnode渲染成真是的DOM，并返回vnode
  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {...};
}
```

### patch

- 功能：
  - 传入新旧 VNode，对比差异，把差异渲染到 DOM
  - 返回新的 VNode，作为下一次 patch() 的 oldVnode
- 执行过程：
  - 首先执行模块中的钩子函数 pre
  - 如果 oldVnode 和 vnode 相同（key 和 sel 相同）
    - 调用 patchVnode()，找节点的差异并更新 DOM
  - 如果 oldVnode 是 DOM 元素
    - 把 DOM 元素转换成 oldVnode
    - 调用 createElm() 把 vnode 转换为真实 DOM，记录到 vnode.elm
    - 把刚创建的 DOM 元素插入到 parent 中
    - 移除老节点
    - 触发用户设置的 create 钩子函数

源码解析

- [Node.insertBefore()](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore)

```typescript
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
  let i: number, elm: Node, parent: Node;
  // 保存新插入节点的队列，为了触发钩子函数
  const insertedVnodeQueue: VNodeQueue = [];
  // 遍历cbs(callbacks)执行模块中的pre钩子函数
  for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

  // 如果不是节点时，为真实DOM创建空的虚拟节点
  if (!isVnode(oldVnode)) {
    oldVnode = emptyNodeAt(oldVnode);
  }

  // 如果老的虚拟节点和新的虚拟节点相同，则去寻找新旧节点的差异，并更新DOM
  if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
  } else {
    // 如果新旧节点不同，则vnode创建对应的DOM
    // 获取当前的DOM元素
    elm = oldVnode.elm!;
    // 获取当前DOM元素的父元素
    parent = api.parentNode(elm) as Node;

    // 触发init/create钩子函数，创建DOM
    createElm(vnode, insertedVnodeQueue);

    // 如果父元素不为空，则把vnode对应的DOM插入到文档中
    if (parent !== null) {
      api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
      // 移除老节点
      removeVnodes(parent, [oldVnode], 0, 0);
    }
  }

  // 遍历insertedVnodeQueue，如果存在用户设置的insert钩子函数，则执行该函数
  for (i = 0; i < insertedVnodeQueue.length; ++i) {
    insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i]);
  }
  // 执行模块的post钩子函数
  for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
  // 返回vnode
  return vnode;
};
```

### createElm

- 功能：
  - createElm(vnode, insertedVnodeQueue)，返回创建的 DOM 元素
  - 创建 vnode 对应的 DOM 元素
- 执行过程：
  - 首先触发用户设置的 init 钩子函数
  - 如果选择器是!，创建注释节点
  - 如果选择器为空，创建文本节点
  - 如果选择器不为空
    - 解析选择器，设置标签的 id 和 class 属性
    - 执行模块的 create 钩子函数
    - 如果 vnode 有 children，创建子 vnode 对应的 DOM，追加到 DOM 树
    - 如果 vnode 的 text 值是 string/number，创建文本节点并追击到 DOM 树
    - 执行用户设置的 create 钩子函数
    - 如果有用户设置的 insert 钩子函数，把 vnode 添加到队列中

源码解析

```typescript
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any;
  let data = vnode.data;
  // 如果存在用户设置的init钩子函数，且不为undefined，则执行该钩子函数
  if (data !== undefined) {
    const init = data.hook?.init;
    if (isDef(init)) {
      init(vnode);
      // 为什么重新赋值，是为了防止用户设置新的
      data = vnode.data;
    }
  }
  const children = vnode.children;
  const sel = vnode.sel;
  if (sel === '!') {
    if (isUndef(vnode.text)) {
      vnode.text = '';
    }
    // 创建并返回一个注释节点
    vnode.elm = api.createComment(vnode.text!);
  } else if (sel !== undefined) {
    // 如果选择器不为undefined
    // 解析选择器
    // Parse selector
    const hashIdx = sel.indexOf('#');
    const dotIdx = sel.indexOf('.', hashIdx);
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;
    const tag =
      hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
    // 如果data并且data.ns不为undefined时，创建一个具有指定的命名空间URI和限定名称的元素
    // 否则创建一个不指定命名空间URI的元素
    const elm = (vnode.elm =
      isDef(data) && isDef((i = data.ns))
        ? api.createElementNS(i, tag)
        : api.createElement(tag));
    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
    if (dotIdx > 0)
      elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
    // 遍历执行cbs(callbacks)中的create钩子函数
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
    // 如果vnode中存在子节点，创建vnode对应的DOM元素，并追加到DOM树上
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
        }
      }
    } else if (is.primitive(vnode.text)) {
      // 如果vnode中的text是string或者number类型的
      // 则创建文本节点，并追加到DOM树上
      api.appendChild(elm, api.createTextNode(vnode.text));
    }
    // 如果存在用户设置的钩子函数，并且不为undefined时
    const hook = vnode.data!.hook;
    if (isDef(hook)) {
      // 如果存在执行create钩子函数，则执行该钩子函数
      hook.create?.(emptyNode, vnode);
      if (hook.insert) {
        // 如果存在执行insert钩子函数，则把vnode添加到队列中，为后续执行insert钩子函数做准备
        insertedVnodeQueue.push(vnode);
      }
    }
  } else {
    // 如果选择器为undefined时，创建文本节点
    vnode.elm = api.createTextNode(vnode.text!);
  }
  // 返回新创建的DOM
  return vnode.elm;
}
```

### patchVnode

- 功能：
  - patchVnode(oldVnode, vnode, insertedVnodeQueue)
  - 对比 oldVnode 和 vnode 的差异，把差异渲染到 DOM
- 执行过程：
  - 首先执行用户设置的 prepatch 钩子函数
  - 执行 create 钩子函数
    - 首先执行模块的 create 钩子函数
    - 然后执行用户设置的 create 钩子函数
- 如果 vnode.text 未定义
  - 如果 oldVnode.children 和 vnode.children 都有值
    - 调用 updateChildren()
    - 使用 diff 算法对比子节点，更新子节点
  - 如果 vnode.children 有值， oldVnode.children 无值
    - 清空 DOM 元素
    - 调用 addVnodes() ，批量添加子节点
  - 如果 oldVnode.children 有值， vnode.children 无值
    - 调用 removeVnodes() ，批量移除子节点
  - 如果 oldVnode.text 有值
    - 清空 DOM 元素的内容
- 如果设置了 vnode.text 并且和 oldVnode.text 不同
  - 如果老节点有子节点，全部移除
  - 设置 DOM 元素的 textContent 为 vnode.text
- 最后执行用户设置的 postpatch 钩子函数

源码解析

```typescript
function patchVnode(
  oldVnode: VNode,
  vnode: VNode,
  insertedVnodeQueue: VNodeQueue,
) {
  // 如果存在用户设置的prepatch钩子函数，则执行该钩子函数
  const hook = vnode.data?.hook;
  hook?.prepatch?.(oldVnode, vnode);
  const elm = (vnode.elm = oldVnode.elm!);
  const oldCh = oldVnode.children as VNode[];
  const ch = vnode.children as VNode[];
  // 如果新旧节点相同，则直接返回
  if (oldVnode === vnode) return;
  if (vnode.data !== undefined) {
    // 遍历执行cbs(callbacks)中的update钩子函数
    for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    // 如果存在用户设置的update钩子函数，则执行该钩子函数
    vnode.data.hook?.update?.(oldVnode, vnode);
  }
  if (isUndef(vnode.text)) {
    // vnode中的text为undefined时

    if (isDef(oldCh) && isDef(ch)) {
      // 旧虚拟节点存在子节点并且新虚拟节点也存在子节点时
      // 如果新旧虚拟节点中的子节点不相同时，使用diff算法对比子节点，更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
    } else if (isDef(ch)) {
      // 旧虚拟节点不存在子节点并且新虚拟节点存在子节点时
      // 如果旧虚拟节点中存在text，则清空DOM元素的内容
      if (isDef(oldVnode.text)) api.setTextContent(elm, '');
      // 批量添加子节点
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      // 旧虚拟节点存在子节点并且新虚拟节点不存在子节点时
      // 批量删除子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      // 如果旧虚拟节点存在text，则清空DOM元素
      api.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // 旧虚拟节点的text与新虚拟节点的text不相同时
    // 如果旧虚拟节点存在子节点，批量删除子节点
    if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    }
    // 将DOM元素的textContent设置为vnode.text
    api.setTextContent(elm, vnode.text!);
  }
  // 如果存在用户设置的postpatch钩子函数，则执行该钩子函数
  hook?.postpatch?.(oldVnode, vnode);
}
```

### updateChildren

- 功能：
  - diff 算法的核心，对比新旧节点的 children，更新 DOM
- 执行过程：

  - 要对比两棵树的差异，我们可以取第一棵树的每一个节点依次和第二课树的每一个节点比较，但是这样的时间复杂度为 O(n^3)
  - 在 DOM 操作的时候我们很少很少会把一个父节点移动/更新到某一个子节点
  - 因此只需要找同级别的子节点依次比较，然后再找下一级别的节点比较，这样算法的时间复杂度为 O(n)

![note](./imgs/1.png)

- 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
- 在对开始和结束节点比较的时候，总共有四种情况
  - oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
  - oldStartVnode / oldEndVnode (旧开始节点 / 新结束节点)
  - oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)

![note](./imgs/2.png)

- 开始节点和结束节点比较，这两种情况类似
  - oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
- 如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)
  - 调用 patchVnode() 对比和更新节点
  - 把旧开始和新开始索引往后移动 oldStartIdx++ / oldEndIdx++

![note](./imgs/3.png)

- oldStartVnode / newEndVnode (旧开始节点 / 新结束节点) 相同
  - 调用 patchVnode() 对比和更新节点
  - 把 oldStartVnode 对应的 DOM 元素，移动到右边
  - 更新索引

![note](./imgs/4.png)

- oldEndVnode / newStartVnode (旧结束节点 / 新开始节点) 相同
  - 调用 patchVnode() 对比和更新节点
  - 把 oldEndVnode 对应的 DOM 元素，移动到左边
  - 更新索引

![note](./imgs/5.png)

- 如果不是以上四种情况
  - 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
  - 如果没有找到，说明 newStartNode 是新节点
    - 创建新节点对应的 DOM 元素，插入到 DOM 树中
  - 如果找到了
    - 判断新节点和找到的老节点的 sel 选择器是否相同
    - 如果不相同，说明节点被修改了
      - 重新创建对应的 DOM 元素，插入到 DOM 树中
    - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

![note](./imgs/6.png)

- 循环结束
  - 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，循环结束
  - 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束
- 如果老节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边

![note](./imgs/7.png)

- 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除

![note](./imgs/8.png)

源码解析

```typescript
function updateChildren(
  parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue,
) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx: KeyToIndexMap | undefined;
  let idxInOld: number;
  let elmToMove: VNode;
  let before: any;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 索引变化后，可能会把节点设置为null

    if (oldStartVnode == null) {
      // 当旧开始节点为null时，移动旧开始索引
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      // 当旧结束节点为null时，移动旧结束索引
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      // 当新开始节点为null时，移动新开始索引
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      // 当新结束节点为null时，移动新结束索引
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 旧开始节点和新开始节点相同时
      // 调用patchVnode()对比和更新节点
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      // 移动旧开始索引和移动新开始索引
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 旧结束节点和新结束节点相同时
      // 调用patchVnode()对比和更新节点
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      // 移动旧结束索引和移动新结束索引
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      // 旧开始节点和新结束节点相同时
      // 调用patchVnode()对比和更新节点
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      // 把旧开始节点对应的 DOM 元素，移动到右边
      api.insertBefore(
        parentElm,
        oldStartVnode.elm!,
        api.nextSibling(oldEndVnode.elm!),
      );
      // 移动旧开始索引和移动新结束索引
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      // 旧结束节点和新开始节点相同时
      // 调用patchVnode()对比和更新节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      // 把旧结束节点对应的 DOM 元素，移动到左边
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
      // 移动旧结束索引和移动新开始索引
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 开始节点和结束节点都不同时
      // 使用新开始节点的key在老节点数组中找相同节点
      // 根据旧节点数组生成对应的key和index的map对象
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      // 遍历开始节点，从旧节点中找相同的key的旧节点索引
      idxInOld = oldKeyToIdx[newStartVnode.key as string];
      if (isUndef(idxInOld)) {
        // New element
        // 如果旧节点索引不存在，则开始节点是一个新的节点
        // 创建DOM元素并插入DOM树
        api.insertBefore(
          parentElm,
          createElm(newStartVnode, insertedVnodeQueue),
          oldStartVnode.elm!,
        );
      } else {
        // 旧节点索引存在时，即找到了相同key的旧节点
        // 将旧节点记录到elmToMove中
        elmToMove = oldCh[idxInOld];
        if (elmToMove.sel !== newStartVnode.sel) {
          // 如果新旧节点选择器不同时，创建新开始节点对应的DOM元素，并插入到DOM树上
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!,
          );
        } else {
          // 新旧节点的选择器相同时
          // 调用patchVnode()对比和更新节点
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          // 将旧节点数组中的该索引位置的节点置为undefined
          oldCh[idxInOld] = undefined as any;
          // 把elmToMove对应的DOM元素，移到左边
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
        }
      }
      // 移动新开始索引
      newStartVnode = newCh[++newStartIdx];
    }
  }
  // 循环结束，旧节点数组先遍历完成，或新节点数组先遍历完成
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // 如果旧节点数组先遍历完成，说明有新节点剩余
      // 把剩余节点批量插入到右边
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        before,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue,
      );
    } else {
      // 如果新节点数组先遍历完成，说明有旧节点剩余
      // 把剩余节点批量移除
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
}
```

## Modules 源码

- patch() -> patchVnode() -> updateChildren()
- Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中
- 模块可以按照需要引入
- 模块的使用可以查看[官方文档](https://github.com/snabbdom/snabbdom)
- 模块实现的核心是基于 Hooks

### Hooks

钩子是一种挂钩到 DOM 节点生命周期的方法。Snabbdom 提供了丰富的钩子可以选择。模块使用钩子来扩展 Snabbdom，在普通代码中，钩子用于在虚拟节点生命周期的期望点执行任意代码。

#### 概览

| Name      | Triggered when                    | Arguments to callback |
| --------- | --------------------------------- | --------------------- |
| pre       | patch 过程开始                    | none                  |
| init      | 一个虚拟节点被添加                | vnode                 |
| create    | 基于一个虚拟节点，一个 DOM 被创建 | emptyVnode, vnode     |
| insert    | 一个元素被插入到 DOM 中           | vnode                 |
| prepatch  | 一个元素即将被修补（patched）     | oldVnode, vnode       |
| update    | 一个元素正在被更新                | oldVnode, vnode       |
| postpatch | 一个元素已经被修补完成（patched） | oldVnode, vnode       |
| destroy   | 元素被直接或间接删除              | vnode                 |
| remove    | 元素将直接从 DOM 中删除           | vnode, removeCallback |
| post      | 修补（patch）过程结束             | none                  |

以下钩子可用于模块:pre、create、update、destroy、remove、post。

以下钩子可用于单个元素的钩子属性:init、create、insert、prepatch、update、postpatch、destroy、remove。

源码解析`src/package/hooks.ts`

```typescript
export interface Hooks {
  // patch 函数开始执行的时候触发
  pre?: PreHook;
  // createElm 函数开始之前的时候触发
  // 在把 VNode 转换成真实 DOM 之前触发
  init?: InitHook;
  // createElm 函数末尾调用
  // 创建完真实 DOM 后触发
  create?: CreateHook;
  // patch 函数末尾执行
  // 真实 DOM 添加到 DOM 树中触发
  insert?: InsertHook;
  // patchVnode 函数开头调用
  // 开始对比两个 VNode 的差异之前触发
  prepatch?: PrePatchHook;
  // patchVnode 函数开头调用
  // 两个 VNode 对比过程中触发，比 prepatch 稍晚
  update?: UpdateHook;
  // patchVnode 的最末尾调用
  // 两个 VNode 对比结束执行
  postpatch?: PostPatchHook;
  // removeVnodes -> invokeDestroyHook 中调用
  // 在删除元素之前触发，子节点的 destroy 也被触发
  destroy?: DestroyHook;
  // removeVnodes 中调用
  // 元素被删除的时候触发
  remove?: RemoveHook;
  // patch 函数的最后调用
  // patch 全部执行完毕触发
  post?: PostHook;
}
```

### attributes

#### updateAttrs 函数功能

- 更新节点属性
- 如果节点属性值是 true 设置空置
- 如果节点属性值是 false 移除属性

源码解析`src/package/hooks.ts`，其他模块类似

```typescript
function updateAttrs(oldVnode: VNode, vnode: VNode): void {
  var key: string;
  var elm: Element = vnode.elm as Element;
  var oldAttrs = (oldVnode.data as VNodeData).attrs;
  var attrs = (vnode.data as VNodeData).attrs;

  // 新旧节点没有 attrs 属性，返回
  if (!oldAttrs && !attrs) return;
  // 新旧节点的 attrs 属性相同，返回
  if (oldAttrs === attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  // update modified attributes, add new attributes
  // 遍历新节点的属性
  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    // 如果新旧节点的属性值不同
    if (old !== cur) {
      // 布尔类型值的处理
      if (cur === true) {
        elm.setAttribute(key, '');
      } else if (cur === false) {
        elm.removeAttribute(key);
      } else {
        // ascii 120 -> x
        // <svg xmlns="http://www.w3.org/2000/svg">
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur as any);
        } else if (key.charCodeAt(3) === colonChar) {
          // ascii 58 -> :
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur as any);
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          // <svg xmlns="http://www.w3.org/2000/svg">
          elm.setAttributeNS(xlinkNS, key, cur as any);
        } else {
          elm.setAttribute(key, cur as any);
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  // 如果旧节点的属性在新节点中不存在，移除
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}
```
