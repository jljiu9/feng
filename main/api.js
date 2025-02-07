import { useStore } from './store'

const { actions } = useStore()

// 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

// 请求工具函数
const request = async (url, options = {}) => {
  const requestId = Date.now()
  try {
    actions.startLoading(requestId)
    
    const token = localStorage.getItem('token')
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
    
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '请求失败')
    }
    
    return await response.json()
  } catch (error) {
    // 统一错误处理
    actions.addNotification({
      type: 'error',
      message: error.message
    })
    throw error
  } finally {
    actions.endLoading(requestId)
  }
}

// 用户相关 API
export const userApi = {
  // 登录
  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 登出
  logout: () => request('/auth/logout', {
    method: 'POST'
  }),
  
  // 获取用户信息
  getProfile: () => request('/user/profile'),
  
  // 更新用户信息
  updateProfile: (data) => request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // 获取用户列表
  getUsers: (params) => request('/users?' + new URLSearchParams(params)),
  
  // 创建用户
  createUser: (data) => request('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 更新用户
  updateUser: (id, data) => request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // 删除用户
  deleteUser: (id) => request(`/users/${id}`, {
    method: 'DELETE'
  }),
  
  // 批量操作用户
  batchUsers: (action, ids) => request('/users/batch', {
    method: 'POST',
    body: JSON.stringify({ action, ids })
  })
}

// 系统设置 API
export const settingsApi = {
  // 获取系统设置
  getSettings: () => request('/settings'),
  
  // 更新系统设置
  updateSettings: (data) => request('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 文件上传 API
export const uploadApi = {
  // 上传文件
  uploadFile: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return request('/upload', {
      method: 'POST',
      headers: {
        // 移除 Content-Type，让浏览器自动设置
        'Content-Type': undefined
      },
      body: formData,
      onUploadProgress: onProgress
    })
  }
}

// 认证相关 API
export const authApi = {
  // 登录
  login: async (data) => {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 默认账号密码验证
    if (data.username === 'admin' && data.password === 'admin123') {
      return {
        token: 'mock_token_123',
        user: {
          id: 1,
          username: 'admin',
          name: '管理员',
          avatar: null,
          role: 'admin',
          permissions: ['*']
        }
      }
    }
    
    throw new Error('用户名或密码错误')
  },
  
  // 注册
  register: async (data) => {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟用户名验证
    if (data.username === 'admin') {
      throw new Error('用户名已存在')
    }
    
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: Date.now(),
        username: data.username,
        name: data.name || data.username,
        avatar: null,
        role: 'user',
        permissions: ['user:*']
      }
    }
  },
  
  // 登出
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  }
}

