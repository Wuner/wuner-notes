let i,
  str = '';
for (i = 0; i < 10000; i++) {
  str += i;
}
function f() {
  let str = '';
  for (let i = 0; i < 10000; i++) {
    str += i;
  }
}
f();

function f1() {
  document.getElementById('d1');
  document.getElementById('d4');
  document.getElementById('d2');
  document.getElementById('d7');
}
f1();
function f2() {
  let obj = document;
  obj.getElementById('d1');
  obj.getElementById('d4');
  obj.getElementById('d2');
  obj.getElementById('d7');
}
f2();

function f3() {
  this.foo = function () {
    console.log('heath');
  };
}

new f3();

function f4() {}
f4.prototype.foo = function () {
  console.log('heath');
};
new f4();

function f5() {
  // el 引用了全局变量document，假设btn节点被删除后，因为这里被引用着，所以这里不会被垃圾回收，导致内存泄漏
  let el = document.getElementById('btn');
  el.onclick = function (e) {
    console.log(e.id);
  };
}
f5();

function f6() {
  // el 引用了全局变量document，假设btn节点被删除后，因为这里被引用着，所以这里不会被垃圾回收，导致内存泄漏
  let el = document.getElementById('btn');
  el.onclick = function (e) {
    console.log(e.id);
  };
  el = null; // 我们这里手动将el内存释放，从而当btn节点被删除后，可以被垃圾回收
}
f6();

function f7() {
  this.age = 17;
  this.getAge = function () {
    return this.age;
  };
}

const age = new f7().getAge();

function f8() {
  this.age = 17;
}

const age1 = new f8().age;
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
for (let i = 0, n = arr.length; i < n; i++) {
  console.log(arr[i]);
}
arr.forEach((value) => console.log(value));
for (let i in arr) {
  console.log(arr[i]);
}
for (let val of arr) {
  console.log(val);
}

for (let i = 0; i < 3; i++) {
  let p = document.createElement('p');
  p.innerHTML = i;
  document.body.appendChild(p);
}
// cloneNode(克隆节点)
let oP = document.getElementById('old');
for (let i = 0; i < 3; i++) {
  let p = oP.cloneNode(false);
  p.innerHTML = i;
  document.body.appendChild(p);
}

let obj = new Object();
obj.name = 'heath';
obj.age = 18;
obj.sex = '男';

let obj1 = { name: 'heath', age: 18, sex: '男' };
