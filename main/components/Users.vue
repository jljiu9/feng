<!-- Users.vue -->
<template>
  <div class="space-y-3">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-medium">用户管理</h2>
        <!-- 数据统计卡片 -->
        <div class="flex items-center gap-3">
          <div class="rounded-lg border border-border bg-card px-3 py-2">
            <div class="flex items-center gap-2">
              <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
              </svg>
              <div>
                <div class="text-xs text-muted-foreground">总用户</div>
                <div class="text-sm font-medium">{{ totalUsers }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-border bg-card px-3 py-2">
            <div class="flex items-center gap-2">
              <svg class="size-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <div>
                <div class="text-xs text-muted-foreground">活跃用户</div>
                <div class="text-sm font-medium">{{ activeUsers }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-border bg-card px-3 py-2">
            <div class="flex items-center gap-2">
              <svg class="size-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              <div>
                <div class="text-xs text-muted-foreground">未激活</div>
                <div class="text-sm font-medium">{{ inactiveUsers }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-border bg-card px-3 py-2">
            <div class="flex items-center gap-2">
              <svg class="size-4 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M15 9l-6 6"></path>
                <path d="M9 9l6 6"></path>
              </svg>
              <div>
                <div class="text-xs text-muted-foreground">已封禁</div>
                <div class="text-sm font-medium">{{ blockedUsers }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- 导入导出按钮 -->
        <div class="relative" v-click-outside="() => (dropdowns.export = false)">
          <button
            class="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-muted/50"
            @click="dropdowns.export = !dropdowns.export"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            导入/导出
          </button>
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div 
              v-show="dropdowns.export"
              class="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[120px] rounded-md border border-border bg-background p-1 shadow-md"
            >
              <button
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"
                @click="handleImport"
              >
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                导入用户
              </button>
              <button
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"
                @click="handleExportExcel"
              >
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 12h8" />
                  <path d="M8 16h8" />
                  <path d="M8 20h8" />
                </svg>
                导出数据
              </button>
              <button
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"
                @click="handleExportTemplate"
              >
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                下载模板
              </button>
            </div>
          </Transition>
        </div>
        <button
          class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          @click="openUserForm('create')"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新增用户
        </button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="rounded-md border border-border bg-card">
      <div class="p-3">
        <div class="flex items-center gap-3">
          <!-- 批量操作 -->
          <div class="flex items-center gap-2">
            <span 
              class="whitespace-nowrap text-xs"
              :class="[
                selectedUsers.size > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
              ]"
            >
              {{ selectedUsers.size > 0 ? `已选择 ${selectedUsers.size} 项` : '未选择' }}
            </span>
            <div class="h-4 w-px bg-border"></div>
            <button
              class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              :class="{ 'scale-105': selectedUsers.size > 0 }"
              :disabled="selectedUsers.size === 0"
              @click="handleBatchAction('delete')"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              删除
            </button>
            <button
              class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-primary/10 disabled:opacity-50 disabled:hover:bg-transparent"
              :disabled="selectedUsers.size === 0"
              @click="handleBatchAction('activate')"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              激活
            </button>
            <button
              class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-warning hover:bg-warning/10 disabled:opacity-50 disabled:hover:bg-transparent"
              :disabled="selectedUsers.size === 0"
              @click="handleBatchAction('block')"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              封禁
            </button>
            <div class="h-4 w-px bg-border"></div>
          </div>

          <!-- 搜索框 -->
          <div class="relative flex-1">
            <svg 
              class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索用户..."
              class="w-full rounded-md border border-input bg-background pl-9 pr-16 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                v-if="searchQuery"
                class="rounded-full p-1 hover:bg-muted text-muted-foreground"
                @click="clearSearch"
              >
                <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                v-if="searchQuery"
                class="rounded-md px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                @click="handleServerSearch"
              >
                搜索
              </button>
            </div>
          </div>

          <!-- 过滤器 -->
          <div class="flex items-center gap-2">
            <!-- 角色选择 -->
            <div class="relative" v-click-outside="() => (dropdowns.role = false)">
              <button
                class="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted/50"
                :class="{ 'border-primary': dropdowns.role }"
                @click="dropdowns.role = !dropdowns.role"
              >
                <span class="text-muted-foreground">角色:</span>
                <span :class="{ 'text-primary font-medium': filters.role }">
                  {{ filters.role ? roleLabels[filters.role] : '全部' }}
                </span>
                <svg 
                  class="size-3.5 text-muted-foreground transition-transform duration-200"
                  :class="{ 'rotate-180': dropdowns.role }"
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div 
                  v-show="dropdowns.role"
                  class="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[120px] rounded-md border border-border bg-background p-1 shadow-md"
                >
                  <button
                    v-for="(label, value) in roleLabels"
                    :key="value"
                    class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"
                    :class="{ 'bg-muted': filters.role === value }"
                    @click="handleFilterChange('role', value)"
                  >
                    <svg 
                      v-if="filters.role === value"
                      class="size-3.5" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else class="size-3.5"></span>
                    {{ label }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- 状态选择 -->
            <div class="relative" v-click-outside="() => (dropdowns.status = false)">
              <button
                class="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted/50"
                :class="{ 'border-primary': dropdowns.status }"
                @click="dropdowns.status = !dropdowns.status"
              >
                <span class="text-muted-foreground">状态:</span>
                <span :class="{ 'text-primary font-medium': filters.status }">
                  {{ filters.status ? statusLabels[filters.status] : '全部' }}
                </span>
                <svg 
                  class="size-3.5 text-muted-foreground transition-transform duration-200"
                  :class="{ 'rotate-180': dropdowns.status }"
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div 
                  v-show="dropdowns.status"
                  class="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[120px] rounded-md border border-border bg-background p-1 shadow-md"
                >
                  <button
                    v-for="(label, value) in statusLabels"
                    :key="value"
                    class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"
                    :class="{ 'bg-muted': filters.status === value }"
                    @click="handleFilterChange('status', value)"
                  >
                    <svg 
                      v-if="filters.status === value"
                      class="size-3.5" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else class="size-3.5"></span>
                    {{ label }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="user-table-container rounded-md border border-border">
      <table class="w-full">
        <thead class="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/25">
          <tr class="border-b border-border">
            <th :style="{ width: `${columnWidths.checkbox}px` }" class="px-3 py-2">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
                class="size-3 rounded border-input"
              />
            </th>
            <th 
              :style="{ width: `${columnWidths.username}px` }"
              class="group relative px-3 py-2 text-left text-xs font-medium select-none"
            >
              <div class="flex items-center gap-1">
                <span 
                  class="cursor-pointer hover:text-primary"
                  @click="handleSort('username')"
                >
                  用户名
                </span>
                <div class="flex flex-col">
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'username' && sortState.direction === 'asc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4-4 4 4" />
                  </svg>
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'username' && sortState.direction === 'desc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                :class="[
                  isDragging && currentResizingColumn === 'username' ? 'bg-primary' : 'group-hover:bg-primary/20'
                ]"
                @mousedown.stop="handleColumnResize('username', $event)"
              ></div>
            </th>
            <th 
              :style="{ width: `${columnWidths.email}px` }"
              class="group relative px-3 py-2 text-left text-xs font-medium select-none"
            >
              <div class="flex items-center gap-1">
                <span 
                  class="cursor-pointer hover:text-primary"
                  @click="handleSort('email')"
                >
                  邮箱
                </span>
                <div class="flex flex-col">
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'email' && sortState.direction === 'asc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4-4 4 4" />
                  </svg>
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'email' && sortState.direction === 'desc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                :class="[
                  isDragging && currentResizingColumn === 'email' ? 'bg-primary' : 'group-hover:bg-primary/20'
                ]"
                @mousedown.stop="handleColumnResize('email', $event)"
              ></div>
            </th>
            <th 
              :style="{ width: `${columnWidths.role}px` }"
              class="group relative px-3 py-2 text-left text-xs font-medium select-none"
            >
              <div class="flex items-center gap-1">
                <span 
                  class="cursor-pointer hover:text-primary"
                  @click="handleSort('role')"
                >
                  角色
                </span>
                <div class="flex flex-col">
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'role' && sortState.direction === 'asc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4-4 4 4" />
                  </svg>
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'role' && sortState.direction === 'desc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                :class="[
                  isDragging && currentResizingColumn === 'role' ? 'bg-primary' : 'group-hover:bg-primary/20'
                ]"
                @mousedown.stop="handleColumnResize('role', $event)"
              ></div>
            </th>
            <th 
              :style="{ width: `${columnWidths.status}px` }"
              class="group relative px-3 py-2 text-left text-xs font-medium select-none"
            >
              <div class="flex items-center gap-1">
                <span 
                  class="cursor-pointer hover:text-primary"
                  @click="handleSort('status')"
                >
                  状态
                </span>
                <div class="flex flex-col">
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'status' && sortState.direction === 'asc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4-4 4 4" />
                  </svg>
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'status' && sortState.direction === 'desc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                :class="[
                  isDragging && currentResizingColumn === 'status' ? 'bg-primary' : 'group-hover:bg-primary/20'
                ]"
                @mousedown.stop="handleColumnResize('status', $event)"
              ></div>
            </th>
            <th 
              :style="{ width: `${columnWidths.createdAt}px` }"
              class="group relative px-3 py-2 text-left text-xs font-medium select-none"
            >
              <div class="flex items-center gap-1">
                <span 
                  class="cursor-pointer hover:text-primary"
                  @click="handleSort('createdAt')"
                >
                  创建时间
                </span>
                <div class="flex flex-col">
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'createdAt' && sortState.direction === 'asc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4-4 4 4" />
                  </svg>
                  <svg 
                    class="size-2.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                    :class="[
                      sortState.field === 'createdAt' && sortState.direction === 'desc'
                        ? 'text-primary'
                        : 'text-muted-foreground/30'
                    ]"
                  >
                    <path d="M8 12l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                :class="[
                  isDragging && currentResizingColumn === 'createdAt' ? 'bg-primary' : 'group-hover:bg-primary/20'
                ]"
                @mousedown.stop="handleColumnResize('createdAt', $event)"
              ></div>
            </th>
            <th :style="{ width: `${columnWidths.actions}px` }" class="w-[80px] px-3 py-2 text-left text-xs font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" class="border-b border-border">
            <td colspan="7" class="px-3 py-6">
              <div class="flex items-center justify-center gap-2">
                <svg
                  class="size-4 animate-spin text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span class="text-xs text-muted-foreground">加载中...</span>
              </div>
            </td>
          </tr>
          <tr 
            v-for="user in filteredUsers" 
            :key="user.id"
            class="border-b border-border last:border-0 hover:bg-muted/50"
          >
            <td :style="{ width: `${columnWidths.checkbox}px` }" class="px-3 py-2">
              <input
                type="checkbox"
                :checked="selectedUsers.has(user.id)"
                @change="toggleSelect(user.id)"
                class="size-3 rounded border-input"
              />
            </td>
            <td :style="{ width: `${columnWidths.username}px` }" class="px-3 py-2">
              <div class="flex items-center gap-2 min-w-0">
                <img 
                  :src="user.avatar || '/default-avatar.png'" 
                  :alt="user.username"
                  class="size-6 rounded-full flex-shrink-0"
                />
                <span class="text-xs truncate min-w-0">{{ user.username }}</span>
              </div>
            </td>
            <td :style="{ width: `${columnWidths.email}px` }" class="px-3 py-2 min-w-0">
              <span class="text-xs block truncate">{{ user.email }}</span>
            </td>
            <td :style="{ width: `${columnWidths.role}px` }" class="px-3 py-2 min-w-0">
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap',
                  user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                ]"
              >
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td :style="{ width: `${columnWidths.status}px` }" class="px-3 py-2 min-w-0">
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap',
                  {
                    'bg-success/10 text-success': user.status === 'active',
                    'bg-warning/10 text-warning': user.status === 'inactive',
                    'bg-destructive/10 text-destructive': user.status === 'blocked'
                  }
                ]"
              >
                {{ {
                  active: '活跃',
                  inactive: '未激活',
                  blocked: '已封禁'
                }[user.status] }}
              </span>
            </td>
            <td :style="{ width: `${columnWidths.createdAt}px` }" class="px-3 py-2 min-w-0">
              <span class="text-xs text-muted-foreground truncate block">
                {{ new Date(user.createdAt).toLocaleString() }}
              </span>
            </td>
            <td :style="{ width: `${columnWidths.actions}px` }" class="px-3 py-2">
              <div class="flex items-center gap-1">
                <button
                  class="rounded-md p-1 text-muted-foreground hover:bg-muted flex-shrink-0"
                  @click="openUserForm('edit', user)"
                >
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  class="rounded-md p-1 text-destructive hover:bg-destructive/10 flex-shrink-0"
                  @click="handleDelete(user.id)"
                >
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="px-3 py-6 text-center text-xs text-muted-foreground">
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 text-xs text-muted-foreground">
        <span>共 {{ totalUsers }} 条记录</span>
        <div class="flex items-center gap-2">
          <span>每页</span>
          <select 
            v-model="pageSize" 
            class="rounded-md border border-input bg-background px-2 py-1 text-xs"
            @change="handlePageSizeChange"
          >
            <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          <span>条</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs disabled:opacity-50"
          @click="handlePageChange(1)"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <button
          :disabled="currentPage === 1"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs disabled:opacity-50"
          @click="handlePageChange(currentPage - 1)"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <div class="flex items-center gap-1">
          <template v-for="page in displayedPages" :key="page">
            <button
              v-if="page !== '...'"
              :class="[
                'min-w-[32px] rounded-md px-2 py-1 text-xs',
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              ]"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>
            <span 
              v-else 
              class="px-1 text-xs text-muted-foreground"
            >
              ...
            </span>
          </template>
        </div>

        <button
          :disabled="currentPage === totalPages"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs disabled:opacity-50"
          @click="handlePageChange(currentPage + 1)"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs disabled:opacity-50"
          @click="handlePageChange(totalPages)"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>

        <div class="flex items-center gap-1 pl-2">
          <span class="text-xs text-muted-foreground">前往</span>
          <input
            v-model="jumpPage"
            type="number"
            min="1"
            :max="totalPages"
            class="w-12 rounded-md border border-input bg-background px-1 py-1 text-center text-xs"
            @keyup.enter="handleJumpPage"
            @blur="handleJumpPage"
          />
          <span class="text-xs text-muted-foreground">页</span>
        </div>
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <dialog
      ref="userFormDialog"
      class="w-full max-w-lg rounded-lg border border-border bg-background p-0 backdrop:bg-foreground/10"
    >
      <div class="border-b border-border p-4">
        <h3 class="text-lg font-semibold">
          {{ formState.mode === 'create' ? '新增用户' : '编辑用户' }}
        </h3>
      </div>
      
      <form @submit.prevent="handleFormSubmit" class="space-y-4 p-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">用户名</label>
          <input
            v-model="formState.data.username"
            type="text"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm',
              formState.touched.username && formState.errors.username
                ? 'border-destructive'
                : 'border-input'
            ]"
            @blur="validateField('username')"
          />
          <p 
            v-if="formState.touched.username && formState.errors.username"
            class="text-xs text-destructive"
          >
            {{ formState.errors.username }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">邮箱</label>
          <input
            v-model="formState.data.email"
            type="email"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm',
              formState.touched.email && formState.errors.email
                ? 'border-destructive'
                : 'border-input'
            ]"
            @blur="validateField('email')"
          />
          <p 
            v-if="formState.touched.email && formState.errors.email"
            class="text-xs text-destructive"
          >
            {{ formState.errors.email }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">角色</label>
          <select
            v-model="formState.data.role"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm',
              formState.touched.role && formState.errors.role
                ? 'border-destructive'
                : 'border-input'
            ]"
            @blur="validateField('role')"
          >
            <option value="">请选择角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
          <p 
            v-if="formState.touched.role && formState.errors.role"
            class="text-xs text-destructive"
          >
            {{ formState.errors.role }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">状态</label>
          <select
            v-model="formState.data.status"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm',
              formState.touched.status && formState.errors.status
                ? 'border-destructive'
                : 'border-input'
            ]"
            @blur="validateField('status')"
          >
            <option value="">请选择状态</option>
            <option value="active">活跃</option>
            <option value="inactive">未激活</option>
            <option value="blocked">已封禁</option>
          </select>
          <p 
            v-if="formState.touched.status && formState.errors.status"
            class="text-xs text-destructive"
          >
            {{ formState.errors.status }}
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            class="rounded-md px-4 py-2 text-sm"
            @click="closeUserForm"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <svg
              v-if="isSubmitting"
              class="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ formState.mode === 'create' ? '创建' : '保存' }}
          </button>
        </div>
      </form>
    </dialog>

    <!-- 删除确认对话框 -->
    <dialog
      ref="deleteConfirmDialog"
      class="w-full max-w-sm rounded-lg border border-border bg-background p-0 backdrop:bg-foreground/10"
    >
      <div class="p-4">
        <h3 class="text-lg font-semibold">确认删除</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ isMultipleDelete 
            ? `确定要删除选中的 ${selectedUsers.size} 个用户吗？`
            : '确定要删除该用户吗？'
          }}
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            class="rounded-md px-4 py-2 text-sm"
            @click="closeDeleteConfirm"
          >
            取消
          </button>
          <button
            :disabled="isDeleting"
            class="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            @click="confirmDelete"
          >
            <svg
              v-if="isDeleting"
              class="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            确定删除
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useStore } from '../store'
import { useApi } from '../api'

