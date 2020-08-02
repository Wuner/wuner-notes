/**
 * @author Wuner
 * @date 2020/7/29 23:34
 * @description
 */
class Vue {
  constructor(options) {
    // 初始化参数(选项)
    this.$options = options || {};
    this.$data = this.$options.data || {};
    const el = this.$options.el;
    // 判断el是否是字符串，如果是的话，则通过querySelector找到dom节点，否则直接赋值dom
    this.$el = typeof el === 'string' ? document.querySelector(el) : el;
    // 遍历methods，注入到vue实例
    this.handleMethods(this.$options.methods);
    // 负责把data中的属性，注入到vue实例，并转换为getter和setter
    this._proxyData(this.$data);
    // 调用 observer 监听 data 中所有属性的变化
    /*eslint no-undef:0*/
    new Observer(this.$data);
    // 编译
    new Compiler(this);
  }

  handleMethods(methods) {
    for (let key in methods) {
      this[key] = methods[key];
    }
  }

  _proxyData(data) {
    // 遍历 data 的所有属性
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(val) {
          if (val === data[key]) {
            return;
          }
          data[key] = val;
        },
      });
    });
  }
}
