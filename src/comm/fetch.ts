import { ElMessage, ElNotification } from 'element-plus'
import config from '@/config'

const api = '/github/api'
// const api = 'https://api.github.com'
const fetchApi = async (
  url: string,
  obj: object = {},
  count: number = 0
): Promise<any> => {
  const token = window.localStorage.getItem('access_token')

  // console.log(myRequest)
  // myRequest.credentials = 'omit'
  try {
    const res: any = await fetch(api + url, {
      credentials: 'omit',
      ...obj,
      headers: {
        accept: 'application/vnd.github+json',
        Authorization: token && token != 'undefined' ? token : '',
      },
    })
    if (res.status === 500) {
      count++
      if (count >= 4) return ElMessage.error('网络超时')
      const newRes = await fetchApi(url, obj, count)
      return newRes
    }
    if (res.status === 404) {
      ElNotification({
        title: '提示',
        type: 'error',
        message: '当前授权用户与网站设置的用户名不一致或者存储库不存在',
        duration: 5000,
      })
    }
    if (res.ok) res.data = await res.json()
    return res
  } catch (err) {
    count++
    if (count >= 4) return ElMessage.error('网络超时')
    const newRes = await fetchApi(url, obj, count)
    return newRes
  }
}
// 获取文件
export const getIMagesApi = async (url: string = '') => {
  const res = await fetchApi(url)
  return res
}
// 上传文件 修改文件
export const uploadImageApi = async (url: string = '', params: object) => {
  const res = await fetchApi(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  })
  return res
}
// 删除文件
export const deleteImageApi = async (url: string = '', params: object) => {
  const res = await fetchApi(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
  })
  return res
}

export const getUserApi = async () => {
  const res = await fetchApi('/user')
  return res
}

export const getUserRepoApi = async (url: string) => {
  const res = await fetchApi(`/repos/${url}`)
  return res
}
