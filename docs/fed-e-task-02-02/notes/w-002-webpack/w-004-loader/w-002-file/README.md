# 文件

## [raw-loader](https://www.webpack.js.org/loaders/raw-loader/)

加载文件原始内容（utf-8）

### 安装

```
npm i raw-loader -D
```

### 用法

通过 webpack 配置、命令行或者内联使用 loader

#### webpack 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
    ],
  },
};
```

#### 通过命令行（CLI）

```
webpack --module-bind 'txt=raw-loader'
```

#### 内联使用

```javascript
import txt from 'raw-loader!./assets/index.txt';
```

## [val-loader](https://www.webpack.js.org/loaders/val-loader/)

将代码作为模块执行，并将 exports 转为 JS 代码

### 安装

```
npm i val-loader -D
```

### 用法

此 loader 所加载的模块必须符合以下接口

加载的模块必须使用以下函数接口，将 default export 导出为一个函数。

```
module.exports = function () {...};
```

还支持 Babel 编译的模块

```
export default function () {...};
```

### 示例

_answer.js_

```javascript
module.exports = function () {
  return {
    code: 'module.exports = "test val-loader";',
  };
};
```

webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./src/answer.js'),
        use: {
          loader: 'val-loader',
        },
      },
    ],
  },
};
```

## [url-loader](https://www.webpack.js.org/loaders/url-loader/)

将文件作为 base64 编码的 URL 加载

### 安装

```
npm i url-loader -D
```

### 用法

url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpge|jpg|git|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 4,
          },
        },
      },
    ],
  },
};
```

## [file-loader](https://www.webpack.js.org/loaders/file-loader/)

将文件发送到输出文件夹，并返回（相对）URL

### 安装

```
npm i file-loader -D
```

### 用法

默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpge|jpg|git|svg)$/,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
};
```
