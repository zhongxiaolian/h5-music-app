<template>
    <Scroll class="listview" 
            v-bind:data="data" 
            ref="scroll" 
            :listenScroll="listenScroll"
            :probeType="probeType"
            @scroll="scrollHandler">
        <ul>
            <li v-for="(group,index) in data" v-bind:key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item,index) in group.items" 
                        v-bind:key="index" 
                        v-on:click="selectItem(item)"
                        class="list-group-item">
                        <img class="avatar" v-lazy="item.singer_pic" alt="">
                        <span class="name">{{item.singer_name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" v-on:touchstart="touchStartHandler" v-on:touchmove.stop.prevent="touchMoveHandler">
            <ul>
                <li v-for="(shortCutItem,index) in shortCutList" 
                    v-bind:key="index" 
                    v-bind:index="index" 
                    v-bind:class="{current: currentIndex === index}"
                    class="item">
                    {{shortCutItem}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-if="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <Loading class="loading-container" v-show="!data.length"></Loading>
    </Scroll>
</template>

<script type='text/ecmascript-6'>
  import Scroll from 'baseComponents/scroll/scroll.vue';
  import {getData} from 'common/js/dom.js';
  import Loading from 'baseComponents/loading/loading.vue';
  export default {
    props:{
        data: {
            type: Array,
            default: []
        }
    },
    data () {
      return {
          scrollY: -1,
          currentIndex: 0,
          diff: 0
      }
    },
    components:{
        Scroll,
        Loading
    },
    computed:{
        shortCutList(){
            return  this.data.map((group)=>{
                return group.title.substr(0,1)
            })
        },
        fixedTitle(){
            if(this.scrollY>0){
                return '';
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
        }
    },
    created(){
        this.touch = {};
        this.listenScroll = true;
        this.listHeight = [];
        this.probeType = 3;
    },
    methods:{
        touchStartHandler(e){
            let currentIndex = getData(e.target,'index')
            this.scrollTo(currentIndex);

            // 记录touch的起始位置，为touchmove使用
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;
            this.touch.currentIndex = Math.floor(currentIndex);
        },
        touchMoveHandler(e){
            let firstTouch = e.touches[0];
            this.touch.y2 = firstTouch.pageY;
            
            let delta = (this.touch.y2 - this.touch.y1)/18 | 0;
            let index = this.touch.currentIndex + delta;
            this.scrollTo(index);
        },
        scrollTo(index){
            console.log(index);
            if(!index && index !== 0){
                return
            }

            // 处理滑动的边界情况
            if(index<0){
                index = 0;
            }
            if(index>this.listHeight-2){
                index = this.listHeight-2;
            }
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[index],0);
            // 因为点击字母时的滚动不会被scroll事件监听到，所以要手动设置scrollY
            // 然后watch函数自动计算currentIndex值
            this.scrollY = -this.listHeight[index];
        },
        // better-scroll滚动事件的回调函数
        scrollHandler(pos){
            this.scrollY = pos.y;
        },
        calculateHeight(){
            this.listHeight = [];
            const list = this.$refs.listGroup;
            let height = 0;
            this.listHeight.push(height);
            for(let i=0;i<list.length;i++){
                let item = list[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectItem(item){
            this.$emit('select',item);
        }
    },
    watch:{
        data(){
            setTimeout(() => {
                this.calculateHeight();
            }, 20);
        },
        scrollY(newY){
            const listHeight = this.listHeight;
            // 当滚动到顶部
            if(newY > 0){
                this.currentIndex = 0;
                return
            }
            // 在中间部位滚动
            for(let i=0;i<listHeight.length-1;i++){
                let height1 = listHeight[i];
                let height2 = listHeight[i+1];
                if(-newY>= height1 && -newY<height2){
                    this.currentIndex = i;
                    // 计算出下一个条目到顶部的距离
                    this.diff = height2+newY;
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限

            this.currentIndex = listHeight.length - 2;
        },
        diff(newVal){
            // console.log(newVal);
            // 30表示每个条目标题的高度，如果结果为0，表示固定的条目不动
            let transY = (newVal>0 && newVal<30) ? newVal-30 : 0;
            console.log(transY);
            this.$refs.fixed.style.transform = `translate3d(0,${transY}px,0)`;
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl'
    .listview
        position relative
        height 100%
        width 100%
        overflow hidden
        background $color-background
        .list-group
            padding-bottom 30px
            // &:first-child
            //     padding-top 10px
            .list-group-title
                height 30px
                line-height 30px
                padding-left 20px
                font-size $font-size-small
                color $color-text-l
                background $color-highlight-background
            .list-group-item
                display flex
                align-items center
                padding 20px 0 0 30px
                .avatar
                    width 50px
                    height 50px
                    border-radius 50%
                .name
                    margin-left 20px
                    color $color-text-l
                    font-size $font-size-medium
        .list-shortcut
            position absolute
            right 0
            top 50%
            transform translateY(-50%)
            width 20px
            padding 20px 0
            border-radius 10px
            text-align center
            background $color-background-d
            font-family Arial, Helvetica, sans-serif
            .item
                padding 3px
                line-height 1
                color $color-text-l
                font-size $font-size-small
                &.current
                    color $color-theme
        .list-fixed
            position absolute
            left 0
            top 0
            width 100%
            .fixed-title
                height 30px
                line-height 30px
                padding-left 20px
                font-size $font-size-small
                color $color-text-l
                background $color-highlight-background
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)
</style>