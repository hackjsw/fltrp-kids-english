<script setup>
// 排句子（三年级起）：看图，把打乱的词块按顺序点出来。点错晃一下；同一格错两次，对的词块晃一晃
import { computed, onMounted, ref } from 'vue'
import { imageUrl, unitItems, shuffle } from '../lib/content.js'
import { tiles as split, canOrder, sameWord } from '../lib/order.js'
import { useAudio } from '../lib/useAudio.js'
import { finishGame, markCorrect } from '../lib/rewards.js'
import { useCombo } from '../lib/play.js'
import { sfx } from '../lib/sfx.js'
import { confetti } from '../lib/fx.js'
import ReplayButton from '../components/ReplayButton.vue'
import ComboBadge from '../components/ComboBadge.vue'
import Result from '../components/Result.vue'

const ROUNDS = 4

const props = defineProps({ module: String, unit: String })
const { speakItem, wait } = useAudio()

const rounds = ref([])
const ri = ref(0)
const placed = ref([]) // 已经点对的词块 id
const slotMiss = ref(0) // 当前这一格错了几次
const shaking = ref(null)
const done = ref(false)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const card = ref(null)
const { combo, hit, miss, reset } = useCombo()
let roundMissed = false

const round = computed(() => rounds.value[ri.value])
const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 3 ? 2 : 1))
const nextWord = computed(() => round.value?.words[placed.value.length])
const hintId = computed(() => {
  if (slotMiss.value < 2 || !nextWord.value) return null
  return round.value.tiles.find((t) => !placed.value.includes(t.id) && sameWord(t.word, nextWord.value))?.id
})

// 打乱，尽量不和原句一样
function scramble(words) {
  const t = words.map((word, id) => ({ id, word }))
  for (let k = 0; k < 5; k++) {
    const s = shuffle(t)
    if (s.some((x, i) => x.id !== i)) return s
  }
  return t.reverse()
}

function build() {
  const items = shuffle(unitItems(props.module, props.unit).filter(canOrder)).slice(0, ROUNDS)
  rounds.value = items.map((item) => {
    const words = split(item.text)
    return { item, words, tiles: scramble(words) }
  })
  ri.value = 0
  mistakes.value = 0
  finished.value = false
  reset()
  startRound()
}

function startRound() {
  placed.value = []
  slotMiss.value = 0
  done.value = false
  roundMissed = false
}

async function choose(t) {
  if (done.value || placed.value.includes(t.id)) return
  if (sameWord(t.word, nextWord.value)) {
    placed.value.push(t.id)
    slotMiss.value = 0
    sfx.pop()
    if (placed.value.length < round.value.words.length) return
    done.value = true
    hit({ quiet: true })
    if (!roundMissed) markCorrect(round.value.item)
    confetti({ from: card.value, n: 30 })
    if (await speakItem(round.value.item) === 'cancelled') return
    if (await wait(900)) nextRound()
  } else {
    mistakes.value++
    slotMiss.value++
    roundMissed = true
    miss()
    sfx.buzz()
    shaking.value = t.id
    wait(400).then((active) => active && (shaking.value = null))
  }
}

function nextRound() {
  if (ri.value + 1 < rounds.value.length) {
    ri.value++
    startRound()
  } else {
    finished.value = true
    sfx.win()
    reward.value = finishGame(props.module, props.unit, 'order', stars.value)
  }
}

onMounted(build)
</script>

<template>
  <section class="game order">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="round">
      <ComboBadge :n="combo" />
      <div class="progress-dots">
        <span v-for="(x, i) in rounds" :key="i" :class="{ on: i < ri, cur: i === ri }"></span>
      </div>
      <div ref="card" class="card small order-card">
        <img :src="imageUrl(round.item.image)" alt="" />
        <p v-if="done" class="order-done">{{ round.item.text }}</p>
        <p v-else class="order-line">
          <span v-for="(w, i) in round.words" :key="i" class="order-slot" :class="{ filled: placed.length > i, next: placed.length === i }">{{ placed.length > i ? w : '' }}</span>
        </p>
        <p class="order-cn">{{ round.item.translation }}</p>
      </div>
      <div class="order-tiles" data-quiet>
        <button
          v-for="t in round.tiles"
          :key="t.id"
          type="button"
          class="order-tile"
          :class="{ used: placed.includes(t.id), wrong: shaking === t.id, 'hint-glow': hintId === t.id }"
          :disabled="done || placed.includes(t.id)"
          @click="choose(t)"
        >{{ t.word }}</button>
      </div>
      <ReplayButton v-if="mistakes > 0 || done" compact label="听一听整句" class="order-hear" @click="speakItem(round.item)" />
      <p v-else class="feed-hint">看图，按顺序点词块，拼出这句话</p>
    </template>
  </section>
</template>
