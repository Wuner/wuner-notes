// Task 异步执行
const { task } = require('folktale/concurrency/task');
const fs = require('fs');

/**
 * 读取文件信息
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
