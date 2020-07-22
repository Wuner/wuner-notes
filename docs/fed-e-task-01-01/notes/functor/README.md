# 函子(Functor)

## 概念

> 容器：包含值和值的变形关系(这个变形关系就是函数)

> 函子：是一个特殊的容器，通过一个普通的对象来实现，该对象具有 map 方法，map 方法可以运行一个函数对值进行处理(变形关系)

## 总结

> 函数式编程的运算不直接操作值，而是由函子完成

> 函子就是一个实现了 map 契约的对象

> 我们可以把函子想象成一个盒子，这个盒子里封装了一个值

> 想要处理盒子中的值，我们需要给盒子的 map 方法传递一个处理值的函数（纯函数），由这个函数来对值进行处理

> 最终 map 方法返回一个包含新值的盒子（函子）

## demo

```javascript
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
```
