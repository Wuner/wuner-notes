# Git Hooks

## 案例

使用 git 钩子，在 commit 前校验代码，并格式化代码

### 安装

- [husky](https://www.npmjs.com/package/husky)

  husky 是一个 Git Hook 工具

- [lint-staged](https://github.com/okonet/lint-staged#readme)

  lint-staged 是一个在 git 暂存文件上（也就是被 git add 的文件）运行已配置的 eslint（或其他）任务。lint-staged 将所有暂存文件的列表传递给任务。

```
npm i husky lint-staged -D
```

### 配置

1. husky
   `package.json`

```json
{
  "name": "wuner-notes",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```
