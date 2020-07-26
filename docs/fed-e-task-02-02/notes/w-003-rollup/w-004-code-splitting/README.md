# 代码拆分

UMD 和 IIFE 输出格式不支持代码拆分构建

生成多文件时，必须使用`output.dir`选项，而不是`output.file`。

## 动态导入(Dynamic Import)

动态导入`lodash-es`模块，来实现代码拆分

`rollup.config.js`

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'amd', // 构建浏览器使用的文件
  },
  plugins: [nodeResolve()],
};
```

`src/index.js`

```javascript
import('lodash-es').then((_) => {
  console.log(_.first([1, 2, 3]));
});
```

## 浏览器使用 AMD

因为我们生成的是 AMD 格式 javascript 代码，它不能直接被浏览器使用，需要通过 require.js，来加载 AMD

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
    <script
      data-main="./index.js"
      src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"
    ></script>
  </head>
  <body></body>
</html>
```
