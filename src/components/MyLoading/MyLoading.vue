<template>
  <div class="loading">
    <div class="img">
      <el-image :src="config.loading_url"></el-image>
    </div>
  </div>
</template>

<script lang="ts" setup>
import config from '@/config'
</script>

<style lang="stylus" scoped>
.loading{
  width 100%
  height 80vh
  position relative
  .img{
    position: absolute
    left 50%
    top 50%
    transform: translate(-50%,-50%)
    }
  }
</style>
