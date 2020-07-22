# [Proxy(代理)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

## 参数

> target

要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

> handler

一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

## handler 对象的方法

handler 对象是一个容纳一批特定属性的占位符对象。它包含有 Proxy 的各个捕获器（trap）。

所有的捕捉器是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为。

> handler.getPrototypeOf()

Object.getPrototypeOf 方法的捕捉器。

> handler.setPrototypeOf()

Object.setPrototypeOf 方法的捕捉器。

> handler.isExtensible()

Object.isExtensible 方法的捕捉器。

> handler.preventExtensions()

Object.preventExtensions 方法的捕捉器。

> handler.getOwnPropertyDescriptor()

Object.getOwnPropertyDescriptor 方法的捕捉器。

> handler.defineProperty()

Object.defineProperty 方法的捕捉器。

> handler.has()

in 操作符的捕捉器。

> handler.get()

属性读取操作的捕捉器。

> handler.set()

属性设置操作的捕捉器。

> handler.deleteProperty()

delete 操作符的捕捉器。

> handler.ownKeys()

Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols 方法的捕捉器。

> handler.apply()

函数调用操作的捕捉器。

> handler.construct()

new 操作符的捕捉器。

## demo

```javascript
const handler = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 37;
  },
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log('c' in p, p.c); // false, 37

let validator = {
  set: function (obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    obj[prop] = value;

    // 表示成功
    return true;
  },
};

let person = new Proxy({}, validator);

person.age = 100;

console.log(person.age);
// 100

person.age = 'young';
// 抛出异常: Uncaught TypeError: The age is not an integer

person.age = 300;
// 抛出异常: Uncaught RangeError: The age seems invalid
```

> 具体使用查看[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
