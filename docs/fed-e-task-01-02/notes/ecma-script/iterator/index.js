// 简单迭代器
const makeIterator = (array) => {
  this.index = 0;
  return {
    next: () => {
      return {
        value: array[this.index++],
        done: this.index > array.length,
      };
    },
  };
};
let mIterator = makeIterator([1, 2]);
console.log(mIterator.next());
console.log(mIterator.next());
console.log(mIterator.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: undefined, done: true }

// 对象迭代器
const obj = {
  names: ['tom', 'jack', 'jeer'],
  age: [22, 11, 33],
  [Symbol.iterator]() {
    let array = [...this.names, ...this.age];
    return {
      index: 0,
      next() {
        return {
          value: array[this.index++],
          done: this.index > array.length,
        };
      },
    };
  },
};
for (let item of obj) {
  console.log(item);
}
// tom
// jack
// jeer
// 22
// 11
// 33
