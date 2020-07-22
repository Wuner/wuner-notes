console.log('string text line 1\n' + 'string text line 2');
// "string text line 1
// string text line 2"

console.log(`string text line 1
string text line 2`);
// "string text line 1
// string text line 2"

const a = 5;
const b = 10;
console.log('Fifteen is ' + (a + b) + ' and\nnot ' + (2 * a + b) + '.');
// "Fifteen is 15 and
// not 20."

console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."

const person = 'Mike';
const age = 28;

function myTag(strings, personExp, ageExp) {
  const str0 = strings[0]; // "that "
  const str1 = strings[1]; // " is a "

  let ageStr;
  if (ageExp > 99) {
    ageStr = 'centenarian';
  } else {
    ageStr = 'youngster';
  }

  return str0 + personExp + str1 + ageStr;
}

const output = myTag`that ${person} is a ${age}`;

console.log(output);
// that Mike is a youngster

function template(strings, ...keys) {
  return function (...values) {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach(function (key, i) {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

const t1Closure = template`${0}${1}${0}!`;
console.log(t1Closure('Y', 'A')); // "YAY!"
const t2Closure = template`${0} ${'foo'}!`;
console.log(t2Closure('Hello', { foo: 'World' })); // "Hello World!"

function tag(strings) {
  return strings.raw[0];
}

console.log(tag`string text line 1 \n string text line 2`);
// logs "string text line 1 \n string text line 2" ,

function latex(str) {
  return { cooked: str[0], raw: str.raw[0] };
}
console.log(latex`\unicode`);