const { actions } = useStore()
const { user: userApi } = useApi()

// 状态
const users = ref([])
const mockUserData = ref([]) // 模拟数据存储
const selectedUsers = ref(new Set())
const searchQuery = ref('')
const filters = ref({
  role: '',
  status: ''
})
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// 表单状态
const formState = ref({
  visible: false,
  mode: 'create',
  data: {
    username: '',
    email: '',
    role: '',
    status: ''
  },
  touched: {
    username: false,
    email: false,
    role: false,
    status: false
  },
  errors: {
    username: '',
    email: '',
    role: '',
    status: ''
  }
})

// 对话框引用
const userFormDialog = ref(null)
const deleteConfirmDialog = ref(null)
const deleteUserId = ref(null)

// 排序状态
const sortState = ref({
  field: 'createdAt',
  direction: 'desc'
})

// 列宽控制
const columnWidths = ref({
  checkbox: 40,
  username: 200,
  email: 250,
  role: 120,
  status: 120,
  createdAt: 180,
  actions: 80
})

// 拖动状态
const isDragging = ref(false)
const currentResizingColumn = ref(null)

// 下拉菜单状态
const dropdowns = ref({
  role: false,
  status: false,
  export: false
})

// 标签映射
const roleLabels = {
  '': '全部',
  'admin': '管理员',
  'user': '普通用户'
}

