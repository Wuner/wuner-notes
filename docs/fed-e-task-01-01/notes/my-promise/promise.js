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
