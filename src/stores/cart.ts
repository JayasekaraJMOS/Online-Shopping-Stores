import { defineStore } from 'pinia'
import type { Product } from '../types/Product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
    selectedIds: new Set<number>()
  }),

  getters: {
    count: (state) => state.items.length,
    selectedCount: (state) => state.selectedIds.size,
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
    selectedTotal: (state) => state.items
      .filter(item => state.selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.price, 0)
  },

  actions: {
    add(product: Product) {
      this.items.push(product)
      this.selectedIds.add(product.id)
      this.save()
    },

    remove(productId: number) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.selectedIds.delete(productId)
        this.save()
      }
    },

    toggleSelected(id: number) {
      if (this.selectedIds.has(id)) {
        this.selectedIds.delete(id)
      } else {
        this.selectedIds.add(id)
      }
    },

    selectAll() {
      this.items.forEach(item => this.selectedIds.add(item.id))
    },

    deselectAll() {
      this.selectedIds.clear()
    },

    clear() {
      this.items = []
      this.selectedIds = new Set<number>()
      this.save()
    },

    load() {
      const saved = localStorage.getItem('cart')
      if (saved) {
        try {
          this.items = JSON.parse(saved)
          // Select all items by default when loading
          this.selectedIds.clear()
          this.items.forEach(item => this.selectedIds.add(item.id))
        } catch (e) {
          console.error('Failed to load cart:', e)
          this.items = []
          this.selectedIds.clear()
        }
      }
    },

    save() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})