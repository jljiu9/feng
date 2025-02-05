<!-- Chat.vue -->
<template>
  <div class="flex h-full overflow-hidden">
    <!-- 联系人列表 -->
    <div class="w-[280px] shrink-0 border-r flex flex-col overflow-hidden bg-card">
      <!-- 标签栏 -->
      <div class="h-14 shrink-0 flex items-center justify-between border-b px-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div class="flex gap-2">
          <button 
            class="px-3 py-1 text-xs rounded-full transition-all"
            :class="currentTab === 'contacts' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/80'"
            @click="currentTab = 'contacts'"
          >
            <div class="flex items-center gap-1.5">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
              </svg>
              <span>联系人</span>
            </div>
          </button>
          <button 
            class="px-3 py-1 text-xs rounded-full transition-all"
            :class="currentTab === 'groups' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/80'"
            @click="currentTab = 'groups'"
          >
            <div class="flex items-center gap-1.5">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
              </svg>
              <span>群聊</span>
            </div>
          </button>
        </div>
        <button 
          class="rounded-full p-1.5 hover:bg-muted/80 transition-all relative group"
          @click="showAddContact = true"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <div class="absolute -bottom-8 right-0 px-2 py-1 text-xs bg-popover text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            添加{{ currentTab === 'contacts' ? '联系人' : '群聊' }}
          </div>
        </button>
      </div>
      
      <!-- 搜索框 -->
      <div class="border-b p-3 shrink-0">
        <div class="relative">
          <input 
            type="text"
            v-model="searchQuery"
            class="w-full rounded-full border bg-muted/50 px-4 py-1.5 text-xs pr-9 transition-colors focus:bg-transparent"
            :placeholder="currentTab === 'contacts' ? '搜索联系人...' : '搜索群聊...'"
          />
          <svg 
            class="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- 列表区域 -->
      <div class="flex-1 overflow-y-auto py-2 hover:pr-2 transition-all">
        <div class="space-y-1">
          <template v-if="currentTab === 'contacts'">
            <div 
              v-for="contact in searchQuery ? searchResults.filter(item => item.type === 'contact') : sortedContacts" 
              :key="contact.id"
              class="contact-item flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all relative"
              :class="[
                { 'bg-primary/10 shadow-sm ring-1 ring-primary/20': currentContact?.id === contact.id && !currentContact?.type },
                { 'opacity-60': !isUserOnline(contact.id) },
                { 'bg-muted/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:rounded-lg': contact.isPinned },
                'hover:bg-muted/60'
              ]"
              @click="handleItemClick(contact)"
              @contextmenu.prevent="showContextMenu($event, contact)"
            >
              <!-- 头像区域优化 -->
              <div class="relative">
                <div class="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-background flex items-center justify-center transition-all">
                  <span class="text-sm font-medium">{{ contact.name.charAt(0) }}</span>
                </div>
                <div 
                  class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-background transition-all"
                  :class="[
                    isUserOnline(contact.id) ? 'bg-green-500 animate-pulse' : 'bg-gray-300',
                    'group-hover:scale-110'
                  ]"
                ></div>
              </div>
              
              <!-- 联系人信息区域优化 -->
              <div class="flex-1 min-w-0 py-0.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium truncate">{{ contact.name }}</span>
                    <span 
                      v-if="contact.role"
                      class="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary-foreground/90"
                    >
                      {{ contact.role === 'teacher' ? '老师' : '学生' }}
                    </span>
                  </div>
                  <span 
                    v-if="unreadCount(contact.id)"
                    class="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-medium min-w-[1.25rem] text-center animate-bounce"
                  >
                    {{ unreadCount(contact.id) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-muted-foreground truncate">{{ contact.lastMessage || '暂无消息' }}</span>
                  <span class="text-[10px] text-muted-foreground/70">{{ formatMessageTime(contact.lastTime) }}</span>
                </div>
              </div>

              <!-- 快捷操作菜单 -->
              <div 
                v-if="activeContactMenu === contact.id"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-popover/95 backdrop-blur-sm rounded-full shadow-lg p-1 z-10"
              >
                <button 
                  v-for="action in getQuickActions(contact)"
                  :key="action.name"
                  class="p-1.5 rounded-full hover:bg-muted/80 transition-all group/action"
                  @click.stop="action.onClick(contact)"
                >
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path :d="action.icon" />
                  </svg>
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg opacity-0 group-hover/action:opacity-100 transition-opacity whitespace-nowrap">
                    {{ action.name }}
                  </div>
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div 
              v-for="group in searchQuery ? searchResults.filter(item => item.type === 'group') : sortedGroups" 
              :key="group.id"
              class="contact-item flex items-center gap-3 mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all relative"
              :class="[
                { 'bg-primary/10 shadow-sm ring-1 ring-primary/20': currentContact?.id === group.id && currentContact?.type === 'group' },
                { 'bg-muted/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:rounded-lg': group.isPinned },
                'hover:bg-muted/60'
              ]"
              @click="handleItemClick(group)"
              @contextmenu.prevent="showContextMenu($event, { ...group, type: 'group' })"
            >
              <!-- 群组头像 -->
              <div class="relative">
                <div class="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-background flex items-center justify-center transition-all">
                  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 010 7.75"></path>
                  </svg>
                </div>
              </div>
              
              <!-- 群组信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium truncate">{{ group.name }}</span>
                    <span 
                      v-if="group.isMuted"
                      class="text-muted-foreground"
                    >
                      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </span>
                  </div>
                  <span 
                    v-if="groupUnreadCount(group.id)"
                    class="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-medium min-w-[1.25rem] text-center"
                  >
                    {{ groupUnreadCount(group.id) }}
                  </span>
                </div>
                <div class="text-xs text-muted-foreground truncate mt-0.5">
                  {{ group.members.length }}人
                </div>
              </div>

              <!-- 快捷操作菜单 -->
              <div 
                v-if="activeContactMenu === group.id"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-popover/95 backdrop-blur-sm rounded-full shadow-lg p-1 z-10"
              >
                <button 
                  v-for="action in getQuickActions({ ...group, type: 'group' })"
                  :key="action.name"
                  class="p-1.5 rounded-full hover:bg-muted/80 transition-all group/action relative"
                  @click.stop="action.onClick(group)"
                >
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path :d="action.icon" />
                  </svg>
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg opacity-0 group-hover/action:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">
                    {{ action.name }}
                  </div>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 聊天区域 -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      <!-- 聊天头部 -->
      <div class="h-14 shrink-0 flex items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex items-center gap-3">
          <div v-if="currentContact" class="flex items-center gap-3">
            <div class="relative">
              <div class="size-10 rounded-full bg-primary/10 ring-2 ring-background flex items-center justify-center">
                <span class="text-sm font-medium">{{ currentContact.name.charAt(0) }}</span>
              </div>
              <div 
                v-if="!currentContact.type"
                class="absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background"
                :class="isUserOnline(currentContact.id) ? 'bg-green-500' : 'bg-gray-300'"
              ></div>
            </div>
            <div>
              <div class="text-base font-medium">{{ currentContact.name }}</div>
              <div class="text-xs text-muted-foreground">
                {{ currentContact.type === 'group' 
                  ? `${currentContact.members.length}人` 
                  : isUserOnline(currentContact.id) ? '在线' : '离线' 
                }}
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground">
            请选择联系人开始聊天
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            v-if="currentContact"
            class="rounded-full p-2 hover:bg-muted/80 transition-all relative group"
            @click="toggleSidePanel"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="tooltip">
              聊天详情
            </div>
          </button>
        </div>
      </div>
      
      <!-- 消息列表区域优化 -->
      <div 
        ref="messageList"
        class="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth relative"
      >
        <!-- 新消息提醒 -->
        <div 
          v-if="hasNewMessage"
          class="sticky top-4 left-1/2 -translate-x-1/2 flex items-center justify-center"
        >
          <button 
            class="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group animate-bounce"
            @click="scrollToBottom"
          >
            <span>新消息</span>
            <svg class="size-3 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        <template v-if="currentContact">
          <TransitionGroup 
            name="message"
            appear
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <div 
              v-for="(message, index) in currentMessages" 
              :key="message.id"
              class="group relative"
              :class="[
                { 'flex justify-end': message.senderId === user.id },
                { 'mt-8': shouldShowTimestamp(message, index) }
              ]"
            >
              <!-- 时间戳优化 -->
              <div 
                v-if="shouldShowTimestamp(message, index)"
                class="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground backdrop-blur-sm"
              >
                {{ formatMessageTime(message.timestamp) }}
              </div>
              
              <div 
                class="flex items-end gap-2 max-w-[85%] group/message"
                :class="{ 'flex-row-reverse': message.senderId === user.id }"
              >
                <!-- 头像优化 -->
                <div class="relative group/avatar mb-1">
                  <div 
                    class="size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-background flex items-center justify-center shrink-0 transition-all"
                  >
                    <span class="text-xs">
                      {{ message.senderId === user.id 
                        ? user.name.charAt(0)
                        : currentContact.name.charAt(0)
                      }}
                    </span>
                  </div>
                  <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-popover/95 text-popover-foreground rounded-md shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">
                    {{ message.senderId === user.id ? user.name : (message.senderName || currentContact.name) }}
                  </div>
                </div>
                
                <!-- 消息内容优化 -->
                <div class="group/bubble relative">
                  <div 
                    class="rounded-2xl px-4 py-2 transition-all shadow-sm"
                    :class="[
                      message.senderId === user.id 
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground group-hover/bubble:shadow-lg' 
                        : 'bg-muted group-hover/bubble:bg-muted/90 group-hover/bubble:shadow-md'
                    ]"
                  >
                    <div class="text-sm whitespace-pre-wrap break-words">{{ message.content }}</div>
                    <div class="mt-1 text-[10px] opacity-70 flex items-center gap-1 justify-end">
                      {{ formatTime(message.timestamp) }}
                      <span 
                        v-if="message.senderId === user.id"
                        class="flex items-center"
                      >
                        <svg 
                          class="size-3 ml-0.5" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          stroke-width="2"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  
                  <!-- 消息操作菜单优化 -->
                  <div 
                    class="absolute top-0 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity"
                    :class="message.senderId === user.id ? 'right-full mr-2' : 'left-full ml-2'"
                  >
                    <button 
                      v-for="action in messageActions"
                      :key="action.name"
                      class="p-1.5 rounded-full hover:bg-muted/80 transition-all group/action relative"
                      :class="{ 'hover:bg-destructive/10 hover:text-destructive': action.type === 'danger' }"
                      @click="action.onClick(message)"
                    >
                      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path :d="action.icon" />
                      </svg>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg opacity-0 group-hover/action:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">
                        {{ action.name }}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </template>
        <div 
          v-else 
          class="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4"
        >
          <div class="size-24 rounded-full bg-muted/30 ring-4 ring-muted/10 flex items-center justify-center animate-pulse">
            <svg class="size-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div class="text-center">
            <div class="text-base font-medium">开始聊天</div>
            <div class="text-sm text-muted-foreground mt-1">选择一个联系人开始对话</div>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="border-t p-4 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex flex-col gap-3">
          <!-- 工具栏 -->
          <div class="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-full backdrop-blur-sm">
            <button 
              v-for="(tool, index) in toolbarItems"
              :key="index"
              class="toolbar-button p-2 rounded-full hover:bg-muted/80 transition-all relative group"
              :class="{ 'bg-primary text-primary-foreground': tool.isActive?.value }"
              @click="tool.onClick"
              :disabled="!currentContact"
            >
              <div class="relative">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path :d="tool.icon" />
                </svg>
                <div v-if="tool.badge" class="absolute -top-1 -right-1 size-2 bg-primary rounded-full"></div>
              </div>
              <div class="tooltip">
                {{ tool.tooltip }}
              </div>
            </button>
          </div>
          
          <!-- 输入框 -->
          <div class="relative flex gap-2">
            <div class="flex-1 relative">
              <textarea 
                v-model="messageInput"
                rows="1"
                class="w-full rounded-xl border bg-muted/50 px-4 py-2.5 text-sm resize-none transition-all focus:bg-transparent focus:shadow-md focus:scale-[1.01]"
                :class="[
                  { 'pr-20': messageInput.length > 0 },
                  { 'hidden': isRecording }
                ]"
                placeholder="输入消息..."
                @keydown.enter.prevent="handleEnterPress"
                @input="autoGrow"
                @paste="handlePaste"
                :disabled="!currentContact"
                ref="messageInputRef"
              ></textarea>
              
              <!-- 语音录制状态 -->
              <div 
                v-if="isRecording"
                class="w-full rounded-xl border bg-primary/10 px-4 py-2.5 text-sm text-center animate-pulse"
              >
                正在录音... {{ recordingDuration }}秒
              </div>

              <div 
                v-if="messageInput.length > 0"
                class="absolute right-3 bottom-2.5 text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded"
              >
                Enter 发送
              </div>
            </div>
            
            <button 
              class="shrink-0 self-end rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              :class="{ 'scale-95': isSending }"
              @click="sendMessage"
              :disabled="(!messageInput.trim() && !isRecording) || !currentContact || isSending"
            >
              <span v-if="!isSending">发送</span>
              <svg 
                v-else 
                class="size-4 animate-spin"
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
      </div>
    </div>
    
    <!-- 表情选择器 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div 
        v-if="showEmojiPicker"
        class="panel-container"
        v-click-outside="() => showEmojiPicker = false"
      >
        <div class="panel-header">
          <span class="text-sm font-medium">表情</span>
          <div class="flex gap-1">
            <button 
              v-for="category in ['常用', '表情', '动物', '食物']" 
              class="px-2 py-1 text-xs rounded-md transition-colors"
              :class="currentEmojiCategory === category ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="currentEmojiCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-8 gap-1.5 p-2 max-h-[240px] overflow-y-auto hover-scroll">
          <button 
            v-for="emoji in filteredEmojis"
            :key="emoji"
            class="p-2 hover:bg-muted/80 rounded-lg transition-all text-lg hover:scale-110"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- 喵言面板 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div 
        v-if="miaoyanState.isActive"
        class="absolute bottom-28 left-4 bg-popover/95 backdrop-blur-sm supports-[backdrop-filter]:bg-popover/80 rounded-lg shadow-lg p-4 z-10 w-80 transition-all duration-300"
        v-click-outside="toggleMiaoyan"
      >
        <div class="space-y-4">
          <!-- 标题 -->
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">喵言助手</div>
            <div class="text-xs text-muted-foreground">AI智能回复</div>
          </div>

          <!-- 上下文范围选择 -->
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground">分析范围</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="range in miaoyanState.contextRanges"
                :key="range.id"
                class="px-2 py-1.5 text-xs rounded-md transition-colors text-center"
                :class="[
                  miaoyanState.contextRange === range.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted'
                ]"
                @click="actions.setMiaoyanContextRange(range.id)"
              >
                {{ range.name }}
              </button>
            </div>
          </div>

          <!-- 状态显示 -->
          <div v-if="miaoyanState.loadingStatus !== 'idle'" class="space-y-3">
            <div class="flex items-center gap-2 text-xs">
              <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span class="text-muted-foreground">
                {{ 
                  miaoyanState.loadingStatus === 'loading_vector' ? '正在更新向量数据库...' :
                  miaoyanState.loadingStatus === 'loading_index' ? '正在更新索引...' :
                  miaoyanState.loadingStatus === 'requesting' ? '正在请求喵言...' :
                  miaoyanState.loadingStatus === 'responding' ? '喵言思考中...' : ''
                }}
              </span>
            </div>
            <div class="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary transition-all duration-300"
                :style="{
                  width: 
                    miaoyanState.loadingStatus === 'loading_vector' ? '25%' :
                    miaoyanState.loadingStatus === 'loading_index' ? '50%' :
                    miaoyanState.loadingStatus === 'requesting' ? '75%' :
                    miaoyanState.loadingStatus === 'responding' ? '90%' : '0%'
                }"
              ></div>
            </div>
          </div>

          <!-- 响应结果 -->
          <div v-if="miaoyanState.currentResponse" class="space-y-2">
            <div class="text-xs text-muted-foreground">喵言建议</div>
            <div class="p-3 rounded-lg bg-muted/50 text-sm">
              {{ miaoyanState.currentResponse.content }}
            </div>
            <button 
              class="w-full px-3 py-2 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              @click="useAISuggestion"
            >
              使用这个回复
            </button>
          </div>

          <!-- 错误提示 -->
          <div 
            v-if="miaoyanState.error"
            class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            {{ miaoyanState.error }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- 图片预览 -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="previewImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click="previewImage = null"
      >
        <img 
          :src="previewImage" 
          class="max-w-full max-h-full rounded-lg shadow-xl"
          @click.stop
        />
      </div>
    </Transition>

    <!-- 文件上传输入 -->
    <input 
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFileUpload"
    />
    
    <!-- 图片上传输入 -->
    <input 
      ref="imageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageUpload"
    />

    <!-- 右侧副面板 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="showSidePanel && currentContact"
        class="w-[380px] shrink-0 border-l flex flex-col overflow-hidden bg-card/95 backdrop-blur-sm"
      >
        <!-- 面板头部 -->
        <div class="h-14 shrink-0 flex items-center justify-between border-b px-4">
          <h3 class="text-base font-medium">聊天详情</h3>
          <button 
            class="p-2 rounded-full hover:bg-muted/80 transition-all"
            @click="showSidePanel = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 面板内容 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="size-16 rounded-full bg-primary/10 ring-2 ring-background flex items-center justify-center">
                <span class="text-xl font-medium">{{ currentContact.name.charAt(0) }}</span>
              </div>
              <div>
                <div class="text-lg font-medium">{{ currentContact.name }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ currentContact.type === 'group' ? '群聊' : '联系人' }}
                </div>
              </div>
            </div>
            
            <!-- 快捷操作 -->
            <div class="grid grid-cols-4 gap-2">
              <button 
                v-for="action in quickActions"
                :key="action.name"
                class="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted/80 transition-all"
                @click="action.onClick"
              >
                <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path :d="action.icon" />
                  </svg>
                </div>
                <span class="text-xs">{{ action.name }}</span>
              </button>
            </div>
          </div>

          <!-- 聊天记录搜索 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">聊天记录搜索</h4>
            </div>
            <div class="relative">
              <input 
                type="text"
                v-model="messageSearchQuery"
                class="w-full rounded-lg border bg-muted/50 px-4 py-2 text-sm pr-9 transition-colors focus:bg-transparent"
                placeholder="搜索聊天记录..."
              />
              <svg 
                class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- 媒体内容 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">媒体内容</h4>
              <button class="text-xs text-primary hover:underline">
                查看全部
              </button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="media in recentMedia.slice(0, 6)"
                :key="media.id"
                class="aspect-square rounded-lg overflow-hidden group relative cursor-pointer"
                @click="previewMedia(media)"
              >
                <img 
                  :src="media.url" 
                  class="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- 文件列表 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">文件</h4>
              <button class="text-xs text-primary hover:underline">
                查看全部
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="file in recentFiles.slice(0, 3)"
                :key="file.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80 transition-all cursor-pointer"
                @click="downloadFile(file)"
              >
                <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ file.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 链接列表 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">链接</h4>
              <button class="text-xs text-primary hover:underline">
                查看全部
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="link in recentLinks.slice(0, 3)"
                :key="link.id"
                class="p-3 rounded-lg border hover:bg-muted/50 transition-all cursor-pointer"
                @click="openLink(link.url)"
              >
                <div class="text-sm font-medium line-clamp-2">{{ link.title }}</div>
                <div class="text-xs text-muted-foreground mt-1 truncate">{{ link.url }}</div>
              </div>
            </div>
          </div>

          <!-- 群聊设置（仅群聊显示） -->
          <template v-if="currentContact.type === 'group'">
            <div class="space-y-3">
              <h4 class="text-sm font-medium">群聊设置</h4>
              <div class="space-y-2">
                <button class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 transition-all">
                  <span class="text-sm">消息免打扰</span>
                  <div class="size-4 rounded-full bg-primary"></div>
                </button>
                <button class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 transition-all">
                  <span class="text-sm">置顶聊天</span>
                  <div class="size-4 rounded-full bg-muted"></div>
                </button>
                <button class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 transition-all text-destructive">
                  <span class="text-sm">退出群聊</span>
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useStore } from '../store'
import { useApi } from '../api'
import gsap from 'gsap'

