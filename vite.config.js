import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      // setup the plugin
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
  ],
  server: {
    // proxy requests prefixed '/api' and '/uploads'
    proxy: {
      '/api': "https://ecommerce-backend-8pl4.onrender.com",
      '/uploads': "https://ecommerce-backend-8pl4.onrender.com",
    },
  },
})
// "https://ecommerce-backend-8pl4.onrender.com"
