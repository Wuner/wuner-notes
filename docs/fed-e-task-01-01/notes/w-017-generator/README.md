# [Generator（生成器）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)

生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let g = gen();
// "Generator { }"
```

## 方法

> Generator.prototype.next()

- 返回一个由 yield 表达式生成的值。

```javascript
const arr = [1, 2, 3];
function* idMaker() {
  for (let val of arr) {
    yield val;
  }
}

let gen = idMaker(); // "Generator { }"

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
/**
 * 输出结果
 * 1
 * 2
 * 3
 */
```

> Generator.prototype.return()

- 返回给定的值并结束生成器。

```javascript
const arr = [1, 2, 3];
function* idMaker() {
  for (let val of arr) {
    yield val;
  }
}

let gen = idMaker(); // "Generator { }"

console.log(gen.next().value);
console.log(gen.return('结束').value);
console.log(gen.next().value);
console.log(gen.next().value);
/**
 * 输出结果
 * 1
 * Uncaught Error: error
 * undefined
 * undefined
 */
```

> Generator.prototype.throw()

- 向生成器抛出一个错误。

```javascript
const arr = [1, 2, 3];
function* idMaker() {
  for (let val of arr) {
    yield val;
  }
}

let gen = idMaker(); // "Generator { }"

console.log(gen.next().value);
// 阻止生成器函数往下运行，并抛出异常
gen.throw(new Error('error'));
console.log(gen.next().value);
console.log(gen.next().value);
/**
 * 输出结果
 * 1
 * Uncaught Error: error
 */
```

## demo

```javascript
// generator配合promise使用
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
function* main() {
  try {
    const result = yield Ajax('fed-e-task-01-01/notes/promise/api/user.json');
    console.log(result);
    const result1 = yield Ajax('fed-e-task-01-01/notes/promise/api/class.json');
    console.log(result1);
  } catch (e) {
    console.error(e);
  }
}

const co = (generator) => {
  const g = generator();
  function handelResult(result) {
    if (result.done) return;
    result.value.then(
      (res) => {
        handelResult(g.next(res));
      },
      (e) => {
        handelResult(g.throw(e));
      },
    );
  }
  handelResult(g.next());
};

co(main);
```
