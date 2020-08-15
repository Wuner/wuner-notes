# 组件化

- 组件化可以让我们方便的把页面拆分成多个可重用的组件
- 组件是独立的，系统内可重用，组件之间可以嵌套
- 有了组件可以像搭积木一样开发网页

  例如，你可能会有页头、侧边栏、内容区等组件，每个组件又包含了其它的像导航链接、博文之类的组件。

  ![note](./imgs/1.png)

- 下面我们将从源码的角度来分析 Vue 组件内部如何工作
  - 组件实例的创建过程是从上而下（先创建父组件再创建子组件）
  - 组件实例的挂载过程是从下而上（先挂载子组件再挂载父组件）

## 组件定义

- 注册 Vue.component()入口

[src/core/global-api/index.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/global-api/index.js)

```javascript
// 注册 Vue.directive()、 Vue.component()、Vue.filter()
initAssetRegisters(Vue);
```

[src/core/global-api/assets.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/global-api/assets.js)

```javascript
export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 遍历 ASSET_TYPES 数组，为 Vue 定义相应方法
  // ASSET_TYPES 包括了directive、 component、filter
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (
      id: string,
      definition: Function | Object,
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
                'id: ' +
                id,
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          // 把组件配置转换为组件的构造函数
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        // 全局注册，存储资源并赋值
        // 例如：this.options['components']['comp'] = definition
        // 当前this指向vue实例
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
```

[src/core/global-api/extend.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/global-api/extend.js)

```javascript
/* @flow */

import ...

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   * 每个实例构造函数（包括Vue）都具有唯一的cid。
   * 这使我们能够为创建一个包裹的“子构造函数”通过原型继承并对其进行缓存。
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    // Vue构造函数
    const Super = this
    const SuperId = Super.cid
    // 从缓存中加载组件的构造函数
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production') {
      // 如果是开发环境验证组件的名称
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        )
      }
    }

    // 组件对应的构造函数
    const Sub = function VueComponent (options) {
      // 调用 _init() 初始化
      this._init(options)
    }
    // 原型继承自 Vue
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    // 合并 options
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 对于props和计算属性，我们在Vue实例上定义代理getter时扩展原型。
    // 这样可以避免为每个创建的实例调用Object.defineProperty。
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    // 集成extension/mixin/plugin
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    // 集成directive、 component、filter
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      // 把组件构造函数保存到 Ctor.options.components.comp = Ctor
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 在扩展时保留对super 选项的引用。
    // 稍后在实例化时，我们可以检查Super的选项是否已更新。
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    // 把组件的构造函数缓存到 options._Ctor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```

## 组件创建和挂载

- 组件 VNode 的创建过程

  - 创建根组件，首次 \_render() 时，会得到整棵树的 VNode 结构
  - 整体流程：new Vue() --> \$mount() --> vm.\_render() --> createElement() --> createComponent()
  - 创建组件的 VNode，初始化组件的 hook 钩子函数

- [src/core/vdom/create-element.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/vdom/create-element.js) 中的`_createElement`方法调用了`createComponent`方法创建组件的 VNode

```javascript
...

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

...
```

- [src/core/vdom/create-component.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/vdom/create-component.js)

