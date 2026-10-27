<template>
  <article v-if="post" class="card">
    <h1>{{ post.title }}</h1>
    <p class="muted">{{ t('posts.by', { author: post.author, date: post.createdAt }) }}</p>
    <div class="body">{{ post.body }}</div>
    <div v-if="session.user?.id === post.authorId" class="row">
      <RouterLink :to="`/posts/${post.id}/edit`" class="btn">{{ t('posts.edit') }}</RouterLink>
      <button type="button" class="btn" @click="remove">{{ t('posts.delete') }}</button>
    </div>
  </article>
  <p v-else-if="error" class="error">{{ error }}</p>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, session } from '../api'
import { errorText, t } from '../i18n'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const error = ref('')

onMounted(async () => {
  try { post.value = await api.post(route.params.id) } catch (e) { error.value = errorText(e.code) }
})

async function remove() {
  if (!confirm(t('posts.confirmDelete'))) return
  try { await api.remove(post.value.id); router.push('/') } catch (e) { error.value = errorText(e.code) }
}
</script>
