# 异步模式

## 异步任务

异步任务是指不进入主线程，而进入任务队列的任务，只有任务队列通知主线程，某个异步任务可以执行了，该任务才会进入主线程，当我们打开网站时，像图片的加载，音乐的加载，其实就是一个异步任务

```javascript
/**
 * 任何函数的声明和任何变量的声明都不会压入调用栈（Call Stack）
 * 将console.log(1)压入调用栈执行，执行后移除
 * 将setTimeout压入调用栈执行，执行setTimeout，因为setTimeout是异步，所以将a()压入Web APIs后，从调用栈中移除，倒计时等待
 * 将console.log(5)压入调用栈执行，执行后移除
 * 将setTimeout压入调用栈执行，执行setTimeout，因为setTimeout是异步，所以将c()压入Web APIs后，从调用栈中移除，倒计时等待
 * 将console.log(6)压入调用栈执行，执行后移除
 * 1秒倒计时结束后，将a()压入消息队列，Event Loop（事件循环）监听到后，将a()压入调用栈
 * 将console.log(2)压入调用栈执行，执行后移除
 * 将a()里的setTimeout压入调用栈执行，执行setTimeout，因为setTimeout是异步，所以将b()压入Web APIs后，从调用栈中移除，倒计时等待
 * 0.5秒倒计时结束后，将b()压入消息队列，Event Loop（事件循环）监听到后，将b()压入调用栈
 * 将console.log(3)压入调用栈执行，执行后移除
 * 2秒倒计时结束后，将c()压入消息队列，Event Loop（事件循环）监听到后，将c()压入调用栈
 * 将console.log(4)压入调用栈执行，执行后移除
 */

// 异步代码
console.log(1);
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
```
