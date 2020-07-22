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
