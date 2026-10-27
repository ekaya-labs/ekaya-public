# 로그인과 게시판이 있는 사이트 — 템플릿

Ekaya Studio의 AI 도크가 「로그인과 게시판이 있는 사이트를 만들어 줘」에서 **코드 단계의 출발점**으로 받는 골격이다.
사람이 그대로 받아 써도 된다.

| 층 | 무엇 |
|---|---|
| 화면 | Vue 3 + Vite + vue-router — 로그인(가입 겸)·글 목록·글쓰기(고치기 겸)·상세 네 화면 |
| 서버 | Node 20+ · [Hono](https://hono.dev) — `/api/*`, 빌드된 화면(`dist/`) 서빙 |
| DB | SQLite 파일 하나(better-sqlite3) — 스키마는 `schema.sql` |
| 로그인 | 세션 쿠키(`sid`, httpOnly·SameSite=Lax), 비밀번호는 scrypt |
| 시험 | vitest — `test/app.test.js`(메모리 DB에 앱을 띄워 API를 친다) |
| 꾸밈 | EKAYA 공용 토큰 `web/src/ekaya-tokens.css`(ekaya-brand `tokens/v0.1.0`, 고치지 말 것) |

## 시작

```bash
npm install
npm run db:init      # schema.sql → data/app.sqlite
npm test             # API 시험
npm run build        # 화면 → dist/
npm start            # http://127.0.0.1:3000 (PORT 환경 변수로 바꾼다)
```

화면을 고치며 볼 때는 두 창에서 `npm run dev`(서버)와 `npm run dev:web`(Vite, `/api`를 서버로 넘긴다).

## 산출물과 맞추기

- `schema.sql` 자리에 데이터 모델러가 낸 DDL을 넣는다. 서버 SQL(`server/app.js`)이 쓰는 테이블·열 이름(`users`·`sessions`·`posts`)과 맞춘다.
- 화면 넷은 화면설계서의 페이지와 1:1이다(`web/src/main.js`의 경로 목록).
- 산출물 앱(sdlc-mini 팩)에는 `server/app.js`·화면 파일을 **프로그램** 항목으로, `test/app.test.js`를 **단위 시험** 항목으로 넣고
  각각 요구사항·프로그램에 `implements`·`verifies`로 잇는다.

## 문구와 다국어

화면 문구는 `web/src/i18n/ko.json`의 키로만 쓴다. 서버는 문장이 아니라 오류 코드(`LOGIN_FAILED` 등)를 돌려주고 화면이 문구로 바꾼다.
언어를 더하려면 `en.json`을 만들고 `web/src/i18n/index.js`의 `messages`에 넣는다.

## 환경 변수

| 이름 | 기본 | 뜻 |
|---|---|---|
| `PORT` | `3000` | 서버 포트 |
| `HOST` | `127.0.0.1` | 묶을 주소. 밖에서 받으려면 `0.0.0.0`(앞에 리버스 프록시를 둔다) |
| `DB_PATH` | `data/app.sqlite` | SQLite 파일 |
| `COOKIE_SECURE` | (없음) | `1`이면 쿠키에 Secure — HTTPS 뒤에서 켠다 |

비밀값은 없다(세션 id는 매번 무작위). 배포는 [DEPLOY.md](DEPLOY.md).
