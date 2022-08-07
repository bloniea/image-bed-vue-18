import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/main.styl'
import store from './store'
import config from './config'
let title = config.title
const titleChange = () => {
  let keyList = title.split('') as Array<string>
  let firstChar = <string>keyList.shift()
  keyList.push(firstChar)
  title = keyList.join('')
  document.title = title
}
setInterval(titleChange, 200)
createApp(App).use(store).use(router).mount('#app')
