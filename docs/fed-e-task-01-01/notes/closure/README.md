# 闭包(Closure)

## 描述

闭包 (Closure)：函数和其周围的状态(词法环境)的引用捆绑在一起形成闭包。

> 可以在另一个作用域中调用一个函数的内部函数并访问到该函数的作用域中的成员

闭包的本质：函数在执行的时候会放到一个执行栈上当函数执行完毕之后会从执行栈上移除，但是堆上的作用域成员因为被外部引用不能释放，因此内部函数依然可以访问外部函数的成员

### 浏览器调试工具使用

> Call Stack 函数调用栈（在匿名函数中调用） 一个函数执行后，会从函数调用栈中移除

> Scope 作用域

### demo

```javascript
/**
 * makePower 生成幂数函数
 * @param power {Number} n次方
 * @returns {function(*=): number} 返回值
 */
const makePower = (power) => {
  return (number) => {
    return Math.pow(number, power);
  };
};
// 测试
const power2 = makePower(2);
const power3 = makePower(3);
console.log(power2(2));
console.log(power2(3));
console.log(power3(2));
/**
 * 输出
 * 4
 * 9
 * 8
 */
```

```javascript
/**
 * makeSalary 工资生成器
 * @param base {Number} 基本工资
 * @returns {function(*): *}
 */
const makeSalary = (base) => {
  return (performance) => {
    return base + performance;
  };
};
// 测试
const getSalaryLevel1 = makeSalary(10000);
const getSalaryLevel2 = makeSalary(12000);
console.log(getSalaryLevel1(2000));
console.log(getSalaryLevel1(3000));
console.log(getSalaryLevel2(2000));
/**
 * 输出
 * 12000
 * 13000
 * 14000
 */
```
