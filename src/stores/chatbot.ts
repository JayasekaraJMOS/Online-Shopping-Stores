import { defineStore } from 'pinia'
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"
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
let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

if (apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 20) {
  try {
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Updated to latest model
      systemInstruction: `You are Omaxy, the premium AI concierge for OMAX Online Store.
      Personality: Sophisticated, helpful, friendly, and uses emojis appropriately.
      Inventory Policy: You recommend REAL products from the store inventory provided in the context.
      Formatting: Use clean paragraphs. Mention prices clearly.
      Context: If the user is looking for something we don't have, politely suggest a related category from the store.
      Actions: You can suggest that the user "View Details" or "Add to Cart" (though you can't click for them yet).`
    })
    console.log('%c🤖 Omaxy AI: Gemini 2.0 Flash initialized successfully!', 'color: #4ade80; font-weight: bold;')
  } catch {
    model = null
    console.warn('🤖 Omaxy AI: Gemini init failed. Running in Smart Local mode.')
  }
} else {
  console.warn('🤖 Omaxy AI: No API key found. Running in Smart Local mode.')
}

// ── Smart Engine Knowledge ──────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  'smartphones': ['phone', 'mobile', 'iphone', 'android', 'samsung', 'smart phones', 'smartphones', 'cell'],
  'laptops': ['laptop', 'computer', 'macbook', 'pc', 'notebook', 'chromebook'],
  'tops': ['shirt', 't-shirt', 'top', 'blouse', 'clothing', 'fashion', 'wear'],
  'womens-bags': ['bag', 'handbag', 'purse', 'tote', 'clutch'],
  'womens-jewellery': ['jewellery', 'jewelry', 'necklace', 'ring', 'bracelet', 'gold', 'silver', 'earring'],
  'fragrances': ['perfume', 'scent', 'fragrance', 'cologne', 'spray'],
  'skin-care': ['cream', 'skin', 'beauty', 'face', 'lotion', 'makeup', 'moisturizer', 'serum'],
  'groceries': ['food', 'grocery', 'drink', 'snack', 'eat', 'fruit', 'vegetable'],
  'furniture': ['chair', 'table', 'sofa', 'couch', 'desk', 'bed', 'shelf', 'cabinet'],
  'motorcycle': ['bike', 'motorcycle', 'scooter', 'sportbike', 'moto'],
  'headphones': ['headphone', 'earphone', 'earbuds', 'airpods', 'headset', 'audio'],
  'tablets': ['tablet', 'ipad', 'tab'],
  'watches': ['watch', 'smartwatch', 'timepiece'],
}

const STOP_WORDS = new Set([
  'find', 'search', 'show', 'me', 'looking', 'for', 'need', 'want', 'buy', 'get',
  'please', 'the', 'a', 'i', 'recommend', 'give', 'now', 'assistant', 'can', 'do',
  'you', 'have', 'any', 'my', 'is', 'it', 'some', 'good', 'best', 'nice', 'cool',
  'would', 'like', 'could', 'please', 'suggest', 'are', 'there', 'what', 'which',
])

const INTENT_KEYWORDS: Record<string, string[]> = {
  order_status:  ['where is my order', 'track my order', 'track', 'order status', 'shipping', 'delivery', 'arrive', 'arrival', 'dispatched', 'shipped'],
  returns:       ['return', 'refund', 'exchange', 'broken', 'damaged', 'money back', 'send back', 'wrong item'],
  payments:      ['pay', 'payment', 'credit card', 'declined', 'charge', 'billing', 'invoice', 'transaction'],
  complaint:     ['angry', 'terrible', 'worst', 'fix', 'mad', 'frustrated', 'unacceptable', 'sucks', 'disappointed', 'bad experience', 'horrible'],
  human:         ['human', 'agent', 'support', 'real person', 'talk to someone', 'live chat', 'speak to'],
  greetings:     ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'howdy'],
  help:          ['help', 'who are you', 'what can you do', 'what do you do', 'how can you help'],
  discount:      ['discount', 'coupon', 'promo', 'sale', 'offer', 'deal', 'voucher', 'code', 'cheaper', 'save'],
  compare:       ['compare', 'difference', 'vs', 'versus', 'better', 'which one', 'recommend between'],
  popular:       ['popular', 'trending', 'best seller', 'top rated', 'most bought', 'hot', 'featured'],
}

// Rich, varied Smart Local responses
const BOT_PERSONA = "👋 Hi! I'm **Omaxy**, your smart shopping concierge at OMAX!"

const GREET_RESPONSES = [
  "👋 Hello! I'm Omaxy, your smart shopping assistant at OMAX. I can help you find products, track orders, handle returns, and more. What can I do for you today?",
  "Hi there! 😊 I'm Omaxy — OMAX's AI shopping concierge. Looking for something specific, or need help with an order?",
  "Hey! Welcome to OMAX 🛍️ I'm Omaxy, here to make your shopping experience amazing. How can I help?",
]

