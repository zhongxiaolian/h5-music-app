<template>
    <div class="recommend">
        <div class="recommend-content">
            <!-- 这里必须要添加v-if,因为getRecommend是一个异步过程，此时直接渲染slider组件会不正常。 -->
            <div class="slider-wrapper" v-if="recommends.length>0">
                <slider>
                    <div v-for="(item,index) in recommends" v-bind:key="index">
                        <a v-bind:href="item.linkUrl">
                            <img v-on:load="_loadHandler" v-bind:src="item.picUrl" alt="">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌曲推荐</h1>
                <scroll class="item-wrapper" v-bind:data="playList" ref="scroll">
                    <ul>
                        <li v-for="(item,index) in playList" :key="index" class="item">
                            <div class="icon">
                                <img  width="60" height="60" v-lazy="item.cover" alt="">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.username}}</h2>
                                <p class="desc">{{item.title}}</p>
                            </div>
                        </li>
                    </ul>
                    <loading class="loading-container" v-show="!playList.length"></loading>
                </scroll>
            </div>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  import {getRecommend,getRecomPlayList} from 'api/recommend.js';
  import Slider from 'baseComponents/slider/slider.vue';
  import Scroll from 'baseComponents/scroll/scroll.vue';
  import Loading from 'baseComponents/loading/loading.vue'
  export default {
    data () {
      return {
        recommends: [],
        playList: []
      }
    },
    created(){
        this._getRecommend();
        setTimeout(()=>{
            this._getRecomPlayList();
        },2000);
        
    },
    methods: {
        _getRecommend(){
          getRecommend().then((res)=>{
              if(res.code === 0){
                  this.recommends = res.data.slider
              }else{

              }
          })
        },
        _getRecomPlayList(){
            getRecomPlayList().then((res)=>{
                this.playList = res.recomPlaylist.data.v_hot;
            })
        },
        _loadHandler(){
            // slider中的图片是按比例扩大的，所以当图片还没有加载上时，是没有占位的，scroll无法计算出准确的高度，
            // 所以要等待图片加载完。
            // 轮播图只要有一张图片加载完就可以确定高度了。设置一个标志位，让这段代码只执行一次。
            if(!this.hasLoad){
                this.$refs.scroll.refresh();   // 通过这样可以调用引用组件的方法。
                this.hasLoad = true;   
            }
        }
    },
    components:{
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl'

    .recommend
        position fixed
        width 100%
        top 88px
        bottom 0
        overflow hidden
        .recommend-content
            height 100%
            overflow hidden
            display flex
            flex-direction column
            .slider-wrapper
                flex none
                position relative
                width 100%
            .recommend-list
                flex 1
                overflow hidden
                display flex
                flex-direction column
                .list-title
                    flex none
                    height 65px
                    line-height 65px
                    text-align center
                    font-size $font-size-medium
                    color $color-theme
                .item-wrapper
                    flex 1
                    overflow hidden
                    position relative
                    .item
                        display flex
                        box-sizing border-box
                        align-items center
                        padding 0 20px 20px 20px
                        .icon
                            flex 0 0 60px
                            width 60px
                            height 60px
                            padding-right 20px
                        .text
                            display flex
                            flex-direction column
                            justify-content center
                            flex 1
                            line-height 20px
                            overflow hidden
                            font-size $font-size-medium
                            .name
                                margin-bottom 10px
                                color $color-text
                            .desc 
                                color $color-text-d
                    .loading-container
                        position absolute
                        width 100%
                        top 50%
                        transform translateY(-50%)
</style>