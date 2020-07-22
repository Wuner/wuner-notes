# Task 异步执行

> [folktale](https://folktale.origamitower.com/) 一个标准的函数式编程库

- 使用 folktale 里的 [Task](https://folktale.origamitower.com/docs/v2.3.0/migrating/from-data.task/) 函数实现异步

- 使用 [fs](http://nodejs.cn/api/fs.html) 里的 readFile 函数，读取文件内容

```javascript
// Task 异步执行
const { task } = require('folktale/concurrency/task');
const fs = require('fs');

/**
 * 读取文件内容
 * @param filename {String} 文件名
 * @returns {*} 返回task对象
 */
const readFile = (filename) => {
  return task((resolve) => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolve.reject(err);
      resolve.resolve(data);
    });
  });
};

readFile('package.json')
  .map((v) => JSON.parse(v))
  .run()
  .listen({
    onRejected: (err) => {
      console.log('异常', err);
    },
    onResolved: (data) => {
      console.log(data.version);
    },
  });

/**
 * 输出结果
 * 1.0.0
 */
```
