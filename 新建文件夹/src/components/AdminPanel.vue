<template >
    <div class="fixed inset-0 bg-white">
        <!-- 顶部导航栏 -->
        <header class="h-16 bg-gray-50 border-b flex items-center px-4 justify-between">
            <div class="flex items-center space-x-4">
                <button @click="goBack" class="text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div class="flex items-center space-x-3">
                    <img :src="avatar" class="w-8 h-8 rounded-full" />
                    <span class="font-medium">{{ username }}</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">管理员</span>
                </div>
            </div>
        </header>

        <!-- 主体内容 -->
        <div class="flex h-[calc(100vh-4rem)]">
            <!-- 左侧边栏 -->
            <div class="w-64 bg-gray-50 border-r p-4" :class="{ 'w-0': !sidebarOpen }">
                <div class="space-y-4">
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <div class="text-center">
                            <img :src="avatar" class="w-20 h-20 rounded-full mx-auto" />
                            <div class="mt-3 font-medium">{{ username }}</div>
                            <div class="text-gray-500 text-sm">{{ email }}</div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <div class="text-gray-600 bg-gray-50 rounded p-2 text-sm text-center">
                                在线时长：{{ onlineTime }}
                            </div>
                            <div class="text-gray-600 bg-gray-50 rounded p-2 text-sm text-center">
                                登录次数：{{ loginCount }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧内容区 -->
            <div class="flex-1 overflow-auto">
                <div class="p-6">
                    <div class="flex space-x-2">
                        <button @click="currentTab = tab.id" v-for="tab in tabs" :key="tab.id"
                            class="px-4 py-2 rounded-lg" :class="{
                                'bg-blue-500 text-white': currentTab === tab.id,
                                'bg-gray-100 text-gray-700 hover:bg-gray-200': currentTab !== tab.id
                            }">
                            {{ tab.name }}
                        </button>
                    </div>

                    <div class="mt-6">
                        <component :is="currentComponent"></component>
                    </div>
                </div>
            </div>

            <!-- 侧边栏切换按钮 -->
            <button @click="toggleSidebar"
                class="absolute left-64 top-1/2 -translate-y-1/2 bg-blue-500 text-white w-6 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': !sidebarOpen }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import Dashboard from './admin/Dashboard.vue'
import Users from './admin/Users.vue'
import Settings from './admin/Settings.vue'


onMounted(() => {
// 全局状态管理
if (!window.adminState) {
    window.adminState = {
        visible: ref(false),
        username: ref('管理员'),
        email: ref('admin@example.com'),
        avatar: ref('https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
        onlineTime: ref('2小时'),
        loginCount: ref(5)
    }
    
}
let admin = window.adminState

// 从window对象获取状态
const { visible, username, email, avatar, onlineTime, loginCount } = window.adminState

// 返回事件
const goBack = () => {
    visible.value = false
}

// 侧边栏状态
const sidebarOpen = ref(true)
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

// 标签页配置
const tabs = [
    { id: 'dashboard', name: '仪表盘', component: Dashboard },
    { id: 'users', name: '用户管理', component: Users },
    { id: 'settings', name: '系统设置', component: Settings }
]

// 当前选中的标签页
const currentTab = ref('dashboard')

// 当前显示的组件
const currentComponent = computed(() => {
    const tab = tabs.find(t => t.id === currentTab.value)
    return tab ? tab.component : null
})
})

</script>

<style>
/* 可以添加一些自定义样式，但主要使用 Tailwind 类 */
</style> 