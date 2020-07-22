# Functions Default(函数默认参数)

函数默认参数允许在没有值或 undefined 被传入时使用默认形参。

> 传入 undefined vs 其他假值

```javascript
function test(num = 1) {
  console.log(typeof num);
  console.log(num);
}

test();
/**
 * number
 * 1
 */
test(undefined);
/**
 * number
 * 1
 */

test('');
/**
 * string
 * ''
 */
test(null);
/**
 * object
 * null
 */
```

> 调用时解析

在函数被调用时，参数默认值会被解析，所以不像 Python 中的例子，每次函数调用时都会创建一个新的参数对象。

```javascript
function append(value, array = []) {
  array.push(value);
  return array;
}

console.log(append(1)); //[1]
console.log(append(2)); //[2], 不是 [1, 2]
```

> 默认参数可用于后面的默认参数

已经遇到的参数可用于以后的默认参数：

```javascript
function greet(name, greeting, message = greeting + ' ' + name) {
  return [name, greeting, message];
}

console.log(greet('David', 'Hi')); // ["David", "Hi", "Hi David"]
console.log(greet('David', 'Hi', 'Happy Birthday!')); // ["David", "Hi", "Happy Birthday!"]
```

> 位于默认参数之后非默认参数

在 Gecko 26 (Firefox 26 / Thunderbird 26 / SeaMonkey 2.23 / Firefox OS 1.2)之前，以下代码会造成 SyntaxError 错误。这已经在 bug 1022967 中修复，并在以后的版本中按预期方式工作。参数仍然设置为从左到右，覆盖默认参数，即使后面的参数没有默认值。

```javascript
function f(x = 1, y) {
  console.log([x, y]);
}

f(); // [1, undefined]
f(2); // [2, undefined]
```

> 有默认值的解构参数

你可以通过[解构赋值](../destructuring)为参数赋值：

```javascript
function fn([x, y] = [1, 2], { z: z } = { z: 3 }) {
  console.log(x + y + z);
}

fn(); // 6
```
