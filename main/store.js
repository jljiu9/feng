import { watch, reactive } from 'vue'

// 全局状态
const state = reactive({
  // 用户信息
  user: null,
  
  // 系统设置
  settings: {},
  
  // 加载状态
  loading: new Set(),
  
  // 通知消息
  notifications: [],

  // 认证相关
  auth: {
    isAuthenticated: false,
    token: null,
    showAuthModal: false,
    authMode: 'login', // 'login' 或 'register'
    redirectPath: null // 保存登录后需要跳转的路由
  },

  // 在线用户
  onlineUsers: new Set(),

  // 聊天相关
  chat: {
    currentContact: null,
    contacts: [],
    messages: {},
    unreadCount: {},
    activeChats: [],
    groups: [
      {
        id: 'group1',
        name: '班级群',
        avatar: null,
        members: [1, 2, 3],
        owner: 1,
        type: 'group'
      }
    ],
    groupMessages: {},
    groupUnreadCount: {},
    pinnedContacts: new Set(), // 置顶的联系人
    hiddenConversations: new Set(), // 隐藏的会话
    mutedContacts: new Set(), // 免打扰的联系人
    showHiddenConversations: false, // 是否显示隐藏的会话
    pinnedGroups: new Set(), // 置顶的群聊
    hiddenGroups: new Set(), // 隐藏的群聊
    mutedGroups: new Set(), // 免打扰的群聊
  },

  // 用户角色权限
  roles: {
    SUPER_ADMIN: 'super_admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
  },

  permissions: {
    // 用户管理
    USER_MANAGE: 'user:manage',
    USER_VIEW: 'user:view',
    
    // 数据查看
    DATA_ALL: 'data:all',
    DATA_GROUP: 'data:group',
    
    // 聊天功能
    CHAT_ALL: 'chat:all',
    CHAT_GROUP: 'chat:group',
    
    // 系统设置
    SETTINGS_ALL: 'settings:all',
    SETTINGS_GROUP: 'settings:group'
  },

  // 模拟用户数据
  mockUsers: [
    {
      id: 1,
      name: '张老师',
      role: 'teacher',
      avatar: null,
      status: 'online'
    },
    {
      id: 2,
      name: '李同学',
      role: 'student',
      avatar: null,
      status: 'offline'
    },
    {
      id: 3,
      name: '王老师',
      role: 'teacher',
      avatar: null,
      status: 'online'
    }
  ],

  // 喵言相关状态
  miaoyan: {
    isActive: false,
    contextRange: 'last_10',
    contextRanges: [
      { id: 'last_10', name: '最近10条' },
      { id: 'last_100', name: '最近100条' },
      { id: 'today', name: '今天' },
      { id: 'last_7_days', name: '最近7天' },
      { id: 'all', name: '全部记录' }
    ],
    loadingStatus: 'idle', // idle, loading_vector, loading_index, requesting, responding
    currentResponse: null,
    error: null
  }
})

