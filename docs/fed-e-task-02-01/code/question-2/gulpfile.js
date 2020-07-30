// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();

const del = require('del');

const bs = require('browser-sync');

const data = require('./data');

const page = (filepath) => {
  return src(filepath || 'src/*html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 编译html，并将数据对象中的变量注入模板，不缓存
    .pipe(dest('temp'));
};

const style = (filepath) => {
  return src(filepath || 'src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 将scss转换为css
    .pipe(dest('temp'));
};

const script = (filepath) => {
  return src(filepath || 'src/assets/scripts/*.js', { base: 'src' })
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

const noBuild = () => {
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
  // watch('src/*.html', page);
  // watch('src/assets/styles/*.scss', style);
  // watch('src/assets/scripts/*.js', script);
  // 优化构建，按需构建
  watch('src/*.html').on('change', (filepath) => page(filepath));
  watch('src/assets/styles/*.scss').on('change', (filepath) => style(filepath));
  watch('src/assets/scripts/*.js').on('change', (filepath) => script(filepath));
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
  parallel(series(compile, useref), image, font, noBuild),
);

module.exports = {
  build,
  dev,
  clean,
};
