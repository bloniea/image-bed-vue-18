import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/main.styl'
import lazyPlugin from 'vue3-lazy'
import store from './store'

createApp(App)
  .use(lazyPlugin, {
    // loading: '@/assets/images/default.png', //图⽚加载中时显⽰的默认图⽚
    // error: '@/assets/images/error.png', //图⽚加载失败后显⽰的图⽚
  })
  .use(store)
  .use(router)
  .mount('#app')
