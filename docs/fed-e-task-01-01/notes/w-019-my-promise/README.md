# 模拟 Promise

## 描述

1. Promise 是一个类，参数是一个执行器函数， 执行器函数自执行。

2. Promise 有 3 个状态 Pending 默认等待态 、Fulfilled 成功态 、Rejected 失败态 状态一改变就不能再次修改 Pending -> Fulfilled || Pending -> Rejected

3. 执行器函数参数有 resolve 方法和 reject 方法 resolve 方法将 Pending 3.> Fulfilled reject 方法将 Rejected -> Rejected resolve 方法的参数将作为 then 方法成功回调的值， reject 方法的参数将作为 then 方法失败回调的原因。

4. then 方法有两个参数 一个是成功回调的函数 successCallback，一个是失败回调的函数 failCallback。 promise 的成功态会将成功的值传给成功的回调并且执行，失败态会将失败的原因传递给失败的回调并执行。

5. 执行器中 resolve 和 reject 在异步中执行的时候，当前状态还是等待态 需要把 then 方法的成功回调和失败回调存起来，等异步调用 resolve 的时候调用成功回调，reject 的时候调用失败回调

6. then 方法

   > a. then 方法多次调用添加多个处理函数；

   > b. 实现 then 的链式调用： then 方法链式调用识别 promise 自返回 then 链式调用 返回的是一个新的 promise 对象

   > c. 判断 then 方法成功回调和失败回调的返回值 x x 返回的是一个 pormise，判断 x 和当前 then 返回是不是同一个 promise,如果是同一个 promise 就报错。x 和 then 返回的不是同一个 promise,将 x 的 then 方法执行返回给下一个 then。 x 是常量直接当作下一个 then 的成功回调的参数。后面 then 方法的回调函数拿到值的是上一个 then 方法的回调函数的返回值。

   > d.捕获错误及 then 链式调用其他状态代码补充

   > e. then 方法的参数可选 ​

   > f. then 方法的值穿透

7. executor 执行器函数 / then 方法可能有错误，有错误直接调用 reject 方法

8. all 和 race 方法的实现

   > all 和 race 方法不管 promise 成功还是失败都不会影响其他 promise 执行 ​ all 方法返回一个新的 promise​ all 参数里面每一项执行完成，才把所有结果依次按原顺序 resolve 出去 ​ all 方法只要一个 promise 失败就 reject 失败的 promise 结果 ​ Promise.race 方法，谁执行的快就返回谁

9. resolve 和 reject 方法的实现

10. resolve 方法： 相当于实例化 Promise 对象，并且调用了 resolve 方法 reject 方法：相当于实例化 Promise 对象，并且调用了 reject 方法

11. finally 方法的实现

12. finally 的实现，不管是成功状态还是失败态都会进这个 finally 方法 (等待态不会进)。finally 方法会返回一个新的 promise，它拿不到上次 then 执行的结果(所以没有参数)，内部会手动执行一次 promise 的 then 方法。finally 方法有错误会把错误作为下次 then 方法的失败回调的参数。

13. catch 方法的实现

    > catch 方法相当于执行 then 方法的失败回调

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
