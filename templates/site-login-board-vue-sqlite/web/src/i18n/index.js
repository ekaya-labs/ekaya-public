// 아주 작은 i18n — 문구는 언어별 파일의 키로 쓰고({name} 자리표시), 서버 오류 코드도 여기서 문장으로 바꾼다.
// 처음부터 이 구조로 두면 언어를 더할 때 파일 하나(en.json 등)만 늘면 된다. 큰 앱이 되면 vue-i18n으로 바꿔도 키는 그대로 쓴다.
import ko from './ko.json'

const messages = { ko }
let locale = 'ko'

export function setLocale(next) {
  if (messages[next]) locale = next
}

export function t(key, params = {}) {
  const text = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), messages[locale])
  if (typeof text !== 'string') return key
  return text.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''))
}

/** 서버 오류 코드 → 문장. 모르는 코드는 일반 문구. */
export function errorText(code) {
  const msg = t(`errors.${code}`)
  return msg === `errors.${code}` ? t('errors.UNKNOWN') : msg
}