// 状态操作方法
const actions = {
  // 用户相关
  setUser(user) {
    state.user = user
    state.auth.isAuthenticated = true
    // 保存到本地存储
    localStorage.setItem('user', JSON.stringify(user))
  },
  
  clearUser() {
    state.user = null
    state.auth.isAuthenticated = false
    state.auth.token = null
    // 清除本地存储
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },

  // 认证相关
  showAuth(mode = 'login', redirectPath = null) {
    state.auth.showAuthModal = true
    state.auth.authMode = mode
    if (redirectPath) {
      state.auth.redirectPath = redirectPath
    }
  },

  hideAuth() {
    state.auth.showAuthModal = false
    state.auth.redirectPath = null
  },

  setAuthMode(mode) {
    state.auth.authMode = mode
  },

  setToken(token) {
    state.auth.token = token
    localStorage.setItem('token', token)
  },

  // 初始化认证状态
  initAuth() {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (user && token) {
      state.user = JSON.parse(user)
      state.auth.token = token
      state.auth.isAuthenticated = true
    }
  },
  
  // 设置相关
  setSettings(settings) {
    state.settings = settings
  },
  
  // 加载状态
  startLoading(id) {
    state.loading.add(id)
  },
  
  endLoading(id) {
    state.loading.delete(id)
  },
  
  // 通知相关
  addNotification(notification) {
    const id = Date.now()
    state.notifications.push({
      id,
      ...notification,
      duration: notification.duration || 3000
    })
    
    // 自动移除通知
    setTimeout(() => {
      this.removeNotification(id)
    }, notification.duration || 3000)
  },
  
  removeNotification(id) {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      state.notifications.splice(index, 1)
    }
  },

  // 聊天相关
  setCurrentContact(contact) {
    state.chat.currentContact = contact
  },

  addContact(contact) {
    if (!state.chat.contacts.find(c => c.id === contact.id)) {
      state.chat.contacts.push(contact)
    }
  },

  removeContact(contactId) {
    const index = state.chat.contacts.findIndex(c => c.id === contactId)
    if (index > -1) {
      state.chat.contacts.splice(index, 1)
    }
  },

  addMessage(contactId, message) {
    if (!state.chat.messages[contactId]) {
      state.chat.messages[contactId] = []
    }
    state.chat.messages[contactId].push(message)
    
    // 更新联系人的最新消息
    const contact = state.chat.contacts.find(c => c.id === contactId)
    if (contact) {
      contact.lastMessage = message.content
      contact.lastTime = message.timestamp
    }
    
    // 更新未读消息计数
    if (state.chat.currentContact?.id !== contactId) {
      state.chat.unreadCount[contactId] = (state.chat.unreadCount[contactId] || 0) + 1
    }
  },

  markAsRead(contactId) {
    state.chat.unreadCount[contactId] = 0
  },

  // 在线状态
  setUserOnline(userId) {
    state.onlineUsers.add(userId)
  },

  setUserOffline(userId) {
    state.onlineUsers.delete(userId)
  },

  // 权限检查
  hasPermission(permission) {
    if (!state.user) return false
    if (state.user.role === state.roles.SUPER_ADMIN) return true
    return state.user.permissions.includes(permission)
  },

  isTeacher() {
    return state.user?.role === state.roles.TEACHER
  },

  isStudent() {
    return state.user?.role === state.roles.STUDENT
  },

  // 添加新的 actions
  initMockData() {
    // 初始化模拟联系人
    state.chat.contacts = state.mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      lastMessage: '这是一条测试消息',
      lastTime: new Date()
    }))

    // 初始化模拟消息
    state.chat.contacts.forEach(contact => {
      state.chat.messages[contact.id] = [
        {
          id: Date.now(),
          content: `来自${contact.name}的测试消息`,
          senderId: contact.id,
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: Date.now() + 1,
          content: '这是回复消息',
          senderId: state.user?.id || 999,
          timestamp: new Date(Date.now() - 1800000)
        }
      ]
    })

    // 初始化群聊消息
    state.chat.groups.forEach(group => {
      state.chat.groupMessages[group.id] = [
        {
          id: Date.now(),
          content: '欢迎加入群聊！',
          senderId: group.owner,
          senderName: state.mockUsers.find(u => u.id === group.owner)?.name,
          timestamp: new Date(Date.now() - 7200000)
        }
      ]
    })
  },

  // 模拟发送消息延迟
  async sendMessage(contactId, message) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newMessage = {
        ...message,
        id: Date.now()
      }
      
      // 添加消息到列表
      this.addMessage(contactId, newMessage)
      
      // 更新联系人列表顺序（将最新消息的联系人置顶）
      const contact = state.chat.contacts.find(c => c.id === contactId)
      if (contact) {
        const index = state.chat.contacts.indexOf(contact)
        if (index > -1) {
          state.chat.contacts.splice(index, 1)
          state.chat.contacts.unshift(contact)
        }
      }
      
      return newMessage
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  },

  // 模拟在线状态变化
  simulateOnlineStatus() {
    setInterval(() => {
      state.mockUsers.forEach(user => {
        if (Math.random() > 0.7) {
          user.status = user.status === 'online' ? 'offline' : 'online'
          if (user.status === 'online') {
            this.setUserOnline(user.id)
          } else {
            this.setUserOffline(user.id)
          }
        }
      })
    }, 10000)
  },

  // 添加群聊相关 actions
  async sendGroupMessage(groupId, message) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 确保群聊消息数组存在
      if (!state.chat.groupMessages[groupId]) {
        state.chat.groupMessages[groupId] = []
      }
      
      const newMessage = {
        ...message,
        id: Date.now(),
        type: 'group'
      }
      
      state.chat.groupMessages[groupId].push(newMessage)
      
      // 更新群聊的最新消息和时间
      const group = state.chat.groups.find(g => g.id === groupId)
      if (group) {
        group.lastMessage = message.content
        group.lastTime = message.timestamp
        
        // 更新群聊列表顺序（将最新消息的群聊置顶，除非已被手动置顶）
        if (!state.chat.pinnedGroups.has(groupId)) {
          const index = state.chat.groups.indexOf(group)
          if (index > -1) {
            state.chat.groups.splice(index, 1)
            state.chat.groups.unshift(group)
          }
        }
        
        // 更新其他成员的未读消息计数
        group.members.forEach(memberId => {
          if (memberId !== message.senderId) {
            if (!state.chat.groupUnreadCount[groupId]) {
              state.chat.groupUnreadCount[groupId] = {}
            }
            state.chat.groupUnreadCount[groupId][memberId] = 
              (state.chat.groupUnreadCount[groupId][memberId] || 0) + 1
          }
        })
      }
      
      return newMessage
    } catch (error) {
      console.error('Send group message error:', error)
      throw error
    }
  },

  // 获取群聊消息
  getGroupMessages(groupId) {
    return state.chat.groupMessages[groupId] || []
  },

  // 创建群聊
  async createGroup(name, members) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const group = {
      id: 'group_' + Date.now(),
      name,
      members,
      owner: state.user.id,
      type: 'group',
      avatar: null,
      lastMessage: '群聊创建成功',
      lastTime: new Date()
    }
    state.chat.groups.push(group)
    state.chat.groupMessages[group.id] = [{
      id: Date.now(),
      content: '群聊创建成功，开始聊天吧！',
      senderId: state.user.id,
      senderName: state.user.name,
      timestamp: new Date()
    }]
    return group
  },

  // 添加群成员
  async addGroupMember(groupId, userId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const group = state.chat.groups.find(g => g.id === groupId)
    if (group && !group.members.includes(userId)) {
      group.members.push(userId)
      // 添加系统消息
      this.sendGroupMessage(groupId, {
        content: `${state.mockUsers.find(u => u.id === userId)?.name || '新成员'} 加入群聊`,
        senderId: 'system',
        senderName: '系统',
        timestamp: new Date()
      })
    }
  },

  // 移除群成员
  async removeGroupMember(groupId, userId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const group = state.chat.groups.find(g => g.id === groupId)
    if (group) {
      const index = group.members.indexOf(userId)
      if (index > -1) {
        group.members.splice(index, 1)
        // 添加系统消息
        this.sendGroupMessage(groupId, {
          content: `${state.mockUsers.find(u => u.id === userId)?.name || '成员'} 退出群聊`,
          senderId: 'system',
          senderName: '系统',
          timestamp: new Date()
        })
      }
    }
  },

  // 切换喵言面板
  toggleMiaoyan() {
    state.miaoyan.isActive = !state.miaoyan.isActive
    if (!state.miaoyan.isActive) {
      // 重置状态
      state.miaoyan.currentResponse = null
      state.miaoyan.error = null
      state.miaoyan.loadingStatus = 'idle'
    }
  },

  // 设置上下文范围
  setMiaoyanContextRange(range) {
    state.miaoyan.contextRange = range
    // 重新请求建议
    this.requestMiaoyanSuggestion()
  },

  // 获取当前聊天
  getCurrentChat() {
    if (!state.chat.currentContact) return null
    return state.chat.currentContact.type === 'group'
      ? state.chat.groups.find(g => g.id === state.chat.currentContact.id)
      : state.chat.contacts.find(c => c.id === state.chat.currentContact.id)
  },

  // 请求喵言建议
  async requestMiaoyanSuggestion() {
    try {
      state.miaoyan.error = null
      state.miaoyan.currentResponse = null
      
      // 获取上下文消息
      const contextMessages = this.getContextMessages()
      if (!contextMessages.length) {
        state.miaoyan.error = '没有找到可分析的上下文消息'
        return
      }

      // 模拟向量数据库更新
      state.miaoyan.loadingStatus = 'loading_vector'
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟索引更新
      state.miaoyan.loadingStatus = 'loading_index'
      await new Promise(resolve => setTimeout(resolve, 600))

      // 模拟请求喵言
      state.miaoyan.loadingStatus = 'requesting'
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟喵言思考
      state.miaoyan.loadingStatus = 'responding'
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟响应
      const suggestions = [
        '好的，我明白了，我会继续关注这个问题的进展。',
        '这个想法很有趣，我们可以一起探讨一下具体实现方案。',
        '我觉得你说得对，我们确实需要考虑这些因素。',
        '让我们先从最基础的部分开始，逐步完善整个方案。',
        '这个问题比较复杂，我建议我们分步骤来解决。'
      ]
      
      state.miaoyan.currentResponse = {
        content: suggestions[Math.floor(Math.random() * suggestions.length)],
        suggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
      }
      
      state.miaoyan.loadingStatus = 'idle'
    } catch (error) {
      state.miaoyan.error = error.message || '请求失败，请稍后重试'
      state.miaoyan.loadingStatus = 'idle'
    }
  },

  // 获取上下文消息
  getContextMessages() {
    const currentChat = this.getCurrentChat()
    if (!currentChat) return []

    const messages = currentChat.messages || []
    const now = new Date()

    switch (state.miaoyan.contextRange) {
      case 'last_10':
        return messages.slice(-10)
      case 'last_100':
        return messages.slice(-100)
      case 'today':
        return messages.filter(msg => {
          const msgDate = new Date(msg.timestamp)
          return msgDate.toDateString() === now.toDateString()
        })
      case 'last_7_days':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return messages.filter(msg => new Date(msg.timestamp) >= sevenDaysAgo)
      case 'all':
        return messages
      default:
        return messages.slice(-10)
    }
  },

  // 切换联系人置顶状态
  togglePinContact(contactId) {
    if (state.chat.pinnedContacts.has(contactId)) {
      state.chat.pinnedContacts.delete(contactId)
    } else {
      state.chat.pinnedContacts.add(contactId)
    }
  },
  
  // 隐藏会话
  hideConversation(contactId) {
    state.chat.hiddenConversations.add(contactId)
  },
  
  // 显示会话
  showConversation(contactId) {
    state.chat.hiddenConversations.delete(contactId)
  },
  
  // 切换显示隐藏会话
  toggleHiddenConversations() {
    state.chat.showHiddenConversations = !state.chat.showHiddenConversations
  },
  
  // 切换免打扰状态
  toggleMuteContact(contactId) {
    if (state.chat.mutedContacts.has(contactId)) {
      state.chat.mutedContacts.delete(contactId)
    } else {
      state.chat.mutedContacts.add(contactId)
    }
  },
  
  // 清空聊天记录
  async clearChatHistory(contactId) {
    try {
      await api.chat.clearHistory(contactId)
      state.chat.messages = state.chat.messages.filter(msg => 
        msg.contactId !== contactId
      )
      return true
    } catch (error) {
      console.error('Clear chat history error:', error)
      throw error
    }
  },
  
  // 切换群聊置顶状态
  togglePinGroup(groupId) {
    if (state.chat.pinnedGroups.has(groupId)) {
      state.chat.pinnedGroups.delete(groupId)
    } else {
      state.chat.pinnedGroups.add(groupId)
    }
  },
  
  // 隐藏群聊
  hideGroup(groupId) {
    state.chat.hiddenGroups.add(groupId)
  },
  
  // 显示群聊
  showGroup(groupId) {
    state.chat.hiddenGroups.delete(groupId)
  },
  
  // 切换群聊免打扰状态
  toggleMuteGroup(groupId) {
    if (state.chat.mutedGroups.has(groupId)) {
      state.chat.mutedGroups.delete(groupId)
    } else {
      state.chat.mutedGroups.add(groupId)
    }
  },

  // 激活隐藏的会话
  activateConversation(conversation) {
    if (conversation.type === 'group') {
      this.showGroup(conversation.id)
    } else {
      this.showConversation(conversation.id)
    }
    this.setCurrentContact(conversation)
  },

  // 修改保存状态方法
  saveState() {
    const stateToSave = {
      pinnedContacts: Array.from(state.chat.pinnedContacts),
      hiddenConversations: Array.from(state.chat.hiddenConversations),
      mutedContacts: Array.from(state.chat.mutedContacts),
      pinnedGroups: Array.from(state.chat.pinnedGroups),
      hiddenGroups: Array.from(state.chat.hiddenGroups),
      mutedGroups: Array.from(state.chat.mutedGroups)
    }
    localStorage.setItem('chatState', JSON.stringify(stateToSave))
  },

  // 修改初始化状态方法
  initializeState() {
    const savedState = localStorage.getItem('chatState')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      state.chat.pinnedContacts = new Set(parsed.pinnedContacts || [])
      state.chat.hiddenConversations = new Set(parsed.hiddenConversations || [])
      state.chat.mutedContacts = new Set(parsed.mutedContacts || [])
      state.chat.pinnedGroups = new Set(parsed.pinnedGroups || [])
      state.chat.hiddenGroups = new Set(parsed.hiddenGroups || [])
      state.chat.mutedGroups = new Set(parsed.mutedGroups || [])
    }
  },

  // 添加群聊未读消息标记方法
  markGroupAsRead(groupId, userId) {
    if (state.chat.groupUnreadCount[groupId]) {
      state.chat.groupUnreadCount[groupId][userId] = 0
    }
  }
}

