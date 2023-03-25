<template>
  <div class="container">
    <header>
      <MyHeader @search="search"></MyHeader>
    </header>
    <main>
      <router-view
        v-if="isRouterAlive"
        :keyword="keyword.val"
        @clearSearch="clearSearch"
      >
      </router-view>
    </main>

    <footer>©2022 bloniea. All rights reserved.</footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { computed, provide } from '@vue/runtime-core'
import { nextTick } from 'process'
import MyHeader from './components/MyHeader/MyHeader.vue'
import { useRoute } from 'vue-router'
import home from '@/views/Home/Home.vue'
const route = useRoute()
// console.log(route.query)
const isRouterAlive = ref(true)
const reload = (): void => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
const keyword = reactive({
  val: '',
})
// 搜索内容
const search = (val: string) => {
  keyword.val = val
}
// 清楚搜索
const clearSearch = () => {
  keyword.val = ''
}
provide('reload', reload)
</script>

<style lang="stylus" scoped>
.container {
  height 100%
  display flex
  justify-content space-between
  flex-direction column
  min-height 100%
  header {
    background rgba(255, 255, 255, 0.8)
    box-sizing: border-box
  }
  main {
    height 100%
    padding 2rem
    max-width 140rem
    width 100%
    margin 0 auto
    box-sizing: border-box
  }
  footer {
    text-align center
    padding 2rem
    font-size 1.6rem
    background rgba(0, 0, 0, 0.6)
    color #ccc
    box-sizing: border-box
  }
  @media screen and (max-width 768px) {
    main {
      padding 1rem
    }
}
@media screen and (max-width 320px) {
    main {
      padding 0rem
    }
}
}
</style>
