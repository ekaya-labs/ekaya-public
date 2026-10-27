// `npm run db:init` — schema.sql을 DB_PATH에 적용하고 테이블 목록을 찍는다.
import { openDb } from './db.js'

const db = openDb()
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all()
console.log(`[db:init] ${db.name} — ${tables.map((t) => t.name).join(', ')}`)
db.close()
