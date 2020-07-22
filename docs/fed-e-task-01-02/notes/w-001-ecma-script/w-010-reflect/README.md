# [Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handlers 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。

## 描述

与大多数内置对象不同，Reflect 不是一个构造函数。你不能将其与一个 new 运算符一起使用，或者将 Reflect 对象作为一个函数来调用。Reflect 的所有属性和方法都是静态的（就像 Math 对象）。

## 静态方法

> Reflect.apply(target, thisArgument, argumentsList)

对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。

```javascript
console.log(Reflect.apply(Math.floor, undefined, [1.75]));
// 1;

console.log(
  Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]),
);
// "hello"

console.log(
  Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index,
);
// 4

console.log(Reflect.apply(''.charAt, 'ponies', [3]));
// "i"
```

> Reflect.construct(target, argumentsList[, newTarget])

对构造函数进行 new 操作，相当于执行 new target(...args)。

```javascript
function OneClass() {
  this.name = 'one';
}

function OtherClass() {
  this.name = 'other';
}

// 创建一个对象:
const obj1 = Reflect.construct(OneClass, global, OtherClass);

// 与上述方法等效:
const obj2 = Object.create(OtherClass.prototype);
OneClass.apply(obj2, global);

console.log(obj1.name); // 'one'
console.log(obj2.name); // 'one'

console.log(obj1 instanceof OneClass); // false
console.log(obj2 instanceof OneClass); // false

console.log(obj1 instanceof OtherClass); // true
console.log(obj2 instanceof OtherClass); // true
```

> Reflect.defineProperty(target, propertyKey, attributes)

和 Object.defineProperty() 类似。如果设置成功就会返回 true

```javascript
const student = {};
console.log(Reflect.defineProperty(student, 'name', { value: 'Mike' })); // true
console.log(student.name); // "Mike"
```

> Reflect.deleteProperty(target, propertyKey)

作为函数的 delete 操作符，相当于执行 delete target[name]。

```javascript
const student = {};
console.log(Reflect.defineProperty(student, 'name', { value: 'Mike' })); // true
console.log(student.name); // "Mike"

// Reflect.deleteProperty
const obj = { x: 1, y: 2 };
console.log(Reflect.deleteProperty(obj, 'x')); // true
console.log(obj); // { y: 2 }

const arr = [1, 2, 3, 4, 5];
console.log(Reflect.deleteProperty(arr, '3')); // true
console.log(arr); // [1, 2, 3, , 5]

// 如果属性不存在，返回 true
console.log(Reflect.deleteProperty({}, 'foo')); // true

// 如果属性不可配置，返回 false
console.log(Reflect.deleteProperty(Object.freeze({ foo: 1 }), 'foo')); // false
```

> Reflect.get(target, propertyKey[, receiver])

获取对象身上某个属性的值，类似于 target[name]。

```javascript
let obj3 = { x: 1, y: 2 };
console.log(Reflect.get(obj3, 'x')); // 1

// Array
console.log(Reflect.get(['zero', 'one'], 1)); // "one"

// Proxy with a get handler
const x = { p: 1 };
const objProxy = new Proxy(x, {
  get(t, k, r) {
    return k + 'bar';
  },
});
console.log(Reflect.get(objProxy, 'foo')); // "foobar"
```

> Reflect.getOwnPropertyDescriptor(target, propertyKey)

类似于 Object.getOwnPropertyDescriptor()。如果给定属性存在于对象上，则返回它的属性描述符，否则返回 undefined。

```javascript
console.log(Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'x'));
// {value: "hello", writable: true, enumerable: true, configurable: true}

console.log(Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'y'));
// undefined

console.log(Reflect.getOwnPropertyDescriptor([], 'length'));
// {value: 0, writable: true, enumerable: false, configurable: false}
```

> Reflect.getPrototypeOf(target)

类似于 Object.getPrototypeOf()。返回指定对象的原型

