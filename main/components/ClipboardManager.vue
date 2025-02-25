<template>
  <div class="clipboard-manager h-full flex flex-col overflow-hidden">
    <!-- 顶部工具栏优化 -->
    <div class="flex items-center justify-between border-b p-4 bg-card/50">
      <h1 class="text-lg font-medium">剪贴板管理器</h1>
      <div class="flex items-center gap-2">
        <button 
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors"
          :class="monitoringActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted/50'"
          @click="toggleMonitoring"
          :title="monitoringActive ? '点击停止监控 (Ctrl+M)' : '点击开始监控 (Ctrl+M)'"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="monitoringActive ? 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'" />
          </svg>
          <span>{{ monitoringActive ? '监控中' : '开始监控' }}</span>
        </button>
        <PopConfirm
          theme="danger"
          title="清空确认"
          :message="`将永久删除 ${totalItems} 条记录`"
          @confirm="handleClearAll"
        >
          <template #trigger>
            <button class="btn-danger">
              <TrashIcon class="w-4 h-4" />
              清空全部
            </button>
          </template>
        </PopConfirm>
        <button 
          @click="openEditor()"
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs hover:bg-muted/50"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          <span>新建富文本</span>
        </button>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧分类列表 -->
      <div class="w-48 border-r overflow-y-auto">
        <div class="p-2">
          <TabGroup
            v-model="currentCategory"
            :tabs="categories"
            vertical
          />
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 内容列表 -->
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="item in filteredItems" 
              :key="item.id"
              class="group relative rounded-lg border p-3 hover:shadow-md transition-shadow"
            >
              <!-- 内容预览 -->
              <div class="mb-2">
                <template v-if="item.type === 'image'">
                  <img :src="item.content" class="w-full h-32 object-cover rounded" />
                </template>
                
                <template v-else-if="item.type === 'richtext'">
                  <TabGroup
                    v-model="item.currentView"
                    :tabs="[
                      { value: 'rich', label: '富文本' },
                      { value: 'text', label: '纯文本' },
                      { value: 'code', label: '源代码' }
                    ]"
                  />
                  
                  <!-- 视图内容 -->
                  <div class="mt-2">
                    <div v-if="item.currentView === 'rich'" v-html="item.html" class="prose prose-sm max-w-none"></div>
                    <div v-else-if="item.currentView === 'text'" class="text-sm whitespace-pre-wrap">{{ item.content }}</div>
                    <pre v-else class="text-xs bg-muted/50 p-2 rounded overflow-x-auto"><code>{{ item.html }}</code></pre>
                  </div>
                </template>
                
                <template v-else>
                  <div class="text-sm line-clamp-3">{{ item.content }}</div>
                </template>
              </div>
              
              <!-- 底部信息 -->
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ messageFormatters.formatMessageTime(item.timestamp) }}</span>
                <div class="flex items-center gap-2">
                  <button 
                    @click="openEditor(item)"
                    class="hover:text-foreground"
                    title="编辑"
                  >
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>
                  <button 
                    class="hover:text-foreground" 
                    @click="copyItem(item)"
                    :title="getCopyTitle(item)"
                  >
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <PopConfirm
                    theme="danger"
                    title="删除确认"
                    message="是否确认删除该记录？"
                    @confirm="deleteItem(item)"
                  >
                    <template #trigger>
                      <button class="btn-icon-danger">
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </template>
                  </PopConfirm>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部编辑器 -->
        <div class="border-t p-4">
          <div class="rounded-lg border bg-card p-2">
            <div class="mb-2">
              <button 
                class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs hover:bg-muted/50"
                @click="insertImage"
              >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>插入图片</span>
              </button>
            </div>
            <textarea 
              v-model="newContent"
              class="w-full min-h-[100px] bg-transparent resize-none focus:outline-none text-sm"
              placeholder="输入或粘贴内容..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加编辑器组件 -->
    <NotionStyleEditor
      ref="editor"
      position="right"
      size="60%"
      @save="handleEditorSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '../store'
import { clipboardEvents } from '../events'
import { messageFormatters } from '../utils/chatUtils'
import { useDebounceFn } from '@vueuse/core'
import TabGroup from '../components/ui/TabGroup.vue'
import PopConfirm from '../components/ui/PopConfirm.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import NotionStyleEditor from '../components/ui/NotionStyleEditor.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const { actions } = useStore()

// 常量定义
const MAX_ITEMS = 100
const MONITORING_INTERVAL = 1000
const SAVE_DEBOUNCE_MS = 500

// 状态定义
const monitoringInterval = ref(null)
const monitoringActive = ref(false)
const currentCategory = ref('all')
const newContent = ref('')
const items = ref([])
const lastClipboardContent = ref('')
const isDragging = ref(false)

