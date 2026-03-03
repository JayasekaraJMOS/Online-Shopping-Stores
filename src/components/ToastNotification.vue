<script setup lang="ts">
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        class="toast"
        :class="notification.type"
      >
        <div class="toast-content">
          <span v-if="notification.type === 'success'" class="icon">✅</span>
          <span v-else-if="notification.type === 'error'" class="icon">❌</span>
          <span v-else-if="notification.type === 'warning'" class="icon">⚠️</span>
          <span v-else class="icon">ℹ️</span>
          <span class="message">{{ notification.message }}</span>
        </div>
        <button class="close-btn" @click="notificationStore.remove(notification.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 300px;
  max-width: 450px;
  background: var(--bg-card, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
}

.dark .toast {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f3f4f6;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.warning {
  border-left: 4px solid #f59e0b;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 1.25rem;
}

.message {
  font-weight: 500;
  font-size: 0.95rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #4b5563;
}

.dark .close-btn:hover {
  color: #e5e7eb;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-move {
  transition: transform 0.4s ease;
}
</style>
