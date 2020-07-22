let obj = { a: 0, b: 0, c: { d: 0 } };
let newObj = JSON.parse(JSON.stringify(obj));
console.log(obj); // { a: 0, b: 0, c: { d: 0 } }
console.log(newObj); // { a: 0, b: 0, c: { d: 0 } }
obj.a = 1;
obj.c.d = 1;
console.log(obj); // { a: 1, b: 0, c: { d: 1 } }

console.log(newObj); // { a: 0, b: 0, c: { d: 0 } }
