# 柯里化 (Haskell Brooks Curry)

> 柯里化 (Currying)：

- 当一个函数有多个参数的时候先传递一部分的参数调用它（这部分参数以后永远不变）
- 然后返回一个新的函数来接收剩余的参数，返回结果

## lodash 中的柯里化函数

> \_.curry(func)

- 功能：创建一个函数，该函数接收一个或多个 func 的参数，如果 func 所需要的参数都被提供则执行 func 并返回执行的结果。否则继续返回该函数并等待接收剩余的参数。
- 参数：需要柯里化的函数
- 返回值：柯里化后的函数

```javascript
// lodash 中的柯里化函数
const _ = require('lodash');
const getSum = (a, b, c) => {
  return a + b + c;
};
const curried = _.curry(getSum);
console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));
console.log(curried(1, 2)(3));
/**
 * 输出结果
 * 6
 * 6
 * 6
 */
```

```javascript
// 案例
const match = _.curry((res, str) => {
  return str.match(res);
});

const haveSpace = match(/\s+/g);
const haveNumber = match(/\d+/g);

const filter = _.curry((fun, array) => {
  return array.filter(fun);
});

const findSpace = filter(haveSpace);
const findNumber = filter(haveNumber);

console.log(haveSpace('ss ss'));
console.log(haveNumber('ss 12'));
console.log(findSpace(['ss12', 's ss']));
console.log(findNumber(['ss12', 'sss']));
/**
 * 输出结果
 * [ ' ' ]
 * [ '12' ]
 * [ 's ss' ]
 * [ 'ss12' ]
 */
```

> 模拟 \_.curry() 的实现

```javascript
// 模拟 curry
const getSum = (a, b, c) => {
  return a + b + c;
};

const curry = (func) => {
  return (curryFn = (...args) => {
    if (args.length < func.length) {
      return function () {
        return curryFn(...args.concat(Array.from(arguments)));
      };
    }
    return func(...args);
  });
};

const curried = curry(getSum);
console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));
console.log(curried(1, 2)(3));

/**
 * 输出结果
 * 6
 * 6
 * 6
 */
```

## 总结

> 柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数

> 这是一种对函数参数的'缓存'

> 让函数变的更灵活，让函数的粒度更小

> 可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能
