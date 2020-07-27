/* eslint no-redeclare: 0 */
function varTest() {
  var x = 1;
  {
    var x = 2; // 同样的变量!
    console.log(x); // 2
  }
  console.log(x); // 2
}

function letTest() {
  let x = 1;
  {
    let x = 2; // 不同的变量
    console.log(x); // 2
  }
  console.log(x); // 1
}
// varTest();
// letTest();
// if (x) {
//   let foo;
//   let foo; // SyntaxError thrown.
// }
// let x = 1;
// switch (x) {
//   case 0:
//     let foo;
//     break;
//
//   case 1:
//     let foo; // SyntaxError for redeclaration.
//     break;
// }
let x = 1;
switch (x) {
  case 0: {
    let foo;
    break;
  }

  case 1: {
    let foo; // SyntaxError for redeclaration.
    break;
  }
}
function do_something() {
  console.log(bar); // undefined
  console.log(foo); // ReferenceError
  var bar = 1;
  let foo = 2;
}
// do_something();
// prints out 'undefined'
// console.log(typeof undeclaredVariable);

// results in a 'ReferenceError'
// console.log(typeof i);
// let i = 10;
function test() {
  var foo = 33;
  {
    let foo = foo + 55; // ReferenceError
  }
}
// test();
function go(n) {
  // n here is defined!
  console.log(n); // Object {a: [1,2,3]}

  for (let n of n.a) {
    // ReferenceError
    console.log(n);
  }
}

// go({ a: [1, 2, 3] });
var a = 1;
var b = 2;

if (a === 1) {
  var a = 11; // the scope is global
  let b = 22; // the scope is inside the if-block

  console.log(a); // 11
  console.log(b); // 22
}

console.log(a); // 11
console.log(b); // 2
// let x = 1;
//
// {
//   var x = 2; // SyntaxError for re-declaration
// }
