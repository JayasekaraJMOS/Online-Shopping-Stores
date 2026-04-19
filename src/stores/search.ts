import { defineStore } from 'pinia'

export type SortOption = 'best' | 'price_asc' | 'price_desc' | 'rating' | 'newest'

export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        sortBy: 'best' as SortOption,
        suggestions: [] as string[],
        recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]') as string[]
    }),
    actions: {
        setQuery(val: string) {
            this.query = val
            if (val.length > 2) {
                this.fetchSuggestions(val)
            } else {
                this.suggestions = []
            }
        },
        setSortBy(val: SortOption) {
            this.sortBy = val
        },
        async fetchSuggestions(q: string) {
            try {
                const res = await fetch(`https://dummyjson.com/products/search?q=${q}&limit=5`)
                const data = await res.json()
                this.suggestions = data.products.map((p: { title: string }) => p.title)
            } catch (err) {
                console.error('Suggestion fetch error:', err)
            }
        },
        addRecentSearch(q: string) {
            if (!q || this.recentSearches.includes(q)) return
            this.recentSearches.unshift(q)
            this.recentSearches = this.recentSearches.slice(0, 5)
            localStorage.setItem('recent_searches', JSON.stringify(this.recentSearches))
        },
        clearSearch() {
            this.query = ''
            this.suggestions = []
        }
    }
})
