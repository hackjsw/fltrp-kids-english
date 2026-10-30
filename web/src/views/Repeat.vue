<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { findUnit, imageUrl } from '../lib/content.js'
import { listen, canRecognize, scoreReading } from '../lib/speech.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import Icon from '../components/Icon.vue'
import { finishGame, markCorrect, markRepeat } from '../lib/rewards.js'
import Result from '../components/Result.vue'

const { speak, speakItem, stopSpeech, wait, isActive } = useAudio()

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
let recorder = null
let stream = null
let recognition = null
let recordTimer = null
let autoPlay = 0
const playbackUrl = ref('')
const recordingAudio = ref(null)
const feedback = computed(() => !result.value ? '' : result.value.stars === 3 ? 'Great!' : result.value.stars === 2 ? 'Good!' : 'Try again.')

function clearRecording() {
  recordingAudio.value?.pause()
  if (playbackUrl.value) URL.revokeObjectURL(playbackUrl.value)
  playbackUrl.value = ''
}

function playModel() {
  if (state.value === 'listening') return
  autoPlay++
  recordingAudio.value?.pause()
  speakItem(item.value)
}

function replayRecording() {
  stopSpeech()
  const audio = recordingAudio.value
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => (hint.value = '播放失败，请再点一次重听'))
}

function replayFeedback() {
  recordingAudio.value?.pause()
  speak(feedback.value)
}

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
  clearRecording()
  const run = ++autoPlay
  wait(300).then((active) => {
    if (active && run === autoPlay && state.value === 'idle') playModel()
  })
}

async function record() {
  if (state.value === 'listening') return
  hint.value = ''
  autoPlay++
  stopSpeech()
  clearRecording()
  state.value = 'listening'
  if (canRecognize) {
    recognition = new AbortController()
    try {
      const alts = await listen({ signal: recognition.signal })
      if (!isActive()) return
      if (!alts.length) {
        state.value = 'idle'
        hint.value = '没听到声音，再大声一点试试'
        return
      }
      result.value = scoreReading(item.value.text, alts)
      state.value = 'scored'
      replayFeedback()
    } catch (e) {
      if (!isActive()) return
      state.value = 'idle'
      hint.value = e.message === 'not-allowed' ? '需要允许使用麦克风' : `识别出错：${e.message}`
    }
  } else {
    await recordFallback()
  }
}

async function recordFallback() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (!isActive()) return stream.getTracks().forEach((t) => t.stop())
    const chunks = []
    const mr = new MediaRecorder(stream)
    mr.ondataavailable = (e) => chunks.push(e.data)
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      if (!isActive()) return
      playbackUrl.value = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }))
      state.value = 'scored'
      result.value = null
    }
    recorder = mr
    mr.start()
    recordTimer = setTimeout(() => mr.state === 'recording' && mr.stop(), 4000)
  } catch {
    stream?.getTracks().forEach((t) => t.stop())
    if (!isActive()) return
    state.value = 'idle'
    hint.value = '需要允许使用麦克风'
  }
}

function selfRate(stars) {
  result.value = { stars, marks: item.value.text.split(/\s+/).map((w) => ({ word: w, ok: stars >= 2 })) }
}

function accept() {
  if (finished.value || state.value !== 'scored') return
  stopSpeech()
  clearRecording()
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
onBeforeUnmount(() => {
  recognition?.abort()
  clearTimeout(recordTimer)
  if (recorder?.state === 'recording') {
    recorder.onstop = null
    recorder.stop()
  }
  stream?.getTracks().forEach((t) => t.stop())
  clearRecording()
})
</script>

<template>
  <section class="repeat">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="totalStars" :reward="reward" @again="reset" :back="`/u/${module}/${unit}`" />
    <template v-else-if="item">
      <div class="progress-dots">
        <span v-for="(x, i) in items" :key="i" :class="{ on: i < index, cur: i === index }"></span>
      </div>
      <div class="card small" @click="playModel">
        <img :src="imageUrl(item.image)" :alt="item.text" />
        <div class="card-text">
          <template v-if="result">
            <span v-for="(m, i) in result.marks" :key="i" :class="m.ok ? 'ok' : 'miss'">{{ m.word }} </span>
          </template>
          <template v-else>{{ item.text }}</template>
        </div>
      </div>

      <div class="repeat-actions">
        <ReplayButton label="重听示范" :disabled="state === 'listening'" @click="playModel" />
        <button class="mic-btn" :class="{ on: state === 'listening' }" :disabled="state === 'listening'" @click="record">
          <template v-if="state === 'listening'">在听…</template>
          <template v-else><Icon name="mic" />读</template>
        </button>
      </div>
      <p v-if="hint" class="hint">{{ hint }}</p>

      <div v-if="state === 'scored'" class="score">
        <template v-if="playbackUrl">
          <audio ref="recordingAudio" :src="playbackUrl" autoplay hidden @play="stopSpeech()"></audio>
          <ReplayButton label="重听我的录音" @click="replayRecording" />
        </template>
        <template v-if="playbackUrl && !result">
          <p>读得怎么样？</p>
          <div class="self-rate">
            <button v-for="n in 3" :key="n" class="big-btn ghost" @click="selfRate(n)">{{ '★'.repeat(n) }}</button>
          </div>
        </template>
        <template v-else-if="result">
          <div class="praise-row">
            <div class="result-stars">
              <span v-for="i in 3" :key="i" :class="{ on: i <= result.stars }">★</span>
            </div>
            <ReplayButton v-if="!playbackUrl" compact label="重听鼓励" @click="replayFeedback" />
          </div>
          <div class="result-actions">
            <button class="big-btn ghost" @click="record">再读一次</button>
            <button class="big-btn" @click="accept">下一个 ▶</button>
          </div>
        </template>
      </div>
      <p v-if="!canRecognize" class="hint">这个浏览器不能自动打分：录完听一听，自己给几颗星</p>
    </template>
  </section>
</template>
