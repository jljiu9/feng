<!-- Dashboard.vue -->
<template>
  <div class="space-y-4">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium md:text-xl">数据概览</h1>
      <div class="flex items-center gap-2">
        <!-- 时间范围选择器 -->
        <div class="relative">
          <button 
            class="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-muted/50"
            @click="showDatePicker = !showDatePicker"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDateRange }}</span>
          </button>
          <!-- 日期选择弹出框 -->
          <div v-if="showDatePicker" class="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border bg-card p-4 shadow-lg">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <button 
                  v-for="range in quickRanges" 
                  :key="range.value"
                  class="rounded px-2 py-1 text-xs hover:bg-muted"
                  :class="{ 'bg-primary text-primary-foreground': selectedRange === range.value }"
                  @click="selectQuickRange(range.value)"
                >
                  {{ range.label }}
                </button>
              </div>
              <div class="flex gap-2">
                <input 
                  type="date" 
                  v-model="dateRange.start"
                  class="flex-1 rounded-md border px-2 py-1 text-xs"
                />
                <span class="text-xs text-muted-foreground">至</span>
                <input 
                  type="date" 
                  v-model="dateRange.end"
                  class="flex-1 rounded-md border px-2 py-1 text-xs"
                />
              </div>
              <div class="flex justify-end gap-2">
                <button 
                  class="rounded px-2 py-1 text-xs hover:bg-muted"
                  @click="showDatePicker = false"
                >
                  取消
                </button>
                <button 
                  class="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                  @click="applyDateRange"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 导出按钮 -->
        <button 
          class="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-muted/50"
          @click="exportData"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出报表</span>
        </button>
        
        <!-- 原有的按钮 -->
        <button class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs transition-colors hover:bg-muted/80">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 4v16M3 12h18m0-8H3m18 16H3" />
          </svg>
          <span class="hidden sm:inline">筛选数据</span>
        </button>
        <button class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">添加看板</span>
        </button>
      </div>
    </div>

    <!-- 欢迎消息和快捷操作 -->
    <div class="mb-6 rounded-lg border bg-card p-4">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-medium">{{ greeting }}，管理员</h2>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{{ timeState }}</span>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">今天是 {{ currentDate }}，{{ weatherTip }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            v-for="action in quickActions" 
            :key="action.label"
            class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-all hover:bg-muted/50 hover:shadow-sm"
            @click="action.onClick"
          >
            <component :is="action.icon" class="size-3.5" />
            {{ action.label }}
          </button>
        </div>
      </div>
      
      <!-- 任务提醒 -->
      <div class="mt-4 flex items-center gap-4 rounded-md bg-muted/50 p-3" v-if="hasTasks">
        <svg class="size-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <span class="text-sm">您有 {{ pendingTasks }} 个待处理事项</span>
          <div class="mt-1 flex gap-2">
            <span 
              v-for="task in tasks" 
              :key="task.id" 
              class="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs"
            >
              <span class="size-1.5 rounded-full" :class="task.color"></span>
              {{ task.label }}
            </span>
          </div>
        </div>
        <button class="rounded-md bg-background px-3 py-1.5 text-xs transition-all hover:bg-muted">
          查看详情
        </button>
      </div>
    </div>

    <!-- 数据卡片网格 -->
    <TransitionGroup 
      tag="div"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-4"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-4"
    >
      <!-- 用户统计 -->
      <div 
        class="group rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="flex items-center gap-2">
          <svg class="size-4 text-primary transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h2 class="text-sm font-medium">日活用户</h2>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-2xl font-semibold">{{ formatNumber(stats.activeUsers) }}</span>
          <span class="text-xs text-muted-foreground">人</span>
        </div>
        <div class="mt-2 flex items-center gap-1 text-[10px]" :class="getGrowthClass(stats.userGrowth)">
          <svg v-if="stats.userGrowth > 0" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          <svg v-else class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l5.94-2.28m-5.94 2.28l-2.28 5.941" />
          </svg>
          <span>环比{{ stats.userGrowth > 0 ? '增长' : '下降' }} {{ Math.abs(stats.userGrowth) }}%</span>
        </div>
      </div>

      <!-- 访问统计 -->
      <div 
        class="group rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="flex items-center gap-2">
          <svg class="size-4 text-primary transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <h2 class="text-sm font-medium">今日访问</h2>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-2xl font-semibold">{{ formatNumber(stats.visits) }}</span>
          <span class="text-xs text-muted-foreground">次</span>
        </div>
        <div class="mt-2 flex items-center gap-1 text-[10px]" :class="getGrowthClass(stats.visitGrowth)">
          <span>环比{{ stats.visitGrowth > 0 ? '增长' : '下降' }} {{ Math.abs(stats.visitGrowth) }}%</span>
        </div>
      </div>

      <!-- 转化率 -->
      <div 
        class="group rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="flex items-center gap-2">
          <svg class="size-4 text-primary transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          <h2 class="text-sm font-medium">转化率</h2>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-2xl font-semibold">{{ stats.conversionRate.toFixed(1) }}</span>
          <span class="text-xs text-muted-foreground">%</span>
        </div>
        <div class="mt-2 flex items-center gap-1 text-[10px]" :class="getGrowthClass(stats.conversionGrowth)">
          <span>环比{{ stats.conversionGrowth > 0 ? '增长' : '下降' }} {{ Math.abs(stats.conversionGrowth) }}%</span>
        </div>
      </div>

      <!-- 系统状态 -->
      <div 
        class="group rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="flex items-center gap-2">
          <svg class="size-4 text-primary transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <h2 class="text-sm font-medium">系统状态</h2>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-2xl font-semibold">{{ stats.systemStatus.toFixed(1) }}</span>
          <span class="text-xs text-muted-foreground">%</span>
        </div>
        <div class="mt-2 text-[10px] text-muted-foreground">
          运行时长 {{ formatUptime(stats.uptime) }}
        </div>
      </div>
    </TransitionGroup>

    <!-- 图表区域 -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- 趋势图表 -->
      <div 
        class="rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-medium">访问趋势</h3>
          <div class="flex items-center gap-2">
            <select 
              v-model="trendTimeRange" 
              class="rounded-md border bg-transparent px-2 py-1 text-xs transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              @change="refreshTrendData"
            >
              <option value="7">最近7天</option>
              <option value="30">最近30天</option>
              <option value="90">最近3个月</option>
            </select>
            <button 
              class="rounded-md p-1 transition-all hover:bg-muted/50 active:scale-95" 
              @click="refreshTrendData"
              :disabled="isRefreshing"
            >
              <svg 
                class="size-3.5 transition-transform duration-500" 
                :class="{ 'animate-spin': isRefreshing }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>
        <div class="relative h-[200px] w-full">
          <div 
            v-if="isLoading" 
            class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          >
            <div class="flex items-center gap-2">
              <svg class="size-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span class="text-xs text-muted-foreground">加载中...</span>
            </div>
          </div>
          <div ref="trendChartRef" class="h-full w-full"></div>
        </div>
      </div>

      <!-- 分布图表 -->
      <div 
        class="rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-medium">用户分布</h3>
          <div class="flex items-center gap-2">
            <select v-model="distributionType" class="rounded-md border bg-transparent px-2 py-1 text-xs" @change="refreshDistributionData">
              <option value="region">地区分布</option>
              <option value="device">设备分布</option>
              <option value="source">来源分布</option>
            </select>
            <button class="rounded-md p-1 hover:bg-muted/50" @click="refreshDistributionData">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>
        <div class="h-[200px] w-full" ref="distributionChartRef"></div>
      </div>

      <!-- 用户行为分析图表 -->
      <div 
        class="rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-medium">用户行为分析</h3>
          <div class="flex items-center gap-2">
            <select v-model="behaviorMetric" class="rounded-md border bg-transparent px-2 py-1 text-xs" @change="refreshBehaviorData">
              <option value="pageViews">页面浏览</option>
              <option value="timeSpent">停留时长</option>
              <option value="bounceRate">跳出率</option>
            </select>
          </div>
        </div>
        <div class="h-[200px] w-full" ref="behaviorChartRef"></div>
      </div>

      <!-- 实时监控图表 -->
      <div 
        class="rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md"
        :class="{ 'animate-pulse': isLoading }"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-medium">实时监控</h3>
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1 text-xs text-success">
              <span class="size-1.5 rounded-full bg-success"></span>
              在线监控中
            </span>
          </div>
        </div>
        <div class="h-[200px] w-full" ref="realtimeChartRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent } from 'vue'
import * as echarts from 'echarts'

// 状态
const isLoading = ref(true)
const isRefreshing = ref(false)
const stats = ref({
  activeUsers: 2345,
  userGrowth: 12,
  visits: 89123,
  visitGrowth: 23,
  conversionRate: 15.8,
  conversionGrowth: 5.2,
  systemStatus: 98.2,
  uptime: 99.9
})

// 欢迎消息相关
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})

