const test = (name: string) => console.log(`hello ${name}`);

test('type-script');
/**
 * Boolean(布尔类型)
 */
let isDone: boolean = true;
/**
 * Number(数字)
 */
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
/**
 * String(字符串)
 */
let str: string = 'bob';
str = 'smith';
str = `smith${str}`;
/**
 * Array(数组)
 */
let list: number[] = [1, 2, 3];
let list1: Array<number> = [1, 2, 3];
/**
 * Tuple(元组)
 * 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
 */
let x: [string, number];
x = ['hello', 10]; // OK
// x = [10, 'hello']; // Error
/**
 * Enum(枚举)
 * Enum类型是对JavaScript标准数据类型的一个补充。
 * 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
 */
enum Color {
  Red = 8,
  Green,
  Blue,
} // 默认0,1,2
let c: Color = Color.Green;
let cName: string = Color[9];
console.log(c);
console.log(cName);
// 9
// Green
/**
 * Any(任何类型)
 */
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false;
notSure = 1;
/**
 * Void
 * 某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：
 */
function warnUser(): void {
  console.log('This is my warning message');
}
// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;
/**
 * Null 和 Undefined
 * TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。 和 void相似，它们的本身的类型用处不是很大
 */
let u: undefined = undefined;
let n: null = null;
/**
 * Never
 */
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error('Something failed');
}
/**
 * Object(对象类型)
 */
// declare function create(o: object | null): void;
//
// create({ prop: 0 }); // OK
// create([1]); // OK
// create(function () {}); // OK
// create(null); // OK
// create(42); // Error
// create('string'); // Error
// create(false); // Error
// create(undefined); // Error

/**
 * function 函数类型
 */
function add(x: number, y: number): number {
  return x + y;
}
const division = (x: number, y: number): number => {
  return x / y;
};
// 书写完整函数类型
let myAdd: (baseValue: number, increment: number) => number = function (
  x: number,
  y: number,
): number {
  return x + y;
};
const myDivision: (baseValue: number, increment: number) => number = (
  x: number,
  y: number,
): number => {
  return x / y;
};

// 推断类型
const myDivision1: (baseValue: number, increment: number) => number = (
  x,
  y,
): number => {
  return x / y;
};

/**
 * Interfaces(接口)
 */
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
// 可选
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: 'white', area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: 'black' });
console.log(mySquare);
// 只读
interface Point {
  readonly x: number;
  readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // error!

/**
 * Class(类)
 */

// class Person {
//   private name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   getName(): string {
//     return this.name;
//   }
// }
// console.log(new Person('zs').getName()); //zs
class Person {
  private name: string;
  protected age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
class School extends Person {
  constructor(name: string, age: number) {
    super(name, age);
  }
  // getName(): string {
  //   return this.name; // error，不能被访问
  // }
  getAge(): number {
    return this.age; // OK，可以被访问
  }
}

/**
 * readonly(只读)
 */
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus('Man with the 8 strong legs');
// dad.name = 'Man with the 3-piece suit'; // 错误! name 是只读的.
/**
 * 类实现接口
 */
interface Run {
  run(): void;
}
class Car implements Run {
  run(): void {
    console.log('我会跑...');
  }
}
new Car().run();
/**
 * 抽象类
 */
abstract class Animal {
  run(): void {
    console.log('我会跑...');
  }
}

class Doc extends Animal {
  eat(): void {
    console.log('我会吃...');
  }
}

let doc = new Doc();
doc.eat();
doc.run();

/**
 * Generics(泛型)
 */
function createArray<T>(...args: T[]): T[] {
  return args;
}

console.log(createArray<number>(1, 2, 3));
console.log(createArray<string>('jack', 'tom'));

const createArrayArrow = <T>(...args: T[]): T[] => {
  return args;
};

console.log(createArrayArrow<number>(1, 2, 3));
console.log(createArrayArrow<string>('jack', 'tom'));
