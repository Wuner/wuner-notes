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
