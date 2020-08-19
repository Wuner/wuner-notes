# [Vuex](https://vuex.vuejs.org/zh/)

## Vuex 是什么？

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools) ，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

- Vuex 是专门为 Vue.js 设计的状态管理库
- 它采用集中式的方式存储需要共享的数据
- 从使用角度，它就是一个 JavaScript 库
- 它的作用是进行状态管理，解决复杂组件通信，数据共享

![note](./imgs/1.png)

## 什么情况下我应该使用 Vuex？

Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。因此如果您的应用够简单，您最好不要使用 Vuex。一个简单的 [store](../#简单状态管理起步使用) 模式就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：

> Flux 架构就像眼镜：您自会知道什么时候需要它。

当你的应用中具有以下需求场景的时候：

- 多个视图依赖于同一状态
- 来自不同视图的行为需要变更同一状态

建议符合这种场景的业务使用 Vuex 来进行数据管理，例如非常典型的场景：购物车。

:::warning

Vuex 不要滥用，不符合以上需求的业务最好不要使用，否则反而会让你的应用变得更麻烦。
:::

## 基本使用

每一个 `Vuex` 应用的核心就是 `store`（仓库）。`store`基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。`Vuex` 和单纯的全局对象有以下两点不同：

`Vuex` 的状态存储是响应式的。当 `Vue` 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

你不能直接改变 `store` 中的状态。改变 `store` 中的状态的唯一途径就是显式地提交 (commit) `mutation`。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 安装

```
npm i vuex -D
```

### 使用

安装 Vuex 之后，让我们来创建一个 store。

```javascript
/**
 * @author Wuner
 * @date 2020/8/19 15:11
 * @description
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    message: 'ok',
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setCount(state, payload) {
      state.count = payload;
    },
    setMessage(state, payload) {
      state.message = payload;
    },
  },
});

export default store;
```

为了在 Vue 组件中访问 `this.$store` property，你需要为 Vue 实例注入 store。

```javascript
new Vue({
  el: '#app',
  // store: store,
  store, // es6写法
});
```

现在我们可以从组件的方法提交一个变更：

```javascript
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

:::tip

再次强调，我们通过提交 mutation 的方式，而非直接改变 `store.state.count`，是因为 Vuex 想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让 Vuex 有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，Vuex 甚至可以实现如时间穿梭般的调试体验。

由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。触发变化也仅仅是在组件的 methods 中提交 mutation。

:::

## 核心概念

### State

Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个[“唯一数据源 (SSOT)”](https://en.wikipedia.org/wiki/Single_source_of_truth) 而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

:::tip

在信息系统设计和理论中，唯一数据源（SSOT）是构造信息模型和相关数据模式的实践，这样每个数据元素都只能在一个地方掌握（或编辑）。

单状态树和模块化并不冲突——后面的[Module](./#module)时会详解。

存储在 Vuex 中的数据和 Vue 实例中的 data 遵循相同的规则，例如状态对象必须是纯粹 (plain) 的。参考：[Vue#data](https://cn.vuejs.org/v2/api/#data) 。
:::

#### 在 Vue 组件中获得 Vuex 状态

```html
<template>
  <div class="vuex">
    <p>{{$store.state.count}}</p>
    <p>{{$store.state.message}}</p>
  </div>
</template>
```

因为 Vuex 的 state 是响应式的，所以我们可以使用[计算属性](https://cn.vuejs.org/v2/guide/computed.html)

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    message() {
      return this.$store.state.message;
    },
  },
};
</script>
```

当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性：

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex';
export default {
  computed: mapState({
    // 箭头函数可使代码更简练
    count: (state) => state.count,
    message: (state) => state.message,
  }),
};
</script>
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex';
export default {
  computed: mapState([
    'count', // 映射 this.count 为 store.state.count
    'message', // 映射 this.message 为 store.state.message
  ]),
};
</script>
```

使用对象展开运算符将它与局部计算属性混合使用

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState(['count', 'message']),
  },
};
</script>
```

:::warning

使用 Vuex 并不意味着你需要将所有的状态放入 Vuex。虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。
:::

### Getter

有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

`store.js` state 里新增 todos

```javascript
todos: [
  { id: 1, text: '...', done: true },
  { id: 2, text: '...', done: false },
],
```

```vue
<template>
  <div class="vuex">
    <p>{{ doneTodosCount }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    doneTodosCount() {
      return this.$store.state.todos.filter((todo) => todo.done).length;
    },
  },
};
</script>
```

如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。

Vuex 允许我们在 `store` 中定义`getter`（可以认为是 store 的计算属性）。就像计算属性一样，`getter` 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接受 state 作为其第一个参数：

```javascript
/**
 * @author Wuner
 * @date 2020/8/19 15:11
 * @description
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
    ],
  },
  getters: {
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done);
    },
  },
});

export default store;
```

getter 的访问与 state 类似，Vuex 也提供了一个辅助函数`mapGetters`

```vue
<template>
  <div class="vuex">
    <p>{{ doneTodos }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      // 把 `this.doneTodos` 映射为 `this.$store.getters.doneTodos`
      'doneTodos',
    ]),
  },
};
</script>
```

:::tip

Getter 也可以接受其他 getter 作为第二个参数：

```javascript
getters: {
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done);
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },
},
```

你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

```javascript
getters: {
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done);
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id);
    },
},
```

```javascript
this.$store.getters.getTodoById(2); // -> { id: 2, text: '...', done: false }
```

:::

### Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```javascript
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    message: 'ok',
  },
  mutations: {
    increment(state, payload = {}) {
      state.count += payload.amount || 1;
    },
    setCount(state, payload) {
      state.count = payload;
    },
    setMessage(state, payload) {
      state.message = payload;
    },
  },
});

