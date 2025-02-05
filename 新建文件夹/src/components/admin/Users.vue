<template>
    <div class="space-y-6">
        <!-- 搜索和操作栏 -->
        <div class="flex justify-between items-center">
            <div class="flex space-x-4">
                <input type="text" placeholder="搜索用户..."
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    搜索
                </button>
            </div>
            <button
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                添加用户
            </button>
        </div>

        <!-- 用户列表 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-for="header in tableHeaders" :key="header"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {{ header }}
                        </th>
                        <th class="px-6 py-3 text-right">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in users" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img :src="user.avatar" class="w-8 h-8 rounded-full">
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="user.roleClass">{{ user.role }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ user.lastLogin }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ user.status }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                            <button class="text-red-600 hover:text-red-900">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
                <button
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    上一页
                </button>
                <button
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    下一页
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        显示第
                        <span class="font-medium">1</span>
                        到
                        <span class="font-medium">10</span>
                        条，共
                        <span class="font-medium">97</span>
                        条记录
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            上一页
                        </button>
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            1
                        </button>
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            2
                        </button>
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            3
                        </button>
                        <button
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            下一页
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const tableHeaders = ['用户信息', '角色', '最后登录', '状态']

const users = [
    {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        role: '管理员',
        roleClass: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
        lastLogin: '2024-01-20 12:00',
        status: '在线'
    },
    {
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        role: '用户',
        roleClass: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
        lastLogin: '2024-01-19 15:30',
        status: '离线'
    },
    {
        id: 3,
        name: '王五',
        email: 'wangwu@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        role: '访客',
        roleClass: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
        lastLogin: '2024-01-18 09:15',
        status: '离线'
    }
]
</script> 