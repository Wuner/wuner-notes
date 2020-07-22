/**
 * Type Annotations(类型注解)
 * @flow
 */
// 参数添加类型注解
function add(x: number, y: number) {
  return x + y;
}

// 正确
add(100, 100);
// 报错
// add('100', 100);

// 声明基本类型数据时添加类型注解
let num: number = 100; // 正确
// num = '100'; // 报错

// 声明函数时添加类型注解
function sum(): number {
  return 100; // 只能返回number类型数据
  // return '100'; // 报错
}

/**
 * Primitive Types(原始类型)
 * @flow
 */
const bol: boolean = true; // false Boolean(0) Boolean(1)

const str: string = 'abs';

const nums: number = 1; // 3.14 NaN Infinity

const emt: null = null;

const un: void = undefined;

const syb: symbol = Symbol(); // Symbol.isConcatSpreadable

/**
 * Literal Types(文字类型)
 * @flow
 */
function acceptsTwo(value: 2) {
  // ...
}

acceptsTwo(2); // Works!
// $ExpectError
// acceptsTwo(3); // Error!
// $ExpectError
// acceptsTwo('2'); // Error!

function getColor(name: 'success' | 'warning' | 'danger') {
  switch (name) {
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'danger':
      return 'red';
  }
}

getColor('success'); // Works!
getColor('danger'); // Works!
// $ExpectError
// getColor('error'); // Error!

/**
 * Mixed Types(混合类型)
 * @flow
 */
function stringify(value: mixed) {
  if (typeof value === 'string') {
    return '' + value; // Works!
  } else {
    return '';
  }
}

stringify('foo');
stringify(3.14);
stringify(null);
stringify({});

/**
 * Any Types(任何类型)
 * @flow
 */
function division(one: any, two: any): number {
  return one / two;
}

division(1, 2); // Works.
division('1', '2'); // Works.
division({}, []); // Works.

/**
 * Maybe Types(可能类型)
 * @flow
 */
function acceptsMaybeNumber(value: ?number) {
  // ...
}

acceptsMaybeNumber(42); // Works!
acceptsMaybeNumber(); // Works!
acceptsMaybeNumber(undefined); // Works!
acceptsMaybeNumber(null); // Works!
// acceptsMaybeNumber('42'); // Error!

/**
 * Function Types(函数类型)
 * @flow
 */
function concat(a: string, b: string): string {
  return a + b;
}

concat('foo', 'bar'); // Works!
// $ExpectError
// concat(true, false); // Error!

function method(func: (...args: Array<any>) => any) {
  func(1, 2); // Works.
  func('1', '2'); // Works.
  func({}, []); // Works.
}

method(function (a: number, b: number) {
  // ...
});

/**
 * Object Types(对象类型)
 * @flow
 */
let obj1: { foo: boolean } = { foo: true }; // Works.
// obj1.bar = true; // Error!
// obj1.foo = 'hello'; // Error!

let obj2: {
  foo: number,
  bar: boolean,
  baz: string,
} = {
  foo: 1,
  bar: true,
  baz: 'three',
}; // Works.

let obj3: { foo: string, bar: boolean };
obj3 = { foo: 'foo', bar: true };
// obj3 = { foo: 'foo' };
