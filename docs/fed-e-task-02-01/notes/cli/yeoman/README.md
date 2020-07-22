# yeoman

现代 Web 应用程序的 Web 脚手架工具

- 全局安装 yo

```text
npm i yo -g
```

- 安装对应的 generator
  这里安装[generator-none](https://github.com/yeoman/generator-node)

```text
npm i generator-node -g
```

- 通过 yo 运行 generator

```text
mkdir my-module
cd my-module
yo node
```

- 子生成器使用

如果不需要主生成器提供的所有功能，则仍可以通过直接与子生成器组合来使用。

可以通过运行下面的命令来查看每个子生成器的选项。

```text
yo node:sub --help
```

这里我们使用 node:cli 子生成器

```cmd
yo node:cli
```

link 到全局

```cmd
npm link
```

查看是否 link 到全局

```cmd
my-module --help
```

## yeoman 使用步骤总结

- 1、明确你的需求
- 2、找到合适的 Generator
- 3、全局安装 Generator
- 4、通过 yo 运行对应的 Generator
- 5、通过命令行交互填写选项
- 6、生成你所需要的项目结构

## 自定义 Generator

生成器的核心是 Node.js 模块。

首先，创建一个文件夹，在其中编写 generator。 该文件夹必须命名为 generator-name（其中 name 是你的生成器的名称）。 这一点很重要，因为 Yeoman 依靠文件系统来查找可用的生成器。

进入 Generator 文件夹后，创建一个 package.json 文件。 该文件是 Node.js 模块清单。 你可以通过从命令行运行 npm init 或手动输入以下内容来生成此文件：

```json
{
  "name": "generator-name",
  "version": "0.1.0",
  "description": "",
  "files": ["generators"],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

name 属性必须以 generator-为前缀。 关键字属性必须包含`yeoman-generator`，并且存储库必须具有要由我们的 [generators](https://yeoman.io/generators/) 页面建立索引的描述。

你应该确保将最新版本的 yeoman-generator 设置为依赖项。 你可以通过运行以下命令执行此操作：

```text
npm install --save yeoman-generator
```

files 属性必须是生成器使用的文件和目录的数组。

根据需要添加其他 package.json 属性。

### Generator 目录结构

Yeoman 的功能取决于你如何构建目录树。 每个子生成器都包含在其自己的文件夹中。

调用你的名字时使用的默认生成器是应用生成器。 它必须包含在`app/`目录中。

调用`yo name:subcommand` 时使用的子生成器存储在与 sub 命令完全相同的文件夹中。

在一个示例项目中，目录树可能如下所示：

```text
└───generators/........................生成器目录
    ├───app/...........................默认生成器目录
    │   └───index.js..................默认生成器实现
    └───router/........................其他生成器目录
        └───index.js...................其他生成器实现
├───package.json.......................模块包配置文件
```

该生成器将显示`yo name` 和`yo name:router` 命令。

Yeoman 允许两种不同的目录结构。 它会在`./`和`generators/`中查找以注册可用的生成器。

前面的示例也可以编写如下：

```text
├───app/...............................默认生成器目录
│   └───index.js......................默认生成器实现
└───router/............................其他生成器目录
    └───index.js.......................其他生成器实现
├───package.json.......................模块包配置文件
```

如果使用第二个目录结构，请确保将 files 属性指向 package.json 所有生成器文件夹。

```json
{
  "files": ["app", "router"]
}
```

### 扩展 Generator

有了此结构后，就可以编写实际的生成器了。

Yeoman 提供了一个基本生成器，你可以扩展它来实现自己的行为。 该基本生成器将添加你希望简化任务的大多数功能。

在生成器的`index.js` 文件中，以下是扩展基本生成器的方法：

```javascript
const Generator = require('yeoman-generator');

module.exports = class extends Generator {};
```

我们将扩展的生成器分配给 module.exports 以使其可用于生态系统。 这就是我们在 Node.js 中导出模块的方式。

### 覆盖构造函数

某些生成器方法只能在构造函数内部调用。 这些特殊方法可能会执行诸如设置重要状态控件之类的操作，并且可能无法在构造函数之外运行。

要覆盖生成器构造函数，请添加一个构造函数方法，如下所示：

```javascript
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name`constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a`--babel` flag
  }
};
```

### 添加功能

调用生成器后，添加到原型的每种方法都会运行，并且通常是按顺序进行的。 但是，正如我们将在下一节中看到的那样，一些特殊的方法名称将触发特定的运行顺序。

示例：

```javascript
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
};
```

当我们运行生成器时，将在控制台看到日志输出。

示例二：

```javascript
// 此文件作为Generator的核心入口
// 需要导出一个继承自Yeoman Generator的类型
// Yeoman Generator在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以调用父类提供的一些工具方法来实现一些功能，例如文件写入
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // Yeoman 自动在生成文件阶段调用次方法
  writing() {
    // Generator将文件写入本地的方法
    // 调用Generator的fs中的write方法来写入文件  第一个参数为写入的绝对路径，第二个参数为写入内容
    this.fs.write(this.destinationPath('temp.txt'), '1231');
  }
};
```

### 运行 generator

接下来我们将运行 generator，看看它是否有效。

由于我是在本地开发生成器，因此尚未作为全局 npm 模块提供。 可以使用 npm 创建一个全局模块并将其符号链接到本地模块。

在文件夹根目录下，执行：

```text
npm link
```

## [文件系统的使用](https://yeoman.io/authoring/file-system.html)

### 位置上下文和路径

Yeoman 文件实用程序基于这样一个理念：磁盘上总是有两个位置有上下文。这些上下文是生成器最有可能读取和写入的文件夹。

#### 目标上下文

第一个上下文是目标上下文。 目标是 Yeoman 将在其中存放新应用程序的文件夹。 这是你的用户项目文件夹，你将在其中编写大多数脚手架。

目标上下文定义为当前工作目录或包含`.yo-rc.json` 文件的最近的父文件夹。`.yo-rc.json` 文件定义了 Yeoman 项目的根目录。 该文件允许你的用户在子目录中运行命令并使它们在项目上运行。 这样可以确保最终用户的行为一致。

你可以使用`this.destinationRoot()`或通过使用`this.destinationPath('sub/path')`联接路径来获取目标路径。

```text
// Given destination root is ~/projects
class extends Generator {
  paths() {
    this.destinationRoot();
    // returns '~/projects'

    this.destinationPath('index.js');
    // returns '~/projects/index.js'
  }
}
```

#### 模板上下文

模板上下文是用于存储模板文件的文件夹。 通常是你要从中读取和复制的文件夹。

默认情况下，模板上下文定义为`./templates/`。 你可以使用`this.sourceRoot('new/template/path')`覆盖此默认值。

你可以使用`this.sourceRoot()`或通过使用`this.templatePath('app/index.js')`连接路径来获取路径值。

```text
class extends Generator {
  paths() {
    this.sourceRoot();
    // returns './templates'

    this.templatePath('index.js');
    // returns './templates/index.js'
  }
};
```

#### “内存中”文件系统

Yeoman 在覆盖用户文件时非常小心。 基本上，在预先存在的文件上发生的每个写入都将经历冲突解决过程。 此过程要求用户验证将内容覆盖到其文件的每个文件写入。

此行为可防止出现意外情况并限制发生错误的风险。 另一方面，这意味着每个文件都异步写入磁盘。

由于异步 API 难以使用，因此 Yeoman 提供了一个同步文件系统 API，其中每个文件都被写入[内存文件系统](https://github.com/sboudrias/mem-fs)，并且只有在 Yeoman 完成运行后才被写入磁盘。

此内存文件系统在所有[组合的生成器](https://yeoman.io/authoring/composability.html)之间共享。

#### 文件工具

生成器在`this.fs`上公开了所有文件方法，此文件是 [mem-fs-editor](https://github.com/sboudrias/mem-fs-editor)-确保检查模块文档中所有可用的方法。

值得注意的是，尽管`this.fs`公开了`commit`，但您不应在生成器中调用它。 在运行循环的冲突阶段之后，Yeoman 在内部调用此方法。

#### 示例：复制模板文件

这是我们要复制和处理模板文件的示例。

文件路径`app/templates/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title><%= Title %></title>
  </head>
  <body></body>
</html>
```

然后，在将内容作为模板处理时，我们使用[copyTpl](https://github.com/sboudrias/mem-fs-editor#copytplfrom-to-context-templateoptions--copyoptions)方法复制文件。`copyTpl` 使用 [ejs 模板语法](https://ejs.co/)。

```text
class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
}
```

一种非常常见的情况是在提示阶段存储用户输入，并将其用于模板：

```text
class extends Generator {
  async prompting() {
    this.answers = await this.prompt([{
      type    : 'input',
      name    : 'title',
      message : 'Your project title',
    }]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title } // user answer `title` used
    );
  }
}
```
