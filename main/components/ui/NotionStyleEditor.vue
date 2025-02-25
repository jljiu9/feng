<template>
  <SlidePanel
    v-model="visible"
    :position="position"
    :size="size"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <div class="notion-editor h-full flex flex-col overflow-hidden bg-gradient-to-b from-background to-background/40">
      <!-- 顶部工具栏现代化设计 -->
      <div class="border-b backdrop-blur-xl bg-background/60 supports-[backdrop-filter]:bg-background/40">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-medium">{{ title }}</h3>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{{ blocks.length }} 个块</span>
              <span class="opacity-20">|</span>
              <span>{{ totalCharCount }} 个字符</span>
              <span class="opacity-20">|</span>
              <span>{{ imageCount }} 张图片</span>
            </div>
          </div>
        <div class="flex items-center gap-3">
          <button
              @click="togglePreview"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览
          </button>
          <button
            @click="save"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              保存内容
          </button>
        </div>
        </div>
      </div>

      <!-- 编辑区域现代化设计 -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-6 py-8">
          <div class="space-y-2">
        <div
          v-for="(block, index) in blocks"
          :key="block.id"
              class="group relative"
              :class="{ 'animate-slide-in': block.isNew }"
            >
              <!-- 块操作按钮现代化 -->
              <div 
                class="absolute -left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 flex flex-col gap-1.5"
              >
          <button
                  @click="addBlockAbove(index)"
                  class="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-sm"
                  title="在上方添加块"
          >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
          </button>
          <button
                  @click="removeBlock(index)"
                  class="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md text-muted-foreground transition-all duration-200"
                  title="删除此块"
          >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
          </button>
              </div>

              <!-- 块内容现代化 -->
              <div
                class="block-content relative rounded-lg p-3.5 transition-all duration-200 group backdrop-blur-sm"
                :class="[
                  { 'bg-primary/5 shadow-sm': block.id === activeBlockId },
                  { 'hover:bg-muted/30': block.id !== activeBlockId },
                  { 'bg-muted/30': block.format === 'code' }
                ]"
                style="isolation: isolate;"
              >
                <!-- 块类型选择器现代化 -->
                <div 
                  v-if="block.id === activeBlockId"
                  class="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100"
                  style="z-index: 1;"
                >
                  <div class="relative">
          <button
                      @click="toggleBlockTypeMenu(block)"
                      class="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
          </button>
                    
                    <!-- 块类型菜单现代化 -->
                    <Transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-150 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <div
                        v-if="showBlockTypeMenu && activeBlockId === block.id"
                        class="absolute left-full top-0 ml-2 w-64 bg-popover border rounded-lg shadow-xl p-2 z-[1000] backdrop-blur-sm bg-white/95 dark:bg-[#1a1a1a]/95"
                        style="min-width: 16rem;"
                        v-click-outside="{
                          handler: () => showBlockTypeMenu && closeBlockTypeMenu(),
                          closeConditional: (e) => !e.classList?.contains('block-type-menu-item')
                        }"
                        @mouseenter="isMenuHovered = true"
                        @mouseleave="isMenuHovered = false"
                      >
                        <div class="text-xs text-muted-foreground px-2 py-1.5 mb-1 border-b">转换为</div>
                        <div class="max-h-[300px] overflow-y-auto thin-scrollbar">
                          <button
                            v-for="type in blockTypes"
                            :key="type.value"
                            class="block-type-menu-item w-full text-left px-2 py-2 text-sm rounded-md hover:bg-muted flex items-center gap-2.5 transition-colors group/item"
                            :class="{ 'bg-muted/50': block.format === type.value }"
                            @click="changeBlockType(block, type.value)"
                          >
                            <span class="w-5 h-5 text-muted-foreground group-hover/item:text-foreground transition-colors flex items-center justify-center" v-html="type.icon"></span>
                            <div class="flex-1">
                              <div class="font-medium">{{ type.label }}</div>
                              <div class="text-xs text-muted-foreground">{{ type.description }}</div>
                            </div>
                            <kbd v-if="type.shortcut" class="hidden group-hover/item:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                              {{ type.shortcut }}
                            </kbd>
                          </button>
                        </div>
                      </div>
                    </Transition>
        </div>
      </div>

                <!-- 文本编辑区域现代化 -->
                <div
                  v-if="block.type === 'text'"
                  :ref="el => { if (el) editableRefs[index] = el }"
                  :contenteditable="true"
                  spellcheck="false"
                  class="outline-none min-h-[1.5em] whitespace-pre-wrap transition-all duration-200 relative caret-primary"
          :class="{ 
                    'text-2xl font-bold tracking-tight': block.format === 'h1',
                    'text-xl font-bold': block.format === 'h2',
                    'text-lg font-bold': block.format === 'h3',
                    'font-mono bg-muted/50 p-2.5 rounded': block.format === 'code'
                  }"
                  :placeholder="getPlaceholder(block)"
                  @input="updateBlockContent(block, $event)"
                  @keydown="handleKeydown($event, block, index)"
                  @focus="handleFocus(block)"
                  @blur="handleBlur"
                  @mousedown="handleMouseDown($event)"
                  @mouseup="handleMouseUp($event)"
                  @copy="handleCopy($event, block)"
                  @paste="handlePaste($event, block)"
                  @cut="handleCut($event, block)"
                >{{ block.content }}</div>

                <!-- 图片块现代化 -->
                <div v-else-if="block.type === 'image'" class="relative group/image">
                  <img
                    :src="block.content"
                    class="max-w-full rounded-lg transition-all duration-300 hover:shadow-xl filter hover:brightness-95"
                    alt=""
                    @click="openImagePreview(block)"
                  />
                  <div class="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 opacity-0 group-hover/image:opacity-100 transition-all duration-300 rounded-lg flex items-end justify-end p-3">
                    <div class="flex items-center gap-2">
                      <button
                        @click="openImagePreview(block)"
                        class="p-1.5 bg-background/90 rounded-full hover:bg-background transition-colors"
                        title="预览图片"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
            <button
                        @click="removeBlock(index)"
                        class="p-1.5 bg-background/90 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        title="删除图片"
            >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
            </button>
                    </div>
                  </div>
                </div>

                <!-- 分割线现代化 -->
                <hr v-else-if="block.type === 'divider'" class="my-2 border-dashed opacity-50">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SlidePanel>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import SlidePanel from './SlidePanel.vue'
