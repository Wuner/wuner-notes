# 模拟 VueRouter

前置的知识：

- 插件
- slot 插槽
- 混入
- render 函数
- 运行时和完整版的 Vue

回顾 Vue Router 的核心代码

```javascript
// 注册插件
// Vue.use() 内部调用传入对象的 install 方法
Vue.use(VueRouter);
// 创建路由对象
const router = new VueRouter({
  routes: [{ name: 'home', path: '/', component: homeComponent }],
});
// 创建 Vue 实例，注册 router 对象
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
```

## Hash 模式

- URL 中#后面的内容作为路径地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应的组件重新渲染

## history 模式

- 通过 history.pushState()方法改变地址栏
- 监听 popstate 事件
- 根据当前路由地址找到对应的组件重新渲染

## 实现思路

这里模拟的是一个简单的`ruoter`的 history 模式，不能嵌套使用

- 创建 VueRouter 插件，静态方法 install
  - 判断插件是否已经被加载
  - 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实例上（注意：只执行一次）
- 创建 VueRouter 类
  - 初始化，options、routeMap、app(简化操作，创建 Vue 实例作为响应式数据记录当前路径)
  - initRouteMap() 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
  - 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
  - 创建 router-link 和 router-view 组件
  - 当路径改变的时候通过当前路径在 routerMap 对象中找到对应的组件，渲染 router-view

## install

