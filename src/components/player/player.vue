<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal" 
                v-on:enter="enter"
                v-on:after-enter="afterEnter"
                v-on:leave="leave"
                v-on:after-leave="afterLeave">
            <div class="normal-player" v-show="fullscreen">
                <div class="background">
                    <img :src="currentSong.image" width="100%" height="100%" alt="">
                </div>
                <div class="top">
                    <div class="back" v-on:click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{currentSong.name}}</h1>
                    <h2 class="subtitle">{{currentSong.singer}}</h2>
                </div>
                <div class="middle" 
                        @touchstart = "middleTouchStart"
                        @touchmove = "middleTouchMove"
                        @touchend = "middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" v-bind:class="cdClass">
                                <img :src="currentSong.image" class="image" alt="">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                    class="text"
                                    v-for="(line,index) in currentLyric.lines"
                                    v-bind:key="index"
                                    :class="{'current':currentLineNum === index}">
                                    {{line.txt}}
                                </p>
                            </div>
                        </div> 
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" v-on:percentChange="percentChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" v-bind:class="disabledClass">
                            <i class="icon-prev" v-on:click="prevSong"></i>
                        </div>
                        <div class="icon i-center">
                            <i v-on:click="togglePlaying" v-bind:class="playIcon"></i>
                        </div>
                        <div class="icon i-right" v-bind:class="disabledClass">
                            <i class="icon-next" v-on:click="nextSong"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullscreen" v-on:click="open">
                <div class="icon">
                    <img :src="currentSong.image" width="40" height="40" alt="" v-bind:class="cdClass"/>
                </div>
                <div class="text">
                    <h2 class="name">{{currentSong.name}}</h2>
                    <p class="desc">{{currentSong.singer}}</p>
                </div>
                <div class="control">
                    <progress-circle :radius="32" :percent="percent">
                        <i :class="miniPlayIcon" class="mini-icon" v-on:click.stop="togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <!-- 歌曲加载完成，可以播放时，触发canplay事件 -->
        <audio :src="currentSong.url" ref="audio" 
               v-on:canplay="ready"
               v-on:error="error"
               v-on:timeupdate="updateTime"
               v-on:ended="end">
        </audio>
    </div>   
</template>

