<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(item,index) in songs" v-bind:key="index" v-on:click="selectItem(item,index)">
                <div class="content">
                    <h2 class="name">{{item.name}}</h2>
                    <p class="desc">{{getDesc(item)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    props:{
        songs: {
            type: Array,
            default: []
        }
    },
    data () {
      return {
      }
    },
    methods: {
        getDesc(song){
            return `${song.singer} / ${song.album}`
        },
        selectItem(song,item){
            this.$emit('select',song,item);
        }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable.styl';
    @import '~common/stylus/mixin.styl';

    .song-list
        .item
            display flex
            align-items center
            box-sizing border-box
            height 64px
            font-size $font-size-medium
            .content
                padding 30px
                .name
                    margin-bottom 10px
                    font-size $font-size-medium
                    color $color-text
                .desc
                    font-size $font-size-medium
                    color $color-text-d
</style>