const timeState = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '深夜值守'
  if (hour < 9) return '早班打卡'
  if (hour < 12) return '上午工作'
  if (hour < 14) return '午间休息'
  if (hour < 17) return '下午工作'
  if (hour < 19) return '加班冲刺'
  return '夜间值班'
})

const currentDate = computed(() => {
  const date = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
})

const weatherTip = computed(() => {
  const tips = [
    '天气晴朗，适合外出考察',
    '微风和煦，工作效率++',
    '小雨淅沥，记得带伞哦',
    '艳阳高照，记得防晒',
    '温度适宜，是个好日子'
  ]
  return tips[Math.floor(Math.random() * tips.length)]
})

// 快捷操作
const quickActions = [
  {
    label: '系统设置',
    icon: defineComponent({
      template: `
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      `
    }),
    onClick: () => {
      // 实现系统设置跳转
    }
  },
  {
    label: '数据备份',
    icon: defineComponent({
      template: `
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      `
    }),
    onClick: () => {
      // 实现数据备份
    }
  },
  {
    label: '清理缓存',
    icon: defineComponent({
      template: `
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `
    }),
    onClick: () => {
      // 实现缓存清理
    }
  }
]

// 任务提醒
const tasks = ref([
  { id: 1, label: '待审核订单 (3)', color: 'bg-blue-500' },
  { id: 2, label: '库存预警 (2)', color: 'bg-yellow-500' },
  { id: 3, label: '客户反馈 (5)', color: 'bg-red-500' }
])

