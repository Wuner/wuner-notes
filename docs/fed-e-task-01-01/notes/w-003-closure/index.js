/**
 * 浏览器调试
 * Call Stack 函数调用栈（在匿名函数中调用） 一个函数执行后，会从函数调用栈中移除
 * Scope 作用域
 */
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

const power2 = makePower(2);
const power3 = makePower(3);
console.log(power2(2));
console.log(power2(3));
console.log(power3(2));

const getSalaryLevel1 = makeSalary(10000);
const getSalaryLevel2 = makeSalary(12000);
console.log(getSalaryLevel1(2000));
console.log(getSalaryLevel1(3000));
console.log(getSalaryLevel2(2000));
