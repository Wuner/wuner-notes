# Arrow Functions(箭头函数)

箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 this，arguments，super 或 new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

## 描述

引入箭头函数有两个方面的作用：更简短的函数并且不绑定 this。

> 更短的函数

```javascript
const elements = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'];

console.log(
  elements.map(function (element) {
    return element.length;
  }),
); // 返回数组：[8, 6, 7, 9]

// 上面的普通函数可以改写成如下的箭头函数
console.log(
  elements.map((element) => {
    return element.length;
  }),
); // [8, 6, 7, 9]

// 当箭头函数只有一个参数时，可以省略参数的圆括号
console.log(
  elements.map((element) => {
    return element.length;
  }),
); // [8, 6, 7, 9]

// 当箭头函数的函数体只有一个 `return` 语句时，可以省略 `return` 关键字和方法体的花括号
console.log(elements.map((element) => element.length)); // [8, 6, 7, 9]

// 在这个例子中，因为我们只需要 `length` 属性，所以可以使用参数解构
// 需要注意的是字符串 `"length"` 是我们想要获得的属性的名称，而 `lengthFooBArX` 则只是个变量名，
// 可以替换成任意合法的变量名
console.log(elements.map(({ length: lengthFooBArX }) => lengthFooBArX)); // [8, 6, 7, 9]
```

> 没有单独的 this

在箭头函数出现之前，每一个新函数根据它是被如何调用的来定义这个函数的 this 值：

- 如果是该函数是一个构造函数，this 指针指向一个新的对象
- 在严格模式下的函数调用下，this 指向 undefined
- 如果是该函数是一个对象的方法，则它的 this 指针指向这个对象

```javascript
function Person() {
  // Person() 构造函数定义 `this`作为它自己的实例.
  this.age = 0;

  setTimeout(function growUp() {
    // 在非严格模式, growUp()函数定义 `this`作为全局对象,
    // 与在 Person()构造函数中定义的 `this`并不相同.
    this.age++;
    console.log(this.age); // NaN
  }, 1000);
}

new Person();
```

在 ECMAScript 3/5 中，通过将 this 值分配给封闭的变量，可以解决 this 问题。

```javascript
function Person() {
  const that = this;
  that.age = 0;

  setTimeout(function growUp() {
    //  回调引用的是`that`变量, 其值是预期的对象.
    that.age++;
    console.log(that.age); // 1
  }, 1000);
}
new Person();
```

箭头函数不会创建自己的 this,它只会从自己的作用域链的上一层继承 this。因此，在下面的代码中，传递给 setInterval 的函数内的 this 与封闭函数中的 this 值相同：

```javascript
function Person() {
  this.age = 0;

  setTimeout(() => {
    this.age++; // |this| 正确地指向 p 实例
    console.log(this.age); // 1
  }, 1000);
}

new Person();
```

与严格模式的关系

鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。

```javascript
const f = () => {
  return this;
};
function f1() {
  'use strict';
  return this;
}
function f2() {
  return this;
}
console.log(f() === global); // false
console.log(f1() === global); // false
console.log(f2() === global); // true
```

通过 call 或 apply 调用

由于 箭头函数没有自己的 this 指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定 this），他们的第一个参数会被忽略。（这种现象对于 bind 方法同样成立）

```javascript
const adder = {
  base: 1,

  add: function (a) {
    const f = (v) => v + this.base;
    return f(a);
  },

  addThruCall: function (a) {
    const f = (v) => v + this.base;
    const b = {
      base: 2,
    };

    return f.call(b, a);
  },
};

console.log(adder.add(1)); // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2
```

> 不绑定 arguments

箭头函数不绑定 Arguments 对象。

```javascript
const foo = (...args) => {
  console.log(arguments[0]); // {}
  console.log(args); // [1,2]
};
foo(1, 2);
```

> 箭头函数不能用作构造器，和 new 一起用会抛出错误。

> 箭头函数没有 prototype 属性。

> yield 关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）。因此，箭头函数不能用作函数生成器。
