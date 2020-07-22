# [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

symbol 是一种基本数据类型 （primitive data type）。Symbol()函数会返回 symbol 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 symbol 注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："new Symbol()"。

每个从 Symbol()返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符；这是该数据类型仅有的目的。

## 描述

直接使用 Symbol()创建新的 symbol 类型，并用一个可选的字符串作为其描述。

```javascript
const sym1 = Symbol();
const sym2 = Symbol('foo');
const sym3 = Symbol('foo');
```

上面的代码创建了三个新的 symbol 类型。 注意，Symbol("foo") 不会强制将字符串 “foo” 转换成 symbol 类型。它每次都会创建一个新的 symbol 类型：

```javascript
console.log(Symbol('foo') === Symbol('foo')); // false
```

下面带有 new 运算符的语法将抛出 TypeError 错误：

```javascript
const sym = new Symbol(); // TypeError
```

这会阻止创建一个显式的 Symbol 包装器对象而不是一个 Symbol 值。围绕原始数据类型创建一个显式包装器对象从 ECMAScript 6 开始不再被支持。 然而，现有的原始包装器对象，如 new Boolean、new String 以及 new Number，因为遗留原因仍可被创建。

如果你真的想创建一个 Symbol 包装器对象 (Symbol wrapper object)，你可以使用 Object() 函数：

```javascript
const sym = Symbol('foo');
console.log(typeof sym); // "symbol"
const symObj = Object(sym);
console.log(typeof symObj); // "object"
```

> 全局共享的 Symbol

上面使用 Symbol() 函数的语法，不会在你的整个代码库中创建一个可用的全局 symbol 类型。 要创建跨文件可用的 symbol，甚至跨域（每个都有它自己的全局作用域） , 使用 Symbol.for() 方法和 Symbol.keyFor() 方法从全局的 symbol 注册表设置和取得 symbol。

> 在对象中查找 Symbol 属性

Object.getOwnPropertySymbols() 方法让你在查找一个给定对象的符号属性时返回一个 symbol 类型的数组。注意，每个初始化的对象都是没有自己的 symbol 属性的，因此这个数组可能为空，除非你已经在对象上设置了 symbol 属性。

## 方法

```javascript
/**
 * Symbol.for(key) 方法会根据给定的键 key，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。
 */
Symbol('foo'); // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
console.log(Symbol.for('foo')); // 从 symbol 注册表中读取键为"foo"的 symbol

console.log(Symbol.for('bar') === Symbol.for('bar')); // true，证明了上面说的
console.log(Symbol('bar') === Symbol('bar')); // false，Symbol() 函数每次都会返回新的一个 symbol

const sym = Symbol.for('mario');
console.log(sym.toString());
// "Symbol(mario)"，mario 既是该 symbol 在 symbol 注册表中的键名，又是该 symbol 自身的描述字符串

/**
 * Symbol.keyFor(sym) 方法用来获取 symbol 注册表中与某个 symbol 关联的键。
 */
// 创建一个 symbol 并放入 Symbol 注册表，key 为 "foo"
const globalSym = Symbol.for('foo');
console.log(Symbol.keyFor(globalSym)); // foo

// 创建一个 symbol，但不放入 symbol 注册表中
const localSym = Symbol();
console.log(Symbol.keyFor(localSym)); // undefined，所以是找不到 key 的

// well-known symbol 们并不在 symbol 注册表中
console.log(Symbol.keyFor(Symbol.iterator)); // undefined
```

## demo

> 对 symbol 使用 typeof 运算符

```javascript
console.log(typeof Symbol() === 'symbol'); // true
console.log(typeof Symbol('foo') === 'symbol'); // true
console.log(typeof Symbol.iterator === 'symbol'); // true
```

> Symbol 类型转换

当使用 symbol 值进行类型转换时需要注意一些事情：

- 尝试将一个 symbol 值转换为一个 number 值时，会抛出一个 TypeError 错误 (e.g. +sym or sym | 0).
- 使用宽松相等时， Object(sym) == sym returns true.
- 这会阻止你从一个 symbol 值隐式地创建一个新的 string 类型的属性名。例如，Symbol("foo") + "bar" 将抛出一个 TypeError (can't convert symbol to string).
- "safer" String(sym) conversion 的作用会像 symbol 类型调用 Symbol.prototype.toString() 一样，但是注意 new String(sym) 将抛出异常。

> Symbols 与 for...in 迭代

Symbols 在 for...in 迭代中不可枚举。另外，Object.getOwnPropertyNames() 不会返回 symbol 对象的属性，但是你能使用 Object.getOwnPropertySymbols() 得到它们。

```javascript
const obj = {};

obj[Symbol('a')] = 'a';
obj[Symbol.for('b')] = 'b';
obj['c'] = 'c';
obj.d = 'd';

for (const i in obj) {
  console.log(i);
}
// c
// d
```

> Symbols 与 JSON.stringify()

当使用 JSON.stringify() 时，以 symbol 值作为键的属性会被完全忽略：

```javascript
console.log(JSON.stringify({ [Symbol('foo')]: 'foo' }));
// '{}'
```

> Symbol 包装器对象作为属性的键

当一个 Symbol 包装器对象作为一个属性的键时，这个对象将被强制转换为它包装过的 symbol 值：

```javascript
const sym1 = Symbol('foo');
const obj1 = { [sym1]: 1 };
console.log(obj1[sym1]); // 1
console.log(obj1[Object(sym1)]); // 1
```
