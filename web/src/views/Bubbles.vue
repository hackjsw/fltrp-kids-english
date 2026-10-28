<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { imageUrl, unitItems, distractors } from '../lib/content.js'
import { speakItem } from '../lib/speech.js'
import { recordStars } from '../lib/progress.js'
import { sfx } from '../lib/sfx.js'
import Result from '../components/Result.vue'

const props = defineProps({ module: String, unit: String })

const DURATION = 60
const MAX_BUBBLES = 6
const LANES = 4

const items = computed(() => unitItems(props.module, props.unit))
const state = ref('ready') // ready | playing | done
const target = ref(null)
const bubbles = ref([])
const score = ref(0)
const misses = ref(0)
const timeLeft = ref(DURATION)
let spawnTimer = null
let clockTimer = null
let nextKey = 0
let lastLane = -1

const stars = computed(() => {
  const base = score.value >= 10 ? 3 : score.value >= 6 ? 2 : score.value >= 1 ? 1 : 0
  // 乱戳太多扣一颗
  return misses.value > score.value ? Math.max(0, base - 1) : base
})

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function start() {
  score.value = 0
  misses.value = 0
  timeLeft.value = DURATION
  bubbles.value = []
  state.value = 'playing'
  nextTarget()
  spawn()
  spawnTimer = setInterval(spawn, 1000)
  clockTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) finish()
  }, 1000)
}

function stop() {
  clearInterval(spawnTimer)
  clearInterval(clockTimer)
}

function finish() {
  stop()
  state.value = 'done'
  sfx.win()
  recordStars(props.module, props.unit, 'bubbles', stars.value)
}

function nextTarget() {
  const others = items.value.filter((i) => i.id !== target.value?.id)
  target.value = pick(others.length ? others : items.value)
  speakItem(target.value)
}

function spawn() {
  const live = bubbles.value.filter((b) => !b.popped)
  if (live.length >= MAX_BUBBLES) return
  const hasTarget = live.some((b) => b.item.id === target.value.id)
  // 场上已有的干扰图不再重复出现，避免同一张图同时飘两个
  const onField = new Set(live.map((b) => b.item.id))
  const fresh = distractors([target.value], items.value, 99).filter((d) => !onField.has(d.id))
  const item = !hasTarget || !fresh.length || Math.random() < 0.25 ? target.value : pick(fresh)
  if (!item) return
  let lane = Math.floor(Math.random() * LANES)
  if (lane === lastLane) lane = (lane + 1) % LANES
  lastLane = lane
  bubbles.value.push({
    key: ++nextKey,
    item,
    x: lane * ((100 - 30) / (LANES - 1)) + Math.random() * 2,
    dur: 6 + Math.random() * 2.5,
    popped: false,
    wrong: false,
  })
}

function remove(b) {
  bubbles.value = bubbles.value.filter((x) => x.key !== b.key)
}

function tap(b) {
  if (b.popped || state.value !== 'playing') return
  if (b.item.id === target.value.id) {
    b.popped = true
    sfx.pop()
    score.value++
    setTimeout(() => remove(b), 300)
    nextTarget()
  } else {
    sfx.buzz()
    misses.value++
    b.wrong = true
    setTimeout(() => (b.wrong = false), 400)
  }
}

onBeforeUnmount(stop)
</script>

<template>
  <section class="game bubbles">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>

    <Result v-if="state === 'done'" :stars="stars" @again="start" :back="`/u/${module}/${unit}`">
      戳中了 {{ score }} 个泡泡
    </Result>

    <div v-else-if="state === 'ready'" class="game-intro">
      <div class="intro-icon">🫧</div>
      <h1>泡泡快快点</h1>
      <p>听到哪个，就戳哪个泡泡！一共 {{ DURATION }} 秒。</p>
      <button class="big-btn" @click="start">开始</button>
    </div>

    <template v-else>
      <div class="game-hud">
        <span class="hud-pill">⏱ {{ timeLeft }}</span>
        <button class="hud-play" @click="speakItem(target)">🔊</button>
        <span class="hud-pill">🫧 {{ score }}</span>
      </div>
      <div class="bubble-field">
        <button
          v-for="b in bubbles"
          :key="b.key"
          class="bubble"
          :class="{ popped: b.popped }"
          :style="{ left: b.x + '%', animationDuration: b.dur + 's' }"
          @pointerdown.prevent="tap(b)"
          @animationend.self="!b.popped && remove(b)"
        >
          <span class="bubble-inner" :class="{ wrong: b.wrong }">
            <img :src="imageUrl(b.item.image)" alt="" draggable="false" />
          </span>
        </button>
      </div>
    </template>
  </section>
</template>