export default store;
```

使用

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <!--    以载荷形式提交-->
    <button @click="$store.commit('increment', { amount: 10 })">
      payload commit
    </button>
    <!--    以对象形式提交-->
    <button
      @click="
        $store.commit({
          type: 'increment',
          amount: 10,
        })
      "
    >
      object commit
    </button>
  </div>
</template>
```

对于 mutation ，Vuex 也提供了一个辅助函数`mapMutations`

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <button @click="setCount(1000)">map: update</button>
    <p>{{ message }}</p>
    <button @click="setMessage('update success')">update</button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations([
      // 将 `this.increment(payload)` 映射为 `this.$store.commit('increment', payload)`
      'increment',
      // 将 `this.setCount(payload)` 映射为 `this.$store.commit('setCount', payload)`
      'setCount',
      'setMessage',
    ]),
  },
};
</script>
```

#### 使用常量替代 Mutation 事件类型

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让其他人对整个 app 包含的 mutation 一目了然：

```javascript
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION';
```

```javascript
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

:::warning

#### Mutation 需遵守 Vue 的响应规则

既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

最好提前在你的 store 中初始化好所有所需属性。

当需要在对象上添加新属性时，你应该

使用 Vue.set(obj, 'newProp', 123), 或者

以新对象替换老对象。例如，利用对象展开运算符我们可以这样写：

```javascript
state.obj = { ...state.obj, newProp: 123 };
```

#### Mutation 必须是同步函数

一条重要的原则就是要记住 mutation 必须是同步函数。为什么？请参考下面的例子：

```javascript
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道回调函数什么时候被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

:::

### Action

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

```javascript
/**
 * @author Wuner
 * @date 2020/8/19 15:11
 * @description
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
});

export default store;
```

:::warning

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象(不是 store 实例本身)，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

:::

使用参数解构

```javascript
actions: {
    increment({ commit }) {
      commit('increment');
    },
},
```

action 的使用与 mutation 类似，同样的支持载荷方式和对象方式进行分发，当然 Vuex 同样也提供了一个辅助函数`mapActions`

```vue
<template>
  <div class="vuex">
    <p>{{ count }}</p>
    <button @click="increment">Action: update</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions(['increment']),
  },
};
</script>
```

乍看上去感觉多此一举，我们还不如直接分发 mutation ，这样岂不是更方便？然而实际上并非如此，是否还记得 mutation 必须同步执行这个限制么？然而 Action 就不受此约束！我们可以在 action 内部执行异/同步操作：

```javascript
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

#### 使用 [Promise](https://wuner.gitee.io/wuner-notes/fed-e-task-01-01/notes/w-019-my-promise/) (或者 [async/await](https://wuner.gitee.io/wuner-notes/fed-e-task-01-01/notes/w-018-async-await/)) 组合 Action

```javascript
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  },
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

```javascript
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

:::warning

一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

:::

### Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

```javascript
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### 模块的局部状态

对于模块内部的 `mutation` 和 `getter`，接收的第一个参数是模块的局部状态对象。

```javascript
const moduleA = {
  state: () => ({
    count: 0,
  }),
  mutations: {
    increment(state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++;
    },
  },

  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
};
```

同样，对于模块内部的 `action`，局部状态通过 `context.state` 暴露出来，根节点状态则为 `context.rootState`：

```javascript
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment');
      }
    },
  },
};
```

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

```javascript
const moduleA = {
  // ...
  getters: {
    sumWithRootCount(state, getters, rootState) {
      return state.count + rootState.count;
    },
  },
};
```

#### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：

```javascript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

:::tip

启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。

:::

##### 在带命名空间的模块内访问全局内容（Global Assets）

如果你希望使用全局 `state` 和 `getter`，`rootState` 和 `rootGetters` 会作为第三和第四参数传入 `getter`，也会通过 `context` 对象的属性传入 `action`。

若需要在全局命名空间内分发 `action` 或提交 `mutation`，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。

```javascript
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

##### 在带命名空间的模块注册全局 action

若需要在带命名空间的模块注册全局 `action`，你可添加 `root: true`，并将这个 `action` 的定义放在函数 `handler` 中。例如：

```javascript
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

##### 带命名空间的绑定函数

当使用 mapState, mapGetters, mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，写起来可能比较繁琐：

```javascript
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

对于这种情况，你可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。于是上面的例子可以简化为：

```javascript
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

而且，你可以通过使用 `createNamespacedHelpers` 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：

```javascript
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module');

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: (state) => state.a,
      b: (state) => state.b,
    }),
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions(['foo', 'bar']),
  },
};
```