import { nanoid } from 'nanoid'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  position: {
    type: String,
    default: 'right'
  },
  size: {
    type: [String, Number],
    default: '50%'
  },
  title: {
    type: String,
    default: '编辑内容'
  }
})

const emit = defineEmits(['save'])

// 添加调试标志
const DEBUG = true
const log = (...args) => {
  if (DEBUG) {
    window.console.log('[NotionEditor]', ...args)
  }
}

// 编辑器状态
const visible = ref(false)
const blocks = ref([])
const activeBlockId = ref(null)
const showBlockTypeMenu = ref(false)
const editableRefs = ref({})
const isMenuHovered = ref(false)

// 块类型定义
const blockTypes = [
  { 
    value: 'text', 
    label: '文本',
    description: '普通文本块',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    shortcut: '⌘+⌥+0'
  },
  { 
    value: 'h1', 
    label: '标题 1',
    description: '大标题',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h8"/></svg>',
    shortcut: '⌘+⌥+1'
  },
  { 
    value: 'h2', 
    label: '标题 2',
    description: '中标题',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h14M4 12h6"/></svg>',
    shortcut: '⌘+⌥+2'
  },
  { 
    value: 'h3', 
    label: '标题 3',
    description: '小标题',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h12M4 12h4"/></svg>',
    shortcut: '⌘+⌥+3'
  },
  { 
    value: 'code', 
    label: '代码块',
    description: '用于展示代码',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/></svg>',
    shortcut: '⌘+⌥+C'
  },
  { 
    value: 'image', 
    label: '图片',
    description: '插入图片',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l4-4 4 4 8-8"/></svg>',
    shortcut: '⌘+⌥+I'
  },
  { 
    value: 'divider', 
    label: '分割线',
    description: '插入水平分割线',
    icon: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16"/></svg>',
    shortcut: '---'
  }
]

// 添加预览状态
const isPreview = ref(false)
const togglePreview = () => {
  isPreview.value = !isPreview.value
}

