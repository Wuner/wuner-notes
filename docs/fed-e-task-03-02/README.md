# 作业

## 简答题

### 1、请简述 Vue 首次渲染的过程。

- 在执行 new Vue()前会先进行 Vue 的初始化
  - 定义 Vue 的构造函数
  - 初始化 Vue 的实例成员以及静态方法
- 在 Vue 的构造函数中调用 this.\_init 方法
  - 合并 options
  - 初始化 Vue 的事件监听、渲染函数等
  - 触发 beforeCreate 和 created 钩子函数
  - 调用 vm.\$mount 方法，把模板编译成渲染函数
- 在 src/platforms/web/entry-runtime-with-compiler.js 中的 vm.\$mount()
  - 如果用户没有传递 render 函数
  - 则判断 是否传递 template
  - 如果没有传递 template，则获取 el 的 outerHTML 作为 template
  - 然后调用 compileToFunctions 方法将 template 转换为 render 函数
  - 将 render 函数存储到 options 中
  - 调用 mount 方法，挂载 DOM
- 在 src/platforms/web/runtime/index.js 中的 vm.\$mount()
  - 调用 mountComponent 方法
- mountComponent()
  - 触发 beforeMount 钩子函数
  - 定义 updateComponent 方法
  - 创建 Watcher 实例，将 updateComponent 传入
    - 创建完 Watcher 实例，会调用一次 get 方法
    - get 方法中调用 updateComponent 方法
      - updateComponent 方法里面调用 vm.\_update(vm.\_render(), hydrating)方法
    - 调用 vm.\_render 方法，渲染虚拟 DOM
      - 调用 render.call(vm.\_renderProxy, vm.\$createElement)返回虚拟 DOM
    - 调用 vm.\_update 方法，将虚拟 DOM 转换成真实 DOM
      - vm.\_\_patch\_\_(prevVnode, vnode)方法挂载真实 DOM
  - 触发 mounted 钩子函数
  - 返回 vm

### 2、请简述 Vue 响应式原理。

- 在 src/core/instance/init.js 中调用 initState(vm)
  - 调用 observe 方法给 data 添加响应式
  - 初始化 Watcher 对象
- observe()
  - 创建一个 Observer 对象，并赋值给 ob
  - 返回 ob
- Observer
  - 如果观察对象是一个数组，调用 observeArray 方法为数组中的每一个对象元素创建一个 Observer 对象
  - 如果是对象，则调用 walk 方法，遍历对象中的每一个属性，调用 defineReactive 方法，将当前属性转换成 getter/setter
- defineReactive()
  - 创建依赖对象实例，其作用是为当前属性(key)收集依赖
  - 如果当前属性对应的值存在子对象，继续调用 observe
  - 定义 getter
    - 收集依赖
    - 返回属性值
  - 定义 setter
    - 如果新值存在子对象，调用 observe
    - 派发更新(发布更新通知)
- 依赖收集
  - 在 watcher 对象的 get 方法中调用 pushTarget 记录 Dep.target 属性
  - 访问 data 中的成员的时候收集依赖，defineReactive 的 getter 中收集依赖
  - 把属性对应的 watcher 对象添加到 dep 的 subs 数组中
  - 给 childOb 收集依赖，目的是子对象添加和删除成员时，发送更新通知
- Watcher
  - dep.notify 方法中调用 watcher 对象的 update 方法
  - queueWatcher 方法判断 watcher 是否已处理，如果没有的话，则添加到 queue 队列中，并调用 flushSchedulerQueue 方法
- flushSchedulerQueue()
  - 触发 beforeUpdate 钩子函数
  - 调用 watcher 中的 run 方法更新视图
  - 触发 actived 钩子函数
  - 触发 updated 钩子函数

### 3、请简述虚拟 DOM 中 Key 的作用和好处。

例如：v-for 循环，当你插入一个新的节点时，如果没有设置 key，在 updateChildren 中比较子节点的时候，会做多次更新 DOM 操作和一次插入 DOM 的操作，如果设置了，在 updateChildren 中比较子节点的时候，因为 除了新插入的节点，其他节点的 key 相同，所以只做比较，没有更新 DOM 的操作，当遍历完毕后，会再把 新的节点 插入到 DOM 上，此时 DOM 操作只有一次插入操作。

### 4、请简述 Vue 中模板编译的过程。

- 在 src/platforms/web/entry-runtime-with-compiler.js 中调用 compileToFunctions(...)方法
  - 读取缓存中的 CompiledFunctionResult 对象，如果有直接返回缓存中的 CompiledFunctionResult 对象
  - 否则调用 compiled 方法，把模板编译为编译对象(render, staticRenderFns)，字符串形式的 js 代码
- compile(...)
  - 合并自定义模块
  - 合并自定义指令
  - 克隆其他配置
  - 调用 baseCompile 方法
- baseCompile(...)
  - 调用 parse 方法，把模板转换成 ast 抽象语法树
  - 调用 optimize 方法，优化抽象语法树
    - 标记非静态节点和标记静态根节点
    - 检测静态子树，设置为静态，不需要在每次重新渲染的时候重新生成节点
    - 在 patch 阶段时，跳过静态子树
  - 调用 generate 方法，将抽象语法树转换为字符串形式的 js 代码
- compileToFunctions (...)
  - 继续上一步，调用 createFunction 方法，把字符串形式的 js 代码转换成 js 函数
  - render 和 staticRenderFns 初始化完毕后，挂载到 Vue 实例中的 options 对应的属性中
