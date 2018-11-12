<template>
    <div class="music-list">
         <!-- v-show="songs.length" 此时该DOM还没加载，mounted不会计算bgImage的高度 -->
        <div class="back" v-on:click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title">{{title}}</h1>
        <div class="bg-image" v-bind:style='bgStyle' ref="bgImage">
            <div class="play-wrapper" v-show="songs.length>0" ref="playWrapper">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <!-- 用于设置高斯模糊效果用 -->
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <Scroll 
            v-bind:data="songs" 
            class="list" 
            ref="list" 
            :probeType="probeType" 
            :listen-scroll="listenScroll"
            v-on:scroll="scrollHandler">
                <div class="song-list-wrapper">
                    <song-list v-bind:songs="songs"></song-list>
                </div>
                <div class="loading-container" v-show="!songs.length">
                    <Loading></Loading>
                </div>
        </Scroll>
    </div>
</template>

<script type='text/ecmascript-6'>
  import Loading from 'baseComponents/loading/loading.vue';
  import Scroll from 'baseComponents/scroll/scroll.vue';
  import SongList from 'baseComponents/song-list/song-list.vue';
  import {prefixStyle} from 'common/js/dom.js';
  // layer滚动到上方的预留值
  const RESERVED_HEIGHT = 40;

  export default {
    props:{
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
      return {
          scrollY:0
      }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    components:{
        Loading,
        Scroll,
        SongList
    },
    mounted(){
        // 记录一下bg-image的高度
        this.imageHeight = this.$refs.bgImage.clientHeight;
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
        this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;
    },
    created(){
        this.probeType = 3;
        this.listenScroll = true;
    },
    methods:{
        scrollHandler(pos){
            this.scrollY = pos.y;
        },
        back(){
            this.$router.back();
        }
    },
    watch: {
        scrollY(newY){
            // this.minTranslateY为滚动的临界值，超过临界值时等于临界值
            let translateY = Math.max(this.minTranslateY,newY);
            let scale = 1;
            // 定义放大的比例
            let percent = Math.abs(newY / this.imageHeight);
            // 高斯模糊效果
            let blur = 0;
            this.$refs.layer.style[prefixStyle('transform')] = `translate3d(0,${translateY}px,0)`;
            // 如果滚动的距离超过设置的临界值，直接让bg-image的高度等于临界值的高度，并且z-index=10，用于
            // 覆盖超过的文字
            if(newY < this.minTranslateY){
                this.$refs.bgImage.style.zIndex = 10;
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;

                // 隐藏play按钮 
                this.$refs.playWrapper.style.display = 'none';
            }else{ // 当向下滚动的newY > minTranslateY时，把bg-images重置回来。
                this.$refs.bgImage.style.paddingTop = '70%';
                this.$refs.bgImage.style.height = 0;
                this.$refs.bgImage.style.zIndex = 0;

                // 显示play按钮
                this.$refs.playWrapper.style.display = '';
            }
            // 当向下拉时，放大bg-image
            if(newY>0){
                scale = 1+percent;
                this.$refs.bgImage.style.zIndex = 10;
                this.$refs.bgImage.style[prefixStyle('transform')] = `scale(${scale})`;
            }else{ // 向上拉时，高斯模糊效果
                blur = Math.min(20*percent,20);
                // ios手机才有这样的效果
                this.$refs.filter.style[prefixStyle('backdrop-filter')] = `blur(${blur})`;
            }
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl';
    @import '~common/stylus/mixin.styl';

    .music-list
        position fixed
        z-index 100
        top 0
        left 0
        right 0
        bottom 0
        background $color-background
        .back
            position absolute
            top 0
            left 6px
            z-index 40
            .icon-back
                display block
                padding 10px
                font-size $font-size-large-x
                color $color-theme
        .title
            position absolute
            top 0
            left 10%
            z-index 40
            width 80%
            no-wrap()
            text-align center
            line-height 40px
            font-size $font-size-large
            color $color-text
        .bg-image
            position relative
            width 100%
            height 0
            padding-top 70%  /*这个百分比是根据宽度决定的*/
            background-size cover
            transform-origin top 
            .play-wrapper
                position absolute
                bottom 50px
                z-index 50
                width 100%
                .play
                    box-sizing border-box
                    width 135px
                    padding 7px 0
                    margin 0 auto 
                    text-align center
                    border 1px solid $color-theme
                    color $color-theme
                    border-radius 100px
                    font-size 0
                    .icon-play
                        display inline-block
                        vertical-align middle
                        margin-right 6px
                        font-size $font-size-medium-x
                    .text
                        display inline-block
                        vertical-align middle
                        font-size $font-size-small
            .filter
                position absolute
                top 0
                left 0
                width 100%;
                height 100%
                background rgba(7,17,27,0.4)
        .bg-layer
            position relative
            height 100%
            background $color-background
        .list
            position fixed
            top 0
            bottom 0
            width 100%
            background $color-background
            // overflow hidden
            .loading-container
                position absolute
                width 100%
                top 50%
                transform translateY(-50%)
        .loading-container
            position absolute
            left 0
            top 50%
            transform translateY(-50%)
            width 100%
</style>