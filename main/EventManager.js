/**
 * @fileoverview 事件管理器 - 整合事件处理和日志功能
 * @author [@枫叶君]
 * @version 1.0.0
 */


import { ref } from 'vue'
import PluginLogger from './tools.js'

// 创建事件管理专用的日志记录器
const eventLogger = new PluginLogger('事件管理')

/**
 * 事件追踪器 - 用于记录和分析事件
 */
class EventTracker {
  constructor() {
    this.events = new Map()
    this.startTime = Date.now()
    this.metrics = {
      eventCounts: {},
      errorRates: {},
      performance: {}
    }
  }

  /**
   * 记录事件
   * @param {string} eventName - 事件名称
   * @param {Object} eventData - 事件数据
   */
  track(eventName, eventData) {
    const timestamp = Date.now()
    const eventInfo = {
      timestamp,
      timeSinceStart: timestamp - this.startTime,
      data: eventData
    }
    
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    this.events.get(eventName).push(eventInfo)
    
    eventLogger.debug(`事件追踪: ${eventName}`, eventInfo)
  }

  /**
   * 获取事件统计
   * @returns {Object} 事件统计信息
   */
  getStats() {
    const stats = {}
    this.events.forEach((events, name) => {
      stats[name] = {
        count: events.length,
        lastTriggered: events[events.length - 1].timestamp
      }
    })
    return stats
  }

  /**
   * 记录事件性能指标
   * @param {string} eventName - 事件名称
   * @param {number} duration - 执行时间
   */
  trackPerformance(eventName, duration) {
    if (!this.metrics.performance[eventName]) {
      this.metrics.performance[eventName] = {
        count: 0,
        totalDuration: 0,
        minDuration: duration,
        maxDuration: duration
      }
    }
    
    const stats = this.metrics.performance[eventName]
    stats.count++
    stats.totalDuration += duration
    stats.minDuration = Math.min(stats.minDuration, duration)
    stats.maxDuration = Math.max(stats.maxDuration, duration)
  }

  /**
   * 记录错误率
   * @param {string} eventName - 事件名称
   * @param {boolean} isError - 是否发生错误
   */
  trackErrorRate(eventName, isError) {
    if (!this.metrics.errorRates[eventName]) {
      this.metrics.errorRates[eventName] = {
        total: 0,
        errors: 0
      }
    }
    
    const stats = this.metrics.errorRates[eventName]
    stats.total++
    if (isError) stats.errors++
  }
}

/**
 * 增强的事件管理器
 */
export class EnhancedEventManager {
  constructor() {
    this.tracker = new EventTracker()
    this.setupEvents()
    
    // 添加事件限流和防抖动功能
    this.rateLimiters = new Map()
    this.debounceTimers = new Map()
  }

