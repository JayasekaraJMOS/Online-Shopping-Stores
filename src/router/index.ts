import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SaveMoreView from '../views/SaveMoreView.vue'
import SellerView from '../views/SellerView.vue'
import HelpView from '../views/HelpView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { title: 'Login - OMAX' } },
    { path: '/register', component: RegisterView, meta: { title: 'Register - OMAX' } },
    { path: '/', component: HomeView, meta: { title: 'Home - OMAX' } },
    { path: '/product/:id', component: ProductDetailView, meta: { title: 'Product Details - OMAX' } },
    { path: '/cart', component: CartView, meta: { title: 'Shopping Cart - OMAX' } },
    { path: '/checkout', component: () => import('../views/CheckoutView.vue'), meta: { title: 'Checkout - OMAX' } },
    { path: '/profile', component: () => import('../views/ProfileView.vue'), meta: { title: 'Profile - OMAX' } },
    { path: '/save-more', component: SaveMoreView, meta: { title: 'Save More on App - OMAX' } },
    { path: '/become-a-seller', component: SellerView, meta: { title: 'Become a Seller - OMAX' } },
    { path: '/help', component: HelpView, meta: { title: 'Help & Support - OMAX' } }
  ]
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'OMAX'
})

export default router