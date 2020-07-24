# HMR 用例

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。

> HMR 不适用于生产环境，这意味着它应当只在开发环境使用

## 启用 HMR

配置 [webpack-dev-server](../w-006-dev-server) ，并使用 webpack 的内置 HMR 插件

## HMR 修改样式

借助于 `style-loader` 的帮助，CSS 的模块热替换实际上是相当简单的。当更新 CSS 依赖模块时，此 loader 在后台使用 `module.hot.accept` 来修补(patch)`<style>`标签。

所以，可以使用以下命令安装两个 loader ：

```
npm i style-loader css-loader -D
```

接下来我们来更新 webpack 的配置，让这两个 loader 生效。

webpack.config.js

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: false,
    hot: true,
    open: true,
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
```

src/textarea.js

```javascript
module.exports = function () {
  const textarea = document.createElement('textarea');
  textarea.id = 'text';
  return textarea;
};
```

src/assets/main.css

```css
#text {
  color: red;
}
```

src/main.js

```javascript
import './assets/main.css';
import textarea from './textarea';

const textareaEl = textarea();
const body = document.body;
body.appendChild(textareaEl);
```

将 id 为 text 上的样式修改为 color: black，你可以立即看到页面的字体颜色随之更改，但并未刷新页面。

src/assets/main.css

```css
#text {
  color: black;
}
```

## HMR 修改 js

这里我们使用[HMR API](../w-009-hmr-api)里的`accept`来修补(patch)

webpack.config.js 配置

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: false,
    hot: true,
    open: true,
  },
  optimization: {
    NamedModulesPlugin,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

我们还添加了 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖.

src/textarea.js

```javascript
module.exports = function () {
  const textarea = document.createElement('textarea');
  textarea.id = 'text';
  return textarea;
};
```

src/main.js

```javascript
import textarea from './textarea';

let textareaEl = textarea();
const body = document.body;
body.appendChild(textareaEl);

// 判断是否开启模块热替换
if (module.hot) {
  module.hot.accept('./textarea.js', () => {
    console.log('Accepting the updated textarea module!');
    // 获取页面重新渲染前的值
    const val = textareaEl.value;
    // 移除Element
    body.removeChild(textareaEl);
    // 这里拿到的是最新的Element
    textareaEl = textarea();
    // 将value值写入
    textareaEl.value = val;
    // 添加Element
    body.appendChild(textareaEl);
  });
}
```

将 id 修改为 text1，你可以立即看到页面的 textarea 标签 id 也随之更改，但并未刷新页面。

src/textarea.js

```javascript
module.exports = function () {
  const textarea = document.createElement('textarea');
  textarea.id = 'text1';
  return textarea;
};
```
