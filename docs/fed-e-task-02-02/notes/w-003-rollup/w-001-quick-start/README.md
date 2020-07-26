# 快速上手

## 安装 rollup

```
npm i rollup -D
```

## 示例

`src/foo.js`

```javascript
const foo = () => {
  console.log('hello rollup');
};

export { foo };
```

`src/index.js`

```javascript
import { foo } from './foo';
foo();
```

### 对于浏览器

```
rollup ./src/index.js --file dist/bundle.js -f iife
```

### 对于`Node.js`

```
rollup ./src/index.js --file dist/bundle.js -f cjs
```

### 对于浏览器和`Node.js`

```
rollup ./src/index.js --file dist/bundle.js -f umd
```
