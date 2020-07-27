// 可将函数赋值给变量，即函数可存储在变量中
const foo = function () {
  console.log('foobar');
};
// 用变量来调用它
foo();

// 函数可作为参数
function sayHello() {
  return 'Hello, ';
}
function greeting(helloMessage, name) {
  console.log(helloMessage() + name);
}
// 传递 `sayHello` 作为 `greeting` 函数的参数
greeting(sayHello, 'JavaScript!'); // Hello, JavaScript!

// 函数可作为返回值
function sayHello1() {
  return function () {
    console.log('Hello!');
  };
}
