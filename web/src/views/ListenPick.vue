<script setup>
// 听音选图：每题一个目标词句 + 同 Module 的干扰图。选项数量和看英文题的比例按年级定（games.js level）
import { computed, onMounted, ref } from 'vue'
import { bookId, gradeOf, findUnit, moduleItems, shuffle, distractors } from '../lib/content.js'
import { level } from '../lib/games.js'
import { finishGame, markCorrect, markMiss } from '../lib/rewards.js'
import { useCombo, pickLucky, payLucky } from '../lib/play.js'
import PickRound from '../components/PickRound.vue'
import ComboBadge from '../components/ComboBadge.vue'
import Icon from '../components/Icon.vue'
import Result from '../components/Result.vue'

const props = defineProps({ module: String, unit: String })

const questions = ref([])
const qi = ref(0)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const luckyAt = ref(-1)
const lucky = ref(null)
const { combo, hit, miss, reset } = useCombo()

const q = computed(() => questions.value[qi.value])
const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 2 ? 2 : 1))

function build() {
  const lv = level(gradeOf(bookId.value))
  const targets = shuffle(findUnit(props.module, props.unit)?.unit.items || [])
  const pool = moduleItems(props.module)
  questions.value = targets.map((t, i) => ({
    target: t,
    read: lv.readEvery > 0 && (i + 1) % lv.readEvery === 0,
    // 同义项（hi/hello、bye/goodbye）不互为干扰项
    options: shuffle([t, ...distractors([t], pool, lv.options - 1)]),
  }))
  qi.value = 0
  mistakes.value = 0
  finished.value = false
  luckyAt.value = pickLucky(questions.value.length)
  reset()
}

function onWrong(first) {
  mistakes.value++
  miss()
  if (first) markMiss(q.value.target)
}

function onRight(firstTry) {
  hit()
  if (!firstTry) return
  markCorrect(q.value.target)
  if (qi.value === luckyAt.value) payLucky(lucky.value)
}

function next() {
  if (qi.value + 1 < questions.value.length) {
    qi.value++
  } else {
    finished.value = true
    reward.value = finishGame(props.module, props.unit, 'listen', stars.value)
  }
}

onMounted(build)
</script>

<template>
  <section class="listen">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="q">
      <ComboBadge :n="combo" />
      <div class="progress-dots">
        <span v-for="(x, i) in questions" :key="i" :class="{ on: i < qi, cur: i === qi, lucky: i === luckyAt && i >= qi }"></span>
      </div>
      <PickRound :key="qi" :q="q" @wrong="onWrong" @right="onRight" @next="next">
        <span v-if="qi === luckyAt" ref="lucky" class="lucky-tag"><Icon name="lucky" />幸运题</span>
      </PickRound>
    </template>
  </section>
</template>
