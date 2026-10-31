import { defineConfig } from 'vitest/config'

// 시험은 저장소 루트 기준 — vite.config.js의 root('web')를 따라가지 않게 따로 둔다.
export default defineConfig({ test: { include: ['test/**/*.test.js'] } })
