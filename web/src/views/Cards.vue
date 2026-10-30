<script setup>
// 看图学：点卡片听发音，翻面看中文，左右切换时卡片滑动
import { computed, onMounted, ref } from 'vue'
import { findUnit, imageUrl } from '../lib/content.js'
import { useAudio } from '../lib/useAudio.js'
import ReplayButton from '../components/ReplayButton.vue'
import { markCard } from '../lib/rewards.js'

const { speakItem } = useAudio()

const props = defineProps({ module: String, unit: String })
const items = computed(() => findUnit(props.module, props.unit)?.unit.items || [])
const index = ref(0)
const item = computed(() => items.value[index.value])
const flipped = ref(false)
const dir = ref('next')
const seen = new Set()

function show() {
  if (!seen.has(item.value.id)) {
    seen.add(item.value.id)
    markCard()
  }
  speakItem(item.value)
}

function go(step) {
  dir.value = step > 0 ? 'next' : 'prev'
  flipped.value = false
  index.value = (index.value + step + items.value.length) % items.value.length
  show()
}

onMounted(() => item.value && show())
</script>

<template>
  <section v-if="item" class="cards">
    <router-link :to="`/u/${module}/${unit}`" class="back">← 返回</router-link>
    <div class="progress-dots">
      <span v-for="(x, i) in items" :key="i" :class="{ on: i < index, cur: i === index }"></span>
    </div>
    <div class="card-stage">
      <Transition :name="`slide-${dir}`" mode="out-in">
        <div :key="item.id" class="flip" :class="{ flipped }">
          <div class="flip-inner">
            <div class="card face front" @click="speakItem(item)">
              <img :src="imageUrl(item.image)" :alt="item.text" />
              <div class="card-text">{{ item.text }}</div>
              <div class="card-tools">
                <ReplayButton compact @click.stop="speakItem(item)" />
                <button class="flip-btn" @click.stop="flipped = true">看中文</button>
              </div>
            </div>
            <div class="card face back" @click="flipped = false">
              <img :src="imageUrl(item.image)" alt="" class="back-img" />
              <div class="card-cn-big">{{ item.translation }}</div>
              <div class="card-en-small">{{ item.text }}</div>
              <ReplayButton compact @click.stop="speakItem(item)" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div class="pager">
      <button class="big-btn" @click="go(-1)">◀</button>
      <span>{{ index + 1 }} / {{ items.length }}</span>
      <button class="big-btn" @click="go(1)">▶</button>
    </div>
  </section>
</template>
