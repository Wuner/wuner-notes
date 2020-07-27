// 异步代码
console.log(1);
/* eslint no-undef: 0 */
setTimeout(
  (a = () => {
    console.log(2);
    setTimeout(
      (b = () => {
        console.log(3);
      }),
      500,
    );
  }),
  1000,
);
console.log(5);
setTimeout(
  (c = () => {
    console.log(4);
  }),
  2000,
);
console.log(6);

/**
 * 输出结果打印
 * 1
 * 5
 * 6
 * 2
 * 3
 * 4
 */
