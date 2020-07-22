# Either 函子

> Either 两者中的任何一个，类似于 if...else...的处理

> 异常会让函数变的不纯，Either 函子可以用来做异常处理

## demo

```javascript
// Either 函子
class Either {
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
   * @returns {Either} 返回Either对象
   */
  static of(value) {
    return new Either(value);
  }

  /**
   * map 方法
   * @param fn {function} 处理函数
   * @returns {Either} 返回Either对象
   */
  map(fn) {
    return Either.of(fn(this._value));
  }
}

class Error extends Either {
  /**
   *
   * @param fn
   * @returns {Error} 返回Error对象的this
   */
  map(fn) {
    return this;
  }
}

/**
 * parseJson 解析字符串JSON
 * @param str {string} 入参
 * @returns {Either} 返回Either对象
 */
const parseJson = (str) => {
  try {
    return Either.of(JSON.parse(str));
  } catch (e) {
    return Error.of({ error: e.message });
  }
};

const r = parseJson('{"name": "zs"}');
const r1 = parseJson('{name: "zs"}');

console.log(r.map((val) => val.name.toUpperCase())); // 正常
console.log(r1); // 异常
/**
 * 输出结果
 * Either { _value: 'ZS' }
 * Either { _value: { error: 'Unexpected token n in JSON at position 1' }}
 */
```