<script type='text/ecmascript-6'>
  import {mapGetters,mapMutations} from 'vuex';
  import animations from 'create-keyframe-animation';
  import {prefixStyle} from 'common/js/dom.js';
  import ProgressBar from 'baseComponents/progress-bar/progress-bar.vue';
  import ProgressCircle from 'baseComponents/progress-circle/progress-circle.vue';
  import {playMode} from 'common/js/config.js';
  import {shuffle} from 'common/js/util.js';
  import Lyric from 'lyric-parser';
  import Scroll from 'baseComponents/scroll/scroll.vue';

  export default {
    data () {
      return {
          songReady: false,
          currentTime: 0,
          currentLyric: null,
          currentLineNum: 0,
          currentShow: 'cd',
          playingLyric: ''
      }
    },
    // 映射到computed上
    computed: {
        // 根据state中的playing的状态，设置播放图片，是播放，还是暂停
        playIcon(){
            return this.playing ? 'icon-pause' : 'icon-play';
        },
        miniPlayIcon(){
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
        },
        // 根据当前的播放状态，控制cd的滚动
        cdClass(){
            return this.playing ? 'play' : 'play pause'
        },
        disabledClass(){
            return this.ready ? '' : 'disabled';
        },
        percent(){
            return this.currentTime / this.currentSong.duration;
        },
        iconMode(){ 
            if(this.mode === playMode.sequence){
                return 'icon-sequence';
            }else if(this.mode === playMode.loop){
                return 'icon-loop';
            }else{
                return 'icon-random';
            }
        },
        ...mapGetters([
            'fullscreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    components:{
        ProgressBar,
        ProgressCircle,
        Scroll
    },
    created(){
        // 不需要和dom关联的属性只需要在created钩子内初始化
        this.touch = {};
    },
    methods: {
      back(){
          this.setFullScreen(false)
      },
      open(){
          this.setFullScreen(true);
      },
      togglePlaying(){
          if(!this.songReady){
              return
          }
          this.setPlayingState(!this.playing);
          if(this.currentLyric) {
              this.currentLyric.togglePlay();
          }
      },
      prevSong(){
        //   在快速点击歌曲时，由于上一个歌曲还没有加载完毕，直接切歌会报错，
        // Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.
        // 这里设置一个标志位，当只有当前歌曲加载完毕，可以播放时，才可以切歌。
          if(!this.songReady){
              return
          }
          if(this.playList.length === 1){
              this.loop();
          }else{
            let index = this.currentIndex - 1;
            if(index === -1){
                index = this.playList.length-1;
            }
            this.setCurrentIndex(index);
            // 切歌时，如果是暂停状态，需要切换成播放状态。
            if(!this.playing){
                this.togglePlaying();
            }
          }

          this.songReady = false;
      },
      nextSong(){
          if(!this.songReady){
              return
          }
          if(this.playList.length === 1){
              this.loop();
          }else{
            let index = this.currentIndex + 1;
            if(index === this.playList.length){
                index = 0;
            }
            this.setCurrentIndex(index);
            if(!this.playing){
                this.togglePlaying();
            }   
          }
          this.songReady = false;

      },
      // 当歌曲加载成功
      ready(){
          this.songReady = true
      },
      // 当歌曲加载失败
      error(){
          this.songReady = true; // 防止因为歌曲加载失败，而不让用户上下切歌
      },
      updateTime(e){
          this.currentTime = e.target.currentTime;
      },
      // 滚动条的拖动回调函数
      percentChange(percent){
          const currentTime = this.currentSong.duration * percent;
          this.$refs.audio.currentTime = this.currentSong.duration * percent;
          if(!this.playing){
              this.togglePlaying();
          }
          if(this.currentLyric){
              this.currentLyric.seek(currentTime * 1000);
          }
      },
      changeMode(){
          const mode = (this.mode+1)%3;
          this.setPlayMode(mode);
        //   因为sequenceList是一个引用类型，修改这个值必须使用vuex的mutation，不能再外部修改
          let list = null
          if(mode === playMode.random){
              list = shuffle(this.sequenceList);
          }else{
              list = this.sequenceList;
          }
          console.log(list);
          this.resetCurrentIndex(list);
          this.setPlayList(list);
      },
      resetCurrentIndex(list){
          let index = list.findIndex((item)=>{
              return item.id === this.currentSong.id
          });
          this.setCurrentIndex(index);
      },
      // 歌曲播放完毕回调
      end(){
          if(this.mode === playMode.loop){
              this.loop();
          }else{
              this.nextSong();
          }  
      },
      loop(){
          this.$refs.audio.currentTime = 0;
          this.$refs.audio.play();
          if(this.currentLyric){
              this.currentLyric.seek(0);
          }
      },
      getLyric(mid){
          this.currentSong.getLyric(mid).then((lyric)=>{
              this.currentLyric = new Lyric(lyric,this.lyricHandler);
              if(this.playing){
                  this.currentLyric.play();
              }
          }).catch(()=>{
              this.currentLyric = null;
              this.playingLyric = '';
              this.currentLineNum = 0;
          })
      },
      lyricHandler({lineNum, txt}){
        //   console.log(lineNum,txt);
          this.currentLineNum = lineNum;

          if(lineNum>5){
              let lineEl = this.$refs.lyricLine[lineNum - 5];
              this.$refs.lyricList.scrollToElement(lineEl,1000);
          }else{
              this.$refs.lyricList.scrollTo(0,0,1000);
          }

          this.playingLyric = txt;
      },
      // 当CSS3动画中的值是计算而来的时候，就需要使用vue的过度钩子函数
      enter(el,done){
          const {x,y,scale} = this._getPosAndScale();
          let animation = {
              0: {
                  transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
              },
              60: {
                  transform: `translate3d(0,0,0) scale(1.1)`
              },
              100: {
                  transform: `translate3d(0,0,0) scale(1)`
              }
          }
          animations.registerAnimation({
              name : 'move',
              animation: animation,
              preset: {
                  duration: 400,
                  easing: 'linear'
              }
          })
          animations.runAnimation(this.$refs.cdWrapper,'move',done);
      },
      afterEnter(){
          animations.unregisterAnimation('move');
          this.$refs.cdWrapper.style.animation = '';
      },
      leave(el,done){
          this.$refs.cdWrapper.style.transition = 'all 0.4s';
          const {x,y} = this._getPosAndScale();
          this.$refs.cdWrapper.style[prefixStyle('transform')] = `translate3d(${x}px,${y}px,0)`;
          this.$refs.cdWrapper.addEventListener('transitionend',done);
      },
      afterLeave(){
          this.$refs.cdWrapper.style.transition = '';
          this.$refs.cdWrapper.style[prefixStyle('transform')] = '';
      },
      _getPosAndScale(){
          const targetWidth = 40;
          const paddingLeft = 40;
          const paddingBottom = 30;
          const paddingTop = 80;
          const width = window.innerWidth*0.8;
          const scale = targetWidth / width;
          // x轴偏移的距离
          const x = -(window.innerHeight/2 - paddingLeft);
          // y轴偏移的距离
          const y = window.innerHeight - paddingTop - width/2 - paddingBottom;

          return {
              x,
              y,
              scale
          }
      },
      formatTime(time){
          time = time | 0; // 向下取整
          const minutes = time / 60 | 0;
          const second = this.pad(time % 60 | 0);
          return `${minutes}:${second}`
      },
      pad(number,n=2){
          let len =  number.toString().length
          while(len < n){
              number = '0'+number;
              len++;
          }
          return number;
      },
      middleTouchStart(e){
        //   用来控制，必须在middle上touchstart
          this.touch.initiated = true;
          const touches = e.touches[0];
          this.touch.startX = touches.pageX;
          this.touch.startY = touches.pageY;
      },
      middleTouchMove(e){
          if(!this.touch.initiated){
              return
          }
          const touches = e.touches[0];
          let deltaX = touches.pageX - this.touch.startX;
          let deltaY = touches.pageY - this.touch.startY;
          if(Math.abs(deltaY) > Math.abs(deltaX)){
              return
          }
          const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
          const offsetWidth =Math.min(0, Math.max(-window.innerWidth,deltaX+left));
          this.touch.percent = deltaX / window.innerWidth;
          this.$refs.lyricList.$el.style[prefixStyle('transform')] = `translate3d(${offsetWidth}px,0,0)`;
          this.$refs.lyricList.$el.style[prefixStyle('transitionDuration')] = '';  // 重置回来

          if(this.currentShow === 'cd' && this.touch.percent < 0) {
                this.$refs.middleL.style.opacity = 1- Math.abs(this.touch.percent);
          }
          if(this.currentShow === 'lyric' && this.touch.percent>0){
              this.$refs.middleL.style.opacity = this.touch.percent;
          }
      },
      middleTouchEnd(e){
          let offsetWidth;
          if(this.currentShow === 'cd'){
              if(this.touch.percent>0){
                  return
              }else if(Math.abs(this.touch.percent)>0.1){
                  offsetWidth = -window.innerWidth;
                  this.currentShow = 'lyric';
                  this.$refs.middleL.style.opacity = 0;
              }else{
                  offsetWidth = 0;
                  this.$refs.middleL.style.opacity = 1;
              }
          }else{
              if(this.touch.percent < 0){
                  return
              }else if(this.touch.percent > 0.1){
                  offsetWidth = 0;
                  this.currentShow = 'cd';
                  this.$refs.middleL.style.opacity = 1;
              }else{
                  offsetWidth = -window.innerHeight;
                  this.$refs.middleL.style.opacity = 0;
              }
          }
          this.$refs.lyricList.$el.style[prefixStyle('transform')] = `translate3d(${offsetWidth}px,0,0)`;
          this.$refs.lyricList.$el.style[prefixStyle('transitionDuration')] = '0.5s';
      },
      ...mapMutations({
          setFullScreen: 'SET_FULL_SCREEN',
          setPlayingState: 'SET_PLAYING_STATE',
          setCurrentIndex: 'SET_CURRENT_INDEX',
          setPlayMode: 'SET_PLAY_MODE',
          setPlayList: 'SET_PLAYLIST'
      })
    },
    watch:{
        currentSong(newSong,oldSong){
            // 随机播放会改变当前的歌曲的index，紧接着就会改变currentSong。
            // 实际上currentSong的值还是原来的歌。
            // 此时应该保持原来歌曲的播放状态。
            if(newSong.id === oldSong.id){
                return;
            }
            // 歌词是用定时器实现滚动的，当切换歌曲，停止之前的定时器。
            if(this.currentLyric){
                this.currentLyric.stop();
            }
            this.$nextTick(()=>{
                this.$refs.audio.play();
                this.getLyric(this.currentSong.mid);
            });
        },
        // 根据playing值，进行播放，暂停歌曲。
        playing(newPlaying){
            const audio = this.$refs.audio;
            this.$nextTick(()=>{
                newPlaying ? audio.play() : audio.pause();
            });      
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl';
    @import '~common/stylus/mixin.styl';
    .player
        .normal-player
            position fixed
            left 0
            top 0
            bottom 0
            right 0
            z-index 150
            background $color-background
            .background
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                z-index -1
                opacity 0.6
                filter blur(20px)
            .top
                position relative
                margin-bottom 25px
                .back
                    position absolute
                    top 0
                    left 6px
                    z-index 50
                    .icon-back
                        display block
                        padding 9px
                        font-size $font-size-large-x
                        color $color-theme
                        transform rotate(-90deg)
                .title
                    width 70%
                    margin 0 auto 
                    height 40px
                    line-height 40px
                    text-align center
                    no-wrap()
                    font-size $font-size-large
                    color $color-text
                .subtitle
                    line-height 20px
                    text-align center
                    font-size $font-size-medium
                    color $color-text
            .middle
                position fixed
                width 100%
                top 80px
                bottom 170px
                white-space nowrap
                font-size 0
                .middle-l
                    display inline-block
                    vertical-align top
                    position relative
                    width 100%
                    height 0
                    padding-top 80%
                    .cd-wrapper
                        position absolute
                        left 10%
                        top 0
                        width 80%
                        height 100%
                        .cd
                            width 100%
                            height 100%
                            box-sizing border-box
                            border 10px solid rgba(255,255,255,0.1)
                            border-radius 50%
                            &.play
                                animation rotate 20s linear infinite 
                            &.pause
                                animation-play-state paused
                            .image
                                position absolute
                                left 0
                                top 0
                                width 100%
                                height 100%
                                border-radius 50%
                    .playing-lyric-wrapper
                        width 80%
                        margin 30px auto 0
                        overflow hidden
                        text-align center
                        .playing-lyric
                            height 20px
                            line-height 20px
                            font-size $font-size-medium
                            color $color-text-l
                .middle-r
                    display inline-block
                    vertical-align top
                    width 100%
                    height 100%
                    overflow hidden
                    .lyric-wrapper
                        width 80%
                        margin 0 auto
                        overflow hidden
                        text-align center
                        .text
                            line-height 32px
                            color $color-text-l
                            font-size $font-size-medium
                            &.current
                                color $color-text
            .bottom
                position absolute
                bottom 50px
                width 100%
                .dot-wrapper
                    text-align center
                    font-size 0
                    .dot
                        display inline-block
                        vertical-align middle
                        margin 0 4px
                        width 8px
                        height 8px
                        border-radius 50%
                        background $color-text-l
                        &.active
                            width 20px
                            border-radius 5px
                            background $color-text-ll
                .progress-wrapper
                    display flex
                    align-items center
                    width 80%
                    margin 0 auto
                    padding 10px 0
                    .time
                        color $color-text
                        font-size $font-size-small
                        flex 0 0 30px
                        width 30px
                        line-height 30px
                        &.time-l
                            text-align left 
                        &.time-r
                            text-align right
                    .progress-bar-wrapper
                        flex 1
                .operators
                    display flex
                    align-items center
                    .icon
                        flex 1
                        color $color-theme
                        i 
                            font-size 30px
                        &.disabled
                            color $color-theme-d
                    .i-left
                        text-align right 
                    .i-center
                        padding 0 20px
                        text-align center
                        i 
                            font-size 40px
                    .i-right
                        text-align left 
                    .icon-favorite
                        color $color-sub-theme
        .mini-player
            position fixed
            left 0
            bottom 0
            z-index 180
            width 100%
            height 60px
            display flex
            align-items center
            background $color-highlight-background
            .icon 
                flex 0 0 40px
                width 40px
                padding 0 10px 0 20px
                img 
                    border-radius 50%
                    &.play
                        animation rotate 20s linear infinite 
                    &.pause
                        animation-play-state paused
            .text
                display flex
                flex-direction column
                justify-content center
                flex 1
                line-height 20px
                overflow hidden
                .name
                    margin-bottom 2px
                    no-wrap()
                    font-size $font-size-medium
                    color $color-text 
                .desc
                    no-wrap()
                    font-size $font-size-small
                    color $color-text-d
            .control
                flex 0 0 30px
                width 30px
                padding 0 10px
                .icon-playlist,.icon-play-mini, .icon-pause-mini
                    font-size 30px
                    color $color-theme-d
                .mini-icon
                    position absolute
                    left 0
                    top 0
                    font-size 32px
    /*动画*/
    .normal-enter-active,.normal-leave-active
        transition all 0.4s
        .top, .bottom
            transition all 1s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    .normal-enter,.normal-leave-to
        opacity 0
        .top
            transform translate3d(0,-100px,0)
        .bottom
            transform translate3d(0,100px,0)

    .mini-enter-active,.mini-leave-active
        transition all 0.4s
    .mini-enter,.mini-leave-to  
        opacity 0

    @keyframes rotate 
        0% 
            transform rotate(0)
        100% 
            transform rotate(360deg)
    
</style>