const getters = {
  // 是否已登录
  isLoggedIn: () => state.auth.isAuthenticated,
  
  // 是否正在加载
  isLoading: () => state.loading.size > 0,
  
  // 获取所有通知
  notifications: () => state.notifications,
  
  // 获取用户信息
  user: () => state.user,
  
  // 获取系统设置
  settings: () => state.settings,

  // 获取认证状态
  authState: () => state.auth,

  // 聊天相关
  currentContact: () => state.chat.currentContact,
  contacts: () => {
    return state.chat.contacts.filter(contact => 
      state.chat.showHiddenConversations || 
      !state.chat.hiddenConversations.has(contact.id)
    ).map(contact => ({
      ...contact,
      isPinned: state.chat.pinnedContacts.has(contact.id),
      isMuted: state.chat.mutedContacts.has(contact.id)
    }))
  },
  messages: (contactId) => state.chat.messages[contactId] || [],
  unreadCount: (contactId) => state.chat.unreadCount[contactId] || 0,
  totalUnreadCount: () => Object.values(state.chat.unreadCount).reduce((a, b) => a + b, 0),
  
  // 在线状态
  isUserOnline: (userId) => state.onlineUsers.has(userId),
  
  // 权限相关
  userRole: () => state.user?.role,
  hasPermission: (permission) => actions.hasPermission(permission),
  isTeacher: () => actions.isTeacher(),
  isStudent: () => actions.isStudent(),

  // 喵言相关
  miaoyanState: () => state.miaoyan,
  isMiaoyanActive: () => state.miaoyan.isActive,
  miaoyanLoadingStatus: () => state.miaoyan.loadingStatus,
  miaoyanResponse: () => state.miaoyan.currentResponse,

  // 获取隐藏会话数量
  hiddenConversationsCount: () => state.chat.hiddenConversations.size,
  
  // 判断联系人是否置顶
  isContactPinned: (contactId) => state.chat.pinnedContacts.has(contactId),
  
  // 判断联系人是否隐藏
  isConversationHidden: (contactId) => state.chat.hiddenConversations.has(contactId),
  
  // 判断联系人是否免打扰
  isContactMuted: (contactId) => state.chat.mutedContacts.has(contactId),

  // 获取群聊列表（包含置顶和隐藏状态）
  groups: () => {
    return state.chat.groups
      .filter(group => 
        state.chat.showHiddenConversations || 
        !state.chat.hiddenGroups.has(group.id)
      )
      .map(group => ({
        ...group,
        isPinned: state.chat.pinnedGroups.has(group.id),
        isMuted: state.chat.mutedGroups.has(group.id),
        unreadCount: getters.groupUnreadCount(group.id),
        lastMessage: group.lastMessage,
        lastTime: group.lastTime
      }))
  },

  // 搜索所有会话（包括隐藏的）
  searchAllConversations: (query) => {
    const searchQuery = query.toLowerCase()
    const contacts = state.chat.contacts.map(contact => ({
      ...contact,
      type: 'contact',
      isPinned: state.chat.pinnedContacts.has(contact.id),
      isMuted: state.chat.mutedContacts.has(contact.id),
      isHidden: state.chat.hiddenConversations.has(contact.id)
    }))
    
    const groups = state.chat.groups.map(group => ({
      ...group,
      type: 'group',
      isPinned: state.chat.pinnedGroups.has(group.id),
      isMuted: state.chat.mutedGroups.has(group.id),
      isHidden: state.chat.hiddenGroups.has(group.id)
    }))
    
    return [...contacts, ...groups].filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      item.id.toString().includes(searchQuery)
    )
  },

  // 获取群聊未读消息数
  groupUnreadCount: (groupId) => {
    if (!state.chat.groupUnreadCount[groupId]) return 0
    const userId = state.user?.id
    return state.chat.groupUnreadCount[groupId][userId] || 0
  },
  
  // 获取群聊消息
  groupMessages: (groupId) => state.chat.groupMessages[groupId] || [],
}

// 导出只读状态和操作方法
export const useStore = () => ({
  state,
  actions,
  getters
})

// 导出常量
export const PERMISSIONS = {
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_VIEW: 'user:view',
  SETTINGS_MANAGE: 'settings:manage'
}

// 添加状态变化监听，自动保存到本地存储
watch(
  () => [
    state.chat.pinnedContacts,
    state.chat.hiddenConversations,
    state.chat.mutedContacts,
    state.chat.pinnedGroups,
    state.chat.hiddenGroups,
    state.chat.mutedGroups
  ],
  () => {
    actions.saveState()
  },
  { deep: true }
) 