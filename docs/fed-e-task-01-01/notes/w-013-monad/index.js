// Monad 函子
const _ = require('lodash');
const fs = require('fs');

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

  join() {
    return this._value();
  }

  flatMap(fn) {
    return this.map(fn).join();
  }
}

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
const cat = readFile('package.json')
  .map((v) => JSON.parse(v))
  .map((v) => v.version)
  .flatMap(print)
  .join();
console.log(cat);
/**
 * 输出结果
 * 1.0.0
 */
