const fp = require('lodash/fp');
const cars = [
  {
    name: 'Ferrari FF',
    horsepower: 600,
    dollar_value: 700000,
    in_stock: true,
  },
  {
    name: 'Spyker C12 Zagato',
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: 'Jaguar XKR-S',
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  {
    name: 'Audi R8',
    horsepower: 525,
    dollar_value: 114200,
    in_stock: false,
  },
  {
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: 'Pagain Huayra',
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false,
  },
];

// 第一题
const prop = fp.curry((key, array) => {
  return fp.prop(key, array);
});
const isLastInStock = fp.flowRight(prop('in_stock'), fp.last);
console.log(isLastInStock(cars));

// 第二题
const isLastName = fp.flowRight(prop('name'), fp.first);
console.log(isLastName(cars));

// 第三题
const _average = (xs) => fp.reduce(fp.add, 0, xs) / xs.length;
const map = fp.curry((fn, array) => {
  return fp.map(fn, array);
});
const getDollarValues = map(function (car) {
  return car.dollar_value;
});
const averageDollarValue = fp.flowRight(_average, getDollarValues);
console.log(averageDollarValue(cars));

// 第四题
const _underscore = fp.replace(/\W+/g, '_');
const getName = map(function (car) {
  return car.name;
});
const sanitizeNames = fp.flowRight(map(_underscore), getName);
console.log(sanitizeNames(cars));
