# Template String(模板字符串)

模板字面量 是允许嵌入表达式的字符串字面量。你可以使用多行字符串和字符串插值功能。它们在 ES2015 规范的先前版本中被称为“模板字符串”。

## 描述

模板字符串使用反引号 (``) 来代替普通字符串中的用双引号和单引号。模板字符串可以包含特定语法（\${expression}）的占位符。占位符中的表达式和周围的文本会一起传递给一个默认函数，该函数负责将所有的部分连接起来，如果一个模板字符串由表达式开头，则该字符串被称为带标签的模板字符串，该表达式通常是一个函数，它会在模板字符串处理后被调用，在输出最终结果前，你都可以通过该函数来对模板字符串进行操作处理。在模版字符串内使用反引号（`）时，需要在它前面加转义符（\）。

```javascript
`\`` === '`'; // --> true
```

> 多行字符串

在新行中插入的任何字符都是模板字符串中的一部分，使用普通字符串，你可以通过以下的方式获得多行字符串：

```javascript
console.log('string text line 1\n' + 'string text line 2');
// "string text line 1
// string text line 2"
```

要获得同样效果的多行字符串，只需使用如下代码：

```javascript
console.log(`string text line 1
string text line 2`);
// "string text line 1
// string text line 2"
```

> 插入表达式

在普通字符串中嵌入表达式，必须使用如下语法：

```javascript
const a = 5;
const b = 10;
console.log('Fifteen is ' + (a + b) + ' and\nnot ' + (2 * a + b) + '.');
// "Fifteen is 15 and
// not 20."
```

现在通过模板字符串，我们可以使用一种更优雅的方式来表示：

```javascript
const a = 5;
const b = 10;
console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."
```

> 带标签的模板字符串

更高级的形式的模板字符串是带标签的模板字符串。标签使您可以用函数解析模板字符串。标签函数的第一个参数包含一个字符串值的数组。其余的参数与表达式相关。最后，你的函数可以返回处理好的的字符串（或者它可以返回完全不同的东西 , 如下个例子所述）。用于该标签的函数的名称可以被命名为任何名字。

```javascript
const person = 'Mike';
const age = 28;

function myTag(strings, personExp, ageExp) {
  const str0 = strings[0]; // "that "
  const str1 = strings[1]; // " is a "

  let ageStr;
  if (ageExp > 99) {
    ageStr = 'centenarian';
  } else {
    ageStr = 'youngster';
  }

  return str0 + personExp + str1 + ageStr;
}

const output = myTag`that ${person} is a ${age}`;

console.log(output);
// that Mike is a youngster
```

正如下面例子所展示的，标签函数并不一定需要返回一个字符串。

```javascript
function template(strings, ...keys) {
  return function (...values) {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach(function (key, i) {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

const t1Closure = template`${0}${1}${0}!`;
console.log(t1Closure('Y', 'A')); // "YAY!"
const t2Closure = template`${0} ${'foo'}!`;
console.log(t2Closure('Hello', { foo: 'World' })); // "Hello World!"
```

> 原始字符串

在标签函数的第一个参数中，存在一个特殊的属性 raw ，我们可以通过它来访问模板字符串的原始字符串，而不经过特殊字符的替换。

```javascript
function tag(strings) {
  return strings.raw[0];
}

console.log(tag`string text line 1 \n string text line 2`);
// logs "string text line 1 \n string text line 2" ,
```

> 带标签的模版字面量及转义序列

自 ES2016 起，带标签的模版字面量遵守以下转义序列的规则：

- Unicode 字符以"\u"开头，例如\u00A9
- Unicode 码位用"\u{}"表示，例如\u{2F804}
- 十六进制以"\x"开头，例如\xA9
- 八进制以"\"和数字开头，例如\251

这表示类似下面这种带标签的模版是有问题的，因为对于每一个 ECMAScript 语法，解析器都会去查找有效的转义序列，但是只能得到这是一个形式错误的语法：

```javascript
function latex(str) {
  return { cooked: str[0], raw: str.raw[0] };
}
latex`\unicode`;
// 在较老的ECMAScript版本中报错（ES2016及更早）
// SyntaxError: malformed Unicode character escape sequence
```

ES2018 关于非法转义序列的修订

带标签的模版字符串应该允许嵌套支持常见转义序列的语言（例如 DSLs、LaTeX）。ECMAScript 提议模版字面量修订(第 4 阶段，将要集成到 ECMAScript 2018 标准) 移除对 ECMAScript 在带标签的模版字符串中转义序列的语法限制。

不过，非法转义序列在"cooked"当中仍然会体现出来。它们将以 undefined 元素的形式存在于"cooked"之中：
