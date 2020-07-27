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
 * 结果
 * 6
 * 6
 * 6
 */

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

// 模拟 curry
const curry = (func) => {
  /*eslint no-undef: 0 */
  return (curryFn = (...args) => {
    if (args.length < func.length) {
      return function () {
        return curryFn(...args.concat(Array.from(arguments)));
      };
    }
    return func(...args);
  });
};

const curried1 = curry(getSum);
console.log(curried1(1, 2, 3));
console.log(curried1(1)(2, 3));
console.log(curried1(1, 2)(3));
