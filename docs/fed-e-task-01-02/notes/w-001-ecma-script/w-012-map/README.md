# Map

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。

## 描述

一个 Map 对象在迭代时会根据对象中元素的插入顺序来进行 — 一个 for...of 循环在每次迭代后会返回一个形式为[key，value]的数组。

## Objects 和 maps 的比较

Objects 和 Maps 类似，它们都允许你按键存取一个值、删除键、检测一个键是否绑定了值。因此（并且也没有其他内建的替代方式了）过去我们一直都把对象当成 Maps 使用。不过 Maps 和 Objects 有一些重要的区别，在下列情况里使用 Map 会是更好的选择：

|          | Map                                                                            | Object                                                                             |
| :------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 意外的键 | Map 默认情况不包含任何键。只包含显式插入的键。                                 | 一个 Object 有一个原型, 原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。 |
| 键的类型 | 一个 Map 的键可以是任意值，包括函数、对象或任意基本类型。                      | 一个 Object 的键必须是一个 String 或是 Symbol。                                    |
| 键的顺序 | Map 中的 key 是有序的。因此，当迭代的时候，一个 Map 对象以插入的顺序返回键值。 | 一个 Object 的键是无序的                                                           |
| Size     | Map 的键值对个数可以轻易地通过 size 属性获取                                   | Object 的键值对个数只能手动计算                                                    |
| 迭代     | Map 是 iterable 的，所以可以直接被迭代。                                       | 迭代一个 Object 需要以某种方式获取它的键然后才能迭代。                             |
| 性能     | 在频繁增删键值对的场景下表现更好。                                             | 在频繁添加和删除键值对的场景下未作出优化。                                         |

## demo

```javascript
/**
 * set() 方法为 Map 对象添加或更新一个指定了键（key）和值（value）的（新）键值对。
 */
const myMap = new Map();
myMap.set('bar', 'baz');
myMap.set(1, 'foo');

console.log(myMap); // Map { 'bar' => 'baz', 1 => 'foo' }

/**
 * get() 方法返回某个 Map 对象中的一个指定元素。
 */
console.log(myMap.get('bar')); // foo
console.log(myMap.get('baz')); // undefined

/**
 * forEach() 方法将会以插入顺序对 Map 对象中的每一个键值对执行一次参数中提供的回调函数。
 */
function logMapElements(value, key, map) {
  console.log(`'m[ ${key} ] = ${value} => ${map}`);
}
new Map([
  ['foo', 3],
  ['bar', {}],
  ['baz', undefined],
]).forEach(logMapElements);
// m[foo] = 3 => [object Map]
// m[bar] = [object Object] => [object Map]
// m[baz] = undefined => [object Map]

/**
 * entries() 方法返回一个新的包含 [key, value] 对的 Iterator 对象，返回的迭代器的迭代顺序与 Map 对象的插入顺序相同。
 */
const mapIter = myMap.entries();

console.log(mapIter.next().value); // [ 'bar', 'baz' ]
console.log(mapIter.next().value); // [ 1, 'foo' ]

/**
 * 方法has() 返回一个bool值，用来表明map 中是否存在指定元素.
 */
console.log(myMap.has('bar')); // returns true
console.log(myMap.has('baz')); // returns false

/**
 * keys() 返回一个引用的 Iterator 对象。它包含按照顺序插入 Map 对象中每个元素的key值。
 */
const mapIter1 = myMap.keys();

console.log(mapIter1.next().value); // bar
console.log(mapIter1.next().value); // 1

/**
 * values() 方法返回一个新的Iterator对象。它包含按顺序插入Map对象中每个元素的value值。
 */
const mapIter2 = myMap.values();

console.log(mapIter2.next().value); // baz
console.log(mapIter2.next().value); // foo

/**
 * @@iterator 属性的初始值与 entries 属性的初始值是同一个函数对象。
 */
for (const entry of myMap) {
  console.log(entry);
}
// [ 'bar', 'baz' ]
// [ 1, 'foo' ]

/**
 * delete() 方法用于移除 Map 对象中指定的元素。
 */
myMap.delete('bar');
console.log(myMap); // Map { 1 => 'foo' }

/**
 * clear()方法会移除Map对象中的所有元素。
 */
myMap.clear();

console.log(myMap); // Map { }
```
