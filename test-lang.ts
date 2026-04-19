import { defineStore, createPinia, setActivePinia } from 'pinia'
import { useLanguageStore } from './src/stores/language.js'

setActivePinia(createPinia())
const lang = useLanguageStore()

lang.setLanguage('SI')
console.log("Testing phrase 'Essence Mascara Lash Princess':")
console.log(lang.translateDynamic('Essence Mascara Lash Princess'))

console.log("\nTesting phrase 'Smartphones':")
console.log(lang.translateDynamic('Smartphones'))

