<script setup>
// 单词贴纸册：每个词句答对 STICKER_AT 次变成一张贴纸，点一下读出来
import { computed } from 'vue'
import { book, bookId, imageUrl } from '../lib/content.js'
import { rewards, stickerCount, bookStickers, STICKER_AT } from '../lib/rewards.js'
import { speakItem } from '../lib/speech.js'
import BookPicker from '../components/BookPicker.vue'

const have = (it) => rewards.mastery[`${bookId.value}/${it.id}`] || 0
const total = computed(() => book.value.modules.reduce((s, m) => s + m.units.reduce((t, u) => t + u.items.length, 0), 0))
// 每张贴纸固定一个小角度，看起来像手贴上去的
const tilt = (id) => ((id.length * 37) % 9) - 4

function tap(it) {
  if (have(it) >= STICKER_AT) speakItem(it)
}
</script>

<template>
  <section class="stickers">
    <div class="page-head">
      <h1>贴纸册</h1>
      <span class="head-pill">🏷️ 共 {{ stickerCount }} 张</span>
    </div>
    <p class="muted page-tip">一个词句答对 {{ STICKER_AT }} 次，就能收集一张贴纸</p>
    <BookPicker icon="🏷️" :count="bookStickers" />
    <p class="album-count">这一册：{{ bookStickers(bookId) }} / {{ total }}</p>

    <div v-for="m in book.modules" :key="m.id" class="album-module">
      <h2>{{ m.title }}</h2>
      <div class="sticker-grid">
        <template v-for="u in m.units" :key="u.id">
          <button
            v-for="it in u.items"
            :key="it.id"
            class="sticker"
            :class="{ got: have(it) >= STICKER_AT }"
            :style="{ '--tilt': tilt(it.id) + 'deg' }"
            @click="tap(it)"
          >
            <img :src="imageUrl(it.image)" alt="" loading="lazy" draggable="false" />
            <span v-if="have(it) >= STICKER_AT" class="sticker-text">{{ it.text }}</span>
            <span v-else class="sticker-dots">
              <i v-for="k in STICKER_AT" :key="k" :class="{ on: k <= have(it) }"></i>
            </span>
          </button>
        </template>
      </div>
    </div>
  </section>
</template>
