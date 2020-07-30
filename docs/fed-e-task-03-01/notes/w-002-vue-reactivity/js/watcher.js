/**
 * @author Wuner
 * @date 2020/7/30 22:17
 * @description
 */
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    // 当数据变化的时候，调用 callback 更新视图
    this.callback = callback;

    // 在 Dep 的静态属性上记录当前 watcher 对象，当访问数据的时候把 watcher 添加到 dep 的 subs 中
    /*eslint no-undef:0*/
    Dep.target = this;
    // 这里通过vm取值时，会调用到observer中的defineReactive中的get方法
    this.oldValue = vm[key];
    // 赋值后，将缓存清空，防止污染
    Dep.target = null;
  }

  update() {
    this.oldValue !== this.vm[this.key] && this.callback(this.vm[this.key]);
  }
}