[混入 mixin ](https://cn.vuejs.org/v2/guide/mixins.html)

```javascript
let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    // 判断是否已经加载过install
    if (!VueRouter.install.installed) {
      // 将状态改为已加载
      VueRouter.install.installed = true;
      // 将Vue的构造函数记录到全局
      _Vue = Vue;
      // 将创建Vue的实例时传入的router对象注入到Vue实例
      // _Vue.prototype.$router = this.$options.router;
      // 如果我们直接使用Vue的原型链将router注入，会有以下的问题
      // 因为install是静态方法，会被VueRouter.install调用，这时this将指向VueRouter对象
      // 所以我们这边使用混入
      _Vue.mixin({
        beforeCreate() {
          // 因为在使用过程中beforeCreate方法会被不停的调用，然而我们这边只需要执行一次挂载
          // 判断this.$options.router是否存在
          if (this.$options.router) {
            _Vue.prototype.$router = this.$options.router;
          }
        },
      });
    }
  }
}
```

## VueRouter 构造函数

`Vue.observable(object)`

让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。

返回的对象可以直接用于渲染函数和计算属性内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景

这里我们使用 Vue.observable 创建一个响应式对象

```javascript
let _Vue = null;
export default class VueRouter {
  constructor(options) {
    this.options = options;
    // 设置路由模式，默认hash
    this.mode = options.mode || 'hash';
    this.routerMap = {};
    let pathname = window.location.pathname;
    let search = window.location.search;
    !window.location.hash &&
      history.pushState({}, '', `${pathname + search}#/`); // 如果hash不存在，则改变地址栏地址
    let hash = window.location.hash;
    // Vue.observable(object)
    // 让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
    // 返回的对象可以直接用于渲染函数和计算属性内，并且会在发生变更时触发相应的更新。
    // 也可以作为最小化的跨组件状态存储器，用于简单的场景
    // 这里我们使用Vue.observable创建一个响应式对象
    this.data = _Vue.observable({
      current: this.mode === 'hash' ? hash.replace('#', '') : pathname, // 存储当前路由地址
    });
    this.init();
  }
}
```

## createRouterMap

遍历所有的路由规则，把路由规则解析成键值对的形式存储到`routerMap`中

```javascript
export default class VueRouter {
  createRouterMap() {
    this.options.routes.forEach((route) => {
      this.routerMap[route.path] = route.component;
    });
  }
}
```

## initComponent

Vue 运行版本不支持 template

我们有两种方案解决

- 方案一：配置 cli 为完整版 Vue

在项目根目录下创建`vue.config.js`，配置`runtimeCompiler`

是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。

```json
{ "runtimeCompiler": true }
```

- 方案二：使用 [render 函数](https://cn.vuejs.org/v2/guide/render-function.html)

```javascript
export default class VueRouter {
  initComponent(Vue) {
    const mode = this.mode;

    // 方案二：使用 render 函数
    Vue.component('router-link', {
      props: {
        to: String,
      },
      // template: `<a :href="to"><slot></slot></a>`,
      render(createElement) {
        return createElement(
          'a',
          {
            attrs: { href: this.to },
            on: {
              click: this.clickHandler, // 添加点击事件
            },
          },
          [this.$slots.default],
        );
      },
      methods: {
        clickHandler(e) {
          // 阻止默认事件
          e.preventDefault();
          // 如果当前地址和需要跳转的地址一样，直接返回
          if (this.to === this.$router.data.current) {
            return;
          }
          // 改变地址栏
          if (mode === 'history') {
            history.pushState({}, '', this.to);
          } else {
            history.pushState(
              {},
              '',
              `${window.location.pathname + window.location.search}#${this.to}`,
            );
          }
          // 将当前路由地址改为点击事件里的href，这里的data是响应式对象，它改变时，会重新渲染页面
          this.$router.data.current = this.to;
        },
      },
    });
    const self = this;
    Vue.component('router-view', {
      render(createElement) {
        // 获取当前路由地址对应的路由组件
        const component = self.routerMap[self.data.current];
        return createElement(component);
      },
    });
  }
}
```

### createElement 参数

接下来你需要熟悉的是如何在 createElement 函数中使用模板中的那些功能。这里是 createElement 接受的参数：

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

## initEvent

```javascript
export default class VueRouter {
  initEvent() {
    // 监听点击后退键
    window.addEventListener('popstate', () => {
      // 将当前路由地址改为地址栏中的pathname，这里的data是响应式对象，它改变时，会重新渲染页面
      this.data.current =
        this.mode === 'hash'
          ? window.location.hash.replace('#', '')
          : window.location.pathname;
    });
  }
}
```

## [完整示例](https://gitee.com/Wuner/wuner-notes/blob/master/docs/fed-e-task-03-01/notes/w-001-vue-router/w-002-simulation-vue-router/js/index.js)

```javascript
let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    // 判断是否已经加载过install
    if (!VueRouter.install.installed) {
      // 将状态改为已加载
      VueRouter.install.installed = true;
      // 将Vue的构造函数记录到全局
      _Vue = Vue;
      // 将创建Vue的实例时传入的router对象注入到Vue实例
      // _Vue.prototype.$router = this.$options.router;
      // 如果我们直接使用Vue的原型链将router注入，会有以下的问题
      // 因为install是静态方法，会被VueRouter.install调用，这时this将指向VueRouter对象
      // 所以我们这边使用混入
      _Vue.mixin({
        beforeCreate() {
          // 因为在使用过程中beforeCreate方法会被不停的调用，然而我们这边只需要执行一次挂载
          // 判断this.$options.router是否存在
          if (this.$options.router) {
            _Vue.prototype.$router = this.$options.router;
          }
        },
      });
    }
  }

  constructor(options) {
    this.options = options;
    // 设置路由模式，默认hash
    this.mode = options.mode || 'hash';
    this.routerMap = {};
    let pathname = window.location.pathname;
    let search = window.location.search;
    !window.location.hash &&
      history.pushState({}, '', `${pathname + search}#/`); // 如果hash不存在，则改变地址栏地址
    let hash = window.location.hash;
    // Vue.observable(object)
    // 让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
    // 返回的对象可以直接用于渲染函数和计算属性内，并且会在发生变更时触发相应的更新。
    // 也可以作为最小化的跨组件状态存储器，用于简单的场景
    // 这里我们使用Vue.observable创建一个响应式对象
    this.data = _Vue.observable({
      current: this.mode === 'hash' ? hash.replace('#', '') : pathname, // 存储当前路由地址
    });
    this.init();
  }

  init() {
    this.createRouterMap();
    this.initComponent(_Vue);
    this.initEvent();
  }

  createRouterMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式存储到routerMap中
    this.options.routes.forEach((route) => {
      this.routerMap[route.path] = route.component;
    });
  }

  initComponent(Vue) {
    // Vue运行版本不支持template
    // 我们有两种方案解决

    // 方案一：配置cli为完整版Vue
    // 在项目根目录下创建vue.config.js
    // 配置runtimeCompiler
    // 是否使用包含运行时编译器的 Vue 构建版本。
    // 设置为 true 后你就可以在 Vue 组件中使用 template 选项了.
    // 但是这会让你的应用额外增加 10kb 左右。
    // {runtimeCompiler: true}

    const mode = this.mode;

    // 方案二：使用 render 函数
    Vue.component('router-link', {
      props: {
        to: String,
      },
      // template: `<a :href="to"><slot></slot></a>`,
      render(createElement) {
        return createElement(
          'a',
          {
            attrs: { href: this.to },
            on: {
              click: this.clickHandler, // 添加点击事件
            },
          },
          [this.$slots.default],
        );
      },
      methods: {
        clickHandler(e) {
          // 阻止默认事件
          e.preventDefault();
          // 如果当前地址和需要跳转的地址一样，直接返回
          if (this.to === this.$router.data.current) {
            return;
          }
          // 改变地址栏
          if (mode === 'history') {
            history.pushState({}, '', this.to);
          } else {
            history.pushState(
              {},
              '',
              `${window.location.pathname + window.location.search}#${this.to}`,
            );
          }
          // 将当前路由地址改为点击事件里的href，这里的data是响应式对象，它改变时，会重新渲染页面
          this.$router.data.current = this.to;
        },
      },
    });
    const self = this;
    Vue.component('router-view', {
      render(createElement) {
        // 获取当前路由地址对应的路由组件
        const component = self.routerMap[self.data.current];
        return createElement(component);
      },
    });
  }

  initEvent() {
    // 监听点击后退键
    window.addEventListener('popstate', () => {
      // 将当前路由地址改为地址栏中的pathname，这里的data是响应式对象，它改变时，会重新渲染页面
      this.data.current =
        this.mode === 'hash'
          ? window.location.hash.replace('#', '')
          : window.location.pathname;
    });
  }
}
```