const statusLabels = {
  '': '全部',
  'active': '活跃',
  'inactive': '未激活',
  'blocked': '已封禁'
}

// 计算属性
const isAllSelected = computed(() => {
  return filteredUsers.value.length > 0 && 
    filteredUsers.value.every(user => selectedUsers.value.has(user.id))
})

const isIndeterminate = computed(() => {
  return selectedUsers.value.size > 0 && !isAllSelected.value
})

const isMultipleDelete = computed(() => selectedUsers.value.size > 0)

// 添加本地数据缓存
const localUserData = ref([])
const serverUserData = ref([])

// 添加用户统计计算属性
const activeUsers = computed(() => 
  mockUserData.value.filter(user => user.status === 'active').length
)

const inactiveUsers = computed(() => 
  mockUserData.value.filter(user => user.status === 'inactive').length
)

const blockedUsers = computed(() => 
  mockUserData.value.filter(user => user.status === 'blocked').length
)

// 添加导入导出方法
const handleImport = () => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      // 这里应该调用后端API上传文件
      // 模拟上传成功
      actions.addNotification({
        type: 'success',
        message: '文件上传成功，正在处理...'
      })
      
      // 模拟处理完成
      setTimeout(() => {
        actions.addNotification({
          type: 'success',
          message: '用户数据导入成功'
        })
        fetchUsers()
      }, 1500)
    } catch (error) {
      actions.addNotification({
        type: 'error',
        message: '导入失败'
      })
    }
  }
  
  input.click()
}

