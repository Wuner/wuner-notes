const _ = require('lodash');
// lodash 中组合函数 flowRight()，将字符串的最后一个字母转换为大写

/**
 * first 获取字符串第一个字符或数组第一个元素
 * @param str {String || Array} 入参
 * @returns {*} 返回值
 */
const first = (str) => {
  return _.first(str);
};

/**
 * reverse 颠倒字符串
 * @param str {String} 入参
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
 * @param str {String} 入参
 * @returns {string} 返回值
 */
const toUpperCase = (str) => {
  return str.toUpperCase();
};

const fn = _.flowRight(toUpperCase, first, reverse);

console.log(fn('abc', false));
/**
 * 输出结果
 * C
 */

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
