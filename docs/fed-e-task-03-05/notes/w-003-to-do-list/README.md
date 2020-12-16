# Vue3.x Composition API - ToDoList 案例

## ToDoList 功能列表

- 添加代办事项
- 删除待办事项
- 编辑待办事项
- 切换待办事项
- 存储待办事项

## [创建项目](https://v3.vuejs.org/guide/installation.html#vite)

### npm

```
npm init vite-app to-do-list
```

### yarn

```
yarn create vite-app to-do-list
```

## 添加待办事项

```vue
<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
        v-model="input"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main">
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.text">
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label>{{ todo.text }}</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" type="text" />
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import './assets/index.css';

// 1. 添加待办事项
import { ref } from 'vue';

const useAdd = (todos) => {
  const input = ref('');
  const addTodo = () => {
    const text = input.value && input.value.trim();
    if (text.length === 0) return;
    todos.value.unshift({
      text,
      completed: false,
    });
    input.value = '';
  };
  return {
    input,
    addTodo,
  };
};

export default {
  name: 'App',
  setup() {
    const todos = ref([]);

    return {
      todos,
      ...useAdd(todos),
    };
  },
};
</script>
```

## 删除待办事项

### HTML 添加删除事件

```html
<button class="destroy" @click="remove(todo)"></button>
```

### 添加删除方法

```js
import { ref } from 'vue';

const useRemove = (todos) => {
  const remove = (todo) => {
    const index = todos.value.indexOf(todo);
    todos.value.splice(index, 1);
  };
  return {
    remove,
  };
};

export default {
  name: 'App',
  setup() {
    const todos = ref([]);

    return {
      todos,
      ...useAdd(todos),
      ...useRemove(todos),
    };
  },
};
```

## 编辑待办事项

- 双击待办事项,展示编辑文本框
- 按回车或者编辑文本框失去焦点修改数据
- 按 ESC 取消编辑
- 把编辑文本框清空按回车,删除这一项
- 显示编辑文本框的时候获取焦点

### HTML

```html
<section class="main">
  <ul class="todo-list">
    <li
      v-for="todo in todos"
      :key="todo"
      :class="{ editing: todo === editingTodo}"
    >
      <div class="view">
        <input class="toggle" type="checkbox" />
        <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
        <button class="destroy" @click="remove(todo)"></button>
      </div>
      <input
        class="edit"
        type="text"
        v-model="todo.text"
        @keyup.enter="doneEdit(todo)"
        @blur="doneEdit(todo)"
        @keyup.esc="cancelEdit(todo)"
      />
    </li>
  </ul>
</section>
```

### js

```js
const useEdit = (remove) => {
  let beforeEditingText = '';
  const editingTodo = ref(null);
  const editTodo = (todo) => {
    beforeEditingText = todo.text;
    editingTodo.value = todo;
  };

  const doneEdit = (todo) => {
    if (!editingTodo.value) return;
    todo.text = todo.text.trim();
    todo.text || remove(todo);
    editingTodo.value = null;
  };

  const cancelEdit = (todo) => {
    editingTodo.value = null;
    todo.text = beforeEditingText;
  };
  return {
    editingTodo,
    editTodo,
    doneEdit,
    cancelEdit,
  };
};

export default {
  name: 'App',
  setup() {
    const todos = ref([]);
    const { remove } = useRemove(todos);

    return {
      todos,
      remove,
      ...useAdd(todos),
      ...useEdit(remove),
    };
  },
};
```

### 编辑文本框获取焦点

当你双击文本时，并未自动获取焦点，这时我们需要特殊处理，比如添加自定义指令

```html
<input
  class="edit"
  type="text"
  v-model="todo.text"
  v-editing-focus="todo === editingTodo"
  @keyup.enter="doneEdit(todo)"
  @blur="doneEdit(todo)"
  @keyup.esc="cancelEdit(todo)"
/>
```

```js
export default {
  name: 'App',
  setup() {
    const todos = ref([]);
    const { remove } = useRemove(todos);

    return {
      todos,
      remove,
      ...useAdd(todos),
      ...useEdit(remove),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus();
    },
  },
};
```

## 切换待办事项的状态

- 点击 checkbox,改变所有待办项状态
- All/Active/Completed
  - 显示未完成待办项个数
  - 如果没有待办项，隐藏 main 和 footer
- 移除所有完成的项目

### 点击 checkbox,改变所有待办项状态

```html
<section class="main" v-show="count">
  <input id="toggle-all" class="toggle-all" v-model="allDone" type="checkbox" />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li
      v-for="todo in filteredTodos"
      :key="todo"
      :class="{ editing: todo === editingTodo, completed: todo.completed }"
    >
      <div class="view">
        <input class="toggle" type="checkbox" v-model="todo.completed" />
        <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
        <button class="destroy" @click="remove(todo)"></button>
      </div>
      <input
        class="edit"
        type="text"
        v-model="todo.text"
        v-editing-focus="todo === editingTodo"
        @keyup.enter="doneEdit(todo)"
        @blur="doneEdit(todo)"
        @keyup.esc="cancelEdit(todo)"
      />
    </li>
  </ul>
</section>
```

