<script setup>
// 翻翻乐：卡片扣着，翻开「喇叭卡」会读出一个词句，再翻出对应的图片配成一对。练听力也练记性
// 对数按年级（games.js level）；一二年级开局先把所有卡亮一会儿
import { computed, onMounted, ref } from 'vue'
import { bookId, gradeOf, imageUrl, unitItems, moduleItems } from '../lib/content.js'
import { level } from '../lib/games.js'
import { pickPairs, deck } from '../lib/memory.js'
import { useAudio } from '../lib/useAudio.js'
import { finishGame, markCorrect, markPair } from '../lib/rewards.js'
import { useCombo } from '../lib/play.js'
import { sfx } from '../lib/sfx.js'
import { confetti } from '../lib/fx.js'
import ComboBadge from '../components/ComboBadge.vue'
import Icon from '../components/Icon.vue'
import Result from '../components/Result.vue'

const PEEK_MS = 2500

const props = defineProps({ module: String, unit: String })
const { speakItem, wait } = useAudio()
const { combo, hit, miss, reset } = useCombo()

const cards = ref([])
const open = ref([]) // 翻开、还没配上的卡，最多两张
const done = ref(new Set()) // 已经配上的词句 id
const peeking = ref(false)
const busy = ref(false)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const grid = ref(null)

const pairs = computed(() => cards.value.length / 2)
// 一开始谁也不知道卡在哪，翻错难免：错的次数不超过对数算 3 星
const stars = computed(() => (mistakes.value <= pairs.value ? 3 : mistakes.value <= pairs.value * 2 ? 2 : 1))
const isUp = (c) => peeking.value || open.value.includes(c) || done.value.has(c.item.id)

async function build() {
  const n = level(gradeOf(bookId.value)).pairs
  cards.value = deck(pickPairs(unitItems(props.module, props.unit), moduleItems(props.module), n))
  open.value = []
  done.value = new Set()
  mistakes.value = 0
  finished.value = false
  busy.value = false
  reset()
  if (gradeOf(bookId.value) > 2) return
  peeking.value = busy.value = true
  if (!(await wait(PEEK_MS))) return
  peeking.value = busy.value = false
}

async function flip(c) {
  // 已经配好的卡，或者翻开着的喇叭卡：点一下再听一遍
  if (done.value.has(c.item.id) || open.value.includes(c)) {
    if (done.value.has(c.item.id) || c.kind === 'sound') speakItem(c.item)
    return
  }
  if (busy.value) return
  open.value = [...open.value, c]
  if (c.kind === 'sound') speakItem(c.item)
  else sfx.pop()
  if (open.value.length < 2) return
  busy.value = true
  const [a, b] = open.value
  if (a.item.id === b.item.id) {
    done.value = new Set([...done.value, a.item.id])
    open.value = []
    hit()
    markCorrect(a.item)
    markPair()
    // 后翻的是图片：配上了再读一遍；后翻的是喇叭，刚才已经在读了
    if (b.kind === 'pic') speakItem(a.item)
    if (done.value.size < pairs.value) {
      busy.value = false
      return
    }
    confetti({ from: grid.value, n: 40 })
    if (await wait(1200)) finish()
  } else {
    mistakes.value++
    miss()
    sfx.buzz()
    if (!(await wait(900))) return
    open.value = []
    busy.value = false
  }
}

function finish() {
  finished.value = true
  sfx.win()
  reward.value = finishGame(props.module, props.unit, 'memory', stars.value)
}

onMounted(build)
</script>

<template>
  <section class="game memory">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="cards.length">
      <ComboBadge :n="combo" />
      <div class="progress-dots">
        <span v-for="i in pairs" :key="i" :class="{ on: i <= done.size }"></span>
      </div>
      <p class="feed-hint mem-hint">
        <template v-if="peeking"><Icon name="eye" />先看一看，记住它们在哪</template>
        <template v-else>翻开喇叭听一听，再找出对的图</template>
      </p>
      <div ref="grid" class="mem-grid" :class="`c${cards.length}`" data-quiet>
        <button
          v-for="c in cards"
          :key="c.key"
          type="button"
          class="mem-card"
          :class="{ up: isUp(c), matched: done.has(c.item.id) }"
          :aria-label="isUp(c) ? (c.kind === 'sound' ? '喇叭卡' : '图片卡') : '扣着的卡'"
          @click="flip(c)"
        >
          <span class="mem-inner">
            <span class="mem-face mem-back"><Icon name="paw" /></span>
            <span class="mem-face mem-front" :class="c.kind">
              <Icon v-if="c.kind === 'sound'" name="speaker" />
              <img v-else :src="imageUrl(c.item.image)" alt="" draggable="false" />
            </span>
          </span>
        </button>
      </div>
    </template>
  </section>
</template>