const handleExportExcel = async () => {
  try {
    const XLSX = await import('xlsx')
    
    // 格式化数据
    const data = mockUserData.value.map(user => ({
      用户名: user.username,
      邮箱: user.email,
      角色: roleLabels[user.role] || '',
      状态: statusLabels[user.status] || '',
      创建时间: new Date(user.createdAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }))
    
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '用户数据')
    
    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 用户名
      { wch: 25 }, // 邮箱
      { wch: 10 }, // 角色
      { wch: 10 }, // 状态
      { wch: 20 }  // 创建时间
    ]
    ws['!cols'] = colWidths
    
    // 设置表头样式
    const range = XLSX.utils.decode_range(ws['!ref'])
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: "EFEFEF" } }
    }
    
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C })
      if(!ws[address]) continue
      ws[address].s = headerStyle
    }
    
    // 导出文件
    XLSX.writeFile(wb, `用户数据_${new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[/:]/g, '')}.xlsx`)
    
    actions.addNotification({
      type: 'success',
      message: '导出成功'
    })
  } catch (error) {
    console.error('Export error:', error)
    actions.addNotification({
      type: 'error',
      message: '导出失败，请确保已安装 xlsx 依赖'
    })
  }
}

const handleExportTemplate = async () => {
  try {
    const XLSX = await import('xlsx')
    
    // 创建模板数据
    const template = [
      {
        用户名: '示例用户',
        邮箱: 'example@example.com',
        角色: '普通用户',
        状态: '未激活'
      }
    ]
    
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '导入模板')
    
    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 用户名
      { wch: 25 }, // 邮箱
      { wch: 10 }, // 角色
      { wch: 10 }  // 状态
    ]
    ws['!cols'] = colWidths
    
    // 设置表头样式
    const range = XLSX.utils.decode_range(ws['!ref'])
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: "EFEFEF" } }
    }
    
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C })
      if(!ws[address]) continue
      ws[address].s = headerStyle
    }
    
    // 导出文件
    XLSX.writeFile(wb, '用户导入模板.xlsx')
    
    actions.addNotification({
      type: 'success',
      message: '模板下载成功'
    })
  } catch (error) {
    console.error('Export template error:', error)
    actions.addNotification({
      type: 'error',
      message: '模板下载失败，请确保已安装 xlsx 依赖'
    })
  }
}

