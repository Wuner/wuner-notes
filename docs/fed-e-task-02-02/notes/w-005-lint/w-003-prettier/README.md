# [Prettier](https://prettier.io/)

代码格式化，有了 Prettier 之后，它能去掉原始的代码风格，确保团队的代码使用统一相同的格式，用官网的原话是"Building and enforcing a style guide"。它能支持很多格式:

- JavaScript
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, and SCSS
- HTML
- JSON
- GraphQL
- Markdown, 包括 GFM 和 MDX
- YAML

## 安装

```
npm i prettier -D
```

## [Option](https://prettier.io/docs/en/options.html)

`.prettierrc.js`

```javascript
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
};
```

## 运行

```
npx prettier --write .
```
