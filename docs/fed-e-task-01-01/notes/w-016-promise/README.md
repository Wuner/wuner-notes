# [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值.

## 参数

> executor

executor 是带有 resolve 和 reject 两个参数的函数 。Promise 构造函数执行时立即调用 executor 函数， resolve 和 reject 两个函数作为参数传递给 executor（executor 函数在 Promise 构造函数返回所建 promise 实例对象前被调用）。resolve 和 reject 函数被调用时，分别将 promise 的状态改为 fulfilled（完成）或 rejected（失败）。executor 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 resolve 函数来将 promise 状态改成 fulfilled，要么调用 reject 函数将 promise 的状态改为 rejected。如果在 executor 函数中抛出一个错误，那么该 promise 状态为 rejected。executor 函数的返回值被忽略。

## 描述

Promise 对象是一个代理对象（代理一个值），被代理的值在 Promise 对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象

> 一个 Promise 有以下几种状态:

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

pending 状态的 Promise 对象可能会变为 fulfilled 状态并传递一个值给相应的状态处理方法，也可能变为失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers ）就会被调用（then 方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当 Promise 状态为 fulfilled 时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 promise 对象， 所以它们可以被链式调用。

## demo

```javascript
// Promise基本使用
let promise = new Promise((resolve, reject) => {
  // resolve('成功');
  reject('失败');
});

promise.then(
  (res) => {
    console.log(res);
  },
  (e) => {
    console.log(e);
  },
);
```

```javascript
const Ajax = (url) => {
  // promise方式Ajax使用
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    xhr.send();
  });
};
Ajax('fed-e-task-01-01/notes/promise/api/user.json').then(
  (value) => {
    console.log(value);
  },
  (e) => {
    console.log(e);
  },
);
```

```javascript
// promise链式调用

Ajax('fed-e-task-01-01/notes/promise/api/user.json')
  .then((value) => {
    console.log(value);
    return Ajax('fed-e-task-01-01/notes/promise/api/class.json');
  })
  .then((value) => {
    console.log(value);
    return 'abc';
  })
  .then((value) => console.log(value));
```

promise 静态方法使用

- all 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中 promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果

```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});

/**
 * 输出结果
 * [3, 42, "foo"]
 */
```

- race 返回一个 promise，一旦迭代器中的某个 promise 解析或拒绝，返回的 promise 就会解析或拒绝。

```javascript
const promise4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise5 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise4, promise5]).then((value) => {
  console.log(value);
  // 都解析了，但是promise2更快
});

/**
 * 输出结果
 * two
 */
```

- reject 方法返回一个带有拒绝原因的 Promise 对象

```javascript
Promise.reject(new Error('fail')).catch((e) => console.error(e.message()));

/**
 * 输出结果
 * fail
 */
```

- resolve 方法返回一个以给定值解析后的 Promise 对象。如果这个值是一个 promise ，那么将返回这个 promise ；如果这个值是 thenable（即带有"then" 方法），返回的 promise 会“跟随”这个 thenable 的对象，采用它的最终状态；否则返回的 promise 将以此值完成。此函数将类 promise 对象的多层嵌套展平

```javascript
Promise.resolve('success').then((res) => console.log(res));

/**
 * 输出结果
 * success
 */
```

## [Event Loop（事件循环）](https://segmentfault.com/a/1190000016278115?utm_source=tag-newest)

Event Loop 它最主要是分三部分：主线程、宏任务（macrotask）、微任务（microtask）

### 宏任务

宏任务，macrotask，也叫 tasks。 一些异步任务的回调会依次进入 macro task queue，等待后续被调用，这些异步任务包括：

- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

### 微任务

微任务，microtask，也叫 jobs。 另一些异步任务的回调会依次进入 micro task queue，等待后续被调用，这些异步任务包括：

- Promise
- Object.observe
- MutationObserver
- process.nextTick

### 执行顺序

主线程 > 微任务 > 宏任务
