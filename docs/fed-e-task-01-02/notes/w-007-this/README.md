# [this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 理解

与其他语言相比，函数的 this 关键字在 JavaScript 中的表现略有不同，此外，在严格模式和非严格模式之间也会有一些差别。

在绝大多数情况下，函数的调用方式决定了 this 的值。this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。ES5 引入了 bind 方法来设置函数的 this 值，而不用考虑函数如何被调用的，ES2015 引入了支持 this 词法解析的箭头函数（它在闭合的执行环境内设置 this 的值）。

## 全局环境

无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。

```javascript
// 在浏览器中, window 对象同时也是全局对象：
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = 'Heath';
console.log(window.b); // "Heath"
console.log(b); // "Heath"
```

```javascript
// 在node中, 顶级this指向module.exports，并非指向global
// 在node中, 你可以使用 globalThis 获取全局对象，无论你的代码是否在当前上下文运行。
console.log(this === module.exports); // true
console.log(this === global); // false

this.b = 'Heath'; //
console.log(module.exports.b); // "Heath"
console.log(globalThis); // global
```

## 函数（运行内）环境

在函数内部，this 的值取决于函数被调用的方式。

> 简单调用

因为下面的代码不在严格模式下，且 this 的值不是由该调用设置的，所以 this 的值默认指向全局对象。

```javascript
function f1() {
  return this;
}
//在浏览器中：全局对象是window
console.log(f1() === window); // true

//在Node中：全局对象是global
console.log(f1() === global); // true
```

然而，在严格模式下，this 将保持他进入执行环境时的值，所以下面的 this 将会默认为 undefined。

```javascript
function f2() {
  'use strict'; // 这里是严格模式
  return this;
}

console.log(f2() === undefined); // true
```

所以，在严格模式下，如果 this 没有被执行环境（execution context）定义，那它将保持为 undefined。

如果要想把 this 的值从一个环境传到另一个，就要用 call 或者 apply 方法。

```javascript
// 将一个对象作为call和apply的第一个参数，this会被绑定到这个对象。
let obj = { a: 'Custom' };

function whatsThis() {
  console.log(this); // this的值取决于函数的调用方式
}

whatsThis(); // node 环境：global，浏览器环境：window
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'
```

当一个函数在其主体中使用 this 关键字时，可以通过使用函数继承自 Function.prototype 的 call 或 apply 方法将 this 值绑定到调用中的特定对象。

```javascript
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
```

使用 call 和 apply 函数的时候要注意，如果传递给 this 的值不是一个对象，JavaScript 会尝试使用内部 ToObject 操作将其转换为对象。因此，如果传递的值是一个原始值比如 7 或 'foo'，那么就会使用相关构造函数将它转换为对象，所以原始值 7 会被转换为对象，像 new Number(7) 这样，而字符串 'foo' 转化成 new String('foo') 这样，例如：

```javascript
function bar() {
  console.log(Object.prototype.toString.call(this));
}

//原始值 7,'foo' 被隐式转换为对象
bar.call(7); // [object Number]
bar.call('foo'); // [object String]
```

> bind 方法

ECMAScript 5 引入了 Function.prototype.bind()。调用 f.bind(someObject)会创建一个与 f 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的。

```javascript
function f() {
  return this.a;
}

let g = f.bind({ a: 'heath' });
console.log(g()); // heath

let h = g.bind({ a: 'yoo' }); // bind只生效一次！
console.log(h()); // heath

let oBind = { a: 37, f: f, g: g, h: h };
console.log(oBind.a, oBind.f(), oBind.g(), oBind.h()); // 37, 37, heath, heath
```

> 箭头函数

在箭头函数中（其本身不存在 this），this 与封闭词法环境的 this 保持一致。在全局代码中，它将被设置为全局对象：

```javascript
let globalObject = this;
let foo = () => this;
console.log(foo() === globalObject); // true
```

```javascript
let globalObject = this;
let foo = () => this;
console.log(foo() === globalObject); // true
// 作为对象的一个方法调用
let obj = { foo: foo };
console.log(obj.foo() === globalObject); // true

let obj1 = { a: 12 };
// 尝试使用apply来设定this
console.log(foo.apply(obj1) === globalObject); // true

// 尝试使用call来设定this
console.log(foo.call(obj1) === globalObject); // true

// 尝试使用bind来设定this
foo = foo.bind(obj1);
console.log(foo() === globalObject); // true
```

无论如何，foo 的 this 被设置为他被创建时的环境（在上面的例子中，就是全局对象）。这同样适用于在其他函数内创建的箭头函数：这些箭头函数的 this 被设置为封闭的词法环境的。

```javascript
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
```

