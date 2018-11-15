/*
 * @Author: kj
 * @Date: 2018-11-11 17:09:37
 * @LastEditors: kj
 * @LastEditTime: 2018-11-14 17:15:36
 * @Description: 和业务相关的动作
 */
import * as types from './mutation-types.js';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/util.js';

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id === song.id
    });
}

export const selectPlay = function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list);
    // 如果当前是随机播放，在点击music-list页面时，歌曲的索引是不对的，已经重排过了
    if(state.mode === playMode.random){
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST,randomList);
        index = findIndex(randomList,list[index]);

    }else{
        commit(types.SET_PLAYLIST,list);
    }
    commit(types.SET_CURRENT_INDEX,index);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
}

export const randomPlay = function({commit},{list,index}){
    commit(types.SET_PLAY_MODE,playMode.random);
    commit(types.SET_SEQUENCE_LIST,list);

    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST,randomList);
    // 如果当前正在播放，点击了随机播放全部时，不会切掉当前的歌。
    if(index>=0){
        index = findIndex(randomList,list[index]);
    }else{
        index = 0;
    }
    commit(types.SET_CURRENT_INDEX,index || 0);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
}
