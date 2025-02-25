<template>
  <SlidePanel 
    :position="position"
    :size="size"
    v-model="visible"
  >
    <div class="editor-container h-full flex flex-col">
      <!-- 工具栏重构 -->
      <div class="toolbar flex items-center justify-between px-4 py-2.5 bg-background border-b">
        <!-- 左侧控制区 -->
        <div class="flex items-center gap-3">
          <!-- 模式切换 -->
          <div class="flex items-center bg-muted/20 rounded-lg p-1">
            <button
              v-for="tab in [
                { value: 'edit', label: '编辑', icon: PencilIcon },
                { value: 'preview', label: '预览', icon: EyeIcon }
              ]"
              :key="tab.value"
              @click="currentMode = tab.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors"
              :class="currentMode === tab.value 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:bg-muted/30'"
            >
              <component :is="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- 格式选择 -->
          <div class="flex items-center gap-2 pl-2 border-l border-border">
            <label class="text-sm text-muted-foreground">格式：</label>
            <select
              v-model="inputFormat"
              class="bg-transparent text-sm px-2 py-1 rounded-md border border-border hover:border-foreground/20 transition-colors"
            >
              <option value="md">Markdown</option>
              <option value="html">HTML</option>
            </select>
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-2">
          <!-- 全屏按钮 -->
          <button
            @click="toggleFullscreen"
            class="p-2 hover:bg-muted/30 rounded-md transition-colors group"
            :title="isFullscreen ? '退出全屏 (Esc)' : '全屏模式'"
          >
            <ArrowsPointingOutIcon 
              v-if="!isFullscreen" 
              class="w-5 h-5 text-muted-foreground group-hover:text-foreground" 
            />
            <ArrowsPointingInIcon 
              v-else 
              class="w-5 h-5 text-muted-foreground group-hover:text-foreground" 
            />
          </button>

          <!-- 操作按钮组 -->
          <div class="flex items-center gap-2 pl-2 border-l border-border">
            <button
              @click="cancel"
              class="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-sm"
            >
              <XMarkIcon class="w-4 h-4" />
              <span>取消</span>
            </button>
            <button
              @click="save"
              :disabled="isSaving"
              class="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-sm"
            >
              <ArrowUpTrayIcon v-if="!isSaving" class="w-4 h-4" />
              <svg 
                v-else 
                class="w-4 h-4 animate-spin" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path 
                  d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                  stroke-width="2" 
                  stroke-linecap="round"
                />
              </svg>
              <span>{{ isSaving ? '保存中...' : '保存' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 自适应编辑区域 -->
      <div class="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        <!-- 输入区域 -->
        <div 
          class="flex-1 relative"
          :class="{ 'hidden md:block': currentMode === 'preview' }"
        >
          <div class="editor-wrapper relative">
            <div 
              ref="editorRef"
              class="content-editor"
              contenteditable
              @input="handleInput"
              @click="handleClick"
            >
              <div 
                v-for="(block, index) in contentBlocks"
                :key="block.id"
                class="content-block"
                :data-block-id="block.id"
              >
                <template v-if="block.type === 'text'">
                  <span v-if="block.tags.length" class="tag-wrapper">
                    <span 
                      v-for="tag in block.tags"
                      :key="tag.id"
                      class="custom-tag"
                      :data-tag="tag.name"
                      @click.stop="editTag(tag)"
                    >
                      <span class="tag-open">&lt;{{tag.name}}&gt;</span>
                      <span class="tag-content">{{ tag.content }}</span>
                      <span class="tag-close">&lt;/{{tag.name}}&gt;</span>
                    </span>
                  </span>
                  <span v-else>{{ block.content || ' ' }}</span>
                </template>
              </div>
            </div>
            
            <!-- 智能标签工具栏 -->
            <div class="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <!-- 自动补全提示 -->
              <div 
                v-if="showSuggestions"
                class="bg-background rounded-lg shadow-xl border p-2 min-w-[160px]"
              >
                <div
                  v-for="(item, index) in filteredSuggestions"
                  :key="index"
                  @click="applySuggestion(item)"
                  class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer text-sm"
                >
                  <span class="font-mono">{{ item.label }}</span>
                  <span class="text-muted-foreground text-xs">{{ item.desc }}</span>
                </div>
              </div>

              <!-- 标签操作工具栏 -->
              <div class="bg-background/90 backdrop-blur-md rounded-xl shadow-lg border p-2 flex gap-2">
                <!-- 标签包裹操作 -->
                <div 
                  v-for="tag in activeTagSet"
                  :key="tag.value"
                  class="relative group"
                >
                  <button
                    @click="wrapSelection(tag)"
                    class="px-3 py-1.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors text-sm font-mono relative"
                  >
                    {{ tag.label }}
                    <!-- 标签操作菜单 -->
                    <div 
                      v-if="tag.type === 'html'"
                      class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        @click.stop="editTagPair(tag)"
                        class="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shadow"
                      >
                        ✎
                      </button>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览区域 -->
        <div 
          class="preview-area"
          :key="previewRefresh"
        >
          <div v-if="previewError" class="error-panel">
            {{ previewError }}
          </div>
          <div 
            v-else
            class="preview-content"
            v-html="previewContent"
          />
        </div>
      </div>
    </div>
  </SlidePanel>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import TurndownService from 'turndown'
import TabGroup from './TabGroup.vue'
import SlidePanel from './SlidePanel.vue'
import { 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  ArrowUpTrayIcon
} from '@heroicons/vue/24/outline'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  modelValue: String,
  position: {
    type: String,
    default: 'right'
  },
  size: {
    type: [Number, String],
    default: '70%'
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

// 编辑器状态
const editorRef = ref(null)
const visible = ref(false)
const currentMode = ref('edit')
const inputFormat = ref('md')
const exportFormat = ref('md')
const workingContent = ref('')
const originalContent = ref('')
const isFullscreen = ref(false)
const isSaving = ref(false)
const previewError = ref(null)

// 标签配置库
const tagLibrary = {
  md: [
    { label: '#', value: 'h1', template: '# {{SELECTION}}' },
    { label: '##', value: 'h2', template: '## {{SELECTION}}' },
    { label: '**', value: 'bold', template: '**{{SELECTION}}**' },
    { label: '```', value: 'code', template: '```\n{{SELECTION}}\n```' }
  ],
  html: [
    { label: '<h>', value: 'heading', template: '<h{{LEVEL}}>{{SELECTION}}</h{{LEVEL}}>', level: 2 },
    { label: '<p>', value: 'p', template: '<p>{{SELECTION}}</p>' },
    { label: '<a>', value: 'link', template: '<a href="#">{{SELECTION}}</a>' }
  ]
}

// 响应式状态
const showSuggestions = ref(false)
const currentInput = ref('')
const tagPairs = ref(new Map())

// 根据模式获取标签集
const activeTagSet = computed(() => {
  return inputFormat.value === 'md' ? tagLibrary.md : tagLibrary.html
})

// 智能补全建议
const filteredSuggestions = computed(() => {
  const input = currentInput.value.toLowerCase()
  return [
    { label: 'h1', desc: '一级标题', type: 'md' },
    { label: 'h2', desc: '二级标题', type: 'md' },
    { label: '<h1>', desc: 'HTML标题', type: 'html' },
    { label: '<p>', desc: '段落', type: 'html' }
  ].filter(item => 
    item.label.includes(input) && 
    item.type === (inputFormat.value === 'md' ? 'md' : 'html')
  )
})

// 修复预览内容计算
const previewContent = computed(() => {
  try {
    // 使用块内容生成HTML
    return DOMPurify.sanitize(
      contentBlocks.value.map(block => {
        if (block.type === 'text') {
          return block.tags.length 
            ? block.tags.map(t => `<${t.name}>${t.content}</${t.name}>`).join('') 
            : block.content.replace(/\n/g, '<br>')
        }
        return ''
      }).join(''),
      {
        ADD_TAGS: ['iframe', 'custom-tag'],
        ADD_ATTR: ['allowfullscreen', 'frameborder', 'scrolling', 'data-tag']
      }
    )
  } catch (error) {
    previewError.value = `预览渲染错误: ${error.message}`
    return ''
  }
})

// 增强内容更新机制
const handleInput = (e) => {
  const currentBlock = activeBlock.value
  if (!currentBlock) return
  
  // 立即更新内容
  currentBlock.content = e.target.innerText
  updateBlockStructure()
  
  // 触发实时预览更新
  previewRefresh.value = !previewRefresh.value
  emit('update:modelValue', getFormattedContent()) // 新增emit事件
}

// 新增格式化内容获取方法
const getFormattedContent = () => {
  return contentBlocks.value
    .map(block => {
      if (block.type === 'text') {
        return block.tags.map(t => `<${t.name}>${t.content}</${t.name}>`).join('') 
          || block.content
      }
      return ''
    })
    .join('\n')
}

// 内容转换逻辑
const convertContent = useDebounceFn(async (content, targetFormat) => {
  if (targetFormat === inputFormat.value) return content
  
  try {
    if (targetFormat === 'md') {
      return turndown.turndown(content)
    } else {
      return marked.parse(content)
    }
  } catch (error) {
    console.error('格式转换失败:', error)
    return content
  }
}, 500)

// 保存处理
const save = async () => {
  try {
    isSaving.value = true
    const finalContent = getFormattedContent() // 直接使用最新内容
    emit('update:modelValue', finalContent)
    emit('save', finalContent)
    visible.value = false
  } finally {
    isSaving.value = false
  }
}

// 文本区域操作
const wrapSelection = (tag) => {
  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = workingContent.value.slice(start, end)
  
  let newContent = ''
  if (inputFormat.value === 'md') {
    newContent = applyMarkdownTag(tag, selectedText)
  } else {
    newContent = applyHTMLTag(tag, selectedText)
  }

  // 更新内容并记录标签对
  workingContent.value = 
    workingContent.value.slice(0, start) +
    newContent +
    workingContent.value.slice(end)
  
  // 记录标签位置
  if (tag.type === 'html') {
    const openTagEnd = start + newContent.indexOf('>') + 1
    const closeTagStart = start + newContent.lastIndexOf('</')
    tagPairs.value.set(start, {
      open: { start, end: openTagEnd },
      close: { start: closeTagStart, end: start + newContent.length }
    })
  }
}

// 应用Markdown标签
const applyMarkdownTag = (tag, selection) => {
  return tag.template.replace(/{{SELECTION}}/g, selection)
}

// 应用HTML标签
const applyHTMLTag = (tag, selection) => {
  let content = tag.template
  if (tag.value === 'heading') {
    content = content.replace(/{{LEVEL}}/g, tag.level)
  }
  return content.replace(/{{SELECTION}}/g, selection)
}

// 编辑标签对
const editTagPair = (tag) => {
  const pair = tagPairs.value.get(tag.start)
  if (pair) {
    // 选中整个标签对
    textarea.setSelectionRange(pair.open.start, pair.close.end)
    // 显示标签编辑弹窗
    showTagEditor(tag)
  }
}

// 应用智能建议
const applySuggestion = (item) => {
  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  let insertText = item.label
  if (item.label.startsWith('h') && !item.label.includes('>')) {
    insertText += '>' // 自动补全闭合标签
  }
  
  workingContent.value = 
    workingContent.value.slice(0, start - 1) +
    insertText +
    workingContent.value.slice(end)
  
  showSuggestions.value = false
  nextTick(() => textarea.focus())
}

// 全屏切换
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 打开面板处理
const handlePanelOpen = () => {
  nextTick(() => editorRef.value?.focus())
}

defineExpose({ open: (content) => {
  workingContent.value = content
  originalContent.value = content
  visible.value = true
}})

// 添加工具提示指令
const vTooltip = {
  mounted(el, binding) {
    const tooltip = document.createElement('div')
    tooltip.className = `tooltip hidden absolute z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded-md`
    tooltip.textContent = binding.value
    
    el.style.position = 'relative'
    el.appendChild(tooltip)

    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect()
      tooltip.style.left = `${rect.width/2}px`
      tooltip.style.top = `${-rect.height}px`
      tooltip.classList.remove('hidden')
    })

    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden')
    })
  }
}

