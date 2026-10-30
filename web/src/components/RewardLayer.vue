<script setup>
// 全局提示层：顶部依次弹出小提示（新贴纸、任务完成、打卡礼物），获得徽章时弹大窗
import { computed, nextTick, ref, watch } from 'vue'
import { events, dismiss } from '../lib/rewards.js'
import { BADGE_BAMBOO } from '../lib/catalog.js'
import { sfx } from '../lib/sfx.js'
import { confetti } from '../lib/fx.js'
import Icon from './Icon.vue'

const toast = computed(() => (events.hold ? null : events.queue.find((e) => e.kind === 'toast')))
const badge = computed(() => (events.hold ? null : events.queue.find((e) => e.kind === 'badge')))
const badgeImg = ref(null)

let timer = null
watch(
  () => toast.value?.id,
  (id) => {
    clearTimeout(timer)
    if (!id) return
    sfx.ding()
    timer = setTimeout(() => dismiss(id), 2400)
  },
)

watch(
  () => badge.value?.id,
  async (id) => {
    if (!id) return
    sfx.win()
    await nextTick()
    confetti({ from: badgeImg.value })
  },
)
</script>

<template>
  <Transition name="toast">
    <div v-if="toast" :key="toast.id" class="toast" @click="dismiss(toast.id)">
      <img v-if="toast.img" :src="toast.img" alt="" class="toast-img" />
      <Icon v-else class="toast-icon" :name="toast.icon" />
      <span class="toast-text">{{ toast.text }}</span>
      <span v-if="toast.bamboo" class="toast-bamboo">+{{ toast.bamboo }}<img src="/images/ui/bamboo.webp" alt="" /></span>
    </div>
  </Transition>

  <Transition name="pop">
    <div v-if="badge" class="modal-mask" @click.self="dismiss(badge.id)">
      <div class="modal badge-modal">
        <p class="modal-kicker">获得新徽章！</p>
        <img ref="badgeImg" :src="`/images/ui/badges/${badge.badge.id}.webp`" alt="" class="badge-big" />
        <h2>{{ badge.badge.name }}</h2>
        <p class="muted">{{ badge.badge.desc }}</p>
        <p class="badge-gift">+{{ BADGE_BAMBOO }} <img src="/images/ui/bamboo.webp" alt="" /></p>
        <button class="big-btn" @click="dismiss(badge.id)">太棒了</button>
      </div>
    </div>
  </Transition>
</template>
