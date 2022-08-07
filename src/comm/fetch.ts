import { ElMessage, ElNotification } from 'element-plus'
const github = '/github'
const api = '/github/api'
// const api = 'https://api.github.com'
const fetchApi = async (
  url: string,
  obj: object = {},
  count: number = 0
): Promise<any> => {
  const token = window.localStorage.getItem('access_token')

  try {
    const res: any = await fetch(url, {
      credentials: 'omit',
      ...obj,
      headers: {
        accept: 'application/vnd.github+json',
        Authorization: token && token != 'undefined' ? token : '',
        'Content-Type': 'application/json;charset=utf-8',
      },
    })

    if (res.status === 500) {
      count++
      if (count >= 4) return ElMessage.error('网络不好哦,刷新再试试吧')
      const newRes = await fetchApi(url, obj, count)
      return newRes
    }
    if (res.status === 404) {
      ElNotification({
        title: '提示',
        type: 'error',
        message:
          '资源不存在，请检查当前授权用户与网站设置,上传和删除功能需要等待时间刷新',
        duration: 5000,
      })
    }
    if (res.ok) res.data = await res.json()
    return res
  } catch (err) {
    console.log(err)
    count++
    if (count >= 4) return ElMessage.error('网络不好哦,刷新再试试吧')
    const newRes = await fetchApi(url, obj, count)
    return newRes
  }
}

// 获取token
export const getTokenApi = async (url: string, params: object) => {
  const res = await fetchApi(github + url, {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return res
}
// 获取文件
export const getIMagesApi = async (url: string = '') => {
  const res = await fetchApi(api + url)
  return res
}
// 上传文件 修改文件
export const uploadImageApi = async (url: string = '', params: object) => {
  const res = await fetchApi(api + url, {
    method: 'PUT',
    body: JSON.stringify(params),
  })
  return res
}
// 删除文件
export const deleteImageApi = async (url: string = '', params: object) => {
  const res = await fetchApi(api + url, {
    method: 'DELETE',
    body: JSON.stringify(params),
  })
  return res
}

export const getUserApi = async () => {
  const res = await fetchApi(api + '/user')
  return res
}

export const getUserRepoApi = async (url: string) => {
  const res = await fetchApi(`${api}/repos/${url}`)
  return res
}
