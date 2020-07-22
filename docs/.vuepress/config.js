const fs = require('fs');
const path = require('path');

module.exports = {
  title: 'Study Notes',
  description: 'the web study notes',
  base: '/wuner-notes/',
  themeConfig: {
    nav: [
      {
        text: 'note',
        items: [
          {
            text: 'part·1 module-1',
            link: '/fed-e-task-01-01/notes/',
          },
          {
            text: 'part·1 module-2',
            link: '/fed-e-task-01-02/notes/',
          },
          {
            text: 'part·2 module-1',
            link: '/fed-e-task-02-01/notes/',
          },
          {
            text: 'part·2 module-2',
            link: '/fed-e-task-02-02/notes/',
          },
        ],
      },
    ],
    sidebar: {
      '/fed-e-task-01-01/notes/': [
        {
          title: 'part·1 module-1',
          collapsable: false,
          children: getChildren('docs/fed-e-task-01-01/notes/'),
        },
      ],
      '/fed-e-task-01-02/notes/': [
        {
          title: 'part·1 module-2',
          collapsable: false,
          children: getChildren('docs/fed-e-task-01-02/notes/'),
        },
      ],
      '/fed-e-task-02-01/notes/': [
        {
          title: 'part·2 module-1',
          collapsable: false,
          children: getChildren('docs/fed-e-task-02-01/notes/'),
        },
      ],
      '/fed-e-task-02-02/notes/': [
        {
          title: 'part·2 module-2',
          collapsable: false,
          children: getChildren('docs/fed-e-task-02-02/notes/'),
        },
      ],
    },
  },
};

function getChildren(path) {
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
}

function readDirSync(dirPath) {
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
  console.log(result);
  return result;
}
