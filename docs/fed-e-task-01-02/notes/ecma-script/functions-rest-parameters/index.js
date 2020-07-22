function f(...[a, b, c]) {
  console.log(a + b + c);
}

f(1); // NaN (b 和 c 是 undefined)
f(1, 2, 3); // 6
f(1, 2, 3, 4); // 6

function multiply(multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element;
  });
}

console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]

function sortRestArgs(...theArgs) {
  return theArgs.sort();
}

console.log(sortRestArgs(5, 3, 7, 1)); // 弹出 1,3,5,7

function sortArguments() {
  return arguments.sort(); // 不会执行到这里
}
// console.log(sortArguments(5, 3, 7, 1)); // 抛出TypeError异常:arguments.sort is not a function

function sortArguments1() {
  const args = Array.prototype.slice.call(arguments);
  return args.sort();
}
console.log(sortArguments1(5, 3, 7, 1)); // shows 1, 3, 5, 7
