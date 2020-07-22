# Set

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

Set 对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set 中的元素只会出现一次，即 Set 中的元素是唯一的。

## demo

```javascript
/**
 * add() 方法用来向一个 Set 对象的末尾添加一个指定的值
 */
const mySet = new Set();

mySet.add(1);
mySet.add(5).add('some text').add(1); // 可以链式调用

console.log(mySet);
// Set {1, 5, "some text"} 重复的值没有被添加进去

/**
 * delete() 方法可以从一个 Set 对象中删除指定的元素。
 */
mySet.delete('bar'); // 返回 false，不包含 "bar" 这个元素
mySet.delete(1); // 返回 true，删除成功
console.log(mySet); // Set {5, "some text"}

/**
 * clear() 方法用来清空一个 Set 对象中的所有元素。
 */
mySet.clear();
console.log(mySet); // Set {}

/**
 * entries() 方法返回一个新的迭代器对象 ，这个对象的元素是类似 [value, value] 形式的数组，value 是集合对象中的每个元素，迭代器对象元素的顺序即集合对象中元素插入的顺序。由于集合对象不像 Map 对象那样拥有 key，然而，为了与 Map 对象的 API 形式保持一致，故使得每一个 entry 的 key 和 value 都拥有相同的值，因而最终返回一个 [value, value] 形式的数组。
 */
mySet.add('foobar');
mySet.add(1);
mySet.add('baz');

const setIter = mySet.entries();

console.log(setIter.next().value); // ["foobar", "foobar"]
console.log(setIter.next().value); // [1, 1]
console.log(setIter.next().value); // ["baz", "baz"]

/**
 * forEach 方法会根据集合中元素的插入顺序，依次执行提供的回调函数。
 */
function logSetElements(value1, value2, set) {
  console.log(`s[ ${value1} ] = ${value2} =>${[...set]}`);
}

new Set(['foo', 'bar', undefined]).forEach(logSetElements);
// s[ foo ] = foo =>foo,bar,
// s[ bar ] = bar =>foo,bar,
// s[ undefined ] = undefined =>foo,bar,

/**
 * has() 方法返回一个布尔值来指示对应的值value是否存在Set对象中。
 */
console.log(mySet.has('foobar')); // 返回 true
console.log(mySet.has('bar')); // 返回 false
const obj1 = { key1: 1 };
mySet.add(obj1);
console.log(mySet.has(obj1)); // 返回 true
console.log(mySet.has({ key1: 1 })); // 会返回 false，因为其是另一个对象的引用
mySet.add({ key1: 1 }); // 现在 mySet 中有2条（不同引用的）对象了
console.log(mySet);
// Set { 'foobar', 1, 'baz', { key1: 1 }, { key1: 1 } }

/**
 *  values() 方法返回一个 Iterator  对象，该对象按照原Set 对象元素的插入顺序返回其所有元素。
 */
const setIter1 = mySet.values();
console.log(setIter1.next().value); // foobar
console.log(setIter1.next().value); // 1
console.log(setIter1.next().value); // baz

/**
 *  keys() 方法是这个方法的别名 (与 Map 对象相似); 它的行为与 value 方法完全一致，返回 Set 对象的元素。
 */
const setIter2 = mySet.keys();
console.log(setIter2.next().value); // foobar
console.log(setIter2.next().value); // 1
console.log(setIter2.next().value); // baz
console.log('---------------------');
/**
 * @@iterator 属性的初始值和 values 属性的初始值是同一个函数。
 */
for (const v of mySet) {
  console.log(v);
}
```
