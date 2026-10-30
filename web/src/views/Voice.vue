<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { imageUrl, unitItems } from '../lib/content.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import Icon from '../components/Icon.vue'
import { audioCtx } from '../lib/sfx.js'

const { speakItem, stopSpeech, isActive } = useAudio()

const props = defineProps({ module: String, unit: String })

const items = computed(() => unitItems(props.module, props.unit))
const index = ref(0)
const item = computed(() => items.value[index.value])

const MAX_MS = 5000
const state = ref('idle') // idle | requesting | recording | processing | ready
const hint = ref('')
const playing = ref(null)
let buffer = null
let source = null
let recorder = null
let stream = null
let stopTimer = null

// 变速即变调：快放 = 小松鼠，慢放 = 大熊；机器人用环形调制
const VOICES = [
  { id: 'squirrel', name: '小松鼠', img: '/images/ui/fx-squirrel.webp', rate: 1.6 },
  { id: 'bear', name: '大熊', img: '/images/ui/fx-bear.webp', rate: 0.68 },
  { id: 'robot', name: '机器人', img: '/images/ui/fx-robot.webp', rate: 1, robot: true },
  { id: 'me', name: '我自己', img: '/images/mascot.webp', rate: 1 },
]

async function record() {
  if (state.value === 'recording') return stopRec()
  if (state.value === 'requesting' || state.value === 'processing') return
  hint.value = ''
  stopPlay()
  stopSpeech()
  state.value = 'requesting'
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (!isActive()) return stream.getTracks().forEach((t) => t.stop())
  } catch {
    state.value = 'idle'
    hint.value = '需要允许使用麦克风（手机要用 https 地址打开）'
    return
  }
  try {
    const chunks = []
    recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())
      if (!isActive()) return
      state.value = 'processing'
      try {
        const data = await new Blob(chunks).arrayBuffer()
        buffer = await audioCtx().decodeAudioData(data)
        if (!isActive()) return
        state.value = 'ready'
        play(VOICES[0])
      } catch {
        if (!isActive()) return
        state.value = 'idle'
        hint.value = '没录到声音，再试一次'
      }
    }
    recorder.start()
    state.value = 'recording'
    stopTimer = setTimeout(stopRec, MAX_MS)
  } catch {
    stream?.getTracks().forEach((t) => t.stop())
    state.value = 'idle'
    hint.value = '当前设备无法开始录音，请换一个支持录音的浏览器'
  }
}

function stopRec() {
  clearTimeout(stopTimer)
  if (recorder?.state === 'recording') {
    state.value = 'processing'
    recorder.stop()
  }
}

function stopPlay() {
  try {
    source?.stop()
  } catch {}
  source = null
  playing.value = null
}

function play(v) {
  if (!buffer || !isActive()) return
  stopSpeech()
  stopPlay()
  const ac = audioCtx()
  source = ac.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = v.rate
  let out = source
  if (v.robot) {
    // 原声 × 50Hz 正弦，得到"嗡嗡"的机器人声
    const ring = ac.createGain()
    ring.gain.value = 0
    const osc = ac.createOscillator()
    osc.frequency.value = 50
    osc.connect(ring.gain)
    osc.start()
    source.connect(ring)
    source.onended = () => osc.stop()
    out = ring
  }
  const gain = ac.createGain()
  gain.gain.value = 1.4
  out.connect(gain).connect(ac.destination)
  const s = source
  s.addEventListener('ended', () => {
    if (source === s) playing.value = null
  })
  playing.value = v.id
  s.start()
}

function playModel() {
  if (state.value === 'recording' || state.value === 'requesting' || state.value === 'processing') return
  stopPlay()
  speakItem(item.value)
}

function go(step) {
  if (state.value === 'recording' || state.value === 'requesting' || state.value === 'processing') return
  stopPlay()
  buffer = null
  state.value = 'idle'
  index.value = (index.value + step + items.value.length) % items.value.length
  playModel()
}

onBeforeUnmount(() => {
  if (recorder) recorder.onstop = null
  stopRec()
  stopPlay()
  stream?.getTracks().forEach((t) => t.stop())
})
</script>

<template>
  <section v-if="item" class="game voice">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>

    <div class="card small" @click="playModel">
      <img :src="imageUrl(item.image)" :alt="item.text" />
      <div class="card-text">{{ item.text }}</div>
    </div>

    <div class="repeat-actions">
      <ReplayButton label="重听示范" :disabled="state === 'recording' || state === 'requesting' || state === 'processing'" @click="playModel" />
      <button class="mic-btn" :class="{ on: state === 'recording' }" :disabled="state === 'requesting' || state === 'processing'" @click="record">
        <template v-if="state === 'recording'">读完点我</template>
        <template v-else-if="state === 'requesting' || state === 'processing'">稍等…</template>
        <template v-else><Icon name="mic" />读</template>
      </button>
    </div>
    <p v-if="hint" class="hint">{{ hint }}</p>
    <p v-else class="hint">{{ state === 'ready' ? '点小动物，再听一遍' : '读一读，然后听听小动物怎么说' }}</p>

    <div v-if="state === 'ready'" class="voices">
      <button
        v-for="v in VOICES"
        :key="v.id"
        class="voice-btn"
        :class="{ on: playing === v.id }"
        :aria-label="'听' + v.name + '的声音'"
        @click="play(v)"
      >
        <img :src="v.img" alt="" draggable="false" />
        <span>{{ v.name }}</span>
        <span class="replay-badge"><Icon name="speaker" /></span>
      </button>
    </div>

    <div class="pager">
      <button class="big-btn" :disabled="state === 'recording' || state === 'requesting' || state === 'processing'" @click="go(-1)">◀</button>
      <span>{{ index + 1 }} / {{ items.length }}</span>
      <button class="big-btn" :disabled="state === 'recording' || state === 'requesting' || state === 'processing'" @click="go(1)">▶</button>
    </div>
  </section>
</template>
