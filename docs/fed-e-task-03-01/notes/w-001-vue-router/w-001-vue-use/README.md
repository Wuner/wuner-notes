# [Vue Router](https://router.vuejs.org/zh/) 使用

Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为

## [起步](https://router.vuejs.org/zh/guide/)

用`Vue.js + Vue Router`创建单页应用，是非常简单的。使用`Vue.js`，我们已经可以通过组合组件来组成应用程序，当你要把`Vue Router`添加进来，我们需要做的是，将组件 (components) 映射到路由 (routes)，然后告诉`Vue Router`在哪里渲染它们。

## [动态路由匹配](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个`User`组件，对于所有`ID`各不相同的用户，都要使用这个组件来渲染。

## [嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)

实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，`URL`中各段动态路径也按某种结构对应嵌套的各层组件，例如：

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

## [编程式的导航](https://router.vuejs.org/zh/guide/essentials/navigation.html)

除了使用`<router-link>`创建`a`标签来定义导航链接，我们还可以借助`router`的实例方法，通过编写代码来实现。

## [命名路由](https://router.vuejs.org/zh/guide/essentials/named-routes.html)

有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建`Router`实例的时候，在`routes`配置中给某个路由设置名称。

## [命名视图](https://router.vuejs.org/zh/guide/essentials/named-views.html)

有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有`sidebar`(侧导航) 和`main`(主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果`router-view`没有设置名字，那么默认为`default`。

## [重定向和别名](https://router.vuejs.org/zh/guide/essentials/redirect-and-alias.html)

重定向也是通过`routes`配置来完成，下面例子是从`/a`重定向到`/b`：

```javascript
const router = new VueRouter({
  routes: [{ path: '/a', redirect: '/b' }],
});
```

## [路由组件传参](https://router.vuejs.org/zh/guide/essentials/passing-props.html)

在组件中使用`$route`会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的`URL`上使用，限制了其灵活性。

## [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

`vue-router`默认`hash`模式`——`使用`URL`的`hash`来模拟一个完整的`URL`，于是当`URL`改变时，页面不会重新加载。

如果不想要很丑的`hash`，我们可以用路由的`history`模式，这种模式充分利用`history.pushState API`来完成`URL`跳转而无须重新加载页面。

```
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

当你使用`history`模式时，`URL`就像正常的`url`，例如`[http://yoursite.com/user/id]` ，也好看！

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问`http://oursite.com/user/id` 就会返回`404`，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果`URL` 匹配不到任何静态资源，则应该返回同一个`index.html`页面，这个页面就是你`app`依赖的页面。
