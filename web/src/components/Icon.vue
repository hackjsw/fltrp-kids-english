<script setup>
// 界面小图标：scripts/icon_sheets.py 把 Magpie 生成的图标拼成一张精灵图，所有图标只占一次图片请求
import { computed } from 'vue'
import sheet from '../assets/icons.webp'
import index from '../assets/icons.json'

const props = defineProps({ name: { type: String, required: true } })

const pct = (n, total) => (total > 1 ? (n / (total - 1)) * 100 : 0)

const style = computed(() => {
  const i = index.names.indexOf(props.name)
  if (i < 0) {
    if (import.meta.env.DEV) console.warn(`没有这个图标：${props.name}`)
    return null
  }
  return {
    backgroundImage: `url(${sheet})`,
    backgroundSize: `${index.cols * 100}% ${index.rows * 100}%`,
    backgroundPosition: `${pct(i % index.cols, index.cols)}% ${pct(Math.floor(i / index.cols), index.rows)}%`,
  }
})
</script>

<template>
  <span class="ui-icon" :style="style" aria-hidden="true"></span>
</template>
