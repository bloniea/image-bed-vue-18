<template>
  <div class="pagination">
    <div class="prev" v-if="props.currentPage > 1" @click="prev">prev</div>
    <div
      class="next"
      @click="next"
      v-if="props.pageSize * props.currentPage < props.total"
    >
      next
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
const props = defineProps({
  pageSize: {
    type: Number,
    default: 20,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['next', 'prev'])
const next = () => {
  let page = props.currentPage
  page = props.pageSize * props.currentPage < props.total ? page + 1 : page
  emit('next', page)
}
const prev = () => {
  let page = props.currentPage
  page = page > 1 ? page - 1 : page
  emit('prev', page)
}
</script>

<style lang="stylus" scoped>
.pagination {
  display flex
  justify-content center
  font-size: 1.7rem
  div{
    margin  1rem
    width 8rem
    height 4rem
    background #f75975
    line-height 4rem
    cursor pointer
    text-align center
    color #fff
    &:hover{
       background #eb8c9d
      }
    }
}
</style>
