// 聊天工具函数
import { ref, computed } from 'vue'
import gsap from 'gsap'

export { gsap } // 直接导出 gsap

// 消息格式化相关
export const messageFormatters = {
  // 格式化消息时间
  formatMessageTime: (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    // 今天内
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    // 一周内
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${days[date.getDay()]}`
    }
    
    // 更早
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  },

  // 格式化文件大小
  formatFileSize: (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
}

// 菜单配置
export const menuConfigs = {
  // 获取工具栏配置
  getToolbarItems: (showEmojiPicker, isRecording, miaoyanState, handlers) => [
    {
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      tooltip: '表情',
      onClick: handlers.toggleEmoji,
      isActive: computed(() => showEmojiPicker.value)
    },
    {
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      tooltip: '发送图片',
      onClick: handlers.triggerImageUpload
    },
    {
      icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
      tooltip: '按住说话',
      onClick: handlers.startRecording,
      isActive: computed(() => isRecording.value)
    },
    {
      icon: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13',
      tooltip: '发送文件',
      onClick: handlers.triggerFileUpload
    },
    {
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z',
      tooltip: '喵言助手',
      onClick: handlers.toggleMiaoyan,
      isActive: computed(() => miaoyanState.value.isActive)
    }
  ],

  // 获取消息操作菜单
  getMessageActions: (handlers) => [
    {
      name: '复制',
      icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3',
      onClick: (message) => handlers.copyMessage(message.content)
    },
    {
      name: '回复',
      icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
      onClick: (message) => handlers.replyMessage(message)
    },
    {
      name: '转发',
      icon: 'M17 8l4 4m0 0l-4 4m4-4H3',
      onClick: (message) => handlers.forwardMessage(message)
    },
    {
      name: '删除',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      type: 'danger',
      onClick: (message) => handlers.deleteMessage(message.id)
    }
  ],

  // 获取联系人快捷操作
  getContactQuickActions: (actions) => [
    {
      name: '置顶聊天',
      icon: 'M5 15l7-7 7 7',
      onClick: (contact) => {
        actions.togglePinContact(contact.id)
      }
    },
    {
      name: '标记已读',
      icon: 'M5 13l4 4L19 7',
      onClick: (contact) => {
        actions.markAsRead(contact.id)
      }
    },
    {
      name: '隐藏会话',
      icon: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
      onClick: (contact) => {
        actions.hideConversation(contact.id)
      }
    }
  ],

  // 获取快捷操作
  getQuickActions: (actions) => [
    {
      name: '发起通话',
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      onClick: () => {
        actions.addNotification({
          type: 'info',
          message: '通话功能即将上线'
        })
      }
    },
    {
      name: '发送名片',
      icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
      onClick: () => {
        actions.addNotification({
          type: 'info',
          message: '名片分享功能即将上线'
        })
      }
    }
  ]
}

// 动画相关
export const animations = {
  // 滚动到底部
  scrollToBottom: (element) => {
    if (!element) return
    
    const target = element.scrollHeight
    const current = element.scrollTop
    const distance = target - current
    
    if (distance > 0) {
      gsap.to(element, {
        scrollTop: target,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  },

  // 消息进入动画
  onBeforeEnter: (el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px) scale(0.95)'
  },

  onEnter: (el, done) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.8)',
      onComplete: done
    })
  },

  onLeave: (el, done) => {
    gsap.to(el, {
      opacity: 0,
      y: -20,
      scale: 0.95,
      duration: 0.3,
      ease: 'back.in(1.5)',
      onComplete: done
    })
  },

  // 输入框焦点动画
  handleInputFocus: (inputRef) => {
    if (!inputRef) return
    gsap.to(inputRef, {
      scale: 1.01,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
  },

  handleInputBlur: (inputRef) => {
    if (!inputRef) return
    gsap.to(inputRef, {
      scale: 1,
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      duration: 0.2,
      ease: 'power2.inOut'
    })
  }
}

// 输入相关
export const inputHandlers = {
  // 自动增长输入框
  autoGrow: (element) => {
    if (!element) return
    element.style.height = 'auto'
    element.style.height = element.scrollHeight + 'px'
  },

  // 处理粘贴事件
  handlePaste: async (event, onImagePaste) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          event.preventDefault()
          onImagePaste?.(file)
          break
        }
      }
    }
  }
}

// 文件处理相关
export const fileHandlers = {
  // 处理图片上传
  handleImageUpload: async (file, onSuccess, onError) => {
    if (!file.type.startsWith('image/')) {
      onError?.('请选择图片文件')
      return
    }
    
    try {
      // TODO: 实现图片上传逻辑
      onSuccess?.()
    } catch (error) {
      onError?.(error.message)
    }
  },

  // 处理文件上传
  handleFileUpload: async (file, onSuccess, onError) => {
    try {
      // TODO: 实现文件上传逻辑
      onSuccess?.()
    } catch (error) {
      onError?.(error.message)
    }
  }
}

// 语音相关
export const voiceHandlers = {
  // 状态
  isRecording: ref(false),
  recordingDuration: ref(0),
  recordingTimer: ref(null),

  // 开始录音
  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      voiceHandlers.isRecording.value = true
      voiceHandlers.recordingTimer.value = setInterval(() => {
        voiceHandlers.recordingDuration.value++
      }, 1000)
      // TODO: 实现录音逻辑
      return true
    } catch (error) {
      console.error('录音失败:', error)
      return false
    }
  },

  // 停止录音
  stopRecording: () => {
    voiceHandlers.isRecording.value = false
    if (voiceHandlers.recordingTimer.value) {
      clearInterval(voiceHandlers.recordingTimer.value)
      voiceHandlers.recordingTimer.value = null
    }
    voiceHandlers.recordingDuration.value = 0
    // TODO: 实现停止录音逻辑
  },

  // 播放语音
  playVoice: (url) => {
    // TODO: 实现语音播放逻辑
  }
}

// 表情相关
export const emojiData = {
  categories: {
    '常用': ['😊', '😂', '🤣', '❤️', '😍', '🤔', '👍', '👋'],
    '表情': ['😀', '😃', '😄', '😁', '😅', '😆', '😉', '😊', '😋', '😎'],
    '动物': ['🐱', '🐶', '🐼', '🐨', '🦊', '🐯', '🦁', '🐮'],
    '食物': ['🍎', '🍕', '🍖', '🍗', '🍜', '🍣', '🍪', '🍰']
  },
  
  // 快捷短语
  quickPhrases: [
    '你好！',
    '谢谢',
    '好的，没问题',
    '稍等一下',
    '收到',
    '辛苦了',
    '下班了，明天见',
    '在忙吗？'
  ]
}

// 消息操作相关
export const messageOperations = {
  // 复制消息
  copyMessage: async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch (error) {
      console.error('复制失败:', error)
      return false
    }
  },

  // 判断是否显示时间戳
  shouldShowTimestamp: (message, prevMessage) => {
    if (!prevMessage) return true
    
    const currentTime = new Date(message.timestamp).getTime()
    const prevTime = new Date(prevMessage.timestamp).getTime()
    
    // 如果两条消息间隔超过5分钟，显示时间戳
    return currentTime - prevTime > 5 * 60 * 1000
  }
}

// 联系人操作相关
export const contactOperations = {
  // 过滤联系人列表
  filterContacts: (contacts, searchQuery) => {
    if (!searchQuery) return contacts
    const query = searchQuery.toLowerCase()
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.id.toString().includes(query)
    )
  },

  // 排序联系人列表
  sortContacts: (contacts) => {
    return [...contacts].sort((a, b) => {
      // 优先按置顶状态排序
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // 其次按最后消息时间排序
      const aTime = new Date(a.lastTime || 0).getTime()
      const bTime = new Date(b.lastTime || 0).getTime()
      return bTime - aTime
    })
  }
}

// 排序工具
export const sortingUtils = {
  // 排序群组
  sortGroups: (groups) => {
    return [...groups].sort((a, b) => {
      // 优先按置顶状态排序
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // 其次按最后消息时间排序
      const aTime = new Date(a.lastTime || 0).getTime()
      const bTime = new Date(b.lastTime || 0).getTime()
      return bTime - aTime
    })
  }
}

// 联系人处理相关
export const contactHandlers = {
  // 选择联系人
  selectContact: (contact, actions) => {
    actions.setCurrentContact(contact)
    actions.markAsRead(contact.id)
  },

  // 选择群聊
  selectGroup: (group, actions, user) => {
    actions.setCurrentContact({
      ...group,
      type: 'group'
    })
    if (user) {
      actions.markGroupAsRead(group.id, user.id)
    }
  },

  // 处理项目点击
  handleItemClick: (item, actions, user) => {
    if (item.isHidden) {
      actions.activateConversation(item)
    } else {
      if (item.type === 'group') {
        contactHandlers.selectGroup(item, actions, user)
      } else {
        contactHandlers.selectContact(item, actions)
      }
    }
  },

  // 显示上下文菜单
  showContextMenu: (event, item, activeContactMenu) => {
    event.preventDefault()
    event.stopPropagation()
    activeContactMenu.value = activeContactMenu.value === item.id ? null : item.id
  },

  // 添加新联系人
  addNewContact: (newContact, actions, showAddContact) => {
    actions.addContact(newContact)
    showAddContact.value = false
    actions.addNotification({
      type: 'success',
      message: `已添加 ${newContact.name} 为联系人`
    })
  },

  // 搜索用户
  searchUsers: async (searchQuery, api, searchResults) => {
    try {
      const results = await api.user.searchUsers(searchQuery)
      searchResults.value = results
    } catch (error) {
      console.error('Search users error:', error)
    }
  }
}

// 媒体处理相关
export const mediaHandlers = {
  // 预览媒体
  previewMedia: (media, previewImage) => {
    if (media.type === 'image') {
      previewImage.value = media.url
    }
  },

  // 下载文件
  downloadFile: (file, actions) => {
    actions.addNotification({
      type: 'info',
      message: `正在下载：${file.name}`
    })
  },

  // 打开链接
  openLink: (url) => {
    window.open(url, '_blank')
  },

  // 格式化文件大小
  formatFileSize: (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  },

  // 处理图片上传
  handleImageUpload: async (file, onSuccess, onError) => {
    if (!file.type.startsWith('image/')) {
      onError?.('请选择图片文件')
      return
    }
    
    try {
      // TODO: 实现图片上传逻辑
      onSuccess?.()
    } catch (error) {
      onError?.(error.message)
    }
  },

  // 处理文件上传
  handleFileUpload: async (file, onSuccess, onError) => {
    try {
      // TODO: 实现文件上传逻辑
      onSuccess?.()
    } catch (error) {
      onError?.(error.message)
    }
  },

  // 处理粘贴事件
  handlePaste: async (event, onImagePaste) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          event.preventDefault()
          onImagePaste?.(file)
          break
        }
      }
    }
  }
}

// 通知处理相关
export const notificationHandlers = {
  // 显示成功通知
  showSuccess: (message, actions) => {
    actions.addNotification({
      type: 'success',
      message
    })
  },

  // 显示错误通知
  showError: (message, actions) => {
    actions.addNotification({
      type: 'error',
      message
    })
  },

  // 显示信息通知
  showInfo: (message, actions) => {
    actions.addNotification({
      type: 'info',
      message
    })
  },

  // 显示警告通知
  showWarning: (message, actions) => {
    actions.addNotification({
      type: 'warning',
      message
    })
  },

  // 处理操作结果通知
  handleOperationResult: (success, successMessage, errorMessage, actions) => {
    if (success) {
      notificationHandlers.showSuccess(successMessage, actions)
    } else {
      notificationHandlers.showError(errorMessage, actions)
    }
  }
} 