// 修改初始化方法
const initMockData = () => {
  const mockData = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    username: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 5 === 0 ? 'admin' : 'user',
    status: ['active', 'inactive', 'blocked'][index % 3],
    avatar: null,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString()
  }))
  mockUserData.value = mockData
  localUserData.value = mockData // 保存一份本地数据
}

const toggleSelect = (userId) => {
  if (selectedUsers.value.has(userId)) {
    selectedUsers.value.delete(userId)
  } else {
    selectedUsers.value.add(userId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value.clear()
  } else {
    filteredUsers.value.forEach(user => {
      selectedUsers.value.add(user.id)
    })
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const validateField = (field) => {
  formState.value.touched[field] = true
  formState.value.errors[field] = ''

  const value = formState.value.data[field]

  switch (field) {
    case 'username':
      if (!value) {
        formState.value.errors[field] = '请输入用户名'
      } else if (value.length < 2) {
        formState.value.errors[field] = '用户名至少2个字符'
      }
      break
    case 'email':
      if (!value) {
        formState.value.errors[field] = '请输入邮箱'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        formState.value.errors[field] = '请输入有效的邮箱地址'
      }
      break
    case 'role':
      if (!value) {
        formState.value.errors[field] = '请选择角色'
      }
      break
    case 'status':
      if (!value) {
        formState.value.errors[field] = '请选择状态'
      }
      break
  }

  return !formState.value.errors[field]
}

const validateForm = () => {
  const fields = ['username', 'email', 'role', 'status']
  return fields.every(field => validateField(field))
}

const openUserForm = (mode, user = null) => {
  formState.value = {
    visible: true,
    mode,
    data: user ? { ...user } : {
      username: '',
      email: '',
      role: '',
      status: ''
    },
    touched: {
      username: false,
      email: false,
      role: false,
      status: false
    },
    errors: {
      username: '',
      email: '',
      role: '',
      status: ''
    }
  }
  userFormDialog.value?.showModal()
}

const closeUserForm = () => {
  userFormDialog.value?.close()
}

const handleFormSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    
    if (formState.value.mode === 'create') {
      // 模拟创建用户
      const newUser = {
        ...formState.value.data,
        id: mockUserData.value.length + 1,
        createdAt: new Date().toISOString(),
        avatar: null
      }
      mockUserData.value.push(newUser)
      
      // 保留API调用代码（注释）
      // await userApi.createUser(formState.value.data)
      
      actions.addNotification({
        type: 'success',
        message: '创建用户成功'
      })
    } else {
      // 模拟更新用户
      const index = mockUserData.value.findIndex(u => u.id === formState.value.data.id)
      if (index !== -1) {
        mockUserData.value[index] = {
          ...mockUserData.value[index],
          ...formState.value.data
        }
      }
      
      // 保留API调用代码（注释）
      // await userApi.updateUser(formState.value.data.id, formState.value.data)
      
      actions.addNotification({
        type: 'success',
        message: '更新用户成功'
      })
    }

    closeUserForm()
    await fetchUsers() // 确保数据更新后重新获取
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: formState.value.mode === 'create' ? '创建用户失败' : '更新用户失败'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = (userId = null) => {
  deleteUserId.value = userId
  deleteConfirmDialog.value?.showModal()
}

const closeDeleteConfirm = () => {
  deleteConfirmDialog.value?.close()
  deleteUserId.value = null
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true

    if (deleteUserId.value) {
      // 模拟单个删除
      mockUserData.value = mockUserData.value.filter(user => user.id !== deleteUserId.value)
      
      // 保留API调用代码（注释）
      // await userApi.deleteUser(deleteUserId.value)
    } else {
      // 模拟批量删除
      mockUserData.value = mockUserData.value.filter(user => !selectedUsers.value.has(user.id))
      
      // 保留API调用代码（注释）
      // await userApi.batchUsers('delete', Array.from(selectedUsers.value))
      
      selectedUsers.value.clear()
    }

    actions.addNotification({
      type: 'success',
      message: '删除成功'
    })
    closeDeleteConfirm()
    await fetchUsers() // 确保数据更新后重新获取
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '删除失败'
    })
  } finally {
    isDeleting.value = false
  }
}

