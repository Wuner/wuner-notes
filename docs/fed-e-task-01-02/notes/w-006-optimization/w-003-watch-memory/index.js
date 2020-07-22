document.body.innerHTML = `<button id="add">add</button>`;
document.getElementById('add').addEventListener('click', function (e) {
  // simulateMemoryLeak();
  create();
});
// 模拟内存泄漏
let result = [];
function simulateMemoryLeak() {
  setInterval(function () {
    result.push(new Array(1000000).join('x'));
    document.body.innerHTML = result;
  }, 100);
}
// 模拟已分离 DOM 节点
let detachedTree;
function create() {
  let ul = document.createElement('ul');
  for (let i = 0; i < 10; i++) {
    let li = document.createElement('li');
    ul.appendChild(li);
  }
  detachedTree = ul;
}
