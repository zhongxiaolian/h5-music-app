/*
 * @Author: kj
 * @Date: 2018-11-11 17:09:00
 * @LastEditors: kj
 * @LastEditTime: 2018-11-12 19:25:40
 * @Description: 向vuex的state去写数据
 */

import * as types from './mutation-types.js';

const mutations = {
    [types.SET_SINGER](state,singer){
        state.singer = singer;
    },
    [types.SET_PLAYING_STATE](state,flag){
        state.playing = flag;
    },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullscreen = flag;
    },
    [types.SET_PLAYLIST](state,list){
        state.playList = list;
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList = list;
    },
    [types.SET_PLAY_MODE](state,mode){
        state.mode = mode;
    },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex = index;
    }
}

export default mutations;