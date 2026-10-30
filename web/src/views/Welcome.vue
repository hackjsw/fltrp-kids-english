<script setup>
// 欢迎页：小熊猫问候、继续学习、今日任务、一排年级小贴纸
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { allUnits, imageUrl, bookId, setBook, pickGrade, gradeOf } from '../lib/content.js'
import { rewards, outfit, studiedToday, ensureDaily, dueCount } from '../lib/rewards.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import QuestCard from '../components/QuestCard.vue'
import GradeCircles from '../components/GradeCircles.vue'
import Icon from '../components/Icon.vue'

const { speak } = useAudio()

const router = useRouter()
ensureDaily()

// ---------- 问候 ----------
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5 || h >= 21) return { en: 'Good evening!', cn: '这么晚了，学一会儿就去睡觉吧', deco: 'moon' }
  const en = h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!'
  const deco = h < 12 ? 'sun' : h < 18 ? 'rainbow' : 'moon'
  return { en, deco, cn: studiedToday.value ? '今天真棒！再来一关吧' : '今天也来学英语吧' }
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
// 标题拆成两行：Module 小字在上，单元名在下，长句子也不会被截断
const contParts = computed(() => {
  const [kicker, ...rest] = cont.value.title.split(' · ')
  return rest.length ? { kicker, name: rest.join(' · ') } : { kicker: '', name: cont.value.title }
})
function goOn() {
  if (cont.value.book !== bookId.value) setBook(cont.value.book)
  router.push(`/u/${cont.value.module}/${cont.value.unit}`)
}

// ---------- 年级入口 ----------
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
          <Icon :name="greeting.deco" class="bubble-deco" />
          <b>{{ greeting.en }}</b>
          <div class="bubble-row">
            <span>{{ greeting.cn }}</span>
            <ReplayButton compact label="重听问候" @click="hello" />
          </div>
        </div>
      </div>
    </div>

    <button class="continue big" @click="goOn">
      <img :src="cont.img" alt="" />
      <span class="continue-text">
        <small>{{ cont.label }}<template v-if="contParts.kicker"> · {{ contParts.kicker }}</template></small>
        <b>{{ contParts.name }}</b>
      </span>
      <span class="continue-go">▶</span>
    </button>

    <router-link v-if="dueCount" to="/review" class="review-card">
      <Icon name="notebook" />
      <span class="review-text"><b>复习一下</b><small>{{ dueCount }} 个词句要再认一认</small></span>
      <span class="review-go">›</span>
    </router-link>

    <QuestCard />

    <h2 class="home-title">选年级</h2>
    <GradeCircles class="home-grades" :current="gradeOf(bookId)" @pick="openGrade" />
  </section>
</template>
