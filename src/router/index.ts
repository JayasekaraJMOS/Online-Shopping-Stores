import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { title: 'Login - ElectroHub' } },
    { path: '/register', component: RegisterView, meta: { title: 'Register - ElectroHub' } },
    { path: '/', component: HomeView, meta: { title: 'Home - ElectroHub' } },
    { path: '/product/:id', component: ProductDetailView, meta: { title: 'Product Details - ElectroHub' } },
    { path: '/cart', component: CartView, meta: { title: 'Shopping Cart - ElectroHub' } },
    { path: '/checkout', component: () => import('../views/CheckoutView.vue'), meta: { title: 'Checkout - ElectroHub' } },
    { path: '/profile', component: () => import('../views/ProfileView.vue'), meta: { title: 'Profile - ElectroHub' } }
  ]
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'ElectroHub'
})

export default router