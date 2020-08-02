# 编程第一题

模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

[源码地址](https://gitee.com/Wuner/wuner-notes/blob/master/docs/fed-e-task-03-01/notes/w-001-vue-router/w-002-simulation-vue-router/js/index.js)

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
