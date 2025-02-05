<!-- App.vue -->
<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground antialiased">
    <!-- 通知组件 -->
    <Notification />
    
    <!-- 侧边栏 -->
    <div class="hidden md:block">
      <AppSidebar :current-path="globalState.currentPath" />
    </div>
    
    <!-- 移动端菜单按钮 -->
    <button 
      class="fixed left-4 top-3 z-50 rounded-md p-2 text-muted-foreground hover:bg-muted/50 md:hidden"
      @click="toggleMobileMenu"
    >
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path v-if="isMobileMenuOpen" d="M6 18L18 6M6 6l12 12" />
        <path v-else d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- 移动端侧边栏 -->
    <div 
      v-show="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
      @click="closeMobileMenu"
    >
      <div 
        class="absolute left-0 top-0 h-full w-64 bg-background shadow-lg"
        @click.stop
      >
        <AppSidebar :current-path="globalState.currentPath" />
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="relative flex-1 flex flex-col overflow-hidden">
      <!-- 加载状态 -->
      <div 
        v-if="isLoading"
        class="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm"
      >
        <svg class="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </div>
      
      <!-- 头部区域 -->
      <div class="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex items-center justify-between px-4 py-3 md:px-6">
          <!-- 面包屑导航 -->
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <router-link 
              v-for="(crumb, index) in globalState.breadcrumbs" 
              :key="crumb.path"
              :to="crumb.path"
              class="hover:text-foreground"
            >
              {{ crumb.name }}
              <span v-if="index < globalState.breadcrumbs.length - 1" class="ml-2">/</span>
            </router-link>
          </div>

          <!-- 用户操作区 -->
          <div class="flex items-center gap-2">
            <template v-if="!getters.isLoggedIn()">
              <button 
                class="rounded-md px-3 py-1 text-xs hover:bg-muted/50"
                @click="() => actions.showAuth('register')"
              >
                注册
              </button>
              <button 
                class="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                @click="() => actions.showAuth('login')"
              >
                登录
              </button>
            </template>
            <template v-else>
              <span class="text-xs">欢迎，{{ getters.user()?.name || getters.user()?.username }}</span>
              <button 
                class="rounded-md px-3 py-1 text-xs hover:bg-muted/50"
                @click="handleLogout"
              >
                退出
              </button>
            </template>
          </div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="flex-1 min-h-0 overflow-auto">
        <div class="px-4 py-3 md:px-6 h-full">
          <router-view v-slot="{ Component }">
            <transition 
              name="fade" 
              mode="out-in"
              enter-active-class="transition-opacity duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <!-- 认证弹窗 -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="authState.showAuthModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <div 
          class="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
          @click.stop
        >
          <!-- 标题 -->
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-lg font-medium">{{ authState.authMode === 'login' ? '登录' : '注册' }}</h2>
            <button 
              class="rounded-md p-1 hover:bg-muted/50"
              @click="actions.hideAuth"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- 表单 -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="mb-1.5 block text-xs">用户名</label>
              <input 
                type="text"
                v-model="form.username"
                class="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm"
                :class="{ 'border-red-500': formErrors.username }"
                placeholder="请输入用户名"
              />
              <div v-if="formErrors.username" class="mt-1 text-xs text-red-500">
                {{ formErrors.username }}
              </div>
            </div>
            
            <div v-if="authState.authMode === 'register'">
              <label class="mb-1.5 block text-xs">姓名</label>
              <input 
                type="text"
                v-model="form.name"
                class="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm"
                :class="{ 'border-red-500': formErrors.name }"
                placeholder="请输入姓名"
              />
              <div v-if="formErrors.name" class="mt-1 text-xs text-red-500">
                {{ formErrors.name }}
              </div>
            </div>
            
            <div>
              <label class="mb-1.5 block text-xs">密码</label>
              <input 
                type="password"
                v-model="form.password"
                class="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm"
                :class="{ 'border-red-500': formErrors.password }"
                placeholder="请输入密码"
              />
              <div v-if="formErrors.password" class="mt-1 text-xs text-red-500">
                {{ formErrors.password }}
              </div>
            </div>
            
            <div v-if="authState.authMode === 'register'">
              <label class="mb-1.5 block text-xs">确认密码</label>
              <input 
                type="password"
                v-model="form.confirmPassword"
                class="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm"
                :class="{ 'border-red-500': formErrors.confirmPassword }"
                placeholder="请再次输入密码"
              />
              <div v-if="formErrors.confirmPassword" class="mt-1 text-xs text-red-500">
                {{ formErrors.confirmPassword }}
              </div>
            </div>
            
            <button 
              type="submit"
              class="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              :disabled="isLoading"
            >
              <template v-if="!isLoading">
                {{ authState.authMode === 'login' ? '登录' : '注册' }}
              </template>
              <template v-else>
                {{ authState.authMode === 'login' ? '登录中...' : '注册中...' }}
              </template>
            </button>
            
            <div class="text-center text-xs">
              <template v-if="authState.authMode === 'login'">
                还没有账号？
                <button 
                  type="button"
                  class="text-primary hover:underline"
                  @click="actions.setAuthMode('register')"
                >
                  立即注册
                </button>
              </template>
              <template v-else>
                已有账号？
                <button 
                  type="button"
                  class="text-primary hover:underline"
                  @click="actions.setAuthMode('login')"
                >
                  立即登录
                </button>
              </template>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import Notification from './components/Notification.vue'
