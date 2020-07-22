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
