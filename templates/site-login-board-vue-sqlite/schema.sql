-- 데이터베이스 스키마 (SQLite).
--
-- ▶ 이 파일 자리에 데이터 모델러가 낸 DDL(`modeler.propose_migration_ddl`)을 넣는다.
--   서버 코드(server/*.js)는 아래 세 테이블·열 이름을 쓴다. 모델러에서 이름을 바꿨으면 server/ 의 SQL도 같이 바꾼다.
-- ▶ `npm run db:init`이 이 파일을 DB_PATH(기본 data/app.sqlite)에 적용한다. 서버도 시작할 때 없는 테이블만 만든다.

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT    NOT NULL,
  body       TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
