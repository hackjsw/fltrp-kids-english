<script setup>
// 首页的今日任务：3 个小任务，全部完成后宝箱会晃，点开得竹子
import { ref } from 'vue'
import { rewards, dailyQuests, chestReady, openChest, landBamboo, settleBamboo } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import { flyTo, confetti } from '../lib/fx.js'
import Icon from './Icon.vue'

const chest = ref(null)
const gotten = ref(0)

function open() {
  if (!chestReady.value) return
  const n = openChest()
  gotten.value = n
  sfx.chest()
  confetti({ from: chest.value, n: 40 })
  const pieces = Math.min(8, n)
  setTimeout(() => {
    flyTo(chest.value, document.querySelector('#bamboo-counter'), {
      img: '/images/ui/bamboo.webp',
      n: pieces,
      onEach: (k) => {
        sfx.coin()
        // 最后一颗把余数补齐
        landBamboo(k === pieces ? n - Math.floor(n / pieces) * (pieces - 1) : Math.floor(n / pieces))
      },
      onDone: settleBamboo,
    })
  }, 350)
}
</script>

<template>
  <section class="quest-card">
    <div class="quest-head">
      <h2>今日任务</h2>
      <span class="muted">{{ dailyQuests.filter((q) => q.done).length }}/{{ dailyQuests.length }}</span>
    </div>
    <div class="quest-body">
      <ul class="quest-list">
        <li v-for="q in dailyQuests" :key="q.id" :class="{ done: q.done }">
          <Icon class="quest-icon" :name="q.done ? 'check' : q.icon" />
          <span class="quest-text">{{ q.text }}</span>
          <span class="quest-bar"><i :style="{ width: (q.have / q.goal) * 100 + '%' }"></i></span>
          <span class="quest-num">{{ q.have }}/{{ q.goal }}</span>
        </li>
      </ul>
      <button
        ref="chest"
        class="chest"
        :class="{ ready: chestReady, opened: rewards.daily?.chest }"
        :disabled="!chestReady"
        @click="open"
      >
        <img :src="rewards.daily?.chest ? '/images/ui/chest-open.webp' : '/images/ui/chest-closed.webp'" alt="宝箱" />
        <span v-if="rewards.daily?.chest" class="chest-tip">{{ gotten ? `+${gotten}` : '明天再来' }}</span>
        <span v-else-if="chestReady" class="chest-tip">点我！</span>
      </button>
    </div>
  </section>
</template>