```js
import { computed, ref } from 'vue';
const useFilter = (todos) => {
  const allDone = computed({
    get() {
      return !todos.value.filter((todo) => !todo.completed).length;
    },
    set(value) {
      todos.value.forEach((todo) => {
        todo.completed = value;
      });
    },
  });
  return {
    allDone,
  };
};
export default {
  name: 'App',
  setup() {
    const todos = ref([]);
    const { remove } = useRemove(todos);

    return {
      todos,
      remove,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus();
    },
  },
};
```

### All/Active/Completed

- 查看所有、选中、未选中
- 显示未完成待办项个数
- 如果没有待办项，隐藏 main 和 footer

```html
<section class="main" v-show="count">
  <input id="toggle-all" class="toggle-all" v-model="allDone" type="checkbox" />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li
      v-for="todo in filteredTodos"
      :key="todo"
      :class="{ editing: todo === editingTodo, completed: todo.completed }"
    >
      <div class="view">
        <input class="toggle" type="checkbox" v-model="todo.completed" />
        <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
        <button class="destroy" @click="remove(todo)"></button>
      </div>
      <input
        class="edit"
        type="text"
        v-model="todo.text"
        v-editing-focus="todo === editingTodo"
        @keyup.enter="doneEdit(todo)"
        @blur="doneEdit(todo)"
        @keyup.esc="cancelEdit(todo)"
      />
    </li>
  </ul>
</section>
<footer class="footer" v-show="count">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong> {{ remainingCount > 1 ? 'items' :
    'item' }} left
  </span>
  <ul class="filters">
    <li><a href="#/all">All</a></li>
    <li><a href="#/active">Active</a></li>
    <li><a href="#/completed">Completed</a></li>
  </ul>
</footer>
```

```js
import { computed, onMounted, onUnmounted, ref } from 'vue';

const useFilter = (todos) => {
  const allDone = computed({
    get() {
      return !todos.value.filter((todo) => !todo.completed).length;
    },
    set(value) {
      todos.value.forEach((todo) => {
        todo.completed = value;
      });
    },
  });

  // 通过计算属性，过滤数据
  const filteredTodos = computed(() => filter[type.value](todos.value));
  // 通过计算属性，获取选中事项的数量
  const remainingCount = computed(() => filter.active(todos.value).length);
  // 通过计算属性，获取所有事项的数量
  const count = computed(() => todos.value.length);

  const onHashChange = () => {
    const hash = window.location.hash.replace('#/', '');
    if (filter[hash]) {
      type.value = hash;
    } else {
      type.value = 'all';
      window.location.hash = '';
    }
    console.log(type.value);
  };

  // 添加监听hash改变的事件
  onMounted(() => {
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
  });

  // 移除监听hash改变的事件
  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange);
  });

  return {
    allDone,
    count,
    filteredTodos,
    remainingCount,
  };
};

export default {
  name: 'App',
  setup() {
    const todos = ref([]);
    const { remove } = useRemove(todos);

    return {
      todos,
      remove,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus();
    },
  },
};
```

## 移除所有完成的项目

```html
<footer class="footer" v-show="count">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong> {{ remainingCount > 1 ? 'items' :
    'item' }} left
  </span>
  <ul class="filters">
    <li><a href="#/all">All</a></li>
    <li><a href="#/active">Active</a></li>
    <li><a href="#/completed">Completed</a></li>
  </ul>
  <button
    class="clear-completed"
    @click="removeCompleted"
    v-show="count > remainingCount"
  >
    Clear completed
  </button>
</footer>
```

```js
const useRemove = (todos) => {
  const remove = (todo) => {
    const index = todos.value.indexOf(todo);
    todos.value.splice(index, 1);
  };
  const removeCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  };
  return {
    remove,
    removeCompleted,
  };
};
export default {
  name: 'App',
  setup() {
    const todos = ref([]);
    const { remove, removeCompleted } = useRemove(todos);

    return {
      todos,
      remove,
      removeCompleted,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus();
    },
  },
};
```

## 存储待办事项

`src/utils/useLocalStorage.js`

```js
function parse(str) {
  let value;
  try {
    value = JSON.parse(str);
  } catch {
    value = null;
  }
  return value;
}

function stringify(obj) {
  let value;
  try {
    value = JSON.stringify(obj);
  } catch {
    value = null;
  }
  return value;
}

export default function useLocalStorage() {
  function setItem(key, value) {
    value = stringify(value);
    window.localStorage.setItem(key, value);
  }

  function getItem(key) {
    let value = window.localStorage.getItem(key);
    if (value) {
      value = parse(value);
    }
    return value;
  }

  return {
    setItem,
    getItem,
  };
}
```

```js
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import useLocalStorage from './utils/useLocalStorage';
const storage = useLocalStorage();

// 5. 存储待办事项
const useStorage = () => {
  const KEY = 'TODOKEYS';
  const todos = ref(storage.getItem(KEY) || []);
  watchEffect(() => {
    storage.setItem(KEY, todos.value);
  });
  return todos;
};
export default {
  name: 'App',
  setup() {
    const todos = useStorage();
    const { remove, removeCompleted } = useRemove(todos);

    return {
      todos,
      remove,
      removeCompleted,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus();
    },
  },
};
```

## [源码](https://gitee.com/Wuner/to-do-list.git)
