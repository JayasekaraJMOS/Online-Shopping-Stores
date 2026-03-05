import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useThemeStore } from './stores/theme'
import { useCurrencyStore } from './stores/currency'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme before mount
const themeStore = useThemeStore(pinia)
themeStore.loadTheme()

// Fetch live currency rates in background (non-blocking)
const currencyStore = useCurrencyStore(pinia)
currencyStore.fetchLiveRates()

app.mount('#app')