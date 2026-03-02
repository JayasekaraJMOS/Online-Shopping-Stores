# Online Shopping Stores - Premium E-commerce Demo

A modern, fully-featured Single Page Application (SPA) built with Vue 3, TypeScript, and Tailwind CSS. This project consumes the DummyJSON API to display electronic components with a professional e-commerce interface.

## 🎯 Features Implemented

### Core Features (Mandatory)
- ✅ Vue 3 with Composition API
- ✅ Strict TypeScript with custom interfaces (no `any` types)
- ✅ Component-based architecture (6+ reusable components)
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Fetch data from DummyJSON API (`/products` endpoint)
- ✅ Search and filtering functionality
- ✅ Product detail view with Vue Router
- ✅ Tailwind CSS utility-first styling
- ✅ Vite build tool for fast development

### Bonus Features (A/A+ Grade)
- ✅ **Authentication System**: JWT token login using `/auth/login` endpoint
- ✅ **Shopping Cart**: Global state management with Pinia, persisted to localStorage
- ✅ **Dynamic Routing**: Vue Router with `/product/:id` and `/cart` routes
- ✅ **Dark Mode**: Toggle between light/dark themes with Tailwind's `dark:` modifier
- ✅ **Professional Polish**: Animations, hover states, loading indicators
- ✅ **Error Handling**: Try-catch blocks, validation, user feedback

## 🏗️ Component Architecture

```
ElectroHub (App.vue)
├── NavBar.vue
│   ├── Cart count badge
│   ├── Auth state (Login/Logout)
│   ├── Dark mode toggle
│   └── Navigation links
├── HomeView.vue
│   ├── Hero section
│   ├── Search bar
│   └── ProductCard Grid
│       └── ProductCard.vue (Reusable component)
├── ProductDetailView.vue
│   ├── Product image
│   ├── Details section
│   └── Add to cart button
├── CartView.vue
│   ├── Cart items list
│   ├── Order summary
│   └── Checkout actions
└── LoginView.vue
    ├── Login form
    ├── Demo accounts
    └── Error handling
```

## 📦 Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 3.x
- **Build Tool**: Vite 7+
- **State Management**: Pinia 3
- **Routing**: Vue Router 5
- **API**: DummyJSON (Public REST API)

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd -ElectroHub-Electronic-Modules-Store-SPA-Using-DummyJSON

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Login Credentials
Use these test accounts from DummyJSON:
- **Username**: `atuny0` | **Password**: `9uQFF12e`
- **Username**: `hbingley1` | **Password**: `CQutQ34Mz`

## 📋 Project Structure

```
src/
├── components/
│   ├── NavBar.vue          # Navigation with auth & dark mode
│   └── ProductCard.vue     # Reusable product card
├── stores/
│   ├── auth.ts             # JWT authentication state
│   ├── cart.ts             # Shopping cart state
│   └── theme.ts            # Dark mode state
├── router/
│   └── index.ts            # Vue Router configuration
├── types/
│   └── Product.ts          # TypeScript interfaces
├── views/
│   ├── LoginView.vue       # Authentication page
│   ├── HomeView.vue        # Products listing
│   ├── ProductDetailView.vue # Product details
│   └── CartView.vue        # Shopping cart
├── App.vue                 # Root component
├── main.ts                 # Entry point
└── style.css               # Global styles
```

## 🎯 Key Features Explained

### Authentication (Bonus Feature ⭐)
- Real JWT token login via DummyJSON API
- Token stored in localStorage
- Persistent user session across reloads
- Logout functionality

### Shopping Cart (Bonus Feature ⭐)
- Add products to cart
- Remove individual items
- Clear entire cart
- Persistent storage with localStorage
- Order summary with tax calculation

### Dark Mode (Bonus Feature ⭐)
- Toggle light/dark theme
- Preference saved to localStorage
- Respects system theme preference
- Smooth transitions between modes

### Search & Filter
- Real-time product search
- Minimum 3 characters or 0 to clear
- Dynamic API calls with debouncing

### Responsive Design
- Mobile-first approach
- Tailwind grid/flex utilities
- Optimized for all screen sizes

## 📝 Data Types (TypeScript Interfaces)

```typescript
interface Product {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating?: number
  stock?: number
  discountPercentage?: number
  sku?: string
  brand?: string
  reviews?: Review[]
  images?: string[]
}

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  token: string
}
```

## 🔄 API Integration

All data comes from the free, public DummyJSON API:
- **Base URL**: https://dummyjson.com
- **Endpoints Used**:
  - `GET /products?limit=50` - Fetch products
  - `GET /products/search?q=query` - Search products
  - `GET /products/:id` - Product details
  - `POST /auth/login` - User authentication

## 🌙 Dark Mode Colors

The app uses Tailwind's `dark:` modifier for seamless theme switching:
- Light mode: Bright whites and grays
- Dark mode: Gray-900 to gray-950 backgrounds
- All text has dark mode variants for readability

## 📦 State Management (Pinia)

### Cart Store
```typescript
- state: items[], 
- getters: count, total
- actions: add(), remove(), clear(), load(), save()
```

### Auth Store
```typescript
- state: user, isLoading, error
- getters: isAuthenticated, username
- actions: login(), logout(), loadSavedAuth()
```

### Theme Store
```typescript
- state: isDark
- actions: toggleDarkMode(), loadTheme(), updateDOM()
```

## 🎨 UI/UX Highlights

- **Gradient backgrounds** for modern look
- **Smooth transitions** on all interactive elements
- **Hover states** for better interactivity
- **Loading spinners** for async operations
- **Error messages** with color-coded alerts
- **Empty states** with helpful messages
- **Accessibility** with proper semantic HTML

## 🧪 Testing the App

1. **View Products**: Home page displays 50 electronic components
2. **Search**: Type in search bar to filter products
3. **View Details**: Click any product to see full details
4. **Add to Cart**: Use "Add to Cart" button to purchase
5. **Manage Cart**: View, remove items, or clear cart
6. **Login**: Try demo accounts to test auth system
7. **Dark Mode**: Toggle between light/dark themes

## 📄 Commit History

This project follows best practices with meaningful, atomic commits:
- Initial project setup
- Added Vue Router and Pinia
- Implemented product listing and search
- Added shopping cart functionality
- Implemented JWT authentication
- Added dark mode toggle
- Enhanced UI with Tailwind CSS

## 🎓 Learning Outcomes Achieved

- ✅ TypeScript interfaces for strict typing
- ✅ Async/await with fetch API
- ✅ Component composition and reusability
- ✅ State management with Pinia
- ✅ Vue Router navigation
- ✅ Responsive Tailwind CSS design
- ✅ Git version control best practices
- ✅ AI-assisted development for CSS/Types

---

**Grade Target**: A+ (85+/100)  
**Status**: All mandatory and bonus features implemented ✅
