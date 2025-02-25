<template>
  <div class="relative">
    <!-- 背景滑块 - 使用 transform 代替位置计算 -->
    <div 
      class="absolute transition-transform duration-200 ease-out bg-muted rounded-md"
      :style="{
        transform: `translate(${activeTabPosition.x}px, ${activeTabPosition.y}px)`,
        width: `${activeTabPosition.width}px`,
        height: `${activeTabPosition.height}px`
      }"
    />
    
    <!-- 选项卡按钮组 -->
    <div 
      class="relative flex"
      :class="vertical ? 'flex-col space-y-1' : 'space-x-2'"
      ref="tabsRef"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        ref="tabRefs"
        class="px-3 py-1.5 text-xs rounded-md transition-colors relative"
        :class="[
          modelValue === tab.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          vertical ? 'text-left w-full' : ''
        ]"
        @click="$emit('update:modelValue', tab.value)"
      >
        <slot name="tab" :tab="tab">
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="float-right text-muted-foreground">
            {{ tab.count }}
          </span>
        </slot>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useThrottleFn } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  vertical: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const tabsRef = ref(null)
const tabRefs = ref([])
const activeTabPosition = ref({ x: 0, y: 0, width: 0, height: 0 })

// 使用 ResizeObserver 监听容器大小变化
let resizeObserver = null

// 节流处理的更新滑块位置函数
const updateSliderPosition = useThrottleFn(async () => {
  const activeIndex = props.tabs.findIndex(tab => tab.value === props.modelValue)
  if (activeIndex === -1 || !tabRefs.value[activeIndex]) return

  const activeTab = tabRefs.value[activeIndex]
  const tabsContainer = tabsRef.value
  
  // 使用 offsetLeft/offsetTop 代替 getBoundingClientRect
  activeTabPosition.value = {
    x: activeTab.offsetLeft,
    y: activeTab.offsetTop,
    width: activeTab.offsetWidth,
    height: activeTab.offsetHeight
  }
}, 16) // 约60fps的更新频率

// 监听选中值变化
watch(() => props.modelValue, () => {
  nextTick(updateSliderPosition)
})

// 监听标签数组变化
watch(() => props.tabs, () => {
  nextTick(updateSliderPosition)
}, { deep: true })

onMounted(() => {
  // 初始化位置
  nextTick(updateSliderPosition)
  
  // 使用 ResizeObserver 替代 resize 事件
  resizeObserver = new ResizeObserver(updateSliderPosition)
  if (tabsRef.value) {
    resizeObserver.observe(tabsRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
/* 优化滑块动画性能 */
.absolute {
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
</style> 