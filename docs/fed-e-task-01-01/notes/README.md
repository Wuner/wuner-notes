# 函数式编程与 JS 异步编程、手写 Promise

## 函数式编程

### 什么是函数式编程

函数式编程(Functional Programming, FP)，FP 是编程范式之一，我们常听说的编程范式还有面向过程编程、面向对象编程。

### 面向对象编程的思维方式

把现实世界中的事物抽象成程序世界中的类和对象，通过封装、继承和多态来演示事物事件的联系

### 函数式编程的思维方式

把现实世界的事物和事物之间的联系抽象到程序世界（对运算过程进行抽象）

#### 程序的本质

> 根据输入通过某种运算获得相应的输出，程序开发过程中会涉及很多有输入和输出的函数
> x -> f(联系、映射) -> y，y=f(x)

> 函数式编程中的函数指的不是程序中的函数(方法)，而是数学中的函数即映射关系，例如：y
> = sin(x)，x 和 y 的关系

> 相同的输入始终要得到相同的输出(纯函数)

> 函数式编程用来描述数据(函数)之间的映射

## 目录

- [函数是一等公民(First-class Function)](w-001-first-class-function)

- [高阶函数(Higher-order function)](w-002-higher-order-function)

- [闭包(Closure)](w-003-closure)

- [纯函数(Pure Functions)](w-004-pure-functions)

- [柯里化 (Haskell Brooks Curry)](w-005-curry)

- [函数组合(compose)](w-006-compose)

- [Point Free](w-007-point-free)

- [函子(Functor)](w-008-functor)

- [MayBe 函子](w-009-maybe)

- [Either 函子](w-010-either)

- [IO 函子](w-011-io)

- [Task 函子](w-012-task)

- [Monad 函子](w-013-monad)

- [Asynchronous 异步](w-014-asynchronous)

- [Synchronous 同步](w-015-synchronous)

- [Promise](w-016-promise)

- [Generator （生成器）](w-017-generator)

- [Async 函数](w-018-async-await)

- [手写 Promise](w-019-my-promise)

## 附录

- [函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html)

- [函数式编程入门](http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)

- [Pointfree 编程风格指南](http://www.ruanyifeng.com/blog/2017/03/pointfree.html)

- [图解 Monad](http://www.ruanyifeng.com/blog/2015/07/monad.html)

- [Functors, Applicatives, And Monads In Pictures](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
