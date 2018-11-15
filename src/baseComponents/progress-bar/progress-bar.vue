<template>
    <div class="progress-bar" ref="progressBar" v-on:click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" 
                v-on:touchstart.prevent="touchStartHandler"
                v-on:touchmove.prevent="touchMoveHandler"
                v-on:touchend.prevent="touchEndHandler"
                ref="progressBtn">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  import {prefixStyle} from 'common/js/dom.js';
  const progressBtnWidth = 16;
  export default {
    props:{
        percent: {
            type: Number,
            default: 0
        }
    },
    data () {
      return {
      }
    },
    watch:{
        percent(newVal){
            // 如果当前正在拖动，让percent值的改变不影响progress的width值
            if(newVal>=0 && !this.touch.initiated){
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                const offsetWidth = newVal * barWidth;
                this.offset(offsetWidth);
            }
        }
    },
    created(){
        this.touch = {};
    },
    methods:{
        /** 拖动圆点，改变进度条 */
        touchStartHandler(e){
            this.touch.initiated = true;
            this.touch.startX =  e.touches[0].pageX;
            this.touch.left = this.$refs.progress.clientWidth;
        },
        touchMoveHandler(e){
            if(!this.touch.initiated){
                return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX;
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX));
            this.offset(offsetWidth);
        },
        touchEndHandler(e){
            this.touch.initiated = false;
            this.triggerPercent();
        },
        // 点击滚动条，改变进度
        progressClick(e){
            // 当我们点击到btn时。e.offsetX获取不正确。
            // this.offset(e.offsetX);
            const rect = this.$refs.progressBar.getBoundingClientRect();
            const offsetWidth = e.pageX - rect.left;
            this.offset(offsetWidth);
            this.triggerPercent();
        },
        triggerPercent(){
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const percent = this.$refs.progress.clientWidth / barWidth;
            this.$emit('percentChange',percent);
        },        
        offset(width){
            this.$refs.progress.style.width = `${width}px`;
            this.$refs.progressBtn.style[prefixStyle('transform')] = `translate3d(${width}px,0,0)`;
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl';

    .progress-bar
        height 30px
        .bar-inner
            position relative
            top 13px
            height 4px
            background rgba(0,0,0,0.3)
            .progress
                position absolute
                height 100%
                background $color-theme
            .progress-btn-wrapper
                position absolute
                left -8px
                top -13px
                width 30px
                height 30px
                .progress-btn
                    position relative
                    top 7px
                    left 7px
                    box-sizing border-box
                    width 16px
                    height 16px
                    border 3px solid $color-text
                    border-radius 50%
                    background $color-theme
</style>