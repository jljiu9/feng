<template>
  <Teleport to="body">
    <Transition 
      name="panel-mask"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div 
        v-if="visible"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000]"
        @click.self="handleMaskClick"
      >
        <Transition 
          :name="transitionName"
          @after-enter="handleAfterEnter"
          @after-leave="handleAfterLeave"
        >
          <div
            class="absolute bg-background shadow-xl"
            :class="[panelClasses, edgeRadiusClass]"
            :style="[panelStyle, dynamicRadiusStyle]"
          >
            <slot>
              <!-- 默认内容 -->
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-4">操作面板</h3>
                <div class="space-y-4">
                  <!-- 自定义内容 -->
                </div>
              </div>
            </slot>
            
            <!-- 关闭按钮 -->
            <button
              @click="close"
              class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // 面板位置：top | bottom | left | right
  position: {
    type: String,
    default: 'right',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
  },
  // 面板尺寸（宽度或高度）
  size: {
    type: [Number, String],
    default: '30%',
    validator: (v) => {
      if (typeof v === 'string') return v.endsWith('%')
      return v > 0
    }
  },
  // 是否显示
  modelValue: Boolean,
  // 点击外部是否关闭
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  fullViewport: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue', 
  'open', 
  'close',
  'opened',
  'closed'
])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 动态计算样式
const panelStyle = computed(() => {
  const isVertical = ['left', 'right'].includes(props.position)
  const dimension = isVertical ? 'width' : 'height'
  
  // 处理百分比值
  if (typeof props.size === 'string' && props.size.endsWith('%')) {
    return { [dimension]: props.size }
  }
  
  // 处理数字值
  return { [dimension]: `${props.size}px` }
})

// 面板定位类
const panelClasses = computed(() => ({
  'inset-x-0 top-0': props.position === 'top',
  'inset-x-0 bottom-0': props.position === 'bottom',
  'inset-y-0 left-0': props.position === 'left',
  'inset-y-0 right-0': props.position === 'right'
}))

// 动态过渡效果
const transitionName = computed(() => `panel-${props.position}`)

// 新增动态圆角计算
const dynamicRadiusStyle = computed(() => {
  if (props.fullViewport) return {}
  
  const isPercentage = typeof props.size === 'string'
  const showFullRadius = isPercentage ? parseFloat(props.size) < 100 : true
  
  return showFullRadius ? {} : { borderRadius: '0' }
})

// 边缘圆角类
const edgeRadiusClass = computed(() => {
  if (props.fullViewport) return ''
  
  return {
    top: 'rounded-b-2xl',
    bottom: 'rounded-t-2xl',
    left: 'rounded-r-2xl',
    right: 'rounded-l-2xl'
  }[props.position]
})

const close = () => {
  visible.value = false
}

const handleMaskClick = () => {
  if (props.closeOnClickOutside) {
    close()
  }
}

// 在打开时触发open事件
watch(visible, (newVal) => {
  if (newVal) {
    emit('open')
  } else {
    emit('close')
  }
})

// 添加Transition事件处理
const handleAfterEnter = () => {
  emit('opened')
}

const handleAfterLeave = () => {
  emit('closed')
}

// // 键盘支持
// onKeyStroke('Escape', close)
</script>

<style scoped>
/* 遮罩动画 */
.panel-mask-enter-active,
.panel-mask-leave-active {
  transition: opacity 0.2s ease;
}

.panel-mask-enter-from,
.panel-mask-leave-to {
  opacity: 0;
}

/* 右侧面板动画 */
.panel-right-enter-active,
.panel-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.33, 0.84, 0.4, 0.99),
              border-radius 0.2s ease 0.1s;
}

.panel-right-enter-from {
  transform: translateX(100%);
  border-radius: 0;
}
.panel-right-enter-to {
  border-radius: 0.75rem;
}

/* 左侧面板动画 */
.panel-left-enter-active,
.panel-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-left-enter-from {
  transform: translateX(-100%);
}
.panel-left-leave-to {
  transform: translateX(-100%);
}

/* 顶部面板动画 */
.panel-top-enter-active,
.panel-top-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-top-enter-from {
  transform: translateY(-100%);
}
.panel-top-leave-to {
  transform: translateY(-100%);
}

/* 底部面板动画 */
.panel-bottom-enter-active,
.panel-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-bottom-enter-from {
  transform: translateY(100%);
}
.panel-bottom-leave-to {
  transform: translateY(100%);
}

/* 遮罩动画优化 */
.panel-mask-enter-active {
  transition: opacity 0.2s ease 0.1s;
}
.panel-mask-leave-active {
  transition: opacity 0.2s ease;
}
</style> 