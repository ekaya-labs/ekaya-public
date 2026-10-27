<template>
  <header class="bar">
    <RouterLink to="/" class="bar__title">{{ t('app.title') }}</RouterLink>
    <span class="bar__spring"></span>
    <template v-if="session.user">
      <span>{{ t('app.hello', { name: session.user.username }) }}</span>
      <button type="button" class="btn" @click="logout">{{ t('app.logout') }}</button>
    </template>
    <RouterLink v-else to="/login" class="btn">{{ t('app.login') }}</RouterLink>
  </header>
  <main class="page">
    <RouterView v-if="session.loaded" />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, session } from './api'
import { t } from './i18n'

const router = useRouter()
onMounted(() => api.me())

async function logout() {
  await api.logout()
  router.push('/')
}
</script>
