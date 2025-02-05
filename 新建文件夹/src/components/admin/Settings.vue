<template>
    <div class="space-y-6">
        <!-- 系统设置卡片 -->
        <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium">系统设置</h3>
            </div>
            <div class="p-6 space-y-6">
                <!-- 基本设置 -->
                <div class="space-y-4">
                    <h4 class="text-base font-medium">基本设置</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">系统名称</label>
                            <input type="text" v-model="settings.systemName"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">系统Logo</label>
                            <div class="mt-1 flex items-center space-x-4">
                                <img :src="settings.logo" class="h-12 w-12 rounded">
                                <button
                                    class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                    更换Logo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 安全设置 -->
                <div class="space-y-4 pt-6 border-t">
                    <h4 class="text-base font-medium">安全设置</h4>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h5 class="text-sm font-medium text-gray-900">两步验证</h5>
                                <p class="text-sm text-gray-500">启用两步验证以提高账户安全性</p>
                            </div>
                            <button
                                class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                {{ settings.twoFactor ? '已启用' : '未启用' }}
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h5 class="text-sm font-medium text-gray-900">登录通知</h5>
                                <p class="text-sm text-gray-500">新设备登录时发送邮件通知</p>
                            </div>
                            <button
                                class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                {{ settings.loginNotification ? '已启用' : '未启用' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 存储设置 -->
                <div class="space-y-4 pt-6 border-t">
                    <h4 class="text-base font-medium">存储设置</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">默认存储限制</label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input type="number" v-model="settings.storageLimit"
                                    class="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <span
                                    class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                                    GB
                                </span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">允许的文件类型</label>
                            <div class="mt-1">
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="type in settings.allowedFileTypes" :key="type"
                                        class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                        {{ type }}
                                    </span>
                                    <button
                                        class="px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                                        添加
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 保存按钮 -->
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    取消
                </button>
                <button
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    保存更改
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const settings = ref({
    systemName: '后台管理系统',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=logo',
    twoFactor: false,
    loginNotification: true,
    storageLimit: 100,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx']
})
</script> 