const handleBatchAction = async (action) => {
  if (selectedUsers.value.size === 0) return

  try {
    // 模拟批量操作
    const selectedIds = Array.from(selectedUsers.value)
    
    if (action === 'delete') {
      // 删除操作
      mockUserData.value = mockUserData.value.filter(user => !selectedIds.includes(user.id))
    } else {
      // 状态更新操作（激活/封禁）
      mockUserData.value = mockUserData.value.map(user => {
        if (selectedIds.includes(user.id)) {
          return {
            ...user,
            status: action === 'activate' ? 'active' : 'blocked'
          }
        }
        return user
      })
    }
    
    // 保留API调用代码（注释）
    // await userApi.batchUsers(action, Array.from(selectedUsers.value))
    
    actions.addNotification({
      type: 'success',
      message: {
        delete: '批量删除成功',
        activate: '批量激活成功',
        block: '批量封禁成功'
      }[action]
    })

    selectedUsers.value.clear()
    await fetchUsers() // 确保数据更新后重新获取
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '操作失败'
    })
  }
}

// 修改搜索相关方法
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  // 恢复使用本地数据
  mockUserData.value = localUserData.value
  fetchUsers()
}

// 添加服务器搜索方法
const handleServerSearch = async () => {
  try {
    isLoading.value = true
    // 这里模拟服务器搜索
    // 实际项目中这里应该调用API
    const searchResult = localUserData.value.filter(user => {
      const query = searchQuery.value.toLowerCase()
      return user.username.toLowerCase().includes(query) ||
             user.email.toLowerCase().includes(query)
    })
    mockUserData.value = searchResult
    serverUserData.value = searchResult // 保存服务器返回的数据
    currentPage.value = 1
    fetchUsers()
    
    actions.addNotification({
      type: 'success',
      message: '搜索完成'
    })
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '搜索失败'
    })
  } finally {
    isLoading.value = false
  }
}

