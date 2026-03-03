import { defineStore } from 'pinia'

export interface Notification {
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
}

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Notification[]
    }),
    actions: {
        add(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration = 3000) {
            const id = Date.now()
            this.notifications.push({ id, message, type })

            setTimeout(() => {
                this.remove(id)
            }, duration)
        },
        remove(id: number) {
            this.notifications = this.notifications.filter(n => n.id !== id)
        }
    }
})
