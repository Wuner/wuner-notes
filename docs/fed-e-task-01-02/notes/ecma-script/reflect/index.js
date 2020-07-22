/**
 * Reflect.apply
 */
console.log(Reflect.apply(Math.floor, undefined, [1.75]));
// 1;

console.log(
  Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]),
);
// "hello"

console.log(
  Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index,
);
// 4

console.log(Reflect.apply(''.charAt, 'ponies', [3]));
// "i"

/**
 * Reflect.construct
 */
function OneClass() {
  this.name = 'one';
}

function OtherClass() {
  this.name = 'other';
}

// 创建一个对象:
const obj1 = Reflect.construct(OneClass, global, OtherClass);

// 与上述方法等效:
const obj2 = Object.create(OtherClass.prototype);
OneClass.apply(obj2, global);

console.log(obj1.name); // 'one'
console.log(obj2.name); // 'one'

console.log(obj1 instanceof OneClass); // false
console.log(obj2 instanceof OneClass); // false

console.log(obj1 instanceof OtherClass); // true
console.log(obj2 instanceof OtherClass); // true

/**
 * Reflect.defineProperty
 */
const student = {};
console.log(Reflect.defineProperty(student, 'name', { value: 'Mike' })); // true
console.log(student.name); // "Mike"

/**
 * Reflect.deleteProperty
 */
const obj = { x: 1, y: 2 };
console.log(Reflect.deleteProperty(obj, 'x')); // true
console.log(obj); // { y: 2 }

const arr = [1, 2, 3, 4, 5];
console.log(Reflect.deleteProperty(arr, '3')); // true
console.log(arr); // [1, 2, 3, , 5]

// 如果属性不存在，返回 true
console.log(Reflect.deleteProperty({}, 'foo')); // true

// 如果属性不可配置，返回 false
console.log(Reflect.deleteProperty(Object.freeze({ foo: 1 }), 'foo')); // false

/**
 * Reflect.get
 */
let obj3 = { x: 1, y: 2 };
console.log(Reflect.get(obj3, 'x')); // 1

// Array
console.log(Reflect.get(['zero', 'one'], 1)); // "one"

// Proxy with a get handler
const x = { p: 1 };
const objProxy = new Proxy(x, {
  get(t, k, r) {
    return k + 'bar';
  },
});
console.log(Reflect.get(objProxy, 'foo')); // "foobar"

/**
 * Reflect.getOwnPropertyDescriptor
 */
console.log(Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'x'));
// {value: "hello", writable: true, enumerable: true, configurable: true}

console.log(Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'y'));
// undefined

console.log(Reflect.getOwnPropertyDescriptor([], 'length'));
// {value: 0, writable: true, enumerable: false, configurable: false}

/**
 * Reflect.getPrototypeOf
 */
/*// 如果参数为 Object，返回结果相同
console.log(Object.getPrototypeOf({})); // {}
console.log(Reflect.getPrototypeOf({})); // {}

// 在 ES5 规范下，对于非 Object，抛异常
console.log(Object.getPrototypeOf('foo')); // Throws TypeError
console.log(Reflect.getPrototypeOf('foo')); // Throws TypeError

// 在 ES2015 规范下，Reflect 抛异常, Object 强制转换非 Object
console.log(Object.getPrototypeOf('foo')); // [String: '']
console.log(Reflect.getPrototypeOf('foo')); // Throws TypeError

// 如果想要模拟 Object 在 ES2015 规范下的表现，需要强制类型转换
console.log(Reflect.getPrototypeOf(Object('foo'))); // [String: '']*/
/**
 * Reflect.has
 */
console.log(Reflect.has({ x: 0 }, 'x')); // true
console.log(Reflect.has({ x: 0 }, 'y')); // false

// 如果该属性存在于原型链中，返回true
console.log(Reflect.has({ x: 0 }, 'toString')); // true

// Proxy 对象的 .has() 句柄方法
const obj4Proxy = new Proxy(
  {},
  {
    has(t, k) {
      return k.startsWith('door');
    },
  },
);
console.log(Reflect.has(obj4Proxy, 'doorbell')); // true
console.log(Reflect.has(obj4Proxy, 'dormitory')); // false

/**
 * Reflect.ownKeys
 */
console.log(Reflect.ownKeys({ z: 3, y: 2, x: 1 })); // [ "z", "y", "x" ]
console.log(Reflect.ownKeys([1])); // [ "0", "length"]

const sym = Symbol.for('comet');
const sym2 = Symbol.for('meteor');
const obj5 = {
  [sym]: 0,
  str: 0,
  '773': 0,
  '0': 0,
  [sym2]: 0,
  '-1': 0,
  '8': 0,
  'second str': 0,
};
console.log(Reflect.ownKeys(obj5));
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]

/**
 * Reflect.isExtensible And Reflect.isExtensible
 */
const empty = {};
console.log(Reflect.isExtensible(empty)); // === true

Reflect.preventExtensions(empty);
console.log(Reflect.isExtensible(empty)); // === false

/**
 * Reflect.set
 */
// Object
const obj6 = {};
Reflect.set(obj6, 'prop', 'value');
console.log(obj6.prop); // "value"

// Array
const arr1 = ['duck', 'duck', 'duck'];
Reflect.set(arr1, 2, 'goose');
console.log(arr1[2]); // "goose"

/**
 * Reflect.setPrototypeOf
 */
console.log(Reflect.setPrototypeOf({}, Object.prototype)); // true

// 可以将对象的[[Prototype]]更改为null。
console.log(Reflect.setPrototypeOf({}, null)); // true

// 如果目标不可扩展，则返回false。
console.log(Reflect.setPrototypeOf(Object.freeze({}), null)); // false

// 如果导致原型链循环，则返回false。
const target = {};
const proto = Object.create(target);
console.log(Reflect.setPrototypeOf(target, proto)); // false