// 聊天相关 API
export const chatApi = {
  // 获取联系人列表
  getContacts: async () => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    return [
      {
        id: 1,
        name: '张老师',
        role: 'teacher',
        lastMessage: '好的，我知道了',
        lastTime: new Date()
      },
      {
        id: 2,
        name: '李同学',
        role: 'student',
        lastMessage: '作业已经提交了',
        lastTime: new Date()
      }
    ]
  },

  // 获取消息历史
  getMessages: async (contactId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: 1,
        content: '你好',
        senderId: 1,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        content: '有什么问题吗？',
        senderId: 2,
        timestamp: new Date(Date.now() - 1800000)
      }
    ]
  },

  // 发送消息
  sendMessage: async (contactId, message) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: Date.now(),
      ...message,
      timestamp: new Date()
    }
  },

  // 搜索用户
  searchUsers: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟搜索结果
    const mockUsers = [
      { id: 1, name: '张老师', avatar: null, department: '教学部', role: 'teacher', status: 'online', lastMessage: null, lastTime: null },
      { id: 2, name: '李老师', avatar: null, department: '教学部', role: 'teacher', status: 'offline', lastMessage: null, lastTime: null },
      { id: 3, name: '王老师', avatar: null, department: '教学部', role: 'teacher', status: 'online', lastMessage: null, lastTime: null },
      { id: 4, name: '赵同学', avatar: null, department: '学生部', role: 'student', status: 'online', lastMessage: null, lastTime: null },
      { id: 5, name: '钱同学', avatar: null, department: '学生部', role: 'student', status: 'offline', lastMessage: null, lastTime: null },
      { id: 6, name: '孙同学', avatar: null, department: '学生部', role: 'student', status: 'online', lastMessage: null, lastTime: null }
    ]
    
    // 从store中获取当前联系人列表
    const { state } = useStore()
    const currentContacts = state.contacts || []
    
    // 过滤搜索结果并标记是否已添加
    const filteredUsers = mockUsers.filter(user => 
      user.name.includes(query) || 
      user.department.includes(query) ||
      user.role.includes(query)
    ).map(user => ({
      ...user,
      isAdded: currentContacts.some(contact => contact.id === user.id)
    }))
    
    return filteredUsers
  },

  // 添加联系人
  addContact: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从搜索结果中找到对应的用户
    const { state } = useStore()
    const mockUsers = [
      { id: 1, name: '张老师', avatar: null, department: '教学部', role: 'teacher', status: 'online' },
      { id: 2, name: '李老师', avatar: null, department: '教学部', role: 'teacher', status: 'offline' },
      { id: 3, name: '王老师', avatar: null, department: '教学部', role: 'teacher', status: 'online' },
      { id: 4, name: '赵同学', avatar: null, department: '学生部', role: 'student', status: 'online' },
      { id: 5, name: '钱同学', avatar: null, department: '学生部', role: 'student', status: 'offline' },
      { id: 6, name: '孙同学', avatar: null, department: '学生部', role: 'student', status: 'online' }
    ]
    
    const targetUser = mockUsers.find(user => user.id === userId)
    if (!targetUser) {
      throw new Error('用户不存在')
    }

    const mockUser = {
      ...targetUser,
      lastMessage: '你好,很高兴认识你',
      lastTime: new Date(),
      unread: 0
    }
    
    return {
      success: true,
      data: mockUser,
      message: '添加联系人成功'
    }
  },

  // 删除联系人
  removeContact: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      message: '删除成功'
    }
  },

  // 清空聊天记录
  async clearHistory(contactId) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      success: true,
      message: '聊天记录已清空'
    }
  },
  
  // 获取隐藏的会话列表
  async getHiddenConversations() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: {
        conversations: []
      }
    }
  },
  
  // 更新联系人设置
  async updateContactSettings(contactId, settings) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        contactId,
        ...settings
      }
    }
  },

  // 获取群聊列表
  getGroups: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return [
      {
        id: 'group1',
        name: '班级群',
        members: [1, 2, 3],
        owner: 1,
        lastMessage: '大家好',
        lastTime: new Date(),
        type: 'group'
      }
    ]
  },

  // 获取群聊消息
  getGroupMessages: async (groupId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: 1,
        content: '欢迎加入群聊！',
        senderId: 1,
        senderName: '张老师',
        timestamp: new Date(Date.now() - 3600000),
        type: 'group'
      }
    ]
  },

  // 发送群聊消息
  sendGroupMessage: async (groupId, message) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: Date.now(),
      ...message,
      type: 'group',
      timestamp: new Date()
    }
  },

  // 创建群聊
  createGroup: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    // 模拟创建群聊
    const mockGroup = {
      id: Date.now(),
      name: data.name,
      avatar: null,
      members: data.members,
      owner: data.owner,
      lastMessage: '群聊创建成功',
      lastTime: new Date(),
      unread: 0,
      type: 'group'
    }
    
    return {
      success: true,
      data: mockGroup,
      message: '创建群聊成功'
    }
  },

  // 更新群聊信息
  updateGroup: async (groupId, data) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      message: '群聊信息已更新'
    }
  },

  // 添加群成员
  addGroupMember: async (groupId, userId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      message: '成员已添加'
    }
  },

  // 移除群成员
  removeGroupMember: async (groupId, userId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      message: '成员已移除'
    }
  },

  // 退出群聊
  leaveGroup: async (groupId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      message: '已退出群聊'
    }
  },

  // 解散群聊
  dismissGroup: async (groupId) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      success: true,
      message: '群聊已解散'
    }
  },

  // 获取群聊设置
  getGroupSettings: async (groupId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      notifications: true,
      memberPermissions: {
        canInvite: true,
        canSpeak: true
      }
    }
  },

  // 更新群聊设置
  updateGroupSettings: async (groupId, settings) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      message: '设置已更新'
    }
  },

  // 获取最近媒体文件
  getRecentMedia: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: 1, url: 'https://picsum.photos/200/200?random=1', type: 'image' },
      { id: 2, url: 'https://picsum.photos/200/200?random=2', type: 'image' },
      { id: 3, url: 'https://picsum.photos/200/200?random=3', type: 'image' },
      { id: 4, url: 'https://picsum.photos/200/200?random=4', type: 'image' },
      { id: 5, url: 'https://picsum.photos/200/200?random=5', type: 'image' },
      { id: 6, url: 'https://picsum.photos/200/200?random=6', type: 'image' }
    ]
  },

  // 获取最近文件
  getRecentFiles: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: 1, name: '项目方案.docx', size: 1024 * 1024 * 2.5 },
      { id: 2, name: '会议记录.pdf', size: 1024 * 512 },
      { id: 3, name: '数据分析.xlsx', size: 1024 * 1024 * 1.8 }
    ]
  },

  // 获取最近链接
  getRecentLinks: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: 1, title: '2024年Web开发趋势分析', url: 'https://example.com/web-trends-2024' },
      { id: 2, title: '如何提高开发效率：10个实用技巧', url: 'https://example.com/dev-tips' },
      { id: 3, title: '最新前端框架对比', url: 'https://example.com/framework-comparison' }
    ]
  },

  // 获取群成员
  getGroupMembers: async (groupId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟群成员数据
    return [
      { id: 1, name: '张三', avatar: null, role: 'owner' },
      { id: 2, name: '李四', avatar: null, role: 'admin' },
      { id: 3, name: '王五', avatar: null, role: 'member' }
    ]
  }
}

// 喵言API
export const miaoyanApi = {
  // 获取喵言建议
  async getSuggestion(messages, contextRange) {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟响应
    return {
      success: true,
      data: {
        content: '根据上下文分析，我建议这样回复...',
        suggestion: '好的，我明白了，让我们继续讨论这个问题。'
      }
    }
  },

  // 更新向量数据库
  async updateVectorDb(messages) {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      success: true,
      data: {
        message: '向量数据库更新成功'
      }
    }
  },

  // 更新索引
  async updateIndex() {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return {
      success: true,
      data: {
        message: '索引更新成功'
      }
    }
  }
}

// 导出 API 请求钩子
export const useApi = () => ({
  user: userApi,
  settings: settingsApi,
  upload: uploadApi,
  auth: authApi,
  chat: chatApi,
  miaoyan: miaoyanApi
}) 