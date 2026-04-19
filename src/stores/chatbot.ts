import { defineStore } from 'pinia'
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { Product } from '../types/Product'

export interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  products?: Product[]
  timestamp: Date
}

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
let genAI: any = null
let model: any = null

if (apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 20) {
  genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are Omaxy, an intelligent, friendly AI assistant for OMAX Online Store. Use emojis. You recommend REAL products from the store inventory provided in the context. If products are provided, mention them. If no products are found, suggest searching for categories."
  })
}

// ── Smart Engine Knowledge ──────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  'smartphones': ['phone', 'mobile', 'iphone', 'android', 'samsung', 'smart phones', 'smartphones'],
  'laptops': ['laptop', 'computer', 'macbook', 'pc', 'desktop'],
  'tops': ['shirt', 't-shirt', 'top', 'clothing', 'fashion'],
  'womens-bags': ['bag', 'handbag', 'purse'],
  'womens-jewellery': ['jewellery', 'jewelry', 'necklace', 'ring', 'gold'],
  'fragrances': ['perfume', 'scent', 'fragrance', 'cologne'],
  'skin-care': ['cream', 'skin', 'beauty', 'face', 'lotion', 'makeup'],
  'groceries': ['food', 'grocery', 'drink', 'snack', 'eat'],
  'furniture': ['chair', 'table', 'sofa', 'desk', 'bed'],
  'motorcycle': ['bike', 'motorcycle', 'scooter', 'sportbike'],
}

const STOP_WORDS = new Set(['find', 'search', 'show', 'me', 'looking', 'for', 'need', 'want', 'buy', 'get', 'please', 'the', 'a', 'i', 'recomend', 'recommend', 'give', 'now', 'assistant', 'can', 'do', 'you', 'have', 'any', 'my', 'is', 'it']);

const INTENT_KEYWORDS = {
  order_status: ['where is my order', 'track', 'status', 'shipping', 'delivery', 'arrive', 'arrival'],
  returns: ['return', 'refund', 'exchange', 'broken', 'damaged', 'money back'],
  payments: ['pay', 'payment', 'credit card', 'declined', 'error', 'charge'],
  complaint: ['angry', 'terrible', 'worst', 'fix', 'mad', 'frustrated', 'unacceptable', 'bullshit', 'sucks'],
  human: ['human', 'agent', 'support', 'real person', 'talk to someone'],
  greetings: ['hi', 'hello', 'hey', 'who are you', 'help'],
}

const SMART_RESPONSES = {
  greetings: [
    "👋 Hello! I'm Omaxy, your smart shopping assistant. How can I help you today?",
    "Hi there! Searching for something special or need help with an order? I'm here to help!"
  ],
  order_status_init: "I’d be happy to help you track your order 😊\nPlease provide your order number, and I’ll check the latest status for you.",
  returns_init: "We accept returns within 30 days of purchase.\nPlease share your order number, and I’ll guide you through the return process.",
  payments_init: "Sorry for the trouble!\nCan you tell me what error you’re seeing? I’ll help you resolve it quickly.",
  complaint_init: "I understand your frustration, and I’m really sorry for the inconvenience.\nLet me fix this for you as quickly as possible. Could you share your order details?",
  human_init: "I can connect you with a specialist. Please click here to [Talk to a Human Support Agent] or call us at +1 234 567 890.",
  fallback: "I’m sorry, I didn’t quite understand that.\nCan you rephrase your question or choose one of the options below?",
  fetching_product: (q: string) => `Let me check our inventory for "${q}"...`,
  product_found: "I found these great matches for you:",
  product_not_found: "I couldn't find exactly that right now. Could you try a different category?",
}

