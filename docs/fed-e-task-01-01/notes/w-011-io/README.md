# IO 函子

> IO 函子中的 \_value 是一个函数，这里是把函数作为值来处理

> IO 函子可以把不纯的动作存储到 \_value 中，延迟执行这个不纯的操作(惰性执行)，包装当前的操作纯

> 把不纯的操作交给调用者来处理

## demo

```javascript
// IO 函子
const _ = require('lodash');

class IO {
  /**
   * 构造函数
   * @param fn {function} 函数
   */
  constructor(fn) {
    this._value = fn;
  }

  /**
   * 实例化
   * @param value
   * @returns {IO} IO对象
   */
  static of(value) {
    return new IO(function () {
      return value;
    });
  }

  /**
   * map 方法
   * @param fn {function} 处理函数
   * @returns {IO} 返回IO对象
   */
  map(fn) {
    return new IO(_.flowRight(fn, this._value));
  }
}

const r = IO.of(process).map((p) => p.execPath);

console.log(r._value());
/**
 * 输出结果
 * D:\Development\nodeJS\node.exe
 */
```

## IO 函子的问题

- 嵌套函子时，需要多次获取 value

```javascript
/**
 * 读取文件内容
 * @param filename {string} 文件名
 * @returns {IO} 返回IO对象
 */
const readFile = (filename) => {
  return new IO(() => {
    return fs.readFileSync(filename, 'utf-8');
  });
};

/**
 * 打印
 * @param value {string} 入参
 * @returns {IO} 返回IO对象
 */
const print = (value) => {
  return new IO(() => {
    return value;
  });
};
/**
 * 读取文件并打印
 */
const cat = _.flowRight(print, readFile);
// 因为这里是嵌套函子，所以这边打印出来的是IO(IO())
console.log(cat('package.json'));
// 所以需要连续两次获取value才能取到值
console.log(cat('package.json')._value()._value());
```
