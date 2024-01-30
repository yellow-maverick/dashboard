import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/

import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({ include: [path.resolve(__dirname, './src/locales/*.json')] })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
})
