<!-- NavUser.vue -->
<template>
  <div class="relative flex items-center gap-2 px-3 py-1.5" :class="{ 'justify-center': collapsed }">
    <div class="relative">
      <!-- 头像骨架 -->
      <div class="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
          {{ getInitials(user.name) }}
        </span>
      </div>
    </div>
    <div v-if="!collapsed" class="flex-1">
      <div class="text-xs font-medium">{{ user.name }}</div>
      <div class="text-[10px] text-muted-foreground">{{ user.role }}</div>
    </div>
    <!-- 悬浮提示 -->
    <div
      v-if="collapsed"
      class="invisible absolute bottom-full left-1/2 mb-1.5 w-32 -translate-x-1/2 rounded-md border bg-card p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
    >
      <div class="px-1.5 py-1">
        <div class="text-xs font-medium">{{ user.name }}</div>
        <div class="text-[10px] text-muted-foreground">{{ user.role }}</div>
      </div>
    </div>
    <!-- 添加下拉菜单 -->
    <div v-show="userState.showDropdown" ref="dropdownRef" class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card py-1 shadow-lg">
      <button
        v-for="item in menuItems"
        :key="item.label"
        class="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted/50"
        :class="item.class"
        @click="item.action"
      >
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="item.icon === 'user'" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          <path v-else-if="item.icon === 'settings'" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path v-else-if="item.icon === 'logout'" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const dropdownRef = ref(null)

// 状态管理优化
const userState = reactive({
  showDropdown: false,
  user: {
    name: '张三',
    role: '管理员',
    avatar: null
  }
})

// 优化的登出处理
const handleLogout = async () => {
  try {
    await logout() // API调用
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}

// 下拉菜单选项
const menuItems = [
  {
    label: '个人信息',
    icon: 'user',
    action: () => router.push('/profile')
  },
  {
    label: '账号设置',
    icon: 'settings',
    action: () => router.push('/settings')
  },
  {
    label: '退出登录',
    icon: 'logout',
    action: handleLogout,
    class: 'text-red-600'
  }
]

// 优化的头像显示
const avatarContent = computed(() => {
  if (!userState.user?.avatar) {
    return { 
      type: 'text', 
      content: getInitials(userState.user?.name || ''),
      class: 'bg-primary/10 text-primary'
    }
  }
  return { type: 'image', src: userState.user.avatar }
})

// 优化的下拉菜单处理
const toggleDropdown = () => {
  userState.showDropdown = !userState.showDropdown
}

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    userState.showDropdown = false
  }
}

// 动画效果
const dropdownClasses = computed(() => ({
  'absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card py-1 shadow-lg': true,
  'transform transition-all duration-200 ease-out': true,
  'scale-100 opacity-100': userState.showDropdown,
  'scale-95 opacity-0': !userState.showDropdown
}))

// 工具提示优化
const tooltipProps = computed(() => ({
  'data-tooltip': userState.user?.name || '',
  'data-tooltip-position': 'right',
  class: props.collapsed ? 'tooltip-visible' : 'tooltip-hidden'
}))

// 获取名字的首字母
const getInitials = (name) => {
  if (!name) return ''
  return name.charAt(0)
}

// 初始化
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script> 