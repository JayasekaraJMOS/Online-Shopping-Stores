<script setup lang="ts">
import NavBar from '../components/NavBar.vue'

const benefits = [
  { icon: '💰', title: 'Zero Listing Fees', desc: 'List your first 100 products for free. No upfront costs, no hidden charges.' },
  { icon: '🌍', title: 'Reach Millions', desc: 'Tap into OMAX\'s growing customer base across the country.' },
  { icon: '📊', title: 'Seller Dashboard', desc: 'Real-time analytics, inventory management, and revenue tracking in one place.' },
  { icon: '🛡️', title: 'Seller Protection', desc: 'Secure payouts, fraud prevention, and dedicated dispute resolution support.' },
  { icon: '📦', title: 'Logistics Support', desc: 'Integrated shipping partners with discounted rates for OMAX sellers.' },
  { icon: '📣', title: 'Marketing Tools', desc: 'Run voucher campaigns, sponsored listings, and flash sale slots.' },
]

const steps = [
  { n: '01', title: 'Register', desc: 'Create your seller account with basic business details in minutes.' },
  { n: '02', title: 'List Products', desc: 'Upload your inventory with photos, descriptions, and pricing.' },
  { n: '03', title: 'Start Selling', desc: 'Go live and start receiving orders from customers nationwide.' },
  { n: '04', title: 'Get Paid', desc: 'Receive weekly automated payouts directly to your bank account.' },
]

const plans = [
  { name: 'Starter', price: 'Free', color: '#059669', perks: ['100 free listings', 'Basic analytics', 'Standard support', 'Commission: 8%'] },
  { name: 'Pro', price: '$29/mo', color: '#2563EB', perks: ['Unlimited listings', 'Advanced analytics', 'Priority support', 'Commission: 5%', 'Flash sale access'] },
  { name: 'Enterprise', price: 'Custom', color: '#7C3AED', perks: ['Dedicated manager', 'API access', '24/7 support', 'Commission: 3%', 'Custom storefront'] },
]
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">

    <!-- Hero -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #064E3B, #059669, #10B981);">
      <div class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle at 30% 60%, white 1px, transparent 1px); background-size: 35px 35px;"></div>
      <div class="max-w-7xl mx-auto px-4 py-20 text-white text-center relative z-10">
        <span class="text-xs font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">🏪 Seller Programme</span>
        <h1 class="text-4xl md:text-6xl font-black mt-5 mb-5 leading-tight">
          Grow Your Business<br/>
          <span class="text-yellow-300">With OMAX</span>
        </h1>
        <p class="text-white/80 text-lg mb-10 max-w-xl mx-auto">Join thousands of sellers already earning on OMAX. Zero setup costs, powerful tools, and millions of waiting customers.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-[#059669] font-black px-10 py-4 rounded-xl text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
            Register as Seller
          </button>
          <button class="border-2 border-white text-white font-black px-10 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
            Learn More ↓
          </button>
        </div>
        <!-- Stats -->
        <div class="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          <div>
            <p class="text-3xl font-black text-yellow-300">50K+</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">Active Sellers</p>
          </div>
          <div class="border-x border-white/20">
            <p class="text-3xl font-black text-yellow-300">2M+</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">Customers</p>
          </div>
          <div>
            <p class="text-3xl font-black text-yellow-300">$12M</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">Paid Out</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">🗺️ How It Works</h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="step in steps" :key="step.n"
          class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          <span class="absolute top-4 right-5 text-6xl font-black text-[var(--border-color)] leading-none select-none">{{ step.n }}</span>
          <div class="relative z-10">
            <h3 class="font-black text-base mb-2 text-[var(--accent-color)] group-hover:underline">{{ step.title }}</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="bg-[var(--card-bg)] border-y border-[var(--border-color)]">
      <div class="max-w-7xl mx-auto px-4 py-14">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-sm font-black uppercase tracking-widest shrink-0">✨ Seller Benefits</h2>
          <div class="h-px flex-grow bg-[var(--border-color)]"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="b in benefits" :key="b.title"
            class="flex items-start gap-4 p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-md transition-all duration-300 group bg-[var(--bg-color)]"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform duration-300 shrink-0">{{ b.icon }}</span>
            <div>
              <h3 class="font-black text-sm mb-1">{{ b.title }}</h3>
              <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">💳 Seller Plans</h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(plan, i) in plans" :key="plan.name"
          class="rounded-2xl border-2 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          :style="{ borderColor: plan.color }"
        >
          <div class="px-6 py-5 text-white" :style="{ background: plan.color }">
            <div class="flex items-center justify-between">
              <p class="font-black uppercase tracking-widest text-sm">{{ plan.name }}</p>
              <span v-if="i === 1" class="text-[10px] font-black bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full uppercase">Popular</span>
            </div>
            <p class="text-3xl font-black mt-2">{{ plan.price }}</p>
          </div>
          <div class="px-6 py-5 bg-[var(--card-bg)]">
            <ul class="space-y-2 mb-6">
              <li v-for="perk in plan.perks" :key="perk" class="flex items-center gap-2 text-xs font-medium">
                <span :style="{ color: plan.color }" class="font-black">✓</span>
                {{ perk }}
              </li>
            </ul>
            <button
              class="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90"
              :style="{ background: plan.color, color: 'white' }"
            >Get Started</button>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>