// 编辑器相关逻辑
const editor = ref(null)
const editingItem = ref(null)

// 分类定义
const categories = [
  { value: 'all', label: '全部', count: computed(() => items.value.length) },
  { value: 'text', label: '纯文本', count: computed(() => items.value.filter(i => i.type === 'text').length) },
  { value: 'richtext', label: '富文本', count: computed(() => items.value.filter(i => i.type === 'richtext').length) },
  { value: 'image', label: '图片', count: computed(() => items.value.filter(i => i.type === 'image').length) }
]

// 过滤后的列表
const filteredItems = computed(() => {
  if (currentCategory.value === 'all') return items.value
  return items.value.filter(item => item.type === currentCategory.value)
})

// 优化的保存函数
const debouncedSave = useDebounceFn(() => {
  try {
    localStorage.setItem('clipboard-items', JSON.stringify(items.value))
    console.log('数据已保存到 localStorage') // 添加日志以便调试
  } catch (error) {
    console.error('保存数据失败:', error)
    actions.addNotification({
      type: 'error',
      message: '保存数据失败'
    })
  }
}, 1000) // 设置 1 秒的防抖时间

// 修改检测内容类型的函数
const detectContentType = (content) => {
  // 如果已经是对象形式，直接返回类型
  if (typeof content === 'object' && content !== null) {
    return content.type || 'text'
  }
  
  // 确保内容是字符串
  const strContent = String(content)
  
  // 检查是否为 base64 图片
  if (strContent.startsWith('data:image')) {
    return 'image'
  }
  
  // 检查是否包含 HTML 标签
  // 使用更严格的 HTML 检测正则表达式
  const htmlRegex = /<[a-z][\s\S]*>/i
  if (htmlRegex.test(strContent)) {
    return 'richtext'
  }
  
  return 'text'
}

// 修改添加项目的函数
const addItem = async (content) => {
  try {
    // 如果已经是格式化的对象，直接使用
    if (typeof content === 'object' && content !== null && content.type) {
      const newItem = {
        id: Date.now(),
        timestamp: new Date(),
        currentView: content.type === 'image' ? 'preview' : 
                    content.type === 'richtext' ? 'rich' : 'formatted',
        ...content
      }
      items.value.unshift(newItem)
      debouncedSave()
      return
    }

    // 否则检测类型并格式化
    const type = detectContentType(content)
    const newItem = {
      id: Date.now(),
      timestamp: new Date(),
      currentView: type === 'image' ? 'preview' : 
                  type === 'richtext' ? 'rich' : 'formatted'
    }
    
    if (type === 'image') {
      const response = await fetch(content)
      const blob = await response.blob()
      const file = new File([blob], `image_${Date.now()}.png`, { type: 'image/png' })
      const previewUrl = URL.createObjectURL(file)
      
      Object.assign(newItem, {
        type: 'image',
        content: previewUrl,
        file: file
      })
    } else if (type === 'richtext') {
      // 处理 HTML 内容
      const htmlContent = String(content)
      // 使用 DOMParser 安全地解析 HTML 并获取纯文本
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      const plainText = doc.body.textContent || doc.body.innerText || ''
      
      Object.assign(newItem, {
        type: 'richtext',
        content: plainText.trim(),
        html: htmlContent
      })
    } else {
      Object.assign(newItem, {
        type: 'text',
        content: typeof content === 'object' ? JSON.stringify(content) : String(content)
      })
    }
    
    items.value.unshift(newItem)
    debouncedSave()

    // 限制最大条数
    if (items.value.length > MAX_ITEMS) {
      // 清理多余的预览 URL
      const removedItems = items.value.slice(MAX_ITEMS)
      removedItems.forEach(item => {
        if (item.type === 'image' && item.content) {
          URL.revokeObjectURL(item.content)
        }
      })
      items.value = items.value.slice(0, MAX_ITEMS)
      debouncedSave() // 在修改数组后也要保存
    }
  } catch (error) {
    console.error('添加项目失败:', error)
    actions.addNotification({
      type: 'error',
      message: '添加失败'
    })
  }
}

// 添加监听器以确保数据变化时保存
watch(
  () => items.value,
  () => {
    debouncedSave()
  },
  { deep: true }
)

// 清空所有项目
const handleClearAll = async () => {
  const confirmed = await actions.confirm({
    title: '确认清空',
    message: `即将永久删除 ${totalItems.value} 条记录`,
    confirmText: '永久删除',
    cancelText: '取消操作'
  })
  
  if (confirmed) {
    try {
      items.value = []
      debouncedSave()
      actions.addNotification({
        type: 'success',
        message: '已清空所有记录'
      })
    } catch (error) {
      console.error('清空失败:', error)
      actions.addNotification({
        type: 'error',
        message: '清空失败'
      })
    }
  }
}

