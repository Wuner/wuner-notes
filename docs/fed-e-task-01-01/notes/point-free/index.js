// 非 Point Free 模式
// Hello World => hello_world
function f(word) {
  return word.toLowerCase().replace(/\s+/g, '_');
}
console.log(f('Hello World'));
// Point Free
const fp = require('lodash/fp');
const firstLetterToUpper = fp.flowRight(
  fp.join('. '),
  fp.map(fp.flowRight(fp.first, fp.toUpper)),
  fp.split(' '),
);
console.log(firstLetterToUpper('world wild web'));
// => W. W. W
