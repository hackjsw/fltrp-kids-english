<script setup>
// 成就：连续学习、打卡日历、徽章墙、学习统计
import { computed, ref } from 'vue'
import { BADGES, STREAK_GIFTS } from '../lib/catalog.js'
import { rewards, streak, stickerCount, dayKey } from '../lib/rewards.js'
import { progress } from '../lib/progress.js'
import Icon from '../components/Icon.vue'

const month = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const studied = computed(() => new Set(rewards.days))
const today = dayKey()

// 日历：周一开头，前面补空格
const cells = computed(() => {
  const y = month.value.getFullYear()
  const m = month.value.getMonth()
  const lead = (new Date(y, m, 1).getDay() + 6) % 7
  const n = new Date(y, m + 1, 0).getDate()
  const out = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= n; d++) {
    const key = dayKey(new Date(y, m, d))
    out.push({ d, key, on: studied.value.has(key), today: key === today })
  }
  return out
})
const monthLabel = computed(() => `${month.value.getFullYear()} 年 ${month.value.getMonth() + 1} 月`)
const monthDays = computed(() => cells.value.filter((c) => c?.on).length)
function shift(step) {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + step, 1)
}
const isThisMonth = computed(() => {
  const n = new Date()
  return month.value.getFullYear() === n.getFullYear() && month.value.getMonth() === n.getMonth()
})

const badgeCount = computed(() => Object.keys(rewards.badges).length)
</script>

<template>
  <section class="me">
    <div class="streak-card">
      <Icon name="flame" class="streak-flame" />
      <div>
        <b class="streak-num">{{ streak }}</b> 天
        <p class="muted">连续学习，今天也要来哦</p>
      </div>
    </div>
    <div class="gift-row">
      <div v-for="g in STREAK_GIFTS" :key="g.days" class="gift" :class="{ got: rewards.gifts.includes(g.days) }">
        <Icon class="gift-icon" :name="rewards.gifts.includes(g.days) ? 'check' : 'gift'" />
        <b>{{ g.days }} 天</b>
        <span class="gift-bamboo">+{{ g.bamboo }}<img src="/images/ui/bamboo.webp" alt="" /></span>
      </div>
    </div>

    <div class="calendar">
      <div class="cal-head">
        <button class="cal-nav" @click="shift(-1)">◀</button>
        <b>{{ monthLabel }}</b>
        <button class="cal-nav" :disabled="isThisMonth" @click="shift(1)">▶</button>
      </div>
      <div class="cal-week"><span v-for="w in '一二三四五六日'" :key="w">{{ w }}</span></div>
      <div class="cal-grid">
        <span v-for="(c, i) in cells" :key="i" class="cal-day" :class="{ on: c?.on, today: c?.today }">
          <template v-if="c">
            <Icon v-if="c.on" name="paw" class="cal-paw" />
            <small>{{ c.d }}</small>
          </template>
        </span>
      </div>
      <p class="muted cal-foot">这个月学了 {{ monthDays }} 天</p>
    </div>

    <div class="page-head">
      <h2>徽章</h2>
      <span class="muted">{{ badgeCount }}/{{ BADGES.length }}</span>
    </div>
    <div class="badge-grid">
      <div v-for="b in BADGES" :key="b.id" class="badge" :class="{ got: rewards.badges[b.id] }">
        <img :src="`/images/ui/badges/${b.id}.webp`" alt="" loading="lazy" />
        <b>{{ b.name }}</b>
        <span class="muted">{{ b.desc }}</span>
      </div>
    </div>

    <h2>我的学习</h2>
    <div class="stat-grid">
      <div class="stat"><b>{{ progress.totalStars }}</b><span><Icon name="star" /> 星星</span></div>
      <div class="stat"><b>{{ stickerCount }}</b><span><Icon name="album" /> 贴纸</span></div>
      <div class="stat"><b>{{ rewards.stats.games }}</b><span><Icon name="gamepad" /> 游戏</span></div>
      <div class="stat"><b>{{ rewards.stats.repeats }}</b><span><Icon name="parrot" /> 跟读</span></div>
      <div class="stat"><b>{{ rewards.days.length }}</b><span><Icon name="calendar" /> 学习天数</span></div>
      <div class="stat"><b>{{ rewards.bambooTotal }}</b><span><img src="/images/ui/bamboo.webp" alt="" /> 一共赚到</span></div>
    </div>
  </section>
</template>
