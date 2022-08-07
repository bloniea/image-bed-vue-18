import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('@/views/Home/Home.vue')

const routes: Array<any> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