const { state, actions, getters } = useStore()
const api = useApi()

// 用户信息
const user = computed(() => getters.user())

// 联系人相关
const currentContact = computed(() => getters.currentContact())
const contacts = computed(() => getters.contacts())
const searchQuery = ref('')
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.id.toString().includes(query)
  )
})

// 消息相关
const messageList = ref(null)
const messageInput = ref('')
const currentMessages = computed(() => {
  if (!currentContact.value) return []
  return currentContact.value.type === 'group'
    ? getters.groupMessages(currentContact.value.id)
    : getters.messages(currentContact.value.id)
})

// 添加联系人
const showAddContact = ref(false)
const searchUserQuery = ref('')
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  return getters.searchAllConversations(searchQuery.value)
})

// 标签页切换
const currentTab = ref('contacts')

// 群聊相关
const groups = computed(() => state.chat.groups)
const groupUnreadCount = computed(() => (groupId) => state.chat.groupUnreadCount[groupId] || 0)

// 新增状态
const showEmojiPicker = ref(false)
const isSending = ref(false)
const messageInputRef = ref(null)
const fileInput = ref(null)
const showQuickPhrases = ref(false)
const isRecording = ref(false)
const recordingDuration = ref(0)
const recordingTimer = ref(null)
const previewImage = ref(null)
const imageInput = ref(null)

