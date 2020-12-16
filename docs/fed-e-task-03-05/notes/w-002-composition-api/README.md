# Composition API

本文主要围绕 Composition API 来讲解如何使用，分别是以下几个 API 函数, 通过学习，可以让你可以更快上手 Composition API ，掌握 Vue.js 3.x 的新特性。

- 生命周期钩子变化
- reactive API
- toRefs API
- ref API
- computed API 变化
- watch API 变化
- toRefs 原理
- watchEffect API

## 安装 vue3.x

```
yarn add vue@next
```

## [createApp](https://v3.vuejs.org/api/global-api.html#createapp)

composition-api/create-app.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      x: {{ position.x }}<br />
      y: {{ position.y }}
    </div>
    <script type="module">
      import { createApp } from '../node_modules/vue/dist/vue.esm-browser.js';
      const app = createApp({
        data() {
          return {
            position: {
              x: 0,
              y: 0,
            },
          };
        },
      });
      console.log(app);
      app.mount('#app');
    </script>
  </body>
</html>
```

Vue 3.x 和 Vue2.x 的区别，成员要少很多，没有\$开头， 使用方式和以前一样

![img.png](./imgs/1.png)

## 响应式 API

### reactive

返回对象的响应式的副本。

```js
const obj = reactive({ count: 0 });
```

响应式的转换是“深度”转换，它会影响所有嵌套 `property`。在基于 [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 实现，返回的 `proxy` 不等于原始对象。建议只使用响应式 `proxy`，并避免依赖原始对象。

### ref

接受一个内部值并返回一个响应式且可变的 `ref` 对象。`ref` 对象具有指向内部值的单个 `property.value`。

示例：

```js
const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

### toRefs

将响应式对象转换为普通对象，其中结果对象的每个 `property` 都是指向原始对象相应 `property` 的 `ref`。

```js
const state = reactive({
  foo: 1,
  bar: 2,
});

const stateAsRefs = toRefs(state);
/*
Type of stateAsRefs:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 和 原始property “链接”
state.foo++;
console.log(stateAsRefs.foo.value); // 2

stateAsRefs.foo.value++;
console.log(state.foo); // 3
```

当从合成函数返回响应式对象时，`toRefs` 非常有用，这样消费组件就可以在不丢失响应性的情况下对返回的对象进行分解/扩散：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  });

  // 逻辑运行状态

  // 返回时转换为ref
  return toRefs(state);
}

export default {
  setup() {
    // 可以在不失去响应性的情况下破坏结构
    const { foo, bar } = useFeatureX();

    return {
      foo,
      bar,
    };
  },
};
```

## [Setup](https://v3.vuejs.org/guide/composition-api-setup.html#setup)

### 参数

#### props

`setup` 函数中的第一个参数是 `props` 参数。就像您在标准组件中所期望的那样，`setup` 函数中的 `props` 是响应式的，并且在传入新的`props`时会进行更新

```vue
<script>
export default {
  props: {
    title: String,
  },
  setup(props) {
    console.log(props.title);
  },
};
</script>
```

:::warning
但是，由于 `props` 是响应式的，你不能使用 ES6 销毁，因为它会消除 `props` 的响应式。
:::

#### context

传递给 `setup` 函数的第二个参数是 `context` 。`context` 是一个普通的 JavaScript 对象，它有三个组件属性：attrs, slots, emit

```vue
<script>
export default {
  setup(props, context) {
    // Attributes (Non-reactive object)
    console.log(context.attrs);

    // Slots (Non-reactive object)
    console.log(context.slots);

    // Emit Events (Method)
    console.log(context.emit);
  },
};
</script>
```

### demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      x: {{ position.x }}<br />
      y: {{ position.y }}
    </div>
    <script type="module">
      import {
        createApp,
        reactive,
      } from '../node_modules/vue/dist/vue.esm-browser.js';

      const app = createApp({
        setup() {
          const position = reactive({
            x: 0,
            y: 0,
          });
          return {
            position,
          };
        },
        mounted() {
          this.position.x = 100;
        },
      });
      app.mount('#app');
    </script>
  </body>
</html>
```

## 生命周期钩子

你可以通过在生命周期钩子前面加上 “on” 来访问组件的生命周期钩子。

下表包含如何在 `setup()` 内部调用生命周期钩子：

| Options API     | Hook inside setup |
| --------------- | ----------------- |
| beforeCreate    | Not needed\*      |
| created         | Not needed\*      |
| beforeMount     | onBeforeMount     |
| mounted         | onMounted         |
| beforeUpdate    | onBeforeUpdate    |
| updated         | onUpdated         |
| beforeUnmount   | onBeforeUnmount   |
| unmounted       | onUnmounted       |
| errorCaptured   | onErrorCaptured   |
| renderTracked   | onRenderTracked   |
| renderTriggered | onRenderTriggered |

### demo

获取鼠标位置 demo