// 扩展光标管理系统
const cursorManager = {
  // 保存当前光标状态
  saveSelection(el) {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preSelectionRange = range.cloneRange()
      preSelectionRange.selectNodeContents(el)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      return {
        start: preSelectionRange.toString().length,
        end: preSelectionRange.toString().length + range.toString().length,
        content: el.textContent
      }
    }
    return null
  },

  // 恢复光标状态
  restoreSelection(el, savedSel) {
    if (!savedSel) return

    const selection = window.getSelection()
    const range = document.createRange()
    
    let charIndex = 0
    let foundStart = false
    let foundEnd = false
    
    function traverseNodes(node) {
      if (foundStart && foundEnd) return

      if (node.nodeType === 3) {
        const nextCharIndex = charIndex + node.length
        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
          range.setStart(node, savedSel.start - charIndex)
          foundStart = true
        }
        if (!foundEnd && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
          range.setEnd(node, savedSel.end - charIndex)
          foundEnd = true
        }
        charIndex = nextCharIndex
      } else {
        for (let child of node.childNodes) {
          traverseNodes(child)
        }
      }
    }
    
    traverseNodes(el)
    
    if (foundStart && foundEnd) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  },

  // 设置光标到末尾
  setToEnd(el) {
    const range = document.createRange()
    const sel = window.getSelection()
    
    if (!el.lastChild) {
      el.textContent = '\u200B'
    }
    
    range.selectNodeContents(el)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  },

  // 设置光标到开头
  setToStart(el) {
    const range = document.createRange()
    const sel = window.getSelection()
    
    if (!el.firstChild) {
      el.textContent = '\u200B'
    }
    
    range.selectNodeContents(el)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  },

  // 获取当前光标位置信息
  getCurrentPosition(el, multiLineMode = false) {
    const sel = window.getSelection()
    if (!sel.rangeCount) return null
    
    const range = sel.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(el)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    
    // 基础位置计算
    const start = preCaretRange.toString().length
    const end = start + range.toString().length
    
    // 多行模式扩展
    if (multiLineMode) {
      const content = el.textContent
      const lines = content.split('\n')
      const lineStarts = []
      let pos = 0
      
      // 计算每行起始位置和长度
      const lineLengths = lines.map(line => {
        lineStarts.push(pos)
        pos += line.length + 1 // +1 包含换行符
        return line.length
      })
      
      // 查找当前行
      let currentLine = 0
      let currentColumn = start
      for (let i = 0; i < lineStarts.length; i++) {
        if (start >= lineStarts[i]) {
          currentLine = i
          currentColumn = start - lineStarts[i]
        }
      }
      
      return {
        start,
        end,
        inMultiLine: lines.length > 1,
        totalLines: lines.length,
        line: currentLine,
        column: currentColumn,
        lineStarts,
        lineLengths
      }
    }
    
    return { start, end }
  },

  // 新增：根据行和列计算绝对位置
  getPositionFromLine(el, line, column) {
    const content = el.textContent
    const lines = content.split('\n')
    
    // 处理空行情况
    if (lines.length === 0) return 0
    
    // 计算绝对位置
    let position = 0
    for (let i = 0; i < line; i++) {
      position += (lines[i]?.length || 0) + 1 // +1 包含换行符
    }
    return Math.min(position + column, content.length)
  },

  // 移动光标到指定位置
  moveCursorTo(el, position) {
    const range = document.createRange()
    const sel = window.getSelection()
    
    // 找到正确的文本节点
    let node = el.firstChild
    let offset = 0
    while (node && offset + node.textContent.length < position) {
      offset += node.textContent.length
      node = node.nextSibling
    }
    
    if (node) {
      const finalOffset = position - offset
      range.setStart(node, Math.min(finalOffset, node.textContent.length))
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}

// 新增零宽空格工具方法
const zwsp = {
  has: (str) => str.includes('\u200B'),
  clean: (str) => str.replace('\u200B', '') // 单次替换而非全局
}

// 修改块创建方法
const blockManager = {
  create(type = 'text', content = '') {
    return {
      id: nanoid(),
      type,
      content: zwsp.clean(content), // 仅清理一次
      format: type,
      isNew: true
    }
  },

  // 在指定位置插入块
  insert(index, content = '') {
    const newBlock = this.create('text', content)
    blocks.value.splice(index, 0, newBlock)
    return newBlock
  },

  // 获取块的编辑器元素
  getEditableElement(blockId) {
    const index = blocks.value.findIndex(b => b.id === blockId)
    return editableRefs.value[index]
  },

  // 聚焦到指定块
  focus(blockId, position = 'end') {
    nextTick(() => {
      const el = this.getEditableElement(blockId)
      if (el) {
        el.focus()
        if (position === 'end') {
          cursorManager.setToEnd(el)
        } else if (position === 'start') {
          cursorManager.setToStart(el)
        }
      }
    })
  },

  // 获取相邻块
  getAdjacentBlock(currentId, direction) {
    const currentIndex = blocks.value.findIndex(b => b.id === currentId)
    if (currentIndex === -1) return null
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    return blocks.value[targetIndex]
  },

  // 聚焦到相邻块
  focusAdjacentBlock(currentId, direction, cursorPosition = 'maintain') {
    const currentIndex = blocks.value.findIndex(b => b.id === currentId)
    if (currentIndex === -1) return false
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= blocks.value.length) return false
    
    const targetBlock = blocks.value[targetIndex]
    this.focus(targetBlock.id, cursorPosition === 'end' ? 'end' : 'start')
    return true
  }
}

