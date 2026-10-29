<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadBook, book, error } from './lib/content.js'
import { progress } from './lib/progress.js'
import { shownBamboo, streak, outfit } from './lib/rewards.js'
import { sfx } from './lib/sfx.js'
import { bump } from './lib/fx.js'
import RewardLayer from './components/RewardLayer.vue'

const route = useRoute()
onMounted(loadBook)

const TABS = [
  { to: '/', icon: '🏠', name: '首页' },
  { to: '/map', icon: '🗺️', name: '闯关' },
  { to: '/stickers', icon: '🏷️', name: '贴纸' },
  { to: '/shop', icon: '👕', name: '衣橱' },
  { to: '/me', icon: '🏅', name: '成就' },
]
// 底部标签只在这几个大页面显示，进游戏后收起
const showTabs = computed(() => TABS.some((t) => t.to === route.path))
// 衣橱和成就不依赖教材，书还没加载完也能打开
const needsBook = computed(() => !['/shop', '/me'].includes(route.path))

// 竹子数字变多时跳一下（徽章、打卡礼物这类没有飞行动画的也有反馈）
const counter = ref(null)
watch(shownBamboo, (n, o) => n > o && bump(counter.value))

// 普通按钮统一的轻点声；游戏里自带音效的区域标 data-quiet
function onTap(e) {
  const el = e.target.closest('button, a')
  if (el && !el.closest('[data-quiet]') && !el.disabled) sfx.tap()
}
onMounted(() => document.addEventListener('pointerdown', onTap, true))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onTap, true))
</script>

<template>
  <header class="topbar">
    <router-link to="/" class="brand">
      <img :src="outfit.img" alt="" />
      <span>小熊猫学英语</span>
    </router-link>
    <span id="bamboo-counter" ref="counter" class="pill"><img src="/images/ui/bamboo.webp" alt="竹子" />{{ shownBamboo }}</span>
    <span class="pill">⭐ {{ progress.totalStars }}</span>
    <span v-if="streak > 0" class="pill">🔥 {{ streak }}</span>
  </header>
  <main :class="{ 'with-tabs': showTabs }">
    <p v-if="error" class="error">{{ error }}</p>
    <router-view v-else-if="book || !needsBook" v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
    <p v-else class="loading">加载中…</p>
  </main>
  <nav v-if="showTabs" class="tabbar">
    <router-link v-for="t in TABS" :key="t.to" :to="t.to" class="tab" :class="{ on: route.path === t.to }">
      <span class="tab-icon">{{ t.icon }}</span>
      <span>{{ t.name }}</span>
    </router-link>
  </nav>
  <RewardLayer />
</template>
