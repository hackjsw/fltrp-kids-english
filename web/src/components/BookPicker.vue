<script setup>
// 年级 + 上下册选择，首页地图和贴纸册共用。count(id) 决定册名下面显示什么数字
import { computed } from 'vue'
import { bookId, setBook, pickGrade, BOOKS, GRADES, gradeOf, bookTitle } from '../lib/content.js'
import Icon from './Icon.vue'

defineProps({ count: Function, icon: { type: String, default: 'star' } })

const grade = computed(() => gradeOf(bookId.value))
const terms = computed(() => BOOKS.filter((id) => gradeOf(id) === grade.value))

</script>

<template>
  <div v-if="GRADES.length > 1" class="grade-row">
    <button v-for="g in GRADES" :key="g" class="grade-chip" :class="{ on: g === grade }" @click="pickGrade(g)">
      {{ g }}<small>年级</small>
    </button>
  </div>
  <div class="book-tabs">
    <button v-for="id in terms" :key="id" class="book-tab" :class="{ on: id === bookId }" @click="setBook(id)">
      {{ bookTitle(id) }}
      <small><Icon :name="icon" /> {{ count(id) }}</small>
    </button>
  </div>
</template>
