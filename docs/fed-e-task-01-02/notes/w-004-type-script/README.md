# TypeScript

TypeScript 是 JavaScript 类型的超集，可编译为普通 JavaScript，支持 ECMAScript 6 标准，可运行在任何浏览器上。

TypeScript 是渐进式的

目前官网上已更新到 TypeScript 4.0 ，而中文官网更新到 TypeScript 3.1

#### [TypeScript(官网)](https://www.typescriptlang.org/index.html)

#### [TypeScript(中文网)](https://www.tslang.cn/index.html)

## 安装

这里是针对项目，不进行全局安装

```
npm i typescript -D
```

使用 ts-node 可以直接在 node 环境下运行 ts 文件，方便开发环境测试

```
npm i ts-node -D
```

运行

```
ts-node 文件路径
```

### 简单使用

```typescript
const test = (name: string) => console.log(`hello ${name}`);

test('typescript');
```

编译 ts 代码，生成一个 index.js 文件，并被转换为 es5

```
tsc index
```

index.js

```javascript
var test = function (name) {
  return console.log('hello ' + name);
};
test('typescript');
```

## 配置

生成配置文件 tsconfig.json

```
tsc --init
```

具体配置可以查看[Compiler Options(编译选项)](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## [操作手册](https://www.tslang.cn/docs/handbook/basic-types.html)

### Basic Types(基础类型)

为了使程序有用，我们需要能够使用一些最简单的数据单元：数字，字符串，结构，布尔值等。 在 TypeScript 中，我们支持与 JavaScript 中期望的类型几乎相同的类型，并抛出了方便的枚举类型以帮助处理问题。

#### Boolean(布尔类型)

```typescript
let isDone: boolean = true;
```

#### Number(数字)

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

#### String(字符串)

```typescript
let str: string = 'bob';
str = 'smith';
str = `smith${str}`;
```

#### Array(数组)

```typescript
let list: number[] = [1, 2, 3];
let list1: Array<number> = [1, 2, 3];
```

#### Tuple(元组)

```typescript
let x: [string, number];
x = ['hello', 10]; // OK
// x = [10, 'hello']; // Error
```

#### Enum(枚举)

Enum 类型是对 JavaScript 标准数据类型的一个补充。

像 C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```typescript
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
```

#### Any(任何类型)

```typescript
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false;
notSure = 1;
```

#### Void

某种程度上来说，void 类型像是与 any 类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```typescript
function warnUser(): void {
  console.log('This is my warning message');
}
```

声明一个 void 类型的变量没有什么大用，因为你只能为它赋予 undefined 和 null：

```typescript
let unusable: void = undefined;
```

#### Null and Undefined

TypeScript 里，undefined 和 null 两者各自有自己的类型分别叫做 undefined 和 null。 和 void 相似，它们的本身的类型用处不是很大

```typescript
let u: undefined = undefined;
let n: null = null;
```

#### Never

never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error('Something failed');
}
```

#### Object(对象类型)

object 表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(function () {}); // OK
create([1]); // OK
create(null); // OK
// create(42); // Error
// create('string'); // Error
// create(false); // Error
// create(undefined); // Error
```

#### 函数

```typescript
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
```

#### 隐式类型推断

```typescript
let age = 18; // typescript会隐式类型推断其为number
let name = '18'; // typescript会隐式类型推断其为string
let className; // typescript会隐式类型推断其为any
```

#### Type assertions(类型断言)

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```typescript
let someValue: any = 'this is a string';

let strLength: number = (<string>someValue).length;
```

另一个为 as 语法：

```typescript
let someValue: any = 'this is a string';

let strLength: number = (someValue as string).length;
```

### Interfaces(接口)

```typescript
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
```

可选属性

```typescript
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
```

只读属性

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // error!
```

### Class(类)

```typescript
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
```

#### 修饰符

在 TypeScript 里，成员都默认为 public

- public

可以自由的访问程序里定义的成员

```typescript
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
console.log(new Person('zs').getName()); //zs
```

- private

当成员被标记成 private 时，它就只能在类的内部访问。

```typescript
class Person {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
new Person('zs').name; // 错误: 'name' 是私有的.
```

- protected

protected 修饰符与 private 修饰符的行为很相似，但有一点不同， protected 成员在派生类中仍然可以访问。

```typescript
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
  getName(): string {
    return this.name; // error，不能被访问
  }
  getAge(): number {
    return this.age; // OK，可以被访问
  }
}
```

#### readonly(只读)

你可以使用 readonly 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化

```typescript
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus('Man with the 8 strong legs');
dad.name = 'Man with the 3-piece suit'; // 错误! name 是只读的.
```

#### 类实现接口

与 C#或 Java 里接口的基本作用一样，TypeScript 也能够用它来明确的强制一个类去符合某种契约。

```typescript
interface Run {
  run(): void;
}
class Car implements Run {
  run(): void {
    console.log('我会跑...');
  }
}
new Car().run();
```

#### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```typescript
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
```

### Generics(泛型)

软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

在像 C#和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。

```typescript
// 普通函数
function createArray<T>(...args: T[]): T[] {
  return args;
}

console.log(createArray<number>(1, 2, 3));
console.log(createArray<string>('jack', 'tom'));

// 箭头函数
const createArrayArrow = <T>(...args: T[]): T[] => {
  return args;
};

console.log(createArrayArrow<number>(1, 2, 3));
console.log(createArrayArrow<string>('jack', 'tom'));
```

### [更多](https://www.typescriptlang.org/docs/handbook/basic-types.html)
