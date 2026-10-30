<script setup>
// 连对小贴纸：连对 2 次起出现在右上角，每多一次弹一下
import Icon from './Icon.vue'

defineProps({ n: Number })
</script>

<template>
  <Transition name="pop">
    <span v-if="n >= 2" :key="n" class="combo-badge"><Icon name="flame" />连对 {{ n }}</span>
  </Transition>
</template>
