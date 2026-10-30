<script setup>
// 一到六年级的小圆贴纸：首页点了直接去闯关，闯关页、贴纸册的选书面板里用来换年级
import { GRADES } from '../lib/content.js'
import Icon from './Icon.vue'

defineProps({ current: Number })
defineEmits(['pick'])

const CN = ['', '一', '二', '三', '四', '五', '六']
</script>

<template>
  <div class="grade-dots">
    <button
      v-for="g in GRADES"
      :key="g"
      type="button"
      class="grade-dot"
      :class="[`g${g}`, { on: g === current }]"
      :aria-label="`${CN[g]}年级`"
      :aria-pressed="g === current"
      @click="$emit('pick', g)"
    >
      <b>{{ CN[g] }}</b>
      <small>年级</small>
      <Icon v-if="g === current" name="bow" class="grade-bow" />
    </button>
  </div>
</template>
