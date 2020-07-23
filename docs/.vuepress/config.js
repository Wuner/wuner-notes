const fs = require('fs');
const path = require('path');

const getQuestionsChildren = (srcPath) => {
  const result = readDirSync(path.join('docs', srcPath, 'code'));
  result.unshift(srcPath);
  console.log(result);
  return result;
};

const getChildren = (path) => {
  const result = readDirSync(path);
  let root = '';
  let files = result.filter((value) => {
    if (value.includes('//')) {
      root = value.replace(/\/\//g, '/');
    }
    return !value.includes('//');
  });
  files.unshift(root);
  return files;
};

const readDirSync = (dirPath) => {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach(function (file, index) {
    const info = fs.statSync(path.join(dirPath, file));
    if (info.isDirectory()) {
      result = result.concat(readDirSync(path.join(dirPath, file)));
    } else {
      if (file.includes('.md') && !dirPath.includes('//'))
        result.push(
          dirPath.replace(/\\/g, '/').replace(/\bdocs\//g, '/') + '/',
        );
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
      '/fed-e-task-01-01/notes/': [
        {
          title: 'JavaScript 深度剖析(1)',
          collapsable: false,
          children: getChildren('docs/fed-e-task-01-01/notes/'),
        },
      ],
      '/fed-e-task-01-02/notes/': [
        {
          title: 'JavaScript 深度剖析(2)',
          collapsable: false,
          children: getChildren('docs/fed-e-task-01-02/notes/'),
        },
      ],
      '/fed-e-task-02-01/notes/': [
        {
          title: '前端工程化(1)',
          collapsable: false,
          children: getChildren('docs/fed-e-task-02-01/notes/'),
        },
      ],
      '/fed-e-task-02-02/notes/': [
        {
          title: '前端工程化(2)',
          collapsable: false,
          children: getChildren('docs/fed-e-task-02-02/notes/'),
        },
      ],
      // Questions
      '/fed-e-task-01-01/': [
        {
          title: 'JavaScript 深度剖析(1) 题目',
          collapsable: false,
          children: getQuestionsChildren('/fed-e-task-01-01/'),
        },
      ],
      '/fed-e-task-01-02/': [
        {
          title: 'JavaScript 深度剖析(2) 题目',
          collapsable: false,
          children: getQuestionsChildren('/fed-e-task-01-02/'),
        },
      ],
      '/fed-e-task-02-01/': [
        {
          title: '前端工程化(1) 题目',
          collapsable: false,
          children: getQuestionsChildren('/fed-e-task-02-01/'),
        },
      ],
      '/fed-e-task-02-02/': [
        {
          title: '前端工程化(2) 题目',
          collapsable: false,
          children: getQuestionsChildren('/fed-e-task-02-02/'),
        },
      ],
    },
  },
};
