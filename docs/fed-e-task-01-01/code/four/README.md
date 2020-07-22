# Promise

## 描述

Promise 对象是一个代理对象（代理一个值），被代理的值在 Promise 对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象

> 一个 Promise 有以下几种状态:

- pending: 初始状态，既不是成功，也不是失败状态。

- fulfilled: 意味着操作成功完成。

- rejected: 意味着操作失败。

pending 状态的 Promise 对象可能会变为 fulfilled 状态并传递一个值给相应的状态处理方法，也可能变为失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers ）就会被调用（then 方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当 Promise 状态为 fulfilled 时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。

> Promise 创建时需传入 executor 函数

executor 是带有 resolve 和 reject 两个参数的函数 。Promise 构造函数执行时立即调用 executor 函数， resolve 和 reject 两个函数作为参数传递给 executor（executor 函数在 Promise 构造函数返回所建 promise 实例对象前被调用）。resolve 和 reject 函数被调用时，分别将 promise 的状态改为 fulfilled（完成）或 rejected（失败）。executor 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 resolve 函数来将 promise 状态改成 fulfilled，要么调用 reject 函数将 promise 的状态改为 rejected。如果在 executor 函数中抛出一个错误，那么该 promise 状态为 rejected。executor 函数的返回值被忽略。

> then 方法链式调用，后面的 then 方法的回调函数的入参取自上一个 then 方法的回调函数的返回值

## demo

### 自定义 promise

