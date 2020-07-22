const foo = ['one', 'two', 'three'];

const [one, two, three] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"

let a, b;

[a, b] = [1, 2];
console.log(a); // 1
console.log(b); // 2

const [c = 5, d = 7] = [1];
console.log(c); // 1
console.log(d); // 7

let e = 1;
let f = 3;

[e, f] = [f, e];
console.log(e); // 3
console.log(f); // 1

function fn() {
  return [1, 2];
}

const [g, h] = fn();
console.log(g); // 1
console.log(h); // 2

function fn1() {
  return [1, 2, 3];
}

const [i, , j] = fn1();
console.log(i); // 1
console.log(j); // 3

const [k, ...l] = [1, 2, 3];
console.log(k); // 1
console.log(l); // [2, 3]

function parseProtocol(url) {
  const parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
  if (!parsedURL) {
    return false;
  }
  console.log(parsedURL); // ["https://developer.mozilla.org/en-US/Web/JavaScript", "https", "developer.mozilla.org", "en-US/Web/JavaScript"]

  const [, protocol] = parsedURL;
  return protocol;
}

console.log(
  parseProtocol('https://developer.mozilla.org/en-US/Web/JavaScript'),
); // "https"

const { m, n } = { m: 42, n: true };

console.log(m); // 42
console.log(n); // true

let o, p;

({ o, p } = { o: 1, p: 2 });
console.log(o); // 1
console.log(p); // 2

const { p: age, q: bar } = { p: 42, q: true };

console.log(age); // 42
console.log(bar); // true

const { q = 10, r = 5 } = { q: 3 };

console.log(q); // 3
console.log(r); // 5

const { a: aa = 10, b: bb = 5 } = { a: 3 };

console.log(aa); // 3
console.log(bb); // 5

function drawES2015Chart({
  size = 'big',
  cords = { x: 0, y: 0 },
  radius = 25,
} = {}) {
  console.log(size, cords, radius);
  // do some chart drawing
}

drawES2015Chart({
  cords: { x: 18, y: 30 },
  radius: 30,
});

const metadata = {
  title: 'Scratchpad',
  translations: [
    {
      locale: 'de',
      localization_tags: [],
      last_edit: '2014-04-14T08:43:37',
      url: '/de/docs/Tools/Scratchpad',
      title: 'JavaScript-Umgebung',
    },
  ],
  url: '/en-US/docs/Tools/Scratchpad',
};

let {
  title: englishTitle, // rename
  translations: [
    {
      title: localeTitle, // rename
    },
  ],
} = metadata;

console.log(englishTitle); // "Scratchpad"
console.log(localeTitle); // "JavaScript-Umgebung"

const people = [
  {
    name: 'Mike Smith',
    family: {
      mother: 'Jane Smith',
      father: 'Harry Smith',
      sister: 'Samantha Smith',
    },
    age: 35,
  },
  {
    name: 'Tom Jones',
    family: {
      mother: 'Norah Jones',
      father: 'Richard Jones',
      brother: 'Howard Jones',
    },
    age: 25,
  },
];

for (const {
  name: n,
  family: { father: f },
} of people) {
  console.log('Name: ' + n + ', Father: ' + f);
}

// "Name: Mike Smith, Father: Harry Smith"
// "Name: Tom Jones, Father: Richard Jones"

function userId({ id }) {
  return id;
}

function whoIs({ displayName, fullName: { firstName: name } }) {
  console.log(displayName + ' is ' + name);
}

const user = {
  id: 42,
  displayName: 'jdoe',
  fullName: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

console.log('userId: ' + userId(user)); // "userId: 42"
whoIs(user); // "jdoe is John"

let key = 'z';
let { [key]: s } = { z: 'bar' };

console.log(s); // "bar"

let { t, u, ...rest } = { t: 10, u: 20, w: 30, x: 40 };
console.log(t); // 10
console.log(u); // 20
console.log(rest); // { c: 30, d: 40 }

// 声明对象 和 自身 self 属性
let obj = { self: '123' };
// 在原型链中定义一个属性 prot
obj.__proto__.prot = '456';
// test
const { self, prot } = obj;
console.log(self); // "123"
console.log(prot); // "456"（访问到了原型链）
