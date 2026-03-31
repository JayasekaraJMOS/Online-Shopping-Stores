<script setup lang="ts">
import NavBar from '../components/NavBar.vue'

const appFeatures = [
  { icon: '⚡', title: 'Flash Deals First', desc: 'App users get 30-min early access to all Flash Sale items before anyone else.' },
  { icon: '🔔', title: 'Instant Alerts', desc: 'Push notifications for price drops on your wishlist and restocked favourites.' },
  { icon: '💳', title: 'App-Only Coupons', desc: 'Exclusive discount codes only redeemable through the mobile app.' },
  { icon: '🚀', title: 'Faster Checkout', desc: 'One-tap checkout with saved addresses and payment methods.' },
  { icon: '📦', title: 'Live Order Tracking', desc: 'Real-time parcel updates and live map tracking right in the app.' },
  { icon: '🎁', title: 'Coins & Rewards', desc: 'Earn OMAX Coins on every purchase and redeem them for free shipping.' },
]

const appCoupons = [
  { code: 'APP10', off: '10%', min: 0, color: '#2563EB' },
  { code: 'APPDEAL20', off: '20%', min: 50, color: '#7C3AED' },
  { code: 'APPCASH15', off: '$15', min: 80, color: '#DB2777' },
]
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">

    <!-- Hero -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #1E3A8A, #2563EB, #7C3AED);">
      <div class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div class="flex-1 text-white text-center md:text-left">
          <span class="text-xs font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">📱 Mobile Exclusive</span>
          <h1 class="text-4xl md:text-6xl font-black leading-tight mt-4 mb-4">
            Save More<br/><span class="text-yellow-300">On The App</span>
          </h1>
          <p class="text-white/80 text-lg mb-8 max-w-md">Shop smarter with exclusive app-only deals, early Flash Sale access, and real-time alerts.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#" class="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
              <span class="text-2xl">🍎</span>
              <div class="text-left">
                <p class="text-[10px] opacity-70 uppercase tracking-widest">Available on the</p>
                <p class="text-sm font-black">App Store</p>
              </div>
            </a>
            <a href="#" class="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
              <span class="text-2xl">▶️</span>
              <div class="text-left">
                <p class="text-[10px] opacity-70 uppercase tracking-widest">Get it on</p>
                <p class="text-sm font-black">Google Play</p>
              </div>
            </a>
          </div>
        </div>
        <!-- QR Card -->
        <div class="shrink-0 bg-white rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center gap-3">
          <p class="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Scan to Download</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://omax.store/app&bgcolor=FFFFFF&color=000000&margin=2"
            alt="Scan to download OMAX App"
            class="w-36 h-36 rounded-xl border border-gray-100"
          />
          <p class="text-xs text-gray-400 font-medium">Point your camera at the code</p>
          <div class="flex items-center gap-1 text-[10px] text-[#059669] font-black uppercase">
            <span>✓</span> Free — No ads
          </div>
        </div>
      </div>
    </section>

    <!-- App Exclusive Coupons -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0 flex items-center gap-2">
          <span>🎟️</span> App-Only Coupons
        </h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
        <span class="text-xs text-[var(--text-muted)] uppercase tracking-widest shrink-0">Use in app at checkout</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="c in appCoupons" :key="c.code"
          class="rounded-xl border-2 overflow-hidden"
          :style="{ borderColor: c.color }"
        >
          <div class="px-5 pt-5 pb-3" :style="{ background: c.color + '12' }">
            <span class="text-4xl font-black" :style="{ color: c.color }">{{ c.off }} OFF</span>
            <p class="text-xs text-[var(--text-muted)] mt-1">{{ c.min === 0 ? 'No minimum spend' : `Min. spend $${c.min}` }} · App only</p>
          </div>
          <div class="px-5 py-3 flex items-center justify-between border-t-2 border-dashed" :style="{ borderColor: c.color + '40' }">
            <code class="text-xs font-black uppercase tracking-widest" :style="{ color: c.color }">{{ c.code }}</code>
            <button class="text-xs font-black border-2 rounded-lg px-4 py-1.5 transition-all hover:text-white"
              :style="{ borderColor: c.color, color: c.color }"
              @mouseenter="(e) => { (e.target as HTMLElement).style.backgroundColor = c.color }"
              @mouseleave="(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = c.color }"
            >Copy Code</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="max-w-7xl mx-auto px-4 pb-16">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0 flex items-center gap-2">
          <span>✨</span> Why Use the App?
        </h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="f in appFeatures" :key="f.title"
          class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 flex gap-4 items-start hover:border-[var(--accent-color)] hover:shadow-lg transition-all duration-300 group"
        >
          <span class="text-3xl group-hover:scale-110 transition-transform duration-300 shrink-0">{{ f.icon }}</span>
          <div>
            <h3 class="font-black text-sm mb-1">{{ f.title }}</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>
