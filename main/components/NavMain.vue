<!-- NavMain.vue -->
<template>
  <div class="py-2">
    <div class="px-3 text-xs font-medium text-muted-foreground" :class="{ 'text-center': collapsed }">平台</div>
    <nav class="mt-1">
      <template v-for="item in items" :key="item.title">
        <div class="group relative">
          <!-- 主菜单项 -->
          <router-link
            :to="item.url"
            class="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted/50"
            :class="[
              { 'bg-muted': isActive(item.url) },
              collapsed ? 'justify-center' : ''
            ]"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="item.icon"></svg>
            <span v-if="!collapsed" class="text-xs">{{ item.title }}</span>
          </router-link>
          
          <!-- 二级菜单 -->
          <div v-if="item.items?.length && !collapsed" class="relative ml-3 mt-0.5 space-y-0.5 pl-3">
            <!-- 垂直引导线 -->
            <div class="absolute bottom-2 left-0 top-0 w-px bg-border"></div>
            <router-link
              v-for="subItem in item.items"
              :key="subItem.title"
              :to="subItem.url"
              class="relative block rounded-md px-3 py-1 text-xs hover:bg-muted/50"
              :class="{ 'bg-muted': isActive(subItem.url) }"
            >
              <!-- 水平引导线 -->
              <div class="absolute left-[-0.75rem] top-[0.7rem] h-px w-2.5 bg-border"></div>
              {{ subItem.title }}
            </router-link>
          </div>

          <!-- 悬浮提示 -->
          <template v-if="collapsed">
            <!-- 无子菜单时的简单提示 -->
            <div
              v-if="!item.items?.length"
              class="invisible absolute left-full top-1/2 ml-1.5 -translate-y-1/2 rounded-md border bg-card px-2 py-1 text-xs opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
            >
              {{ item.title }}
            </div>
            
            <!-- 有子菜单时的展开提示 -->
            <div
              v-else
              class="invisible absolute left-full top-0 ml-1.5 w-40 rounded-md border bg-card p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
            >
              <div class="px-2 py-1 text-xs font-medium">{{ item.title }}</div>
              <div class="relative mt-0.5 space-y-0.5 pl-3">
                <!-- 垂直引导线 -->
                <div class="absolute bottom-2 left-1.5 top-0 w-px bg-border"></div>
                <router-link
                  v-for="subItem in item.items"
                  :key="subItem.title"
                  :to="subItem.url"
                  class="relative block rounded-md px-2 py-1 text-xs hover:bg-muted/50"
                  :class="{ 'bg-muted': isActive(subItem.url) }"
                >
                  <!-- 水平引导线 -->
                  <div class="absolute left-[-0.375rem] top-[0.7rem] h-px w-1.5 bg-border"></div>
                  {{ subItem.title }}
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </template>
    </nav>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

// 状态管理优化
const navState = reactive({
  activeItem: '',
  hoveredItem: null,
  notifications: new Map()
})

// 路由匹配优化
const isActive = (path) => {
  if (!path) return false
  if (Array.isArray(path)) {
    return path.some(p => route.path.startsWith(p))
  }
  return route.path.startsWith(path)
}

// 工具提示优化
const getTooltip = (item) => {
  if (!item?.label) return {}
  return {
    'data-tooltip': item.label,
    'data-tooltip-position': 'right',
    class: props.collapsed ? 'tooltip-visible' : 'tooltip-hidden'
  }
}

// 通知徽章优化
const getBadge = (item) => {
  if (!item?.path) return null
  const count = navState.notifications.get(item.path)
  return count ? {
    content: count > 99 ? '99+' : count,
    class: 'absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground'
  } : null
}

// 动画效果优化
const itemClasses = (item) => {
  if (!item) return {}
  return {
    'flex items-center gap-3 rounded-md px-3 py-1.5 text-xs transition-colors': true,
    'bg-primary text-primary-foreground': isActive(item.path),
    'text-muted-foreground hover:bg-muted/50': !isActive(item.path),
    'justify-center': props.collapsed,
    'hover:scale-105 transform transition-transform': true
  }
}

// 交互事件优化
const handleItemClick = (item) => {
  if (!item?.path) return
  navState.activeItem = item.path
  if (typeof item.onClick === 'function') {
    item.onClick()
  }
}

const handleItemHover = (item) => {
  navState.hoveredItem = props.collapsed ? item : null
}

// 通知更新优化
const updateNotifications = (path, count) => {
  if (count > 0) {
    navState.notifications.set(path, count)
  } else {
    navState.notifications.delete(path)
  }
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  const matchedItem = props.items?.find(item => {
    if (isActive(item.url)) return true
    return item.items?.some(subItem => isActive(subItem.url))
  })
  if (matchedItem) {
    navState.activeItem = matchedItem.url
  }
}, { immediate: true })

// 导出组件状态
defineExpose({
  updateNotifications
})
</script> 