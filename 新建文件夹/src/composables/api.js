import { ref, onUnmounted } from 'vue'

/**
 * API 类 - 统一管理认证、HTTP请求和WebSocket通信
 * @class API
 */
class API {
  /**
   * @constructor
   * @param {Object} config - API配置
   * @param {string} config.baseURL - API基础URL
   * @param {string} config.wsURL - WebSocket URL
   */
  constructor(config = {}) {
    this.baseURL = config.baseURL || ''
    this.wsURL = config.wsURL || ''
    
    // HTTP状态
    this.loading = ref(false)
    this.error = ref(null)
    
    // WebSocket状态
    this.ws = ref(null)
    this.wsConnected = ref(false)
    this.wsMessage = ref(null)
    
    // 认证状态
    this.user = window.$store.user.current
    this.token = window.$store.user.token

    // 自动重连配置
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
  }

  /**
   * 发起HTTP请求
   * @async
   * @param {string} url - 请求URL
   * @param {Object} options - 请求配置
   * @returns {Promise<any>} 响应数据
   * @throws {Error} 请求错误
   */
  async request(url, options = {}) {
    this.loading.value = true
    this.error.value = null

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(this.token.value ? { 'Authorization': `Bearer ${this.token.value}` } : {}),
        ...options.headers
      }

      const response = await fetch(this.baseURL + url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (e) {
      this.error.value = e.message
      throw e
    } finally {
      this.loading.value = false
    }
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求配置
   * @returns {Promise<any>}
   */
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {any} data - 请求数据
   * @param {Object} options - 请求配置
   * @returns {Promise<any>}
   */
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {any} data - 请求数据
   * @param {Object} options - 请求配置
   * @returns {Promise<any>}
   */
  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求配置
   * @returns {Promise<any>}
   */
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }

  /**
   * 用户登录
   * @async
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<boolean>} 登录是否成功
   */
  async login(username, password) {
    try {
      const data = await this.post('/api/login', { username, password })
      if (data.token) {
        window.$store.user.setToken(data.token)
        window.$store.user.setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  /**
   * 用户登出
   */
  logout() {
    window.$store.user.clearUserInfo()
    this.closeWebSocket()
  }

  /**
   * 初始化WebSocket连接
   */
  initWebSocket() {
    if (!this.wsURL) return
    
    this.ws.value = new WebSocket(this.wsURL)

    this.ws.value.onopen = () => {
      this.wsConnected.value = true
      this.error.value = null
      this.reconnectAttempts = 0
      console.log('WebSocket连接已建立')
    }

    this.ws.value.onmessage = (event) => {
      try {
        this.wsMessage.value = JSON.parse(event.data)
      } catch {
        this.wsMessage.value = event.data
      }
    }

    this.ws.value.onerror = (event) => {
      this.error.value = 'WebSocket连接错误'
      console.error('WebSocket错误:', event)
    }

    this.ws.value.onclose = () => {
      this.wsConnected.value = false
      console.log('WebSocket连接已关闭')
      this.reconnectWebSocket()
    }
  }

  /**
   * 重新连接WebSocket
   * @private
   */
  reconnectWebSocket() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('WebSocket重连次数超过最大限制')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试重新连接 WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    setTimeout(() => this.initWebSocket(), this.reconnectInterval)
  }

  /**
   * 发送WebSocket消息
   * @param {any} data - 要发送的数据
   */
  sendMessage(data) {
    if (this.ws.value?.readyState === WebSocket.OPEN) {
      this.ws.value.send(typeof data === 'string' ? data : JSON.stringify(data))
    } else {
      this.error.value = 'WebSocket连接未建立'
    }
  }

  /**
   * 关闭WebSocket连接
   */
  closeWebSocket() {
    if (this.ws.value) {
      this.ws.value.close()
      this.ws.value = null
    }
  }

  /**
   * 销毁API实例
   */
  destroy() {
    this.closeWebSocket()
  }
}

// 创建全局API实例
const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  wsURL: import.meta.env.VITE_WS_URL || ''
})

// 添加到全局状态
if (!window.$store) window.$store = {}
window.$store.api = api

// 在组件卸载时自动清理
onUnmounted(() => {
  api.destroy()
})

export default api