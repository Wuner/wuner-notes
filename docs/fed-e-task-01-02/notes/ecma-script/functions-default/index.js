function test(num = 1) {
  console.log(typeof num);
  console.log(num);
}

test();
/**
 * number
 * 1
 */
test(undefined);
/**
 * number
 * 1
 */

test('');
/**
 * string
 * ''
 */
test(null);
/**
 * object
 * null
 */

function append(value, array = []) {
  array.push(value);
  return array;
}

console.log(append(1)); //[1]
console.log(append(2)); //[2], 不是 [1, 2]

function greet(name, greeting, message = greeting + ' ' + name) {
  return [name, greeting, message];
}

console.log(greet('David', 'Hi')); // ["David", "Hi", "Hi David"]
console.log(greet('David', 'Hi', 'Happy Birthday!')); // ["David", "Hi", "Happy Birthday!"]

function f(x = 1, y) {
  console.log([x, y]);
}

f(); // [1, undefined]
f(2); // [2, undefined]

function fn([x, y] = [1, 2], { z: z } = { z: 3 }) {
  console.log(x + y + z);
}

fn(); // 6
