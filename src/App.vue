<template>
  <div class="container">
    <header>
      <MyHeader></MyHeader>
    </header>
    <main>
      <router-view v-if="isRouterAlive"> </router-view>
    </main>

    <footer>©2022 bloniea. All rights reserved.</footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { provide } from '@vue/runtime-core'
import { nextTick } from 'process'
import MyHeader from './components/MyHeader/MyHeader.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
// console.log(route.query)
const isRouterAlive = ref(true)
const reload = (): void => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('reload', reload)
</script>

<style lang="stylus" scoped>
.container {
  // height 100%
  display flex
  justify-content space-between
  flex-direction column
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
    min-height 76.5vh
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
}
</style>
