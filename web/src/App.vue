<script setup>
import { onMounted } from 'vue'
import { loadBook, book, error } from './lib/content.js'
import { progress } from './lib/progress.js'

onMounted(loadBook)
</script>

<template>
  <header class="topbar">
    <router-link to="/" class="brand">
      <img src="/images/ui/mascot-happy.webp" alt="" />
      <span>小熊猫学英语</span>
    </router-link>
    <div class="stars">⭐ {{ progress.totalStars }}</div>
    <div class="streak" v-if="progress.streak > 0">🔥 {{ progress.streak }} 天</div>
  </header>
  <main>
    <p v-if="error" class="error">{{ error }}</p>
    <router-view v-else-if="book" />
    <p v-else class="loading">加载中…</p>
  </main>
</template>
