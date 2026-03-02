import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),

  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      this.updateDOM()
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    setDarkMode(isDark: boolean) {
      this.isDark = isDark
      this.updateDOM()
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    },

    loadTheme() {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') {
        this.isDark = true
      } else if (saved === 'light') {
        this.isDark = false
      } else {
        // no user preference -> default to dark mode
        this.isDark = true
      }
      this.updateDOM()
    },

    updateDOM() {
      const html = document.documentElement
      if (this.isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }
})
