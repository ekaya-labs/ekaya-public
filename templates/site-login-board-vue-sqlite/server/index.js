// 서버 진입점 — API + 빌드된 화면(dist/) 정적 서빙. 포트는 환경 변수 PORT(기본 3000).
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { openDb } from './db.js'
import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 3000)
const app = createApp(openDb())
app.use('/*', serveStatic({ root: './dist' }))
app.get('*', serveStatic({ path: './dist/index.html' }))

serve({ fetch: app.fetch, port, hostname: process.env.HOST ?? '127.0.0.1' }, (info) => {
  console.log(`[server] http://${info.address}:${info.port}`)
})