// 新增响应式状态
const activeTag = ref(null)
const tagMap = ref(new Map())

// HTML标签配置
const htmlTags = [
  { label: 'H', name: 'heading', levels: [1,2,3,4,5,6] },
  { label: 'P', name: 'paragraph' },
  { label: 'A', name: 'link' },
  { label: 'DIV', name: 'div' }
]

// 新增光标位置追踪
const tagPosition = ref({ x: 0, y: 0 })
const updateCursorPos = (e) => {
  const rect = e.target.getBoundingClientRect()
  tagPosition.value = {
    x: e.clientX - rect.left + 10, // 添加偏移量避免遮挡
    y: e.clientY - rect.top
  }
}

// 增强标签包裹逻辑
const wrapWithTag = (tag) => {
  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = workingContent.value.slice(start, end)
  
  // 生成唯一标识符
  const tagId = Date.now().toString(36)
  const openTag = `<${tag.name} data-tag="${tagId}">`
  const closeTag = `</${tag.name}>`
  
  // 插入带标识的内容
  workingContent.value = 
    workingContent.value.slice(0, start) +
    `${openTag}${selectedText}${closeTag}` +
    workingContent.value.slice(end)

  // 记录标签信息
  activeTag.value = {
    id: tagId,
    name: tag.name,
    open: openTag,
    close: closeTag,
    start: start,
    end: start + openTag.length + selectedText.length + closeTag.length
  }
  
  tagMap.value.set(tagId, activeTag.value)
  nextTick(highlightTags) // 确保下次渲染更新
}

