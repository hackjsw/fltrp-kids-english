<script setup>
import { computed, onMounted, ref } from 'vue'
import { findUnit, imageUrl } from '../lib/content.js'
import { speak, speakItem, listen, canRecognize, scoreReading } from '../lib/speech.js'
import { finishGame, markCorrect, markRepeat } from '../lib/rewards.js'
import Result from '../components/Result.vue'

const props = defineProps({ module: String, unit: String })
const items = computed(() => findUnit(props.module, props.unit)?.unit.items || [])
const index = ref(0)
const item = computed(() => items.value[index.value])

// idle | listening | scored
const state = ref('idle')
const result = ref(null)
const scores = ref([])
const finished = ref(false)
const reward = ref(null)
const hint = ref('')

// 不支持识别时：录音回放 + 孩子/家长自评
const recorder = ref(null)
const playbackUrl = ref('')

function reset() {
  index.value = 0
  scores.value = []
  finished.value = false
  nextItem()
}

function nextItem() {
  state.value = 'idle'
  result.value = null
  hint.value = ''
  playbackUrl.value = ''
  setTimeout(() => speakItem(item.value), 300)
}

async function record() {
  if (state.value === 'listening') return
  hint.value = ''
  if (canRecognize) {
    state.value = 'listening'
    try {
      const alts = await listen()
      if (!alts.length) {
        state.value = 'idle'
        hint.value = '没听到声音，再大声一点试试'
        return
      }
      result.value = scoreReading(item.value.text, alts)
      state.value = 'scored'
      speak(result.value.stars === 3 ? 'Great!' : result.value.stars === 2 ? 'Good!' : 'Try again.', { rate: 1 })
    } catch (e) {
      state.value = 'idle'
      hint.value = e.message === 'not-allowed' ? '需要允许使用麦克风' : `识别出错：${e.message}`
    }
  } else {
    await recordFallback()
  }
}

async function recordFallback() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const chunks = []
    const mr = new MediaRecorder(stream)
    mr.ondataavailable = (e) => chunks.push(e.data)
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      playbackUrl.value = URL.createObjectURL(new Blob(chunks))
      state.value = 'scored'
      result.value = null
    }
    recorder.value = mr
    mr.start()
    state.value = 'listening'
    setTimeout(() => mr.state === 'recording' && mr.stop(), 4000)
  } catch {
    hint.value = '需要允许使用麦克风'
  }
}

function selfRate(stars) {
  result.value = { stars, marks: item.value.text.split(/\s+/).map((w) => ({ word: w, ok: stars >= 2 })) }
}

function accept() {
  const s = result.value?.stars || 0
  scores.value.push(s)
  markRepeat()
  if (s >= 2) markCorrect(item.value)
  if (index.value + 1 < items.value.length) {
    index.value++
    nextItem()
  } else {
    finished.value = true
    reward.value = finishGame(props.module, props.unit, 'repeat', totalStars.value)
  }
}

const totalStars = computed(() => {
  if (!scores.value.length) return 0
  return Math.round(scores.value.reduce((s, n) => s + n, 0) / scores.value.length)
})

onMounted(reset)
</script>

<template>
  <section class="repeat">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="totalStars" :reward="reward" @again="reset" :back="`/u/${module}/${unit}`" />
    <template v-else-if="item">
      <div class="progress-dots">
        <span v-for="(x, i) in items" :key="i" :class="{ on: i < index, cur: i === index }"></span>
      </div>
      <div class="card small" @click="speakItem(item)">
        <img :src="imageUrl(item.image)" :alt="item.text" />
        <div class="card-text">
          <template v-if="result">
            <span v-for="(m, i) in result.marks" :key="i" :class="m.ok ? 'ok' : 'miss'">{{ m.word }} </span>
          </template>
          <template v-else>{{ item.text }}</template>
        </div>
      </div>

      <div class="repeat-actions">
        <button class="big-btn ghost" @click="speakItem(item)">🔊 听</button>
        <button class="mic-btn" :class="{ on: state === 'listening' }" @click="record">
          {{ state === 'listening' ? '在听…' : '🎤 读' }}
        </button>
      </div>
      <p v-if="hint" class="hint">{{ hint }}</p>

      <div v-if="state === 'scored'" class="score">
        <template v-if="playbackUrl && !result">
          <audio :src="playbackUrl" controls autoplay></audio>
          <p>读得怎么样？</p>
          <div class="self-rate">
            <button v-for="n in 3" :key="n" class="big-btn ghost" @click="selfRate(n)">{{ '★'.repeat(n) }}</button>
          </div>
        </template>
        <template v-else-if="result">
          <div class="result-stars">
            <span v-for="i in 3" :key="i" :class="{ on: i <= result.stars }">★</span>
          </div>
          <div class="result-actions">
            <button class="big-btn ghost" @click="record">再读一次</button>
            <button class="big-btn" @click="accept">下一个 ▶</button>
          </div>
        </template>
      </div>
      <p v-if="!canRecognize" class="hint">当前浏览器不支持语音识别，建议用 Edge 或 Chrome。现在使用录音自评模式。</p>
    </template>
  </section>
</template>
