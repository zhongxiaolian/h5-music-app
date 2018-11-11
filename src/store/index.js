/*
 * @Author: kj
 * @Date: 2018-11-11 17:08:33
 * @LastEditors: kj
 * @LastEditTime: 2018-11-11 17:28:20
 * @Description: 
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './action.js';
import * as getters from './getters.js';
import state from './state.js';
import mutations from './mutations.js';
// 通过mutation方式修改state，就会在控制台打一个日志
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

// 开发模式下，debug为ture
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})