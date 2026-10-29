<script setup>
// 结算页：星星一颗颗蹦出来，竹子飞进顶栏，满分撒彩纸
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { outfit, landBamboo, settleBamboo, events } from '../lib/rewards.js'
import { speak } from '../lib/speech.js'
import { sfx } from '../lib/sfx.js'
import { confetti, flyTo } from '../lib/fx.js'

const props = defineProps({
  stars: Number,
  back: String,
  // finishGame() 的返回值：{ bamboo, prev, newBest }
  reward: { type: Object, default: null },
})
defineEmits(['again'])

const shown = ref(0)
const showPill = ref(false)
const pill = ref(null)
const hero = ref(null)
const timers = []
const later = (fn, ms) => timers.push(setTimeout(fn, ms))

const praise = props.stars === 3 ? 'Amazing!' : props.stars === 2 ? 'Well done!' : props.stars === 1 ? 'Good!' : 'Keep trying!'

onMounted(() => {
  events.hold = true
  for (let i = 0; i < props.stars; i++) {
    later(() => {
      shown.value = i + 1
      sfx.star(i)
    }, 350 + i * 380)
  }
  const afterStars = 350 + props.stars * 380
  later(() => speak(praise), afterStars)
  if (props.stars === 3) later(() => confetti({ from: hero.value }), afterStars)

  const n = props.reward?.bamboo || 0
  // 星星和竹子都落地后再放出徽章、任务提示
  later(() => (events.hold = false), afterStars + (n ? 700 + 750 + n * 160 + 400 : 600))
  if (!n) return
  later(() => (showPill.value = true), afterStars + 200)
  later(() => {
    flyTo(pill.value, document.querySelector('#bamboo-counter'), {
      img: '/images/ui/bamboo.webp',
      n,
      onEach: () => {
        sfx.coin()
        landBamboo(1)
      },
      onDone: settleBamboo,
    })
  }, afterStars + 700)
})

// 动画没放完就离开：直接把数字补齐
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  events.hold = false
  settleBamboo()
})
</script>

<template>
  <div class="result">
    <div ref="hero" class="result-hero">
      <span v-if="reward?.newBest" class="ribbon">新纪录！</span>
      <img :src="outfit.img" alt="" class="mascot" :class="{ cheer: stars >= 2 }" />
    </div>
    <div class="result-stars">
      <span v-for="i in 3" :key="i" :class="{ on: i <= shown }">★</span>
    </div>
    <p>{{ praise }}</p>
    <div class="result-note"><slot /></div>
    <div class="reward-slot">
      <Transition name="pop">
        <span v-if="showPill" ref="pill" class="reward-pill">+{{ reward.bamboo }} <img src="/images/ui/bamboo.webp" alt="" /></span>
      </Transition>
    </div>
    <div class="result-actions">
      <button class="big-btn" @click="$emit('again')">再来一次</button>
      <router-link :to="back" class="big-btn ghost">回到单元</router-link>
    </div>
  </div>
</template>
