# 编程第三题

## 使用

```text
grunt build
grunt dev
grunt clean
...
```

## 详解 gruntfile.js

### 处理 html 文件

我们需要安装`grunt-swigtemplates`、`grunt-contrib-htmlmin`两个插件

首先我们使用 `grunt-swigtemplates` 编译 html，并将数据对象中的变量注入模板；后续我们将使用`grunt-contrib-htmlmin`，对 html 文件进行压缩

```javascript
swigtemplates: {
    options: {
        defaultContext: require('./data'),
        templatesDir: 'src',
    },
    build: {
        src: ['src/*.html'],
        dest: 'dest/',
    }
},
```

### 处理 scss 文件

我们需要安装`grunt-sass`、`grunt-contrib-cssmin`两个插件

首先我们使用 `grunt-sass` 编译 scss 文件，将 scss 转换为 css；后续我们将使用`grunt-contrib-cssmin`，对 css 文件进行压缩

```javascript
sass: {
    options: {
        implementation: sass,
        sourceMap: false,
        outputStyle: 'expanded',
    },
    build: {
        expand: true,
        ext: '.css',
        cwd: 'src/assets/styles',
        src: '*.scss',
        dest: 'dest/assets/styles'
    }
},
```

### 处理 js 文件

我们需要安装`@babel/core`、`@babel/preset-env`、`grunt-babel`、`grunt-contrib-uglify`四个插件

首先我们使用 `@babel/core`、`@babel/preset-env`、`grunt-babel` 编译 js 文件，将 es6 转换为 es5；后续我们将使用`grunt-contrib-uglify`，对 js 文件进行压缩

```javascript
babel: {
    options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
    },
    build: {
        expand: true,
        cwd: 'src/assets/scripts',
        src: '*.js',
        dest: 'dest/assets/scripts'
    }
},
```

### 处理 image 文件和字体文件

我们需要安装`grunt-contrib-imagemin`插件

我们使用 `grunt-contrib-imagemin`将图片文件进行压缩

```javascript
imagemin: {
    build: {
        expand: true,
        cwd: 'src/assets/images',
        src: '**',
        dest: 'dest/assets/images'
    },
    buildFont: {
        expand: true,
        cwd: 'src/assets/fonts',
        src: '**',
        dest: 'dest/assets/fonts'
    },
},
```

### 处理无需编译的文件

我们需要安装`grunt-contrib-copy`插件

将无需编译的文件直接复制到目标目录

```javascript
copy: {
    build: {
        expand: true,
        cwd: 'public',
        src: '**',
        dest: 'dest'
    }
},
```

### 资源合并

`grunt-usemin`这是一款可以将 HTML 引用的多个 CSS 和 JS 合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。
`grunt-usemin` 根据注释将 HTML 中需要合并压缩的区块找出来，并改写引用链接。
`grunt-usemin`不负责合并，不负责压缩！这里我们使用`useminPrepare`任务，
该任务解析 HTML 标记以查找每个块，并在 type = js 时，为`concat`、`uglify`任务初始化相应的 Grunt 配置，在 type = css 时，初始化`concat`、`cssmin`任务。
不需要在`initConfig`里配置`concat`、`uglify`、`cssmin`这三个任务

```javascript
// 资源合并
useminPrepare: {
    html: 'dest/*.html',
    options: {
        dest: 'dest',
        root: ['dest', '.']
    }
},
// 资源合并
usemin: {
    html: 'dest/*.html',
},
```

### [浏览器同步测试工具](http://www.browsersync.cn/docs/options/)

安装`grunt-browser-sync`、`grunt-contrib-watch`

使用`grunt-browser-sync`，我们的任何一次代码保存，浏览器都会同时显示我们的改动，提供我们的开发效率

我们也将使用 `grunt-contrib-watch` 任务，监听文件变化时，对其进行编译处理

执行任务时，watch 必须在 browserSync 之后执行

