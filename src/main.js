import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import 'babel-polyfill';
import fastclick from 'fastclick';
import store from './store/index.js';
import './common/stylus/index.styl';

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
    loading: require('common/images/loading.png')
})

// 处理移动端点击300ms延迟问题
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
