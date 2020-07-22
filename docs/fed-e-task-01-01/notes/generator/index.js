const common = require('../promise/common');
// const arr = [1, 2, 3];
// function* idMaker() {
//   for (let val of arr) {
//     yield val;
//   }
// }
//
// let gen = idMaker(); // "Generator { }"
//
// console.log(gen.next().value);
// console.log(gen.return('结束').value);
// console.log(gen.next().value);
// console.log(gen.next().value);
/**
 * 输出结果
 * 1
 * Uncaught Error: error
 * undefined
 * undefined
 */
// generator配合promise使用
function* main() {
  try {
    const result = yield common.Ajax(
      'fed-e-task-01-01/notes/promise/api/user.json',
    );
    console.log(result);
    const result1 = yield common.Ajax(
      'fed-e-task-01-01/notes/promise/api/cla1ss.json',
    );
    console.log(result1);
  } catch (e) {
    console.error(e);
  }
}

const co = (generator) => {
  const g = generator();
  function handelResult(result) {
    if (result.done) return;
    result.value.then(
      (res) => {
        handelResult(g.next(res));
      },
      (e) => {
        handelResult(g.throw(e));
      },
    );
  }
  handelResult(g.next());
};

co(main);
