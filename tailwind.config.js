/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // High-end premium dark mode color scheme
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          // Re-routing dark colors to high-contrast neon variants
          500: '#64748b',
          600: '#475569',
          800: '#110b29', // Ultra-deep purple-tinted card borders
          //900: '#ffffff', // Force high-contrast white text for titles
          950: '#060212', // Ultimate deep velvet night background 
        },
        indigo: {
          400: '#b19ffb', // Hyper-vibrant pastel purple text
          500: '#7c3aed', // Electric violet accents
          600: '#6d28d9', 
        }
      },
      // Smooth fade-in animation for tab transitions
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}