// 重构历史记录管理器
const historyManager = {
  operations: [],
  currentIndex: -1,
  isRecording: true,

  // 记录操作
  recordOperation(type, data) {
    if (!this.isRecording) return

    // 如果当前不在历史记录末尾，删除后面的记录
    if (this.currentIndex < this.operations.length - 1) {
      this.operations = this.operations.slice(0, this.currentIndex + 1)
    }

    // 添加新操作
    this.operations.push({
  type,
      data,
      timestamp: Date.now()
    })
    this.currentIndex++

    // 合并快速连续的文本编辑操作
    this.mergeTextOperations()
  },

  // 合并快速连续的文本编辑操作（500ms内）
  mergeTextOperations() {
    if (this.operations.length < 2) return
    
    const lastOp = this.operations[this.operations.length - 1]
    const prevOp = this.operations[this.operations.length - 2]
    
    if (lastOp.type === 'text-edit' && prevOp.type === 'text-edit' &&
        lastOp.data.blockId === prevOp.data.blockId &&
        lastOp.timestamp - prevOp.timestamp < 500) {
      // 合并这两个操作
      prevOp.data.newContent = lastOp.data.newContent
      this.operations.pop()
      this.currentIndex--
    }
  },

  // 撤销
  undo() {
    if (this.currentIndex < 0) return false
    
    const operation = this.operations[this.currentIndex]
    this.isRecording = false
    let targetBlockId = null
    
    try {
      switch (operation.type) {
        case 'text-edit':
          this.undoTextEdit(operation.data)
          targetBlockId = operation.data.blockId
          break
        case 'add-block':
          this.undoAddBlock(operation.data)
          // 聚焦到前一个块
          const prevIndex = operation.data.index - 1
          if (prevIndex >= 0) {
            targetBlockId = blocks.value[prevIndex]?.id
          } else if (blocks.value.length > 0) {
            targetBlockId = blocks.value[0].id
          }
          break
        case 'remove-block':
          this.undoRemoveBlock(operation.data)
          targetBlockId = operation.data.block.id
          break
        case 'change-block-type':
          this.undoChangeBlockType(operation.data)
          targetBlockId = operation.data.blockId
          break
      }
    } finally {
      this.isRecording = true
      this.currentIndex--
    }
    
    // 确保至少保留一个块
  if (blocks.value.length === 0) {
      const newBlock = blockManager.create()
      blocks.value.push(newBlock)
      targetBlockId = newBlock.id
    }

    // 设置焦点和光标
    nextTick(() => {
      if (targetBlockId) {
        activeBlockId.value = targetBlockId
        const el = blockManager.getEditableElement(targetBlockId)
        if (el) {
          el.focus()
          cursorManager.setToEnd(el)
        }
      }
    })
  },

  // 重做
  redo() {
    log('开始重做操作')
    
    if (this.currentIndex >= this.operations.length - 1) {
      log('没有可重做的操作')
      return false
    }
    
    const operation = this.operations[this.currentIndex + 1]
    if (!operation) {
      log('获取重做操作失败')
      return false
    }
    
    this.isRecording = false
    let targetBlockId = operation.data.blockId
    
    try {
      this.currentIndex++
      log('执行重做操作:', operation.type)
      
      switch (operation.type) {
        case 'text-edit':
          this.redoTextEdit(operation.data)
          break
        case 'add-block':
          this.redoAddBlock(operation.data)
          break
        case 'remove-block':
          this.redoRemoveBlock(operation.data)
          // 如果是删除块,聚焦到前一个块
          const prevIndex = operation.data.index - 1
          if (prevIndex >= 0) {
            targetBlockId = blocks.value[prevIndex]?.id
          } else if (blocks.value.length > 0) {
            targetBlockId = blocks.value[0].id
          }
          break
        case 'change-block-type':
          this.redoChangeBlockType(operation.data)
          break
      }
      
      log('重做操作完成，目标块ID:', targetBlockId)
    } finally {
      this.isRecording = true
    }
    
    // 确保至少保留一个块
    if (blocks.value.length === 0) {
      const newBlock = blockManager.create()
      blocks.value.push(newBlock)
      targetBlockId = newBlock.id
    }

    // 设置焦点和光标 - 使用与撤销操作相同的逻辑
  nextTick(() => {
      if (targetBlockId) {
        activeBlockId.value = targetBlockId
        blockManager.focus(targetBlockId)
      }
    })
    
    return true
  },

  // 文本编辑操作的撤销/重做
  undoTextEdit(data) {
    const block = blocks.value.find(b => b.id === data.blockId)
    if (block) {
      block.content = data.oldContent.replace(/\u200B/g, '') // 清理历史数据
    }
  },
  
  redoTextEdit(data) {
    const block = blocks.value.find(b => b.id === data.blockId)
    if (block) {
      block.content = data.newContent.replace(/\u200B/g, '') // 清理历史数据
    }
  },

  // 添加块操作的撤销/重做
  undoAddBlock(data) {
    const index = blocks.value.findIndex(b => b.id === data.blockId)
    if (index !== -1) {
      blocks.value.splice(index, 1)
    }
  },
  
  redoAddBlock(data) {
    blocks.value.splice(data.index, 0, data.block)
  },

  // 删除块操作的撤销/重做
  undoRemoveBlock(data) {
    blocks.value.splice(data.index, 0, data.block)
  },
  
  redoRemoveBlock(data) {
    const index = blocks.value.findIndex(b => b.id === data.blockId)
    if (index !== -1) {
      blocks.value.splice(index, 1)
    }
  },

  // 改变块类型操作的撤销/重做
  undoChangeBlockType(data) {
    const block = blocks.value.find(b => b.id === data.blockId)
    if (block) {
      block.type = data.oldType
      block.format = data.oldFormat
    }
  },
  
  redoChangeBlockType(data) {
    const block = blocks.value.find(b => b.id === data.blockId)
    if (block) {
      block.type = data.newType
      block.format = data.newFormat
    }
  },

  // 清空历史记录
  clear() {
    this.operations = []
    this.currentIndex = -1
  }
}

// 修改初始化逻辑
const open = (content = '') => {
  visible.value = true
  if (content) {
    blocks.value = parseContent(content)
  } else {
    // 创建真正空的内容块
    blocks.value = [blockManager.create('text', '')]
  }
}

// 解析内容
const parseContent = (content) => {
  // 这里简单处理，将内容按行分割成块
  return content.split('\n').map(line => blockManager.create('text', line))
}

// 重构添加块函数
const addBlockAbove = async (index) => {
  const newBlock = {
    id: nanoid(),
    type: 'text',
    content: '\u200B',
    format: 'text',
    isNew: true
  }
  
  blocks.value.splice(index, 0, newBlock)
  activeBlockId.value = newBlock.id
  
  // 记录添加块操作
  historyManager.recordOperation('add-block', {
    blockId: newBlock.id,
    index,
    block: { ...newBlock }
  })
  
  await nextTick()
  
  // 获取新块的 DOM 元素并设置焦点
  const el = editableRefs.value[index]
  if (el) {
    el.focus()
    
    // 确保内容存在
    if (!el.textContent || el.textContent === '') {
      el.textContent = '\u200B'
    }
    
    // 创建新的范围并设置到内容末尾
      const range = document.createRange()
      const sel = window.getSelection()
    
    if (el.lastChild) {
      range.setStartAfter(el.lastChild)
      range.setEndAfter(el.lastChild)
    } else {
      range.selectNodeContents(el)
      range.collapse(false)
    }
    
      sel.removeAllRanges()
      sel.addRange(range)
    
    // 确保元素保持焦点
    el.focus()
  }
  
  // 移除动画标记
  setTimeout(() => {
    const block = blocks.value.find(b => b.id === newBlock.id)
    if (block) {
      block.isNew = false
    }
  }, 300)
}

