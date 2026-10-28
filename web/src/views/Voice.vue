<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { imageUrl, unitItems } from '../lib/content.js'
import { speakItem } from '../lib/speech.js'
import { audioCtx } from '../lib/sfx.js'

const props = defineProps({ module: String, unit: String })

const items = computed(() => unitItems(props.module, props.unit))
const index = ref(0)
const item = computed(() => items.value[index.value])

const MAX_MS = 5000
const state = ref('idle') // idle | recording | ready
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
  hint.value = ''
  stopPlay()
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    hint.value = '需要允许使用麦克风（手机要用 https 地址打开）'
    return
  }
  const chunks = []
  recorder = new MediaRecorder(stream)
  recorder.ondataavailable = (e) => chunks.push(e.data)
  recorder.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop())
    try {
      const data = await new Blob(chunks).arrayBuffer()
      buffer = await audioCtx().decodeAudioData(data)
      state.value = 'ready'
      play(VOICES[0])
    } catch {
      state.value = 'idle'
      hint.value = '没录到声音，再试一次'
    }
  }
  recorder.start()
  state.value = 'recording'
  stopTimer = setTimeout(stopRec, MAX_MS)
}

function stopRec() {
  clearTimeout(stopTimer)
  if (recorder?.state === 'recording') recorder.stop()
}

function stopPlay() {
  try {
    source?.stop()
  } catch {}
  source = null
  playing.value = null
}

function play(v) {
  if (!buffer) return
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

function go(step) {
  stopPlay()
  buffer = null
  state.value = 'idle'
  index.value = (index.value + step + items.value.length) % items.value.length
  speakItem(item.value)
}

onBeforeUnmount(() => {
  stopRec()
  stopPlay()
  stream?.getTracks().forEach((t) => t.stop())
})
</script>

<template>
  <section v-if="item" class="game voice">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>

    <div class="card small" @click="speakItem(item)">
      <img :src="imageUrl(item.image)" :alt="item.text" />
      <div class="card-text">{{ item.text }}</div>
    </div>

    <div class="repeat-actions">
      <button class="big-btn ghost" @click="speakItem(item)">🔊 听</button>
      <button class="mic-btn" :class="{ on: state === 'recording' }" @click="record">
        {{ state === 'recording' ? '读完点我' : '🎤 读' }}
      </button>
    </div>
    <p v-if="hint" class="hint">{{ hint }}</p>
    <p v-else-if="state !== 'ready'" class="hint">读一读，然后听听小动物怎么说</p>

    <div v-if="state === 'ready'" class="voices">
      <button
        v-for="v in VOICES"
        :key="v.id"
        class="voice-btn"
        :class="{ on: playing === v.id }"
        @click="play(v)"
      >
        <img :src="v.img" alt="" draggable="false" />
        <span>{{ v.name }}</span>
      </button>
    </div>

    <div class="pager">
      <button class="big-btn" @click="go(-1)">◀</button>
      <span>{{ index + 1 }} / {{ items.length }}</span>
      <button class="big-btn" @click="go(1)">▶</button>
    </div>
  </section>
</template>
