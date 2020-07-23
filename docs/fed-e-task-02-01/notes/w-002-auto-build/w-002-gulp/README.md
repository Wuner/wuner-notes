# [Gulp](https://www.gulpjs.com.cn/)

用自动化构建工具增强你的工作流程！

gulp 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。

## 基本使用

> 安装 gulp

```text
npm i gulp -D
```

在项目根目录下创建`gulpfile.js`文件

```javascript
function defaultTask(cb) {
  // 在此处写默认任务的代码
  cb();
}

function fooTask(cb) {
  // 在此处写自定义任务的代码
  cb();
}

exports.default = defaultTask;
exports.foo = fooTask;
```

在`package.json`文件中配置

```json
{
  "script": {
    "gulp": "gulp"
  }
}
```

测试

在项目根目录下执行 gulp 命令：

默认执行 default 任务

```text
npm run gulp
```

执行 foo 任务

```text
npm run gulp foo
```

<span id="createTask"></span>

## 创建任务

每个 gulp 任务（task）都是一个异步的 JavaScript 函数，此函数是一个可以接收 callback 作为参数的函数，或者是一个返回 stream、promise、event emitter、child process 或 observable (后面会详细讲解) 类型值的函数。由于某些平台的限制而不支持异步任务，因此 gulp 还提供了一个漂亮 替代品。

### 导出任务

任务（tasks）可以是 public（公开） 或 private（私有） 类型的。

- 公开任务（Public tasks） 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用。
- 私有任务（Private tasks） 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分。

一个私有（private）类型的任务（task）在外观和行为上和其他任务（task）是一样的，但是不能够被用户直接调用。如需将一个任务（task）注册为公开（public）类型的，只需从 gulpfile 中导出（export）即可。

```javascript
const { series } = require('gulp');

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb();
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```

### 组合任务

Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度。

如果需要让任务（task）按顺序执行，请使用 series() 方法。

```javascript
const { series } = require('gulp');

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
```

对于希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来。

```javascript
const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```

当 series() 或 parallel() 被调用时，任务（tasks）被立即组合在一起。这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。

```javascript
const { series } = require('gulp');

function minify(cb) {
  // body omitted
  cb();
}

function transpile(cb) {
  // body omitted
  cb();
}

function livereload(cb) {
  // body omitted
  cb();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```

series() 和 parallel() 可以被嵌套到任意深度。

```javascript
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(cssTranspile, series(jsTranspile, jsBundle)),
  parallel(cssMinify, jsMinify),
  publish,
);
```

当一个组合操作执行时，这个组合中的每一个任务每次被调用时都会被执行。例如，在两个不同的任务（task）之间调用的 clean 任务（task）将被执行两次，并且将导致不可预期的结果。因此，最好重构组合中的 clean 任务（task）。

如果你有如下代码：

```javascript
// This is INCORRECT
const { series, parallel } = require('gulp');

const clean = function (cb) {
  // body omitted
  cb();
};

const css = series(clean, function (cb) {
  // body omitted
  cb();
});

const javascript = series(clean, function (cb) {
  // body omitted
  cb();
});

exports.build = parallel(css, javascript);
```

重构为：

```javascript
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

## 异步执行

Node 库以多种方式处理异步功能。最常见的模式是 [error-first callbacks](http://nodejs.cn/api/errors.html#errors_error_first_callbacks)，但是你还可能会遇到 [streams](http://nodejs.cn/api/stream.html#stream_stream)、[promises](../../../../fed-e-task-01-01/notes/promise)、[event emitters](http://nodejs.cn/api/events.html#events_events)、[child processes](http://nodejs.cn/api/child_process.html#child_process_child_process), 或 [observables](https://github.com/tc39/proposal-observable/blob/master/README.md)。gulp 任务（task）规范化了所有这些类型的异步功能。

### 任务（task）完成通知

当从任务（task）中返回 stream、promise、event emitter、child process 或 observable 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

当使用 series() 组合多个任务（task）时，任何一个任务（task）的错误将导致整个任务组合结束，并且不会进一步执行其他任务。当使用 parallel() 组合多个任务（task）时，一个任务的错误将结束整个任务组合的结束，但是其他并行的任务（task）可能会执行完，也可能没有执行完。

#### 返回 stream

```javascript
const { src, dest } = require('gulp');

const streamTask = () => src('src/css/*.css').pipe(dest('dist/css'));

exports.default = streamTask;
```

#### 返回 promise

```javascript
const promiseTask = () => Promise.resolve('the value is ignored');

exports.default = promiseTask;
```

#### 返回 event emitter

```javascript
const { EventEmitter } = require('events');

const eventEmitterTask = () => {
  const emitter = new EventEmitter();
  // 发射必须异步发生，否则gulp尚未监听
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
};

exports.default = eventEmitterTask;
```

#### 返回 child process

```javascript
const { exec } = require('child_process');

const childProcessTask = () => exec('date');

