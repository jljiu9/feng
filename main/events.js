// 全局事件管理
import { ref, watch } from 'vue'
import { useStore } from './store'

// 剪贴板事件相关
// 被Chat.vue使用 - 用于处理消息复制
const clipboardEvents = {
  // 复制文本到剪贴板
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('复制失败:', err)
      return false
    }
  },

  // 从剪贴板读取文本
  readFromClipboard: async () => {
    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (err) {
      console.error('读取剪贴板失败:', err)
      return null
    }
  }
}

// 鼠标事件相关
// 被Chat.vue使用 - 用于处理消息选择和右键菜单
const mouseEvents = {
  // 记录鼠标位置
  mousePosition: ref({ x: 0, y: 0 }),

  // 更新鼠标位置
  updateMousePosition: (event) => {
    mouseEvents.mousePosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  },

  // 检查点击是否在目标元素外部
  isClickOutside: (event, elementRef) => {
    return elementRef && !elementRef.value?.contains(event.target)
  }
}

// 键盘事件相关
// 被Chat.vue使用 - 用于处理快捷键
const keyboardEvents = {
  // 检查是否按下特定组合键
  isHotkey: (event, key, modifiers = []) => {
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
      requiredModifiers.ctrl === pressedModifiers.ctrl &&
      requiredModifiers.alt === pressedModifiers.alt &&
      requiredModifiers.shift === pressedModifiers.shift &&
      requiredModifiers.meta === pressedModifiers.meta
  }
}

// 触摸事件相关
// 被Chat.vue使用 - 用于处理移动端手势
const touchEvents = {
  touchStartPosition: ref({ x: 0, y: 0 }),
  
  // 记录触摸开始位置
  handleTouchStart: (event) => {
    const touch = event.touches[0]
    touchEvents.touchStartPosition.value = {
      x: touch.clientX,
      y: touch.clientY
    }
  },
  
  // 计算触摸滑动距离
  getTouchDistance: (event) => {
    const touch = event.touches[0]
    const { x: startX, y: startY } = touchEvents.touchStartPosition.value
    return {
      x: touch.clientX - startX,
      y: touch.clientY - startY
    }
  }
}

// 窗口事件相关
// 被Chat.vue和App.vue使用 - 用于处理窗口大小变化
const windowEvents = {
  // 窗口大小
  windowSize: ref({
    width: window.innerWidth,
    height: window.innerHeight
  }),
  
  // 更新窗口大小
  updateWindowSize: () => {
    windowEvents.windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  
  // 检查是否为移动设备
  isMobile: () => window.innerWidth < 768
}

// 新增事件总线模块
// 创建全局事件总线
const eventBus = (() => {
  const listeners = new Map()
  
  return {
    on(event, callback) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }
      listeners.get(event).add(callback)
    },
    off(event, callback) {
      if (listeners.has(event)) {
        listeners.get(event).delete(callback)
      }
    },
    emit(event, ...args) {
      if (listeners.has(event)) {
        listeners.get(event).forEach(cb => cb(...args))
      }
    }
  }
})()

// 状态同步事件处理器
const setupStateSync = () => {
  const { state, actions } = useStore()
  
  // 监听状态变化并广播
  watch(() => state, (newState) => {
    eventBus.emit('state-change', newState)
  }, { deep: true })

  // 注册全局状态操作事件
  eventBus.on('dispatch-action', (actionName, payload) => {
    if (actions[actionName]) {
      actions[actionName](payload)
    }
  })
}

// 初始化全局事件系统
const initGlobalEvents = () => {
  // 监听鼠标移动
  document.addEventListener('mousemove', mouseEvents.updateMousePosition)
  
  // 监听窗口大小变化
  window.addEventListener('resize', windowEvents.updateWindowSize)
  
  setupStateSync() // 新增状态同步
  
  // 返回清理函数
  return () => {
    document.removeEventListener('mousemove', mouseEvents.updateMousePosition)
    window.removeEventListener('resize', windowEvents.updateWindowSize)
  }
}

// 统一导出（唯一导出点）
export {
  clipboardEvents,
  mouseEvents,
  keyboardEvents,
  touchEvents,
  windowEvents,
  eventBus,
  initGlobalEvents
} 