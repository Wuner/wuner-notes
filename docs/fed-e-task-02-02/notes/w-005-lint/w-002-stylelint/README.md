# [Stylelint](https://stylelint.io/)

- 了解最新的 CSS 语法
- 从 HTML，markdown 和 CSS-in-JS 对象和模板文字中提取嵌入式样式
- 解析类似于 CSS 的语法，例如 SCSS，Sass，Less 和 SugarSS
- 拥有 170 多个内置规则，可捕获错误，应用限制并强制执行样式规则
- 支持插件，因此您可以创建自己的规则或使用社区编写的插件
- 自动修复大多数样式违规
- 支持可扩展或创建的可共享配置

## 安装

```
npm i stylelint stylelint-config-standard -D
```

## 校验 css

创建`stylelint.config.js`

```javascript
module.exports = {
  extends: 'stylelint-config-standard',
};
```

运行

```
npx stylelint "**/*.css"
```

## 校验 scss

### 安装

```
npm i stylelint-config-sass-guidelines -D
```

`stylelint.config.js`

```javascript
module.exports = {
  extends: 'stylelint-config-sass-guidelines',
};
```

## [Webpack 上使用](https://github.com/webpack-contrib/stylelint-webpack-plugin)

### 安装

```
npm i stylelint  stylelint-webpack-plugin -D
```

webpack.config.js

```javascript
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  // ...
  plugins: [new StylelintPlugin()],
  // ...
};
```

## [gulp 上使用](https://github.com/olegskl/gulp-stylelint)

## 安装

```
npm i stylelint gulp-stylelint -D
```

`gulpfile.js`

```javascript
const gulp = require('gulp');

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp.src('src/**/*.css').pipe(
    gulpStylelint({
      reporters: [{ formatter: 'string', console: true }],
    }),
  );
});
```
