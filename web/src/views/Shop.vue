<script setup>
// 衣橱：用竹子给小熊猫换装。点没买的先预览，再确认购买
import { computed, ref } from 'vue'
import { OUTFITS } from '../lib/catalog.js'
import { rewards, outfit, buy, wear } from '../lib/rewards.js'
import { sfx } from '../lib/sfx.js'
import { confetti } from '../lib/fx.js'

const picked = ref(null)
const preview = ref(null)
const shaking = ref(false)
const shown = computed(() => picked.value || outfit.value)
const owned = (o) => rewards.owned.includes(o.id)

function choose(o) {
  if (owned(o)) {
    wear(o.id)
    picked.value = null
    sfx.ding()
  } else {
    picked.value = o
  }
}

function confirm() {
  const o = picked.value
  if (!o) return
  if (buy(o.id)) {
    picked.value = null
    sfx.chest()
    confetti({ from: preview.value })
  } else {
    sfx.buzz()
    shaking.value = true
    setTimeout(() => (shaking.value = false), 400)
  }
}
</script>

<template>
  <section class="shop">
    <div class="page-head">
      <h1>小熊猫衣橱</h1>
      <span class="head-pill"><img src="/images/ui/bamboo.webp" alt="" /> {{ rewards.bamboo }}</span>
    </div>

    <div class="shop-stage">
      <img ref="preview" :key="shown.id" :src="shown.img" alt="" class="shop-preview" />
      <div class="shop-caption">
        <b>{{ shown.name }}</b>
        <template v-if="picked">
          <button class="big-btn" :class="{ shake: shaking }" @click="confirm">
            用 {{ picked.price }} <img src="/images/ui/bamboo.webp" alt="" class="btn-bamboo" /> 换上
          </button>
          <span v-if="rewards.bamboo < picked.price" class="muted">还差 {{ picked.price - rewards.bamboo }} 根竹子，去闯关赚吧</span>
        </template>
        <span v-else class="muted">正在穿</span>
      </div>
    </div>

    <div class="outfit-grid">
      <button
        v-for="o in OUTFITS"
        :key="o.id"
        class="outfit"
        :class="{ wearing: rewards.outfit === o.id, locked: !owned(o), picked: picked?.id === o.id }"
        @click="choose(o)"
      >
        <img :src="o.img" alt="" loading="lazy" draggable="false" />
        <span class="outfit-name">{{ o.name }}</span>
        <span v-if="rewards.outfit === o.id" class="outfit-tag on">穿着</span>
        <span v-else-if="owned(o)" class="outfit-tag">已拥有</span>
        <span v-else class="outfit-tag price">{{ o.price }} <img src="/images/ui/bamboo.webp" alt="" /></span>
      </button>
    </div>
  </section>
</template>
