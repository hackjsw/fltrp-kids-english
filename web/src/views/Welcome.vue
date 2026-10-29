<script setup>
// 欢迎页：小熊猫问候、继续学习、今日任务、6 个年级入口
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { allUnits, imageUrl, bookId, setBook, pickGrade, BOOKS, GRADES, gradeOf, termOf } from '../lib/content.js'
import { bookStars } from '../lib/progress.js'
import { rewards, outfit, streak, stickerCount, studiedToday, ensureDaily } from '../lib/rewards.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import QuestCard from '../components/QuestCard.vue'

const { speak } = useAudio()

const router = useRouter()
ensureDaily()

// ---------- 问候 ----------
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5 || h >= 21) return { en: 'Good evening!', cn: '这么晚了，学一会儿就去睡觉吧' }
  const en = h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!'
  return { en, cn: studiedToday.value ? '今天真棒！再来一关吧' : '今天也来学英语吧' }
})
const jump = ref(false)
function hello() {
  speak(greeting.value.en)
  jump.value = false
  requestAnimationFrame(() => (jump.value = true))
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

// ---------- 年级入口 ----------
const FACES = ['daming', 'lingling', 'sam', 'amy', 'ms-smart']
const grades = computed(() =>
  GRADES.map((g) => {
    const ids = BOOKS.filter((id) => gradeOf(id) === g)
    return {
      g,
      img: FACES[g - 1] ? `/images/1a/characters/${FACES[g - 1]}.webp` : outfit.value.img,
      stars: ids.reduce((s, id) => s + bookStars(id), 0),
      terms: ids.map((id) => ({ id, label: termOf(id) === 'a' ? '上' : '下', stars: bookStars(id) })),
      current: gradeOf(bookId.value) === g,
    }
  }),
)
const CN = ['', '一', '二', '三', '四', '五', '六']
function openGrade(g) {
  if (gradeOf(bookId.value) !== g) pickGrade(g)
  router.push('/map')
}
</script>

<template>
  <section class="welcome">
    <div class="hero">
      <button class="hero-mascot" :class="{ jump }" aria-label="重听小熊猫问候" data-quiet @click="hello" @animationend="jump = false">
        <img :src="outfit.img" alt="小熊猫" />
      </button>
      <div class="hero-side">
        <div class="bubble-say">
          <b>{{ greeting.en }}</b>
          <span>{{ greeting.cn }}</span>
          <ReplayButton label="重听问候" @click="hello" />
        </div>
        <div class="hero-chips">
          <span class="chip">🔥 {{ streak }} 天</span>
          <span class="chip">🏷️ {{ stickerCount }}</span>
          <span class="chip"><img src="/images/ui/bamboo.webp" alt="" /> {{ rewards.bamboo }}</span>
        </div>
      </div>
    </div>

    <button class="continue big" @click="goOn">
      <img :src="cont.img" alt="" />
      <span class="continue-text">
        <small>{{ cont.label }}</small>
        <b>{{ cont.title }}</b>
      </span>
      <span class="continue-go">▶</span>
    </button>

    <QuestCard />

    <div class="page-head">
      <h2>选年级</h2>
      <router-link to="/map" class="muted">去闯关地图 ›</router-link>
    </div>
    <div class="grade-grid">
      <button
        v-for="c in grades"
        :key="c.g"
        class="grade-card"
        :class="[`g${c.g}`, { current: c.current }]"
        @click="openGrade(c.g)"
      >
        <span v-if="c.current" class="grade-now">正在学</span>
        <img :src="c.img" alt="" loading="lazy" />
        <b>{{ CN[c.g] }}年级</b>
        <span class="grade-terms">
          <span v-for="t in c.terms" :key="t.id">{{ t.label }} ⭐{{ t.stars }}</span>
        </span>
      </button>
    </div>
  </section>
</template>
