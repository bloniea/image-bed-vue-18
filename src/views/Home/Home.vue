<template>
  <MyLoading v-if="loading" />
  <div class="home" v-else>
    <div class="img-box" v-if="imagesData.length">
      <div
        class="img"
        v-for="list in imagesData"
        :key="list.path"
        @click="showImgDetail(list)"
      >
        <!-- <img v-lazy="config.url + list.path" /> -->
        <el-image
          :src="settingInfo.url + list.path"
          fit="cover"
          lazy
          scroll-container="#app"
          @error="imgLoadError"
        >
          <template #placeholder>
            <div class="image-placeholder">
              <el-icon><Loading /></el-icon>
            </div>
          </template>
          <template #error>
            <div class="image-error">
              <el-icon><Loading /></el-icon>
            </div> </template
        ></el-image>
        <div class="img-name">{{ list.name }}</div>
      </div>
    </div>
    <el-empty description="空空如也" v-else />
    <el-dialog
      :title="'图片信息  - ' + imgData.img.name"
      v-model="dialogVisible"
      destroy-on-close
      @close="closeImgDetail"
    >
      <ImageDetail :images="imgData.imgs"> </ImageDetail>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="deleteImage"
            v-if="loginStatus && delShow"
            type="danger"
            >删除</el-button
          >
          <el-button @click="closeImgDetail">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="uploadDialogVisible"
      title="图片上传"
      destroy-on-close
      @close="closeUploadDialog"
      :close-on-click-modal="false"
    >
      <div class="upload-img" v-if="!uploaded">
        <div class="img-box">
          <div
            class="img-list"
            v-for="item in fileData.imgs"
            :key="item.base64"
          >
            <el-image :src="item.base64" fit="cover"></el-image>
            <div class="layer" v-if="item.upload">
              <div class="uploading">
                <el-icon class="load" v-if="item.uploadStatus === 'loading'"
                  ><Loading
                /></el-icon>
                <el-icon class="success" v-if="item.uploadStatus === 'success'"
                  ><Select
                /></el-icon>
                <div class="error-box" v-if="item.uploadStatus === 'error'">
                  <el-icon class="error" @click="reUpload(item)"
                    ><Refresh
                  /></el-icon>
                  <span class="info">network error</span>
                </div>
              </div>
            </div>
          </div>

          <div class="upload-btn" v-if="fileData.imgs.length < 8">
            <el-icon class="icon"><Plus /></el-icon>
            <input
              type="file"
              accept="image/* "
              class="file"
              @change="uploadFine"
              multiple
            />
          </div>
        </div>
        <div class="submit-btn">
          <el-button type="primary" @click="uploadImg">开始上传</el-button>
        </div>
      </div>
      <div class="uploaded-images" v-else>
        <ImageDetail :images="fileData.uploadedImgs" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="continueUpload" v-if="continueBtn"
            >继续上传</el-button
          >
          <el-button @click="closeUploadDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <pagination
      :pageSize="data.page.pageSize"
      :total="data.page.total"
      :currentPage="data.page.currentPage"
      @next="currentChange"
      @prev="currentChange"
    >
    </pagination>
  </div>
</template>

<script lang="ts" setup>
import { getIMagesApi, uploadImageApi, deleteImageApi } from '@/comm/fetch'
import { reactive, ref } from '@vue/reactivity'
import config from '@/config'
import pagination from '@/components/Pagination/Pagination.vue'
import MyLoading from '@/components/MyLoading/MyLoading.vue'
import { computed, watch } from '@vue/runtime-core'
import {
  CopyDocument,
  Loading,
  Select,
  Refresh,
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useStore } from 'vuex'
import { Plus } from '@element-plus/icons-vue'
import ImageDetail from '@/components/ImageDetail/ImageDetail.vue'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
interface item {
  type: string
  path: string
  sha: string
  name: string
}
interface imagesCount {
  dir: string
  total: number
}
const settingInfo = computed(() => store.state.settingInfo)

