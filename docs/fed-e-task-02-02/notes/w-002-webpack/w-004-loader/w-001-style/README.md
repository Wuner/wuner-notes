# 样式

## [style-loader](https://www.webpack.js.org/loaders/style-loader/)

将模块的导出作为样式添加到 DOM 中

### 安装

```
npm i style-loader -D
```

### 用法

建议将 style-loader 与 css-loader 结合使用

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};
```

## [css-loader](https://www.webpack.js.org/loaders/css-loader/)

解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码

### 安装

```
npm i css-loader -D
```

### 用法

css-loader 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们。

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};
```

## [less-loader](https://www.webpack.js.org/loaders/less-loader/)

加载和转译 LESS 文件

### 安装

```
npm i less-loader less -D
```

### 用法

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'less-loader', // 将 Less 编译成 CSS
          },
        ],
      },
    ],
  },
};
```

## [sass-loader](https://www.webpack.js.org/loaders/sass-loader/)

加载和转译 SASS/SCSS 文件

### 安装

```
npm i sass-loader node-sass webpack -D
```

### 用法

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'sass-loader', // 将 Sass 编译成 CSS
          },
        ],
      },
    ],
  },
};
```

## [postcss-loader](https://www.webpack.js.org/loaders/postcss-loader/)

使用 PostCSS 加载和转译 CSS/SSS 文件

### 安装

```
npm i postcss-loader -D
```

### 用法

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader'],
      },
    ],
  },
};
```

设置 postcss.config.js 后，将 postcss-loader 添加到 webpack.config.js 中。 您可以单独使用它，也可以将其与 css-loader 结合使用（推荐）。 如果使用 css-loader 和 style-loader，但要使用其他预处理程序，例如 sass | less | stylus-loader，请使用它。

> 当单独使用 postcss-loader 时（不使用 css-loader），请勿在 CSS 中使用@import，因为这可能导致捆绑包非常膨胀

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
};
```

## [stylus-loader](https://www.npmjs.com/package/stylus-loader)

加载和转译 Stylus 文件

### 安装

```
npm i stylus-loader stylus -D
```

### 用法

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.styl/,
        use: [
          {
            loader: 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'stylus-loader', // 将 Stylus 编译成 CSS
          },
        ],
      },
    ],
  },
};
```
