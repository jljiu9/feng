<!-- AppSidebar.vue -->
<template>
  <aside 
    ref="sidebarRef"
    class="flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out" 
    :class="sidebarClasses"
  >
    <!-- Header -->
    <div class="flex h-12 items-center justify-between border-b px-3">
      <a href="#" class="group flex items-center gap-2">
        <div class="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-110">
          <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3H9v18h6V3z" />
            <path d="M20 6h-4v12h4V6z" />
            <path d="M8 6H4v12h4V6z" />
          </svg>
        </div>
        <div 
          class="grid flex-1 text-left text-xs leading-tight transition-all duration-200" 
          :class="[
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
          ]"
        >
          <span class="truncate font-medium">后台管理</span>
          <span class="truncate text-[10px] text-muted-foreground">管理系统</span>
        </div>
      </a>
      <button 
        class="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50"
        @click="toggleSidebar"
      >
        <svg 
          class="size-3 transition-transform duration-200" 
          :class="{ 'rotate-180': isCollapsed }"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <path v-if="isCollapsed" d="M13 5l7 7-7 7M4 5l7 7-7 7" />
          <path v-else d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <div 
        class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30"
        :class="{ 'hover:scrollbar-thumb-primary/30': isHovering }"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <NavMain :items="data.navMain" :collapsed="isCollapsed" />
        <NavProjects :projects="data.projects" :collapsed="isCollapsed" />
      </div>
      <div class="mt-auto">
        <NavSecondary :items="data.navSecondary" :collapsed="isCollapsed" />
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t px-2 py-1.5">
      <NavUser :user="data.user" :collapsed="isCollapsed" />
    </div>

    <!-- 移动端遮罩 -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="!isDesktop && sidebarState.isMobileOpen"
        class="fixed inset-0 bg-foreground/50 backdrop-blur-sm lg:hidden"
        @click="sidebarState.isMobileOpen = false"
      ></div>
    </Transition>
  </aside>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import NavMain from './NavMain.vue'
import NavProjects from './NavProjects.vue'
import NavSecondary from './NavSecondary.vue'
import NavUser from './NavUser.vue'
import { useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarRef = ref(null)

const sidebarState = reactive({
  isCollapsed: false,
  isMobileOpen: false,
  activeMenu: '',
  hoveredItem: null
})

const isCollapsed = computed(() => sidebarState.isCollapsed)
const isDesktop = useMediaQuery('(min-width: 1024px)')

const toggleSidebar = () => {
  if (isDesktop.value) {
    sidebarState.isCollapsed = !sidebarState.isCollapsed
    localStorage.setItem('sidebarCollapsed', String(sidebarState.isCollapsed))
  } else {
    sidebarState.isMobileOpen = !sidebarState.isMobileOpen
  }
}

const handleMobileClick = (e) => {
  if (sidebarState.isMobileOpen && sidebarRef.value && !sidebarRef.value.contains(e.target)) {
    sidebarState.isMobileOpen = false
  }
}

const handleRouteChange = (route) => {
  sidebarState.activeMenu = route?.meta?.menu || ''
  if (!isDesktop.value) {
    setTimeout(() => {
      sidebarState.isMobileOpen = false
    }, 150)
  }
}

watch(() => route.fullPath, () => handleRouteChange(route), { immediate: true })

const isRouteActive = (path) => {
  if (!path) return false
  return route.path.startsWith(path)
}

const isMenuActive = computed(() => (item) => {
  if (!item?.url) return false
  if (item.items?.length) {
    return item.items.some(subItem => isRouteActive(subItem.url))
  }
  return isRouteActive(item.url)
})

const isHovering = ref(false)

const sidebarClasses = computed(() => ({
  'w-64 shadow-lg': !sidebarState.isCollapsed,
  'w-16 shadow-md': sidebarState.isCollapsed,
  'translate-x-0 z-50': sidebarState.isMobileOpen || isDesktop.value,
  '-translate-x-full': !sidebarState.isMobileOpen && !isDesktop.value,
  'transition-all duration-300 ease-in-out': true,
  'fixed lg:relative': true
}))

const handleItemHover = (item) => {
  if (sidebarState.isCollapsed) {
    sidebarState.hoveredItem = item
  }
}

onMounted(() => {
  const savedCollapsed = localStorage.getItem('sidebarCollapsed')
  if (savedCollapsed !== null) {
    sidebarState.isCollapsed = savedCollapsed === 'true'
  }
  
  document.addEventListener('click', handleMobileClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleMobileClick)
})

const toggleTheme = () => {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.add('theme-transition')
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.classList.toggle('dark')
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition')
  }, 300)
}

const tooltipProps = computed(() => ({
  'data-tooltip': true,
  'data-tooltip-position': 'right',
  class: sidebarState.isCollapsed ? 'tooltip-visible' : 'tooltip-hidden'
}))

const data = ref({
  user: {
    name: "管理员",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "仪表盘",
      url: "/dashboard",
      icon: `<path d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />`,
      meta: { menu: 'dashboard' },
      items: [
        {
          title: "概览",
          url: "/dashboard/overview",
          meta: { menu: 'dashboard-overview' }
        },
        {
          title: "分析",
          url: "/dashboard/analytics",
          meta: { menu: 'dashboard-analytics' }
        },
      ],
    },
    {
      title: "用户管理",
      url: "/users",
      icon: `<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />`,
      items: [
        {
          title: "用户列表",
          url: "/users/list",
        },
        {
          title: "角色权限",
          url: "/users/roles",
        },
        {
          title: "部门管理",
          url: "/users/departments",
        },
      ],
    },
    {
      title: "系统设置",
      url: "/settings",
      icon: `<path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`,
      items: [
        {
          title: "基础设置",
          url: "/settings/basic",
        },
        {
          title: "安全设置",
          url: "/settings/security",
        },
        {
          title: "系统日志",
          url: "/settings/logs",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "帮助文档",
      url: "/help",
      icon: `<path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />`,
    },
    {
      title: "问题反馈",
      url: "/feedback",
      icon: `<path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />`,
    },
  ],
  projects: [
    {
      name: "运营部门",
      url: "/departments/operations",
      icon: `<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />`,
    },
    {
      name: "技术部门",
      url: "/departments/tech",
      icon: `<path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />`,
    },
    {
      name: "市场部门",
      url: "/departments/marketing",
      icon: `<path d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />`,
    },
  ],
})
</script>

<style scoped>
.theme-transition * {
  transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out !important;
}

/* 添加滚动条样式 */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
  transition: background-color 0.2s ease-in-out;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

/* 定义CSS变量 */
:root {
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.3);
}

.dark {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.3);
}
</style> 