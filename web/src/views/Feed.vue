<script setup>
import { computed, onMounted, ref } from 'vue'
import { imageUrl, unitItems, moduleItems, distractors, shuffle } from '../lib/content.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import { finishGame, markCorrect } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import Result from '../components/Result.vue'

const { speak, speakItem, wait } = useAudio()

const props = defineProps({ module: String, unit: String })

const ROUNDS = 6

const rounds = ref([])
const ri = ref(0)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
// 这一轮是否喂错过；第一次就喂对才算答对
let missed = false
const mood = ref('hungry') // hungry | chomp | no
const eaten = ref(null)

const round = computed(() => rounds.value[ri.value])
const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 2 ? 2 : 1))

// 拖拽状态：用 pointer 事件自己实现，手机上 HTML5 拖放不可用
const drag = ref(null) // { item, x, y, el }
const mouth = ref(null)

function build() {
  const items = unitItems(props.module, props.unit)
  const pool = moduleItems(props.module)
  const targets = shuffle(items).slice(0, Math.min(ROUNDS, items.length))
  rounds.value = targets.map((t) => {
    // 本单元干扰项不够时（比如 hat 和"帽子里/上/下的小鸟"互斥），从整个 Module 补
    let others = distractors([t], items, 2)
    if (others.length < 2) others = [...others, ...distractors([t, ...others], pool.filter((p) => !items.includes(p)), 2 - others.length)]
    return { target: t, foods: shuffle([t, ...others]) }
  })
  ri.value = 0
  mistakes.value = 0
  finished.value = false
  mood.value = 'hungry'
  missed = false
  eaten.value = null
  wait(400).then((active) => active && play())
}

function play() {
  if (round.value && mood.value === 'hungry' && !finished.value) speakItem(round.value.target)
}

function onDown(e, item) {
  if (mood.value !== 'hungry' || finished.value) return
  const el = e.currentTarget
  el.setPointerCapture(e.pointerId)
  const r = el.getBoundingClientRect()
  drag.value = { item, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width }
}

function onMove(e) {
  if (!drag.value) return
  drag.value.x = e.clientX
  drag.value.y = e.clientY
}

const moved = (d) => Math.hypot(d.x - d.x0, d.y - d.y0) > 10

function overMouth(x, y) {
  const r = mouth.value?.getBoundingClientRect()
  if (!r) return false
  const pad = 30
  return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad
}

// 拖到嘴边算喂；没怎么动就当点一下，照顾还不会拖的孩子
function onUp(e) {
  const d = drag.value
  if (!d) return
  drag.value = null
  if (!moved(d) || overMouth(e.clientX, e.clientY)) feed(d.item)
}

async function feed(item) {
  if (mood.value !== 'hungry' || finished.value) return
  if (item.id === round.value.target.id) {
    mood.value = 'chomp'
    eaten.value = item.id
    sfx.chomp()
    if (!missed) markCorrect(item)
    if (await speakItem(item) === 'cancelled') return
    if (await wait(600)) next()
  } else {
    mistakes.value++
    missed = true
    mood.value = 'no'
    sfx.buzz()
    if (await speak('Try again.') === 'cancelled') return
    mood.value = 'hungry'
    play()
  }
}

function next() {
  missed = false
  eaten.value = null
  mood.value = 'hungry'
  if (ri.value + 1 < rounds.value.length) {
    ri.value++
    play()
  } else {
    finished.value = true
    sfx.win()
    reward.value = finishGame(props.module, props.unit, 'feed', stars.value)
  }
}

const dragStyle = computed(() => {
  const d = drag.value
  if (!d) return null
  return { left: d.x - d.dx + 'px', top: d.y - d.dy + 'px', width: d.w + 'px' }
})

onMounted(build)
</script>

<template>
  <section class="game feed" @pointermove="onMove" @pointerup="onUp" @pointercancel="drag = null">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="round">
      <div class="progress-dots">
        <span v-for="(x, i) in rounds" :key="i" :class="{ on: i < ri, cur: i === ri }"></span>
      </div>

      <div class="panda-zone">
        <ReplayButton compact class="feed-replay prominent" label="重听题目" :disabled="mood !== 'hungry'" @click="play" />
        <div ref="mouth" class="panda" :class="[mood, { target: drag && moved(drag) && overMouth(drag.x, drag.y) }]">
          <img :src="mood === 'chomp' ? '/images/ui/mascot-happy.webp' : '/images/ui/mascot-hungry.webp'" alt="" draggable="false" />
        </div>
        <p class="feed-hint">把听到的图片拖给小熊猫</p>
      </div>

      <div class="foods" data-quiet>
        <button
          v-for="f in round.foods"
          :key="f.id"
          class="food"
          :class="{ dragging: drag?.item.id === f.id && moved(drag), gone: eaten === f.id }"
          @pointerdown="onDown($event, f)"
        >
          <img :src="imageUrl(f.image)" alt="" draggable="false" />
        </button>
      </div>

      <div v-if="drag && moved(drag)" class="food ghost-food" :style="dragStyle">
        <img :src="imageUrl(drag.item.image)" alt="" draggable="false" />
      </div>
    </template>
  </section>
</template>
