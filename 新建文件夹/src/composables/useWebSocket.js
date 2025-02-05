import { ref, onUnmounted } from 'vue'

export function useWebSocket(url) {
  const ws = ref(null)
  const message = ref(null)
  const connected = ref(false)
  const error = ref(null)

  // 创建WebSocket连接
  const connect = () => {
    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      connected.value = true
      error.value = null
      console.log('WebSocket连接已建立')
    }

    ws.value.onmessage = (event) => {
      try {
        message.value = JSON.parse(event.data)
      } catch {
        message.value = event.data
      }
    }

    ws.value.onerror = (event) => {
      error.value = '连接错误'
      console.error('WebSocket错误:', event)
    }

    ws.value.onclose = () => {
      connected.value = false
      console.log('WebSocket连接已关闭')
      // 自动重连
      setTimeout(connect, 3000)
    }
  }

  // 发送消息
  const send = (data) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(typeof data === 'string' ? data : JSON.stringify(data))
    } else {
      error.value = '连接未建立'
    }
  }

  // 关闭连接
  const close = () => {
    if (ws.value) {
      ws.value.close()
    }
  }

  // 组件卸载时关闭连接
  onUnmounted(() => {
    close()
  })

  // 立即连接
  connect()

  return {
    connected,
    message,
    error,
    send,
    close,
    connect
  }
} 