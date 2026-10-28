<script setup>
import { computed, onMounted, ref } from 'vue'
import { findUnit, imageUrl, moduleItems, shuffle, distractors } from '../lib/content.js'
import { speak, speakItem } from '../lib/speech.js'
import { recordStars } from '../lib/progress.js'
import Result from '../components/Result.vue'

const props = defineProps({ module: String, unit: String })

// 每题：目标项 + 从同 Module 抽的干扰项，共 3 张图
const questions = ref([])
const qi = ref(0)
const picked = ref(null)
const mistakes = ref(0)
const finished = ref(false)

const q = computed(() => questions.value[qi.value])

function build() {
  const targets = shuffle(findUnit(props.module, props.unit)?.unit.items || [])
  const pool = moduleItems(props.module)
  questions.value = targets.map((t) => ({
    target: t,
    // 同义项（hi/hello、bye/goodbye）不互为干扰项
    options: shuffle([
      t,
      ...distractors([t], pool, 2),
    ]),
  }))
  qi.value = 0
  mistakes.value = 0
  picked.value = null
  finished.value = false
  setTimeout(play, 400)
}

function play() {
  if (q.value) speakItem(q.value.target)
}

async function choose(opt) {
  if (picked.value?.correct) return
  const correct = opt.id === q.value.target.id
  picked.value = { id: opt.id, correct }
  if (!correct) {
    mistakes.value++
    await speak('Try again.')
    picked.value = null
    play()
    return
  }
  await speakItem(q.value.target)
  setTimeout(next, 500)
}

function next() {
  picked.value = null
  if (qi.value + 1 < questions.value.length) {
    qi.value++
    play()
  } else {
    finished.value = true
    recordStars(props.module, props.unit, 'listen', stars.value)
  }
}

const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 2 ? 2 : 1))

onMounted(build)
</script>

<template>
  <section class="listen">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="q">
      <div class="progress-dots">
        <span v-for="(x, i) in questions" :key="i" :class="{ on: i < qi, cur: i === qi }"></span>
      </div>
      <button class="play-btn" @click="play">🔊</button>
      <div class="options">
        <button
          v-for="opt in q.options"
          :key="opt.id"
          class="option"
          :class="{ right: picked?.id === opt.id && picked.correct, wrong: picked?.id === opt.id && !picked.correct }"
          @click="choose(opt)"
        >
          <img :src="imageUrl(opt.image)" :alt="''" />
        </button>
      </div>
    </template>
  </section>
</template>
