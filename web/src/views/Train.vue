<script setup>
import { computed, onMounted, ref } from 'vue'
import { bookId, gradeOf, imageUrl, unitItems, distractors, shuffle, canConfuse } from '../lib/content.js'
import { level } from '../lib/games.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import { finishGame, markCorrect, markMiss } from '../lib/rewards.js'
import { useCombo } from '../lib/play.js'
import { sfx } from '../lib/sfx.js'
import Result from '../components/Result.vue'
import ComboBadge from '../components/ComboBadge.vue'

const { speak, speakItem, wait, isActive } = useAudio()

const props = defineProps({ module: String, unit: String })

// 车厢数和候选图数按年级（games.js level）；低年级车厢少
const rounds = ref([])
const ri = ref(0)
const loaded = ref([]) // 已装上车的项
const busy = ref(false) // 正在报词，暂不接受点击
const shaking = ref(null)
const leaving = ref(false)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const speaking = ref(-1) // 正在报的那一节车厢跳一下
const slotMiss = ref(0) // 当前这一节错了几次
const { combo, hit, miss, reset } = useCombo()

const round = computed(() => rounds.value[ri.value])
const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 3 ? 2 : 1))
// 同一节错两次，正确的图晃一晃
const hintId = computed(() => (slotMiss.value >= 2 ? round.value?.seq[loaded.value.length]?.id : null))

function build() {
  const items = unitItems(props.module, props.unit)
  const lv = level(gradeOf(bookId.value)).train
  rounds.value = lv.plan.map((n) => {
    // 同义词不同时出现在一轮里（听到 hi 分不清该点 hi 还是 hello）；跳过冲突的接着挑，车厢数不缩水
    const clean = []
    for (const it of shuffle(items)) {
      if (clean.length >= n) break
      if (clean.every((y) => canConfuse(it, y))) clean.push(it)
    }
    return { seq: clean, choices: shuffle([...clean, ...distractors(clean, items, lv.choices - clean.length)]) }
  })
  ri.value = 0
  mistakes.value = 0
  finished.value = false
  reset()
  startRound()
}

let announcement = 0

async function announce() {
  if (leaving.value || finished.value) return
  const run = ++announcement
  const seq = [...round.value.seq]
  busy.value = true
  if (!await wait(400) || run !== announcement) return
  for (const [i, it] of seq.entries()) {
    speaking.value = i
    const r = await speakItem(it)
    speaking.value = -1
    if (r === 'cancelled' || run !== announcement) return
    if (!await wait(350) || run !== announcement) return
  }
  busy.value = false
}

function startRound() {
  loaded.value = []
  leaving.value = false
  slotMiss.value = 0
  announce()
}

async function choose(item) {
  if (busy.value || leaving.value || loaded.value.includes(item)) return
  const expect = round.value.seq[loaded.value.length]
  if (item.id === expect.id) {
    hit()
    if (!slotMiss.value) markCorrect(item)
    slotMiss.value = 0
    loaded.value.push(item)
    if (loaded.value.length === round.value.seq.length) {
      leaving.value = true
      sfx.toot()
      if (await wait(1600)) next()
    }
  } else {
    mistakes.value++
    slotMiss.value++
    if (slotMiss.value === 1) markMiss(expect)
    miss()
    sfx.buzz()
    shaking.value = item.id
    wait(400).then((active) => active && (shaking.value = null))
    busy.value = true
    if (await speak('Try again.') === 'cancelled' || !isActive()) return
    // 已经装好的车厢不动，只把这一节要装的再报一遍
    if (await speakItem(expect) === 'cancelled' || !isActive()) return
    busy.value = false
  }
}

function next() {
  if (ri.value + 1 < rounds.value.length) {
    ri.value++
    startRound()
  } else {
    finished.value = true
    sfx.win()
    reward.value = finishGame(props.module, props.unit, 'train', stars.value)
  }
}

onMounted(build)
</script>

<template>
  <section class="game train">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="round">
      <ComboBadge :n="combo" />
      <div class="progress-dots">
        <span v-for="(x, i) in rounds" :key="i" :class="{ on: i < ri, cur: i === ri }"></span>
      </div>
      <p class="feed-hint">按听到的顺序，把图片装上小火车</p>

      <div class="track">
        <div class="train-row" :class="{ leaving }">
          <img class="engine" :src="'/images/ui/train-engine.webp'" alt="" draggable="false" />
          <div v-for="(slot, i) in round.seq" :key="i" class="car" :class="{ speaking: speaking === i, next: !busy && !leaving && i === loaded.length }">
            <div class="cargo">
              <img v-if="loaded[i]" :src="imageUrl(loaded[i].image)" alt="" draggable="false" />
              <span v-else class="slot-num">{{ i + 1 }}</span>
            </div>
            <img class="car-body" :src="'/images/ui/train-car.webp'" alt="" draggable="false" />
          </div>
        </div>
        <div class="rail"></div>
      </div>

      <ReplayButton label="重听整列" :disabled="busy || leaving" @click="announce" />

      <div class="choices" :class="`n${round.choices.length}`" data-quiet>
        <button
          v-for="c in round.choices"
          :key="c.id"
          class="option"
          :class="{ used: loaded.includes(c), wrong: shaking === c.id, 'hint-glow': hintId === c.id }"
          :disabled="busy"
          @click="choose(c)"
        >
          <img :src="imageUrl(c.image)" alt="" draggable="false" />
        </button>
      </div>
    </template>
  </section>
</template>
