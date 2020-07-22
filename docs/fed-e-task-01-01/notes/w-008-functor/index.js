// Functor
class Container {
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
   * @returns {Container} 返回Container对象
   */
  static of(value) {
    return new Container(value);
  }

  /**
   * map 方法
   * @param fn {function} 处理函数
   * @returns {Container} 返回Container对象
   */
  map(fn) {
    return Container.of(fn(this._value));
  }
}

let r = Container.of(5)
  .map((v) => v * v)
  .map((v) => v + 1);
console.log(r);
/**
 * 输出结果
 * Container { _value: 26 }
 */
