# Functions Rest Parameters(剩余参数)

剩余参数语法允许我们将一个不定数量的参数表示为一个数组。

> 剩余参数和 arguments 对象的区别

剩余参数和 arguments 对象之间的区别主要有三个：

- 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
- arguments 对象不是一个真正的数组，而剩余参数是真正的 Array 实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach 或 pop。
- arguments 对象还有一些附加的属性 （如 callee 属性）。

> 解构剩余参数

剩余参数可以被解构，这意味着他们的数据可以被解包到不同的变量中。请参阅[解构赋值](../destructuring)。

```javascript
function f(...[a, b, c]) {
  console.log(a + b + c);
}

f(1); // NaN (b 和 c 是 undefined)
f(1, 2, 3); // 6
f(1, 2, 3, 4); // 6
```

## demo

下例中，剩余参数包含了从第二个到最后的所有实参，然后用第一个实参依次乘以它们：

```javascript
function multiply(multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element;
  });
}

console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]
```

下例演示了你可以在剩余参数上使用任意的数组方法，而 arguments 对象不可以：

```javascript
function sortRestArgs(...theArgs) {
  return theArgs.sort();
}

console.log(sortRestArgs(5, 3, 7, 1)); // 弹出 1,3,5,7

function sortArguments() {
  return arguments.sort(); // 不会执行到这里
}

console.log(sortArguments(5, 3, 7, 1)); // 抛出TypeError异常:arguments.sort is not a function
```

为了在 arguments 对象上使用 Array 方法，它必须首先被转换为一个真正的数组。

```javascript
function sortArguments1() {
  const args = Array.prototype.slice.call(arguments);
  return args.sort();
}
console.log(sortArguments1(5, 3, 7, 1)); // shows 1, 3, 5, 7
```
