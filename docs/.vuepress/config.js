const fs = require('fs');
const path = require('path');

const getTitle = (srcPath) => {
  let title = fs
    .readFileSync(path.join('docs', srcPath, 'README.md'), 'utf-8')
    .split('\n')[0]
    .replace('# ', '');
  if (title.includes('[')) {
    title = title.substring(title.indexOf('[') + 1, title.indexOf(']'));
  }
  dd;

  return title;
};

const dealWithFiles = (result) => {
  let files = [];
  result.forEach((value) => {
    switch (value.leave) {
      default:
        files.push(value.path);
        break;
      case 2:
        if (typeof files[files.length - 1] === 'string') {
          files[files.length - 1] = {
            title: getTitle(files[files.length - 1]),
            path: files[files.length - 1],
            children: [value.path],
            collapsable: false,
            sidebarDepth: 2,
          };
        } else {
          files[files.length - 1].children.push(value.path);
        }
        break;
      case 3:
        let children = files[files.length - 1].children;
        if (typeof children[children.length - 1] === 'string') {
          files[files.length - 1].children[children.length - 1] = {
            title: getTitle(children[children.length - 1]),
            path: children[children.length - 1],
            children: [value.path],
            collapsable: true,
            sidebarDepth: 2,
          };
        } else {
          files[files.length - 1].children[children.length - 1].children.push(
            value.path,
          );
        }
        break;
    }
  });

  return files;
};

const getQuestionsChildren = (srcPath) => {
  const result = readDirSync(path.join('docs', srcPath, 'code'));
  let files = dealWithFiles(result);
  files.unshift(srcPath);
  return files;
};

const getChildren = (srcPath) => dealWithFiles(readDirSync(srcPath));

const readDirSync = (dirPath, leave = 0) => {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach(function (file, index) {
    let leaveTe = leave;
    const info = fs.statSync(path.join(dirPath, file));
    if (info.isDirectory()) {
      result = result.concat(readDirSync(path.join(dirPath, file), ++leaveTe));
    } else {
      if (file.includes('.md') && !dirPath.includes('//'))
        result.push({
          path:
            dirPath
              .replace(/\\/g, '/')
              .replace(/\bdocs\//g, '/')
              .replace(/\/$/, '') + '/',
          leave,
        });
    }
  });
  return result;
};

module.exports = {
  title: 'Study Notes',
  description: 'the web study notes',
  base: '/wuner-notes/',
  themeConfig: {
    nav: [
      {
        text: 'Notes',
        items: [
          {
            text: 'JavaScript 深度剖析(1)',
            link: '/fed-e-task-01-01/notes/',
          },
          {
            text: 'JavaScript 深度剖析(2)',
            link: '/fed-e-task-01-02/notes/',
          },
          {
            text: '前端工程化(1)',
            link: '/fed-e-task-02-01/notes/',
          },
          {
            text: '前端工程化(2)',
            link: '/fed-e-task-02-02/notes/',
          },
        ],
      },
      {
        text: 'Questions',
        items: [
          {
            text: 'JavaScript 深度剖析(1) 题目',
            link: '/fed-e-task-01-01/',
          },
          {
            text: 'JavaScript 深度剖析(2) 题目',
            link: '/fed-e-task-01-02/',
          },
          {
            text: '前端工程化(1) 题目',
            link: '/fed-e-task-02-01/',
          },
          {
            text: '前端工程化(2) 题目',
            link: '/fed-e-task-02-02/',
          },
        ],
      },
    ],
    sidebar: {
      // notes
      '/fed-e-task-01-01/notes/': getChildren('docs/fed-e-task-01-01/notes/'),
      '/fed-e-task-01-02/notes/': getChildren('docs/fed-e-task-01-02/notes/'),
      '/fed-e-task-02-01/notes/': getChildren('docs/fed-e-task-02-01/notes/'),
      '/fed-e-task-02-02/notes/': getChildren('docs/fed-e-task-02-02/notes/'),
      // Questions
      '/fed-e-task-01-01/': getQuestionsChildren('/fed-e-task-01-01/'),
      '/fed-e-task-01-02/': getQuestionsChildren('/fed-e-task-01-02/'),
      '/fed-e-task-02-01/': getQuestionsChildren('/fed-e-task-02-01/'),
      '/fed-e-task-02-02/': getQuestionsChildren('/fed-e-task-02-02/'),
    },
  },
};
