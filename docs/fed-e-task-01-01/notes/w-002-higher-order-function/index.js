// 可以把函数作为参数传递给另一个函数
// forEach 遍历数组
/**
 * forEach 遍历数组
 * @param array {Array} 所需遍历的数组
 * @param fn {Function} 返回值
 */
const forEach = (array, fn) => {
  for (let val of array) {
    fn(val);
  }
};

// 测试
let array = [1, 343, 5, 7, 8345, 8];
forEach(array, (val) => console.log(val));

/**
 * filter 数组过滤，并返回新的数组
 * @param array {Array} 所需过滤的数组
 * @param fn {Function} 过滤处理函数
 * @returns {Array} 返回值
 */
const filter = (array, fn) => {
  let result = [];
  for (let val of array) {
    if (fn(val)) {
      result.push(val);
    }
  }
  return result;
};
// 测试
let result = filter(array, (val) => val > 100);
console.log('filter：', result);

// 可以把函数作为参数传递给另一个函数
/**
 * makeFn 函数生成
 * @returns {function(): void}
 */
const makeFn = () => {
  const msg = 'Hello World';
  return () => console.log(msg);
};

// 测试
// const fn = makeFn();
// fn();
makeFn()();

/**
 * once 只执行一次
 * @param fn {Function} 执行函数
 * @returns {Function} 返回值
 */
const once = (fn) => {
  let done = false;
  // 因为下面使用this，这里切不可使用箭头函数，箭头函数里this的指向是上下文里对象this指向，如果没有上下文对象，this则指向window
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
};
//测试
const pay = once((money) => {
  console.log(`支付：￥${money}`);
});
pay(100);
pay(100);
pay(100);

// 模拟常用高阶函数map、every、some

/**
 * map 遍历数组，对其进行处理并返回新的数组
 * @param array {Array} 所需遍历数组
 * @param fn {Function} 处理函数
 * @returns {Array} 返回值
 */
const map = (array, fn) => {
  let result = [];
  for (let val of array) {
    result.push(fn(val));
  }
  return result;
};

// 测试
let newArr = map(array, (val) => val * val);
console.log(newArr);

/**
 * every 遍历数组，判断数组所有元素是否全部满足指定条件，并返回结果
 * @param array {Array} 所需遍历的数组
 * @param fn {Function} 指定条件函数
 * @returns {boolean} 返回值
 */
const every = (array, fn) => {
  let result = true;
  for (let val of array) {
    result = fn(val);
    if (!result) {
      break;
    }
  }
  return result;
};

// 测试
let result1 = every(array, (val) => val > 0);
let result2 = every(array, (val) => val > 1);
console.log(result1);
console.log(result2);

/**
 * some 遍历数组，判断数组所有元素是否有满足指定条件的元素，并返回结果
 * @param array {Array} 所需遍历的数组
 * @param fn {Function} 指定条件函数
 * @returns {boolean} 返回值
 */
const some = (array, fn) => {
  let result = false;
  for (let val of array) {
    result = fn(val);
    if (result) {
      break;
    }
  }
  return result;
};
// 测试
let result3 = some(array, (val) => val > 0);
let result4 = some(array, (val) => val > 10000);
console.log(result3);
console.log(result4);
