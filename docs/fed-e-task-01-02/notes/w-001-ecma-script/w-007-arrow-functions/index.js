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

// function Person() {
//   // Person() 构造函数定义 `this`作为它自己的实例.
//   this.age = 0;
//
//   setTimeout(function growUp() {
//     // 在非严格模式, growUp()函数定义 `this`作为全局对象,
//     // 与在 Person()构造函数中定义的 `this`并不相同.
//     this.age++;
//     console.log(this.age); // NaN
//   }, 1000);
// }
// function Person() {
//   const that = this;
//   that.age = 0;
//
//   setTimeout(function growUp() {
//     //  回调引用的是`that`变量, 其值是预期的对象.
//     that.age++;
//     console.log(that.age); // 1
//   }, 1000);
// }
function Person() {
  this.age = 0;

  setTimeout(() => {
    this.age++; // |this| 正确地指向 p 实例
    console.log(this.age); // 1
  }, 1000);
}
// new Person();

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
/* eslint no-undef: 0 */
const foo = (...args) => {
  console.log(arguments[0]); // {}
  console.log(args); // [1,2]
};
foo(1, 2);
