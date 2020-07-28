# 开发一个插件

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子，所以做好阅读一些源码的准备！

## 创建插件

webpack 插件由以下组成：

- 一个 JavaScript 命名函数。
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

```javascript
// 一个 JavaScript 命名函数。
function MyExampleWebpackPlugin() {}

// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function (compiler) {
  // 指定一个挂载到 webpack 自身的事件钩子。
  compiler.plugin('webpacksEventHook', function (
    compilation /* 处理 webpack 内部实例的特定数据。*/,
    callback,
  ) {
    console.log('This is an example plugin!!!');

    // 功能完成后调用 webpack 提供的回调。
    callback();
  });
};
```

## Compiler 和 Compilation

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

这两个组件是任何 webpack 插件不可或缺的部分（特别是 compilation），因此，开发者在阅读源码，并熟悉它们之后，会感到获益匪浅：

- [Compiler Source](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)
- [Compilation Source](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)

## 基本插件架构

插件是由「具有 apply 方法的 prototype 对象」所实例化出来的。这个 apply 方法在安装插件时，会被 webpack compiler 调用一次。apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。一个简单的插件结构如下：

```javascript
function HelloWorldPlugin(options) {
  // 使用 options 设置插件实例……
}

HelloWorldPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('done', function () {
    console.log('Hello World!');
  });
};

module.exports = HelloWorldPlugin;
```

```javascript
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('done', function () {
      console.log('Hello World!');
    });
  }
}

module.exports = HelloWorldPlugin;
```

## 访问 compilation 对象

使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中。

```javascript
class HelloCompilationPlugin {
  apply(compiler) {
    // 设置回调来访问 compilation 对象：
    compiler.hooks.compilation.tap('HelloCompilationPlugin', function (
      compilation,
    ) {
      // 现在，设置回调来访问 compilation 中的步骤：
      compilation.hooks.optimize.tap('optimize', function () {
        console.log('Assets are being optimized.');
      });
    });
  }
}
```

关于 compiler, compilation 的可用回调，和其它重要的对象的更多信息，请查看[插件](https://www.webpack.js.org/api/plugins/)文档。

## 异步编译插件

有一些编译插件中的步骤是异步的，这样就需要额外传入一个 callback 回调函数，并且在插件运行结束时，*必须*调用这个回调函数。

```javascript
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('emit', function (compilation, callback) {
      // 做一些异步处理……
      setTimeout(function () {
        console.log('Done with async work...');
        callback();
      }, 1000);
    });
  }
}
```

## 示例：给 js 文件添加注释

```javascript
class AddJsNote {
  apply(compiler) {
    // emit: 生成资源到 output 目录之前。
    // 我们这里需要在生成js文件后执行，所以使用这个钩子
    compiler.hooks.emit.tap('emit', function (compilation) {
      let note = `/**
 * @author Wuner
 * @date 2020/7/23 11:28
 * @description
 */\n`;
      for (let filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          let content = note + compilation.assets[filename].source();
          compilation.assets[filename] = {
            source: () => content,
            size: () => note.length,
          };
        }
      }
    });
  }
}
```
