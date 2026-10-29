<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { allUnits, imageUrl, book, bookId, setBook } from '../lib/content.js'
import { unitTotal, bookStars } from '../lib/progress.js'
import { SCORED, UNLOCK_STARS } from '../lib/games.js'
import { rewards, outfit, studiedToday, ensureDaily } from '../lib/rewards.js'
import { speak } from '../lib/speech.js'
import { sfx } from '../lib/sfx.js'
import BookPicker from '../components/BookPicker.vue'
import QuestCard from '../components/QuestCard.vue'

const router = useRouter()
const MAX = SCORED.length * 3
ensureDaily()

// ---------- 问候 ----------
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5 || h >= 21) return { en: 'Good evening!', cn: '这么晚了，学一会儿就去睡觉吧' }
  const en = h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!'
  return { en, cn: studiedToday.value ? '今天真棒！再来一关吧' : '今天也来学英语吧' }
})
const mascotJump = ref(false)
function hello() {
  speak(greeting.value.en)
  mascotJump.value = false
  requestAnimationFrame(() => (mascotJump.value = true))
}

// ---------- 继续学习 ----------
const cont = computed(() => {
  const l = rewards.last
  if (l) return { ...l, img: `/images/${l.book}/${l.image}`, label: '继续学习' }
  const first = allUnits()[0]
  return {
    book: bookId.value,
    module: first.mod.id,
    unit: first.unit.id,
    title: `${first.mod.title} · ${first.unit.title}`,
    img: imageUrl(first.unit.items[0].image),
    label: '开始第一关',
  }
})
function goOn() {
  if (cont.value.book !== bookId.value) setBook(cont.value.book)
  router.push(`/u/${cont.value.module}/${cont.value.unit}`)
}

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
  <section class="home">
    <div class="hello">
      <button class="hello-mascot" :class="{ jump: mascotJump }" @click="hello" @animationend="mascotJump = false">
        <img :src="outfit.img" alt="小熊猫" />
      </button>
      <div class="bubble-say" @click="hello">
        <b>{{ greeting.en }}</b>
        <span>{{ greeting.cn }}</span>
      </div>
    </div>

    <button class="continue" @click="goOn">
      <img :src="cont.img" alt="" />
      <span class="continue-text">
        <small>{{ cont.label }}</small>
        <b>{{ cont.title }}</b>
      </span>
      <span class="continue-go">▶</span>
    </button>

    <QuestCard />

    <BookPicker :count="bookStars" />
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
        :class="{ locked: !l.open && popping !== i, done: l.stars >= MAX, popping: popping === i }"
        :style="pos(i)"
      >
        <div class="level-node">
          <img :src="imageUrl(l.unit.items[0].image)" alt="" draggable="false" loading="lazy" width="112" height="112" />
          <span v-if="!l.open || popping === i" class="lock">🔒</span>
          <span class="level-n">{{ l.n }}</span>
        </div>
        <div class="level-label">
          <b>{{ l.mod.title }} · {{ l.unit.id.replace('u', 'U') }}</b>
          <span>{{ l.unit.title }}</span>
          <span class="level-stars">⭐ {{ l.stars }}/{{ MAX }}</span>
        </div>
      </component>

      <img ref="walker" class="map-mascot" :src="outfit.img" alt="" draggable="false" :style="mascotStyle" />
    </div>
    <p class="map-tip">每关拿到 {{ UNLOCK_STARS }} 颗星，就能打开下一关</p>
  </section>
</template>