// 修改计算属性
const filteredUsers = computed(() => {
  let result = users.value || []

  // 本地搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user?.username?.toLowerCase().includes(query) ||
      user?.email?.toLowerCase().includes(query)
    )
  }

  // 角色过滤
  if (filters.value?.role) {
    result = result.filter(user => user?.role === filters.value.role)
  }

  // 状态过滤
  if (filters.value?.status) {
    result = result.filter(user => user?.status === filters.value.status)
  }

  return result
})

// 添加 fetchUsers 方法
const fetchUsers = async () => {
  try {
    isLoading.value = true
    
    // 计算分页参数
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    // 获取排序后的数据
    let sortedData = [...mockUserData.value]
    if (sortState.value.field) {
      sortedData.sort((a, b) => {
        const aValue = a[sortState.value.field]
        const bValue = b[sortState.value.field]
        const modifier = sortState.value.direction === 'asc' ? 1 : -1
        
        if (sortState.value.field === 'createdAt') {
          return (new Date(aValue) - new Date(bValue)) * modifier
        }
        
        return aValue.localeCompare(bValue) * modifier
      })
    }
    
    // 应用过滤器
    if (filters.value.role) {
      sortedData = sortedData.filter(user => user.role === filters.value.role)
    }
    if (filters.value.status) {
      sortedData = sortedData.filter(user => user.status === filters.value.status)
    }
    
    // 更新总数和分页数据
    totalUsers.value = sortedData.length
    users.value = sortedData.slice(start, end)
    
    // 如果当前页码超出范围，重置为第一页
    if (currentPage.value > Math.ceil(totalUsers.value / pageSize.value)) {
      currentPage.value = 1
    }
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '获取用户列表失败'
    })
  } finally {
    isLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  initColumnWidths()
  initMockData()
  fetchUsers()
})

// 在 script setup 部分添加以下代码
const jumpPage = ref('')

// 计算要显示的页码
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 // 当前页码前后显示的页码数
  
  let pages = []
  
  // 总页数小于等于 5，显示所有页码
  if (total <= 5) {
    pages = Array.from({ length: total }, (_, i) => i + 1)
  } else {
    // 当前页靠近开始
    if (current <= delta + 1) {
      pages = [...Array.from({ length: delta * 2 + 1 }, (_, i) => i + 1), '...', total]
    }
    // 当前页靠近结束
    else if (current >= total - delta) {
      pages = [1, '...', ...Array.from({ length: delta * 2 + 1 }, (_, i) => total - delta * 2 + i)]
    }
    // 当前页在中间
    else {
      pages = [1, '...', ...Array.from({ length: delta * 2 + 1 }, (_, i) => current - delta + i), '...', total]
    }
  }
  
  return pages
})

