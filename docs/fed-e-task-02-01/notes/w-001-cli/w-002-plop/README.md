# [Plop](https://plopjs.com/)

- 将 Polo 模块作为项目开发依赖安装
- 在项目根目录下创建一个`plopfile.js`文件
- 在`plopfile.js`文件中定义脚手架任务
- 编写用于生成特定类型文件的模板
- 通过 plop 提供的 cli 运行脚手架任务

## 安装

将 plop 安装到你的项目

```text
npm i plop -D
```

将 plop 安装到全局

```text
npm i plop -g
```

## 用法

在你的项目根目录创建`plopfile.js`

```javascript
module.exports = (plop) => {
  // create your generators here
  plop.setGenerator('component', {
    description: 'this is a skeleton plopfile',
    prompts: [
      {
        type: 'input',
        name: 'name',
        default: 'my-component',
      },
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/index.js',
        templateFile: 'plop-templates/component.js.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/index.less',
        templateFile: 'plop-templates/component.less.hbs',
      },
    ], // array of actions
  });
};
```

这里使用[handlebar](https://handlebarsjs.com/)

创建 plop-templates/component.js.hbs

```text
<template>
  <div class="{{name}}"></div>
</template>

<script>
export default {
  name: '{{name}}',
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {},
};
</script>
<style scoped lang="less">
@import '{{name}}';
</style>
```

创建 plop-templates/component.less.hbs

```text
.{{name}} {
    position:absolute;
    width: 100%;
    min-height: 100%;
    background-color: #f4f4f4;
}
```
