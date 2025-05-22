/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-charcoal': '#1A1D21',
        'dark-slate': '#252A30',
        'off-white': '#F0F0F0',
        'cool-gray': '#8A94A0',
        'electric-teal': '#00DFD0',
        'gray-divider': '#3A3F47',
        'vivid-mint-green': '#10B981',
        'bright-coral': '#FF4D4D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 15px 5px rgba(0, 223, 208, 0.3)',
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
      },
      keyframes: {
        modalShow: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Optional: Keyframes for checkmark animation if desired
        // drawCheck: {
        //   '0%': { strokeDashoffset: '100' },
        //   '100%': { strokeDashoffset: '0' },
        // },
      },
      animation: {
        modalShow: 'modalShow 0.3s ease-out forwards',
        // drawCheck: 'drawCheck 0.5s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
} 