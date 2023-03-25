<template>
  <div class="header">
    <div class="name-box">
      <div class="name" @click="toHome">bloniea 姉さま的图床</div>
    </div>

    <div class="btns">
      <div class="item">
        <el-input
          class="search"
          v-model="keyword"
          placeholder="search"
          :suffix-icon="Search"
          @keyup.enter="toSearch"
        />
      </div>

      <div class="item pc" v-if="loginStatus">
        <div class="upload" @click="uploadDialogVisible">
          <el-icon> <UploadFilled /> </el-icon>上传
        </div>
      </div>

      <div class="item pc" v-if="loginStatus">
        <el-dropdown trigger="hover">
          <div class="avatar">
            <el-avatar :src="userInfo.avatar_url" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toMyRepo(userInfo.html_url)"
                >{{ userInfo.user }}的存储库</el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="item app" v-if="loginStatus">
        <el-dropdown trigger="click">
          <span class="user">
            <div class="avatar">
              <el-avatar :src="userInfo.avatar_url" />
            </div>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toMyRepo(userInfo.html_url)"
                >{{ userInfo.user }}的存储库</el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="uploadDialogVisible"
                >上传</el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="item" v-if="!loginStatus || !userInfo">
        <div @click="login" class="login">登陆</div>
      </div>
      <!-- <div class="item menu app">
        <el-dropdown trigger="click">
          <el-icon>
            <Menu />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="uploadDialogVisible">
                <el-icon> <UploadFilled /> </el-icon>上传
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import QS from 'qs'
import {
  UploadFilled,
  ArrowDown,
  Search,
  Menu,
  Tools,
} from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, reactive, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { getUserApi, getUserRepoApi, getTokenApi } from '@/comm/fetch'
import config from '@/config.js'
const store = useStore()
const loginStatus = computed(() => store.state.status)
const userInfo = computed(() => store.state.userInfo)

const login = async () => {
  const obj = {
    client_id: config.client_id,
    redirect_uri: window.location.href,
    state: new Date().getTime(),
    scope: config.scope,
  }

  window.location.href =
    'https://github.bloniea.ml/login/oauth/authorize?' + QS.stringify(obj)
  // const res = await fetch('https://github.com/login/oauth/authorize?'+QS.stringify(obj))
}
const route = useRoute()
const router = useRouter()
const getCode = async () => {
  const search: string = window.location.search
  const ind: number = search.indexOf('?')
  if (ind < 0) return
  const searchObj = QS.parse(search.substring(ind + 1))
  if (searchObj.code && searchObj.state) {
    window.sessionStorage.setItem('code', searchObj.code)
    delete searchObj.code
    delete searchObj.state
    const name = route.name
    router.push({ name: <any>name, query: searchObj })
  }
}
getCode()

const getUser = async () => {
  const res = await getUserApi()
  if (res.ok) {
    const userInfo = {
      user: res.data.name,
      html_url: res.data.html_url,
      avatar_url: res.data.avatar_url,
    }
    window.localStorage.setItem('userInfo', JSON.stringify(userInfo))

    store.commit('setStatus', true)
    store.commit('setUserInfo', userInfo)
  }
}

const getToken = async () => {
  const code = window.sessionStorage.getItem('code')
  if (code && code != 'undefined') {
    const obj = {
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: window.location.href,
      code: code,
    }
    window.sessionStorage.removeItem('code')
    const result = await getTokenApi('/login/oauth/access_token', obj)
    if (result.ok) {
      if (result.data.token_type && result.data.access_token) {
        window.localStorage.setItem(
          'access_token',
          result.data.token_type + ' ' + result.data.access_token
        )
        await getUser()
      } else {
        ElMessage.error('网络超时请重新授权')
      }
    }
  }
}
getToken()

// 显示上传表单
const uploadDialogVisible = () => {
  store.commit('showUploadDialog', true)
}

const keyword = ref('')
const emit = defineEmits(['search'])
// 搜索
const toSearch = () => {
  emit('search', keyword.value)
  // router.push({ name: 'Home', query: { keyword: keyword.value } })
}
// 返回主页
const toHome = () => {
  router.push('/')
}

const logout = () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('userInfo')
  store.commit('setStatus', false)
}
const toMyRepo = (url: string) => {
  window.open(url)
}
</script>

<style lang="stylus" scoped>
@import './MyHeader.styl'
</style>