// 处理页面大小变化
const handlePageSizeChange = () => {
  currentPage.value = 1 // 重置到第一页
  fetchUsers()
}

// 处理页码跳转
const handleJumpPage = () => {
  const page = parseInt(jumpPage.value)
  if (page && page >= 1 && page <= totalPages.value) {
    handlePageChange(page)
  }
  // 重置输入框的值为当前页码
  jumpPage.value = ''
}

// 在 script setup 中添加
const handleFilterChange = (type, value) => {
  filters.value[type] = value === '' ? '' : value
  dropdowns.value[type] = false
}

// 添加 v-click-outside 指令
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

// 修改排序处理方法
const handleSort = (field, event) => {
  // 如果正在拖动，不触发排序
  if (isDragging.value) return
  
  if (sortState.value.field === field) {
    // 如果点击的是当前排序字段，则切换排序方向
    sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // 如果点击的是新字段，则设置为降序
    sortState.value.field = field
    sortState.value.direction = 'desc'
  }
  fetchUsers()
}

// 添加计算属性
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

// 列宽调整方法
const handleColumnResize = (column, event) => {
  event.stopPropagation()
  isDragging.value = true
  currentResizingColumn.value = column
  const startX = event.clientX
  const startWidth = columnWidths.value[column]
  
  const handleMouseMove = (e) => {
    if (!isDragging.value) return
    const diff = e.clientX - startX
    columnWidths.value[column] = Math.max(50, startWidth + diff)
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    currentResizingColumn.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    // 保存列宽到本地存储
    localStorage.setItem('columnWidths', JSON.stringify(columnWidths.value))
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 初始化列宽
const initColumnWidths = () => {
  const savedWidths = localStorage.getItem('columnWidths')
  if (savedWidths) {
    try {
      const parsed = JSON.parse(savedWidths)
      columnWidths.value = {
        ...columnWidths.value,
        ...parsed
      }
    } catch (error) {
      console.error('Failed to parse saved column widths:', error)
    }
  }
}

// 添加防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 使用防抖处理窗口大小变化
const handleResize = debounce(() => {
  // 根据容器宽度调整列宽
  const container = document.querySelector('.user-table-container')
  if (container) {
    const availableWidth = container.clientWidth
    const totalWidth = Object.values(columnWidths.value).reduce((a, b) => a + b, 0)
    const ratio = availableWidth / totalWidth
    
    if (ratio !== 1) {
      Object.keys(columnWidths.value).forEach(key => {
        columnWidths.value[key] = Math.max(50, Math.floor(columnWidths.value[key] * ratio))
      })
    }
  }
}, 200)

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 基础样式 */
.user-table-container {
  position: relative;
  overflow: hidden;
}

/* 列宽调整样式 */
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  user-select: none;
  transition: background-color 0.2s ease;
}

.resize-handle:hover,
.resize-handle.active {
  background-color: var(--primary);
}

/* 表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--background);
  transition: background-color 0.2s ease;
}

th::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--border);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 加载动画 */
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

/* 表格行动画 */
tr {
  transition: background-color 0.2s ease;
}

tr:hover {
  background-color: var(--muted);
}

/* 按钮动画 */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.95);
}

/* 自定义滚动条 */
.user-table-container {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) transparent;
}

.user-table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.user-table-container::-webkit-scrollbar-track {
  background: transparent;
}

.user-table-container::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
}

.user-table-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

/* 暗色主题适配 */
:root {
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.3);
  --primary: rgb(37, 99, 235);
  --background: #ffffff;
  --border: #e5e7eb;
  --muted: rgba(0, 0, 0, 0.05);
}

.dark {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.3);
  --background: #1a1b1e;
  --border: #2e2e2e;
  --muted: rgba(255, 255, 255, 0.05);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .user-table-container {
    margin: 0 -1rem;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }
}

/* 添加数据统计卡片样式 */
.stat-card {
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 添加导入导出按钮样式 */
.export-button {
  transition: all 0.2s ease;
}

.export-button:hover {
  background-color: var(--muted);
}

/* 添加文件上传样式 */
.file-upload {
  display: none;
}

/* 添加下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 