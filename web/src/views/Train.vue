<script setup>
import { computed, onMounted, ref } from 'vue'
import { imageUrl, unitItems, distractors, shuffle, canConfuse } from '../lib/content.js'
import { speak, speakItem } from '../lib/speech.js'
import { finishGame, markCorrect } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import Result from '../components/Result.vue'

const props = defineProps({ module: String, unit: String })

// 车厢数逐轮增加：2、2、3、3
const PLAN = [2, 2, 3, 3]

const rounds = ref([])
const ri = ref(0)
const loaded = ref([]) // 已装上车的项
const busy = ref(false) // 正在报词，暂不接受点击
const shaking = ref(null)
const leaving = ref(false)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)

const round = computed(() => rounds.value[ri.value])
const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 2 ? 2 : 1))

function build() {
  const items = unitItems(props.module, props.unit)
  rounds.value = PLAN.map((n) => {
    const seq = shuffle(items).slice(0, Math.min(n, items.length))
    // 同义词不同时出现在一轮里（听到 hi 分不清该点 hi 还是 hello）
    const clean = seq.filter((x, i) => seq.slice(0, i).every((y) => canConfuse(x, y)))
    return { seq: clean, choices: shuffle([...clean, ...distractors(clean, items, 5 - clean.length)]) }
  })
  ri.value = 0
  mistakes.value = 0
  finished.value = false
  startRound()
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function announce() {
  busy.value = true
  await wait(400)
  for (const it of round.value.seq) {
    await speakItem(it)
    await wait(350)
  }
  busy.value = false
}

function startRound() {
  loaded.value = []
  leaving.value = false
  announce()
}

async function choose(item) {
  if (busy.value || leaving.value || loaded.value.includes(item)) return
  const expect = round.value.seq[loaded.value.length]
  if (item.id === expect.id) {
    sfx.ding()
    markCorrect(item)
    loaded.value.push(item)
    if (loaded.value.length === round.value.seq.length) {
      leaving.value = true
      sfx.toot()
      await wait(1600)
      next()
    }
  } else {
    mistakes.value++
    sfx.buzz()
    shaking.value = item.id
    setTimeout(() => (shaking.value = null), 400)
    busy.value = true
    await speak('Try again.')
    // 清空重来，按顺序再报一遍
    loaded.value = []
    await announce()
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
      <div class="progress-dots">
        <span v-for="(x, i) in rounds" :key="i" :class="{ on: i < ri, cur: i === ri }"></span>
      </div>
      <p class="feed-hint">按听到的顺序，把图片装上小火车</p>

      <div class="track">
        <div class="train-row" :class="{ leaving }">
          <img class="engine" :src="'/images/ui/train-engine.webp'" alt="" draggable="false" />
          <div v-for="(slot, i) in round.seq" :key="i" class="car">
            <div class="cargo">
              <img v-if="loaded[i]" :src="imageUrl(loaded[i].image)" alt="" draggable="false" />
              <span v-else class="slot-num">{{ i + 1 }}</span>
            </div>
            <img class="car-body" :src="'/images/ui/train-car.webp'" alt="" draggable="false" />
          </div>
        </div>
        <div class="rail"></div>
      </div>

      <button class="hud-play" :disabled="busy" @click="announce">🔊</button>

      <div class="choices" data-quiet>
        <button
          v-for="c in round.choices"
          :key="c.id"
          class="option"
          :class="{ used: loaded.includes(c), wrong: shaking === c.id }"
          :disabled="busy"
          @click="choose(c)"
        >
          <img :src="imageUrl(c.image)" alt="" draggable="false" />
        </button>
      </div>
    </template>
  </section>
</template>
