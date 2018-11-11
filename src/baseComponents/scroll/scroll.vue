<template>
    <div class="scroll" ref="wrapper">
        <slot></slot>
    </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  export default {
    props:{
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        listenScroll: {
            type: Boolean,
            default: false
        }
    },
    data () {
      return {
      }
    },
    mounted(){
        // 确保dom渲染
        setTimeout(()=>{
            this._initScroll();
        },20);
    },
    methods: {
        _initScroll(){
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            });
            if(!this.$refs.wrapper){
                return
            }
            if(this.listenScroll){
                let self = this;
                this.scroll.on('scroll',(pos)=>{
                    self.$emit('scroll',pos);    
                })
            }
        },
        enable(){
            this.scroll && this.scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable();
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
        }
    },
    watch: {
        data(){
            setTimeout(()=>{
                this.refresh();
            },20);
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>