# 编程第一题

## 脚手架目录结构

```
└───template/..........................模板目录
    ├───src/...........................src目录
    │   └───assets/...................资源目录
    │       └───css/..................样式文件目录
    │       └───fonts/................字体资源目录
    │       └───./images/...............图片目录
    │       └───scripts/..............js目录
    │   └───index.html................html文件
    └───static/.......................无需编译的静态资源目录
    └───gulpfile.js...................gulp配置文件
    └───package.json..................模块包配置文件
├───.gitignore........................git忽略文件
├───cli.js............................脚手架文件
├───package.json......................模块包配置文件
```

## 目的

- 提高开发生产效率
- 规范开发，提高代码质量
- 利于多人协同开发
- 利于项目维护

## 脚手架介绍

这款小型脚手架工具，提供了 PC 端与移动端的开发模板；提供了 css 预处理器；提供了 gulp 自动化构建

## [项目 git 仓库](https://gitee.com/wuner/node-wuner)

## 脚手架安装

```
npm i node-wuner -g
```

## 脚手架使用

```
node-wuner
```

## 用户交互

![image](./images/1.png)

- projectName

  > 项目名称

- description

  > 项目描述

- author

  > 作者

- license

  > 许可证

- deviceType

  > 设备类型

  可选项

  - PC
  - Mobile

- cssPreprocessors

  > css 预处理

  可选项

  - less
  - scss
  - css

- autoInstall

  > 创建项目后，是否要执行插件安装

  可选项

  - Npm
  - Yarn
  - No, I will handle that myself

## 详解 cli.js

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const inquirer = require('inquirer');
const spawn = require('child_process').spawn;

inquirer
  .prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'project name:',
      default: 'my-project',
    },
    {
      type: 'input',
      name: 'description',
      message: 'project description:',
    },
    {
      type: 'input',
      name: 'author',
      message: 'author:',
    },
    {
      type: 'rawlist',
      name: 'license',
      choices: ['ISC', 'MIT'],
      message: 'license:',
    },
    {
      type: 'rawlist',
      name: 'deviceType',
      choices: ['PC', 'Mobile'],
      message: 'Types of devices:',
    },
    {
      type: 'rawlist',
      name: 'cssPreprocessors',
      choices: ['less', 'scss', 'css'],
      message: 'CSS Preprocessors:',
    },
    {
      type: 'rawlist',
      name: 'autoInstall',
      choices: [
        { name: 'use Npm', value: 'npm' },
        { name: 'use Yarn', value: 'yarn' },
        { name: 'No, I will handle that myself', value: 'no' },
      ],
      message:
        'Should we run `npm install` or `yarn` for you after the project has been created ?',
    },
  ])
  .then((answers) => {
    // 模板目录
    const templateDir = path.join(__dirname, 'template');
    // 目标目录
    const destDir = path.join(process.cwd(), answers.projectName);
    // 判断项目是否已存在，存在则抛出异常
    if (fs.existsSync(destDir)) {
      throw Error('Project already exists');
    }
    // 创建文件夹
    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) throw err;
      // 将模板下的文件全部转到目标目录
      readFile(templateDir, destDir, answers);
    });
    // 根据用户选择的命令，执行对应的命令脚本
    switch (answers.autoInstall) {
      case 'npm':
        runCmd(
          process.platform === 'win32' ? 'npm.cmd' : 'npm',
          ['install'],
          destDir,
        );
        break;
      case 'yarn':
        runCmd(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], destDir);
        break;
      case 'no':
        console.log('Successful project initialization');
        break;
    }
  });

const readFile = (srcPath, destDir, answers) => {
  fs.readdir(srcPath, (err, files) => {
    // 抛出异常
    if (err) throw err;
    // 遍历文件
    files.forEach((file) => {
      //拼接路径
      const fPath = path.join(srcPath, file);
      fs.stat(fPath, (err, stat) => {
        //stat 状态中有两个函数一个是stat中有isFile ,isisDirectory等函数进行判断是文件还是文件夹
        if (stat.isFile()) {
          if (destDir.includes('images')) {
            // 读取文件流
            const readStreame = fs.createReadStream(fPath);
            // 写入文件流
            const writeStreame = fs.createWriteStream(path.join(destDir, file));
            // 把读取出来的文件流导入写入文件流
            readStreame.pipe(writeStreame); // 写入
          } else {
            // 通过模板引擎渲染文件
            ejs.renderFile(fPath, answers, (err, result) => {
              // 将结果写入目标目录
              if (err) throw err;
              // 判断是否是css文件夹，写入对应的样式文件
              if (destDir.includes('css')) {
                if (path.extname(file) === `.${answers.cssPreprocessors}`) {
                  fs.writeFileSync(path.join(destDir, file), result);
                }
              } else {
                fs.writeFileSync(path.join(destDir, file), result);
              }
            });
          }
        } else {
          // 拼接目标路径
          const dDir = path.join(destDir, file);
          // 创建目标文件夹
          fs.mkdir(dDir, { recursive: true }, (err) => {
            if (err) throw err;
            // 自调用
            readFile(fPath, dDir, answers);
          });
        }
      });
    });
  });
};
// 使用child_process（子进程），执行cmd命令
const runCmd = (command, args, destDir) => {
  spawn(
    command,
    args,
    { stdio: 'inherit', cwd: destDir },
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Successful project initialization');
      }
    },
  );
};
```
