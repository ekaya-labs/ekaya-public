<template>
  <form class="card" @submit.prevent="submit">
    <h1>{{ signup ? t('app.signup') : t('app.login') }}</h1>
    <label>{{ t('auth.username') }}<input v-model="username" autocomplete="username" required /></label>
    <label>{{ t('auth.password') }}<input v-model="password" type="password" autocomplete="current-password" required /></label>
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit" class="btn btn--primary">{{ signup ? t('auth.submitSignup') : t('auth.submitLogin') }}</button>
    <button type="button" class="link" @click="signup = !signup">{{ signup ? t('auth.toLogin') : t('auth.toSignup') }}</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { errorText, t } from '../i18n'

const router = useRouter()
const signup = ref(false)
const username = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    if (signup.value) await api.signup(username.value, password.value)
    else await api.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = errorText(e.code)
  }
}
</script>
