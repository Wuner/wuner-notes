/**
 * @author Wuner
 * @date 2020/7/30 2:52
 * @description
 */
// 负责解析指令/插值表达式
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compiler(this.el);
  }

  // 编译模板，处理文本节点和元素节点
  compiler(el) {
    // el.childNodes是一个伪数组
    const childNodes = Array.from(el.childNodes);
    childNodes.forEach((node) => {
      // console.dir(node);
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compilerText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compilerElement(node);
      }

      // 判断当前节点是否存在子节点，并且子节点个数大于0，需递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node);
      }
    });
  }

  // 编译元素节点，处理指令
  compilerElement(node) {
    // console.dir(node);
    // attributes是一个伪数组
    // 遍历元素节点中的所有属性，找到指令
    Array.from(node.attributes).forEach((attr) => {
      // 获取元素属性的名称
      // 判断当前的属性名称是否是指令
      if (this.isDirective(attr.name)) {
        this.updater(node, attr);
      }
    });
  }

  // 负责更新 DOM
  // 创建 Watcher
  updater(node, attr) {
    // attrName 的形式 v-text v-model
    // 截取属性的名称，获取 text model
    const attrName = attr.name.substr(2);
    // 处理不同的指令
    const fn = this[attrName + 'Updater'];
    // 因为在 textUpdater等中要使用 this
    fn && fn.call(this, node, attr.value);
  }

  // 处理 v-text 指令
  textUpdater(node, key) {
    node.textContent = this.vm[key];
    // 每一个指令中创建一个 watcher，观察数据的变化
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }

  // 处理 v-model 指令
  modelUpdater(node, key) {
    node.value = this.vm[key];
    // 监听视图的变化
    node.addEventListener('input', () => (this.vm[key] = node.value));
    // 每一个指令中创建一个 watcher，观察数据的变化
    /*eslint no-undef:0*/
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });
  }

  // 编译文本节点
  compilerText(node) {
    // console.dir(node);
    let reg = /\{\{(.+?)\}\}/;
    // 获取文本节点的内容
    let textContent = node.textContent;
    if (reg.test(textContent)) {
      // 插值表达式中的值就是我们要的属性名称
      let key = RegExp.$1.trim();
      // 把插值表达式替换成具体的值
      node.textContent = this.vm.$data[key];
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }

  // 判断是否属性是指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }

  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
