# 编程第二题

## 使用

gulpfile.js 使用 module.exports 导出了 build、dev、clean，所以我们可以通过 gulp 调用这三个任务

```
gulp build
gulp dev
gulp clean
```

## 详解 gulpfile.js

### 处理 html 文件

我们需要安装`gulp-htmlmin`、`swig`两个插件

首先我们使用 `swig` 编译 html，并将数据对象中的变量注入模板，设置不缓存页面；后续我们将使用`gulp-htmlmin`，对 html 文件进行压缩

```javascript
const page = () => {
  return src('src/*html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 编译html，并将数据对象中的变量注入模板，不缓存
    .pipe(dest('temp'));
};
```

### 处理 scss 文件

我们需要安装`gulp-sass`、`gulp-clean-css`两个插件

首先我们使用 `gulp-sass` 编译 scss 文件，将 scss 转换为 css；后续我们将使用`gulp-clean-css`，对 css 文件进行压缩

```javascript
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 将scss转换为css
    .pipe(dest('temp'));
};
```

### 处理 js 文件

我们需要安装`@babel/core`、`@babel/preset-env`、`gulp-babel`、`gulp-uglify`四个插件

首先我们使用 `@babel/core`、`@babel/preset-env`、`gulp-babel` 编译 js 文件，将 es6 转换为 es5；后续我们将使用`gulp-uglify`，对 js 文件进行压缩

```javascript
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] })) // 提供babel将es6转换为es5
    .pipe(dest('temp'));
};
```

### 处理 image 文件

我们需要安装`gulp-imagemin`插件

`gulp-imagemin`插件内置了几个 git 上的插件，拉取极易失败；可以采取以下方法，将可 install 成功

```
C:\Windows\System32\drivers\etc\hosts
找到上面路径的文件，进行编辑
添加以下内容：
52.74.223.119     github.com
192.30.253.119    gist.github.com
54.169.195.247    api.github.com
185.199.111.153   assets-cdn.github.com
151.101.76.133    raw.githubusercontent.com
151.101.76.133    gist.githubusercontent.com
151.101.76.133    cloud.githubusercontent.com
151.101.76.133    camo.githubusercontent.com
151.101.76.133    avatars0.githubusercontent.com
151.101.76.133    avatars1.githubusercontent.com
151.101.76.133    avatars2.githubusercontent.com
151.101.76.133    avatars3.githubusercontent.com
151.101.76.133    avatars4.githubusercontent.com
151.101.76.133    avatars5.githubusercontent.com
151.101.76.133    avatars6.githubusercontent.com
151.101.76.133    avatars7.githubusercontent.com
151.101.76.133    avatars8.githubusercontent.com

添加后使用cmd，运行ipconfig/flushdns
```

我们使用 `gulp-imagemin`将图片文件进行压缩

```javascript
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin()) // 压缩图片
    .pipe(dest('dist'));
};
```

### 处理字体文件

我们使用 `gulp-imagemin`将字体文件夹中的图片文件进行压缩

```javascript
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin()) // 压缩图片
    .pipe(dest('dist'));
};
```

### 处理无需编译的文件

将无需编译的文件直接写入到目标目录

```javascript
const static = () => {
  return src('public/**', { base: 'public' }).pipe(dest('dist')); // 无需编译的文件直接写入到目标目录
};
```

### 资源合并

`gulp-useref`这是一款可以将 HTML 引用的多个 CSS 和 JS 合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。`gulp-useref` 根据注释将 HTML 中需要合并压缩的区块找出来，对区块内的所有文件进行合并。`gulp-useref`只负责合并，不负责压缩！这里我们使用 gulp-if 插件，来判断文件类型，并压缩对应文件.

