# Webpack 构建缓存机制-hash

## hash

这边我们将长度指定为 8 位

```javascript
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:8].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

hash 是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且所有文件都共用相同的 hash 值

## chunkhash

根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。

```javascript
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].[chunkhash:8].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

将样式作为模块 import 到 JavaScript 文件中的，生成的 chunkhash 是一致的

如果我们修改了 js 的内容，css 的打包名称也会改变

## contenthash

ontenthash 是针对文件内容级别的，只有自己的文件内容变了，hash 值才会改变
