<template>
    <div class="recommend">
        <div class="recommend-content">
            <!-- 这里必须要添加v-if,因为getRecommend是一个异步过程，此时直接渲染slider组件会不正常。 -->
            <div class="slider-wrapper" v-if="recommends.length>0">
                <slider>
                    <div v-for="(item,index) in recommends" v-bind:key="index">
                        <a v-bind:href="item.linkUrl">
                            <img v-bind:src="item.picUrl" alt="">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌曲推荐</h1>
                <ul>

                </ul>
            </div>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  import {getRecommend} from 'api/recommend.js';
  import Slider from 'baseComponents/slider/slider.vue';

  export default {
    data () {
      return {
        recommends: []
      }
    },
    created(){
        this._getRecommend();
    },
    methods: {
        _getRecommend(){
          getRecommend().then((res)=>{
              if(res.code === 0){
                  this.recommends = res.data.slider
              }else{

              }
          })
        }
    },
    components:{
      Slider
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>