const loading = ref(true)
const data = reactive({
  dir: [] as Array<string>,
  images: [] as Array<item>,
  page: {
    pageSize: <number>20,
    total: <number>0,
    currentPage: <number>1,
  },
  imagesCount: [] as Array<imagesCount>,
})
// 获取文件夹
const getDir = async () => {
  loading.value = true
  const url = `/repos/${settingInfo.value.owner}/${settingInfo.value.repo}/contents`

  const res = await getIMagesApi(url)
  if (!res.ok) return
  res.data.forEach((item: item) => {
    if (item.type === 'dir') {
      data.dir.push(item.path)
    }
  })
  getIMages()
}
getDir()
// 获取图片
const getIMages = async (i: number = 0) => {
  if (!data.dir[i]) {
    loading.value = false
    return
  }
  // for (let i = 0, len = data.dir.length; i < len; i++) {

  const url = `/repos/${settingInfo.value.owner}/${settingInfo.value.repo}/contents/${data.dir[i]}`
  const res = await getIMagesApi(url)

  if (res.ok) {
    data.images = data.images.concat(res.data)
    const obj = { dir: data.dir[i], total: res.data.length }
    data.imagesCount.push(obj)
  }
  i += 1
  if (data.dir.length > i) {
    await getIMages(i)
  }
  // }

  data.page.total = data.images.length
  loading.value = false
}
// 去除非图片数据
const fotmatImages = (obj: item): any => {
  const types = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg']
  const indexlastOf = obj.path.lastIndexOf('.')
  const url = indexlastOf > -1 ? obj.path.substring(indexlastOf + 1) : ''
  return types.indexOf(url) > -1
}
// 搜索
const route = useRoute()
const searchImages = (obj: item): any => {
  const keyword = route.query.keyword
  const query = keyword ? keyword : ''
  const indexof = obj.name.indexOf(query.toString())
  return indexof > -1
}
const imagesData = computed(() => {
  let images = data.images.filter(fotmatImages)
  images = images.filter(searchImages)
  return images.slice(
    (data.page.currentPage - 1) * data.page.pageSize,
    (data.page.currentPage - 1) * data.page.pageSize + data.page.pageSize
  )
})

const currentChange = (page: number) => {
  data.page.currentPage = page
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

/* ----------图片详情-------- */
interface img {
  name: string
  path: string
  sha: string
  imgUrl: string
}
const dialogVisible = ref(false)
const imgData = reactive({
  img: <img>{},
  imgs: [] as Array<img>,
})
const delShow = ref(false)
// 显示图片详情
const showImgDetail = (list: object) => {
  imgData.img = <img>list
  imgData.imgs = [imgData.img]
  dialogVisible.value = true
  delShow.value = true
}
// 图片详情dialog 关闭的回调
const closeImgDetail = () => {
  delShow.value = false
  dialogVisible.value = false
}

//
const delArraySplice = (
  arr: Array<item>,
  sha: string
): Promise<Array<item>> => {
  return new Promise((reslove) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].sha === sha) {
        arr.splice(i, 1)
        return reslove(arr)
      }
    }
  })
}
// 删除图片
const deleteImage = async () => {
  ElMessageBox.confirm('删除后无法恢复,确认删除？', '警告', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    const image = imgData.img
    const delObj = {
      sha: image.sha,
      message: 'delete',
    }
    const message = ElNotification({
      title: '提示',
      message: '正在删除，请稍后！',
      duration: 0,
    })
    const url = `/repos/${settingInfo.value.owner}/${settingInfo.value.repo}/contents/${image.path}`

    const res = await deleteImageApi(url, delObj)
    message.close()
    if (res.ok) {
      ElNotification({
        title: '提示',
        type: 'success',
        message: '删除成功',
        duration: 2000,
      })
      data.images = await delArraySplice(data.images, image.sha)

      closeImgDetail()
      // data.images.splice()
    } else {
      ElNotification({
        title: '提示',
        type: 'error',
        message: '资源已不存在',
        duration: 2000,
      })
    }
  })
}

/* -------------------------------------------------------------------- */

// 登陆状态
const loginStatus = computed(() => store.state.status)
// 上传表单的显示隐藏
const uploadDialogVisible = computed({
  get() {
    // getter
    return store.state.uploadDialogVisible
  },
  set(val) {
    // setter
  },
})
const uploaded = ref(false)
// 显示继续上传按钮
const continueBtn = ref(false)
// 继续上传
const continueUpload = () => {
  uploaded.value = false
  fileData.uploadedImgs = []
  continueBtn.value = false
}