const HELP_RESPONSE = `I'm **Omaxy**, your AI shopping assistant for OMAX! 🤖✨

Here's what I can do for you:
🛍️ **Find Products** — Just ask! e.g. "Show me laptops under $500"
📦 **Track Orders** — Give me your order number
🔄 **Handle Returns** — I'll walk you through it
💬 **Answer Questions** — About products, shipping, payments
🎧 **Connect you to humans** — When you need a real person

What would you like help with?`

const DISCOUNT_RESPONSE = `Great news for savings! 💰 Here are OMAX's current deals:

🔖 **New User Bonus** — $10 OFF your first order (code: WELCOME10)
⚡ **Flash Sale** — Up to 50% off select items — check the homepage!
📱 **App Exclusive** — Extra 5% off when you order via our mobile app
🚚 **Free Shipping** — On orders above $50

Want me to find a specific product at the best price?`

const POPULAR_RESPONSE = "Let me pull up our best-selling products for you! 🔥"

const COMPARE_RESPONSE = `Great idea to compare before buying! 🤔

To help you compare, tell me the **two products** you're considering and I'll highlight the differences in price, features, and ratings.

Or just ask something like: *"Compare iPhone vs Samsung"* or *"Laptop vs tablet for studying"*`

const SMART_RESPONSES = {
  greetings: GREET_RESPONSES,
  help: HELP_RESPONSE,
  discount: DISCOUNT_RESPONSE,
  popular: POPULAR_RESPONSE,
  compare: COMPARE_RESPONSE,
  order_status_init: "I'd be happy to help you track your order! 📦\n\nPlease provide your **order number** (e.g. OMX-12345) and I'll check the latest status for you right away.",
  returns_init: "No worries, I'll sort this out for you! 🔄\n\nOMAX accepts returns within **30 days** of purchase on most items. Could you share your **order number** so I can pull up the details?",
  payments_init: "Sorry to hear you're having trouble with payment! 💳\n\nCan you describe the issue you're seeing? (e.g. card declined, wrong amount charged, etc.) I'll help resolve it quickly.",
  complaint_init: "I'm really sorry to hear about your experience — that's not what OMAX is about! 🙏\n\nI want to make this right for you. Could you share your **order number** or describe the issue in more detail so I can escalate this immediately?",
  human_init: "Of course! Let me connect you with a specialist. 🎧\n\nYou can reach our support team via:\n• **Live Chat** — Available 9am–9pm\n• **Email** — support@omax.store\n• **Phone** — +1 (234) 567-890\n\nWould you like me to continue helping you in the meantime?",
  fallback: "Hmm, I'm not quite sure about that one! 🤔\n\nTry asking me about products, orders, returns, or discounts. Or click one of the quick options below to get started.",
  fetching_product: (q: string) => `Let me search our inventory for **"${q}"**... 🔍`,
  product_found: "Great news! Here's what I found for you: 🎉",
  product_not_found: "I couldn't find an exact match right now 😕\n\nTry a different search term, or use the main search bar at the top of the page for full results!",
  order_confirmed: "✅ Found your order! It is currently being **processed** and should arrive within **3-5 business days**. You'll receive an email update when it ships. Anything else I can help with?",
  invalid_order: "That doesn't look like a valid order number 🤔 Order numbers usually start with 'OMX-' followed by digits.\n\nIf you're still having trouble, our human agents can look it up for you!",
}

