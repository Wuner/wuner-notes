# 函数组合(compose)

> 纯函数和柯里化很容易写出洋葱代码 h(g(f(x)))

> 函数组合可以让我们把细粒度的函数重新组合生成一个新的函数

- 获取数组的最后一个元素再转换成大写字母， _.toUpper(_.first(\_.reverse(array)))

## 函数组合

> 函数组合 (compose)：如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间过程的函数合并成一个函数

- 函数就像是数据的管道，函数组合就是把这些管道连接起来，让数据穿过多个管道形成最终结果

- 函数组合默认是从右到左执行

> lodash 中的组合函数

- lodash 中组合函数 flow() 或者 flowRight()，他们都可以组合多个函数
- flow() 是从左到右运行
- flowRight() 是从右到左运行，使用的更多一些

```javascript
const _ = require('lodash');
// lodash 中组合函数 flowRight()，将数组的最后一个元素转换为大写

/**
 * first 获取字符串第一个字符或数组第一个元素
 * @param str {String || Array} 字符串或数组
 * @returns {*} 返回值
 */
const first = (str) => {
  return _.first(str);
};

/**
 * reverse 颠倒字符串
 * @param str {String} 字符串
 * @param isReverse {Boolean} 是否颠倒
 * @returns {*} 返回值
 */
const reverse = (str, isReverse) => {
  let array = str.split('');
  array = isReverse ? array.reverse() : array;
  return array;
};

/**
 * toUpperCase 将字母转换为大写
 * @param str {String} 字符串
 * @returns {string} 返回值
 */
const toUpperCase = (str) => {
  return str.toUpperCase();
};

const fn = _.flowRight(toUpperCase, first, reverse);

console.log(fn('abc', true));
/**
 * 输出结果
 * C
 */
```

> 模拟实现 lodash 的 flowRight 方法

```javascript
// 模拟 flowRight
/**
 * compose 函数组合
 * @param args 参数
 * @returns {function(...[*]=): *}
 */
const compose = (...args) => {
  let first = false;
  return (...args1) => {
    return args.reverse().reduce((val, fn) => {
      if (!first) {
        first = true;
        return fn(...val);
      }
      return fn(val);
    }, args1);
  };
};

const fn = compose(toUpperCase, first, reverse);

console.log(fn('abc', false));
/**
 * 输出结果
 * A
 */
```

> 函数的组合要满足结合律 (associativity)：

- 我们既可以把 g 和 h 组合，还可以把 f 和 g 组合，结果都是一样的

```javascript
// 满足结合律

const fn1 = compose(toUpperCase, first, reverse);
const fn2 = compose(compose(toUpperCase, first), reverse);
const fn3 = compose(toUpperCase, compose(first, reverse));

console.log(fn1('abc', true));
console.log(fn2('abc', true));
console.log(fn3('abc', true));
/**
 * 输出结果
 * C
 * C
 * C
 */
```

> [lodash/fp](https://github.com/lodash/lodash/tree/4.17.15-npm/fp)

- lodash 的 fp 模块提供了实用的对函数式编程友好的方法

- 提供了不可变 auto-curried iteratee-first data-last 的方法
