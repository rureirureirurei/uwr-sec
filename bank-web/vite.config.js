import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import config from '../config.json'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: config.web.port,
    https: {
      key: fs.readFileSync(config.https.key),
      cert: fs.readFileSync(config.https.certificate)
    },
    host: '0.0.0.0',
  }
})