// 修改监控函数
const startMonitoring = () => {
  try {
    monitoringInterval.value = setInterval(async () => {
      if (!document.hasFocus()) return

      try {
        const clipboardItems = await navigator.clipboard.read()
        
        for (const clipboardItem of clipboardItems) {
          const types = clipboardItem.types
          // console.log('Available clipboard types:', types) // 调试用

          // 优先处理图片
          if (types.includes('image/png') || types.includes('image/jpeg')) {
            const imageBlob = await clipboardItem.getType(types.find(type => type.startsWith('image/')))
            const base64Content = await new Promise((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result)
              reader.readAsDataURL(imageBlob)
            })

            if (base64Content === lastClipboardContent.value) {
              continue
            }

            lastClipboardContent.value = base64Content
            addItem({
              type: 'image',
              content: base64Content,
              file: new File([imageBlob], `image_${Date.now()}.png`, { type: imageBlob.type })
            })
            continue
          }
          
          // 处理富文本
          if (types.includes('text/html')) {
            const htmlBlob = await clipboardItem.getType('text/html')
            const html = await htmlBlob.text()
            
            // 获取纯文本作为备份
            const textBlob = await clipboardItem.getType('text/plain')
            const text = await textBlob.text()
            
            if (html === lastClipboardContent.value) {
              continue
            }

            lastClipboardContent.value = html
            addItem({
              type: 'richtext',
              content: text,
              html: html
            })
            continue
          }

          // 处理纯文本，检查是否包含 HTML
          if (types.includes('text/plain')) {
            const textBlob = await clipboardItem.getType('text/plain')
            const text = await textBlob.text()
            
            if (text === lastClipboardContent.value) {
              continue
            }

            lastClipboardContent.value = text
            
            // 检查文本是否包含 HTML 标签
            const htmlRegex = /<[a-z][\s\S]*>/i
            if (htmlRegex.test(text)) {
              addItem({
                type: 'richtext',
                content: text.replace(/<[^>]+>/g, '').trim(),
                html: text
              })
            } else {
              addItem({
                type: 'text',
                content: text
              })
            }
          }
        }
      } catch (error) {
        // 只有在真正的错误情况下才停止监控
        if (error.name !== 'NotAllowedError' && error.name !== 'DataError') {
          console.error('读取剪贴板失败:', error)
          stopMonitoring()
          actions.addNotification({
            type: 'error',
            message: '剪贴板监控失败，已停止监控'
          })
        }
      }
    }, MONITORING_INTERVAL)
    
    monitoringActive.value = true
    
    // 添加焦点变化监听
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
  } catch (error) {
    console.error('启动监控失败:', error)
    actions.addNotification({
      type: 'error',
      message: '启动监控失败'
    })
  }
}

// 处理窗口获得焦点
const handleFocus = () => {
  if (monitoringActive.value) {
    actions.addNotification({
      type: 'info',
      message: '剪贴板监控已恢复'
    })
  }
}

// 处理窗口失去焦点
const handleBlur = () => {
  if (monitoringActive.value) {
    actions.addNotification({
      type: 'info',
      message: '剪贴板监控已暂停（窗口未激活）'
    })
  }
}

// 停止监控时清理事件监听
const stopMonitoring = () => {
  if (monitoringInterval.value) {
    clearInterval(monitoringInterval.value)
    monitoringInterval.value = null
  }
  window.removeEventListener('focus', handleFocus)
  window.removeEventListener('blur', handleBlur)
  monitoringActive.value = false
}

// 切换监控状态
const toggleMonitoring = () => {
  if (monitoringActive.value) {
    stopMonitoring()
  } else {
    startMonitoring()
  }
}

// 删除单个项目
const deleteItem = async (item) => {
  try {
    const index = items.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      if (item.type === 'image') {
        URL.revokeObjectURL(item.content)
      }
      items.value.splice(index, 1)
      debouncedSave()
      actions.addNotification({
        type: 'success',
        message: '删除成功'
      })
    }
  } catch (error) {
    console.error('删除失败:', error)
    actions.addNotification({
      type: 'error',
      message: '删除失败'
    })
  }
}

