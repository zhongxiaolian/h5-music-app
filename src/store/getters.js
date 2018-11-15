/*
 * @Author: kj
 * @Date: 2018-11-11 17:09:57
 * @LastEditors: kj
 * @LastEditTime: 2018-11-12 19:26:52
 * @Description: 从vuex的state中取数据，是对数据的一种映射
 */

export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullscreen = state => state.fullscreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {};
} 