// 修改高亮逻辑
const highlightTags = () => {
  const content = workingContent.value
  const regex = /<([\w]+)([^>]*)data-tag="([\w]+)"([^>]*)>(.*?)<\/\1>/gs
  let match
  
  document.querySelectorAll('.tag-highlight').forEach(el => el.remove())
  
  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, tagName, , tagId, , contentText] = match
    const tagInfo = tagMap.value.get(tagId)
    
    if (!tagInfo) continue
    
    // 创建高亮容器
    const wrapper = document.createElement('div')
    wrapper.className = 'tag-highlight'
    wrapper.dataset.tagId = tagId
    wrapper.innerHTML = `
      <span class="tag-open" data-action="edit">&lt;${tagName}&gt;</span>
      <span class="tag-content">${contentText}</span>
      <span class="tag-close" data-action="edit">&lt;/${tagName}&gt;</span>
    `
    
    // 定位计算
    const startPos = getTextareaPosition(editorRef.value, tagInfo.start)
    const endPos = getTextareaPosition(editorRef.value, tagInfo.end)
    
    Object.assign(wrapper.style, {
      top: `${startPos.top}px`,
      left: `${startPos.left}px`,
      width: `${endPos.left - startPos.left}px`,
      height: `${endPos.top - startPos.top + 20}px`
    })
    
    // 事件委托
    wrapper.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'edit') {
        activeTag.value = tagInfo
        editTag()
      }
    })
    
    editorRef.value.parentNode.appendChild(wrapper)
  }
}

