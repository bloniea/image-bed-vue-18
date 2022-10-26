<template>
  <div class="loading">
    <div class="img">
      <el-image src="https://image-cdn.bloniea.ml/images1/loading.gif"></el-image>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

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
