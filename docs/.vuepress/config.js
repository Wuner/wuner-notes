const fs = require('fs');
const path = require('path');

const getTitle = (srcPath) => {
  let contentList = fs
    .readFileSync(path.join('docs', srcPath, 'README.md'), 'utf-8')
    .split('\n');
  let title = contentList[0].replace('# ', '');
  if (title.includes('[')) {
    title = title.substring(title.indexOf('[') + 1, title.indexOf(']'));
  }
  return { title, isLink: contentList.length > 1 };
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
          let titleObj = getTitle(files[files.length - 1]);
          files[files.length - 1] = {
            title: titleObj.title,
            path: titleObj.isLink ? files[files.length - 1] : undefined,
            children: [value.path],
            collapsable: true,
            sidebarDepth: 2,
          };
        } else {
          files[files.length - 1].children.push(value.path);
        }
        break;
      case 3:
        let children = files[files.length - 1].children;
        if (typeof children[children.length - 1] === 'string') {
          let titleObj = getTitle(children[children.length - 1]);
          files[files.length - 1].children[children.length - 1] = {
            title: titleObj.title,
            path: titleObj.isLink ? children[children.length - 1] : undefined,
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
      case 4:
        let children2 = files[files.length - 1].children;
        let children3 = children2[children2.length - 1].children;
        if (typeof children3[children3.length - 1] === 'string') {
          let titleObj = getTitle(children3[children3.length - 1]);
          files[files.length - 1].children[children2.length - 1].children[
            children3.length - 1
          ] = {
            title: titleObj.title,
            path: titleObj.isLink ? children3[children3.length - 1] : undefined,
            children: [value.path],
            collapsable: true,
            sidebarDepth: 2,
          };
        } else {
          files[files.length - 1].children[children2.length - 1].children[
            children3.length - 1
          ].children.push(value.path);
        }
        break;
    }
  });

  return files;
};

const getQuestionsChildren = (srcPath) => {
  let files = [];
  try {
    const result = readDirSync(path.join('docs', srcPath, 'code'));
    files = dealWithFiles(result);
    files.unshift(srcPath);
  } catch (e) {
    console.log(e);
  }

  return files;
};

const getChildren = (srcPath) => dealWithFiles(readDirSync(srcPath));

const readDirSync = (dirPath, leave = 0) => {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach(function (file) {
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

const keywords = [
  'Study Notes',
  'Wuner',
  'Vue',
  '前端学习笔记',
  '函数式编程',
  'Promise',
  'ES6+',
  'TypeScript',
  'JS性能优化',
  'cli',
  '脚手架',
  '自动化构建',
  'yeoman',
  'plop',
  'gulp',
  'grunt',
  'ESModule',
  'webpack',
  'rollup',
  'lint',
  'vue-router',
  'vue-observe',
  'virtual-dom',
  '虚拟dom',
  'vue源码解析',
  'vue响应式原理',
  'vue虚拟dom',
  'vue模板编译',
  'vue组件化',
  'vue状态管理(vuex)',
  '服务端渲染(ssr)',
  'nuxtJs',
  '搭建SSR',
];

const items = [
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
  {
    text: 'Vue.js 框架源码与进阶(1)',
    link: '/fed-e-task-03-01/notes/',
  },
  {
    text: 'Vue.js 框架源码与进阶(2)',
    link: '/fed-e-task-03-02/notes/',
  },
  {
    text: 'Vue.js 框架源码与进阶(3)',
    link: '/fed-e-task-03-03/notes/',
  },
  {
    text: 'Vue.js 框架源码与进阶(4)',
    link: '/fed-e-task-03-04/notes/',
  },
  {
    text: 'Vue.js 框架源码与进阶(5)',
    link: '/fed-e-task-03-05/notes/',
  },
];

const createSidebar = () => {
  let obj = {};
  for (let item of items) {
    let qLink = item.link.replace('notes/', '');
    obj[item.link] = getChildren(`docs${item.link}`);
    obj[qLink] = getQuestionsChildren(qLink);
  }
  return obj;
};

module.exports = {
  title: 'Study Notes',
  description: '大前端学习笔记',
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content: keywords.join(','),
      },
    ],
  ],
  base: '/wuner-notes/',
  themeConfig: {
    algolia: {
      apiKey: 'aac02626df262080e66689b38d46091b',
      indexName: 'wuner-notes',
      algoliaOptions: {
        hitsPerPage: 10,
      },
    },
    sidebarDepth: 2,
    nav: [
      {
        text: '博客',
        link: 'https://blog.csdn.net/qq_32090185',
      },
      {
        text: '笔记',
        items,
      },
      {
        text: '题目',
        items: items.map(({ text, link }) => {
          link = link.replace('notes/', '');
          return { text, link };
        }),
      },
      {
        text: '面试题',
        link: '/interview-questions/w-001-js-base/',
      },
    ],
    sidebar: Object.assign({}, createSidebar(), {
      '/interview-questions/': getChildren('docs/interview-questions/'),
    }),
  },
  plugins: [
    [
      'copyright',
      {
        authorName: {
          'en-US': 'Wuner',
          'zh-CN': 'Wuner',
        },
        minLength: 20,
        clipboardComponent: path.resolve(
          __dirname,
          'components/ClipboardComponent.vue',
        ),
      },
    ],
    [
      'vuepress-plugin-medium-zoom',
      {
        selector: 'img',
        options: {
          background: 'rgba(0,0,0,0.7)',
          scrollOffset: 0,
        },
      },
    ],
    [
      'vuepress-plugin-code-copy',
      {
        align: 'top',
        successText: '已复制',
        color: '#fff',
      },
    ],
  ],
  markdown: { lineNumbers: true, extractHeaders: ['h2', 'h3', 'h4'] },
};