// 增强标签编辑
const editTag = (tag) => {
  if (!activeTag.value) return
  
  const newName = prompt('请输入新标签名称:', activeTag.value.name)
  if (newName && newName !== activeTag.value.name) {
    updateTag(activeTag.value, newName)
  }
}

// 更新标签实现
const updateTag = (oldTag, newName) => {
  const newOpen = `<${newName} data-tag="${oldTag.id}">`
  const newClose = `</${newName}>`
  
  workingContent.value = workingContent.value
    .replace(oldTag.open, newOpen)
    .replace(oldTag.close, newClose)
  
  // 更新记录
  activeTag.value = {
    ...oldTag,
    name: newName,
    open: newOpen,
    close: newClose
  }
  tagMap.value.set(oldTag.id, activeTag.value)
  
  nextTick(highlightTags)
}

// 新增内容更新处理
const updateTagContent = (e) => {
  const newContent = e.target.innerText
  const fullText = workingContent.value
  const start = fullText.indexOf('{{TAG_START}}') + 12
  const end = fullText.indexOf('{{TAG_END}}')
  
  workingContent.value = 
    fullText.slice(0, start) +
    newContent +
    fullText.slice(end)
}

// 获取文本位置
const getTextareaPosition = (textarea, offset) => {
  const div = document.createElement('div')
  div.style.whiteSpace = 'pre-wrap'
  div.style.visibility = 'hidden'
  div.textContent = textarea.value.slice(0, offset)
  
  const span = document.createElement('span')
  span.textContent = ' '
  div.appendChild(span)
  
  document.body.appendChild(div)
  const rect = span.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()
  
  document.body.removeChild(div)
  
  return {
    top: rect.top - textareaRect.top + textarea.scrollTop,
    left: rect.left - textareaRect.left + textarea.scrollLeft
  }
}

