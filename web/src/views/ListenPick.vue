<script setup>
import { computed, onMounted, ref } from 'vue'
import { findUnit, imageUrl, moduleItems, shuffle, distractors } from '../lib/content.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import { finishGame, markCorrect } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import { sparkle } from '../lib/fx.js'
import Result from '../components/Result.vue'

const { speak, speakItem, wait } = useAudio()

const props = defineProps({ module: String, unit: String })

// 每题：目标项 + 从同 Module 抽的干扰项，共 3 张图
const questions = ref([])
const qi = ref(0)
const picked = ref(null)
const mistakes = ref(0)
const finished = ref(false)
const reward = ref(null)
const missed = ref(false)
const busy = ref(false)

const q = computed(() => questions.value[qi.value])

function build() {
  const targets = shuffle(findUnit(props.module, props.unit)?.unit.items || [])
  const pool = moduleItems(props.module)
  questions.value = targets.map((t) => ({
    target: t,
    // 同义项（hi/hello、bye/goodbye）不互为干扰项
    options: shuffle([
      t,
      ...distractors([t], pool, 2),
    ]),
  }))
  qi.value = 0
  mistakes.value = 0
  picked.value = null
  finished.value = false
  busy.value = false
  missed.value = false
  wait(400).then((active) => active && play())
}

function play() {
  if (q.value && !busy.value && !finished.value) speakItem(q.value.target)
}

async function choose(opt, e) {
  if (busy.value || finished.value) return
  busy.value = true
  const correct = opt.id === q.value.target.id
  picked.value = { id: opt.id, correct }
  if (!correct) {
    mistakes.value++
    missed.value = true
    sfx.buzz()
    if (await speak('Try again.') === 'cancelled') return
    busy.value = false
    picked.value = null
    play()
    return
  }
  sfx.ding()
  sparkle(e?.currentTarget)
  if (!missed.value) markCorrect(q.value.target)
  if (await speakItem(q.value.target) === 'cancelled') return
  if (await wait(500)) next()
}

function next() {
  busy.value = false
  picked.value = null
  missed.value = false
  if (qi.value + 1 < questions.value.length) {
    qi.value++
    play()
  } else {
    finished.value = true
    reward.value = finishGame(props.module, props.unit, 'listen', stars.value)
  }
}

const stars = computed(() => (mistakes.value === 0 ? 3 : mistakes.value <= 2 ? 2 : 1))

onMounted(build)
</script>

<template>
  <section class="listen">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <Result v-if="finished" :stars="stars" :reward="reward" @again="build" :back="`/u/${module}/${unit}`" />
    <template v-else-if="q">
      <div class="progress-dots">
        <span v-for="(x, i) in questions" :key="i" :class="{ on: i < qi, cur: i === qi }"></span>
      </div>
      <ReplayButton class="prominent" label="重听题目" :disabled="busy" @click="play" />
      <div class="options" data-quiet>
        <button
          v-for="opt in q.options"
          :key="opt.id"
          class="option"
          :class="{ right: picked?.id === opt.id && picked.correct, wrong: picked?.id === opt.id && !picked.correct }"
          :disabled="busy"
          @click="choose(opt, $event)"
        >
          <img :src="imageUrl(opt.image)" :alt="''" />
        </button>
      </div>
    </template>
  </section>
</template>
