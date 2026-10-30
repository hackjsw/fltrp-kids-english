<script setup>
import { computed, watchEffect } from 'vue'
import { bookId, gradeOf, findUnit, preloadModule, imageUrl } from '../lib/content.js'
import { unitStars, unitTotal } from '../lib/progress.js'
import { gamesFor, SCORED } from '../lib/games.js'
import { rememberUnit } from '../lib/rewards.js'
import Icon from '../components/Icon.vue'

const props = defineProps({ module: String, unit: String })
const found = computed(() => findUnit(props.module, props.unit))
watchEffect(() => {
  if (!found.value) return
  preloadModule(props.module)
  rememberUnit(found.value.mod, found.value.unit)
})
const total = computed(() => unitTotal(props.module, props.unit, SCORED))
// 排句子只在三年级起、单元里句子够的时候出现
const games = computed(() => gamesFor(gradeOf(bookId.value), found.value?.unit.items || []))
</script>

<template>
  <section v-if="found" class="unit">
    <router-link to="/map" class="back">← 地图</router-link>
    <div class="unit-hero">
      <img :src="imageUrl(found.unit.items[0].image)" alt="" />
      <Icon name="sparkle" class="unit-deco" />
      <div>
        <small>{{ found.mod.title }} · {{ found.unit.id.replace('u', 'Unit ') }}</small>
        <h1>{{ found.unit.title }}</h1>
        <span class="unit-total"><Icon name="star" /> {{ total }} / {{ SCORED.length * 3 }}</span>
      </div>
    </div>
    <div class="activity-grid">
      <router-link
        v-for="g in games"
        :key="g.id"
        :to="`/u/${module}/${unit}/${g.id}`"
        class="activity"
      >
        <img v-if="g.img" class="icon-img" :src="g.img" alt="" draggable="false" />
        <Icon v-else :name="g.icon" class="icon-img" />
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