export const useChatStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: JSON.parse(localStorage.getItem('omax_chat_history') || '[]') as Message[],
    isTyping: false,
    currentProduct: null as Product | null,
    isAiEnabled: !!(apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 20),
    expectingOrderId: false
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
      if (this.messages.length === 0) {
        this.addBotMessage(SMART_RESPONSES.greetings[Math.floor(Math.random() * SMART_RESPONSES.greetings.length)] || '')
      }
    },
    setContextProduct(p: Product | null) {
      this.currentProduct = p
    },
    async sendMessage(text: string) {
      if (!text.trim()) return

      const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() }
      this.messages.push(userMsg)
      this.save()
      this.isTyping = true
      
      try {
        if (this.isAiEnabled && model) {
          await this.handleAiResponse(text)
        } else {
          // Smart Local Intended Engine
          const delay = Math.min(Math.max(text.length * 15, 600), 1600)
          await new Promise(resolve => setTimeout(resolve, delay))
          await this.handleSmartResponse(text.toLowerCase())
        }
      } catch (err) {
        console.error('Chat error:', err)
        this.addBotMessage("I hit a snag. Please try again or use the main search bar!")
      } finally {
        this.isTyping = false
      }
    },
    addBotMessage(text: string, products?: Product[]) {
      this.messages.push({
        id: Date.now() + 1,
        role: 'bot',
        text,
        products,
        timestamp: new Date()
      })
      this.save()
    },
    async handleAiResponse(input: string) {
      const query = input.toLowerCase().split(' ').filter(w => !STOP_WORDS.has(w)).join(' ')
      let contextProducts: Product[] = []
      if (query.length > 2) {
        const res = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=3`)
        const data = await res.json()
        contextProducts = data.products
      }

      const history = this.messages.slice(-10, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))

      let contextString = "INVENTORY CONTEXT:\n"
      if (this.currentProduct) {
        contextString += `Current Product being viewed: ${this.currentProduct.title} ($${this.currentProduct.price}). Description: ${this.currentProduct.description}\n`
      }
      if (contextProducts.length > 0) {
        contextString += `Found in Warehouse: ${contextProducts.map(p => `${p.title} ($${p.price})`).join(', ')}\n`
      } else {
        contextString += "No specific items found in warehouse for this query.\n"
      }

      const chatSession = model.startChat({ history })
      const finalPrompt = `${contextString}\nUser said: ${input}`
      
      const result = await chatSession.sendMessage(finalPrompt)
      const response = await result.response
      this.addBotMessage(response.text(), contextProducts.length > 0 ? contextProducts : undefined)
    },
    async handleSmartResponse(input: string) {
       const raw = input.toLowerCase()

       // 1. Check if we were expecting an order ID (mock state flow)
       if (this.expectingOrderId) {
         this.expectingOrderId = false
         const hasNumbers = /\d/.test(raw)
         if (hasNumbers) {
           this.addBotMessage("Thank you! I see your order. It is currently being processed and should arrive within 3-5 business days. Let me know if you need anything else!")
           return
         } else {
           this.addBotMessage("That doesn't look like a valid order number, but our human agents can help verify it for you!")
           return
         }
       }

       // 2. Intent Matching
       let matchedIntent = ''
       for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
         if (keywords.some(kw => raw.includes(kw))) {
           matchedIntent = intent
           break
         }
       }

       if (matchedIntent === 'greetings') {
         this.addBotMessage(SMART_RESPONSES.greetings[0] || '')
         return
       } else if (matchedIntent === 'order_status') {
         this.expectingOrderId = true
         this.addBotMessage(SMART_RESPONSES.order_status_init)
         return
       } else if (matchedIntent === 'returns') {
         this.expectingOrderId = true
         this.addBotMessage(SMART_RESPONSES.returns_init)
         return
       } else if (matchedIntent === 'payments') {
         this.addBotMessage(SMART_RESPONSES.payments_init)
         return
       } else if (matchedIntent === 'complaint') {
         this.expectingOrderId = true
         this.addBotMessage(SMART_RESPONSES.complaint_init)
         return
       } else if (matchedIntent === 'human') {
         this.addBotMessage(SMART_RESPONSES.human_init)
         return
       }

       // 3. Fallback to Product Search / Category search
       const words = raw.split(/\s+/).filter(w => w.length > 0)
       const filteredWords = words.filter(w => !STOP_WORDS.has(w))
       const searchTerm = filteredWords.join(' ')
       let mappedCategory = ""
       for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
         if (keywords.some(kw => raw.includes(kw))) {
           mappedCategory = cat
           break
         }
       }

       if (!searchTerm && !mappedCategory) {
         // Log the unanswered question
         const unanswered = JSON.parse(localStorage.getItem('omax_unanswered_logs') || '[]')
         unanswered.push({ input, date: new Date() })
         localStorage.setItem('omax_unanswered_logs', JSON.stringify(unanswered))

         this.addBotMessage(SMART_RESPONSES.fallback)
         return
       }

       const searchLabel = searchTerm || mappedCategory
       this.addBotMessage(SMART_RESPONSES.fetching_product(searchLabel))

       try {
         let products: Product[] = []
         if (searchTerm) {
           const res = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}&limit=3`)
           const data = await res.json()
           products = data.products
         }
         if (products.length === 0 && mappedCategory) {
           const res = await fetch(`https://dummyjson.com/products/category/${mappedCategory}?limit=3`)
           const data = await res.json()
           products = data.products
         }

         if (products.length > 0) {
           this.addBotMessage(SMART_RESPONSES.product_found, products)
         } else {
           this.addBotMessage(SMART_RESPONSES.product_not_found)
         }
       } catch {
         this.addBotMessage("I hit a snag in the warehouse. Please try the standard search bar at the top!")
       }
    },
    clearConversation() {
      this.messages = []
      localStorage.removeItem('omax_chat_history')
      this.addBotMessage(SMART_RESPONSES.greetings[0] || '')
    },
    save() {
      localStorage.setItem('omax_chat_history', JSON.stringify(this.messages))
    }
  }
})
