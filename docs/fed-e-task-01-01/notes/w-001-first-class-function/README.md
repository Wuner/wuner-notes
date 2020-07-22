# 函数是一等公民([First-class Function](https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function))

## 特性

> 可将函数赋值给变量，即函数可存储在变量中

> 函数可作为参数

> 函数可作为返回值

## 说明

在 JavaScript 中函数就是一个普通的对象 (可以通过 new Function() )，我们可以把函数存储到变量/数组中，它还可以作为另一个函数的参数和返回值，甚至我们可以在程序运行的时候通过 new Function('alert(1)') 来构造一个新的函数。

## demo

```javascript
// 可将函数赋值给变量，即函数可存储在变量中
const foo = function () {
  console.log('foobar');
};
// 用变量来调用它
foo();
```

```javascript
// 函数可作为参数
function sayHello() {
  return 'Hello, ';
}
function greeting(helloMessage, name) {
  console.log(helloMessage() + name);
}
// 传递 `sayHello` 作为 `greeting` 函数的参数
greeting(sayHello, 'JavaScript!'); // Hello, JavaScript!
```

```javascript
// 函数可作为返回值
function sayHello() {
  return function () {
    console.log('Hello!');
  };
}
```