interface imgs {
  base64: any
  name: string
  upload: boolean
  uploadStatus: string
  imgUrl: string
}
const fileData = reactive({
  imgs: [] as Array<imgs>,
  uploadedImgs: [] as Array<img>,
})
interface w {
  BASE64: any
}
// 选择本地图片方法
const uploadFine = (e: any) => {
  // fileData.imgs = []
  const files = e.target.files
  const len = files.length > 8 ? 8 : files.length
  if (files.length > 8) ElMessage.error('每次最多只能上传8张')
  if (len) {
    for (let i = 0; i < len; i++) {
      if (!/image/.test(files[i].type)) {
        ElMessage.error('请选择图片')
        break
      }
      if (files[i].size > 1024 * 1024 * 10) {
        ElMessage.error('图片不能大于10mb')
        break
      }
      const imgUrl = URL.createObjectURL(files[i])
      const reader = new FileReader()
      reader.readAsDataURL(files[i])
      reader.onload = () => {
        fileData.imgs.push({
          name: files[i].name,
          base64: reader.result,
          upload: false,
          uploadStatus: 'loading',
          imgUrl: imgUrl,
        })
      }
    }
  }
}

const urlSateBase64Encode = (base64Str: string) => {
  if (!base64Str) return
  const safeStr = window.btoa(window.atob(base64Str.replace(/^(.+,)/, '')))
  return safeStr
}

// 检查名字是否重复
const checkRepeat = async (
  name: string,
  path: string = '',
  num: number = 0
): Promise<string> => {
  return new Promise(async (reslove) => {
    const images = data.images as Array<any>
    const len = <number>images.length
    const nNum = num ? `(${num})` : ''
    let newName = <string>''
    const index = name.indexOf('.')
    const nameNum =
      index > -1
        ? name.substring(0, index) + nNum + name.substring(index)
        : name + `(${num})`
    for (let i = 0; i < len; i++) {
      if (path + '/' + nameNum === images[i].path) {
        num = num + 1
        newName =
          index > -1
            ? name.substring(0, index) + `(${num})` + name.substring(index)
            : name + `(${num})`
        reslove(await checkRepeat(name, path, num))
      }
    }
    reslove(nameNum)
  })
}
// 获取根目录文件夹文件未满1000并且能够放下要上传文件个数的文件夹
const getNotFullDir = (
  count: number,
  num: number = 1,
  name: string = ''
): Promise<string> => {
  return new Promise(async (reslove) => {
    const dir = data.imagesCount
    const len = dir.length
    const newName = name ? name : 'images' + num
    const max = 1000
    for (let i = 0; i < len; i++) {
      if (max - dir[i].total >= count) {
        return reslove(dir[i].dir)
      } else {
        for (let j = 0; j < len; j++) {
          if (newName === dir[j].dir) {
            reslove(await getNotFullDir(count, num + 1, newName))
          }
        }
      }
    }
    reslove(newName)
  })
}

// 上传图片
const uploadOneImg = async (image: imgs, len: number) => {
  const obj = {
    message: 'upload',
    content: urlSateBase64Encode(image.base64),
  }
  const path = await getNotFullDir(len)
  const name = await checkRepeat(image.name, path)
  image.upload = true
  const url = `/repos/${settingInfo.value.owner}/${settingInfo.value.repo}/contents/${path}/${name}`

  const res = await uploadImageApi(url, obj)
  if (res.ok) {
    image.uploadStatus = 'success'
    const imgObj = {
      path: res.data.content.path,
      name: res.data.content.name,
      sha: res.data.content.sha,
      imgUrl: image.imgUrl,
      type: res.data.content.type,
    }
    fileData.uploadedImgs.push(imgObj)
    data.images.unshift(imgObj)
  } else {
    image.uploadStatus = 'error'
  }
}
// 出差，重新上传
const reUpload = async (item: imgs) => {
  item.uploadStatus = 'loading'
  await uploadOneImg(item, 1)
}
// 开始上传
const uploadImg = async () => {
  const images = fileData.imgs
  const len = fileData.imgs.length
  if (!len) return

  for (let i = 0; i < len; i++) {
    await uploadOneImg(images[i], len)
  }
  if (fileData.uploadedImgs.length === len) {
    fileData.imgs = []
    uploaded.value = true
    continueBtn.value = true
  }
}

// 关闭上传表单
const closeUploadDialog = () => {
  store.commit('showUploadDialog', false)
  uploaded.value = false
  fileData.imgs = []
  fileData.uploadedImgs = []
  continueBtn.value = false
}
const imgLoadError = async (e: any) => {
  // e.target.src = e.target.src
  try {
    const r = await fetch(e.target.src)
    if (r.status === 404) {
      e.target.src = e.target.src
    }
  } catch (err) {
    // console.log(err)
  }
}
</script>

<style lang="stylus" scoped>
@import './Home.styl'
</style>
