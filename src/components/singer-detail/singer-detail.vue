<template>
    <transition name="slide">
        <music-list 
            v-bind:title="title"
            v-bind:bg-image="bgImage"
            v-bind:songs="songs"
            >
        </music-list>
    </transition>
</template>

<script type='text/ecmascript-6'>
  // vuex提供的语法糖
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer.js';
  import {createSong} from 'common/js/song.js';
  import {getSongKey} from 'api/singer.js';
  import MusicList from 'components/music-list/music-list.vue';
  export default {
    data () {
      return {
          songs: []
      }
    },
    computed:{
        title(){
            return this.singer.singer_name
        },
        bgImage(){
            return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singer.singer_mid}.jpg?max_age=2592000`
        },
        ...mapGetters([
            'singer'
        ])
    },
    created(){
        // console.log(this.singer);
        this._getDetail();
    },
    methods:{
        _getDetail(){
            // 如果用户在歌手详情页刷新页面，store中是不存在singer对象的，因为需要在歌手列表页
            // 点击歌手才可以把歌手存入store中。
            // 此时直接退回歌手列表页
            if(!this.singer.singer_mid){
                this.$router.push('/singer');
                return;
            }
            getSingerDetail(this.singer.singer_mid).then((res)=>{
                console.log(res);
                if(!res.data.list){
                    alert('服务器忙，请稍后');
                    return
                }
                this._nomarlizeSongs(res.data.list);
            })
        },
        _nomarlizeSongs(list){
            list.forEach((item) => {
                let {musicData} = item;
                if(musicData.songid && musicData.songmid){
                    getSongKey(musicData.songmid).then((res)=>{
                        let vkey = res.req_0.data.midurlinfo[0].vkey;
                        this.songs.push(createSong(musicData,vkey));               
                    })
                    
                }
            });
        }
    },
    components:{
        MusicList
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    .slide-enter-active,.slide-leave-active
        transition all 0.3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
</style>