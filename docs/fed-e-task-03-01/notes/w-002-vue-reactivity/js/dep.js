/**
 * @author Wuner
 * @date 2020/7/30 22:00
 * @description
 */
class Dep {
  constructor() {
    // 存储观察者的数组
    this.subs = [];
  }

  // 添加观察者
  addSub(sub) {
    // 判断是否是观察者
    sub && sub.update && this.subs.push(sub);
  }

  // 通知所有观察者
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}
