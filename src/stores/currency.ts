import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Currency {
    code: string
    symbol: string
    flag: string
    rate: number // live rate vs USD
}

// Currencies with 0 decimal places
const ZERO_DECIMAL = new Set(['JPY', 'LKR'])

// Base definitions — fallback rates (used if API fails)
export const CURRENCIES = ref<Currency[]>([
    { code: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
    { code: 'EUR', symbol: '€', flag: '🇪🇺', rate: 1.09 },
    { code: 'GBP', symbol: '£', flag: '🇬🇧', rate: 1.28 },
    { code: 'LKR', symbol: '₨', flag: '🇱🇰', rate: 309.31 },
    { code: 'INR', symbol: '₹', flag: '🇮🇳', rate: 84.0 },
    { code: 'JPY', symbol: '¥', flag: '🇯🇵', rate: 149.4 },
    { code: 'AUD', symbol: 'A$', flag: '🇦🇺', rate: 0.66 },
    { code: 'CAD', symbol: 'C$', flag: '🇨🇦', rate: 0.74 },
])

export const useCurrencyStore = defineStore('currency', () => {
    const selectedCode = ref<string>(localStorage.getItem('currency') ?? 'USD')
    const ratesLoaded = ref(false)

    /** Fetch live USD-based rates */
    async function fetchLiveRates() {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const data = await res.json() as { result: string; rates: Record<string, number> }

            if (data.result === 'success') {
                CURRENCIES.value = CURRENCIES.value.map(c => ({
                    ...c,
                    rate: data.rates[c.code] ?? c.rate
                }))
            }
        } catch (e) {
            console.warn('[currency] Using fallback rates:', e)
        } finally {
            ratesLoaded.value = true
        }
    }

    const selected = computed<Currency>(() =>
        (CURRENCIES.value.find(c => c.code === selectedCode.value) ?? CURRENCIES.value[0]) as Currency
    )

    function setCurrency(code: string) {
        selectedCode.value = code
        localStorage.setItem('currency', code)
    }

    function format(usdPrice: number): string {
        const cur = selected.value
        const converted = usdPrice * cur.rate
        const decimals = ZERO_DECIMAL.has(cur.code) ? 0 : 2

        return `${cur.symbol}${converted.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}`
    }

    return {
        selectedCode,
        selected,
        ratesLoaded,
        CURRENCIES,
        setCurrency,
        format,
        fetchLiveRates
    }
})