# Vuex 模拟实现

## 实现思路

- 实现 install 方法

  - Vuex 是 Vue 的一个插件，所以和模拟 VueRouter 类似，先实现 Vue 插件约定的 install 方法

- 实现 Store 类
  - 实现构造函数，接收 options
  - state 的响应化处理
  - getter 的实现
  - commit、dispatch 方法

## install

```javascript
let _Vue = null;

function install(Vue) {
  _Vue = Vue;
  // 混入
  _Vue.mixin({
    beforeCreate() {
      // 在创建前，将$store混入
      this.$options.store && (Vue.prototype.$store = this.$options.store);
    },
  });
}
```

## Store

```javascript
class Store {
  constructor(options) {
    // 解构options参数
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options;
    // 将state转换为响应式数据
    this.state = _Vue.observable(state);
    console.log(this.state);
    // 此处不直接 this.getters = getters，是因为我们需要通过Object.defineProperty劫持getters
    // 如果这么写的话，会导致 this.getters 和 getters 指向同一个对象
    // 当访问 getters 的 key 的时候，实际上就是访问 this.getters 的 key
    // 从而会不停的访问key，导致getter会产生死递归
    this.getters = Object.create(null);
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          // 返回指定getter方法，并传递state参数
          return getters[key](this.state);
        },
      });
    });
    // 初始化mutations
    this.mutations = mutations;
    // 初始化actions
    this.actions = actions;

    // 我们使用解构的方式，触发dispatch和commit时，就会出现this指向被改变问题
    // 所以这里我们给 dispatch 和 commit 绑定 this
    const store = this;
    const { dispatch, commit } = this;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    };
  }

  commit(type, payload) {
    let { type: a, payload: b } = resolve(type, payload);
    this.mutations[a](this.state, b);
  }

  dispatch(type, payload) {
    let { type: a, payload: b } = resolve(type, payload);
    this.actions[a](this, b);
  }
}

// 解析以载荷形式和对象形式进行的commit和dispatch
function resolve(type, payload) {
  // 如果type是对象，并且payload不存在时，这时是以对象形式进行的commit和dispatch
  if (typeof type === 'object' && !payload) {
    payload = JSON.parse(JSON.stringify(type));
    delete payload.type;
    type = type.type;
  }
  return { type, payload };
}
```

## 完整示例

vuex.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/22 15:07
 * @description
 */
let _Vue = null;

class Store {
  constructor(options) {
    // 解构options参数
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options;
    // 将state转换为响应式数据
    this.state = _Vue.observable(state);
    console.log(this.state);
    // 此处不直接 this.getters = getters，是因为我们需要通过Object.defineProperty劫持getters
    // 如果这么写的话，会导致 this.getters 和 getters 指向同一个对象
    // 当访问 getters 的 key 的时候，实际上就是访问 this.getters 的 key
    // 从而会不停的访问key，导致getter会产生死递归
    this.getters = Object.create(null);
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          // 返回指定getter方法，并传递state参数
          return getters[key](this.state);
        },
      });
    });
    // 初始化mutations
    this.mutations = mutations;
    // 初始化actions
    this.actions = actions;

    // 我们使用解构的方式，触发dispatch和commit时，就会出现this指向被改变问题
    // 所以这里我们给 dispatch 和 commit 绑定 this
    const store = this;
    const { dispatch, commit } = this;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    };
  }

  commit(type, payload) {
    let { type: a, payload: b } = resolve(type, payload);
    this.mutations[a](this.state, b);
  }

  dispatch(type, payload) {
    let { type: a, payload: b } = resolve(type, payload);
    this.actions[a](this, b);
  }
}

// 解析以载荷形式和对象形式进行的commit和dispatch
function resolve(type, payload) {
  // 如果type是对象，并且payload不存在时，这时是以对象形式进行的commit和dispatch
  if (typeof type === 'object' && !payload) {
    payload = JSON.parse(JSON.stringify(type));
    delete payload.type;
    type = type.type;
  }
  return { type, payload };
}

function install(Vue) {
  _Vue = Vue;
  // 混入
  _Vue.mixin({
    beforeCreate() {
      // 在创建前，将$store混入
      this.$options.store && (Vue.prototype.$store = this.$options.store);
    },
  });
}

export default {
  Store,
  install,
};
```

## 测试

store.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/19 15:11
 * @description
 */
import Vue from 'vue';
import Vuex from './vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    message: 'ok',
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
    ],
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
  getters: {
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done);
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },
  },
  actions: {
    // increment(context) {
    //   context.commit('increment');
    // },
    // 使用参数解构
    increment({ commit }, payload) {
      setTimeout(() => {
        commit('increment', payload);
      }, 2000);
    },
  },
});

export default store;
```

index.vue

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
    <button @click="setCount(1000)">map: update</button>
    <button @click="incrementAction">Action: update</button>
    <button
      @click="
        $store.dispatch({
          type: 'increment',
          amount: 10,
        })
      "
    >
      Action: object
    </button>
    <p>{{ message }}</p>
    <button @click="setMessage('update success')">update</button>
    <p>{{ doneTodos }}</p>
  </div>
</template>

<script>
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['increment', 'setCount', 'setMessage']),
    ...mapActions({ incrementAction: 'increment' }),
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(['count', 'message']),
    ...mapGetters(['doneTodos']),
  },
};
</script>
<style scoped lang="less">
.vuex {
}
</style>
```
