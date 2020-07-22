# 解构赋值

解构赋值语法是一种 Javascript 表达式。通过解构赋值, 可以将属性/值从对象/数组中取出,赋值给其他变量。

## 解构数组

> 变量声明并赋值时的解构

```javascript
const foo = ['one', 'two', 'three'];

const [one, two, three] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"
```

> 变量先声明后赋值时的解构

通过解构分离变量的声明，可以为一个变量赋值。

```javascript
let a, b;

[a, b] = [1, 2];
console.log(a); // 1
console.log(b); // 2
```

> 默认值

为了防止从数组中取出一个值为 undefined 的对象，可以在表达式左边的数组中为任意对象预设默认值。

```javascript
const [c = 5, d = 7] = [1];
console.log(c); // 1
console.log(d); // 7
```

> 交换变量

在一个解构表达式中可以交换两个变量的值。

没有解构赋值的情况下，交换两个变量需要一个临时变量（或者用低级语言中的 XOR-swap 技巧）。

```javascript
let e = 1;
let f = 3;

[e, f] = [f, e];
console.log(e); // 3
console.log(f); // 1
```

> 解析一个从函数返回的数组

从一个函数返回一个数组是十分常见的情况。解构使得处理返回值为数组时更加方便。

在下面例子中，要让 [1, 2] 成为函数的 f() 的输出值，可以使用解构在一行内完成解析。

```javascript
function fn() {
  return [1, 2];
}

const [g, h] = fn();
console.log(g); // 1
console.log(h); // 2
```

> 忽略某些返回值

你也可以忽略你不感兴趣的返回值：

```javascript
function fn1() {
  return [1, 2, 3];
}

const [i, , j] = fn1();
console.log(i); // 1
console.log(j); // 3
```

> 将剩余数组赋值给一个变量

当解构一个数组时，可以使用剩余模式，将数组剩余部分赋值给一个变量。

```javascript
const [k, ...l] = [1, 2, 3];
console.log(k); // 1
console.log(l); // [2, 3]
```

> 用正则表达式匹配提取值

用正则表达式的 exec() 方法匹配字符串会返回一个数组，该数组第一个值是完全匹配正则表达式的字符串，然后的值是匹配正则表达式括号内内容部分。解构赋值允许你轻易地提取出需要的部分，忽略完全匹配的字符串——如果不需要的话。

```javascript
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
```

## 解构对象

> 基本赋值

```javascript
const o = { p: 42, q: true };
const { p, q } = o;

console.log(p); // 42
console.log(q); // true
```

> 无声明赋值

一个变量可以独立于其声明进行解构赋值。

```javascript
let o, p;

({ o, p } = { o: 1, p: 2 });
console.log(o); // 1
console.log(p); // 2
```

> 给新的变量名赋值

可以从一个对象中提取变量并赋值给和对象属性名不同的新的变量名。

```javascript
const { p: age, q: bar } = { p: 42, q: true };

console.log(age); // 42
console.log(bar); // true
```

> 默认值

变量可以先赋予默认值。当要提取的对象没有对应的属性，变量就被赋予默认值。

```javascript
const { q = 10, r = 5 } = { q: 3 };

console.log(q); // 3
console.log(r); // 5
```

> 给新的变量命名并提供默认值

一个属性可以同时 1）从一个对象解构，并分配给一个不同名称的变量 2）分配一个默认值，以防未解构的值是 undefined。

```javascript
const { a: aa = 10, b: bb = 5 } = { a: 3 };

console.log(aa); // 3
console.log(bb); // 5
```

> 函数参数默认值

```javascript
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
```

> 解构嵌套对象和数组

```javascript
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
```

> For of 迭代和解构

```javascript
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
```

> 从作为函数实参的对象中提取数据

```javascript
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
```

> 对象属性计算名和解构

```javascript
let key = 'z';
let { [key]: s } = { z: 'bar' };

console.log(s); // "bar"
```

> 对象解构中的 Rest

Rest 属性收集那些尚未被解构模式拾取的剩余可枚举属性键。

```javascript
let { t, u, ...rest } = { t: 10, u: 20, w: 30, x: 40 };
console.log(t); // 10
console.log(u); // 20
console.log(rest); // { c: 30, d: 40 }
```

> 解构对象时会查找原型链（如果属性不在对象自身，将从原型链中查找）

```javascript
// 声明对象 和 自身 self 属性
let obj = { self: '123' };
// 在原型链中定义一个属性 prot
obj.__proto__.prot = '456';
// test
const { self, prot } = obj;
console.log(self); // "123"
console.log(prot); // "456"（访问到了原型链）
```
