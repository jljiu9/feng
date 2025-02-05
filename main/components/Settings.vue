<!-- Settings.vue -->
<template>
  <div class="space-y-4">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium md:text-xl">系统设置</h1>
      <div class="flex items-center gap-2">
        <button 
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted/50"
          @click="resetSettings"
          :disabled="isSaving"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span class="hidden sm:inline">重置</span>
        </button>
        <button 
          class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          @click="saveSettings"
          :disabled="isSaving || !isFormDirty"
        >
          <svg v-if="!isSaving" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <svg v-else class="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span class="hidden sm:inline">{{ isSaving ? '保存中...' : '保存设置' }}</span>
        </button>
      </div>
    </div>

    <!-- 设置选项卡 -->
    <div class="flex gap-2 border-b">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative px-3 py-2 text-xs hover:text-foreground"
        :class="[
          activeTab === tab.id
            ? 'font-medium text-foreground'
            : 'text-muted-foreground'
        ]"
        @click="switchTab(tab.id)"
      >
        {{ tab.name }}
        <div
          class="absolute bottom-0 left-0 right-0 h-0.5"
          :class="[
            activeTab === tab.id ? 'bg-primary' : 'bg-transparent'
          ]"
        ></div>
      </button>
    </div>

    <!-- 基础设置 -->
    <div v-if="activeTab === 'basic'" class="space-y-4">
      <!-- 系统信息 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">系统信息</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">系统名称</span>
            <div class="flex flex-col items-end gap-1">
              <input 
                type="text" 
                class="w-64 rounded-md border bg-transparent px-3 py-1 text-xs" 
                v-model="settings.systemName"
                :class="{ 'border-red-500': formErrors.systemName }"
              />
              <span v-if="formErrors.systemName" class="text-[10px] text-red-500">{{ formErrors.systemName }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">系统版本</span>
            <span class="text-xs">{{ settings.version }}</span>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">系统语言</span>
            <select 
              v-model="settings.language"
              class="w-32 rounded-md border bg-transparent px-3 py-1 text-xs"
            >
              <option value="zh_CN">简体中文</option>
              <option value="en_US">English</option>
            </select>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">时区设置</span>
            <select 
              v-model="settings.timezone"
              class="w-48 rounded-md border bg-transparent px-3 py-1 text-xs"
            >
              <option value="Asia/Shanghai">(GMT+08:00) 北京</option>
              <option value="UTC">(GMT+00:00) UTC</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 界面设置 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">界面设置</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">主题模式</span>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="theme" 
                  value="light" 
                  class="size-3"
                  v-model="settings.theme"
                />
                <span class="text-xs">浅色</span>
              </label>
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="theme" 
                  value="dark" 
                  class="size-3"
                  v-model="settings.theme"
                />
                <span class="text-xs">深色</span>
              </label>
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="theme" 
                  value="system" 
                  class="size-3"
                  v-model="settings.theme"
                />
                <span class="text-xs">跟随系统</span>
              </label>
            </div>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">导航栏</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.navFixed"
              />
              <span class="text-xs">固定显示</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">表格密度</span>
            <select 
              v-model="settings.tableDensity"
              class="w-32 rounded-md border bg-transparent px-3 py-1 text-xs"
            >
              <option value="compact">紧凑</option>
              <option value="default">默认</option>
              <option value="comfortable">宽松</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 安全设置 -->
    <div v-if="activeTab === 'security'" class="space-y-4">
      <!-- 密码设置 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">密码设置</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">当前密码</span>
            <input 
              type="password" 
              class="w-64 rounded-md border bg-transparent px-3 py-1 text-xs"
              v-model="settings.password.current"
              :class="{ 'border-red-500': formErrors.password }"
            />
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">新密码</span>
            <input 
              type="password" 
              class="w-64 rounded-md border bg-transparent px-3 py-1 text-xs"
              v-model="settings.password.new"
              :class="{ 'border-red-500': formErrors.password }"
            />
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">确认密码</span>
            <input 
              type="password" 
              class="w-64 rounded-md border bg-transparent px-3 py-1 text-xs"
              v-model="settings.password.confirm"
              :class="{ 'border-red-500': formErrors.password }"
            />
          </div>
          <div class="flex items-center justify-end p-3">
            <button 
              class="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
              @click="changePassword"
              :disabled="isSaving"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>

      <!-- 登录设置 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">登录设置</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">两步验证</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.security.twoFactor"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">登录通知</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.security.loginNotification"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">会话超时</span>
            <select 
              v-model="settings.security.sessionTimeout"
              class="w-32 rounded-md border bg-transparent px-3 py-1 text-xs"
            >
              <option value="30">30分钟</option>
              <option value="60">1小时</option>
              <option value="120">2小时</option>
              <option value="240">4小时</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知设置 -->
    <div v-if="activeTab === 'notification'" class="space-y-4">
      <!-- 消息通知 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">消息通知</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <div>
              <div class="text-xs font-medium">系统通知</div>
              <div class="mt-1 text-[10px] text-muted-foreground">接收系统更新、维护等通知</div>
            </div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.system"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <div>
              <div class="text-xs font-medium">活动提醒</div>
              <div class="mt-1 text-[10px] text-muted-foreground">接收用户活动、操作等提醒</div>
            </div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.activity"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <div>
              <div class="text-xs font-medium">安全提醒</div>
              <div class="mt-1 text-[10px] text-muted-foreground">接收账号安全相关提醒</div>
            </div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.security"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 通知方式 -->
      <div class="rounded-lg border bg-card">
        <div class="border-b p-3">
          <h2 class="text-sm font-medium">通知方式</h2>
        </div>
        <div class="divide-y">
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">站内消息</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.methods.site"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">邮件通知</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.methods.email"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
          <div class="flex items-center justify-between p-3">
            <span class="text-xs text-muted-foreground">短信通知</span>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                class="size-3"
                v-model="settings.notification.methods.sms"
              />
              <span class="text-xs">启用</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const themeUtils = inject('themeUtils')
const globalState = inject('globalState')

// 表单验证状态
const formErrors = ref({})
const isFormDirty = ref(false)
const isSaving = ref(false)

const tabs = [
  { id: 'basic', name: '基础设置', path: '/settings' },
  { id: 'security', name: '安全设置', path: '/settings/security' },
  { id: 'notification', name: '通知设置', path: '/settings/notification' }
]

// 根据路由路径获取当前标签
const getCurrentTab = (path) => {
  // 移除查询参数
  const basePath = path.split('?')[0]
  const tab = tabs.find(t => t.path === basePath)
  return tab ? tab.id : 'basic'
}

// 当前活动标签
const activeTab = ref(getCurrentTab(route.path))

// 切换标签
const switchTab = (tabId) => {
  const tab = tabs.find(t => t.id === tabId)
  if (tab) {
    // 保持查询参数不变
    router.replace({
      path: tab.path,
      query: route.query
    })
  }
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = getCurrentTab(newPath)
  },
  { immediate: true }
)

