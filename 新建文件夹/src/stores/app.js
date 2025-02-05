import { ref } from 'vue'

// 创建全局状态管理命名空间
window.$store = {
  app: {
    // 应用全局状态
    sidebarCollapsed: ref(false),
    theme: ref(localStorage.getItem('theme') || 'light'),
    loading: ref(false),
    notifications: ref([]),

    // 应用方法
    toggleSidebar() {
      this.sidebarCollapsed.value = !this.sidebarCollapsed.value
    },
    
    setTheme(newTheme) {
      this.theme.value = newTheme
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    },

    setLoading(status) {
      this.loading.value = status
    },

    addNotification(notification) {
      this.notifications.value.unshift({
        id: Date.now(),
        read: false,
        timestamp: new Date(),
        ...notification
      })
    },

    markNotificationAsRead(id) {
      const notification = this.notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    clearNotifications() {
      this.notifications.value = []
    }
  },

  user: {
    // 用户状态
    current: ref(null),
    token: ref(localStorage.getItem('token')),
    permissions: ref([]),

    // 用户方法
    setUser(userData) {
      this.current.value = userData
    },

    setToken(newToken) {
      this.token.value = newToken
      localStorage.setItem('token', newToken)
    },

    setPermissions(newPermissions) {
      this.permissions.value = newPermissions
    },

    clearUserInfo() {
      this.current.value = null
      this.token.value = null
      this.permissions.value = []
      localStorage.removeItem('token')
    },

    hasPermission(permission) {
      return this.permissions.value.includes(permission)
    }
  },

  chat: {
    // 聊天状态
    messages: ref([]),
    activeChat: ref(null),
    onlineUsers: ref([]),

    // 聊天方法
    sendMessage(message) {
      this.messages.value.push(message)
    },

    setActiveChat(chatId) {
      this.activeChat.value = chatId
    },

    updateOnlineUsers(users) {
      this.onlineUsers.value = users
    }
  },

  mail: {
    // 邮件状态
    inbox: ref([]),
    unreadCount: ref(0),
    drafts: ref([]),

    // 邮件方法
    updateInbox(emails) {
      this.inbox.value = emails
    },

    updateUnreadCount(count) {
      this.unreadCount.value = count
    },

    saveDraft(draft) {
      this.drafts.value.push(draft)
    }
  },

  storage: {
    // 存储状态
    files: ref([]),
    currentPath: ref('/'),
    selectedFiles: ref([]),

    // 存储方法
    updateFiles(newFiles) {
      this.files.value = newFiles
    },

    setCurrentPath(path) {
      this.currentPath.value = path
    },

    selectFile(file) {
      this.selectedFiles.value.push(file)
    },

    clearSelection() {
      this.selectedFiles.value = []
    }
  }
}

// 计算属性
Object.defineProperties(window.$store.app, {
  isDarkMode: {
    get: () => window.$store.app.theme.value === 'dark'
  },
  unreadNotifications: {
    get: () => window.$store.app.notifications.value.filter(n => !n.read).length
  }
})

// 导出类型（用于代码提示）
export const store = window.$store 