# 编程第二题

在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

## [源码地址](https://gitee.com/Wuner/wuner-notes/tree/master/docs/fed-e-task-03-01/notes/w-002-vue-reactivity/js)

## vue.js

```javascript
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
```

## compiler.js

```javascript
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
    const attrNames = attr.name.substr(2).split(':');
    // 处理不同的指令
    const fn = this[attrNames[0] + 'Updater'];
    // 因为在 textUpdater等中要使用 this
    fn && fn.call(this, node, attr.value, attrNames[1]);
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

  // 处理 v-html 指令
  htmlUpdater(node, key) {
    node.innerHTML = this.vm[key];
    // 每一个指令中创建一个 watcher，观察数据的变化
    /*eslint no-undef:0*/
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue;
    });
  }

  // 处理 v-on 指令
  onUpdater(node, key, eventListener) {
    node.addEventListener(eventListener, this.vm[key]);
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
```
