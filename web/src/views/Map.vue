<script setup>
// 闯关地图：选书 + S 形小路上的关卡
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { allUnits, imageUrl, bookId } from '../lib/content.js'
import { unitTotal, bookStars } from '../lib/progress.js'
import { SCORED, UNLOCK_STARS } from '../lib/games.js'
import { rewards, outfit } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import BookPicker from '../components/BookPicker.vue'
import Icon from '../components/Icon.vue'

const MAX = SCORED.length * 3

// ---------- 闯关地图 ----------
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
const openCount = computed(() => levels.value.filter((l) => l.open).length)

// 关卡左右交替摆成 S 形小路
const STEP = 170
const xs = [26, 70, 74, 30]
const pos = (i) => ({ left: xs[i % xs.length] + '%', top: 60 + i * STEP + 'px' })
const height = computed(() => 60 + levels.value.length * STEP + 40)
const paths = computed(() =>
  levels.value.slice(1).map((l, i) => {
    const a = { x: xs[i % xs.length], y: 60 + i * STEP + 55 }
    const b = { x: xs[(i + 1) % xs.length], y: 60 + (i + 1) * STEP + 55 }
    const my = (a.y + b.y) / 2
    return { d: `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`, open: l.open }
  }),
)

// 小路空出来的那一侧隔一关贴一张小贴纸
const DECOS = ['flower', 'butterfly', 'cloud', 'sprig', 'balloon']
const decos = computed(() =>
  levels.value.map((l, i) => i).filter((i) => i % 2).map((i, k) => ({
    i,
    name: DECOS[k % DECOS.length],
    style: { left: xs[i % xs.length] > 50 ? '6%' : '82%', top: 60 + i * STEP + 34 + 'px' },
  })),
)

// 小熊猫站在最新打开的关卡。新打开了关卡：先站在上一关，再沿路走过去，锁头弹开
const mascotAt = ref(0)
const popping = ref(-1)
const walker = ref(null)
const mascotStyle = computed(() => {
  const p = pos(mascotAt.value)
  return { left: `calc(${p.left} + 34px)`, top: `calc(${p.top} - 30px)` }
})

async function syncMascot() {
  const n = openCount.value
  const seen = rewards.seenOpen[bookId.value]
  rewards.seenOpen[bookId.value] = n
  if (!seen || n <= seen) {
    mascotAt.value = n - 1
    return
  }
  mascotAt.value = seen - 1
  await nextTick()
  walker.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  setTimeout(() => {
    mascotAt.value = n - 1
    popping.value = n - 1
    sfx.unlock()
    setTimeout(() => (popping.value = -1), 1400)
  }, 700)
}
onMounted(syncMascot)
watch(bookId, () => nextTick(syncMascot))
</script>

<template>
  <section class="map-page">
    <BookPicker :count="bookStars" />
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
        :class="{ locked: !l.open && popping !== i, done: l.stars >= MAX, popping: popping === i }"
        :style="pos(i)"
      >
        <div class="level-node">
          <img :src="imageUrl(l.unit.items[0].image)" alt="" draggable="false" loading="lazy" width="112" height="112" />
          <span v-if="!l.open || popping === i" class="lock"><Icon name="lock" /></span>
          <span class="level-n">{{ l.n }}</span>
        </div>
        <div class="level-label">
          <b>{{ l.mod.title }} · {{ l.unit.id.replace('u', 'U') }}</b>
          <span>{{ l.unit.title }}</span>
          <span class="level-stars"><Icon name="star" /> {{ l.stars }}/{{ MAX }}</span>
        </div>
      </component>

      <Icon v-for="d in decos" :key="'deco' + d.i" :name="d.name" class="map-deco" :style="d.style" />

      <img ref="walker" class="map-mascot" :src="outfit.img" alt="" draggable="false" :style="mascotStyle" />
    </div>
    <p class="map-tip">每关拿到 {{ UNLOCK_STARS }} 颗星，就能打开下一关</p>
  </section>
</template>
