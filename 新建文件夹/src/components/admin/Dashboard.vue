<template>
    <div class="space-y-6">
        <!-- 数据概览卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="stat in stats" :key="stat.title"
                class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ stat.title }}</p>
                        <p class="text-2xl font-semibold mt-1">{{ stat.value }}</p>
                    </div>
                    <div :class="stat.iconClass">
                        <component :is="stat.icon" class="w-8 h-8"></component>
                    </div>
                </div>
                <div class="mt-4">
                    <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
                        {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                    </span>
                    <span class="text-gray-500 text-sm ml-2">较上周</span>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-medium mb-4">访问趋势</h3>
                <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
                    图表占位符
                </div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-medium mb-4">用户分布</h3>
                <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
                    图表占位符
                </div>
            </div>
        </div>

        <!-- 最近活动 -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-medium mb-4">最近活动</h3>
            <div class="space-y-4">
                <div v-for="activity in activities" :key="activity.id"
                    class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div class="flex items-center space-x-3">
                        <img :src="activity.avatar" class="w-8 h-8 rounded-full">
                        <div>
                            <p class="text-sm">{{ activity.description }}</p>
                            <p class="text-xs text-gray-500">{{ activity.time }}</p>
                        </div>
                    </div>
                    <span :class="activity.statusClass">{{ activity.status }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = [
    {
        title: '总用户数',
        value: '1,234',
        trend: 12.5,
        icon: 'UserIcon',
        iconClass: 'text-blue-500'
    },
    {
        title: '今日访问',
        value: '456',
        trend: -2.3,
        icon: 'ChartIcon',
        iconClass: 'text-green-500'
    },
    {
        title: '总存储量',
        value: '789 GB',
        trend: 8.4,
        icon: 'StorageIcon',
        iconClass: 'text-purple-500'
    }
]

const activities = [
    {
        id: 1,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        description: '用户张三上传了新文件',
        time: '10分钟前',
        status: '已完成',
        statusClass: 'text-green-500'
    },
    {
        id: 2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        description: '用户李四分享了文件夹',
        time: '30分钟前',
        status: '处理中',
        statusClass: 'text-yellow-500'
    },
    {
        id: 3,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        description: '系统自动备份完成',
        time: '1小时前',
        status: '已完成',
        statusClass: 'text-green-500'
    }
]
</script> 