```javascript
browserSync: {
    build: {
        open: false,
        notify: false,
        bsFiles: {
            src: ['dest', 'src', 'public']
        },
        options: {
            watchTask: true,
            server: {
                baseDir: ['dest', 'src', 'public'],
                routes: {
                    "/node_modules": "node_modules"
                }
            }
        }
    }
},
watch: {
    bulidScss: {
        files: 'src/assets/styles/*.scss',
        tasks: ['sass']
    },
    bulidJs: {
        files: 'src/assets/scripts/*.js',
        tasks: ['babel']
    }
},
```

### 删除目录

使用 `grunt-contrib-clean` 插件，我们在编译前，将原先编译后的文件目录删除

```javascript
 clean: {
    build: {
        src: ['dest', '.tmp']
    }
},
```

### [完整示例](https://gitee.com/HeathHwn/wuner-notes/blob/master/docs/fed-e-task-02-01/code/question-3/gruntfile.js)

```javascript
module.exports = (grunt) => {
  // 在这里写与grunt有关的功能
  const sass = require('node-sass');

  require('load-grunt-tasks')(grunt);
  // 项目配置
  grunt.initConfig({
    // 删除目录
    clean: {
      build: {
        src: ['dest', '.tmp'],
      },
    },
    // 将无需编译的文件直接复制到目标目录
    copy: {
      build: {
        expand: true,
        cwd: 'public',
        src: '**',
        dest: 'dest',
      },
    },
    // 将es6转换为es5
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env'],
      },
      build: {
        expand: true,
        cwd: 'src/assets/scripts',
        src: '*.js',
        dest: 'dest/assets/scripts',
      },
    },
    // 将scss转换为css
    sass: {
      options: {
        implementation: sass,
        sourceMap: false,
        outputStyle: 'expanded',
      },
      build: {
        expand: true,
        ext: '.css',
        cwd: 'src/assets/styles',
        src: '*.scss',
        dest: 'dest/assets/styles',
      },
    },
    // 编译html，并将数据对象中的变量注入模板
    swigtemplates: {
      options: {
        defaultContext: require('./data'),
        templatesDir: 'src',
      },
      build: {
        src: ['src/*.html'],
        dest: 'dest/',
      },
    },
    // 压缩图片
    imagemin: {
      build: {
        expand: true,
        cwd: 'src/assets/images',
        src: '**',
        dest: 'dest/assets/images',
      },
      buildFont: {
        expand: true,
        cwd: 'src/assets/fonts',
        src: '**',
        dest: 'dest/assets/fonts',
      },
    },
    // 资源合并
    useminPrepare: {
      html: 'dest/*.html',
      options: {
        dest: 'dest',
        root: ['dest', '.'],
      },
    },
    // 资源合并
    usemin: {
      html: 'dest/*.html',
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
      build: {
        expand: true,
        cwd: 'dest',
        src: '*.html',
        dest: 'dest',
      },
    },
    // 监听文件变化，对其进行编译处理
    watch: {
      bulidScss: {
        files: 'src/assets/styles/*.scss',
        tasks: ['sass'],
      },
      bulidJs: {
        files: 'src/assets/scripts/*.js',
        tasks: ['babel'],
      },
    },
    // 浏览器同步测试工具
    browserSync: {
      build: {
        open: false,
        notify: false,
        bsFiles: {
          src: ['dest', 'src', 'public'],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: ['dest', 'src', 'public'],
            routes: {
              '/node_modules': 'node_modules',
            },
          },
        },
      },
    },
  });

  // 三个任务编译，互不干扰，不分前后顺序
  grunt.registerTask('compile', ['babel', 'swigtemplates', 'sass']);

  // 'copy', 'compile', 'imagemin'，这三个任务执行，互不干扰，不分前后顺序
  // 必须先执行'compile'任务后，依次执行'useminPrepare'、'concat'、'cssmin'、 'uglify'、 'usemin'、 'htmlmin'任务
  grunt.registerTask('build', [
    'clean',
    'copy',
    'compile',
    'imagemin',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin',
  ]);
  // 必须先执行'compile'任务后，才能'browserSync'任务
  // 切记'watch'不能在'browserSync'任务之前执行
  grunt.registerTask('dev', ['clean', 'compile', 'browserSync', 'watch']);
};
```
