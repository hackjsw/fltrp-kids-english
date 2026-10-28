<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'
import { allUnits, imageUrl, book, books, bookId, setBook, BOOKS } from '../lib/content.js'
import { unitTotal, bookStars } from '../lib/progress.js'
import { SCORED, UNLOCK_STARS } from '../lib/games.js'

const MAX = SCORED.length * 3

// 第 i 关解锁条件：前一关至少拿到 UNLOCK_STARS 颗星
const levels = computed(() => {
  let prevStars = UNLOCK_STARS
  return allUnits().map(({ mod, unit }, i) => {
    const stars = unitTotal(mod.id, unit.id, SCORED)
    const open = i === 0 || prevStars >= UNLOCK_STARS
    prevStars = stars
    return { mod, unit, stars, open, n: i + 1 }
  })
})

// 小熊猫站在最后一个已解锁的关卡
const current = computed(() => {
  const open = levels.value.filter((l) => l.open)
  return open[open.length - 1]?.n
})

// 关卡左右交替摆成 S 形小路
const STEP = 170
const xs = [26, 70, 74, 30]
function pos(i) {
  return { left: xs[i % xs.length] + '%', top: 60 + i * STEP + 'px' }
}
const height = computed(() => 60 + levels.value.length * STEP + 40)

// 相邻关卡之间的曲线
// 一册有 20 关，进地图时滚到小熊猫所在的关卡
function scrollToCurrent() {
  nextTick(() => document.querySelector('.map-mascot')?.closest('.level')?.scrollIntoView({ block: 'center' }))
}
onMounted(scrollToCurrent)
watch(bookId, scrollToCurrent)

const paths = computed(() =>
  levels.value.slice(1).map((l, i) => {
    const a = { x: xs[i % xs.length], y: 60 + i * STEP + 55 }
    const b = { x: xs[(i + 1) % xs.length], y: 60 + (i + 1) * STEP + 55 }
    const my = (a.y + b.y) / 2
    return { d: `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`, open: l.open }
  }),
)
</script>

<template>
  <section class="map">
    <div class="book-tabs">
      <button v-for="id in BOOKS" :key="id" class="book-tab" :class="{ on: id === bookId }" @click="setBook(id)">
        {{ books[id]?.title }}
        <small>⭐ {{ bookStars(id) }}</small>
      </button>
    </div>
    <div class="map-head">
      <span class="map-sub">{{ book.subtitle }}</span>
    </div>
    <div class="map-board" :style="{ height: height + 'px' }">
      <svg class="map-path" :viewBox="`0 0 100 ${height}`" preserveAspectRatio="none">
        <path v-for="(p, i) in paths" :key="i" :d="p.d" :class="{ open: p.open }" vector-effect="non-scaling-stroke" />
      </svg>

      <component
        :is="l.open ? 'router-link' : 'div'"
        v-for="(l, i) in levels"
        :key="bookId + l.mod.id + l.unit.id"
        :to="`/u/${l.mod.id}/${l.unit.id}`"
        class="level"
        :class="{ locked: !l.open, done: l.stars >= MAX }"
        :style="pos(i)"
      >
        <div class="level-node">
          <img :src="imageUrl(l.unit.items[0].image)" alt="" draggable="false" loading="lazy" width="112" height="112" />
          <span v-if="!l.open" class="lock">🔒</span>
          <span class="level-n">{{ l.n }}</span>
        </div>
        <div class="level-label">
          <b>{{ l.mod.title }} · {{ l.unit.id.replace('u', 'U') }}</b>
          <span>{{ l.unit.title }}</span>
          <span class="level-stars">⭐ {{ l.stars }}/{{ MAX }}</span>
        </div>
        <img v-if="l.n === current" class="map-mascot" :src="'/images/ui/mascot-happy.webp'" alt="" draggable="false" />
      </component>
    </div>
    <p class="map-tip">每关拿到 {{ UNLOCK_STARS }} 颗星，就能打开下一关</p>
  </section>
</template>