const hasTasks = computed(() => tasks.value.length > 0)
const pendingTasks = computed(() => tasks.value.reduce((sum, task) => sum + Number(task.label.match(/\d+/)[0]), 0))

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 格式化运行时间
const formatUptime = (uptime) => {
  const days = Math.floor(uptime / (24 * 60))
  const hours = Math.floor((uptime % (24 * 60)) / 60)
  const minutes = Math.floor(uptime % 60)
  return `${days}天${hours}小时${minutes}分钟`
}

// 获取增长率的样式
const getGrowthClass = (growth) => {
  if (growth > 0) {
    return 'text-success'
  } else if (growth < 0) {
    return 'text-destructive'
  }
  return 'text-muted-foreground'
}

// 图表配置
const trendTimeRange = ref('7')
const distributionType = ref('region')
const trendChartRef = ref(null)
const distributionChartRef = ref(null)

// 图表实例
let trendChart = null
let distributionChart = null

// 日期选择器状态
const showDatePicker = ref(false)
const dateRange = ref({
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})
const selectedRange = ref('7d')

// 快速时间范围选项
const quickRanges = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '上季度', value: 'quarter' }
]

// 格式化日期范围显示
const formatDateRange = computed(() => {
  const start = new Date(dateRange.value.start)
  const end = new Date(dateRange.value.end)
  return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
})

// 选择快速时间范围
const selectQuickRange = (range) => {
  selectedRange.value = range
  const now = new Date()
  let start = new Date()
  
  switch (range) {
    case 'today':
      start = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'week':
      start = new Date(now.setDate(now.getDate() - now.getDay()))
      break
    case 'month':
      start = new Date(now.setDate(1))
      break
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      start = new Date(now.setMonth(quarter * 3, 1))
      break
  }
  
  dateRange.value = {
    start: start.toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }
}

// 应用日期范围
const applyDateRange = () => {
  showDatePicker.value = false
  refreshAllData()
}

// 导出数据
const exportData = async () => {
  try {
    const XLSX = await import('xlsx')
    
    // 准备导出数据
    const data = [
      {
        指标: '日活用户',
        数值: stats.value.activeUsers,
        环比: `${stats.value.userGrowth}%`,
        日期范围: formatDateRange.value
      },
      {
        指标: '访问量',
        数值: stats.value.visits,
        环比: `${stats.value.visitGrowth}%`,
        日期范围: formatDateRange.value
      },
      {
        指标: '转化率',
        数值: `${stats.value.conversionRate}%`,
        环比: `${stats.value.conversionGrowth}%`,
        日期范围: formatDateRange.value
      }
    ]
    
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '数据概览')
    
    // 设置列宽
    ws['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 20 }
    ]
    
    // 导出文件
    XLSX.writeFile(wb, `数据概览_${formatDateRange.value}.xlsx`)
    
    actions.addNotification({
      type: 'success',
      message: '导出成功'
    })
  } catch (error) {
    console.error('Export error:', error)
    actions.addNotification({
      type: 'error',
      message: '导出失败'
    })
  }
}

// 用户行为分析图表
const behaviorMetric = ref('pageViews')
const behaviorChartRef = ref(null)
let behaviorChart = null

// 实时监控图表
const realtimeChartRef = ref(null)
let realtimeChart = null
const realtimeData = ref([])
const maxRealtimePoints = 20