// 重构键盘事件处理
const handleKeydown = async (event, block, index) => {
  // 处理撤销/重做快捷键
  if (event.key.toLowerCase() === 'z') {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      // 撤销操作 Ctrl+Z
      log('执行撤销操作')
      event.preventDefault()
      event.stopPropagation()
      
      const currentBlockId = block.id
      const currentIndex = index
      
      if (historyManager.undo()) {
        await nextTick()
      }
      return
    } else if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      // 重做操作 Ctrl+Shift+Z
      log('执行重做操作')
      event.preventDefault()
      event.stopPropagation()
      
      const currentBlockId = block.id
      const currentIndex = index
      const currentSelection = cursorManager.saveSelection(event.target)
      
      const redoResult = historyManager.redo()
      
      if (redoResult) {
        await nextTick()
        
        let targetBlock = blocks.value.find(b => b.id === currentBlockId)
        let targetIndex = blocks.value.findIndex(b => b.id === currentBlockId)
        
        if (!targetBlock) {
          if (currentIndex > 0 && blocks.value[currentIndex - 1]) {
            targetBlock = blocks.value[currentIndex - 1]
            targetIndex = currentIndex - 1
          } else if (blocks.value.length > 0) {
            targetBlock = blocks.value[0]
            targetIndex = 0
          }
        }
        
        if (targetBlock) {
          activeBlockId.value = targetBlock.id
          const el = editableRefs.value[targetIndex]
          if (el) {
            el.focus()
            if (!el.textContent || el.textContent === '') {
              el.textContent = '\u200B'
            }
            if (currentSelection) {
              try {
                cursorManager.restoreSelection(el, currentSelection)
              } catch (e) {
                cursorManager.setToEnd(el)
              }
            } else {
              cursorManager.setToEnd(el)
            }
          }
        }
      }
      return
    }
  }

  const el = event.target
  
  // 增强方向键导航（支持多行块间跳转）
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const direction = event.key === 'ArrowUp' ? 'up' : 'down'
    const cursorPos = cursorManager.getCurrentPosition(el, true)
    
    // 多行文本中的垂直导航
    if (cursorPos.inMultiLine) {
      event.preventDefault()
      
      // 计算目标行
      let targetLine = direction === 'up' ? cursorPos.line - 1 : cursorPos.line + 1
      let shouldLeaveBlock = false
      
      // 边界检测
      if (targetLine < 0) {
        shouldLeaveBlock = direction === 'up'
        targetLine = 0
      } else if (targetLine >= cursorPos.totalLines) {
        shouldLeaveBlock = direction === 'down'
        targetLine = cursorPos.totalLines - 1
      }
      
      // 执行块间跳转
      if (shouldLeaveBlock) {
        const success = blockManager.focusAdjacentBlock(block.id, direction, 'end')
        if (success) event.preventDefault()
        return
      }
      
      // 块内行间跳转
      const targetOffset = Math.min(cursorPos.column, cursorPos.lineLengths[targetLine])
      const targetPosition = cursorManager.getPositionFromLine(el, targetLine, targetOffset)
      cursorManager.moveCursorTo(el, targetPosition)
    }
    // 单行块间跳转
    else {
      const atBoundary = (direction === 'up' && cursorPos.start === 0) ||
                        (direction === 'down' && cursorPos.end === el.textContent.length)
      
      if (atBoundary) {
        const success = blockManager.focusAdjacentBlock(block.id, direction, 'maintain')
        if (success) event.preventDefault()
      }
    }
  }
  // 左右方向键处理（支持多行）
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const cursorPos = cursorManager.getCurrentPosition(el, true)
    
    // 在多行模式中处理换行边界
    if (cursorPos.inMultiLine) {
      const isAtLineStart = cursorPos.column === 0
      const isAtLineEnd = cursorPos.column === cursorPos.lineLengths[cursorPos.line]
      
      if (event.key === 'ArrowLeft' && isAtLineStart && cursorPos.line > 0) {
        event.preventDefault()
        const targetPosition = cursorPos.lineStarts[cursorPos.line - 1] + cursorPos.lineLengths[cursorPos.line - 1]
        cursorManager.moveCursorTo(el, targetPosition)
      }
      else if (event.key === 'ArrowRight' && isAtLineEnd && cursorPos.line < cursorPos.totalLines - 1) {
        event.preventDefault()
        const targetPosition = cursorPos.lineStarts[cursorPos.line + 1]
        cursorManager.moveCursorTo(el, targetPosition)
      }
    }
  }
  // Enter 键处理
  else if (event.key === 'Enter') {
    // Shift+Enter 处理块内换行
    if (event.shiftKey) {
      event.preventDefault()
      const el = event.target
      const savedSel = cursorManager.saveSelection(el)
      
      // 智能判断换行符数量
      const currentLineStart = block.content.lastIndexOf('\n', savedSel.start - 1) + 1
      const currentLine = block.content.slice(currentLineStart, savedSel.start)
      
      // 判断是否需要强制换行
      const insertText = currentLine.trim().length > 0 ? '\n\n' : '\n'
      
      // 插入换行符
      const newContent = 
        block.content.slice(0, savedSel.start) + 
        insertText + 
        block.content.slice(savedSel.end)
      
      block.content = newContent
      
      await nextTick()
      // 计算新光标位置
      const newPosition = savedSel.start + insertText.length
      cursorManager.moveCursorTo(el, newPosition)
      
      // 记录历史操作
      historyManager.recordOperation('text-edit', {
        blockId: block.id,
        oldContent: block.content,
        newContent: newContent
      })
    }
    // 普通Enter键创建新块
    else {
      event.preventDefault()
      const savedSel = cursorManager.saveSelection(el)
      
      // 分割内容时彻底清理零宽空格
      const currentContent = block.content.replace(/\u200B/g, '')
      const newContent = currentContent.slice(savedSel.start).replace(/\u200B/g, '')
      block.content = currentContent.slice(0, savedSel.start).replace(/\u200B/g, '')
      
      // 创建新块（使用清理后的内容）
      const newBlock = blockManager.insert(index + 1, newContent)
      await nextTick()
      blockManager.focus(newBlock.id, 'start')
    }
  }
  // Backspace 键处理
  else if (event.key === 'Backspace') {
    const cursorPos = cursorManager.getCurrentPosition(el)
    
    if (cursorPos.start === 0 && cursorPos.end === 0 && blocks.value.length > 1) {
      event.preventDefault()
      const prevBlock = blockManager.getAdjacentBlock(block.id, 'up')
      if (prevBlock) {
        const prevContent = prevBlock.content === '\u200B' ? '' : prevBlock.content
        const currentContent = block.content === '\u200B' ? '' : block.content
        
        // 合并内容
        prevBlock.content = prevContent + currentContent
        blocks.value.splice(index, 1)
        
        await nextTick()
        const prevEl = blockManager.getEditableElement(prevBlock.id)
        if (prevEl) {
          prevEl.focus()
          cursorManager.moveCursorTo(prevEl, prevContent.length)
        }
      }
    }
  }
}

