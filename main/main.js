import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import Notification from './components/Notification.vue'
import { useStore } from './store'

const { getters, actions } = useStore()

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: () => import('./components/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'overview',
          component: () => import('./components/Dashboard.vue')
        },
        {
          path: 'analytics',
          component: () => import('./components/Dashboard.vue')
        }
      ]
    },
    {
      path: '/chat',
      component: () => import('./components/Chat.vue'),
      meta: { 
        requiresAuth: true,
        title: '聊天'
      }
    },
    {
      path: '/users',
      component: () => import('./components/Users.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          component: () => import('./components/Users.vue')
        },
        {
          path: 'roles',
          component: () => import('./components/Users.vue')
        },
        {
          path: 'departments',
          component: () => import('./components/Users.vue')
        }
      ]
    },
    {
      path: '/settings',
      component: () => import('./components/Settings.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'basic',
          component: () => import('./components/Settings.vue')
        },
        {
          path: 'security',
          component: () => import('./components/Settings.vue')
        },
        {
          path: 'logs',
          component: () => import('./components/Settings.vue')
        }
      ]
    },
    {
      path: '/help',
      component: () => import('./components/Help.vue')
    },
    {
      path: '/feedback',
      component: () => import('./components/Feedback.vue')
    },
    {
      path: '/departments/:id',
      component: () => import('./components/Department.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = getters.isLoggedIn()
  
  // 如果需要认证且未登录
  if (requiresAuth && !isLoggedIn) {
    // 保存目标路由，登录成功后跳转
    actions.showAuth('login')
    next(false)
    return
  }
  
  // 如果已登录且访问无需认证的页面
  if (isLoggedIn && !requiresAuth) {
    // 可以根据需要重定向到仪表盘
    if (to.path === '/') {
      next('/dashboard')
      return
    }
  }
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 更新页面标题
  const title = to.meta.title || '管理系统'
  document.title = title
})

const app = createApp(App)
app.use(router)
app.mount('#app')
