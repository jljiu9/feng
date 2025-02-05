import { ref } from 'vue'

// 初始化用户状态
if (!window.$store) window.$store = {}

window.$store.user = {
  // 状态
  current: ref(null),
  token: ref(localStorage.getItem('token')),
  permissions: ref([]),
  isLoggedIn: ref(false),

  // 方法
  setUser(userData) {
    this.current.value = userData
    this.isLoggedIn.value = !!userData
  },

  setToken(newToken) {
    this.token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  },

  setPermissions(newPermissions) {
    this.permissions.value = newPermissions
  },

  clearUserInfo() {
    this.current.value = null
    this.token.value = null
    this.permissions.value = []
    this.isLoggedIn.value = false
    localStorage.removeItem('token')
  },

  hasPermission(permission) {
    return this.permissions.value.includes(permission)
  },

  // 获取用户信息
  async fetchUserInfo() {
    try {
      const response = await fetch('/api/user/info', {
        headers: {
          'Authorization': `Bearer ${this.token.value}`
        }
      })
      const data = await response.json()
      if (data.success) {
        this.setUser(data.user)
        this.setPermissions(data.permissions)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
}

// 导出用于类型提示
export const userStore = window.$store.user