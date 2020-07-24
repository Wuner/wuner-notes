# 模块热替换 API(HMR API)

如果已经通过 HotModuleReplacementPlugin 启用了 HMR，则它的接口将被暴露在 module.hot 属性下面。通常，用户先要检查这个接口是否可访问，然后再开始使用它。举个例子，你可以这样 accept 一个更新的模块：

```javascript
if (module.hot) {
  module.hot.accept('./library.js', function () {
    // 使用更新过的 library 模块执行某些操作...
  });
}
```

## accept

接受(accept)给定依赖模块的更新，并触发一个回调函数来对这些更新做出响应。

```javascript
module.hot.accept(
  dependencies, // 可以是一个字符串或字符串数组
  callback, // 用于在模块更新后触发的函数
);
```

使用 ESM import 时，将从依赖项中导入的所有符号自动更新。 注意：依赖项字符串必须与 import 中的 from 字符串完全匹配。 在某些情况下，甚至可以省略 callback。 在回调中使用 require()没有意义。

使用 CommonJS 时，您需要通过在 callback 中使用 require()来手动更新依赖项。 省略 callback 在这里没有意义。

## decline

拒绝给定依赖模块的更新，使用`decline`方法强制更新失败。

```javascript
module.hot.decline(
  dependencies, // 可以是一个字符串或字符串数组
);
```

## dispose（或 addDisposeHandler）

添加一个处理函数，在当前模块代码被替换时执行。此函数应该用于移除你声明或创建的任何持久资源。如果要将状态传入到更新过的模块，请添加给定 data 参数。更新后，此对象在更新之后可通过 module.hot.data 调用。

```javascript
module.hot.dispose((data) => {
  // 清理并将 data 传递到更新后的模块……
});
```

## removeDisposeHandler

删除由 dispose 或 addDisposeHandler 添加的回调函数。

```javascript
module.hot.removeDisposeHandler(callback);
```

## status

取得模块热替换进程的当前状态。

```javascript
module.hot.status(); // 返回以下字符串之一……
```

| Status  | 描述                                                                    |
| ------- | ----------------------------------------------------------------------- |
| idle    | 该进程正在等待调用 check（见下文）                                      |
| check   | 该进程正在检查以更新                                                    |
| prepare | 该进程正在准备更新（例如，下载已更新的模块）                            |
| ready   | 此更新已准备并可用                                                      |
| dispose | 该进程正在调用将被替换模块的 dispose 处理函数                           |
| apply   | 该进程正在调用 accept 处理函数，并重新执行自我接受(self-accepted)的模块 |
| abort   | 更新已中止，但系统仍处于之前的状态                                      |
| fail    | 更新已抛出异常，系统状态已被破坏                                        |

## check

测试所有加载的模块以进行更新，如果有更新，则应用它们。

```javascript
module.hot
  .check(autoApply)
  .then((outdatedModules) => {
    // 超时的模块……
  })
  .catch((error) => {
    // 捕获错误
  });
```

autoApply 参数可以是布尔值，也可以是 options，当被调用时可以传递给 apply 方法

可选的 options 对象可以包含以下属性：

| options                       | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| ignoreUnaccepted (boolean)    | 忽略对未接受的模块所做的更改。                               |
| ignoreDeclined (boolean)      | 忽略对拒绝的模块所做的更改。                                 |
| ignoreErrored (boolean)       | 忽略接受处理函数，错误处理函数以及重新评估模块时抛出的错误。 |
| onDeclined (function(info))   | 拒绝模块的通知者                                             |
| onUnaccepted (function(info)) | 未接受模块的通知程序                                         |
| onAccepted (function(info))   | 接受模块的通知者                                             |
| onDisposed (function(info))   | 废弃模块的通知者                                             |
| onErrored (function(info))    | 异常通知者                                                   |

info 参数可能存在以下对象：

```
{
  type: "self-declined" | "declined" |
        "unaccepted" | "accepted" |
        "disposed" | "accept-errored" |
        "self-accept-errored" | "self-accept-error-handler-errored",
  moduleId: 4, // The module in question.
  dependencyId: 3, // For errors: the module id owning the accept handler.
  chain: [1, 2, 3, 4], // For declined/accepted/unaccepted: the chain from where the update was propagated.
  parentId: 5, // For declined: the module id of the declining parent
  outdatedModules: [1, 2, 3, 4], // For accepted: the modules that are outdated and will be disposed
  outdatedDependencies: { // For accepted: The location of accept handlers that will handle the update
    5: [4]
  },
  error: new Error(...), // For errors: the thrown error
  originalError: new Error(...) // For self-accept-error-handler-errored:
                                // the error thrown by the module before the error handler tried to handle it.
}
```

## addStatusHandler

注册一个函数来监听 status 的变化。

```javascript
module.hot.addStatusHandler((status) => {
  // 响应当前状态……
});
```

## removeStatusHandler

移除一个注册的状态处理函数。

```javascript
module.hot.removeStatusHandler(callback);
```
