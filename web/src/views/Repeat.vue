<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { findUnit, imageUrl } from '../lib/content.js'
import { listen, canRecognize, scoreReading } from '../lib/speech.js'
import { openMic, micHint, micState, RECOGNIZER_BROKEN } from '../lib/mic.js'
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
// 识别连续两次没听清：让孩子改成录音自己打分
// 识别报 not-allowed 有两种可能：浏览器禁止了这个网站用麦克风（按提示去打开），
// 或者麦克风已经允许、识别服务本身用不了。后一种改成录音自己打分，录音能用就记在这台设备上，下次不再先试识别
const NO_ASR = 'kids-english-no-asr'
const unclear = ref(0)
const selfMode = ref(localStorage.getItem(NO_ASR) === '1')
const offerSelf = ref(false)
const micError = ref('') // 打不开麦克风时浏览器给的原始错误，显示在提示下面方便排查
let asrBroken = ''
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
  micError.value = ''
  clearRecording()
  const run = ++autoPlay
  wait(300).then((active) => {
    if (active && run === autoPlay && state.value === 'idle') playModel()
  })
}

async function record() {
  if (state.value === 'listening') return
  hint.value = ''
  micError.value = ''
  autoPlay++
  stopSpeech()
  clearRecording()
  state.value = 'listening'
  if (canRecognize && !selfMode.value) {
    recognition = new AbortController()
    try {
      const alts = await listen({ signal: recognition.signal })
      if (!isActive()) return
      if (!alts.length) {
        state.value = 'idle'
        unclear.value++
        offerSelf.value = unclear.value >= 2
        hint.value = offerSelf.value ? '还是没听清。可以离近一点再读，或者改成自己打分' : '没听到声音，离近一点、大声一点试试'
        return
      }
      unclear.value = 0
      result.value = scoreReading(item.value.text, alts)
      state.value = 'scored'
      replayFeedback()
    } catch (e) {
      if (!isActive()) return
      state.value = 'idle'
      // 麦克风被浏览器禁止了：直接说怎么打开，不算识别坏了
      if (['not-allowed', 'service-not-allowed'].includes(e.message) && (await micState()) === 'denied') {
        if (!isActive()) return
        const h = micHint(Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' }))
        hint.value = h.text
        micError.value = `识别 ${e.message}，麦克风权限 denied`
        offerSelf.value = false
      } else if (RECOGNIZER_BROKEN.includes(e.message)) {
        // 只有确认麦克风已经允许时，才把「识别用不了」记在这台设备上
        asrBroken = (await micState()) === 'granted' ? e.message : ''
        if (!isActive()) return
        selfMode.value = true
        offerSelf.value = false
        hint.value = '这个浏览器不能自动打分。再点一次「读」，录完听一听，自己给几颗星'
      } else {
        hint.value = `识别出错：${e.message}`
        offerSelf.value = true
      }
    }
  } else {
    await recordFallback()
  }
}

async function recordFallback() {
  try {
    if (typeof MediaRecorder === 'undefined') throw Object.assign(new Error('no MediaRecorder'), { name: 'NoMediaRecorder' })
    stream = await openMic()
    if (!isActive()) return stream.getTracks().forEach((t) => t.stop())
    if (['not-allowed', 'service-not-allowed', 'language-not-supported'].includes(asrBroken)) localStorage.setItem(NO_ASR, '1')
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
  } catch (e) {
    stream?.getTracks().forEach((t) => t.stop())
    if (!isActive()) return
    state.value = 'idle'
    const h = micHint(e)
    hint.value = h.text
    micError.value = h.code
  }
}

function useSelf() {
  selfMode.value = true
  offerSelf.value = false
  hint.value = '点「读」录音，读完听一听，自己给几颗星'
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
      <p v-if="micError" class="mic-error">错误代码：{{ micError }}</p>
      <button v-if="offerSelf && state === 'idle'" type="button" class="big-btn ghost small-btn" @click="useSelf">改成自己打分</button>

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
      <p v-if="(!canRecognize || selfMode) && !hint" class="hint">这个浏览器不能自动打分：录完听一听，自己给几颗星</p>
    </template>
  </section>
</template>