export const useChatStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: JSON.parse(localStorage.getItem('omax_chat_history') || '[]') as Message[],
    isTyping: false,
    currentProduct: null as Product | null,
    isAiEnabled: !!(apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 20) && model !== null,
    isAiActive: false,
    expectingOrderId: false,
    suggestedActions: [
      { label: 'Track Order', icon: '📦', query: 'Where is my order?' },
      { label: 'View Products', icon: '🛍️', query: 'Show me smartphones' },
      { label: 'Return Item', icon: '🔄', query: 'How do I return an item?' },
      { label: 'Talk to Human', icon: '🎧', query: 'Talk to a human' }
    ]
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
      if (this.messages.length === 0) {
        this.addBotMessage(GREET_RESPONSES[0])
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
          this.isAiActive = true
          await this.handleAiResponse(text)
        } else {
          this.isAiActive = false
          // Simulate thinking delay for natural feel
          const delay = Math.min(Math.max(text.length * 12, 500), 1400)
          await new Promise(resolve => setTimeout(resolve, delay))
          await this.handleSmartResponse(text.toLowerCase())
        }
      } catch (err) {
        console.error('Chat error:', err)
        this.isAiActive = false
        this.addBotMessage("I hit a small snag! 😅 Please try again in a moment, or use the search bar above.")
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
      try {
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

        if (!model) {
          await this.handleSmartResponse(input.toLowerCase())
          return
        }
        const chatSession = model.startChat({ history })
        const finalPrompt = `${contextString}\nUser said: ${input}`

        const result = await chatSession.sendMessage(finalPrompt)
        const response = await result.response
        this.addBotMessage(response.text(), contextProducts.length > 0 ? contextProducts : undefined)
      } catch (aiErr: unknown) {
        const msg = aiErr instanceof Error ? aiErr.message : String(aiErr)
        console.error('Gemini API error:', msg)
        if (msg.includes('429') || msg.includes('quota')) {
          console.warn('Quota exceeded, falling back to Smart Local Engine')
          this.isAiEnabled = false // Disable AI for this session to avoid repeated errors
        }
        // Graceful fallback to local engine
        await this.handleSmartResponse(input.toLowerCase())
      } finally {
        this.isAiActive = false
      }
    },
    async handleSmartResponse(input: string) {
      const raw = input.toLowerCase().trim()

      // 1. Expecting an order ID
      if (this.expectingOrderId) {
        this.expectingOrderId = false
        const hasNumbers = /\d{3,}/.test(raw)
        if (hasNumbers) {
          this.addBotMessage(SMART_RESPONSES.order_confirmed)
        } else {
          this.addBotMessage(SMART_RESPONSES.invalid_order)
        }
        return
      }

      // 2. Intent Matching (check longest phrases first for accuracy)
      let matchedIntent = ''
      for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
        if (keywords.some(kw => raw.includes(kw))) {
          matchedIntent = intent
          break
        }
      }

      if (matchedIntent === 'greetings') {
        const r = GREET_RESPONSES[Math.floor(Math.random() * GREET_RESPONSES.length)]
        this.addBotMessage(r || GREET_RESPONSES[0])
        return
      }
      if (matchedIntent === 'help') {
        this.addBotMessage(SMART_RESPONSES.help)
        return
      }
      if (matchedIntent === 'discount') {
        this.addBotMessage(SMART_RESPONSES.discount)
        return
      }
      if (matchedIntent === 'compare') {
        this.addBotMessage(SMART_RESPONSES.compare)
        return
      }
      if (matchedIntent === 'popular') {
        this.addBotMessage(SMART_RESPONSES.popular)
        // Fetch trending smartphones as "popular" products
        try {
          const res = await fetch(`https://dummyjson.com/products?limit=3&sortBy=rating&order=desc`)
          const data = await res.json()
          if (data.products?.length > 0) {
            this.addBotMessage("Here are some of our top-rated items right now: 🌟", data.products)
          }
        } catch { /* silent */ }
        return
      }
      if (matchedIntent === 'order_status') {
        this.expectingOrderId = true
        this.addBotMessage(SMART_RESPONSES.order_status_init)
        return
      }
      if (matchedIntent === 'returns') {
        this.expectingOrderId = true
        this.addBotMessage(SMART_RESPONSES.returns_init)
        return
      }
      if (matchedIntent === 'payments') {
        this.addBotMessage(SMART_RESPONSES.payments_init)
        return
      }
      if (matchedIntent === 'complaint') {
        this.expectingOrderId = true
        this.addBotMessage(SMART_RESPONSES.complaint_init)
        return
      }
      if (matchedIntent === 'human') {
        this.addBotMessage(SMART_RESPONSES.human_init)
        return
      }

      // 3. If viewing a product, give context-aware response
      if (this.currentProduct) {
        const p = this.currentProduct
        const productKeywords = [
          'this', 'product', 'item', 'it', 'price', 'good', 'worth',
          'review', 'buy', 'explain', 'tell me', 'about', 'spec', 'feature',
          'lap', 'phone', 'detail', 'describe', 'info', 'is it', 'should i',
          'quality', 'recommend', 'opinion', 'thoughts', 'what do you think'
        ]
        if (productKeywords.some(kw => raw.includes(kw))) {
          this.addBotMessage(
            `You're viewing the **${p.title}** 🛍️\n\n📝 ${p.description}\n\n💰 Price: **$${p.price}**${p.discountPercentage ? ` (${Math.round(p.discountPercentage)}% OFF!)` : ''}\n⭐ Rating: **${p.rating ?? 'N/A'}**/5${p.brand ? `\n🏷️ Brand: **${p.brand}**` : ''}\n\nWould you like to add it to your cart, or shall I find something similar?`
          )
          return
        }
      }

      // 4. Product / Category Search
      const words = raw.split(/\s+/).filter(w => w.length > 1)
      const filteredWords = words.filter(w => !STOP_WORDS.has(w))
      const searchTerm = filteredWords.join(' ')

      let mappedCategory = ''
      for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
        if (keywords.some(kw => raw.includes(kw))) {
          mappedCategory = cat
          break
        }
      }

      if (!searchTerm && !mappedCategory) {
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
          const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=3`)
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
        this.addBotMessage("I hit a snag searching the inventory 😅 Try the search bar at the top for full results!")
      }
    },
    clearConversation() {
      this.messages = []
      localStorage.removeItem('omax_chat_history')
      this.addBotMessage(GREET_RESPONSES[0])
    },
    save() {
      localStorage.setItem('omax_chat_history', JSON.stringify(this.messages))
    }
  }
})
