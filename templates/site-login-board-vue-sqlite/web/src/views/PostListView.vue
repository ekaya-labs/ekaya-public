<template>
  <section>
    <div class="row">
      <h1>{{ t('posts.list') }}</h1>
      <span class="bar__spring"></span>
      <RouterLink v-if="session.user" to="/write" class="btn btn--primary">{{ t('posts.write') }}</RouterLink>
    </div>
    <p v-if="!posts.length" class="muted">{{ t('posts.empty') }}</p>
    <ul class="list">
      <li v-for="p in posts" :key="p.id">
        <RouterLink :to="`/posts/${p.id}`">{{ p.title }}</RouterLink>
        <span class="muted">{{ t('posts.by', { author: p.author, date: p.createdAt }) }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api, session } from '../api'
import { t } from '../i18n'

const posts = ref([])
onMounted(async () => { posts.value = await api.posts() })
</script>
