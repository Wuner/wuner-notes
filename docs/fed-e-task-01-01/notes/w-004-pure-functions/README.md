# 纯函数(Pure Functions)

## 纯函数概念

> 纯函数：相同的输入永远会得到相同的输出，而且没有任何可观察的副作用

- 纯函数就类似数学中的函数(用来描述输入和输出之间的关系)，y = f(x)

> [lodash](https://lodash.com/) 是一个一致性、模块化、高性能的 JavaScript 实用工具库(lodash 的 fp 模块提供了对函数式编程友好的方法)，提供了对数组、数字、对象、字符串、函数等操作的一些方法

> 数组的 slice 和 splice 分别是：纯函数和不纯的函数

- slice 返回数组中的指定部分，不会改变原数组
- splice 对数组进行操作返回该数组，会改变原数组

```javascript
// 纯函数
let array = [1, 2, 3, 4, 5];
console.log('slice: ', array.slice(0, 3));
console.log('slice: ', array.slice(0, 3));
console.log('slice: ', array.slice(0, 3));

// 不纯的函数
console.log('splice: ', array.splice(0, 3));
console.log('splice: ', array.splice(0, 3));
console.log('splice: ', array.splice(0, 3));
// slice:  [ 1, 2, 3 ]
// slice:  [ 1, 2, 3 ]
// slice:  [ 1, 2, 3 ]
// splice:  [ 1, 2, 3 ]
// splice:  [ 4, 5 ]
// splice:  []
```

> 函数式编程不会保留计算中间的结果，所以变量是不可变的（无状态的）

> 我们可以把一个函数的执行结果交给另一个函数去处理

## 纯函数的好处

> 可缓存

- 因为纯函数对相同的输入始终有相同的结果，所以可以把纯函数的结果缓存起来

```javascript
const _ = require('lodash');
const add = (a, b) => {
  console.log(a, b);
  return a + b;
};

const result = _.memoize(add);
console.log(result(1, 2));
console.log(result(1, 2));
console.log(result(1, 2));

const memoize = (fn) => {
  let cache = {};
  // 箭头函数没有arguments，因为下面使用了arguments，所以这里不能使用箭头函数
  return function () {
    let key = JSON.stringify(arguments);
    cache[key] = cache[key] || fn.apply(fn, arguments);
    return cache[key];
  };
};

const result1 = memoize(add);
console.log(result1(1, 2));
console.log(result1(1, 2));
console.log(result1(1, 2));
// 输出结果 从结果可以看出来，参数只被打印一次，说明函数缓存成功
// 1 2
// 3
// 3
// 3
// 1 2
// 3
// 3
// 3
```

> 可测试

- 纯函数让测试更方便

> 并行处理

- 在多线程环境下并行操作共享的内存数据很可能会出现意外情况
- 纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数 (Web Worker)

## 副作用

```javascript
// 不纯的
let mini = 18;
function checkAge(age) {
  return age >= mini;
}
// 纯的(有硬编码，后续可以通过柯里化解决)
function checkAge(age) {
  let mini = 18;
  return age >= mini;
}
```

> 副作用让一个函数变的不纯(如上例)，纯函数的根据相同的输入返回相同的输出，如果函数依赖于外部的状态就无法保证输出相同，就会带来副作用。

> 副作用来源：

- 配置文件
- 数据库
- 获取用户的输入
- ……

> 所有的外部交互都有可能带来副作用，副作用也使得方法通用性下降不适合扩展和可重用性，同时副作用会给程序中带来安全隐患给程序带来不确定性，但是副作用不可能完全禁止，尽可能控制它们在可控范围内发生。
