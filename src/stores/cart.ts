import { defineStore } from 'pinia'
import type { Product } from '../types/Product'
import { useNotificationStore } from './notification'

// Available coupons (matches SaveMoreView display)
export const COUPONS: Record<string, { off: number; type: 'percent' | 'fixed'; min: number; label: string }> = {
  'APP10':     { off: 10,  type: 'percent', min: 0,  label: '10% OFF' },
  'APPDEAL20': { off: 20,  type: 'percent', min: 50, label: '20% OFF (min $50)' },
  'APPCASH15': { off: 15,  type: 'fixed',   min: 80, label: '$15 OFF (min $80)' },
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
    selectedIds: new Set<number>(),
    appliedCoupon: null as string | null,
  }),

  getters: {
    count: (state) => state.items.length,
    selectedCount: (state) => state.selectedIds.size,
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
    selectedTotal: (state) => state.items
      .filter(item => state.selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.price, 0),

    couponDiscount(state): number {
      if (!state.appliedCoupon) return 0
      const coupon = COUPONS[state.appliedCoupon]
      if (!coupon) return 0
      const base = state.items
        .filter(item => state.selectedIds.has(item.id))
        .reduce((sum, item) => sum + item.price, 0)
      if (base < coupon.min) return 0
      if (coupon.type === 'percent') return parseFloat(((base * coupon.off) / 100).toFixed(2))
      return Math.min(coupon.off, base)
    },
  },

  actions: {
    add(product: Product) {
      this.items.push(product)
      this.selectedIds.add(product.id)
      this.save()

      const notification = useNotificationStore()
      notification.add(`${product.title} added to cart!`, 'success')
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
      this.appliedCoupon = null
      this.save()

      const notification = useNotificationStore()
      notification.add('Cart cleared!', 'info')
    },

    applyCoupon(code: string): { success: boolean; message: string } {
      const upper = code.trim().toUpperCase()
      const coupon = COUPONS[upper]
      if (!coupon) {
        return { success: false, message: 'Invalid coupon code' }
      }
      const base = this.items
        .filter(item => this.selectedIds.has(item.id))
        .reduce((sum, item) => sum + item.price, 0)
      if (base < coupon.min) {
        return { success: false, message: `Minimum spend of $${coupon.min} required` }
      }
      this.appliedCoupon = upper
      return { success: true, message: `Coupon applied: ${coupon.label}` }
    },

    removeCoupon() {
      this.appliedCoupon = null
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