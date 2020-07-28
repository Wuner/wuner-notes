# 转换编译(Transpiling)

## vue-loader

处理 Vue 文件

### 安装

```
npm i vue-loader vue-template-compiler -D
```

### 配置

指定加载`src`目录下的，忽略`node_modules`目录

`webpack.config.js`

```javascript
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
  ],
};
```

## babel-loader

将 es6+ 转换为 es5

### 安装

```
npm i babel-loader @babel/core @babel/preset-env -D
```

### 配置

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
};
```

配置 babel 使用插件集合将 es6+ 转换为 es5

`babel.config.js`

```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      },
    ],
  ],
};
```

## [buble-loader](https://www.npmjs.com/package/buble-loader)

将`es6+`代码加载并转换为`es5`

## [traceur-loader](https://www.npmjs.com/package/traceur-loader)

将`es6+`代码加载并转换为`es5`

## [ts-loader](https://www.npmjs.com/package/ts-loader)

将`TypeScript`转换为`JavaScript`

## coffee-loader

将`CoffeeScript`转换为`JavaScript`
