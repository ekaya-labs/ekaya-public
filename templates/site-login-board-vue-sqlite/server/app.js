// API — 회원가입·로그인(세션 쿠키)·게시판 CRUD. 오류는 문장이 아니라 코드로 돌려준다(화면이 언어별 문구로 바꾼다).
import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'sid'
const SESSION_DAYS = 7

function hashPassword(password) {
  const salt = randomBytes(16)
  return `${salt.toString('hex')}:${scryptSync(password, salt, 32).toString('hex')}`
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const actual = scryptSync(password, Buffer.from(salt, 'hex'), 32)
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'))
}

const fail = (c, status, code) => c.json({ error: code }, status)

/** @param {import('better-sqlite3').Database} db */
export function createApp(db, { secureCookie = process.env.COOKIE_SECURE === '1' } = {}) {
  const app = new Hono()

  const currentUser = (c) => {
    const sid = getCookie(c, SESSION_COOKIE)
    if (!sid) return null
    return db.prepare(
      `SELECT u.id, u.username FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now')`,
    ).get(sid) ?? null
  }

  const startSession = (c, userId) => {
    const sid = randomBytes(24).toString('base64url')
    db.prepare(`INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', ?))`).run(sid, userId, `+${SESSION_DAYS} days`)
    setCookie(c, SESSION_COOKIE, sid, { httpOnly: true, sameSite: 'Lax', secure: secureCookie, path: '/', maxAge: SESSION_DAYS * 86400 })
  }

  const readCredentials = async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const username = String(body.username ?? '').trim()
    const password = String(body.password ?? '')
    return { username, password }
  }

  app.post('/api/signup', async (c) => {
    const { username, password } = await readCredentials(c)
    if (username.length < 3 || password.length < 8) return fail(c, 400, 'INVALID_CREDENTIALS_FORMAT')
    if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) return fail(c, 409, 'USERNAME_TAKEN')
    const { lastInsertRowid } = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hashPassword(password))
    startSession(c, Number(lastInsertRowid))
    return c.json({ id: Number(lastInsertRowid), username }, 201)
  })

  app.post('/api/login', async (c) => {
    const { username, password } = await readCredentials(c)
    const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username)
    if (!user || !verifyPassword(password, user.password_hash)) return fail(c, 401, 'LOGIN_FAILED')
    startSession(c, user.id)
    return c.json({ id: user.id, username: user.username })
  })

  app.post('/api/logout', (c) => {
    const sid = getCookie(c, SESSION_COOKIE)
    if (sid) db.prepare('DELETE FROM sessions WHERE id = ?').run(sid)
    deleteCookie(c, SESSION_COOKIE, { path: '/' })
    return c.body(null, 204)
  })

  app.get('/api/me', (c) => {
    const user = currentUser(c)
    return user ? c.json(user) : fail(c, 401, 'NOT_LOGGED_IN')
  })

  app.get('/api/posts', (c) => c.json(db.prepare(
    `SELECT p.id, p.title, p.created_at AS createdAt, u.username AS author
     FROM posts p JOIN users u ON u.id = p.author_id ORDER BY p.created_at DESC, p.id DESC LIMIT 100`,
  ).all()))

  const findPost = (id) => db.prepare(
    `SELECT p.id, p.title, p.body, p.author_id AS authorId, u.username AS author, p.created_at AS createdAt, p.updated_at AS updatedAt
     FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?`,
  ).get(id)

  app.get('/api/posts/:id', (c) => {
    const post = findPost(Number(c.req.param('id')))
    return post ? c.json(post) : fail(c, 404, 'POST_NOT_FOUND')
  })

  const readPost = async (c) => {
    const body = await c.req.json().catch(() => ({}))
    return { title: String(body.title ?? '').trim(), body: String(body.body ?? '') }
  }

  app.post('/api/posts', async (c) => {
    const user = currentUser(c)
    if (!user) return fail(c, 401, 'NOT_LOGGED_IN')
    const { title, body } = await readPost(c)
    if (!title) return fail(c, 400, 'TITLE_REQUIRED')
    const { lastInsertRowid } = db.prepare('INSERT INTO posts (author_id, title, body) VALUES (?, ?, ?)').run(user.id, title, body)
    return c.json(findPost(Number(lastInsertRowid)), 201)
  })

  app.put('/api/posts/:id', async (c) => {
    const user = currentUser(c)
    if (!user) return fail(c, 401, 'NOT_LOGGED_IN')
    const post = findPost(Number(c.req.param('id')))
    if (!post) return fail(c, 404, 'POST_NOT_FOUND')
    if (post.authorId !== user.id) return fail(c, 403, 'NOT_AUTHOR')
    const { title, body } = await readPost(c)
    if (!title) return fail(c, 400, 'TITLE_REQUIRED')
    db.prepare(`UPDATE posts SET title = ?, body = ?, updated_at = datetime('now') WHERE id = ?`).run(title, body, post.id)
    return c.json(findPost(post.id))
  })

  app.delete('/api/posts/:id', (c) => {
    const user = currentUser(c)
    if (!user) return fail(c, 401, 'NOT_LOGGED_IN')
    const post = findPost(Number(c.req.param('id')))
    if (!post) return fail(c, 404, 'POST_NOT_FOUND')
    if (post.authorId !== user.id) return fail(c, 403, 'NOT_AUTHOR')
    db.prepare('DELETE FROM posts WHERE id = ?').run(post.id)
    return c.body(null, 204)
  })

  return app
}
