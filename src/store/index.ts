import config from '@/config'
import { createApp } from 'vue'
import { createStore } from 'vuex'
const status = (): Boolean => {
  const access_token = window.localStorage.getItem('access_token')
  const userInfo = window.localStorage.getItem('userInfo')

  if (
    access_token &&
    access_token !== 'undefined' &&
    userInfo &&
    userInfo !== 'undefined'
  ) {
    return true
  } else {
    return false
  }
}

const userInfo = (): any => {
  const userInfo = window.localStorage.getItem('userInfo')
  if (userInfo && userInfo !== 'undefined') {
    return JSON.parse(userInfo)
  } else {
    return null
  }
}

// const settingData = (): any => {
//   const data = window.localStorage.getItem('settingInfo')
//   if (data && data !== 'undefined') {
//     return JSON.parse(data)
//   } else {
//     return {
//       url: config.url,
//       owner: config.owner,
//       repo: config.repo,
//     }
//   }
// }
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      status: status(),
      userInfo: userInfo(),
      uploadDialogVisible: false,
      // settingInfo: settingData(),
    }
  },
  mutations: {
    showUploadDialog(state, val) {
      state.uploadDialogVisible = val
    },
    setStatus(state, val) {
      state.status = val
    },
    setUserInfo(state, val) {
      state.userInfo = val
    },
    // setSettingInfo(state, val) {
    //   state.settingInfo = val
    // },
  },
})
export default store