// 表情列表
const emojis = ['😊', '😂', '🤣', '❤️', '😍', '🤔', '👍', '👋', '🎉', '🌹', '��', '✨', '🌟', '💪', '🤝', '', '', '🎈']

// 快捷短语列表
const quickPhrases = [
  '你好！',
  '谢谢',
  '好的，没问题',
  '稍等一下',
  '收到',
  '辛苦了',
  '下班了，明天见',
  '在忙吗？'
]

// 插入表情
const insertEmoji = (emoji) => {
  messageInput.value += emoji
  messageInputRef.value?.focus()
}

// 自动调整输入框高度
const autoGrow = () => {
  const el = messageInputRef.value
  if (!el) return
  
  // 保存当前滚动位置
  const scrollPos = window.scrollY
  
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 150)}px`
  
  // 恢复滚动位置
  window.scrollTo(0, scrollPos)
}

// 处理回车发送
const handleEnterPress = (e) => {
  if (e.shiftKey) {
    // Shift + Enter 换行
    return
  }
  sendMessage()
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim() || !currentContact.value || isSending.value) return
  
  isSending.value = true
  try {
    const message = {
      id: Date.now(),
      content: messageInput.value,
      senderId: user.value.id,
      senderName: user.value.name,
      timestamp: new Date()
    }
    
    if (currentContact.value.type === 'group') {
      await actions.sendGroupMessage(currentContact.value.id, message)
    } else {
      await actions.sendMessage(currentContact.value.id, message)
    }
    
    messageInput.value = ''
    autoGrow()
    
    await nextTick()
    scrollToBottom()
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '发送失败，请重试'
    })
  } finally {
    isSending.value = false
  }
}

// 复制消息
const copyMessage = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    actions.addNotification({
      type: 'success',
      message: '复制成功'
    })
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '复制失败'
    })
  }
}

// 删除消息
const deleteMessage = (messageId) => {
  // TODO: 实现删除消息功能
  actions.addNotification({
    type: 'success',
    message: '消息已删除'
  })
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  // TODO: 实现文件上传功能
  actions.addNotification({
    type: 'info',
    message: '文件上传功能即将上线'
  })
  
  // 清空选择
  event.target.value = ''
}

// 判断是否显示时间戳
const shouldShowTimestamp = (message, index) => {
  if (index === 0) return true
  const prevMessage = currentMessages.value[index - 1]
  const timeDiff = message.timestamp - prevMessage.timestamp
  return timeDiff > 5 * 60 * 1000 // 超过5分钟显示时间戳
}

// 格式化消息时间
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 24 * 60 * 60 * 1000) {
    // 今天
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diff < 48 * 60 * 60 * 1000) {
    // 昨天
    return '昨天 ' + date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    // 更早
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 选择联系人
const selectContact = (contact) => {
  actions.setCurrentContact(contact)
  actions.markAsRead(contact.id)
}

// 选择群聊
const selectGroup = (group) => {
  actions.setCurrentContact({
    ...group,
    type: 'group'
  })
  // 标记群聊消息为已读
  if (user.value) {
    actions.markGroupAsRead(group.id, user.value.id)
  }
}

// 搜索用户
const searchUsers = async () => {
  try {
    // 这里应该调用实际的API
    const results = await api.user.searchUsers(searchUserQuery.value)
    searchResults.value = results
  } catch (error) {
    console.error('Search users error:', error)
  }
}

// 添加新联系人
const addNewContact = (newContact) => {
  actions.addContact(newContact)
  showAddContact.value = false
  // 可以添加成功提示
  actions.addNotification({
    type: 'success',
    message: `已添加 ${newContact.name} 为联系人`
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 在线状态
const isUserOnline = computed(() => (userId) => getters.isUserOnline(userId))
const unreadCount = computed(() => (itemId) => {
  if (currentContact.value?.type === 'group') {
    return getters.groupUnreadCount(itemId)
  }
  return getters.unreadCount(itemId)
})

// 插入快捷短语
const insertQuickPhrase = (phrase) => {
  messageInput.value += phrase
  showQuickPhrases.value = false
  messageInputRef.value?.focus()
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click()
}

// 处理图片上传
const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    actions.addNotification({
      type: 'error',
      message: '请选择图片文件'
    })
    return
  }
  
  // TODO: 实现图片上传功能
  actions.addNotification({
    type: 'info',
    message: '图片上传功能即将上线'
  })
  
  event.target.value = ''
}

// 处理粘贴事件
const handlePaste = async (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        event.preventDefault()
        // TODO: 处理图片上传
        actions.addNotification({
          type: 'info',
          message: '图片上传功能即将上线'
        })
        break
      }
    }
  }
}

// 语音录制相关
const toggleVoiceRecord = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = async () => {
  try {
    // TODO: 实现实际的录音功能
    isRecording.value = true
    recordingDuration.value = 0
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++
    }, 1000)
    
    actions.addNotification({
      type: 'info',
      message: '开始录音'
    })
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '无法访问麦克风'
    })
  }
}

const stopRecording = async () => {
  if (!isRecording.value) return
  
  clearInterval(recordingTimer.value)
  isRecording.value = false
  
  // TODO: 实现语音消息发送
  actions.addNotification({
    type: 'success',
    message: '录音完成'
  })
}

// 喵言相关
const miaoyanState = computed(() => getters.miaoyanState())
const isMiaoyanActive = computed(() => getters.isMiaoyanActive())

// 使用AI建议
const useAISuggestion = () => {
  if (miaoyanState.value.currentResponse?.suggestion) {
    messageInput.value = miaoyanState.value.currentResponse.suggestion
    actions.toggleMiaoyan()
    messageInputRef.value?.focus()
  }
}

// 监听搜索用户输入
watch(searchUserQuery, () => {
  if (searchUserQuery.value) {
    searchUsers()
  } else {
    searchResults.value = []
  }
})

// 初始化
onMounted(() => {
  // 初始化模拟数据
  actions.initMockData()
  // 启动在线状态模拟
  actions.simulateOnlineStatus()
})

// 在组件卸载时清理
onUnmounted(() => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }
})

// 在 script setup 部分添加
const toggleMiaoyan = () => {
  actions.toggleMiaoyan()
  if (!miaoyanState.value.isActive) {
    actions.requestMiaoyanSuggestion()
  }
}

// 优化消息动画处理
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px) scale(0.95)'
}

const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: 'elastic.out(1, 0.8)',
    onComplete: done
  })
}

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    scale: 0.95,
    duration: 0.3,
    ease: 'back.in(1.5)',
    onComplete: done
  })
}

// 优化滚动到底部的动画
const scrollToBottom = () => {
  if (!messageList.value) return
  
  const target = messageList.value.scrollHeight
  const current = messageList.value.scrollTop
  const distance = target - current
  
  if (distance > 0) {
    gsap.to(messageList.value, {
      scrollTop: target,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

// 优化输入框动画
const handleInputFocus = () => {
  gsap.to(messageInputRef.value, {
    scale: 1.01,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'back.out(1.7)'
  })
}

const handleInputBlur = () => {
  gsap.to(messageInputRef.value, {
    scale: 1,
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    duration: 0.2,
    ease: 'power2.inOut'
  })
}

// 工具栏配置
const toolbarItems = [
  {
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    tooltip: '表情',
    onClick: () => showEmojiPicker.value = !showEmojiPicker.value,
    isActive: computed(() => showEmojiPicker.value)
  },
  {
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    tooltip: '发送图片',
    onClick: triggerImageUpload
  },
  {
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    tooltip: '按住说话',
    onClick: toggleVoiceRecord,
    isActive: computed(() => isRecording.value)
  },
  {
    icon: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13',
    tooltip: '发送文件',
    onClick: triggerFileUpload
  },
  {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z',
    tooltip: '喵言助手',
    onClick: toggleMiaoyan,
    isActive: computed(() => miaoyanState.value.isActive)
  }
]

// 表情分类
const currentEmojiCategory = ref('常用')
const emojiCategories = {
  '常用': ['😊', '😂', '🤣', '❤️', '😍', '🤔', '👍', '👋'],
  '表情': ['😀', '😃', '😄', '😁', '😅', '😆', '😉', '😊', '😋', '😎'],
  '动物': ['🐱', '🐶', '🐼', '🐨', '🦊', '🐯', '🦁', '🐮'],
  '食物': ['🍎', '🍕', '🍖', '🍗', '🍜', '🍣', '🍪', '🍰']
}

const filteredEmojis = computed(() => emojiCategories[currentEmojiCategory.value])

// 侧边栏状态
const showSidePanel = ref(false)
const toggleSidePanel = () => {
  showSidePanel.value = !showSidePanel.value
}

// 快捷操作配置
const quickActions = [
  {
    name: '发起通话',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    onClick: () => {
      actions.addNotification({
        type: 'info',
        message: '通话功能即将上线'
      })
    }
  },
  {
    name: '发送名片',
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
    onClick: () => {
      actions.addNotification({
        type: 'info',
        message: '名片分享功能即将上线'
      })
    }
  },
  {
    name: '收藏',
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    onClick: () => {
      actions.addNotification({
        type: 'success',
        message: '已添加到收藏'
      })
    }
  },
  {
    name: '举报',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    onClick: () => {
      actions.addNotification({
        type: 'info',
        message: '举报功能即将上线'
      })
    }
  }
]

// 消息搜索
const messageSearchQuery = ref('')
const searchMessages = computed(() => {
  if (!messageSearchQuery.value) return []
  const query = messageSearchQuery.value.toLowerCase()
  return currentMessages.value.filter(msg => 
    msg.content.toLowerCase().includes(query)
  )
})

// 模拟媒体数据
const recentMedia = [
  { id: 1, url: 'https://picsum.photos/200/200?random=1', type: 'image' },
  { id: 2, url: 'https://picsum.photos/200/200?random=2', type: 'image' },
  { id: 3, url: 'https://picsum.photos/200/200?random=3', type: 'image' },
  { id: 4, url: 'https://picsum.photos/200/200?random=4', type: 'image' },
  { id: 5, url: 'https://picsum.photos/200/200?random=5', type: 'image' },
  { id: 6, url: 'https://picsum.photos/200/200?random=6', type: 'image' }
]

// 模拟文件数据
const recentFiles = [
  { id: 1, name: '项目方案.docx', size: 1024 * 1024 * 2.5 },
  { id: 2, name: '会议记录.pdf', size: 1024 * 512 },
  { id: 3, name: '数据分析.xlsx', size: 1024 * 1024 * 1.8 }
]

// 模拟链接数据
const recentLinks = [
  { id: 1, title: '2024年Web开发趋势分析', url: 'https://example.com/web-trends-2024' },
  { id: 2, title: '如何提高开发效率：10个实用技巧', url: 'https://example.com/dev-tips' },
  { id: 3, title: '最新前端框架对比', url: 'https://example.com/framework-comparison' }
]

// 文件大小格式化
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 预览媒体
const previewMedia = (media) => {
  if (media.type === 'image') {
    previewImage.value = media.url
  }
}

// 下载文件
const downloadFile = (file) => {
  actions.addNotification({
    type: 'info',
    message: `正在下载：${file.name}`
  })
}

// 打开链接
const openLink = (url) => {
  window.open(url, '_blank')
}

// 联系人快捷操作菜单
const activeContactMenu = ref(null)
const contactQuickActions = [
  {
    name: '置顶聊天',
    icon: 'M5 15l7-7 7 7',
    onClick: (contact) => {
      actions.togglePinContact(contact.id)
    }
  },
  {
    name: '标记已读',
    icon: 'M5 13l4 4L19 7',
    onClick: (contact) => {
      actions.markAsRead(contact.id)
    }
  },
  {
    name: '隐藏会话',
    icon: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
    onClick: (contact) => {
      actions.hideConversation(contact.id)
    }
  },
  {
    name: '消息免打扰',
    icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    onClick: (contact) => {
      actions.toggleMuteContact(contact.id)
    }
  }
]

const showContactMenu = (event, contact) => {
  event.preventDefault()
  activeContactMenu.value = activeContactMenu.value === contact.id ? null : contact.id
}

// 点击其他地方关闭菜单
const closeContactMenu = () => {
  activeContactMenu.value = null
}

onMounted(() => {
  document.addEventListener('click', closeContactMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeContactMenu)
})

// 消息操作菜单配置
const messageActions = [
  {
    name: '复制',
    icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3',
    onClick: copyMessage
  },
  {
    name: '回复',
    icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
    onClick: (message) => {
      messageInput.value = `回复 @${message.senderName || currentContact.value.name}：\n`
      messageInputRef.value?.focus()
    }
  },
  {
    name: '转发',
    icon: 'M17 8l4 4m0 0l-4 4m4-4H3',
    onClick: (message) => {
      actions.addNotification({
        type: 'info',
        message: '转发功能即将上线'
      })
    }
  },
  {
    name: '删除',
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    type: 'danger',
    onClick: deleteMessage
  }
]

// 新消息提醒
const hasNewMessage = ref(false)
const isScrolledToBottom = ref(true)

const checkScroll = () => {
  if (!messageList.value) return
  const { scrollTop, scrollHeight, clientHeight } = messageList.value
  isScrolledToBottom.value = Math.abs(scrollHeight - scrollTop - clientHeight) < 50
  hasNewMessage.value = !isScrolledToBottom.value && currentMessages.value.length > 0
}

// 监听消息列表滚动
onMounted(() => {
  messageList.value?.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  messageList.value?.removeEventListener('scroll', checkScroll)
})

// 监听新消息
watch(() => currentMessages.value?.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    if (isScrolledToBottom.value) {
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      hasNewMessage.value = true
    }
  }
})

// 添加计算属性用于排序联系人列表
const sortedContacts = computed(() => {
  return filteredContacts.value.sort((a, b) => {
    // 优先按置顶状态排序
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // 其次按最后消息时间排序
    const aTime = new Date(a.lastTime || 0).getTime()
    const bTime = new Date(b.lastTime || 0).getTime()
    return bTime - aTime
  })
})

// 添加删除确认对话框
const showDeleteDialog = ref(false)
const hiddenConversationsCount = computed(() => getters.hiddenConversationsCount())

const showDeleteConfirm = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!currentContact.value) return
  
  try {
    await actions.clearChatHistory(currentContact.value.id)
    showDeleteDialog.value = false
    actions.addNotification({
      type: 'success',
      message: '聊天记录已清空'
    })
  } catch (error) {
    actions.addNotification({
      type: 'error',
      message: '操作失败，请重试'
    })
  }
}

const toggleHiddenConversations = () => {
  actions.toggleHiddenConversations()
}

// 添加通用的上下文菜单处理
const showContextMenu = (event, item) => {
  event.preventDefault()
  event.stopPropagation()
  activeContactMenu.value = activeContactMenu.value === item.id ? null : item.id
}

// 添加通用的点击处理
const handleItemClick = (item) => {
  if (item.isHidden) {
    actions.activateConversation(item)
  } else {
    if (item.type === 'group') {
      selectGroup(item)
    } else {
      selectContact(item)
    }
  }
  // 点击时关闭菜单
  activeContactMenu.value = null
}

// 修改快捷操作菜单配置
const getQuickActions = (item) => [
  {
    name: item.isPinned ? '取消置顶' : '置顶聊天',
    icon: item.isPinned ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7',
    onClick: () => {
      if (item.type === 'group') {
        actions.togglePinGroup(item.id)
      } else {
        actions.togglePinContact(item.id)
      }
      activeContactMenu.value = null
    }
  },
  {
    name: '标记已读',
    icon: 'M5 13l4 4L19 7',
    onClick: () => {
      actions.markAsRead(item.id)
      activeContactMenu.value = null
    }
  },
  {
    name: '隐藏会话',
    icon: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
    onClick: () => {
      if (item.type === 'group') {
        actions.hideGroup(item.id)
      } else {
        actions.hideConversation(item.id)
      }
      activeContactMenu.value = null
    }
  },
  {
    name: '消息免打扰',
    icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    onClick: () => {
      if (item.type === 'group') {
        actions.toggleMuteGroup(item.id)
      } else {
        actions.toggleMuteContact(item.id)
      }
      activeContactMenu.value = null
    }
  }
]

// 添加群聊排序计算属性
const sortedGroups = computed(() => {
  return getters.groups().sort((a, b) => {
    // 优先按置顶状态排序
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // 其次按最后消息时间排序
    const aTime = new Date(a.lastTime || 0).getTime()
    const bTime = new Date(b.lastTime || 0).getTime()
    return bTime - aTime
  })
})
</script>

<style scoped>
/* 优化消息动画 */
.message-move {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 优化按钮悬停和点击效果 */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: scale(0.95) translateY(0);
}

/* 优化消息气泡效果 */
.message-bubble {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.message-bubble:hover {
  transform: translateY(-1px) scale(1.01);
}

/* 优化加载动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
    background-size: 200% 200%;
  }
  50% {
    background-position: 100% 50%;
    background-size: 250% 250%;
  }
  100% {
    background-position: 0% 50%;
    background-size: 200% 200%;
  }
}

.animate-gradient {
  background: linear-gradient(
    45deg,
    var(--primary) 0%,
    var(--primary-light) 25%,
    var(--primary) 50%,
    var(--primary-light) 75%,
    var(--primary) 100%
  );
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* 优化滚动条交互 */
.hover-scroll {
  scrollbar-width: thin;
  transition: padding-right 0.3s ease;
}

.hover-scroll:hover {
  padding-right: 0.5rem;
}

/* 优化输入框动画 */
textarea {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

textarea:focus {
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 优化头像悬停效果 */
.avatar-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.avatar-hover:hover {
  transform: scale(1.1) rotate(5deg);
}

/* 优化工具栏按钮动画 */
.toolbar-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.toolbar-button:active:not(:disabled) {
  transform: scale(0.95) translateY(0);
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 优化喵言面板动画 */
.miaoyan-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, box-shadow;
}

.miaoyan-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* 优化进度条动画 */
.progress-bar {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
}

/* 添加波纹效果 */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
}

/* 工具提示样式 */
.tooltip {
  @apply absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 
    text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 
    transition-all duration-200 backdrop-blur-sm z-50 whitespace-nowrap;
}

/* 面板通用样式 */
.panel-container {
  @apply absolute bottom-28 left-4 bg-popover/95 backdrop-blur-sm 
    rounded-lg shadow-lg z-10 min-w-[320px] border border-border/50
    transition-all duration-300 hover:shadow-xl;
}

.panel-header {
  @apply flex items-center justify-between border-b border-border/50 
    px-4 py-2.5 bg-muted/30;
}

/* 优化滚动条 */
.hover-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.hover-scroll::-webkit-scrollbar {
  width: 4px;
}

.hover-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.hover-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.dark .hover-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 优化动画过渡 */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* 添加阴影过渡 */
.shadow-transition {
  transition: box-shadow 0.3s ease;
}

.shadow-transition:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 优化按钮反馈 */
.btn-feedback {
  position: relative;
  overflow: hidden;
}

.btn-feedback::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: currentColor;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.btn-feedback:active::after {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0.1;
}

/* 添加右侧面板过渡动画 */
.side-panel-enter-active,
.side-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-panel-enter-from,
.side-panel-leave-to {
  transform: translateX(100%);
}

/* 联系人列表动画优化 */
.contact-enter-active,
.contact-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-enter-from,
.contact-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 在线状态动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 未读消息动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

/* 消息气泡动画优化 */
.message-bubble {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.message-bubble:hover {
  transform: translateY(-1px) scale(1.01);
}

/* 新消息提醒动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

/* 消息操作按钮动画 */
.message-action {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-action:hover {
  transform: scale(1.1);
}

/* 优化滚动条 */
.message-list::-webkit-scrollbar {
  width: 4px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.dark .message-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 联系人列表项样式 */
.contact-item {
  position: relative;
  overflow: hidden;
  will-change: background-color, transform, box-shadow;
}

.contact-item::before {
  content: '';
  pointer-events: none;
}

/* 确保这些样式不会影响到聊天气泡 */
.contact-item:hover {
  transform: translateY(-1px);
}

.contact-item:active {
  transform: translateY(0);
}
</style> 