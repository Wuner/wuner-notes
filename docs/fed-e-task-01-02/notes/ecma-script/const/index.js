// // 注意: 常量在声明的时候可以使用大小写，但通常情况下全部用大写字母。
//
// // 定义常量MY_FAV并赋值7
// const MY_FAV = 7;
//
// // 报错
// MY_FAV = 20;
//
// // 输出 7
// console.log("my favorite number is: " + MY_FAV);
//
// // 尝试重新声明会报错
// const MY_FAV = 20;
//
// //  MY_FAV 保留给上面的常量，这个操作会失败
// var MY_FAV = 20;
//
// // 也会报错
// let MY_FAV = 20;
//
// // 注意块范围的性质很重要
// if (MY_FAV === 7) {
//     // 没问题，并且创建了一个块作用域变量 MY_FAV
//     // (works equally well with let to declare a block scoped non const variable)
//     let MY_FAV = 20;
//
//     // MY_FAV 现在为 20
//     console.log('my favorite number is ' + MY_FAV);
//
//     // 这被提升到全局上下文并引发错误
//     var MY_FAV = 20;
// }
//
// // MY_FAV 依旧为7
// console.log("my favorite number is " + MY_FAV);
//
// // 常量要求一个初始值
// const FOO; // SyntaxError: missing = in const declaration
//
// // 常量可以定义成对象
// const MY_OBJECT = {"key": "value"};
//
// // 重写对象和上面一样会失败
// MY_OBJECT = {"OTHER_KEY": "value"};
//
// // 对象属性并不在保护的范围内，下面这个声明会成功执行
// MY_OBJECT.key = "otherValue";
//
// // 也可以用来定义数组
// const MY_ARRAY = [];
// // It's possible to push items into the array
// // 可以向数组填充数据
// MY_ARRAY.push('A'); // ["A"]
// // 但是，将一个新数组赋给变量会引发错误
// MY_ARRAY = ['B']