// 监听内容变化
watch(workingContent, () => {
  nextTick(highlightTags)
})

// 块状内容数据结构
const contentBlocks = ref([{
  id: Date.now().toString(),
  type: 'text',
  content: ' ', // 初始空格保证可见
  tags: [],
  focus: true
}])

// 可用标签配置
const availableTags = [
  { name: 'h1', label: 'H1', type: 'html' },
  { name: 'h2', label: 'H2', type: 'html' },
  { name: 'bold', label: '**', type: 'md' },
  { name: 'code', label: '```', type: 'md' }
]

// 当前活动块
const activeBlock = ref(null)

// 智能标签检测
const detectTagInput = (text) => {
  const lastChar = text.slice(-1)
  if (['<', '#'].includes(lastChar)) {
    showTagSuggestions(lastChar)
  }
}

// 更新块结构
const updateBlockStructure = () => {
  const blocks = []
  let currentBlock = { type: 'text', content: '', tags: [] }
  
  // 处理换行符
  const textContent = editorRef.value.innerText
  textContent.split('\n').forEach(line => {
    if (line.trim()) {
      blocks.push({
        id: Date.now().toString(),
        type: 'text',
        content: line,
        tags: []
      })
    }
  })
  
  // 保留至少一个空块
  if (blocks.length === 0) {
    blocks.push({ 
      id: Date.now().toString(),
      type: 'text',
      content: ' ',
      tags: []
    })
  }
  
  contentBlocks.value = blocks
}

// 样式定义
const editorStyles = `
.content-editor {
  min-height: 300px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.custom-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(14, 165, 233, 0.1);
  border: 2px solid rgba(14, 165, 233, 0.3);
  border-radius: 4px;
  margin: 0 2px;
  padding: 2px 4px;
}

.tag-open, .tag-close {
  color: #0ea5e9;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    background: rgba(14, 165, 233, 0.2);
  }
}

.tag-content {
  padding: 0 4px;
  border-bottom: 2px dashed rgba(14, 165, 233, 0.3);
}

.floating-toolbar {
  position: fixed;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 6px;
  padding: 8px;
  display: flex;
  gap: 4px;
  z-index: 1000;
}
`

// 新增响应式状态
const previewRefresh = ref(false)

// 添加内容块监听
watch(contentBlocks, () => {
  previewRefresh.value = !previewRefresh.value
}, { deep: true })
</script>