composition-api/getMousePosition.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      x: {{ x }} <br />
      y: {{ y }}
    </div>
    <script type="module">
      import {
        createApp,
        reactive,
        onMounted,
        onUnmounted,
        toRefs,
      } from '../node_modules/vue/dist/vue.esm-browser.js';

      function useMousePosition() {
        // 第一个参数 props
        // 第二个参数 context，attrs、emit、slots
        const position = reactive({
          x: 0,
          y: 0,
        });

        const update = (e) => {
          position.x = e.pageX;
          position.y = e.pageY;
        };

        onMounted(() => {
          window.addEventListener('mousemove', update);
        });

        onUnmounted(() => {
          window.removeEventListener('mousemove', update);
        });

        return toRefs(position);
      }

      const app = createApp({
        setup() {
          // const position = useMousePosition()
          const { x, y } = useMousePosition();
          return {
            x,
            y,
          };
        },
      });
      console.log(app);

      app.mount('#app');
    </script>
  </body>
</html>
```

### toRefs 原理

toRefs 要求传入的参数 必须为代理对象，当前的 position 就是 reactive 返回的代理对象，如果不是的话，会发出警告，提示传递代理对象, 内部会创建一个新的对象，然后遍历传入代理对象的所有属性,把所有属性的值都转换成响应式对象，相当于将 postion 的 x, y 属性转换成响应式对象， 挂载到新创建的对象上，最后把新创建的对象返回。内部为代理对象的每一个属性创建一个具有 value 属性，value 属性具有 getter，setter, getter 中返回对象属性的值， setter 中给代理对象赋值。

## computed

使用 `getter` 函数，并为从 `getter` 返回的值返回一个不变的响应式 `ref` 对象。

```js
const count = ref(1);
const plusOne = computed(() => count.value + 1);

console.log(plusOne.value); // 2

plusOne.value++; // error
```

或者，它可以使用具有 `get` 和 `set` 函数的对象来创建可写的 `ref` 对象。

```js
const count = ref(1);
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1;
  },
});

plusOne.value = 1;
console.log(count.value); // 0
```

## watchEffect

在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。

```js
const count = ref(0);

watchEffect(() => console.log(count.value));
// -> logs 0

setTimeout(() => {
  count.value++;
  // -> logs 1
}, 100);
```

### demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      <button @click="increase">increase</button>
      <button @click="stop">stop</button>
      <br />
      {{ count }}
    </div>

    <script type="module">
      import {
        createApp,
        ref,
        watchEffect,
      } from '../node_modules/vue/dist/vue.esm-browser.js';

      createApp({
        setup() {
          const count = ref(0);
          const stop = watchEffect(() => {
            console.log(count.value);
          });

          return {
            count,
            stop,
            increase: () => {
              count.value++;
            },
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

## `watch`

`watch` API 与 Options API `this.$watch` (以及相应的 watch option) 完全等效。`watch` 需要侦听特定的 `data` 源，并在单独的回调函数中副作用。默认情况下，它也是惰性的——即，回调是仅在侦听源发生更改时调用。

- 与 [watchEffect](#watcheffect) 比较，`watch` 允许我们：

  - 惰性地执行副作用；
  - 更具体地说明应触发侦听器重新运行的状态；
  - 访问侦听状态的先前值和当前值。

### 侦听一个单一源

侦听器 data 源可以是返回值的 getter 函数，也可以是 [ref](#ref)：

```js
// 侦听一个getter
const state = reactive({ count: 0 });
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  },
);

// 直接侦听一个ref
const count = ref(0);
watch(count, (count, prevCount) => {
  /* ... */
});
```

### 侦听多个源

侦听器还可以使用数组同时侦听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
});
```

### 与 `watchEffect` 共享行为

`watch` 与 [`watchEffect`](#watcheffect) 在[手动停止](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#stopping-the-watcher) ，[副作用无效](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#side-effect-invalidation) (将 `onInvalidate` 作为第三个参数传递给回调)，[flush timing](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#effect-flush-timing) 和 [debugging](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watcher-debugging) 有共享行为。

### demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      <p>
        请问一个 yes/no 的问题:
        <input v-model="question" />
      </p>
      <p>{{ answer }}</p>
    </div>

    <script type="module">
      // https://www.yesno.wtf/api
      import {
        createApp,
        ref,
        watch,
      } from '../node_modules/vue/dist/vue.esm-browser.js';

      createApp({
        setup() {
          const question = ref('');
          const answer = ref('');
          let time = new Date().getTime();

          watch(question, async (newValue, oldValue) => {
            const newTime = new Date().getTime();
            if (newTime - time > 1000) {
              time = newTime;
              const response = await fetch('https://www.yesno.wtf/api');
              const data = await response.json();
              answer.value = data.answer;
            }
          });

          return {
            question,
            answer,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

## [demo 源码地址](https://gitee.com/Wuner/vue3.x-demo.git)