exports.default = childProcessTask;
```

#### 返回 observable

```javascript
const { of } = require('rxjs');

const observableTask = () => of(1, 2, 3);

exports.default = observableTask;
```

#### 使用 callback

如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。在如下示例中，callback 将作为唯一一个名为 cb() 的参数传递给你的任务（task）。

```javascript
const callbackTask = (cb) => {
  // `cb()` 应该由一些异步工作来调用
  cb();
};

exports.default = callbackTask;
```

如需通过 callback 把任务（task）中的错误告知 gulp，请将 Error 作为 callback 的唯一参数。

```javascript
const callbackError = (cb) => {
  // `cb()` 应该由一些异步工作来调用
  cb(new Error('error'));
};

exports.default = callbackError;
```

然而，你通常会将此 callback 函数传递给另一个 API ，而不是自己调用它。

```javascript
const fs = require('fs');

const passingCallback = (cb) => {
  fs.access('gulpfile.js', cb);
};

exports.default = passingCallback;
```

#### gulp 不再支持同步任务（Synchronous tasks）

gulp 不再支持同步任务（Synchronous tasks）了。因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。

当你看到 "Did you forget to signal async completion?" 警告时，说明你并未使用前面提到的返回方式。你需要使用 callback 或返回 stream、promise、event emitter、child process、observable 来解决此问题。

#### 使用 async/await

如果不使用前面提供到几种方式，你还可以将任务（task）定义为一个 async 函数，它将利用 promise 对你的任务（task）进行包装。这将允许你使用 await 处理 promise，并使用其他同步代码。

```javascript
const fs = require('fs');

const asyncAwaitTask = async () => {
  const { version } = JSON.parse(fs.readFileSync('package.json'));
  console.log(version, '版本号');
  await Promise.resolve('some result');
};

exports.default = asyncAwaitTask;
```

## 文件处理

gulp 暴露了 src() 和 dest() 方法用于处理计算机上存放的文件。

src() 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

由 src() 产生的流（stream）应当从任务（task）中返回并发出异步完成的信号，就如 [创建任务（task）](#createTask) 文档中所述。

流（stream）所提供的主要的 API 是 .pipe() 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。

```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

const streamJsTask = () =>
  src('src/js/*.js').pipe(babel()).pipe(dest('dist/js'));
exports.default = streamJsTask;
```

dest() 接受一个输出目录作为参数，并且它还会产生一个 Node 流（stream），通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。gulp 还提供了 symlink() 方法，其操作方式类似 dest()，但是创建的是链接而不是文件（ 详情请参阅 symlink() ）。

大多数情况下，利用 .pipe() 方法将插件放置在 src() 和 dest() 之间，并转换流（stream）中的文件。

### 向流（stream）中添加文件

src() 也可以放在管道（pipeline）的中间，以根据给定的 glob 向流（stream）中添加文件。新加入的文件只对后续的转换可用。如果 glob 匹配的文件与之前的有重复，仍然会再次添加文件。

这对于在添加普通的 JavaScript 文件之前先转换部分文件的场景很有用，添加新的文件后可以对所有文件统一进行压缩并混淆（uglifying）。

```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const streamAddJsTask = () =>
  src('src/js/*.js')
    .pipe(babel())
    .pipe(src('src/vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'));

exports.default = streamAddJsTask;
```

### 分阶段输出

dest() 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统。当接收到一个文件时，当前状态的文件将被写入文件系统，文件路径也将被修改以反映输出文件的新位置，然后该文件继续沿着管道（pipeline）传输。

此功能可用于在同一个管道（pipeline）中创建未压缩（unminified）和已压缩（minified）的文件。

```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const streamSegmentJsTask = () =>
  src('src/js/*.js')
    .pipe(babel())
    .pipe(src('src/vendor/*.js'))
    .pipe(dest('dist/js/'))
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(dest('dist/js/'));

exports.default = streamSegmentJsTask;
```

### 模式：流动（streaming）、缓冲（buffered）和空（empty）模式

src() 可以工作在三种模式下：缓冲（buffering）、流动（streaming）和空（empty）模式。这些模式可以通过对 src() 的 buffer 和 read [参数](https://www.gulpjs.com.cn/docs/api/src/#options) 进行设置。

缓冲（Buffering）模式是默认模式，将文件内容加载内存中。插件通常运行在缓冲（buffering）模式下，并且许多插件不支持流动（streaming）模式。
流动（Streaming）模式的存在主要用于操作无法放入内存中的大文件，例如巨幅图像或电影。文件内容从文件系统中以小块的方式流式传输，而不是一次性全部加载。如果需要流动（streaming）模式，请查找支持此模式的插件或自己编写。
空（Empty）模式不包含任何内容，仅在处理文件元数据时有用。

## [使用插件](https://www.gulpjs.com.cn/docs/getting-started/using-plugins/)

## [文件监控](https://www.gulpjs.com.cn/docs/getting-started/watching-files/)
