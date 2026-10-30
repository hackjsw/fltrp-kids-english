// 玩法里共用的小机制：连对、幸运题
import { ref } from 'vue'
import { sfx } from './sfx.js'
import { earn, landBamboo, settleBamboo } from './rewards.js'
import { flyTo } from './fx.js'

// 连对计数：答对加一，答错清零。连对 2 次起换成一次比一次高的音
// quiet：这一下已经有自己的音效（吃东西、泡泡破），连对不到 2 次就不再响 ding
export function useCombo() {
  const combo = ref(0)
  return {
    combo,
    hit({ quiet = false } = {}) {
      combo.value++
      if (combo.value >= 2) sfx.combo(combo.value)
      else if (!quiet) sfx.ding()
    },
    miss() {
      combo.value = 0
    },
    reset() {
      combo.value = 0
    },
  }
}

// 每局随机一题当幸运题（不放第一题，留点悬念），第一次就答对多给竹子
export const LUCKY_BAMBOO = 2
export const pickLucky = (n) => (n > 1 ? 1 + Math.floor(Math.random() * (n - 1)) : -1)

export function payLucky(from) {
  earn(LUCKY_BAMBOO, { animate: true })
  flyTo(from, document.querySelector('#bamboo-counter'), {
    img: '/images/ui/bamboo.webp',
    n: LUCKY_BAMBOO,
    onEach: () => {
      sfx.coin()
      landBamboo(1)
    },
    onDone: settleBamboo,
  })
}
