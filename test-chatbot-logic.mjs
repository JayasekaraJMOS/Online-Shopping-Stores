// Simulates the exact chatbot logic from chatbot.ts
// Run with: node test-chatbot-logic.mjs

const CATEGORY_MAP = {
  'smartphones': ['phone', 'mobile', 'iphone', 'android', 'samsung', 'smart phones', 'smartphones', 'cell'],
  'laptops': ['laptop', 'computer', 'macbook', 'pc', 'notebook', 'chromebook'],
  'tops': ['shirt', 't-shirt', 'top', 'blouse', 'clothing', 'fashion', 'wear'],
  'womens-bags': ['bag', 'handbag', 'purse', 'tote', 'clutch'],
  'fragrances': ['perfume', 'scent', 'fragrance', 'cologne', 'spray'],
  'skin-care': ['cream', 'skin', 'beauty', 'face', 'lotion', 'makeup'],
  'groceries': ['food', 'grocery', 'drink', 'snack', 'eat'],
  'furniture': ['chair', 'table', 'sofa', 'couch', 'desk', 'bed'],
  'watches': ['watch', 'smartwatch', 'timepiece'],
}

const STOP_WORDS = new Set([
  'find','search','show','me','looking','for','need','want','buy','get',
  'please','the','a','i','recommend','give','now','assistant','can','do',
  'you','have','any','my','is','it','some','good','best','nice','cool',
  'would','like','could','please','suggest','are','there','what','which',
])

const INTENT_KEYWORDS = {
  order_status:  ['where is my order','track my order','track','order status','shipping','delivery','arrive'],
  returns:       ['return','refund','exchange','broken','damaged','money back'],
  payments:      ['pay','payment','credit card','declined','charge','billing'],
  complaint:     ['angry','terrible','worst','fix','mad','frustrated','unacceptable','sucks'],
  human:         ['human','agent','support','real person','talk to someone','live chat'],
  greetings:     ['hello','hi','hey','greetings','good morning'],
  help:          ['help','who are you','what can you do','how can you help'],
  discount:      ['discount','coupon','promo','sale','offer','deal','voucher','code','cheaper','save'],
  compare:       ['compare','difference','vs','versus','better','which one'],
  popular:       ['popular','trending','best seller','top rated','most bought','hot'],
}

const PRODUCT_KEYWORDS = [
  'this','product','item','it','price','good','worth','review','buy',
  'explain','tell me','about','spec','feature','lap','phone','detail',
  'describe','info','is it','should i','quality','recommend','opinion'
]

async function mockChat(input, currentProduct = null) {
  const raw = input.toLowerCase().trim()

  // Intent matching
  let matchedIntent = ''
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => raw.includes(kw))) {
      matchedIntent = intent
      break
    }
  }

  if (matchedIntent === 'greetings') return { type: 'greeting', text: "👋 Hello! I'm Omaxy, your smart shopping assistant at OMAX!" }
  if (matchedIntent === 'help') return { type: 'help', text: "I'm Omaxy! I can find products, track orders, handle returns, list discounts, and more." }
  if (matchedIntent === 'discount') return { type: 'discount', text: "🔖 New User Bonus: $10 OFF (WELCOME10) | ⚡ Flash Sale: up to 50% off | 📱 App: extra 5% off" }
  if (matchedIntent === 'compare') return { type: 'compare', text: "Tell me the two products you want to compare!" }
  if (matchedIntent === 'popular') {
    const res = await fetch('https://dummyjson.com/products?limit=3&sortBy=rating&order=desc')
    const data = await res.json()
    return { type: 'popular', text: "Here are our top-rated products:", products: data.products.map(p => `${p.title} ($${p.price} ⭐${p.rating})`) }
  }
  if (matchedIntent === 'order_status') return { type: 'order', text: "Please provide your order number and I'll check the status." }
  if (matchedIntent === 'returns') return { type: 'returns', text: "OMAX accepts returns within 30 days. Please share your order number." }
  if (matchedIntent === 'payments') return { type: 'payments', text: "What payment error are you seeing? I'll help resolve it." }
  if (matchedIntent === 'complaint') return { type: 'complaint', text: "I'm sorry to hear that! Please share your order number so I can escalate this." }
  if (matchedIntent === 'human') return { type: 'human', text: "You can reach support via Live Chat, Email (support@omax.store), or Phone (+1 234 567 890)" }

  // Product context
  if (currentProduct && PRODUCT_KEYWORDS.some(kw => raw.includes(kw))) {
    return { type: 'product_context', text: `You're viewing the ${currentProduct.title} at $${currentProduct.price}. Rating: ${currentProduct.rating}/5. ${currentProduct.description.slice(0, 80)}...` }
  }

  // Product search
  const filteredWords = raw.split(/\s+/).filter(w => !STOP_WORDS.has(w))
  const searchTerm = filteredWords.join(' ')
  let mappedCategory = ''
  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(kw => raw.includes(kw))) { mappedCategory = cat; break }
  }

  if (!searchTerm && !mappedCategory) return { type: 'fallback', text: "I'm not sure about that. Try asking about products, orders, or discounts!" }

  try {
    let products = []
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
      return { type: 'products', text: 'I found these for you:', products: products.map(p => `${p.title} ($${p.price} ⭐${p.rating})`) }
    }
    return { type: 'not_found', text: "Couldn't find that. Try a different search term!" }
  } catch {
    return { type: 'error', text: "Search failed. Please try the search bar!" }
  }
}

// ─── Run all tests ───────────────────────────────────────────────────────────
const tests = [
  { input: 'hello', desc: 'Greeting' },
  { input: 'who are you', desc: 'Help / Identity' },
  { input: 'show me laptops', desc: 'Product Search (laptops)' },
  { input: 'i want a phone', desc: 'Product Search (smartphones)' },
  { input: 'what discounts do you have', desc: 'Discounts' },
  { input: "what's popular", desc: 'Popular products (live API)' },
  { input: 'track my order', desc: 'Order Tracking' },
  { input: 'i want to return something', desc: 'Returns' },
  { input: 'i am so frustrated', desc: 'Complaint' },
  { input: 'talk to a human', desc: 'Human escalation' },
  { input: 'compare iphone vs samsung', desc: 'Product Compare' },
  { input: 'explain about this lap', desc: 'Product Context (w/ product)', product: { title: 'Asus Zenbook Pro', price: 1299, rating: 3.95, description: 'A powerful dual-screen laptop with OLED displays.' } },
  { input: 'blah xyz foobar', desc: 'Fallback (unknown input)' },
]

console.log('\n🤖 OMAXY CHATBOT - LOCAL ENGINE TEST\n' + '='.repeat(50))
let passed = 0

for (const test of tests) {
  process.stdout.write(`\n📝 "${test.input}" [${test.desc}]\n`)
  try {
    const result = await mockChat(test.input, test.product || null)
    console.log(`   ✅ Type: ${result.type}`)
    console.log(`   💬 ${result.text.slice(0, 100)}`)
    if (result.products) console.log(`   📦 Products: ${result.products.join(' | ')}`)
    passed++
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`)
  }
}

console.log('\n' + '='.repeat(50))
console.log(`✅ ${passed}/${tests.length} tests passed\n`)
