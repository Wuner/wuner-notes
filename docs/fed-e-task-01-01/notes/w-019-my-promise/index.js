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

Promise.race([promise4, '1', promise5]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
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
