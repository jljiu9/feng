<!-- Help.vue -->
<template>
  <div class="space-y-4">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium md:text-xl">帮助文档</h1>
      <div class="flex items-center gap-2">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="search" placeholder="搜索文档..." class="w-full rounded-md border bg-transparent pl-8 pr-3 py-1.5 text-xs" />
        </div>
        <button class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">新建文档</span>
        </button>
      </div>
    </div>

    <!-- 文档分类 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="category in categories" :key="category.title" class="rounded-lg border bg-card p-4">
        <div class="flex items-center gap-2">
          <div class="rounded-md bg-primary/10 p-2">
            <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="category.icon"></svg>
          </div>
          <h2 class="text-sm font-medium">{{ category.title }}</h2>
        </div>
        <div class="mt-3 space-y-2">
          <a v-for="doc in category.docs" :key="doc.title" :href="doc.url" class="block rounded-md px-2 py-1.5 text-xs hover:bg-muted/50">
            {{ doc.title }}
          </a>
        </div>
      </div>
    </div>

    <!-- 最近更新 -->
    <div class="rounded-lg border bg-card">
      <div class="border-b p-3">
        <h2 class="text-sm font-medium">最近更新</h2>
      </div>
      <div class="divide-y">
        <div v-for="update in recentUpdates" :key="update.id" class="p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{{ update.category }}</span>
              <span class="text-xs font-medium">{{ update.title }}</span>
            </div>
            <span class="text-[10px] text-muted-foreground">{{ update.date }}</span>
          </div>
          <div class="mt-1 text-xs text-muted-foreground">{{ update.description }}</div>
          <div class="mt-2">
            <a :href="update.url" class="text-[10px] text-primary hover:underline">查看详情</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    title: '快速入门',
    icon: '<path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />',
    docs: [
      { title: '系统介绍', url: '/help/intro' },
      { title: '基础配置', url: '/help/setup' },
      { title: '常见问题', url: '/help/faq' }
    ]
  },
  {
    title: '功能指南',
    icon: '<path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />',
    docs: [
      { title: '用户管理', url: '/help/users' },
      { title: '权限配置', url: '/help/permissions' },
      { title: '数据导入导出', url: '/help/data' }
    ]
  },
  {
    title: '高级特性',
    icon: '<path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />',
    docs: [
      { title: '自定义配置', url: '/help/custom' },
      { title: 'API接口', url: '/help/api' },
      { title: '性能优化', url: '/help/performance' }
    ]
  }
])

const recentUpdates = ref([
  {
    id: 1,
    category: '功能更新',
    title: '新增批量导出功能',
    description: '用户管理模块新增批量导出功能，支持多种格式导出。',
    date: '2024-02-01',
    url: '/help/updates/export'
  },
  {
    id: 2,
    category: '文档更新',
    title: 'API文档更新',
    description: '更新了API接口文档，新增了多个接口的使用说明。',
    date: '2024-01-28',
    url: '/help/updates/api'
  }
])
</script> 