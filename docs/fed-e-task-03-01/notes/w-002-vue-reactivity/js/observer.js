/**
 * @author Wuner
 * @date 2020/7/30 0:12
 * @description
 */
// 负责数据劫持
// 把 $data 中的成员转换成 getter/setter
class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    // 判断数据是否是对象，如果是对象，则遍历对象的所有属性，设置为 getter/setter
    if (data && typeof data === 'object') {
      // 遍历 data 的所有成员
      Object.keys(data).forEach((key) =>
        this.defineReactive(data, key, data[key]),
      );
    }
  }

  // 定义响应式成员
  defineReactive(data, key, val) {
    /*eslint no-undef:0*/
    let dep = new Dep();
    // 如果val是对象，继续设置它下面的成员为响应式数据
    this.walk(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        // 这里val不能通过data[key]获取，否则会陷入自调用死循环
        return val;
      },
      set: (newVal) => {
        // 这里val不能通过data[key]获取，否则会陷入自调用死循环
        if (newVal === val) return;
        val = newVal;
        // 如果newVal被赋值为对象，则继续设置它下面的成员为响应式数据
        this.walk(newVal);

        // 发送通知
        dep.notify();
      },
    });
  }
}
