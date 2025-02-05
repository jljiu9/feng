import * as VueRouter from 'vue-router'

const routes = [
  // { 
  //   path: '/:chapters+',
  //   component: () => import('../components/list.vue')
  //   // component: () => import('../components/list.vue')
  // },
  // { 
  //   path: '/list',
  //   component: () => import('../components/list.vue')
  // }
]

const router = VueRouter.createRouter({
  // history: VueRouter.createWebHistory(),
  history: VueRouter.createWebHistory(),
  routes,
})

export {router}