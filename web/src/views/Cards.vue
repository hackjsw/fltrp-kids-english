<script setup>
import { computed, ref } from 'vue'
import { findUnit, imageUrl } from '../lib/content.js'
import { speakItem } from '../lib/speech.js'

const props = defineProps({ module: String, unit: String })
const items = computed(() => findUnit(props.module, props.unit)?.unit.items || [])
const index = ref(0)
const item = computed(() => items.value[index.value])
const showCn = ref(false)

function go(step) {
  index.value = (index.value + step + items.value.length) % items.value.length
  showCn.value = false
  speakItem(item.value)
}
</script>

<template>
  <section v-if="item" class="cards">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <div class="card" @click="speakItem(item)">
      <img :src="imageUrl(item.image)" :alt="item.text" />
      <div class="card-text">{{ item.text }}</div>
      <div class="card-cn" @click.stop="showCn = !showCn">{{ showCn ? item.translation : '中文？' }}</div>
    </div>
    <div class="pager">
      <button class="big-btn" @click="go(-1)">◀</button>
      <span>{{ index + 1 }} / {{ items.length }}</span>
      <button class="big-btn" @click="go(1)">▶</button>
    </div>
  </section>
</template>
