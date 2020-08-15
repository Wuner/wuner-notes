# 练习

## 1、下面关于模板编译的描述中正确的是：

- A. 创建 Vue 实例的时候,如果同时设置了 template render 选项, render 选项指定的函数不会执行.
- B. Vue 中提供模板编译的目的是让初学者可以快速上手,用户只需要具备前端基础就以快速上手 Vue
- C. 单文维件的 template 模板在执行过程中会被编译成函数.
- D. 编译器的标是用来创建渲染函数, render 函数的做成是创建 Vnode 对象

## 2、下面关于模板编译的描述中正确的是：

- A. 模板编译的入口函数 compileToFunctions() 中的 parse 函数的作用是把模板解析成 AST 对象
- B. AST 对象称为抽象语法树，通过 AST 抽象语法树来描述 DOM 的树形结构，目的是基于 AST 优化生成的代码
- C. 模板编译的入口函数 compileToFunctions() 中的 optimize 函数的作用是标记 AST 中的静态根节点
- D. 静态根节点只的是标签中只包含纯文本内容，不可以有表达式

## 3、下面的描述中正确的是：

- A. 静态根节点不会被重新渲染，patch 的过程中会跳过静态根节点
- B. 模板编译的入口函数 compileToFunctions() 中的 generate 函数的作用是把优化后的 AST 转换成代码
- C. generate() 函数返回的 code 是编译之后的 render 函数，跟用户传入的 render 函数类似
- D. 模板和插值表达式在编译的过程中都会被转换成对应的代码形式，不会出现在 render 函数中

## 4、下面关于模块化的描述中正确的是：

- A .全局组件之所以可以在任意组件中使用是因为 Vue 构造函数的选项被合并到了 VueComponent 组件构造函数的选项中
- B .局部组件的使用范围被限制在当前组件内是因为，在创建当前组件的过程中传入的局部组件选项，其它位置无法访问
- C. generate() 函数返回的 code 是编译之后的 render 函数，跟用户传入的 render 函数类似
- D .在 createElement() 函数中调用 createComponent() 函数创建了组件对象。

## 答案解析

### 第 1 题

- 正确答案为：BD
- 答案解析：
  - A. 通过看 Vue 的入口文件可知，如果设置了 render 函数，则不会处理 lemPlate 模板
  - C. 单文件组件是在构建的过程中被编译成渲染函数的

### 第 2 题

- 正确答案为：ABC
- 答案解析：
  - D. 通过看源码可知，静态根节点是标签中除了文本内容以外，还需要包含其它标签

### 第 3 题

- 正确答案为：ABD
- 答案解析：
  - C. generate() 函数返回的是字符串形式的代码， 还需要 toFunctions()转换成函数的形式

### 第 4 题

- 正确答案为：AB
- 答案解析：
  - C.generate() 函数返回的是字符串形式的代码， 还需要 toFunctions() 转换成函数的形式
  - D.在 createElement() 函数中调用 createComponent()创建的是组件的 VNode。组件对象是在组件的 init 钩子函数中创建的， 然后在 patch() -->createElm() -->createComponent() 中挂载组件