```javascript
const useref = () => {
  return (
    src('temp/*.html', { base: 'temp' })
      .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
      // html js css三种流
      // 压缩js文件
      .pipe(plugins.if('*.js', plugins.uglify()))
      // 压缩css文件
      .pipe(plugins.if('*.css', plugins.cleanCss()))
      // 压缩html文件
      .pipe(
        plugins.if(
          '*.html',
          plugins.htmlmin({
            conservativeCollapse: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          }),
        ),
      )
      .pipe(dest('dist'))
  );
};
```

### [浏览器同步测试工具](http://www.browsersync.cn/docs/options/)

安装`browser-sync`

使用`browser-sync`，我们的任何一次代码保存，浏览器都会同时显示我们的改动，提供我们的开发效率

我们也将使用 gulp 自带的 watch 方法，监听文件变化时，对其进行编译处理

```javascript
const serve = () => {
  bs.init({
    // browser-sync可以在工作中监听文件。您所做的更改要么被注入到页面（CSS和图像），或将导致所有浏览器做一个完整的页面刷新
    files: ['temp', 'src', 'public'],
    open: false, // browser-sync启动时是否自动打开的网址
    notify: false, // 是否在浏览器中弹出通知
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  });

  // 监听文件变化，对其进行编译处理
  watch('src/*.html', page);
  watch('src/assets/styles/*.scss', style);
  watch('src/assets/scripts/*.js', script);
  watch(
    ['src/assets/fonts/**', 'src/assets/images/**', 'public/**'],
    bs.reload,
  );
};
```

### 删除目录

使用 del 插件，我们在编译前，将原先编译后的文件目录删除

```javascript
const clean = () => {
  return del(['temp', 'dist']);
};
```

### [完整示例](https://gitee.com/wuner/wuner-notes/blob/master/docs/fed-e-task-02-01/code/question-2/gulpfile.js)

```javascript
// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();

const del = require('del');

const bs = require('browser-sync');

const data = require('./data');

const page = () => {
  return src('src/*html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 编译html，并将数据对象中的变量注入模板，不缓存
    .pipe(dest('temp'));
};

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 将scss转换为css
    .pipe(dest('temp'));
};

const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] })) // 提供babel将es6转换为es5
    .pipe(dest('temp'));
};

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin()) // 压缩图片
    .pipe(dest('dist'));
};

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin()) // 压缩图片
    .pipe(dest('dist'));
};

const static = () => {
  return src('public/**', { base: 'public' }).pipe(dest('dist')); // 无需编译的文件直接写入到目标目录
};

// 删除目录
const clean = () => {
  return del(['temp', 'dist']);
};

const useref = () => {
  return (
    src('temp/*.html', { base: 'temp' })
      .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
      // html js css三种流
      // 压缩js文件
      .pipe(plugins.if('*.js', plugins.uglify()))
      // 压缩css文件
      .pipe(plugins.if('*.css', plugins.cleanCss()))
      // 压缩html文件
      .pipe(
        plugins.if(
          '*.html',
          plugins.htmlmin({
            conservativeCollapse: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          }),
        ),
      )
      .pipe(dest('dist'))
  );
};

// 浏览器同步测试工具
const serve = () => {
  bs.init({
    files: ['temp', 'src', 'public'],
    open: false,
    notify: false,
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  });

  // 监听文件变化，对其进行编译处理
  watch('src/*.html', page);
  watch('src/assets/styles/*.scss', style);
  watch('src/assets/scripts/*.js', script);
  watch(
    ['src/assets/fonts/**', 'src/assets/images/**', 'public/**'],
    bs.reload,
  );
};

// 三个任务编译，互不干扰，所以我们使用异步组合任务
const compile = parallel(page, style, script);
// 这三个任务，我们需要先删除编译后文件目录，再执行编译，最后才执行浏览器同步测试工具，所以我们使用同步组合任务
const dev = series(clean, compile, serve);
// 我们需要先删除编译后文件目录，所以需要用同步组合任务
// 需要先编译后，才能资源合并，所以需要用同步组合任务
// 而image等任务互不干扰，我们使用异步组合任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, static),
);

module.exports = {
  build,
  dev,
  clean,
};
```
