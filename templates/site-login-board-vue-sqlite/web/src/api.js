// API 호출 — 세션 쿠키는 브라우저가 붙인다. 실패하면 서버 오류 코드를 담은 Error를 던진다(문구는 i18n이 정한다).
import { reactive } from 'vue'

export const session = reactive({ user: null, loaded: false })

async function call(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw Object.assign(new Error(data?.error ?? 'UNKNOWN'), { code: data?.error ?? 'UNKNOWN' })
  return data
}

export const api = {
  async me() {
    session.user = await call('GET', '/api/me').catch(() => null)
    session.loaded = true
  },
  async login(username, password) { session.user = await call('POST', '/api/login', { username, password }) },
  async signup(username, password) { session.user = await call('POST', '/api/signup', { username, password }) },
  async logout() { await call('POST', '/api/logout'); session.user = null },
  posts: () => call('GET', '/api/posts'),
  post: (id) => call('GET', `/api/posts/${id}`),
  create: (title, body) => call('POST', '/api/posts', { title, body }),
  update: (id, title, body) => call('PUT', `/api/posts/${id}`, { title, body }),
  remove: (id) => call('DELETE', `/api/posts/${id}`),
}
