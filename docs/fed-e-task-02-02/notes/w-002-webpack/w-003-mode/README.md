# 模式(mode)

提供`mode`配置选项，告知 webpack 使用相应模式的内置优化。

`string`

## 用法

只在配置中提供 `mode` 选项

```javascript
module.exports = {
  mode: 'production',
};
```

或者从 CLI 参数中传递：

```javascript
webpack --mode=production
```

| 选项        | 描述                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。                                                                                                                            |
| production  | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin. |
| none        | 会将 process.env.NODE_ENV 的值设为 none，不做任何处理                                                                                                                                                                     |

> 记住，只设置 NODE_ENV，则不会自动设置 mode。
