<template>
  <div class="relative inline-block">
    <!-- 触发器插槽 -->
    <div @click="handleTriggerClick" ref="triggerRef">
      <slot name="trigger"></slot>
    </div>

    <!-- 弹出层 -->
    <Teleport to="body">
      <Transition name="pop-fade">
        <div 
          v-if="visible"
          class="absolute z-[999] bg-background rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm"
          :style="{
            position: strategy,
            left: x ? `${x}px` : '',
            top: y ? `${y}px` : '',
            maxWidth: `${maxWidth}px`
          }"
          ref="popperRef"
        >
          <!-- 箭头样式升级 -->
          <div
            ref="arrowRef"
            class="absolute w-3 h-3 bg-background border border-gray-100 dark:border-gray-800 shadow-sm"
            :class="[
              'before:absolute before:inset-0 before:bg-inherit before:rotate-45',
              'after:absolute after:inset-0 after:bg-background after:rotate-45 after:-z-10'
            ]"
            :style="arrowStyle"
          />

          <!-- 内容容器优化 -->
          <div 
            class="p-5 max-w-[320px] space-y-4"
            ref="contentRef"
          >
            <slot>
              <div v-if="title" class="font-semibold text-base text-foreground">{{ title }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ message }}
              </div>
            </slot>
          </div>

          <!-- 操作按钮现代化设计 -->
          <div v-if="mode === 'confirm'" class="flex gap-3 p-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
                     border border-gray-200 dark:border-gray-700 
                     hover:bg-gray-50 dark:hover:bg-gray-800/50
                     text-gray-700 dark:text-gray-200"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
                     bg-primary hover:bg-primary/90 
                     text-primary-foreground shadow-sm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 遮罩层(可选) -->
    <Transition name="fade">
      <div 
        v-if="visible && overlay" 
        class="fixed inset-0 bg-black/20"
        @click="handleOverlayClick"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useElementBounding, useWindowSize, onKeyStroke, useElementSize } from '@vueuse/core'
import { 
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow as arrowMiddleware
} from '@floating-ui/vue'

const props = defineProps({
  // 模式: confirm(确认模式) 或 custom(自定义模式)
  mode: {
    type: String,
    default: 'confirm'
  },
  // 标题
  title: String,
  // 消息内容
  message: String,
  // 确认按钮文本
  confirmText: {
    type: String,
    default: '确定'
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 弹出位置
  placement: {
    type: String,
    default: 'bottom'
  },
  // 是否显示遮罩
  overlay: {
    type: Boolean,
    default: false
  },
  // 点击外部是否关闭
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  // 是否在触发器悬浮时显示
  trigger: {
    type: String,
    default: 'click' // 'click' | 'hover'
  },
  // 是否自动选择最佳位置
  autoPlacement: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: [Number, String],
    default: 320
  },
  theme: {
    type: String,
    default: 'default',
    validator: v => ['default', 'danger', 'warning'].includes(v)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

// 状态
const visible = ref(false)
const triggerRef = ref(null)
const popperRef = ref(null)

// 监听内容尺寸变化
const contentRef = ref(null)

// 新增箭头处理
const arrowRef = ref(null)
const middleware = computed(() => [
  offset(8),
  flip({ padding: 8 }),
  shift({ padding: 8 }),
  arrowMiddleware({ element: arrowRef, padding: 4 })
])

// 使用Floating UI重构定位逻辑
const { 
  x, 
  y, 
  strategy, 
  placement: currentPlacement,
  middlewareData 
} = useFloating(triggerRef, popperRef, {
  placement: props.placement,
  whileElementsMounted: autoUpdate,
  middleware
})

// 添加默认值
const arrow = computed(() => middlewareData.value.arrow || { x: 0, y: 0 })

// 修改箭头位置计算逻辑
const arrowStyle = computed(() => {
  // 添加安全访问
  const arrowData = arrow.value
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }[currentPlacement.value.split('-')[0]] || 'top'

  return {
    left: arrowData.x != null ? `${arrowData.x}px` : '50%',
    top: arrowData.y != null ? `${arrowData.y}px` : '50%',
    [staticSide]: '-4px'
  }
})

// 处理触发器点击
const handleTriggerClick = () => {
  if (props.trigger === 'click') {
    visible.value = !visible.value
  }
}

// 处理确认
const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// 处理遮罩点击
const handleOverlayClick = () => {
  if (props.closeOnClickOutside) {
    visible.value = false
  }
}

// 监听可见性变化
watch(visible, (val) => {
  emit('update:visible', val)
})

// 自定义点击外部处理函数
const useClickOutside = (elementRef, callback) => {
  const handleClick = (event) => {
    if (elementRef.value && !elementRef.value.contains(event.target)) {
      callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })
}

// 悬浮触发处理
let hoverTimer = null
if (props.trigger === 'hover') {
  onMounted(() => {
    const trigger = triggerRef.value
    if (trigger) {
      trigger.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer)
        visible.value = true
      })
      trigger.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(() => {
          visible.value = false
        }, 200)
      })
    }
  })

  onUnmounted(() => {
    clearTimeout(hoverTimer)
  })
}

// 动态样式
const themeClasses = computed(() => {
  return {
    danger: 'bg-destructive text-destructive-foreground',
    warning: 'bg-warning text-warning-foreground',
  }[props.theme] || 'bg-background text-foreground'
})

// 键盘支持
onKeyStroke('Escape', () => visible.value = false)
</script>

<style scoped>
/* 现代化过渡动画 */
.pop-fade-enter-active,
.pop-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: var(--kb-popper-transform-origin);
}

.pop-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(2px);
}

.pop-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-2px);
}

/* 危险主题适配 */
.danger {
  @apply bg-destructive text-destructive-foreground border-destructive;
}

/* 警告主题适配 */
.warning {
  @apply bg-warning text-warning-foreground border-warning;
}
</style> 