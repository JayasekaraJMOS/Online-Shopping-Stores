/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // dark mode
        'electro-bg': '#0b0e14',
        'electro-card': '#1c222d',
        'electro-accent': '#00d2ff',
        'electro-state': '#39ff14',
        // light mode
        'lab-bg': '#f0f2f5',
        'lab-card': '#ffffff',
        'lab-accent': '#2980b9',
        'lab-state': '#27ae60',
        // extras
        'warning': '#ffcc00',
        'error': '#e74c3c',
        'neutral-100': '#f5f5f5',
        'neutral-200': '#eeeeee',
        'neutral-800': '#2c3e50',
      },
      boxShadow: {
        'electro-glow': '0 0 12px rgba(0,210,255,0.2)',
        'lab-soft': '0 4px 15px rgba(0,0,0,0.05)',
      },
      animation: {
        flicker: 'flicker 0.3s ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
          '20%': { opacity: '0.8', transform: 'translateY(-1px)' },
          '40%': { opacity: '0.9', transform: 'translateY(1px)' },
          '60%': { opacity: '0.85', transform: 'translateY(-0.5px)' },
        }
      }
    },
  },
  plugins: [],
}
