<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { bookId, gradeOf, imageUrl, unitItems, distractors } from '../lib/content.js'
import { level } from '../lib/games.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import Icon from '../components/Icon.vue'
import { finishGame, markCorrect } from '../lib/rewards.js'
import { useCombo, payLucky } from '../lib/play.js'
import { sparkle } from '../lib/fx.js'
import { sfx } from '../lib/sfx.js'
import Result from '../components/Result.vue'
import ComboBadge from '../components/ComboBadge.vue'

const { speakItem, stopSpeech } = useAudio()

const props = defineProps({ module: String, unit: String })

const LANES = 4
const HINT_MS = 6000 // 这么久没戳中，再报一遍、对的泡泡发光

// 速度、数量、星星门槛按年级（games.js level）；低年级泡泡慢、少
const lv = computed(() => level(gradeOf(bookId.value)).bubbles)

const items = computed(() => unitItems(props.module, props.unit))
const state = ref('ready') // ready | playing | done
const reward = ref(null)
const target = ref(null)
const bubbles = ref([])
const score = ref(0)
const misses = ref(0)
const timeLeft = ref(60)
const hinting = ref(false)
const { combo, hit, miss, reset } = useCombo()
// 每局一个金色泡泡（一定是要找的那个），戳中多给竹子
let goldAt = 0
let goldUsed = false
let since = 0
let spawnTimer = null
let clockTimer = null
let nextKey = 0
let lastLane = -1

const stars = computed(() => {
  const [one, two, three] = lv.value.stars
  const base = score.value >= three ? 3 : score.value >= two ? 2 : score.value >= one ? 1 : 0
  // 乱戳太多（错的比对的两倍还多）扣一颗
  return misses.value > score.value * 2 ? Math.max(0, base - 1) : base
})

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function start() {
  score.value = 0
  misses.value = 0
  timeLeft.value = lv.value.duration
  bubbles.value = []
  state.value = 'playing'
  reset()
  goldAt = 10 + Math.floor(Math.random() * (lv.value.duration - 25))
  goldUsed = false
  nextTarget()
  spawn()
  spawnTimer = setInterval(spawn, lv.value.spawnMs)
  clockTimer = setInterval(tick, 1000)
}

function tick() {
  timeLeft.value--
  if (timeLeft.value <= 0) return finish()
  if (!hinting.value && Date.now() - since > HINT_MS) {
    hinting.value = true
    speakItem(target.value)
  }
}

function stop() {
  stopSpeech()
  clearInterval(spawnTimer)
  clearInterval(clockTimer)
}

function finish() {
  stop()
  state.value = 'done'
  sfx.win()
  reward.value = finishGame(props.module, props.unit, 'bubbles', stars.value)
}

function nextTarget() {
  const others = items.value.filter((i) => i.id !== target.value?.id)
  target.value = pick(others.length ? others : items.value)
  since = Date.now()
  hinting.value = false
  speakItem(target.value)
}

function spawn() {
  const live = bubbles.value.filter((b) => !b.popped)
  if (live.length >= lv.value.max) return
  const hasTarget = live.some((b) => b.item.id === target.value.id)
  // 场上已有的干扰图不再重复出现，避免同一张图同时飘两个
  const onField = new Set(live.map((b) => b.item.id))
  const fresh = distractors([target.value], items.value, 99).filter((d) => !onField.has(d.id))
  const item = !hasTarget || !fresh.length || Math.random() < lv.value.targetRate ? target.value : pick(fresh)
  if (!item) return
  let lane = Math.floor(Math.random() * LANES)
  if (lane === lastLane) lane = (lane + 1) % LANES
  lastLane = lane
  const gold = !goldUsed && item.id === target.value.id && lv.value.duration - timeLeft.value >= goldAt
  if (gold) goldUsed = true
  bubbles.value.push({
    key: ++nextKey,
    item,
    x: lane * ((100 - 30) / (LANES - 1)) + Math.random() * 2,
    dur: lv.value.rise[0] + Math.random() * (lv.value.rise[1] - lv.value.rise[0]),
    gold,
    popped: false,
    wrong: false,
  })
}

function remove(b) {
  bubbles.value = bubbles.value.filter((x) => x.key !== b.key)
}

function tap(b, e) {
  if (b.popped || state.value !== 'playing') return
  if (b.item.id === target.value.id) {
    b.popped = true
    sfx.pop()
    hit({ quiet: true })
    sparkle(e?.currentTarget)
    markCorrect(b.item)
    score.value++
    if (b.gold) payLucky(e?.currentTarget)
    setTimeout(() => remove(b), 300)
    nextTarget()
  } else {
    sfx.buzz()
    miss()
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

    <Result v-if="state === 'done'" :stars="stars" :reward="reward" @again="start" :back="`/u/${module}/${unit}`">
      戳中了 {{ score }} 个泡泡
    </Result>

    <div v-else-if="state === 'ready'" class="game-intro">
      <Icon name="bubbles" class="intro-icon" />
      <h1>泡泡快快点</h1>
      <p>听到哪个，就戳哪个泡泡！一共 {{ lv.duration }} 秒，金色泡泡多给竹子。</p>
      <button class="big-btn" @click="start">开始</button>
    </div>

    <template v-else>
      <ComboBadge :n="combo" />
      <div class="game-hud">
        <span class="hud-pill"><Icon name="clock" /> {{ timeLeft }}</span>
        <ReplayButton @click="speakItem(target)" />
        <span class="hud-pill"><Icon name="bubbles" /> {{ score }}</span>
      </div>
      <div class="bubble-field" data-quiet>
        <button
          v-for="b in bubbles"
          :key="b.key"
          class="bubble"
          :class="{ popped: b.popped, gold: b.gold }"
          :style="{ left: b.x + '%', animationDuration: b.dur + 's' }"
          @pointerdown.prevent="tap(b, $event)"
          @animationend.self="!b.popped && remove(b)"
        >
          <span class="bubble-inner" :class="{ wrong: b.wrong, 'hint-glow': hinting && b.item.id === target.id && !b.popped }">
            <img :src="imageUrl(b.item.image)" alt="" draggable="false" />
          </span>
        </button>
      </div>
    </template>
  </section>
</template>