```javascript
class Promise {
  /**
   * 构造函数
   * @param executor {Function} 执行器
   */
  constructor(executor) {
    /**
     * 初始状态，既不是成功，也不是失败状态
     * @type {string}
     */
    this.PENDING = 'pending';
    /**
     * 意味着操作成功完成
     * @type {string}
     */
    this.FULFILLED = 'fulfilled';
    /**
     * 意味着操作失败
     * @type {string}
     */
    this.REJECTED = 'rejected';

    /**
     * Promise 状态
     * @type {string} 默认值PENDING
     */
    this.status = this.PENDING;
    /**
     * 成功回调函数入参的值
     * @type {string} 默认值undefined
     */
    this.value = undefined;
    /**
     * 失败回调函数入参的值
     * @type {string} 默认值undefined
     */
    this.reason = undefined;
    /**
     * successCallback 成功回调函数
     * @type {Array} 默认值[]
     */
    this.successCallback = [];
    /**
     * failCallback 失败回调函数
     * @type {Array} 默认值[]
     */
    this.failCallback = [];

    /**
     * privateResolve 解析
     * @param value 成功回调的入参
     */
    this.privateResolve = (value) => {
      // 在promise的状态为PENDING时，允许改变其状态
      if (this.status === this.PENDING) {
        // 触发resolve，将promise的状态改为fulfilled（完成）
        this.status = this.FULFILLED;
        // 将resolve传递的参数，保存在Promise对象的value里
        this.value = value;
        // 如果successCallback成功回调函数存在，则执行
        this.successCallback.forEach((callback) => {
          callback();
        });
      }
    };

    /**
     * privateReject 驳回
     * @param reason 失败回调入参
     */
    this.privateReject = (reason) => {
      // 在promise的状态为PENDING时，允许改变其状态
      if (this.status === this.PENDING) {
        // 触发reject，将promise的状态改为rejected（失败）
        this.status = this.REJECTED;
        // 将reject传递的参数，保存在MyPromise对象的reason里
        this.reason = reason;
        // 如果failCallback失败回调函数存在，则执行
        this.failCallback.forEach((callback) => {
          callback();
        });
      }
    };
    // 捕获执行器异常，并从reject抛出
    try {
      executor(this.privateResolve, this.privateReject);
    } catch (e) {
      this.privateReject(e);
    }
  }

  then(successCallback, failCallback) {
    // 判断successCallback和failCallback是否存在，不存在将值向下传递
    successCallback = successCallback ? successCallback : (value) => value;
    // failCallback = failCallback ? failCallback : (reason) => reason;
    failCallback = failCallback
      ? failCallback
      : (reason) => {
          throw reason;
        };
    // 链式调用实现，返回Promise函数对象
    let promise = new Promise((resolve, reject) => {
      // 判断promise的状态，当其状态为FULFILLED时，触发成功回调函数；当其状态为REJECTED时，触发成功回调函数
      // 后面的 then 方法的回调函数的入参取自上一个 then 方法的回调函数的返回值
      // promise对象未生成，所以将resolvePromise放到异步里调用，等待promise对象未生成后执行
      if (this.status === this.FULFILLED) {
        // 捕获异常，并从reject抛出
        setTimeout(() => {
          try {
            resolvePromise(
              promise,
              successCallback(this.value),
              resolve,
              reject,
            );
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === this.REJECTED) {
        // 捕获异常，并从reject抛出
        setTimeout(() => {
          try {
            resolvePromise(promise, failCallback(this.reason), resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 当判断promise的状态，当其状态为PENDING时，存储回调函数
        this.successCallback.push(() => {
          // 捕获异常，并从reject抛出
          setTimeout(() => {
            try {
              resolvePromise(
                promise,
                successCallback(this.value),
                resolve,
                reject,
              );
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failCallback.push(() => {
          // 捕获异常，并从reject抛出
          setTimeout(() => {
            try {
              resolvePromise(
                promise,
                failCallback(this.reason),
                resolve,
                reject,
              );
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise;
  }

  /**
   * finally 等待Promise对象执行完所有任务，并执行
   * @param callback 回调函数
   * @returns {Promise} 返回Promise对象
   */
  finally(callback) {
    return this.then(
      (value) => {
        return Promise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return Promise.resolve(callback()).then(() => {
          throw reason;
        });
      },
    );
  }

  /**
   * catch 返回失败回调函数
   * @param callback 回调函数
   * @returns {Promise} 返回Promise对象
   */
  catch(callback) {
    return this.then(undefined, callback);
  }

  /**
   * 等待所有Promise对象执行完毕，并返回结果
   * @param array {Array} 数组对象
   * @returns {Promise} 返回Promise对象
   */
  static all(array) {
    // 返回数组
    let result = [];
    // 计数器
    let index = 0;
    return new Promise((resolve, reject) => {
      /**
       * addResult 向result数组添加返回值
       * @param key {Number} key值
       * @param value {Object} value值
       */
      const addResult = (key, value) => {
        result[key] = value;
        index++;
        // 判断所有异步操作完成后，执行resolve
        if (array.length === index) {
          resolve(result);
        }
      };
      // 遍历
      array.forEach((val, i) => {
        // 判断当前值，是否属于Promise对象
        if (val instanceof Promise) {
          // Promise对象
          // 执行成功回调函数，获取返回值，并添加到result数组里
          // 执行失败回调函数，直接通过reject抛出失败原因
          val.then(
            (value) => addResult(i, value),
            (reason) => reject(reason),
          );
        } else {
          // 普通对象，将当前值添加到result数组里
          addResult(i, val);
        }
      });
    });
  }

  /**
   * resolve 解析
   * @param value
   * @returns {Promise}
   */
  static resolve(value) {
    // 判断value是否是Promise对象，是则直接返回，否则创建Promise对象并返回
    if (value instanceof Promise) return value;
    return new Promise((resolve) => resolve(value));
  }

  /**
   * reject 驳回
   * @param value
   * @returns {Promise}
   */
  static reject(value) {
    // 判断value是否是Promise对象，是则直接返回，否则创建Promise对象并返回
    if (value instanceof Promise) return value;
    return new Promise((undefined, reject) => reject(value));
  }

  /**
   * 返回一个 promise，一旦迭代器中的某个 promise 解析或拒绝，返回的 promise 就会解析或拒绝。
   * @param array {Array} 数组对象
   * @returns {Promise} 返回Promise对象
   */
  static race(array) {
    return new Promise((resolve, reject) => {
      // 遍历
      array.forEach((val, i) => {
        // 判断当前值，是否属于Promise对象
        if (val instanceof Promise) {
          // Promise对象
          // 执行成功回调函数，获取返回值，并通过resolve弹出
          // 执行失败回调函数，直接通过reject抛出失败原因
          val.then(
            (value) => resolve(value),
            (reason) => reject(reason),
          );
        } else {
          // 普通对象，将当前值通过resolve弹出
          resolve(val);
        }
      });
    });
  }
}

/**
 * resolvePromise 解析Promise
 * @param promise promise对象
 * @param result 上一个then回调函数返回值
 * @param resolve 解析函数
 * @param reject 驳回函数
 */
const resolvePromise = (promise, result, resolve, reject) => {
  // 判断promise与result是否相等，如果相等，则是promise循环调用，这里应该抛出异常，并阻止往下执行
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for my-promise'));
  }
  // 判断result是普通对象还是属于Promise对象
  if (result instanceof Promise) {
    // 查看Promise对象返回结果，调用对应的resolve或reject
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
};

module.exports = Promise;
```

### 调用

```javascript
const Promise = require('./promise');

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
// Promise基本使用
let promise = new Promise((resolve, reject) => {
  // resolve('成功');
  reject('失败');
});

promise
  .then((res) => {
    console.log(res);
  })
  .catch((e) => console.error(e));
// promise方式Ajax使用
Ajax('fed-e-task-01-01/notes/promise/api/user.json').then(
  (value) => {
    console.log(value);
  },
  (e) => {
    console.error(e);
  },
);

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

// promise静态方法使用
// all  方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果
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

// race返回一个 promise，一旦迭代器中的某个promise解析或拒绝，返回的 promise就会解析或拒绝。
const promise4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise5 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise4, promise5]).then((value) => {
  console.log(value);
  // Both resolve, but promise5 is faster
});

/**
 * 输出结果
 * two
 */

// reject方法返回一个带有拒绝原因的Promise对象

Promise.reject(new Error('fail')).catch((e) => console.error(e.message));
/**
 * 输出结果
 * fail
 */
// resolve方法返回一个以给定值解析后的Promise 对象。如果这个值是一个 promise ，那么将返回这个 promise ；如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平
Promise.resolve('success').then((res) => console.log(res));
/**
 * 输出结果
 * success
 */
```
