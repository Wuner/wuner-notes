# Rollup 配置文件

`rollup.config.js`

```javascript
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
};
```

我们用 --config 或 -c 来使用配置文件：

```
rollup -c
```
