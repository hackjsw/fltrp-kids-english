<script setup>
import { computed, watchEffect } from 'vue'
import { findUnit, preloadModule } from '../lib/content.js'
import { unitStars } from '../lib/progress.js'
import { GAMES } from '../lib/games.js'

const props = defineProps({ module: String, unit: String })
const found = computed(() => findUnit(props.module, props.unit))
watchEffect(() => found.value && preloadModule(props.module))
</script>

<template>
  <section v-if="found" class="unit">
    <router-link to="/" class="back">← 地图</router-link>
    <h1>{{ found.mod.title }} · {{ found.unit.title }}</h1>
    <div class="activity-grid">
      <router-link
        v-for="g in GAMES"
        :key="g.id"
        :to="`/u/${module}/${unit}/${g.id}`"
        class="activity"
      >
        <img v-if="g.img" class="icon-img" :src="g.img" alt="" draggable="false" />
        <span v-else class="icon">{{ g.icon }}</span>
        <span class="name">{{ g.name }}</span>
        <span class="desc">{{ g.desc }}</span>
        <span v-if="g.scored" class="unit-stars">
          <span v-for="i in 3" :key="i" :class="{ on: i <= unitStars(module, unit, g.id) }">★</span>
        </span>
      </router-link>
    </div>
  </section>
  <p v-else>没有找到这个单元。</p>
</template>