// 修改块内容更新逻辑（保留原生换行符）
const updateBlockContent = (block, event) => {
  const el = event.target
  const savedSel = cursorManager.saveSelection(el)
  
  // 保留原生换行符
  let rawContent = el.textContent
  const oldContent = block.content
  
  // 仅清理零宽空格，保留换行符
  rawContent = zwsp.has(rawContent) ? zwsp.clean(rawContent) : rawContent
  
  block.content = rawContent

  // 记录差异时才保存历史
  if (oldContent !== block.content) {
    historyManager.recordOperation('text-edit', {
      blockId: block.id,
      oldContent,
      newContent: block.content
    })
  }

  nextTick(() => {
    // 使用原生textContent保持换行符
    if (el.textContent !== rawContent) {
      el.textContent = rawContent
    }
    
    if (savedSel) {
      cursorManager.restoreSelection(el, {
        ...savedSel,
        content: rawContent // 使用实际内容恢复
      })
    }
  })
}

// 修改placeholder获取方法
const getPlaceholder = (block) => {
  if (block.content !== '') return ''
  switch (block.format) {
    case 'h1': return '标题 1'
    case 'h2': return '标题 2' 
    case 'h3': return '标题 3'
    case 'code': return '输入代码...'
    default: return '输入文本，或 "/" 打开命令菜单'
  }
}

// 修改字符统计方法（排除换行符）
const totalCharCount = computed(() => {
  return blocks.value.reduce((total, block) => {
    if (block.type === 'text') {
      return total + block.content.replace(/\n/g, '').length
    }
    return total
  }, 0)
})

const imageCount = computed(() => {
  if (!Array.isArray(blocks.value)) return 0
  return blocks.value.filter(block => block.type === 'image').length
})

// 修复菜单显示问题
const closeBlockTypeMenu = () => {
  if (!isMenuHovered.value) {
    showBlockTypeMenu.value = false
  }
}

// 切换块类型菜单
const toggleBlockTypeMenu = (block) => {
  showBlockTypeMenu.value = !showBlockTypeMenu.value
  activeBlockId.value = block.id
  
  // 聚焦到块
  const el = blockManager.getEditableElement(block.id)
  if (el) {
    el.focus()
  }
}