// 初始化所有图表
const initCharts = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  trendChart = echarts.init(trendChartRef.value)
  distributionChart = echarts.init(distributionChartRef.value)
  behaviorChart = echarts.init(behaviorChartRef.value)
  realtimeChart = echarts.init(realtimeChartRef.value)
  
  await Promise.all([
    refreshTrendData(),
    refreshDistributionData(),
    refreshBehaviorData(),
    initRealtimeData()
  ])
  
  isLoading.value = false
}

// 刷新趋势数据
const refreshTrendData = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderWidth: 0,
        textStyle: {
          color: '#fff'
        },
        formatter: (params) => {
          const date = params[0].name
          let result = `<div class="font-medium">${date}</div>`
          params.forEach(param => {
            result += `<div class="flex justify-between gap-4">
              <span>${param.seriesName}:</span>
              <span class="font-medium">${formatNumber(param.value)}</span>
            </div>`
          })
          return result
        }
      },
      grid: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          name: '访问量',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          symbolSize: 8,
          itemStyle: {
            color: '#2563eb'
          },
          lineStyle: {
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(37, 99, 235, 0.2)'
              },
              {
                offset: 1,
                color: 'rgba(37, 99, 235, 0)'
              }
            ])
          }
        }
      ]
    }
    trendChart?.setOption(option)
  } finally {
    isRefreshing.value = false
  }
}

// 刷新分布数据
const refreshDistributionData = () => {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 4
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%'
        },
        data: [
          { value: 1048, name: '华东地区' },
          { value: 735, name: '华北地区' },
          { value: 580, name: '华南地区' },
          { value: 484, name: '西南地区' },
          { value: 300, name: '其他地区' }
        ]
      }
    ]
  }
  distributionChart?.setOption(option)
}

// 刷新用户行为数据
const refreshBehaviorData = async () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 40,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['首页', '列表页', '详情页', '购物车', '结算页', '支付页', '个人中心']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: [320, 302, 301, 334, 390, 330, 320],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2563eb' },
            { offset: 1, color: '#3b82f6' }
          ])
        }
      }
    ]
  }
  behaviorChart?.setOption(option)
}

// 初始化实时数据
const initRealtimeData = async () => {
  // 初始化实时数据
  for (let i = 0; i < maxRealtimePoints; i++) {
    realtimeData.value.push({
      time: new Date(Date.now() - (maxRealtimePoints - i) * 1000),
      value: Math.floor(Math.random() * 100)
    })
  }
  
  // 设置实时图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0].data
        return `${data[0].toLocaleTimeString()}<br/>在线用户：${data[1]}`
      }
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 40,
      containLabel: true
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: realtimeData.value.map(item => [item.time, item.value]),
        lineStyle: {
          color: '#10b981'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0)' }
          ])
        }
      }
    ]
  }
  realtimeChart?.setOption(option)
  
  // 启动实时更新
  startRealtimeUpdate()
}

// 实时数据更新
const startRealtimeUpdate = () => {
  setInterval(() => {
    const now = new Date()
    realtimeData.value.push({
      time: now,
      value: Math.floor(Math.random() * 100)
    })
    
    if (realtimeData.value.length > maxRealtimePoints) {
      realtimeData.value.shift()
    }
    
    realtimeChart?.setOption({
      series: [{
        data: realtimeData.value.map(item => [item.time, item.value])
      }]
    })
  }, 1000)
}

// 刷新所有数据
const refreshAllData = async () => {
  isLoading.value = true
  await Promise.all([
    refreshTrendData(),
    refreshDistributionData(),
    refreshBehaviorData()
  ])
  isLoading.value = false
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  distributionChart?.resize()
  behaviorChart?.resize()
  realtimeChart?.resize()
}

// 生命周期钩子
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  distributionChart?.dispose()
  behaviorChart?.dispose()
  realtimeChart?.dispose()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 图表加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 添加日期选择器样式 */
.date-picker-enter-active,
.date-picker-leave-active {
  transition: all 0.2s ease;
}

.date-picker-enter-from,
.date-picker-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 添加实时监控样式 */
@keyframes pulse-dot {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

.pulse-dot {
  animation: pulse-dot 1.5s ease-in-out infinite;
}

/* 添加新的动画效果 */
.welcome-enter-active,
.welcome-leave-active {
  transition: all 0.3s ease;
}

.welcome-enter-from,
.welcome-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 任务提醒动画 */
@keyframes taskBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.task-bounce {
  animation: taskBounce 2s ease-in-out infinite;
}

/* 快捷操作按钮动画 */
.action-button {
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:active {
  transform: translateY(0);
}

/* 天气图标动画 */
@keyframes weatherFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.weather-icon {
  animation: weatherFloat 3s ease-in-out infinite;
}
</style> 