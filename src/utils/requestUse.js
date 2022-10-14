import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/getJwtToken'
import { refresh_token } from '@/api/arkUse/user'
var refresh = false
const service = axios.create({
  baseURL: process.env.VUE_APP_TEST_API,
  timeout: 50000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
service.interceptors.request.use((config) => {
  if (getToken('token') !== null) {
    config.headers['Authorization'] = getToken('token')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  const { code, token, time } = response.data
  if (code === 524) {
    setToken('token', token)
    localStorage.setItem('timeexp', time)
    localStorage.setItem('settime', new Date().getTime())
  }
  if (code === 525) {
    Message({ type: 'error', message: 'token刷新失效,请重新登陆' })
    setTimeout(() => {
      removeToken('token')
      router.push({ path: '/' })
    }, 3000)
  }
  const timeProgress = ((new Date().getTime()) - parseInt(getToken('settime'))) / (parseInt(getToken('timeexp')) - parseInt(getToken('settime')))
  // console.log(timeProgress)
  if (timeProgress > 0.75 && refresh === false) {
    refresh = true
    refresh_token({ userId: store.state.arkuser.userId }).then(res => {
      if (res.code === 524) {
        refresh = false
      }
    }).catch(error => {
      console.log(error)
    })
    return response.data
  } else {
    return response.data
  }
}, (error) => {
  console.log('error', { ...error })
  Message.error('请检查网络设置或联系管理员')
  return Promise.reject(error)
})

export default service
