<template>
  <div class="notifications-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <svg v-if="notification.type === 'success'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="notification.type === 'error'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <svg v-else-if="notification.type === 'warning'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div class="notification-message">{{ notification.message }}</div>
          <button class="notification-close" @click="removeNotification(notification.id)">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="notification-progress">
          <div
            class="notification-progress-bar"
            :style="{ animationDuration: `${notification.duration}ms` }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store'

const { state, actions } = useStore()

const notifications = computed(() => state.notifications)

const removeNotification = (id) => {
  actions.removeNotification(id)
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  min-width: 300px;
  max-width: 400px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.notification-content {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-message {
  flex: 1;
  font-size: 14px;
}

.notification-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.notification-progress {
  height: 2px;
  background: rgba(0, 0, 0, 0.1);
}

.notification-progress-bar {
  height: 100%;
  width: 100%;
  transform-origin: left;
  animation: progress linear;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* 通知类型样式 */
.notification.success {
  border-left: 4px solid #52c41a;
}

.notification.success .notification-icon {
  color: #52c41a;
}

.notification.success .notification-progress-bar {
  background: #52c41a;
}

.notification.error {
  border-left: 4px solid #ff4d4f;
}

.notification.error .notification-icon {
  color: #ff4d4f;
}

.notification.error .notification-progress-bar {
  background: #ff4d4f;
}

.notification.warning {
  border-left: 4px solid #faad14;
}

.notification.warning .notification-icon {
  color: #faad14;
}

.notification.warning .notification-progress-bar {
  background: #faad14;
}

.notification.info {
  border-left: 4px solid #1890ff;
}

.notification.info .notification-icon {
  color: #1890ff;
}

.notification.info .notification-progress-bar {
  background: #1890ff;
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 