  /**
   * 设置所有事件处理器
   * @private
   */
  setupEvents() {
    // 剪贴板事件
    this.clipboard = {
      copy: async (text) => {
        try {
          await navigator.clipboard.writeText(text)
          eventLogger.success('内容已复制到剪贴板')
          this.tracker.track('clipboard:copy', { text })
          return true
        } catch (err) {
          eventLogger.error('复制失败', err)
          return false
        }
      },

      read: async () => {
        try {
          const text = await navigator.clipboard.readText()
          this.tracker.track('clipboard:read', { text })
          return text
        } catch (err) {
          eventLogger.error('读取剪贴板失败', err)
          return null
        }
      }
    }

    // 鼠标事件
    this.mouse = {
      position: ref({ x: 0, y: 0 }),
      
      updatePosition: (event) => {
        this.mouse.position.value = {
          x: event.clientX,
          y: event.clientY
        }
        this.tracker.track('mouse:move', this.mouse.position.value)
      },

      isOutside: (event, elementRef) => {
        const result = elementRef && !elementRef.value?.contains(event.target)
        this.tracker.track('mouse:checkOutside', { result })
        return result
      }
    }

    // 键盘事件
    this.keyboard = {
      /**
       * 检查快捷键组合
       * @param {KeyboardEvent} event - 键盘事件
       * @param {string} key - 目标按键
       * @param {string[]} modifiers - 修饰键数组
       */
      checkHotkey: (event, key, modifiers = []) => {
        const result = this.#checkHotkeyInternal(event, key, modifiers)
        this.tracker.track('keyboard:hotkey', { key, modifiers, result })
        return result
      },

      /**
       * 注册快捷键
       * @param {string} key - 按键
       * @param {string[]} modifiers - 修饰键
       * @param {Function} callback - 回调函数
       */
      registerHotkey: (key, modifiers, callback) => {
        const handler = (event) => {
          if (this.keyboard.checkHotkey(event, key, modifiers)) {
            callback(event)
          }
        }
        document.addEventListener('keydown', handler)
        eventLogger.info(`已注册快捷键: ${modifiers.join('+')}+${key}`)
        return () => document.removeEventListener('keydown', handler)
      }
    }

    // 触摸事件
    this.touch = {
      startPosition: ref({ x: 0, y: 0 }),
      
      handleStart: (event) => {
        const touch = event.touches[0]
        this.touch.startPosition.value = {
          x: touch.clientX,
          y: touch.clientY
        }
        this.tracker.track('touch:start', this.touch.startPosition.value)
      },

      getDistance: (event) => {
        const touch = event.touches[0]
        const distance = {
          x: touch.clientX - this.touch.startPosition.value.x,
          y: touch.clientY - this.touch.startPosition.value.y
        }
        this.tracker.track('touch:distance', distance)
        return distance
      }
    }

    // 窗口事件
    this.window = {
      size: ref({
        width: window.innerWidth,
        height: window.innerHeight
      }),

      updateSize: () => {
        this.window.size.value = {
          width: window.innerWidth,
          height: window.innerHeight
        }
        this.tracker.track('window:resize', this.window.size.value)
        eventLogger.info('窗口大小已更新')
      },

      isMobile: () => window.innerWidth < 768
    }

    // 添加网络事件处理
    this.network = {
      // WebSocket 事件管理
      socket: {
        instances: new Map(),
        
        /**
         * 创建并管理 WebSocket 连接
         * @param {string} url - WebSocket URL
         * @param {Object} options - 配置选项
         */
        create: (url, options = {}) => {
          const ws = new WebSocket(url)
          const handlers = new Map()
          
          ws.onopen = () => {
            this.tracker.track('socket:connect', { url })
            eventLogger.success(`WebSocket 连接成功: ${url}`)
            if (options.onOpen) options.onOpen()
          }
          
          ws.onclose = () => {
            this.tracker.track('socket:close', { url })
            eventLogger.info(`WebSocket 连接关闭: ${url}`)
            if (options.onClose) options.onClose()
          }
          
          ws.onerror = (error) => {
            this.tracker.track('socket:error', { url, error })
            eventLogger.error(`WebSocket 错误: ${url}`, error)
            if (options.onError) options.onError(error)
          }
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            this.tracker.track('socket:message', { url, type: data.type, data })
            handlers.get(data.type)?.(data)
          }
          
          const instance = {
            ws,
            on: (type, handler) => {
              handlers.set(type, handler)
              return instance
            },
            send: (type, data) => {
              ws.send(JSON.stringify({ type, data }))
              this.tracker.track('socket:send', { url, type, data })
              return instance
            },
            close: () => ws.close()
          }
          
          this.network.socket.instances.set(url, instance)
          return instance
        }
      },

      // WebRTC 事件管理
      rtc: {
        connections: new Map(),
        
        /**
         * 创建并管理 WebRTC 连接
         * @param {string} peerId - 对等连接ID
         * @param {Object} options - 配置选项
         */
        createConnection: (peerId, options = {}) => {
          const pc = new RTCPeerConnection(options.config)
          
          pc.onicecandidate = (event) => {
            this.tracker.track('rtc:iceCandidate', { peerId, candidate: event.candidate })
            if (options.onIceCandidate) options.onIceCandidate(event)
          }
          
          pc.ontrack = (event) => {
            this.tracker.track('rtc:track', { peerId, track: event.track })
            if (options.onTrack) options.onTrack(event)
          }
          
          const connection = {
            pc,
            addTrack: (track, ...streams) => {
              pc.addTrack(track, ...streams)
              this.tracker.track('rtc:addTrack', { peerId, track })
            },
            createOffer: async () => {
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              this.tracker.track('rtc:createOffer', { peerId, offer })
              return offer
            }
          }
          
          this.network.rtc.connections.set(peerId, connection)
          return connection
        }
      },

      // Fetch 事件管理
      fetch: {
        interceptors: {
          request: [],
          response: []
        },
        
        /**
         * 添加请求拦截器
         * @param {Function} interceptor - 拦截器函数
         */
        addRequestInterceptor: (interceptor) => {
          this.network.fetch.interceptors.request.push(interceptor)
        },
        
        /**
         * 添加响应拦截器
         * @param {Function} interceptor - 拦截器函数
         */
        addResponseInterceptor: (interceptor) => {
          this.network.fetch.interceptors.response.push(interceptor)
        },
        
        /**
         * 增强的 fetch 请求
         * @param {string} url - 请求URL
         * @param {Object} options - 请求配置
         */
        request: async (url, options = {}) => {
          const startTime = Date.now()
          let request = new Request(url, options)
          
          // 应用请求拦截器
          for (const interceptor of this.network.fetch.interceptors.request) {
            request = await interceptor(request)
          }
          
          this.tracker.track('fetch:request', {
            url,
            method: options.method || 'GET',
            headers: Object.fromEntries(request.headers)
          })
          
          try {
            let response = await fetch(request)
            
            // 应用响应拦截器
            for (const interceptor of this.network.fetch.interceptors.response) {
              response = await interceptor(response)
            }
            
            const duration = Date.now() - startTime
            this.tracker.track('fetch:response', {
              url,
              status: response.status,
              duration
            })
            
            eventLogger.success(`请求成功: ${url} (${duration}ms)`)
            return response
            
          } catch (error) {
            this.tracker.track('fetch:error', { url, error })
            eventLogger.error(`请求失败: ${url}`, error)
            throw error
          }
        }
      }
    }
  }

  /**
   * 内部方法：检查快捷键
   * @private
   */
  #checkHotkeyInternal(event, key, modifiers) {
    const pressedKey = event.key.toLowerCase()
    const isKeyMatch = pressedKey === key.toLowerCase()
    
    const requiredModifiers = {
      ctrl: modifiers.includes('ctrl'),
      alt: modifiers.includes('alt'),
      shift: modifiers.includes('shift'),
      meta: modifiers.includes('meta')
    }
    
    const pressedModifiers = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey
    }
    
    return isKeyMatch && 
      Object.entries(requiredModifiers).every(
        ([mod, required]) => required === pressedModifiers[mod]
      )
  }

  /**
   * 初始化全局事件监听
   * @returns {Function} 清理函数
   */
  init() {
    eventLogger.info('初始化事件管理器')
    const endTimer = eventLogger.time('事件管理器初始化')
    
    document.addEventListener('mousemove', this.mouse.updatePosition)
    window.addEventListener('resize', this.window.updateSize)
    
    endTimer()
    
    return () => {
      document.removeEventListener('mousemove', this.mouse.updatePosition)
      window.removeEventListener('resize', this.window.updateSize)
      eventLogger.info('事件管理器已清理')
    }
  }

  /**
   * 获取事件统计信息
   */
  getEventStats() {
    const stats = this.tracker.getStats()
    eventLogger.table(stats)
    return stats
  }

  /**
   * 创建事件限流器
   * @param {string} eventName - 事件名称
   * @param {number} limit - 时间窗口内的最大调用次数
   * @param {number} window - 时间窗口(ms)
   */
  createRateLimiter(eventName, limit, window) {
    this.rateLimiters.set(eventName, {
      limit,
      window,
      calls: [],
      check: () => {
        const now = Date.now()
        this.rateLimiters.get(eventName).calls = 
          this.rateLimiters.get(eventName).calls.filter(time => now - time < window)
        return this.rateLimiters.get(eventName).calls.length < limit
      }
    })
  }

  /**
   * 防抖动处理
   * @param {string} eventName - 事件名称
   * @param {Function} fn - 要执行的函数
   * @param {number} delay - 延迟时间(ms)
   */
  debounce(eventName, fn, delay) {
    if (this.debounceTimers.has(eventName)) {
      clearTimeout(this.debounceTimers.get(eventName))
    }
    this.debounceTimers.set(eventName, setTimeout(() => {
      fn()
      this.debounceTimers.delete(eventName)
    }, delay))
  }

  /**
   * 批量处理事件
   * @param {string} eventName - 事件名称
   * @param {Function} fn - 处理函数
   * @param {Object} options - 批处理选项
   */
  batchProcess(eventName, fn, options = {}) {
    const { maxSize = 10, maxWait = 1000 } = options
    let batch = []
    let timeout = null

    const processBatch = () => {
      if (batch.length > 0) {
        fn(batch)
        batch = []
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }

    return (item) => {
      batch.push(item)
      
      if (batch.length >= maxSize) {
        processBatch()
      } else if (!timeout) {
        timeout = setTimeout(processBatch, maxWait)
      }
    }
  }

  /**
   * 优化的事件分发
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  optimizedDispatch(eventName, handler) {
    return async (...args) => {
      const startTime = performance.now()
      
      // 检查限流
      const rateLimiter = this.rateLimiters.get(eventName)
      if (rateLimiter && !rateLimiter.check()) {
        eventLogger.warn(`事件 ${eventName} 触发过于频繁`)
        return
      }
      
      try {
        // 记录事件调用
        if (rateLimiter) {
          rateLimiter.calls.push(Date.now())
        }
        
        // 执行处理函数
        const result = await handler(...args)
        
        // 记录性能指标
        const duration = performance.now() - startTime
        this.tracker.trackPerformance(eventName, duration)
        
        return result
      } catch (error) {
        this.tracker.trackErrorRate(eventName, true)
        eventLogger.error(`事件 ${eventName} 处理出错:`, error)
        throw error
      }
    }
  }

  /**
   * 获取详细的性能报告
   */
  getPerformanceReport() {
    const report = {
      events: this.tracker.metrics.performance,
      errorRates: this.tracker.metrics.errorRates,
      summary: {
        totalEvents: 0,
        avgDuration: 0,
        errorRate: 0
      }
    }

    // 计算总体统计
    let totalDuration = 0
    let totalErrors = 0
    let totalCalls = 0

    Object.values(report.events).forEach(stats => {
      report.summary.totalEvents += stats.count
      totalDuration += stats.totalDuration
    })

    Object.values(report.errorRates).forEach(stats => {
      totalErrors += stats.errors
      totalCalls += stats.total
    })

    report.summary.avgDuration = totalDuration / report.summary.totalEvents || 0
    report.summary.errorRate = (totalErrors / totalCalls) || 0

    eventLogger.table(report)
    return report
  }
}

// 导出单例实例
export const eventManager = new EnhancedEventManager()