```javascript
/* @flow */

import ...;

// hooks to be invoked on component VNodes during patch
// 钩子函数定义的位置（init()钩子中创建组件的实例）
const componentVNodeHooks = {
  init(
    vnode: VNodeWithData,
    hydrating: boolean,
    parentElm: ?Node,
    refElm: ?Node,
  ): ?boolean {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      // 创建组件实例挂载到 vnode.componentInstance
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm,
      ));
      // 调用组件对象的 $mount()，把组件挂载到页面
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {...},

  insert(vnode: MountedComponentVNode) {...},

  destroy(vnode: MountedComponentVNode) {...},
};

const hooksToMerge = Object.keys(componentVNodeHooks);

// 创建自定义组件对应的 VNode
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string,
): VNode | void {
  if (isUndef(Ctor)) {
    return;
  }

  const baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  // 如果Ctor不是一个构造函数，是一个对象
  // 使用Vue.extend()创造一个子组件的构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  // 如果在此阶段它不是构造函数或异步组件工厂，则拒绝。
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context);
    }
    return;
  }

  // async component
  // 异步组件处理
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      // 返回异步组件的占位符节点，该占位符呈现为注释节点，但保留该节点的所有原始信息。
      // 该信息将用于异步服务器渲染和客户端激活。
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // 解析构造函数选项
  // 在组件构造函数创建后合并当前组件选项和通过vue.mixin混入的选项
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  // 将组件v-model数据转换为props 和 events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  // 提取props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  // 合并组件的钩子函数init/prepatch/insert/destroy
  // 准备好了data.hook中的钩子函数
  mergeHooks(data);

  // return a placeholder vnode
  const name = Ctor.options.name || tag;
  // 创建自定义组件的VNode，设置自定义组件的名字
  // 记录this.componentOptions = componentOptions
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory,
  );
  return vnode;
}

// 创建组件实例的位置，由自定义组件的 init() 钩子方法调用
export function createComponentInstanceForVnode(
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
  parentElm?: ?Node,
  refElm?: ?Node,
): Component {
  const vnodeComponentOptions = vnode.componentOptions;
  const options: InternalComponentOptions = {
    _isComponent: true,
    parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null,
  };
  // check inline-template render functions
  // 获取inline-template
  // 例如：<comp inline-template>xx</comp>
  const inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  // 创建组件实例
  return new vnodeComponentOptions.Ctor(options);
}

function mergeHooks(data: VNodeData) {
  if (!data.hook) {
    data.hook = {};
  }
  // 用户可以传递自定义钩子函数
  // 把用户传入的自定义钩子函数和componentVNodeHooks中预定义的钩子函数合并
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const fromParent = data.hook[key];
    // 获取钩子函数（init()钩子中创建组件的实例）
    const ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook(ours, fromParent) : ours;
  }
}

function mergeHook(one: Function, two: Function): Function {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  };
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data: any) {
  const prop = (options.model && options.model.prop) || 'value';
  const event = (options.model && options.model.event) || 'input';
  (data.props || (data.props = {}))[prop] = data.model.value;
  const on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}
```

## 组件实例的创建和挂载过程

Vue.\_update() --> patch() --> createElm() --> createComponent()

[src/core/vdom/patch.js](https://gitee.com/Wuner/vue-resovle/blob/master/src/core/vdom/patch.js)

```javascript
// 注意：先创建父组件再创建子组件；先挂载子组件再挂载父组件。
// 1.创建组件实例，挂载到真实 DOM
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // 调用init()方法，创建和挂载组件实例
    // init()的过程中创建好了组件的真实DOM，挂载到了vnode.elm上
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */, parentElm, refElm);
    }
    if (isDef(vnode.componentInstance)) {
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      // 调用钩子函数（VNode的钩子函数初始化属性/事件/样式等，组件的钩子函数）
      initComponent(vnode, insertedVnodeQueue);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}

// 2.调用钩子函数，设置局部作用于样式
function initComponent(vnode, insertedVnodeQueue) {
  if (isDef(vnode.data.pendingInsert)) {
    insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    vnode.data.pendingInsert = null;
  }
  vnode.elm = vnode.componentInstance.$el;
  if (isPatchable(vnode)) {
    // 调用钩子函数
    invokeCreateHooks(vnode, insertedVnodeQueue);
    // 设置局部作用于样式
    setScope(vnode);
  } else {
    // empty component root.
    // skip all element-related modules except for ref (#3455)
    registerRef(vnode);
    // make sure to invoke the insert hook
    insertedVnodeQueue.push(vnode);
  }
}

// 3.调用create钩子函数
function invokeCreateHooks(vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    // 触发create钩子函数
    cbs.create[i](emptyNode, vnode);
  }
  i = vnode.data.hook; // Reuse variable
  // 调用组件的钩子函数
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode);
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
  }
}
```

## 总结

![note](./imgs/2.png)
