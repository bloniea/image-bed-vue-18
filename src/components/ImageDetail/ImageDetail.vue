<template>
  <div class="image-detail">
    <div class="img-list" v-for="(list, index) in props.images" :key="list.sha">
      <div class="img">
        <el-image :src="config.url + list.path" fit="contain">
          <template #error>
            <el-image
              v-if="list.imgUrl"
              :src="list.imgUrl"
              fit="contain"
            ></el-image> </template
        ></el-image>
      </div>
      <div class="info">
        <div class="item">
          <slot></slot>
        </div>

        <!-- <div class="item operation" v-if="loginStatus">
          <span>操作</span>
          <div class="update-input">
            <el-input
              :class="`image-name ${borderError ? 'input-error' : ''}`"
              v-model="imageNewName"
              @change="updateInput"
              @focus="updateInput"
            />
            <el-input class="image-type" readonly :value="imageType" />
          </div>
          <div class="update-edit">
            <el-button :icon="Edit" @click="updateImage" :loading="uploading"
              >更新</el-button
            >
            <el-button :icon="Delete" @click="deleteImage">删除</el-button>
          </div>
        </div> -->
        <div class="item">
          <span>图片链接</span>
          <div class="left">
            <el-input
              :class="'urlDom' + index"
              readonly
              :value="config.url + list.path"
            />
            <el-button :icon="CopyDocument" @click="copyUrl('.urlDom' + index)"
              >复制</el-button
            >
          </div>
        </div>
        <div class="item">
          <span>HTML</span>
          <div class="left">
            <el-input
              readonly
              :class="'htmlDom' + index"
              :value="`<img src= &quot;${config.url + list.path}&quot; />`"
            />
            <el-button :icon="CopyDocument" @click="copyUrl('.htmlDom' + index)"
              >复制</el-button
            >
          </div>
        </div>
        <div class="item">
          <span>Markdown</span>
          <div class="left">
            <el-input
              :class="'mdDom' + index"
              readonly
              :value="` ![${list.name}](${config.url + list.path})`"
            />
            <el-button :icon="CopyDocument" @click="copyUrl('.mdDom' + index)"
              >复制</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import config from '@/config'
import { ref } from '@vue/runtime-core'
import { ElMessage } from 'element-plus'
interface img {
  name: string
  path: string
  sha: string
  imgUrl: string
}
const props = defineProps<{
  images: Array<img>
}>()
const copyUrl = async (className: string) => {
  const dom = <HTMLInputElement>document.querySelector(className + ' input')

  try {
    await navigator.clipboard.writeText(dom.value)
    ElMessage({
      message: '复制成功',
      type: 'success',
      duration: 1000,
    })
  } catch (error) {
    ElMessage({
      message: '复制失败，写入剪贴板的权限' + error,
      type: 'error',
    })
  }
}
</script>

<style lang="stylus" scoped>
@import './ImageDetail.styl'
</style>