在上面的例子中，一个赋值给了 obj.bar 的函数（称为匿名函数 A），返回了另一个箭头函数（称为匿名函数 B）。因此，在 A 调用时，函数 B 的 this 被永久设置为 obj.bar（函数 A）的 this。当返回的函数（函数 B）被调用时，它 this 始终是最初设置的。在上面的代码示例中，函数 B 的 this 被设置为函数 A 的 this，即 obj，所以即使被调用的方式通常将其设置为 undefined 或全局对象（或者如前面示例中的其他全局执行环境中的方法），它的 this 也仍然是 obj 。

> 作为对象的方法

当函数作为对象里的方法被调用时，它们的 this 是调用该函数的对象。

下面的例子中，当 obj3.f()被调用时，函数内的 this 将绑定到 obj3 对象。

```javascript
function f3() {
  return this.prop;
}
let obj3 = {
  prop: 37,
  f: f3,
};

console.log(obj3.f()); // 37
```

请注意，这样的行为，根本不受函数定义方式或位置的影响。在前面的例子中，我们在定义对象 obj4 的同时，将函数内联定义为成员 f 。但是，我们也可以先定义函数，然后再将其附属到 obj4.f。这样做会导致相同的行为：

```javascript
let obj4 = { prop: 37 };

function independent() {
  return this.prop;
}

obj4.f = independent;

console.log(obj4.f()); // 37
```

这表明函数是从 obj4 的 f 成员调用的才是重点。

同样，this 的绑定只受最靠近的成员引用的影响。在下面的这个例子中，我们把一个方法 g 当作对象 obj5.b 的函数调用。在这次执行期间，函数中的 this 将指向 obj5.b。事实证明，这与他是对象 obj5 的成员没有多大关系，最靠近的引用才是最重要的。

```javascript
let obj5 = {};
obj5.b = { g: independent, prop: 42 };
console.log(obj5.b.g()); // 42
```

> 原型链中的 this

对于在对象原型链上某处定义的方法，同样的概念也适用。如果该方法存在于一个对象的原型链上，那么 this 指向的是调用这个方法的对象，就像该方法在对象上一样。

```javascript
let obj6 = {
  f: function () {
    return this.a + this.b;
  },
};
let p = Object.create(obj6);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```

在这个例子中，对象 p 没有属于它自己的 f 属性，它的 f 属性继承自它的原型。虽然在对 f 的查找过程中，最终是在 obj6 中找到 f 属性的，这并没有关系；查找过程首先从 p.f 的引用开始，所以函数中的 this 指向 p。也就是说，因为 f 是作为 p 的方法调用的，所以它的 this 指向了 p。这是 JavaScript 的原型继承中的一个有趣的特性。

> 作为构造函数

当一个函数用作构造函数时（使用 new 关键字），它的 this 被绑定到正在构造的新对象。

虽然构造器返回的默认值是 this 所指的那个对象，但它仍可以手动返回其他的对象（如果返回值不是一个对象，则返回 this 对象）。

```javascript
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
```

在刚刚的例子中（C2），因为在调用构造函数的过程中，手动的设置了返回对象，与 this 绑定的默认对象被丢弃了。（这基本上使得语句 “this.a = 37;”成了“僵尸”代码，实际上并不是真正的“僵尸”，这条语句执行了，但是对于外部没有任何影响，因此完全可以忽略它）。

> 作为一个 DOM 事件处理函数

当函数被用作事件处理函数时，它的 this 指向触发事件的元素（一些浏览器在使用非 addEventListener 的函数动态添加监听函数时不遵守这个约定）。

```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e) {
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
let elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', bluify, false);
}
```

> 作为一个内联事件处理函数

当代码被内联 on-event 处理函数调用时，它的 this 指向监听器所在的 DOM 元素：

```haml
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```

上面的 alert 会显示 button。注意只有外层代码中的 this 是这样设置的：

```haml
<button onclick="alert((function(){return this})());">
  Show inner this
</button>
```

在这种情况下，没有设置内部函数的 this，所以它指向 global/window 对象（即非严格模式下调用的函数未设置 this 时指向的默认对象）。

> 关于 this 的总结：

- 沿着作用域向上找最近的一个 function，看这个 function 最终是怎样执行的；
- this 的指向取决于所属 function 的调用方式，而不是定义；
- function 调用一般分为以下几种情况：
  - 作为函数调用，即：foo()
    - 指向全局对象，注意严格模式问题
  - 作为方法调用，即：foo.bar() / foo.bar.baz()
    - 指向最终调用这个方法的对象
  - 作为构造函数调用，即：new Foo()
    - 指向一个新对象 Foo {}
  - 特殊调用，即：foo.call() / foo.apply()
    - 参数指定成员
