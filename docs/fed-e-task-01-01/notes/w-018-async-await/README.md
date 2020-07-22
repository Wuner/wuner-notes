# [Async 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

async function 用来定义一个返回 AsyncFunction 对象的异步函数。异步函数是指通过事件循环异步执行的函数，它会通过一个隐式的 Promise 返回其结果。如果你在代码中使用了异步函数，就会发现它的语法和结构会更像是标准的同步函数。

## 语法

> async function name([param[, param[, ... param]]]) { statements }

## 描述

一个 async 异步函数可以包含 await 指令，该指令会暂停异步函数的执行，并等待 Promise 执行，然后继续执行异步函数，并返回结果。

记住，await 关键字只在异步函数内有效。如果你在异步函数外使用它，会抛出语法错误。

注意，当异步函数暂停时，它调用的函数会继续执行(收到异步函数返回的隐式 Promise)

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
async function main() {
  try {
    const result = await Ajax('fed-e-task-01-01/notes/promise/api/user.json');
    console.log(result);
    const result1 = await Ajax('fed-e-task-01-01/notes/promise/api/class.json');
    console.log(result1);
  } catch (e) {
    console.error(e);
  }
}

main();
```
