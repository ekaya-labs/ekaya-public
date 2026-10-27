// API 시험 한 벌 — 메모리 DB에 앱을 띄우고 Hono의 app.request로 친다(서버를 열지 않는다).
// 산출물 앱(sdlc-mini 팩)의 「단위 시험」 항목은 이 파일 하나 = 항목 하나로 등록한다(TST-…, verifies → 프로그램).
import { beforeEach, describe, expect, it } from 'vitest'
import { openDb } from '../server/db.js'
import { createApp } from '../server/app.js'

let app

/** 쿠키를 들고 다니는 작은 클라이언트. */
function client() {
  let cookie = ''
  return async (method, path, body) => {
    const res = await app.request(path, {
      method,
      headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const set = res.headers.get('set-cookie')
    if (set) cookie = set.split(';')[0]
    const text = await res.text()
    return { status: res.status, data: text ? JSON.parse(text) : null }
  }
}

beforeEach(() => {
  app = createApp(openDb(':memory:'))
})

describe('로그인', () => {
  it('가입하면 바로 로그인 상태가 되고, 로그아웃하면 풀린다', async () => {
    const c = client()
    expect((await c('POST', '/api/signup', { username: 'kim', password: 'password1' })).status).toBe(201)
    expect((await c('GET', '/api/me')).data.username).toBe('kim')
    expect((await c('POST', '/api/logout')).status).toBe(204)
    expect((await c('GET', '/api/me')).status).toBe(401)
  })

  it('비밀번호가 틀리면 LOGIN_FAILED, 같은 아이디는 USERNAME_TAKEN', async () => {
    await client()('POST', '/api/signup', { username: 'kim', password: 'password1' })
    const c = client()
    expect((await c('POST', '/api/login', { username: 'kim', password: 'wrong-pass' })).data.error).toBe('LOGIN_FAILED')
    expect((await c('POST', '/api/signup', { username: 'kim', password: 'password2' })).data.error).toBe('USERNAME_TAKEN')
    expect((await c('POST', '/api/login', { username: 'kim', password: 'password1' })).status).toBe(200)
  })
})

describe('게시판', () => {
  it('로그인해야 글을 쓰고, 목록·상세에 보인다', async () => {
    const c = client()
    expect((await c('POST', '/api/posts', { title: '안녕' })).status).toBe(401)
    await c('POST', '/api/signup', { username: 'lee', password: 'password1' })
    const made = await c('POST', '/api/posts', { title: '안녕', body: '첫 글' })
    expect(made.status).toBe(201)
    expect((await c('GET', '/api/posts')).data.map((p) => p.title)).toEqual(['안녕'])
    expect((await c('GET', `/api/posts/${made.data.id}`)).data.body).toBe('첫 글')
  })

  it('작성자만 고치고 지운다', async () => {
    const a = client()
    await a('POST', '/api/signup', { username: 'author', password: 'password1' })
    const post = (await a('POST', '/api/posts', { title: '원래' })).data
    const b = client()
    await b('POST', '/api/signup', { username: 'other', password: 'password1' })
    expect((await b('PUT', `/api/posts/${post.id}`, { title: '남의 것' })).data.error).toBe('NOT_AUTHOR')
    expect((await a('PUT', `/api/posts/${post.id}`, { title: '고침' })).data.title).toBe('고침')
    expect((await a('DELETE', `/api/posts/${post.id}`)).status).toBe(204)
    expect((await a('GET', `/api/posts/${post.id}`)).status).toBe(404)
  })
})
