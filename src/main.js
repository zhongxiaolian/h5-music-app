import Vue from 'vue';
import App from './App';
import router from './router';

import 'babel-polyfill';
import fastclick from 'fastclick';

import './common/stylus/index.styl';

Vue.config.productionTip = false
// 处理移动端点击300ms延迟问题
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
