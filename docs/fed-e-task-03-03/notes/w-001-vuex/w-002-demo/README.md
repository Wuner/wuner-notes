# 案例-购物车

购物车 Demo，带你理解并使用 vuex 状态管理

## 目录结构

![note](./imgs/1.png)

## 效果展示

![note](./imgs/2.gif)

### 功能介绍

- 首页
  - 获取并展示商品列表
  - 添加商品到购物车
  - 展示购物车中商品总数
- 购物车
  - 更新购物车中的商品数据
  - 更新商品选中状态
  - 计算选中商品数量、合计商品价格
  - 全选、单选
  - 删除购物车中的商品
  - 本地缓存 vuex 状态

## 功能开发

Vuex 中创建两个模块，分别用来记录商品列表和购物车的状态，store 的结构：

```
└───store
    ├───modules
    │   └───cart.js
    │   └───production.js
    └───index.js
```

视图结构

```
└───view
    ├───cart
    │   └───index.vue
    └───home
        └───index.vue
```

### 首页

production.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/20 16:39
 * @description
 */
const state = {
  // 商品数组
  productions: [],
};
const getters = {};
const mutations = {
  /**
   * 设置商品数组
   * @param state
   * @param payload
   */
  setProductions(state, payload) {
    state.productions = payload.map((val) => {
      // 价格保留两位小数
      val.price = val.price.toFixed(2);
      return val;
    });
  },
};
const actions = {
  /**
   * 调用接口获取商品
   * @param commit
   * @returns {Promise<void>}
   */
  async getProductions({ commit }) {
    const result = await this._vm.$http.get(
      `http://${process.env.HOST}:3000/products`,
      {},
    );
    commit('setProductions', result);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

cart.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/20 16:39
 * @description
 */

const state = {
  // 购物车商品数组
  productionsCart: [],
};
const getters = {
  /**
   * 商品总数
   * @param state
   * @returns {number}
   */
  totalCount(state) {
    return state.productionsCart.reduce((sum, { count }) => sum + count, 0);
  },
};
const mutations = {
  /**
   * 将商品添加到购物车
   * @param state
   * @param payload
   */
  addToCarts(state, payload) {
    let production = state.productionsCart.find(
      (value) => value.id === payload.id,
    );
    // 1. productionsCart 中没有该商品，把该商品添加到数组，并增加 count，isChecked，totalPrice
    // 2. cartProducts 有该商品，让商品的数量加payload.count，选中，计算小计
    // 3. 计算小计时，保留两位小数
    if (production) {
      production.count = production.count += payload.count;
      production.isChecked = true;
      production.totalPrice = (production.price * production.count).toFixed(2);
    } else {
      state.productionsCart.push({
        ...payload,
        isChecked: true,
        totalPrice: (payload.price * payload.count).toFixed(2),
      });
    }
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

home/index.vue

```vue
<template>
  <div class="home">
    <van-nav-bar title="首页" fixed placeholder>
      <template slot="right">
        <van-icon
          size="24"
          name="cart-o"
          @click="$router.push('cart')"
          :badge="totalCount || ''"
        />
      </template>
    </van-nav-bar>
    <div v-for="(item, index) in productions" :key="item.id" class="home-card">
      <van-card
        :num="nums[index]"
        :price="item.price"
        :desc="item.desc"
        :title="item.title"
        :thumb="item.thumb"
      >
        <template slot="footer">
          <div class="home-card-footer">
            <van-stepper v-model="nums[index]" />
            <van-button @click="addCart(item, index)" icon="cart-o" size="mini">
              加入购物车
            </van-button>
          </div>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      nums: [],
    };
  },
  methods: {
    // 使用 action 辅助函数
    // 映射 this.getProductions() 为 this.$store.dispatch('production/getProductions')
    ...mapActions('production', ['getProductions']),
    // 使用 mutation 辅助函数
    // 映射 this.addToCarts() 为 this.$store.commit('cart/addToCarts')
    ...mapMutations('cart', ['addToCarts']),
    // 添加商品到购物车
    addCart(item, index) {
      let count = this.nums[index];
      // 将商品数量置为1
      this.nums.splice(index, 1, 1);
      // 以载荷方式提交
      this.addToCarts({ ...item, count });
    },
    // 初始化商品数据
    initData() {
      // 获取商品列表数据
      this.getProductions();
      // 初始化商品步进器数值
      this.productions.forEach(() => this.nums.push(1));
    },
  },
  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    // 使用 state 辅助函数
    // 映射 this.productions 为 this.$store.state.production.productions
    ...mapState('production', ['productions']),
    // 使用 getter 辅助函数
    // 映射 this.totalCount 为 this.$store.getters['cart/totalCount']
    ...mapGetters('cart', ['totalCount']),
  },
};
</script>
<style scoped lang="less">
.home {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;

  &-card {
    margin: 10px 16px 0 16px;

    .van-card {
      border-radius: 8px;
    }

    &-footer {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
```

### 购物车

cart.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/20 16:39
 * @description
 */
import Local from '../../utils/local';

const state = {
  // 购物车商品数组
  productionsCart: Local.get('productionsCart') || [],
};
const getters = {
  /**
   * 是否选中所有商品
   * @param state
   * @returns {boolean}
   */
  isAllChecked(state) {
    let result = true;
    for (let production of state.productionsCart) {
      // 当购物车中有一个商品未选中，就返回false
      if (!production.isChecked) {
        result = false;
        break;
      }
    }
    return result;
  },
  /**
   * 商品总数
   * @param state
   * @returns {number}
   */
  totalCount(state) {
    return state.productionsCart.reduce((sum, { count }) => sum + count, 0);
  },
  /**
   * 选中商品的总数
   * @param state
   * @returns {number}
   */
  checkedCount(state) {
    return state.productionsCart.reduce(
      (sum, { count, isChecked }) => (isChecked ? sum + count : sum),
      0,
    );
  },
  /**
   * 选中商品的价格合计
   * @param state
   * @returns {number}
   */
  checkedPrice(state) {
    return state.productionsCart.reduce(
      (sum, { totalPrice, isChecked }) =>
        isChecked ? sum + totalPrice * 100 : sum,
      0,
    );
  },
};
const mutations = {
  /**
   * 更新商品的选中状态
   * @param state
   * @param payload
   */
  updateProductionChecked(state, payload) {
    // 全选
    if (payload.all) {
      state.productionsCart.forEach(
        (production) => (production.isChecked = payload.isChecked),
      );
    } else {
      // 单选
      let production = state.productionsCart.find(
        (value) => value.id === payload.id,
      );
      production && (production.isChecked = !payload.isChecked);
    }
  },
  /**
   * 更新购物车中的商品数据
   * @param state
   * @param payload
   */
  updateProduction(state, payload) {
    let production = state.productionsCart.find(
      (value) => value.id === payload.id,
    );
    production.count = payload.count;
    production.totalPrice = (production.count * production.price).toFixed(2);
  },
  /**
   * 将商品添加到购物车
   * @param state
   * @param payload
   */
  addToCarts(state, payload) {
    let production = state.productionsCart.find(
      (value) => value.id === payload.id,
    );
    // 1. productionsCart 中没有该商品，把该商品添加到数组，并增加 count，isChecked，totalPrice
    // 2. cartProducts 有该商品，让商品的数量加payload.count，选中，计算小计
    // 3. 计算小计时，保留两位小数
    if (production) {
      production.count = production.count += payload.count;
      production.isChecked = true;
      production.totalPrice = (production.price * production.count).toFixed(2);
    } else {
      state.productionsCart.push({
        ...payload,
        isChecked: true,
        totalPrice: (payload.price * payload.count).toFixed(2),
      });
    }
  },
  /**
   * 移除购物车中的商品
   * @param state
   * @param payload
   */
  removeFromCarts(state, payload) {
    let index = state.productionsCart.findIndex(
      (value) => value.id === payload,
    );
    index >= 0 && state.productionsCart.splice(index, 1);
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

cart/index.vue

```vue
<template>
  <div class="cart">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="购物车"
      fixed
      placeholder
    />
    <div v-for="item in productionsCart" :key="item.id" class="cart-card">
      <van-swipe-cell>
        <van-card
          :num="item.num"
          :price="item.price"
          :desc="item.desc"
          :title="item.title"
          :thumb="item.thumb"
        >
          <template slot="footer">
            <div class="cart-card-footer">
              <div class="cart-card-footer-left">
                <van-checkbox
                  @click="updateProductionChecked(item)"
                  :value="item.isChecked"
                  :name="item.id"
                />
                <span class="total-price">小计: ￥{{ item.totalPrice }}</span>
              </div>
              <van-stepper
                @change="onChange($event, item.id)"
                :default-value="item.count"
              />
            </div>
          </template>
        </van-card>
        <template slot="right">
          <van-button
            @click="removeFromCarts(item.id)"
            square
            text="删除"
            type="danger"
            class="delete-button"
          />
        </template>
      </van-swipe-cell>
    </div>
    <van-submit-bar
      :price="checkedPrice"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-checkbox
        @click="
          updateProductionChecked({ all: true, isChecked: !isAllChecked })
        "
        :value="isAllChecked"
      >
        全选
      </van-checkbox>
      <template slot="tip">
        <span
          >已选 <span>{{ checkedCount }}</span> 件商品</span
        >
      </template>
    </van-submit-bar>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {};
  },
  methods: {
    // 使用 mutation 辅助函数
    // 映射 this.updateProduction() 为 this.$store.commit('cart/updateProduction')
    // 映射 this.updateProductionChecked() 为 this.$store.commit('cart/updateProductionChecked')
    // 映射 this.removeFromCarts() 为 this.$store.commit('cart/removeFromCarts')
    ...mapMutations('cart', [
      'updateProduction',
      'updateProductionChecked',
      'removeFromCarts',
    ]),
    onSubmit() {},
    // 监听步进器数据改变，更新购物车中的商品数据
    onChange(count, id) {
      typeof count === 'number' && this.updateProduction({ count, id });
    },
  },
  created() {},
  mounted() {},
  computed: {
    // 使用 state 辅助函数
    // 映射 this.productionsCart 为 this.$store.state.cart.productionsCart
    ...mapState('cart', ['productionsCart']),
    // 使用 getter 辅助函数
    // 映射 this.isAllChecked 为 this.$store.getters['cart/isAllChecked']
    // 映射 this.checkedCount 为 this.$store.getters['cart/checkedCount']
    // 映射 this.checkedPrice 为 this.$store.getters['cart/checkedPrice']
    ...mapGetters('cart', ['isAllChecked', 'checkedCount', 'checkedPrice']),
  },
};
</script>
<style scoped lang="less">
.cart {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;

  &-card {
    margin: 10px 16px 0 16px;

    .van-card {
      border-radius: 8px;
    }

    &-footer {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-left {
        display: flex;
        align-items: center;

        .total-price {
          margin-left: 16px;
          color: #ee0a24;
          font-size: 14px;
        }
      }
    }

    .delete-button {
      height: 100%;
    }
  }
}
</style>
```

### 本地缓存购物车 vuex 状态

store/index.js

```javascript
/**
 * @author Wuner
 * @date 2020/8/20 16:38
 * @description
 */
import Vuex from 'vuex';
import Vue from 'vue';
import production from './modules/production';
import cart from './modules/cart';

Vue.use(Vuex);
import Local from '../utils/local';

const myPlugin = (store) => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    // 缓存cart模块状态
    mutation.type.startsWith('cart/') &&
      Local.set('productionsCart', state.cart.productionsCart);
  });
};

const state = {};
const getters = {};
const mutations = {};
const actions = {};

const store = new Vuex.Store({
  // 非生产环境添加严格模式
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions,
  // 模块
  modules: {
    production,
    cart,
  },
  // 插件
  plugins: [myPlugin],
});

export default store;
```

### demo 源码地址

- [github 仓库](https://github.com/Wuner/vuex-shopping-cart-demo)

- [gitee 仓库](https://gitee.com/Wuner/vuex-shopping-cart-demo)
