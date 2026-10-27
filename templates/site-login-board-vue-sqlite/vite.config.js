import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 화면 개발 서버는 /api를 Node 서버(PORT, 기본 3000)로 넘긴다. 빌드 결과(dist/)는 Node 서버가 직접 서빙한다.
export default defineConfig({
  root: 'web',
  plugins: [vue()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: { proxy: { '/api': `http://127.0.0.1:${process.env.PORT ?? 3000}` } },
})
