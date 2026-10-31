<template>
  <form class="card" @submit.prevent="save">
    <h1>{{ id ? t('posts.edit') : t('posts.write') }}</h1>
    <label>{{ t('posts.title') }}<input v-model="title" required /></label>
    <label>{{ t('posts.body') }}<textarea v-model="body" rows="10"></textarea></label>
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit" class="btn btn--primary">{{ t('posts.save') }}</button>
  </form>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, session } from '../api'
import { errorText, t } from '../i18n'

const route = useRoute()
const router = useRouter()
const id = route.params.id ?? null
const title = ref('')
const body = ref('')
const error = ref('')

onMounted(async () => {
  if (!session.user) return router.push('/login')
  if (id) {
    const post = await api.post(id)
    title.value = post.title
    body.value = post.body
  }
})

async function save() {
  error.value = ''
  try {
    const saved = id ? await api.update(id, title.value, body.value) : await api.create(title.value, body.value)
    router.push(`/posts/${saved.id}`)
  } catch (e) {
    error.value = errorText(e.code)
  }
}
</script>
