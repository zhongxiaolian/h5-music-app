<template>
    <div class="singer">
        <ListView v-bind:data="sortedSingers" 
                  v-if="sortedSingers"
                  v-on:select="selectSinger"></ListView>
        <router-view></router-view>
    </div>
</template>

<script type='text/ecmascript-6'>
  import {getSingerList,getIndex} from 'api/singer.js';
  import ListView from 'baseComponents/listview/listview.vue';
  export default {
    data () {
      return {
          index: [],
          sortedSingers: [],
          singers: {}
      }
    },
    created(){
        this._getIndex();
        setTimeout(() => {
          this._sort();
        }, 2500);
    },
    components:{
      ListView
    },
    methods: {
        _getSingerList(obj){
          getSingerList(obj.id).then((res)=>{
              let singerBlock = {};
              singerBlock.title = obj.name;
              singerBlock.items = res.singerList.data.singerlist.slice(0,10);
              this.singers[obj.name] = singerBlock;
          })
        },
        _getIndex(){
          getIndex().then((res)=>{
              this.index = res.singerList.data.tags.index;
              for(let i=0;i<this.index.length;i++){
                  this._getSingerList(this.index[i]);
              }
          })
        },
        _sort(){
            let all = [];
            let hot = [];
            let others = [];
            let unknowun = [];
            for(let key in this.singers){
                let val = this.singers[key];
                if(val.title.match(/[a-zA-Z]/)){
                  others.push(val);
                }else if(val.title === '热门'){
                  hot.push(val);
                }else if(val.title === '#'){
                  unknowun.push(val);
                }
            }
            others.sort((a,b)=>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            all = hot.concat(others).concat(unknowun);
            
            for(let i=0;i<all.length;i++){
                for(let j=0;j<all[i].items.length;j++){
                  // console.log(all[i].items[j].singer_pic);
                    all[i].items[j].singer_pic = all[i].items[j].singer_pic.replace('.webp','.jpg');
                }
            }
            this.sortedSingers = all;
        },
        // 接收listview派发的select事件
        selectSinger(singer){
            // 路由的编程接口
            this.$router.push({
                path: `/singer/${singer.singer_id}`,
            });
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    .singer
        position fixed
        top 88px
        bottom 0
        width 100%
</style>