# EKAYA Public

EKAYA 앱·도구에서 **바로 다운로드해 사용하는 공개 자료** 레포입니다 — 예제, 샘플 데이터, 템플릿.

이 레포는 public입니다. 앱은 GitHub raw URL로 파일을 직접 받아 예제로 보여주거나 샘플 데이터를 제공합니다.

## 구조

- `samples/` — 샘플 데이터 (앱별 하위 폴더: `samples/life/`, `samples/studio/` …)
- `examples/` — 예제 문서·프로젝트
- `templates/` — 템플릿
- `index.json` — 앱이 목록을 읽어가는 매니페스트 (경로, 설명, 크기)

## 다운로드 URL

```
https://raw.githubusercontent.com/ekaya-labs/ekaya-public/main/<경로>
```

앱에서는 `main` 대신 태그/커밋 해시를 고정해 쓰는 것을 권장합니다 (파일이 바뀌어도 앱이 깨지지 않도록).

## 규칙

- **공개되어도 되는 자료만** 넣습니다. 개인정보·비밀값·내부 자료 금지.
- 저작권이 있는 외부 자료는 재배포 가능한 라이선스인지 확인하고 출처를 적습니다.
- 파일은 작게 유지합니다 (수 MB 이내). 큰 파일은 LFS가 아니라 GitHub Releases 에셋으로 올립니다 — raw URL은 LFS 파일을 제대로 서빙하지 않습니다.
- 앱이 참조하는 파일은 경로를 바꾸거나 삭제하지 않습니다. 대체 시 새 경로를 추가하고 `index.json`을 갱신합니다.

## License

- 코드·템플릿: MIT (`LICENSE` 참조)
- 샘플 데이터·문서: CC BY 4.0
