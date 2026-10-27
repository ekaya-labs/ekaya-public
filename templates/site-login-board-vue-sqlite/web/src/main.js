import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import PostListView from './views/PostListView.vue'
import PostEditView from './views/PostEditView.vue'
import PostDetailView from './views/PostDetailView.vue'
import { t } from './i18n'
import './ekaya-tokens.css'
import './style.css'

// 화면 넷 — 로그인(가입 겸)·목록·글쓰기(고치기 겸)·상세. 화면설계서의 페이지와 1:1로 둔다.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PostListView },
    { path: '/login', component: LoginView },
    { path: '/write', component: PostEditView },
    { path: '/posts/:id', component: PostDetailView },
    { path: '/posts/:id/edit', component: PostEditView },
  ],
})

document.title = t('app.title')
createApp(App).use(router).mount('#app')
