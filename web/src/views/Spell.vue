<script setup>
// 拼单词（三年级起）：看图、听发音，按顺序点字母块拼出单词；句子挖掉一个关键词来拼
// 点错晃一下；同一格错两次，对的字母块晃一晃。高年级多放几个干扰字母（games.js level）
import { computed, onMounted, ref } from 'vue'
import { bookId, gradeOf, imageUrl, unitItems, shuffle } from '../lib/content.js'
import { level } from '../lib/games.js'
import { pickSpell, letterTiles } from '../lib/spell.js'
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
const { combo, hit, miss, reset } = useCombo()

const rounds = ref([])
const ri = ref(0)
const placed = ref([]) // 已经点对的字母块 id
const slotMiss = ref(0) // 当前这一格错了几次
const shaking = ref(null)
const done = ref(false)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const card = ref(null)
let roundMissed = false

const round = computed(() => rounds.value[ri.value])
const stars = computed(() => (mistakes.value <= 1 ? 3 : mistakes.value <= 4 ? 2 : 1))
const nextLetter = computed(() => round.value?.word[placed.value.length])
const hintId = computed(() => {
  if (slotMiss.value < 2 || !nextLetter.value) return null
  return round.value.tiles.find((t) => !placed.value.includes(t.id) && t.letter === nextLetter.value)?.id
})

// 打乱字母块，别正好是原来的顺序
function scramble(letters) {
  const t = letters.map((letter, id) => ({ id, letter }))
  for (let k = 0; k < 5; k++) {
    const s = shuffle(t)
    if (s.some((x, i) => x.id !== i)) return s
  }
  return t.reverse()
}

// 先拼单词项，再拼句子里挖空的词
function build() {
  const extra = level(gradeOf(bookId.value)).spellExtra
  const all = unitItems(props.module, props.unit).map((item) => ({ item, ...pickSpell(item) })).filter((x) => x.word)
  const words = all.filter((x) => !x.before && !x.after)
  const sentences = all.filter((x) => x.before || x.after)
  rounds.value = [...shuffle(words), ...shuffle(sentences)].slice(0, ROUNDS).map((r) => ({ ...r, tiles: scramble(letterTiles(r.word, extra)) }))
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
  wait(400).then((active) => active && hear())
}

function hear() {
  if (round.value) speakItem(round.value.item)
}

async function choose(t) {
  if (done.value || placed.value.includes(t.id)) return
  if (t.letter === nextLetter.value) {
    placed.value.push(t.id)
    slotMiss.value = 0
    sfx.pop()
    if (placed.value.length < round.value.word.length) return
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
    reward.value = finishGame(props.module, props.unit, 'spell', stars.value)
  }
}

onMounted(build)
</script>

<template>
  <section class="game spell">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="round">
      <ComboBadge :n="combo" />
      <div class="progress-dots">
        <span v-for="(x, i) in rounds" :key="i" :class="{ on: i < ri, cur: i === ri }"></span>
      </div>
      <div ref="card" class="card small order-card">
        <img :src="imageUrl(round.item.image)" alt="" />
        <p v-if="round.before || round.after" class="spell-sentence">
          <template v-if="done">{{ round.item.text }}</template>
          <template v-else>{{ round.before }}<span class="spell-blank"></span>{{ round.after }}</template>
        </p>
        <p class="order-line spell-line">
          <span v-for="(c, i) in round.word" :key="i" class="order-slot" :class="{ filled: placed.length > i, next: !done && placed.length === i }">{{ placed.length > i ? c : '' }}</span>
        </p>
        <p class="order-cn">{{ round.item.translation }}</p>
      </div>
      <div class="order-tiles spell-tiles" data-quiet>
        <button
          v-for="t in round.tiles"
          :key="t.id"
          type="button"
          class="order-tile"
          :class="{ used: placed.includes(t.id), wrong: shaking === t.id, 'hint-glow': hintId === t.id }"
          :disabled="done || placed.includes(t.id)"
          @click="choose(t)"
        >{{ t.letter }}</button>
      </div>
      <ReplayButton compact label="再听一遍" class="order-hear" @click="hear" />
    </template>
  </section>
</template>
