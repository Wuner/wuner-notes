# Vue.js 3.x 响应式系统原理

## 介绍

### Vue.js 3.x 响应式

- `Proxy` 对象实现属性监听
- 多层属性嵌套，在访问属性过程中处理下一级属性
- 默认监听动态添加的属性
- 默认监听属性的删除操作
- 默认监听数组索引和 `length` 属性
- 可以作为单独的模块使用

#### 核心函数

- `reactive/ref/toRefs/computed`
- `effect`
  - `watch/watchEffect` 是 Vue 3.x 的 `runtime-core` 中实现的
  - 使用了一个 `effect` 的底层函数
- `track/trigger`
  - Vue 3.x 中收集依赖和触发更新的函数

### Reflect

`Reflect` 是一个内置的对象，它提供拦截 `JavaScript` 操作的方法。这些方法与 [proxy handlers](https://wiki.developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) 的方法相同。`Reflect` 不是一个函数对象，因此它是不可构造的。

#### 描述

与大多数全局对象不同 `Reflect` 并非一个构造函数，所以不能通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符对其进行调用，或者将 `Reflect` 对象作为一个函数来调用。`Reflect` 的所有属性和方法都是静态的（就像 [Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math) 对象）。

`Reflect` 对象提供了以下静态方法，这些方法与 [proxy handler methods](https://wiki.developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) 的命名相同.

其中的一些方法与 [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 相同, 尽管二者之间存在 [某些细微上的差别](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/%E6%AF%94%E8%BE%83_Reflect_%E5%92%8C_Object_%E6%96%B9%E6%B3%95) .

### Proxy 对象

:::warning
在严格模式下，`Proxy` 的函数得返回布尔类型的值，否则会报 `TypeError`

> Uncaught TypeError: ‘set’ on proxy: trap returned falsish for property ‘foo’

:::

```js
'use strict';
// 问题1： set和deleteProperty中需要返回布尔类型的值
// 严格模式下，如果返回false的话，会出现TypeError的异常
const target = {
  foo: 'xxx',
  bar: 'yyy',
};
// Reflect.getPrototypeOf()
// Object.getPrototypeOf()
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // return target[key]
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    // target[key] = value
    return Reflect.set(target, key, value, receiver); // 这里得写return
  },
  deleteProperty(target, key) {
    // delete target[key]
    return Reflect.deleteProperty(target, key); // 这里得写return
  },
});

proxy.foo = 'zzz';
```

:::tip

- `Proxy` 中 `receiver`：`Proxy` 或者继承 `Proxy` 的对象
- `Reflect` 中 `receiver`：如果 `target` 对象设置了 `getter`，`getter` 中的 `this` 指向 `receiver`

:::

```js
const obj = {
  get foo() {
    console.log(this);
    return this.bar;
  },
};

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    if (key === 'bar') {
      return 'value - bar';
    }
    // 执行this.bar的时候，this指向obj对象
    // return Reflect.get(target, key);
    // 执行this.bar的时候，this指向代理对象，也就是获取target.bar
    return Reflect.get(target, key, receiver);
  },
});
// console.log(proxy.foo); // undefined
console.log(proxy.foo); // value - bar
```

:::tip

- `return Reflect.get(target, key, receiver)`
  - 响应式属性里的 `this` 就指向新的响应式对象 `proxy`，`this.bar` 返回 `value - bar`
- `return Reflect.get(target, key)`
  - 响应式属性 `foo` 里面的 `this` 还是指向原本的对象 `obj`，`this.bar` 就是 `undefined`

:::

## 自定义 reactive

- 接受一个参数，判断这个参数是否是对象
- `reactive` 只能把对象转化成响应式对象，原始类型的属性要使用 ref 转化
- 创建拦截器对象 `handler`，设置 `get/set/deleteProperty`
- 返回 `Proxy` 对象

`reactivity/reactive/index.js`

```js
/**
 * @author Wuner
 * @date 2020/12/14 10:07
 * @description
 */

/**
 * 判断一个值是否是对象
 * @param val
 * @returns {boolean}
 */
const isObject = (val) => val !== null && typeof val === 'object';

/**
 * 响应式递归处理
 * @param target
 * @returns {*}
 */
const convert = (target) => (isObject(target) ? reactive(target) : target);

/**
 * 判断对象是否存在key属性
 * @param target
 * @param key
 * @returns {boolean}
 */
const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export function reactive(target) {
  // 如果不是对象，直接返回
  if (!isObject(target)) return target;

  const handle = {
    get(target, key, receiver) {
      // 收集依赖
      // 此处写收集依赖操作

      console.log('get', key);

      // 如果key对应的值也是对象，需要再将其转换为响应式对象，用于递归收集下一级的依赖
      return convert(Reflect.get(target, key, receiver));
    },

    set(target, key, value, receiver) {
      const oldVal = Reflect.get(target, key, receiver);

      let result = true;
      // 如果新旧值不一致，更新数据
      if (oldVal !== value) {
        result = Reflect.set(target, key, value, receiver);
        // 触发更新
        console.log('set', key, value);
      }
      return result;
    },
    deleteProperty(target, key) {
      // 判断 target 中是否有自己的 key 属性
      const hadKey = hasOwn(target, key);
      // 判断是否删除成功（如果不存在 key 属性，也会返回成功）
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        // 触发更新
        // 此处写触发更新操作

        console.log('delete', key);
      }
      return result;
    },
  };

  return new Proxy(target, handle);
}
```

### 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <script type="module">
      import { reactive } from './reactive';

      let obj = reactive({
        name: '张三',
        age: 18,
      });

      obj.name = '李四';
      console.log(obj.name);
      delete obj.name;
      console.log(obj);
    </script>
  </body>
</html>
```

## effect

- `effect` 和 `watchEffect` 用法一样
- `watchEffect` 内部就是调用 `effect` 实现的
- `effect` 接收的函数首先会执行一次
- 当函数中引用的响应式数据发生变化，就会再次执行

通过对 Vue 3.x 中的响应式系统模块 `reactivity` 的使用，来总结如何实现依赖收集。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import {
        reactive,
        effect,
      } from '../../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';

      const product = reactive({
        name: 'iPhone',
        price: 5000,
        count: 3,
      });
      let total = 0;
      effect(() => {
        total = product.price * product.count;
      });
      console.log(total);

      product.price = 4000;
      console.log(total);

      product.count = 1;
      console.log(total);
    </script>
  </body>
</html>
```

### 解析上面例子的 effect 执行过程

1. 首次加载时，首先会执行 `effect(fn)` 函数，`effect()`内部首先会调用接收的箭头函数 `fn`
2. 箭头函数 `fn` 中又访问了 `reactive()` 创建的响应式对象（代理对象） `product`
3. 当访问 `product.price` 的时候，会执行它的 `get` 方法，在 `get` 方法中要收集依赖。
4. 收集依赖的过程，就是存储 目标对象、对应的属性 `price` 和 回调函数 `fn`。
   :::warning
   注意：存储的目标对象是 `product` 代理的目标对象，不是 `product` 本身。目标对象将在 `get` 方法中被传递给收集依赖的方法 `track`
   :::
5. 在触发更新的时候，再根据这个属性 `price` 找到对应的 `effect` 回调函数 `fn`
6. 访问 `product.count` 的过程与 `product.price` 一样
7. 当给 `product.price` 赋值的时候，会执行 `price` 属性对应的 `set` 方法，在 `set` 方法中会触发更新。
8. 触发更新，就是找到依赖收集过程中存储的目标对象的 `price` 属性对应的 `effect` 回调函数 `fn`，并立即执行。

### 分析依赖收集和更新

![notes](./imgs/1.png)

#### [WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。

#### [Map](../../../fed-e-task-01-02/notes/w-001-ecma-script/w-012-map)

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。

#### [Set](../../../fed-e-task-01-02/notes/w-001-ecma-script/w-011-set)

Set 对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set 中的元素只会出现一次，即 Set 中的元素是唯一的。

#### 在依赖收集的过程中，会创建三个集合：

- `targetMap`(`WeakMap` 类型) - 用来记录 `[目标对象]:[depsMap]` 的字典。
  - `key` 是 目标对象
  - `value` 是 对应的 `depsMap`
  - `WeakMap` 弱引用的类型，当目标对象失去引用后可以销毁。
- `depsMap`(`Map` 类型) - 用来记录 `[目标对象中的属性的名称]:[dep]` 的字典。
  - `key` 是 目标对象中属性的名称
  - `value` 是 `dep`
  - `Map` 类型
- `dep`(`Set` 类型) - 用来存储 属性对应的 `effect` 回调函数
  - 一个属性可以存储多个 `effect` 回调函数
  - `Set` 集合中存储的元素不会重复

#### 更新分析

1. 在触发更新的时候，根据目标对象的属性在这个结构中，找到并执行 `effect` 回调函数。
2. 收集依赖的 `track` 函数
   - 内部首先要根据当前的 `targetMap` 找到 `depsMap`。
   - 如果没有找到，要给当前对象创建一个 `depsMap` 并添加到 `targetMap` 中。
   - 如果找到了，再去根据当前使用的属性，在 `depsMap` 中找到对应的 `dep`。
3. `dep` 中存储的是 `effect` 回调函数
   - 如果没有找到，为当前属性创建对应的 `dep`，并存储到 `depsMap` 中。
   - 如果找到了，就把当前的 `effect` 回调函数，存储到 `dep` 集合中。

## 自定义 effect

- 实现收集依赖和触发更新
  - 编写 `effect`、`track` 方法，并在 `get` 方法中调用，收集依赖。
  - 编写 `trigger` 方法，并在 `set` 方法中调用，触发更新。

`reactivity/reactive/index.js`

```js
/**
 * @author Wuner
 * @date 2020/12/14 10:07
 * @description
 */

/**
 * 判断一个值是否是对象
 * @param val
 * @returns {boolean}
 */
const isObject = (val) => val !== null && typeof val === 'object';

/**
 * 响应式递归处理
 * @param target
 * @returns {*}
 */
const convert = (target) => (isObject(target) ? reactive(target) : target);

/**
 * 判断对象是否存在key属性
 * @param target
 * @param key
 * @returns {boolean}
 */
const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export function reactive(target) {
  // 如果不是对象，直接返回
  if (!isObject(target)) return target;

  const handle = {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key);

      // 如果key对应的值也是对象，需要再将其转换为响应式对象，用于递归收集下一级的依赖
      return convert(Reflect.get(target, key, receiver));
    },

    set(target, key, value, receiver) {
      const oldVal = Reflect.get(target, key, receiver);

      let result = true;
      // 如果新旧值不一致，更新数据
      if (oldVal !== value) {
        result = Reflect.set(target, key, value, receiver);
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      // 判断 target 中是否有自己的 key 属性
      const hadKey = hasOwn(target, key);
      // 判断是否删除成功（如果不存在 key 属性，也会返回成功）
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
  };

  return new Proxy(target, handle);
}

// 当前活动的 effect 函数
let activeEffect = null;
export function effect(callback) {
  activeEffect = callback;

  // 首先执行一次接收的函数
  // 访问响应式对象属性，去收集依赖
  callback();

  // 重置
  activeEffect = null;
}

let targetMap = new WeakMap();

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  // 如果没有，创建 depsMap 并添加到字典中
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  // 如果没有，创建 dep 并添加到字典中
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  // 添加 effect 回调函数
  dep.add(activeEffect);
}
/**
 * 触发更新
 * @param target
 * @param key
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (!dep) return;

  // 遍历 dep 集合，执行 effect 回调函数
  dep.forEach((effect) => {
    effect();
  });
}
```

### 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect } from '../reactive';

      const product = reactive({
        name: 'iPhone',
        price: 5000,
        count: 3,
      });
      let total = 0;
      // effect 和 watchEffect 用法一样
      // watchEffect 内部就是调用 effect 实现的
      // effect 接收的函数首先会执行一次
      // 当函数中引用的响应式数据发生变化，就会再次执行
      effect(() => {
        total = product.price * product.count;
      });
      console.log(total);

      product.price = 4000;
      console.log(total);

      product.count = 1;
      console.log(total);
    </script>
  </body>
</html>
```

## ref

- `reactive` 只能将对象转化成响应式对象。
- `ref` 可以接收 原始值 和 对象。
  - 如果接收的对象是 `ref` 创建的，则直接返回。
  - 如果接收的是普通对象，内部调用 `reactive` 创建响应式对象并返回。
  - 如果是原始值，则创建一个只有 `value` 属性的 响应式对象，并返回。

`reactivity/reactive/index.js`

```js
/**
 * 将raw转换为响应式对象
 * @param raw
 * @returns {{__v_isRef: boolean, value}|{__v_isRef}|*}
 */
export function ref(raw) {
  // 判断 raw 是否是 ref 创建的对象，如果是，直接返回
  if (isObject(raw) && raw.__v_isRef) return raw;

  // convert 判断是否是对象，如果是，就调用reactive，如果不是，直接返回
  let value = convert(raw);

  const r = {
    __v_isRef: true, // 标识，表示该对象是 ref 创建的
    get value() {
      track(r, 'value');
      return value;
    },
    set value(newValue) {
      // 判断新旧值是否相等
      if (newValue !== value) {
        raw = newValue;
        value = convert(raw);
        trigger(r, 'value');
      }
    },
  };

  return r;
}
```

### 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { effect, ref } from '../reactive';

      const price = ref(5000);
      const count = ref(3);

      let total = 0;

      effect(() => {
        // ref 创建的响应式对象，要使用它的 value 属性
        total = price.value * count.value;
      });

      console.log(total);

      price.value = 4000;
      console.log(total);

      count.value = 1;
      console.log(total);
    </script>
  </body>
</html>
```

### reactive vs ref

- `ref` 可以把基本数据类型数据，转化成响应式对象
- `ref` 返回的对象们重新赋值成对象也是响应式的
- `reactive` 返回的对象，重新赋值丢失响应式
- `reactive` 返回的对象不可以解构，可以通过 `toRefs` 将代理对象的属性转化成类似 `ref` 创建的响应式对象（包含 `value` 属性的对象），才可以使用解构语法。

## toRefs

`toRefs` 把 `reactive` 返回的对象的每一个属性，转换成类似 `ref` 返回的对象，从而可以对 `reactive` 返回的对象进行解构。

`reactivity/reactive/index.js`

```js
/**
 * 将代理对象转换为ref
 * @param proxy
 * @param key
 * @returns {{__v_isRef: boolean, value}|*}
 */
const toProxyRef = (proxy, key) => {
  return {
    __v_isRef: true,
    get value() {
      // proxy 是响应式对象，所以这里不需要收集依赖
      return proxy[key];
    },
    set value(newValue) {
      proxy[key] = newValue;
    },
  };
};
/**
 * 将代理对象转换为ref
 * @param proxy
 * @returns {any[]}
 */
export function toRefs(proxy) {
  // 判断是否是响应式的数组
  const ret = proxy instanceof Array ? new Array(proxy.length) : {};

  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key);
  }

  return ret;
}
```

### 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect, toRefs } from '../reactive';
      function useProduct() {
        // 创建响应式对象
        const product = reactive({
          name: 'iPhone',
          price: '5000',
          count: 3,
        });

        return toRefs(product);
      }

      const { price, count } = useProduct();
      let total = 0;

      effect(() => {
        // ref 创建的响应式对象，要使用它的 value 属性
        total = price.value * count.value;
      });

      console.log(total);

      price.value = 4000;
      console.log(total);

      count.value = 1;
      console.log(total);
    </script>
  </body>
</html>
```

## computed

`computed` 需要接收一个有返回值的函数作为参数，这个函数的返回值就是计算属性的值。

并且要监听这个函数中使用的响应式数据的变化，最后将这个函数执行的结果返回。

`reactivity/reactive/index.js`

```js
/**
 * 计算属性
 * @param getter
 * @returns {{__v_isRef: boolean, value}|{__v_isRef}|*}
 */
export function computed(getter) {
  const result = ref();

  // 通过 effect 监听响应式数据的变化
  // 内部调用 getter 并将结果赋值给 result.value
  effect(() => {
    result.value = getter();
  });

  return result;
}
```

### 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect, computed } from '../reactive';
      // 创建响应式对象
      const product = reactive({
        name: 'iPhone',
        price: '5000',
        count: 3,
      });

      let total = computed(() => {
        return product.price * product.count;
      });
      // computed 返回的是 ref 创建的对象，所以要用属性 value
      console.log(total.value);

      product.price = 4000;
      console.log(total.value);

      product.count = 1;
      console.log(total.value);
    </script>
  </body>
</html>
```

## [完整示例](https://gitee.com/Wuner/vue3.x-demo/tree/master/reactivity)

```js
/**
 * @author Wuner
 * @date 2020/12/14 10:07
 * @description
 */

/**
 * 判断一个值是否是对象
 * @param val
 * @returns {boolean}
 */
const isObject = (val) => val !== null && typeof val === 'object';

/**
 * 响应式递归处理
 * @param target
 * @returns {*}
 */
const convert = (target) => (isObject(target) ? reactive(target) : target);

/**
 * 判断对象是否存在key属性
 * @param target
 * @param key
 * @returns {boolean}
 */
const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

/**
 * 将代理对象转换为ref
 * @param proxy
 * @param key
 * @returns {{__v_isRef: boolean, value}|*}
 */
const toProxyRef = (proxy, key) => {
  return {
    __v_isRef: true,
    get value() {
      // proxy 是响应式对象，所以这里不需要收集依赖
      return proxy[key];
    },
    set value(newValue) {
      proxy[key] = newValue;
    },
  };
};

export function reactive(target) {
  // 如果不是对象，直接返回
  if (!isObject(target)) return target;

  const handle = {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key);

      // 如果key对应的值也是对象，需要再将其转换为响应式对象，用于递归收集下一级的依赖
      return convert(Reflect.get(target, key, receiver));
    },

    set(target, key, value, receiver) {
      const oldVal = Reflect.get(target, key, receiver);

      let result = true;
      // 如果新旧值不一致，更新数据
      if (oldVal !== value) {
        result = Reflect.set(target, key, value, receiver);
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      // 判断 target 中是否有自己的 key 属性
      const hadKey = hasOwn(target, key);
      // 判断是否删除成功（如果不存在 key 属性，也会返回成功）
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
  };

  return new Proxy(target, handle);
}

// 当前活动的 effect 函数
let activeEffect = null;
export function effect(callback) {
  activeEffect = callback;

  // 首先执行一次接收的函数
  // 访问响应式对象属性，去收集依赖
  callback();

  // 重置
  activeEffect = null;
}

let targetMap = new WeakMap();

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  // 如果没有，创建 depsMap 并添加到字典中
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  // 如果没有，创建 dep 并添加到字典中
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  // 添加 effect 回调函数
  dep.add(activeEffect);
}
/**
 * 触发更新
 * @param target
 * @param key
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (!dep) return;

  // 遍历 dep 集合，执行 effect 回调函数
  dep.forEach((effect) => {
    effect();
  });
}

/**
 * 将raw转换为响应式对象
 * @param raw
 * @returns {{__v_isRef: boolean, value}|{__v_isRef}|*}
 */
export function ref(raw) {
  // 判断 raw 是否是 ref 创建的对象，如果是，直接返回
  if (isObject(raw) && raw.__v_isRef) return raw;

  // convert 判断是否是对象，如果是，就调用reactive，如果不是，直接返回
  let value = convert(raw);

  const r = {
    __v_isRef: true, // 标识，表示该对象是 ref 创建的
    get value() {
      track(r, 'value');
      return value;
    },
    set value(newValue) {
      // 判断新旧值是否相等
      if (newValue !== value) {
        raw = newValue;
        value = convert(raw);
        trigger(r, 'value');
      }
    },
  };

  return r;
}

/**
 * 将代理对象转换为ref
 * @param proxy
 * @returns {any[]}
 */
export function toRefs(proxy) {
  // 判断是否是响应式的数组
  const ret = proxy instanceof Array ? new Array(proxy.length) : {};

  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key);
  }

  return ret;
}

/**
 * 计算属性
 * @param getter
 * @returns {{__v_isRef: boolean, value}|{__v_isRef}|*}
 */
export function computed(getter) {
  const result = ref();

  // 通过 effect 监听响应式数据的变化
  // 内部调用 getter 并将结果赋值给 result.value
  effect(() => {
    result.value = getter();
  });

  return result;
}
```
