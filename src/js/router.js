//弃用
import * as VueRouter from 'vue-router'

const routes = [
  {
      path: '/:pathMatch(.*)*', // 捕获所有路径，避免 No match found 的警告
      component: () => import('../App.vue') // 指向主组件，在组件中动态处理路由
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

export {router}