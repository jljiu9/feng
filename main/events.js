// 全局事件管理
import { ref } from 'vue'

// 剪贴板事件相关
// 被Chat.vue使用 - 用于处理消息复制
export const clipboardEvents = {
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
export const mouseEvents = {
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
export const keyboardEvents = {
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
export const touchEvents = {
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
export const windowEvents = {
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

// 初始化全局事件监听
export const initGlobalEvents = () => {
  // 监听鼠标移动
  document.addEventListener('mousemove', mouseEvents.updateMousePosition)
  
  // 监听窗口大小变化
  window.addEventListener('resize', windowEvents.updateWindowSize)
  
  // 返回清理函数
  return () => {
    document.removeEventListener('mousemove', mouseEvents.updateMousePosition)
    window.removeEventListener('resize', windowEvents.updateWindowSize)
  }
} 