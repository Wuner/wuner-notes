// MayBe 函子
class MayBe {
  /**
   * constructor 构造函数
   * @param value 入参
   */
  constructor(value) {
    this._value = value;
  }

  /**
   * of 实例化
   * @param value 入参
   * @returns {MayBe} 返回MayBe对象
   */
  static of(value) {
    return new MayBe(value);
  }

  /**
   * map 方法
   * @param fn {function} 处理函数
   * @returns {MayBe} 返回MayBe对象
   */
  map(fn) {
    return this.isNothing() ? MayBe.of(this._value) : MayBe.of(fn(this._value));
  }

  /**
   * isNothing 判断是否为null或undefined
   * @returns {boolean}
   */
  isNothing() {
    return this._value === null || this._value === undefined;
  }
}

let r = MayBe.of('abc')
  .map((val) => val.toUpperCase())
  .map((val) => val.split(''));

let r1 = MayBe.of(null)
  .map((val) => val.toUpperCase())
  .map((val) => val.split(''));

let r2 = MayBe.of(undefined)
  .map((val) => val.toUpperCase())
  .map((val) => val.split(''));

console.log(r);
console.log(r1);
console.log(r2);
