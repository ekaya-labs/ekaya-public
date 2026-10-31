# 배포 — 틀

리눅스 서버 한 대에 Node로 띄우고 앞에 리버스 프록시(HTTPS)를 두는 가장 작은 방법이다. 프로젝트에 맞게 `<…>`를 채운다.

## 1. 준비

- Node 20 이상, 빌드 도구(better-sqlite3가 미리 빌드된 바이너리를 못 받으면 컴파일한다 — `build-essential`·`python3`)
- 설치 위치: `~/ws/app/<사이트 이름>/` · 작업 파일은 `~/ws/temp/`에 풀고 끝나면 지운다

## 2. 올리기

```bash
npm ci
npm test
npm run build
DB_PATH=<데이터 경로>/app.sqlite npm run db:init
```

## 3. 서비스로 띄우기 (systemd)

```ini
[Unit]
Description=<사이트 이름>
After=network.target

[Service]
WorkingDirectory=/home/<계정>/ws/app/<사이트 이름>
Environment=PORT=<포트> HOST=127.0.0.1 DB_PATH=<데이터 경로>/app.sqlite COOKIE_SECURE=1
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## 4. 앞단 (HTTPS)

리버스 프록시(nginx·Caddy 등)가 `https://<도메인>` → `http://127.0.0.1:<포트>`로 넘긴다. HTTPS 뒤에서는 `COOKIE_SECURE=1`.

## 5. 확인

- `curl -s http://127.0.0.1:<포트>/api/posts` → `[]` 또는 글 목록
- 브라우저로 가입 → 글쓰기 → 목록에 보이는지
- 백업: `<데이터 경로>/app.sqlite`(WAL 파일 `-wal`·`-shm`이 함께 있다 — 서비스를 멈추고 복사하거나 `sqlite3 app.sqlite ".backup ..."`)
