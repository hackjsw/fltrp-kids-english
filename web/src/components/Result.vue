<script setup>
defineProps({ stars: Number, back: String })
defineEmits(['again'])
</script>

<template>
  <div class="result">
    <img :src="stars >= 2 ? '/images/ui/mascot-happy.webp' : '/images/mascot.webp'" alt="" class="mascot" />
    <div class="result-stars">
      <span v-for="i in 3" :key="i" :class="{ on: i <= stars }">★</span>
    </div>
    <p>{{ stars === 3 ? 'Great job!' : stars === 2 ? 'Good!' : 'Keep trying!' }}</p>
    <div class="result-note"><slot /></div>
    <div class="result-actions">
      <button class="big-btn" @click="$emit('again')">再来一次</button>
      <router-link :to="back" class="big-btn ghost">回到单元</router-link>
    </div>
  </div>
</template>
