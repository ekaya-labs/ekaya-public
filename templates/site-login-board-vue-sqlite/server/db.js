// SQLite 열기 + schema.sql 적용. 경로는 환경 변수 DB_PATH(기본 data/app.sqlite), 테스트는 ':memory:'.
import Database from 'better-sqlite3'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export function openDb(path = process.env.DB_PATH ?? join(ROOT, 'data', 'app.sqlite')) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(readFileSync(join(ROOT, 'schema.sql'), 'utf8'))
  return db
}
