/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF6B00',
          'orange-light': '#FF8C3A',
          'orange-dark': '#E05A00',
          gold: '#F5A623',
          'gold-light': '#FFD166',
          dark: '#0A0A0F',
          'dark-2': '#12121A',
          'dark-3': '#1A1A26',
          'dark-4': '#222235',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF6B00, 0 0 10px #FF6B00' },
          '100%': { boxShadow: '0 0 20px #FF6B00, 0 0 40px #FF8C3A, 0 0 60px #FF6B00' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #1A0A00 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,107,0,0.1), rgba(18,18,26,0.9))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.2) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
