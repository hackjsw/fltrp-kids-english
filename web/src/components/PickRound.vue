<script setup>
// 听音选图的一道题，听选和错题复习共用。答错一次去掉那张图，再错就让正确的图晃一晃，不能靠乱点蒙过去
// read：三年级起有些题不放声音，改成看英文选图；答错后才能点「听一听」
import { computed, onMounted, ref } from 'vue'
import { imageUrl } from '../lib/content.js'
import { useAudio } from '../lib/useAudio.js'
import { sfx } from '../lib/sfx.js'
import { sparkle } from '../lib/fx.js'
import ReplayButton from './ReplayButton.vue'
import Icon from './Icon.vue'

const props = defineProps({ q: Object })
// wrong(first)：每次答错；right(firstTry)：答对；next：放完发音，可以下一题
const emit = defineEmits(['wrong', 'right', 'next'])
const { speak, speakItem, wait } = useAudio()

const picked = ref(null)
const busy = ref(false)
const out = ref(new Set())
const wrongs = ref(0)
const canHear = computed(() => !props.q.read || wrongs.value > 0)
const glow = computed(() => wrongs.value >= 2 || out.value.size >= props.q.options.length - 1)

function hear() {
  if (!busy.value && canHear.value) speakItem(props.q.target, props.q.book)
}

async function choose(opt, e) {
  if (busy.value || out.value.has(opt.id)) return
  busy.value = true
  const correct = opt.id === props.q.target.id
  picked.value = { id: opt.id, correct }
  if (!correct) {
    wrongs.value++
    emit('wrong', wrongs.value === 1)
    sfx.buzz()
    if (await speak('Try again.') === 'cancelled') return
    out.value = new Set([...out.value, opt.id])
    picked.value = null
    busy.value = false
    hear()
    return
  }
  emit('right', wrongs.value === 0)
  sparkle(e?.currentTarget)
  if (await speakItem(props.q.target, props.q.book) === 'cancelled') return
  if (await wait(500)) emit('next')
}

onMounted(() => wait(400).then((active) => active && hear()))
</script>

<template>
  <div class="pick-head">
    <div v-if="q.read" class="read-card">
      <Icon name="glasses" class="read-icon" />
      <b>{{ q.target.text }}</b>
      <ReplayButton v-if="canHear" compact label="听一听" :disabled="busy" @click="hear" />
    </div>
    <ReplayButton v-else class="prominent" label="重听题目" :disabled="busy" @click="hear" />
    <slot />
  </div>
  <p v-if="q.read" class="feed-hint">读一读，选出对的图</p>
  <div class="options" :class="`n${q.options.length}`" data-quiet>
    <button
      v-for="opt in q.options"
      :key="opt.id"
      class="option"
      :class="{
        right: picked?.id === opt.id && picked.correct,
        wrong: picked?.id === opt.id && !picked.correct,
        out: out.has(opt.id),
        'hint-glow': glow && opt.id === q.target.id && !picked?.correct,
      }"
      :disabled="busy || out.has(opt.id)"
      @click="choose(opt, $event)"
    >
      <img :src="imageUrl(opt.image, q.book)" alt="" />
    </button>
  </div>
</template>
