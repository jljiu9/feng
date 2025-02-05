<!-- Feedback.vue -->
<template>
  <div class="space-y-4">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium md:text-xl">问题反馈</h1>
      <button class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90">
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 4v16m8-8H4" />
        </svg>
        <span class="hidden sm:inline">新建反馈</span>
      </button>
    </div>

    <!-- 反馈表单 -->
    <div class="rounded-lg border bg-card">
      <div class="border-b p-3">
        <h2 class="text-sm font-medium">提交反馈</h2>
      </div>
      <div class="p-4 space-y-4">
        <!-- 问题类型 -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium">问题类型</label>
          <select class="w-full rounded-md border bg-transparent px-3 py-1.5 text-xs">
            <option>功能建议</option>
            <option>Bug反馈</option>
            <option>使用咨询</option>
            <option>其他问题</option>
          </select>
        </div>

        <!-- 标题 -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium">标题</label>
          <input type="text" class="w-full rounded-md border bg-transparent px-3 py-1.5 text-xs" placeholder="请输入问题标题" />
        </div>

        <!-- 描述 -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium">描述</label>
          <textarea class="w-full rounded-md border bg-transparent px-3 py-1.5 text-xs" rows="4" placeholder="请详细描述您的问题"></textarea>
        </div>

        <!-- 截图上传 -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium">截图（可选）</label>
          <div class="flex items-center gap-2">
            <button class="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-muted/50">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7m5 2v3a1 1 0 001 1h3M9 19v-6m3 3H6" />
              </svg>
              <span>上传图片</span>
            </button>
            <span class="text-[10px] text-muted-foreground">支持 jpg、png、gif 格式，最大 2MB</span>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium">联系方式（可选）</label>
          <input type="text" class="w-full rounded-md border bg-transparent px-3 py-1.5 text-xs" placeholder="请输入您的联系方式，方便我们及时回复" />
        </div>

        <!-- 提交按钮 -->
        <div class="flex items-center justify-end gap-2">
          <button class="rounded-md px-3 py-1.5 text-xs hover:bg-muted/50">取消</button>
          <button class="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">提交反馈</button>
        </div>
      </div>
    </div>

    <!-- 反馈记录 -->
    <div class="rounded-lg border bg-card">
      <div class="border-b p-3">
        <h2 class="text-sm font-medium">反馈记录</h2>
      </div>
      <div class="divide-y">
        <div v-for="record in feedbackRecords" :key="record.id" class="p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{{ record.type }}</span>
              <span class="text-xs font-medium">{{ record.title }}</span>
            </div>
            <span class="text-[10px] text-muted-foreground">{{ record.date }}</span>
          </div>
          <div class="mt-1 text-xs text-muted-foreground">{{ record.content }}</div>
          <div class="mt-2 flex items-center gap-2">
            <span class="rounded-full bg-muted px-2 py-0.5 text-[10px]">{{ record.status }}</span>
            <button class="text-[10px] text-primary hover:underline">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const feedbackRecords = ref([
  {
    id: 1,
    type: '功能建议',
    title: '希望添加批量导出功能',
    content: '建议在用户列表页面添加批量导出功能，方便数据处理。',
    date: '2024-02-01',
    status: '处理中'
  },
  {
    id: 2,
    type: 'Bug反馈',
    title: '数据展示异常',
    content: '在统计图表中，部分数据显示不正确。',
    date: '2024-01-28',
    status: '已解决'
  }
])
</script> 