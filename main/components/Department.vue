<!-- Department.vue -->
<template>
  <div class="space-y-4">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button class="rounded-md p-1 hover:bg-muted/50" @click="$router.back()">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-lg font-medium md:text-xl">{{ department.name }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span class="hidden sm:inline">导出</span>
        </button>
        <button class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">添加成员</span>
        </button>
      </div>
    </div>

    <!-- 部门信息卡片 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border bg-card p-3">
        <div class="text-xs text-muted-foreground">部门ID</div>
        <div class="mt-1 font-medium">{{ department.id }}</div>
      </div>
      <div class="rounded-lg border bg-card p-3">
        <div class="text-xs text-muted-foreground">创建时间</div>
        <div class="mt-1 font-medium">{{ department.createTime }}</div>
      </div>
      <div class="rounded-lg border bg-card p-3">
        <div class="text-xs text-muted-foreground">部门主管</div>
        <div class="mt-1 font-medium">{{ department.manager }}</div>
      </div>
      <div class="rounded-lg border bg-card p-3">
        <div class="text-xs text-muted-foreground">成员数量</div>
        <div class="mt-1 font-medium">{{ department.memberCount }} 人</div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <button class="flex items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-muted/50">
        <div class="rounded-md bg-primary/10 p-2">
          <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium">成员管理</div>
          <div class="text-xs text-muted-foreground">管理部门成员和权限</div>
        </div>
      </button>
      <button class="flex items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-muted/50">
        <div class="rounded-md bg-primary/10 p-2">
          <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium">部门设置</div>
          <div class="text-xs text-muted-foreground">配置部门基本信息</div>
        </div>
      </button>
      <button class="flex items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-muted/50">
        <div class="rounded-md bg-primary/10 p-2">
          <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium">导出报表</div>
          <div class="text-xs text-muted-foreground">导出部门相关报表</div>
        </div>
      </button>
    </div>

    <!-- 成员列表 -->
    <div class="rounded-lg border bg-card">
      <div class="border-b p-3">
        <h2 class="text-sm font-medium">部门成员</h2>
      </div>
      <div class="divide-y">
        <div v-for="member in department.members" :key="member.id" class="flex items-center justify-between p-3">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ member.name.charAt(0) }}
              </span>
            </div>
            <div>
              <div class="text-sm font-medium">{{ member.name }}</div>
              <div class="text-xs text-muted-foreground">{{ member.position }}</div>
            </div>
          </div>
          <button class="rounded-md p-1 hover:bg-muted/50">
            <svg class="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const department = ref({
  id: 'DEPT-001',
  name: '技术部',
  createTime: '2024-01-01',
  manager: '张三',
  memberCount: 12,
  members: [
    { id: 1, name: '张三', position: '部门主管' },
    { id: 2, name: '李四', position: '高级工程师' },
    { id: 3, name: '王五', position: '工程师' },
  ]
})
</script> 