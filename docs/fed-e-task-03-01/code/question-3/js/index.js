/**
 * @author Wuner
 * @date 2020/8/2 18:19
 * @description
 */
import { init } from 'snabbdom/build/package/init';
import { h } from 'snabbdom/build/package/h';
import { styleModule } from 'snabbdom/build/package/modules/style';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners';

let data = [];
let oldVnode = null;

for (let i = 1; i <= 10; i++) {
  data.push({
    rank: Math.floor(Math.random() * 10000) + '',
    title: `第${Math.floor(Math.random() * 10000)}部`,
    description: `描述第${Math.floor(Math.random() * 10000)}部`,
  });
}

function onChange(type) {
  data = data.sort((a, b) => a[type].localeCompare(b[type], 'zh'));
  console.log(type);
  oldVnode = patch(oldVnode, topView(data));
}

function onAdd() {
  data.unshift({
    rank: Math.floor(Math.random() * 10000) + '',
    title: `第${Math.floor(Math.random() * 10000)}部`,
    description: `描述第${Math.floor(Math.random() * 10000)}部`,
    className: '.add',
  });
  oldVnode = patch(oldVnode, topView(data));
}

function onDel(index) {
  data.splice(index, 1);
  oldVnode = patch(oldVnode, topView(data));
}

let patch = init([styleModule, eventListenersModule]);

const btnStyle = {
  border: '1px solid #999',
  padding: '3px 5px',
  marginLeft: '5px',
  cursor: 'pointer',
};

const movieView = (data, index) => {
  let className = data.className ? data.className : '';
  return h(
    `div.li${className}`,
    {
      key: data.rank,
      style: {
        padding: '0 16px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #999',
        justifyContent: 'space-between',
        opacity: '0',
        delayed: { transition: 'opacity 4s', opacity: '1' },
        remove: { transition: 'opacity 1s', opacity: '0' },
      },
    },
    [
      h('span', data.rank),
      h('span', data.title),
      h('span', data.description),
      h(
        'span.btn',
        {
          style: btnStyle,
          on: {
            click: [onDel, index],
          },
        },
        '删除',
      ),
    ],
  );
};

let topView = (data) => {
  return h(
    'div#container',
    {
      style: {
        width: '60%',
        margin: '0 auto',
      },
    },
    [
      h('h1', 'Top 10 movies'),
      h('div', [
        h('span', 'Sort by: '),
        h(
          'span.btn',
          {
            style: btnStyle,
            on: {
              click: [onChange, 'rank'],
            },
          },
          'Rank',
        ),
        h(
          'span.btn',
          {
            style: btnStyle,
            on: {
              click: [onChange, 'title'],
            },
          },
          'Title',
        ),
        h(
          'span.btn',
          {
            style: btnStyle,
            on: {
              click: [onChange, 'description'],
            },
          },
          'Description',
        ),
        h(
          'span.btn.btnAdd',
          {
            style: btnStyle,
            on: {
              click: onAdd,
            },
          },
          'Add',
        ),
      ]),
      h('div.list', {}, data.map(movieView)),
    ],
  );
};

const addEl = document.querySelector('#app');

oldVnode = patch(addEl, topView(data));