import { useStore } from './store'
import { useApi } from './api'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const theme = ref(localStorage.getItem('theme') || 'system')
const isLoading = ref(false)

const { state, actions, getters } = useStore()
const api = useApi()

// 认证状态
const authState = computed(() => getters.authState())
const isLoadingAuth = computed(() => getters.isLoading())

// 提供全局状态
const globalState = ref({
  currentPath: route.path,
  breadcrumbs: [],
  pageTitle: '',
  loading: false,
  theme: theme.value
})

// 更新面包屑和页面标题
const updatePageInfo = (route) => {
  try {
    const paths = route.path.split('/').filter(Boolean)
    const breadcrumbs = paths.map((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/')
      const matchedRoute = router.resolve(fullPath).matched[0]
      return {
        name: matchedRoute?.meta?.title || path.charAt(0).toUpperCase() + path.slice(1),
        path: fullPath
      }
    })
    
    globalState.value.breadcrumbs = breadcrumbs
    globalState.value.pageTitle = breadcrumbs[breadcrumbs.length - 1]?.name || 'Dashboard'
  } catch (error) {
    console.error('更新页面信息失败:', error)
  }
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  globalState.value.currentPath = newPath
  updatePageInfo(route)
  closeMobileMenu()
})

// 监听加载状态
watch(() => globalState.value.loading, (newValue) => {
  isLoading.value = newValue
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 主题切换
const setTheme = (newTheme) => {
  theme.value = newTheme
  globalState.value.theme = newTheme
  
  try {
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    localStorage.setItem('theme', newTheme)
  } catch (error) {
    console.error('设置主题失败:', error)
  }
}

// 监听系统主题变化
const handleSystemThemeChange = (e) => {
  if (theme.value === 'system') {
    document.documentElement.classList.toggle('dark', e.matches)
  }
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置加载状态
  globalState.value.loading = true
  
  // 检查路由权限等
  if (to.meta.requiresAuth) {
    // 这里添加权限检查逻辑
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  next()
})

router.afterEach(() => {
  // 重置加载状态
  globalState.value.loading = false
})

onMounted(() => {
  // 初始化主题
  setTheme(theme.value)
  updatePageInfo(route)
  
  // 初始化认证状态
  actions.initAuth()
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  // 清理事件监听
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
})

// 导出主题相关方法供其他组件使用
const themeUtils = {
  currentTheme: theme,
  setTheme
}

// 提供全局状态和工具方法
provide('globalState', globalState)
provide('themeUtils', themeUtils)

defineExpose({
  themeUtils
})

// 表单数据
const form = ref({
  username: '',
  name: '',
  password: '',
  confirmPassword: ''
})

// 表单错误
const formErrors = ref({})

// 表单验证
const validateForm = () => {
  const errors = {}
  
  if (!form.value.username) {
    errors.username = '请输入用户名'
  }
  
  if (authState.value.authMode === 'register' && !form.value.name) {
    errors.name = '请输入姓名'
  }
  
  if (!form.value.password) {
    errors.password = '请输入密码'
  } else if (form.value.password.length < 6) {
    errors.password = '密码长度不能小于6位'
  }
  
  if (authState.value.authMode === 'register') {
    if (!form.value.confirmPassword) {
      errors.confirmPassword = '请确认密码'
    } else if (form.value.password !== form.value.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
    }
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    const data = {
      username: form.value.username,
      password: form.value.password
    }
    
    if (authState.value.authMode === 'register') {
      data.name = form.value.name
      const res = await api.auth.register(data)
      actions.setToken(res.token)
      actions.setUser(res.user)
    } else {
      const res = await api.auth.login(data)
      actions.setToken(res.token)
      actions.setUser(res.user)
    }
    
    // 清空表单
    form.value = {
      username: '',
      name: '',
      password: '',
      confirmPassword: ''
    }
    formErrors.value = {}
    
    // 关闭弹窗
    actions.hideAuth()
    
    // 显示成功提示
    actions.addNotification({
      type: 'success',
      message: authState.value.authMode === 'login' ? '登录成功' : '注册成功'
    })

    // 登录成功后的处理
    if (route.meta.requiresAuth) {
      // 如果当前页面需要认证，刷新当前页面
      router.go(0)
    } else {
      // 否则跳转到仪表盘
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Auth error:', error)
    actions.addNotification({
      type: 'error',
      message: error.message
    })
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await api.auth.logout()
    
    // 清除用户状态
    actions.clearUser()
    
    // 显示成功提示
    actions.addNotification({
      type: 'success',
      message: '退出登录成功'
    })

    // 清除路由状态
    router.go(0) // 刷新页面以清除所有状态
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    actions.addNotification({
      type: 'error',
      message: '退出登录失败'
    })
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
</style>
