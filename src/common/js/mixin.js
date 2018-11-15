/*
 * @Author: kj
 * @Date: 2018-11-15 16:34:12
 * @LastEditors: kj
 * @LastEditTime: 2018-11-15 17:18:40
 * @Description: 通过vue 的 mixin给所有页面解决mini播放器遮盖list的问题
 */

import {mapGetters} from 'vuex';
export const playlistMixin = {
    computed:{
        ...mapGetters([
            'playList'
        ])
    },
    mounted(){
        this.handlePlaylist(this.playList);
    },
    // keep-alive切换回来触发的钩子
    activated(){
        this.handlePlaylist(this.playList);
    },
    watch:{
        playList(newVal){
            this.handlePlaylist(newVal);
        }
    },
    methods: {
        handlePlaylist(playlist){
            throw new Error('component must implement handlePlaylist method');
        }
    }
}