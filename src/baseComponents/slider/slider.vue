<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,index) in dots" v-bind:key="index" 
                v-bind:class= '{active:currentPageIndex === index}'>
            </span>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom.js';
  export default {
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 3000
        }
    },
    data () {
      return {
          dots: [],
          currentPageIndex: 0
      }
    },
    mounted(){
        // 为了保证DOM成功渲染，需要加一个延时，浏览器的刷新通常是17ms一次，所以这里选择20ms。
        setTimeout(() => {
            this._setSliderWidth();
            // 初始化dots要在初始化better-scroll之前，否则就多两个dot
            this._initDots();
            this._initSlider();

            if(this.autoPlay){
                this._play();
            }
        }, 20);

        // 修复窗口改变，轮播图的bug
        window.addEventListener('resize',()=>{
            if(!this.slider){
                return;
            }
            this._setSliderWidth(true);
            this.slider.refresh();
        })
    },
    destroyed(){
        clearTimeout(this.timer);
    },
    methods: {
        /**
         * param: resize （如果是重置窗口调用的这个方法需要传入true）
         * 设置slider-group的width
         */
        _setSliderWidth(isResize){
            this.children = this.$refs.sliderGroup.children;
            let width = 0;
            let sliderWidth = this.$refs.slider.clientWidth;
            console.log(sliderWidth);
            for(let i=0;i<this.children.length;i++){
                let child = this.children[i];
                addClass(child,'slider-item');
                // 所有item的宽度和slider的宽度一样，即等于屏幕宽度
                child.style.width = sliderWidth+'px';
                width += sliderWidth;
            }
            // 重置窗口之前this.children的长度已经从5变到7了，所以不需要前后在加两个item了。
            if(this.loop && !isResize){
                // slider-group的前后各加一个item，保证循环轮播
                width += 2*sliderWidth;
            }
            this.$refs.sliderGroup.style.width = width+'px';
        },
        /**
         * 初始化better-scroll实现轮播图
         */
        _initSlider(){
            this.slider = new BScroll(this.$refs.slider, {
                scrollX : true,
                scrollY : false,
                momentum : false, /* 惯性 */
                snap : {
                    loop: this.loop,
                    threshold: 0.3,
                    autoPlay: this.autoPlay
                },
                click : true
            });

            // 监听better-scroll滚动事件，设置currentPageIndex
            this.slider.on('scrollEnd',()=>{
                this.currentPageIndex = this.slider.getCurrentPage().pageX;
                if(this.loop){
                    if(this.timer){
                        clearTimeout(this.timer);
                    }
                    this._play();
                }
            })
        },
        /**
         * 初始化轮播图小面的小圆点
         */
        _initDots(){
            console.log(this.children.length);
            this.dots = new Array(this.children.length);
        },
        /**
         * 自动播放
         */
        _play(){
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.slider.next(1000);
            }, this.interval);
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl';

    .slider
        min-height 1px
        position relative
        overflow hidden
        .slider-group
            position relative
            overflow hidden
            white-space nowrap
            .slider-item
                float left
                box-sizing border-box
                overflow hidden
                text-align center
                a
                    display block
                    width 100%
                    overflow hidden
                    text-decoration none
                img 
                    display block
                    width 100%
        .dots
            position absolute
            left 0
            right 0
            bottom 12px
            text-align center
            font-size 0
            .dot
                display inline-block
                margin 0 4px
                width 8px
                height 8px
                border-radius 50%
                background $color-text-l
                &.active
                    width 20px
                    border-radius 5px
                    background $color-text-ll
</style>