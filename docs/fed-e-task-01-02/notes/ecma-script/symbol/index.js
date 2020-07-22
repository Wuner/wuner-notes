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

/**
 * 测试
 */
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

console.log(JSON.stringify({ [Symbol('foo')]: 'foo' }));
// '{}'

const sym1 = Symbol('foo');
const obj1 = { [sym1]: 1 };
console.log(obj1[sym1]); // 1
console.log(obj1[Object(sym1)]); // 1
