/*
 * @Author: kj
 * @Date: 2018-11-11 17:08:47
 * @LastEditors: kj
 * @LastEditTime: 2018-11-14 16:57:55
 * @Description: vuex的数据库
 */

import {playMode} from 'common/js/config';

const state = {
    singer: {},
    playing: false,
    fullscreen: false,
    playList: [],   // 当前的播放列表
    sequenceList: [],   // 当前的歌曲页面的列表
    mode: playMode.sequence,
    currentIndex: -1
}

export default state;