// 修改复制功能
const copyItem = async (item) => {
  try {
    if (item.type === 'image' && item.file) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [item.file.type]: item.file
        })
      ])
    } else if (item.type === 'richtext') {
      // 根据当前视图模式决定复制内容
      if (item.currentView === 'code') {
        await navigator.clipboard.writeText(item.html)
      } else if (item.currentView === 'text') {
        await navigator.clipboard.writeText(item.content)
      } else {
        // 富文本模式，同时复制 HTML 和纯文本
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([item.html], { type: 'text/html' }),
          'text/plain': new Blob([item.content], { type: 'text/plain' })
        })
        await navigator.clipboard.write([clipboardItem])
      }
    } else {
      await navigator.clipboard.writeText(item.content)
    }
    
    actions.addNotification({
      type: 'success',
      message: '已复制到剪贴板'
    })
  } catch (error) {
    console.error('复制失败:', error)
    actions.addNotification({
      type: 'error',
      message: '复制失败'
    })
  }
}

// 获取复制按钮的提示文本
const getCopyTitle = (item) => {
  if (item.type === 'richtext') {
    return {
      rich: '复制富文本',
      text: '复制纯文本',
      code: '复制源代码'
    }[item.currentView]
  }
  return '复制'
}

// 插入图片
const insertImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          addItem(e.target.result)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('图片处理失败:', error)
        actions.addNotification({
          type: 'error',
          message: '图片处理失败'
        })
      }
    }
  }
  input.click()
}

// 加载本地存储的数据
const loadItems = () => {
  try {
    const savedItems = localStorage.getItem('clipboard-items')
    if (savedItems) {
      items.value = JSON.parse(savedItems)
      console.log('从 localStorage 加载了数据') // 添加日志以便调试
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    actions.addNotification({
      type: 'error',
      message: '加载数据失败'
    })
  }
}

// 拖拽处理
const handleDrop = async (event) => {
  try {
    isDragging.value = false
    const items = event.dataTransfer.items
    
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        const reader = new FileReader()
        
        reader.onload = (e) => {
          addItem(e.target.result)
        }
        
        reader.readAsDataURL(file)
      }
    }
  } catch (error) {
    console.error('处理拖拽失败:', error)
    actions.addNotification({
      type: 'error',
      message: '处理拖拽文件失败'
    })
  }
}

// 键盘快捷键处理
const handleKeydown = (e) => {
  if (e.ctrlKey && e.key === 'm') {
    e.preventDefault()
    toggleMonitoring()
  }
}

// 初始化
onMounted(() => {
  loadItems()
  window.addEventListener('keydown', handleKeydown)
})

// 清理
onUnmounted(() => {
  stopMonitoring()
  window.removeEventListener('keydown', handleKeydown)
  items.value.forEach(item => {
    if (item.type === 'image' && item.content) {
      URL.revokeObjectURL(item.content)
    }
  })
})

// 在script setup部分添加计算属性
const totalItems = computed(() => items.value.length)

// 修改编辑器打开方法
const openEditor = (item = null) => {
  if (editor.value) {
    editor.value.open(item?.content?.markdown || '')
    editingItem.value = item
  }
}

// 修改保存处理
const handleEditorSave = (content) => {
  const richContent = {
    markdown: content.markdown,
    html: DOMPurify.sanitize(content.html)
  }
  
  if (!editingItem.value) {
    addItem({
      type: 'richtext',
      content: richContent.markdown,
      html: richContent.html,
      timestamp: new Date().toISOString()
    })
  } else {
    editingItem.value.content = richContent.markdown
    editingItem.value.html = richContent.html
  }
  
  actions.addNotification({
    type: 'success',
    message: editingItem.value ? '内容已更新' : '内容已保存'
  })
}
</script>

<style scoped>
.clipboard-manager {
  background-color: var(--background);
  color: var(--foreground);
}

/* 添加过渡动画 */
.clipboard-manager button {
  transition: all 0.2s ease;
}

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

/* 添加项目hover效果 */
.item-card {
  transition: all 0.2s ease;
}

.item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加拖拽区域样式 */
.drag-area {
  transition: all 0.2s ease;
  border: 2px dashed transparent;
}

.drag-area.dragging {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

/* 添加富文本样式 */
:deep(.prose) {
  max-width: none;
  color: inherit;
}

:deep(.prose a) {
  color: var(--primary);
  text-decoration: none;
}

:deep(.prose img) {
  margin: 0;
  border-radius: 4px;
}

:deep(.prose pre) {
  background: var(--code-bg);
  border-radius: 4px;
  padding: 0.75rem;
  margin: 0.5rem 0;
}

:deep(.prose code) {
  background: var(--code-bg);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* 富文本样式 */
:deep(.prose) {
  max-width: none;
  color: inherit;
}

:deep(.prose a) {
  color: var(--primary);
  text-decoration: none;
}

/* 代码视图样式 */
pre {
  font-family: ui-monospace, monospace;
  line-height: 1.4;
  max-height: 200px;
}

pre code {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