<style scoped>
.editor-container {
  position: relative;
  min-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.content-editor {
  min-height: 300px;
  padding: 20px;
  outline: none;
}

/* 添加调试边框 */
.content-block {
  border: 1px dashed transparent;
  padding: 4px 0;
}

.content-block:hover {
  border-color: #eee;
}

/* 确保标签可见 */
.tag-wrapper {
  display: inline-block;
  background: rgba(14, 165, 233, 0.05);
  border-radius: 4px;
  padding: 2px;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-ghost {
  @apply text-foreground/80 hover:text-foreground hover:bg-muted/50;
}

.prose {
  :deep(h1) { @apply text-2xl font-bold border-b pb-2 mb-4; }
  :deep(h2) { @apply text-xl font-semibold; }
  :deep(ul) { @apply pl-6 space-y-1; }
  :deep(pre) { @apply p-3 rounded bg-muted/20; }
  :deep(code) { @apply px-1.5 py-0.5 rounded bg-muted/30; }
  :deep(img) { @apply rounded-lg border my-2; }
}

@media (max-width: 768px) {
  .editor-container {
    @apply rounded-none;
    [class^="prose"] { @apply text-base; }
  }
}

.toolbar {
  --toolbar-height: 52px;
  min-height: var(--toolbar-height);
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 
    disabled:opacity-60 disabled:cursor-not-allowed transition-all;
}

.btn-secondary {
  @apply bg-background border border-border hover:bg-muted/20 
    text-foreground/80 hover:text-foreground transition-all;
}

select {
  @apply focus:ring-1 focus:ring-primary/30 focus:outline-none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .toolbar {
    @apply px-3 py-2 gap-2;
    
    .btn-secondary span,
    .btn-primary span {
      @apply hidden;
    }
    
    select {
      @apply max-w-[100px];
    }
  }
}

/* 标签操作按钮动画 */
.group:hover .tag-actions {
  @apply opacity-100 translate-y-0;
}

.tag-actions {
  @apply absolute -top-3 right-0 opacity-0 translate-y-1 transition-all;
}

/* 智能提示列表 */
.suggestion-item {
  @apply px-4 py-2 hover:bg-muted/30 cursor-pointer transition-colors;
}

/* 标签高亮样式 */
.tag-highlight {
  @apply absolute flex items-center gap-1 bg-primary/5 border-2 border-primary/20 rounded-md p-1;
  z-index: 9999;
  pointer-events: auto;
}

.tag-open, .tag-close {
  @apply px-1 bg-primary/10 text-primary/80 rounded cursor-pointer hover:bg-primary/20;
}

.tag-content {
  @apply px-2 border-b-2 border-dashed border-primary/30;
}

.editor-wrapper {
  @apply h-full w-full;
}

.tag-container {
  @apply absolute z-[9999] bg-background border border-primary/30 rounded-lg shadow-lg;
  transform: translateY(-50%);
}

.tag-wrapper {
  @apply flex items-center gap-1 p-1;
}

.tag-open, .tag-close {
  @apply px-2 py-1 bg-primary/10 text-primary cursor-pointer rounded-md hover:bg-primary/20;
}

.tag-content {
  @apply px-2 min-w-[100px] border-b-2 border-dashed border-primary/30 focus:outline-none;
}

.preview-area {
  @apply flex-1 overflow-auto p-4 border rounded-lg bg-muted/5;
  min-height: 300px;
  
  /* 确保内容可见 */
  :deep(*) {
    max-width: 100%;
    overflow: visible;
    word-break: break-word;
  }
  
  /* 添加最小高度保障 */
  .preview-content {
    min-height: 200px;
  }
}

.preview-area :deep(.prose) {
  font-size: 0.875rem;
  line-height: 1.5;
}

.preview-area :deep(h1) { @apply text-2xl font-bold border-b pb-2 mb-4; }
.preview-area :deep(h2) { @apply text-xl font-semibold; }
.preview-area :deep(ul) { @apply pl-6 space-y-1; }
.preview-area :deep(pre) { 
  @apply p-3 rounded bg-muted/20 overflow-x-auto;
}
.preview-area :deep(code) { 
  @apply px-1.5 py-0.5 rounded bg-muted/30 text-sm;
}
.preview-area :deep(img) { 
  @apply rounded-lg border my-2 max-w-full h-auto;
}

.error-panel {
  @apply text-destructive text-sm whitespace-pre-wrap;
}

.preview-content {
  animation: fade-in 0.3s ease-in;
}

@keyframes fade-in {
  from { opacity: 0.5; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 