<script setup>
// 错题复习：首页「复习一下」进来，把今天到期的错题用听音选图再考一遍。题目可能来自不同的册
import { computed, onMounted, ref } from 'vue'
import { BOOKS, gradeOf, ensureBooks, locate, shuffle, distractors } from '../lib/content.js'
import { level } from '../lib/games.js'
import { dueReview, answerReview, dropReview, finishReview, markCorrect } from '../lib/rewards.js'
import { useCombo } from '../lib/play.js'
import PickRound from '../components/PickRound.vue'
import ComboBadge from '../components/ComboBadge.vue'
import Icon from '../components/Icon.vue'
import Result from '../components/Result.vue'

const MAX = 8

const questions = ref([])
const qi = ref(0)
const loading = ref(true)
const finished = ref(false)
const reward = ref(null)
const result = ref({ right: 0, remembered: 0 })
const { combo, hit, miss } = useCombo()

const q = computed(() => questions.value[qi.value])

async function build() {
  loading.value = true
  const keys = dueReview(MAX)
  const split = (k) => [k.slice(0, k.indexOf('/')), k.slice(k.indexOf('/') + 1)]
  // 册号不认识的（比如教材删掉了一册）直接清掉，免得首页一直显示有错题
  for (const k of keys) if (!BOOKS.includes(split(k)[0])) dropReview(k)
  const live = keys.filter((k) => BOOKS.includes(split(k)[0]))
  const loaded = await ensureBooks([...new Set(live.map((k) => split(k)[0]))])
  questions.value = live.flatMap((key) => {
    const [book, id] = split(key)
    if (!loaded[book]) return [] // 这一册没加载出来：先跳过，错题保留
    const found = locate(loaded[book], id)
    if (!found) {
      dropReview(key) // 教材里已经没有这一项
      return []
    }
    const n = level(gradeOf(book)).options
    return [{ key, book, target: found.item, options: shuffle([found.item, ...distractors([found.item], found.pool, n - 1)]) }]
  })
  qi.value = 0
  result.value = { right: 0, remembered: 0 }
  finished.value = false
  loading.value = false
}

function onWrong(first) {
  miss()
  if (first) answerReview(q.value.key, false)
}

function onRight(firstTry) {
  hit()
  if (!firstTry) return
  result.value.right++
  if (answerReview(q.value.key, true)) result.value.remembered++
  markCorrect(q.value.target, q.value.book)
}

function next() {
  if (qi.value + 1 < questions.value.length) {
    qi.value++
  } else {
    finished.value = true
    reward.value = finishReview(result.value.right, questions.value.length)
  }
}

onMounted(build)
</script>

<template>
  <section class="listen review">
    <router-link to="/" class="back">← 首页</router-link>
    <p v-if="loading" class="loading">加载中…</p>
    <Result v-else-if="finished" :stars="reward.stars" :reward="reward" :show-again="false" back="/" back-label="回首页">
      答对 {{ result.right }} / {{ questions.length }}<template v-if="result.remembered">，记住了 {{ result.remembered }} 个</template>
    </Result>
    <div v-else-if="!q" class="game-intro">
      <Icon name="notebook" class="intro-icon" />
      <h1>今天没有要复习的</h1>
      <p>答错过的词句，第二天会出现在这里</p>
      <router-link to="/" class="big-btn">回首页</router-link>
    </div>
    <template v-else>
      <ComboBadge :n="combo" />
      <h1 class="review-title"><Icon name="notebook" />复习一下</h1>
      <div class="progress-dots">
        <span v-for="(x, i) in questions" :key="x.key" :class="{ on: i < qi, cur: i === qi }"></span>
      </div>
      <PickRound :key="q.key" :q="q" @wrong="onWrong" @right="onRight" @next="next" />
    </template>
  </section>
</template>