// 改变块类型
const changeBlockType = async (block, type) => {
  const el = blockManager.getEditableElement(block.id)
  const oldType = block.type
  const oldFormat = block.format
  
  if (type === 'image') {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          block.type = 'image'
          block.content = e.target.result
          
          // 记录改变块类型操作
          historyManager.recordOperation('change-block-type', {
            blockId: block.id,
            oldType,
            oldFormat,
            newType: 'image',
            newFormat: 'image'
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  } else if (type === 'divider') {
    block.type = 'divider'
    block.content = ''
    
    // 记录改变块类型操作
    historyManager.recordOperation('change-block-type', {
      blockId: block.id,
      oldType,
      oldFormat,
      newType: 'divider',
      newFormat: 'divider'
    })
  } else {
    block.format = type
    if (el) {
      el.focus()
      if (block.content === '\u200B') {
        block.content = ''
        el.textContent = ''
      }
      cursorManager.setToEnd(el)
      
      // 记录改变块类型操作
      historyManager.recordOperation('change-block-type', {
        blockId: block.id,
        oldType,
        oldFormat,
        newType: block.type,
        newFormat: type
      })
    }
  }
  showBlockTypeMenu.value = false
}

// 删除块
const removeBlock = (index) => {
  const removedBlock = blocks.value[index]
  
  // 记录删除块操作
  historyManager.recordOperation('remove-block', {
    blockId: removedBlock.id,
    index,
    block: { ...removedBlock }
  })
  
  blocks.value.splice(index, 1)
  if (blocks.value.length === 0) {
    blocks.value.push(blockManager.create())
  }
}

// 处理失焦事件
const handleBlur = () => {
  // 不再自动关闭菜单，由 click-outside 处理
}

// 保存内容
const save = () => {
  const content = {
    blocks: blocks.value,
    markdown: blocks.value
    .map(block => {
        if (block.type === 'text') {
          switch (block.format) {
            case 'h1': return `# ${block.content}`
            case 'h2': return `## ${block.content}`
            case 'h3': return `### ${block.content}`
            case 'code': return `\`\`\`\n${block.content}\n\`\`\``
        default: return block.content
      }
        }
        return ''
    })
      .join('\n'),
    html: blocks.value
    .map(block => {
        if (block.type === 'text') {
          switch (block.format) {
            case 'h1': return `<h1>${block.content}</h1>`
            case 'h2': return `<h2>${block.content}</h2>`
            case 'h3': return `<h3>${block.content}</h3>`
            case 'code': return `<pre><code>${block.content}</code></pre>`
        default: return `<p>${block.content}</p>`
      }
        } else if (block.type === 'image') {
          return `<img src="${block.content}" alt="" />`
        } else if (block.type === 'divider') {
          return '<hr />'
        }
        return ''
      })
      .join('\n')
  }
  emit('save', content)
  visible.value = false
}

// 生命周期钩子
const handleOpened = () => {
  nextTick(() => {
    blockManager.focus(blocks.value[0].id, 'start')
  })
}

const handleClosed = () => {
  blocks.value = []
  activeBlockId.value = null
  showBlockTypeMenu.value = false
}

// 重构焦点处理
const handleFocus = (block) => {
  activeBlockId.value = block.id
  const el = blockManager.getEditableElement(block.id)
  if (!el) return
  
  el.setAttribute('placeholder', getPlaceholder(block))
  
  // 只在内容为空或者只有零宽空格时设置光标位置到开头
  if (!block.content || block.content === '\u200B') {
    cursorManager.setToStart(el)
  }
}

// 添加图片预览功能
const openImagePreview = (block) => {
  // 这里可以实现图片预览逻辑
  console.log('预览图片:', block.content)
}

// 添加文本选择和复制相关的处理函数
const handleMouseDown = (event) => {
  // 允许文本选择
  event.stopPropagation()
}

const handleMouseUp = (event) => {
  // 允许文本选择结束
  event.stopPropagation()
}

const handleCopy = (event, block) => {
  event.stopPropagation()
  // 获取选中的文本
  const selection = window.getSelection()
  const selectedText = selection.toString()
  
  if (selectedText) {
    event.clipboardData.setData('text/plain', selectedText)
    event.preventDefault()
  }
}

// 优化粘贴处理
const handlePaste = async (event, block) => {
  event.stopPropagation()
  event.preventDefault()
  
  // 加强过滤：移除所有零宽空格和不可见字符
  let text = event.clipboardData.getData('text/plain')
  if (zwsp.has(text)) {
    text = zwsp.clean(text)
  }
  
  if (!text) return
  
  const el = event.target
  const savedSel = cursorManager.saveSelection(el)
  
  if (savedSel) {
    // 在光标位置插入文本
    const content = block.content
    block.content = content.slice(0, savedSel.start) + text + content.slice(savedSel.end)
    
    await nextTick()
    // 移动光标到插入文本后的位置
    cursorManager.restoreSelection(el, {
      start: savedSel.start + text.length,
      end: savedSel.start + text.length,
      content: block.content
    })
  }
}

const handleCut = async (event, block) => {
  event.stopPropagation()
  
  // 获取选中的文本
  const selection = window.getSelection()
  const selectedText = selection.toString()
  
  if (selectedText) {
    event.clipboardData.setData('text/plain', selectedText)
    event.preventDefault()
    
    const el = event.target
    const savedSel = cursorManager.saveSelection(el)
    
    if (savedSel) {
      // 删除选中的文本
      const content = block.content
      block.content = content.slice(0, savedSel.start) + content.slice(savedSel.end)
      
      await nextTick()
      // 移动光标到删除位置
      cursorManager.restoreSelection(el, {
        start: savedSel.start,
        end: savedSel.start,
        content: block.content
      })
    }
  }
}

// 添加初始化日志
onMounted(() => {
  log('编辑器组件已挂载')
  // 记录初始状态为添加块操作
  blocks.value.forEach((block, index) => {
    historyManager.recordOperation('add-block', {
      blockId: block.id,
      index,
      block: { ...block }
    })
  })
  log('初始块操作已记录')
})

// 清理历史记录
onUnmounted(() => {
  historyManager.clear()
})

// 暴露方法
defineExpose({
  open
})
</script>

<style>
.notion-editor {
  --block-handle-width: 2rem;
  --block-text-color: var(--foreground);
  --block-placeholder-color: var(--muted-foreground);
  --block-selection-color: var(--primary);
  --block-hover-bg: var(--muted);
  --block-focus-shadow: 0 0 0 2px var(--primary/10);
  --block-spacing: 0.75rem;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 编辑区域现代化样式 */
.notion-editor [contenteditable] {
  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.011em;
  padding: 0.5rem 0.75rem;
  margin: -0.5rem -0.75rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
  caret-color: var(--primary);
}

/* 块内容样式优化 */
.block-content {
  cursor: text;
  will-change: transform, background-color;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  padding: var(--block-spacing);
  margin: calc(var(--block-spacing) / 2) 0;
  border-radius: 0.75rem;
}

.block-content:hover {
  background-color: var(--hover-bg, rgba(0, 0, 0, 0.02));
}

.block-content:focus-within {
  background-color: var(--primary/5);
  box-shadow: var(--block-focus-shadow);
}

/* 选中文本样式优化 */
.notion-editor [contenteditable]::selection {
  background-color: var(--primary/20) !important;
  color: var(--foreground) !important;
}

/* 块动画效果优化 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 空块状态优化 */
.notion-editor [contenteditable]:empty:before {
  content: attr(placeholder);
  color: var(--block-placeholder-color);
  pointer-events: none;
  opacity: 0.5;
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease;
}

.notion-editor [contenteditable]:empty:focus:before {
  opacity: 0.3;
}

/* 块间距和过渡效果优化 */
.notion-editor .space-y-2 {
  --space: var(--block-spacing);
}

.notion-editor .space-y-2 > * + * {
  margin-top: var(--space);
}

/* 块操作按钮样式优化 */
.notion-editor .group:hover .absolute {
  opacity: 1;
  transform: translateX(0) translateY(-50%) scale(1);
}

.notion-editor .absolute {
  opacity: 0;
  transform: translateX(-4px) translateY(-50%) scale(0.95);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 标题样式优化 */
.notion-editor [contenteditable].text-2xl {
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.022em;
}

.notion-editor [contenteditable].text-xl {
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: -0.020em;
}

.notion-editor [contenteditable].text-lg {
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: -0.017em;
}

/* 代码块样式优化 */
.notion-editor [contenteditable].font-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.925em;
  line-height: 1.6;
  padding: 1rem;
  background-color: var(--muted);
  border-radius: 0.5rem;
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .notion-editor {
    --block-focus-shadow: 0 0 0 2px var(--primary/20);
  }
  
  .notion-editor [contenteditable]::selection {
    background-color: var(--primary/30) !important;
  }
}

/* 滚动条美化 */
.notion-editor ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.notion-editor ::-webkit-scrollbar-track {
  background: transparent;
}

.notion-editor ::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.notion-editor ::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

/* 图片容器样式优化 */
.notion-editor .group\/image {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: var(--muted);
}

.notion-editor .group\/image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
}

/* 动画优化 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notion-editor .block-content {
  animation: fade-in 0.2s ease-out;
}

/* 移除打字机光标效果，使用原生光标 */
.notion-editor [contenteditable]:focus {
  border-right: none;
  animation: none;
}

/* 优化空块状态 */
.notion-editor [contenteditable]:empty {
  min-height: 1.5em;
}

/* 优化分割线样式 */
.notion-editor hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, var(--border) 50%, transparent 50%);
  background-size: 8px 1px;
  margin: 1.5rem 0;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.notion-editor hr:hover {
  opacity: 0.7;
}

/* 添加深色模式优化 */
@media (prefers-color-scheme: dark) {
  .notion-editor [contenteditable]:hover {
    background-color: var(--hover-bg, rgba(255, 255, 255, 0.03));
  }
  
  .notion-editor .block-content:hover {
    background-color: var(--hover-bg, rgba(255, 255, 255, 0.02));
  }
}

/* 启用文本选择 */
.user-select-text {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

/* 优化菜单定位 */
.notion-editor .block-content {
  position: relative;
}

/* 优化统计数据显示 */
.notion-editor .text-muted-foreground {
  font-feature-settings: "tnum";
}

/* 启用文本选择 - 添加 !important 确保优先级 */
.notion-editor [contenteditable] {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  cursor: text !important;
}

/* 优化选中文本的样式 */
.notion-editor [contenteditable]::selection {
  background-color: var(--primary) !important;
  color: inherit !important;
  opacity: 0.3;
}

/* 确保父元素不会干扰文本选择 */
.notion-editor .block-content,
.notion-editor .group {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
}

/* 添加选中时的过渡效果 */
.notion-editor [contenteditable] {
  transition: all 0.2s ease;
}

.notion-editor [contenteditable]:focus::selection {
  animation: selection-fade-in 0.2s ease-out;
}

@keyframes selection-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: var(--selection-opacity);
  }
}

