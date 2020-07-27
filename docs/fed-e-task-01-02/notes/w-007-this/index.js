// 在node中, 顶级this指向module.exports，并非指向global
// 在node中, 你可以使用 globalThis 获取全局对象，无论你的代码是否在当前上下文运行。
console.log(this === module.exports); // true
console.log(this === global); // false

this.b = 'Heath'; //
console.log(module.exports.b); // "Heath"
/* eslint no-undef: 0 */
console.log(globalThis); // global

function f1() {
  return this;
}
//在浏览器中：全局对象是window
// console.log(f1() === window); // true

//在Node中：全局对象是global
console.log(f1() === global); // true

function f2() {
  'use strict'; // 这里是严格模式
  return this;
}

console.log(f2() === undefined); // true

// 将一个对象作为call和apply的第一个参数，this会被绑定到这个对象。
let obj = { a: 'Custom' };

function whatsThis() {
  console.log(this); // this的值取决于函数的调用方式
}

whatsThis(); // global
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'

function add(c, d) {
  console.log(this.a + this.b + c + d);
}

let o = { a: 1, b: 3 };

// 第一个参数是作为‘this’使用的对象
// 后续参数作为参数传递给函数调用
add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

// 第一个参数也是作为‘this’使用的对象
// 第二个参数是一个数组，数组里的元素用作函数调用中的参数
add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34

function bar() {
  console.log(Object.prototype.toString.call(this));
}

//原始值 7,'foo' 被隐式转换为对象
bar.call(7); // [object Number]
bar.call('foo'); // [object String]

function f() {
  return this.a;
}

let g = f.bind({ a: 'heath' });
console.log(g()); // heath

let h = g.bind({ a: 'yoo' }); // bind只生效一次！
console.log(h()); // heath

let oBind = { a: 37, f: f, g: g, h: h };
console.log(oBind.a, oBind.f(), oBind.g(), oBind.h()); // 37, 37, heath, heath

let globalObject = this;
let foo = () => this;
console.log(foo() === globalObject); // true
// 接着上面的代码
// 作为对象的一个方法调用
let obj1 = { foo: foo };
console.log(obj1.foo() === globalObject); // true

// 尝试使用apply来设定this
console.log(foo.apply(obj1) === globalObject); // true

// 尝试使用call来设定this
console.log(foo.call(obj1) === globalObject); // true

// 尝试使用bind来设定this
foo = foo.bind(obj1);
console.log(foo() === globalObject); // true
console.log('======================================');
// 创建一个含有bar方法的obj对象，
// bar返回一个函数，
// 这个函数返回this，
// 这个返回的函数是以箭头函数创建的，
// 所以它的this被永久绑定到了它外层函数的this。
// bar的值可以在调用中设置，这反过来又设置了返回函数的值。
let obj2 = {
  bar: function () {
    return () => this;
  },
};

// 作为obj对象的一个方法来调用bar，把它的this绑定到obj。
// 将返回的函数的引用赋值给fn。
let fn = obj2.bar();

// 若在严格模式则为undefined
console.log(fn() === obj2); // true

// 但是注意，如果你只是引用obj的方法，
// 而没有调用它
let fn2 = obj2.bar;
// 那么调用箭头函数后，this指向window，因为它从 bar 继承了this。
console.log(fn2()() === global); // true

function f3() {
  return this.prop;
}
let obj3 = {
  prop: 37,
  f: f3,
};

console.log(obj3.f()); // 37

let obj4 = { prop: 37 };

function independent() {
  return this.prop;
}

obj4.f = independent;

console.log(obj4.f()); // 37

let obj5 = {};
obj5.b = { g: independent, prop: 42 };
console.log(obj5.b.g()); // 42

let obj6 = {
  f: function () {
    return this.a + this.b;
  },
};
let p = Object.create(obj6);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5

/*
 * 构造函数这样工作:
 *
 * function MyConstructor(){
 *   // 函数实体写在这里
 *   // 根据需要在this上创建属性，然后赋值给它们，比如：
 *   this.fum = "nom";
 *   // 等等...
 *
 *   // 如果函数具有返回对象的return语句，
 *   // 则该对象将是 new 表达式的结果。
 *   // 否则，表达式的结果是当前绑定到 this 的对象。
 *   //（即通常看到的常见情况）。
 * }
 */

function C() {
  this.a = 37;
}

let obj7 = new C();
console.log(obj7.a); // 37

function C2() {
  this.a = 37;
  return { a: 38 };
}

obj7 = new C2();
console.log(obj7.a); // 38