```javascript
// 如果参数为 Object，返回结果相同
console.log(Object.getPrototypeOf({})); // {}
console.log(Reflect.getPrototypeOf({})); // {}

// 在 ES5 规范下，对于非 Object，抛异常
console.log(Object.getPrototypeOf('foo')); // Throws TypeError
console.log(Reflect.getPrototypeOf('foo')); // Throws TypeError

// 在 ES2015 规范下，Reflect 抛异常, Object 强制转换非 Object
console.log(Object.getPrototypeOf('foo')); // [String: '']
console.log(Reflect.getPrototypeOf('foo')); // Throws TypeError

// 如果想要模拟 Object 在 ES2015 规范下的表现，需要强制类型转换
console.log(Reflect.getPrototypeOf(Object('foo'))); // [String: '']
```

> Reflect.has(target, propertyKey)

判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。

```javascript
console.log(Reflect.has({ x: 0 }, 'x')); // true
console.log(Reflect.has({ x: 0 }, 'y')); // false

// 如果该属性存在于原型链中，返回true
console.log(Reflect.has({ x: 0 }, 'toString')); // true

// Proxy 对象的 .has() 句柄方法
const obj4Proxy = new Proxy(
  {},
  {
    has(t, k) {
      return k.startsWith('door');
    },
  },
);
console.log(Reflect.has(obj4Proxy, 'doorbell')); // true
console.log(Reflect.has(obj4Proxy, 'dormitory')); // false
```

> Reflect.isExtensible(target)

类似于 Object.isExtensible().判断一个对象是否可扩展

```javascript
const empty = {};
console.log(Reflect.isExtensible(empty)); // === true

Reflect.preventExtensions(empty);
console.log(Reflect.isExtensible(empty)); // === false
```

> Reflect.ownKeys(target)

返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受 enumerable 影响).

```javascript
console.log(Reflect.ownKeys({ z: 3, y: 2, x: 1 })); // [ "z", "y", "x" ]
console.log(Reflect.ownKeys([1])); // [ "0", "length"]

const sym = Symbol.for('comet');
const sym2 = Symbol.for('meteor');
const obj5 = {
  [sym]: 0,
  str: 0,
  '773': 0,
  '0': 0,
  [sym2]: 0,
  '-1': 0,
  '8': 0,
  'second str': 0,
};
console.log(Reflect.ownKeys(obj5));
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
```

> Reflect.preventExtensions(target)

类似于 Object.preventExtensions()。阻止新属性添加到对象。

```javascript
const empty = {};
console.log(Reflect.isExtensible(empty)); // === true

Reflect.preventExtensions(empty);
console.log(Reflect.isExtensible(empty)); // === false
```

> Reflect.set(target, propertyKey, value[, receiver])

将值分配给属性的函数。返回一个 Boolean，如果更新成功，则返回 true。

```javascript
// Object
const obj6 = {};
Reflect.set(obj6, 'prop', 'value');
console.log(obj6.prop); // "value"

// Array
const arr1 = ['duck', 'duck', 'duck'];
Reflect.set(arr1, 2, 'goose');
console.log(arr1[2]); // "goose"
```

> Reflect.setPrototypeOf(target, prototype)

除了返回类型以外，静态方法 Reflect.setPrototypeOf() 与 Object.setPrototypeOf() 方法是一样的。它可设置对象的原型（即内部的 [[Prototype]] 属性）为另一个对象或 null，如果操作成功返回 true，否则返回 false。

```javascript
console.log(Reflect.setPrototypeOf({}, Object.prototype)); // true

// 可以将对象的[[Prototype]]更改为null。
console.log(Reflect.setPrototypeOf({}, null)); // true

// 如果目标不可扩展，则返回false。
console.log(Reflect.setPrototypeOf(Object.freeze({}), null)); // false

// 如果导致原型链循环，则返回false。
const target = {};
const proto = Object.create(target);
console.log(Reflect.setPrototypeOf(target, proto)); // false
```