/* 移除之前的样式覆盖 */
.notion-editor [contenteditable]::selection {
  background-color: var(--selection-background) !important;
  color: var(--selection-text) !important;
  opacity: var(--selection-opacity);
}

/* 重置之前的选择样式 */
.notion-editor [contenteditable]::selection,
.notion-editor [contenteditable] *::selection {
  all: unset;
  background-color: #2563eb !important;
  color: white !important;
}

/* 深色模式下的选择样式 */
@media (prefers-color-scheme: dark) {
  .notion-editor [contenteditable]::selection,
  .notion-editor [contenteditable] *::selection {
    background-color: #60a5fa !important;
    color: #1e293b !important;
  }
}

/* 代码块的特殊选择样式 */
.notion-editor [contenteditable].font-mono::selection,
.notion-editor [contenteditable].font-mono *::selection {
  background-color: #3b82f6 !important;
  color: #f8fafc !important;
}

/* 移除可能影响选择的样式 */
.notion-editor [contenteditable] {
  -webkit-user-select: text !important;
  user-select: text !important;
  cursor: text !important;
}

/* 确保父元素不会干扰选择 */
.notion-editor .block-content {
  -webkit-user-select: text !important;
  user-select: text !important;
}

/* 添加CSS样式（关键！） */
.notion-editor [contenteditable] {
  white-space: pre-wrap !important;
  word-break: break-word;
}
</style>