// 监听标签变化
watch(
  activeTab,
  (newTab) => {
    const tab = tabs.find(t => t.id === newTab)
    if (tab && tab.path !== route.path) {
      router.replace({
        path: tab.path,
        query: route.query
      })
    }
  }
)

const settings = ref({
  systemName: '后台管理系统',
  version: 'v1.0.0',
  language: 'zh_CN',
  timezone: 'Asia/Shanghai',
  theme: themeUtils?.currentTheme.value || 'system',
  navFixed: true,
  tableDensity: 'compact',
  password: {
    current: '',
    new: '',
    confirm: ''
  },
  security: {
    twoFactor: false,
    loginNotification: true,
    sessionTimeout: '30'
  },
  notification: {
    system: true,
    activity: true,
    security: true,
    methods: {
      site: true,
      email: true,
      sms: false
    }
  }
})

// 监听设置变化
watch(settings, () => {
  isFormDirty.value = true
}, { deep: true })

// 表单验证
const validateForm = () => {
  const errors = {}
  
  // 基础设置验证
  if (!settings.value.systemName.trim()) {
    errors.systemName = '系统名称不能为空'
  }
  
  // 密码验证
  if (activeTab.value === 'security' && 
      (settings.value.password.new || settings.value.password.confirm || settings.value.password.current)) {
    const error = validatePassword()
    if (error) {
      errors.password = error
    }
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// 保存设置
const saveSettings = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    isSaving.value = true
    
    // 应用主题设置
    if (themeUtils) {
      themeUtils.setTheme(settings.value.theme)
    }
    
    // 保存到本地存储
    localStorage.setItem('settings', JSON.stringify(settings.value))
    
    // 显示成功提示
    alert('设置已保存')
    isFormDirty.value = false
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存设置失败')
  } finally {
    isSaving.value = false
  }
}

// 重置设置
const resetSettings = () => {
  if (!confirm('确定要重置所有设置吗？')) {
    return
  }
  
  // 重置为默认值
  settings.value = {
    systemName: '后台管理系统',
    version: 'v1.0.0',
    language: 'zh_CN',
    timezone: 'Asia/Shanghai',
    theme: 'system',
    navFixed: true,
    tableDensity: 'compact',
    password: {
      current: '',
      new: '',
      confirm: ''
    },
    security: {
      twoFactor: false,
      loginNotification: true,
      sessionTimeout: '30'
    },
    notification: {
      system: true,
      activity: true,
      security: true,
      methods: {
        site: true,
        email: true,
        sms: false
      }
    }
  }
  
  // 清除错误
  formErrors.value = {}
  isFormDirty.value = false
}

// 验证密码
const validatePassword = () => {
  const { current, new: newPass, confirm } = settings.value.password
  if (!current) return '请输入当前密码'
  if (!newPass) return '请输入新密码'
  if (!confirm) return '请确认新密码'
  if (newPass !== confirm) return '两次输入的密码不一致'
  if (newPass.length < 6) return '密码长度不能小于6位'
  return ''
}

// 修改密码
const changePassword = async () => {
  const error = validatePassword()
  if (error) {
    formErrors.value.password = error
    return
  }
  
  try {
    isSaving.value = true
    
    // 这里添加修改密码的逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    console.log('修改密码:', settings.value.password)
    
    // 清空密码输入
    settings.value.password = {
      current: '',
      new: '',
      confirm: ''
    }
    
    formErrors.value.password = null
    alert('密码修改成功')
  } catch (error) {
    console.error('修改密码失败:', error)
    formErrors.value.password = '修改密码失败'
  } finally {
    isSaving.value = false
  }
}

// 离开页面前检查
const beforeUnload = (e) => {
  if (isFormDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  // 从路由同步当前标签
  activeTab.value = getCurrentTab(route.path)
  
  // 加载保存的设置
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      settings.value = {
        ...settings.value,
        ...parsed
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
  
  // 添加离开页面提示
  window.addEventListener('beforeunload', beforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})
</script> 