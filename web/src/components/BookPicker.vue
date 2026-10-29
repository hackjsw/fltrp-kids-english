<script setup>
// 年级 + 上下册选择，首页地图和贴纸册共用。count(id) 决定册名下面显示什么数字
import { computed } from 'vue'
import { bookId, setBook, BOOKS, GRADES, gradeOf, termOf, bookTitle } from '../lib/content.js'

defineProps({ count: Function, icon: { type: String, default: '⭐' } })

const grade = computed(() => gradeOf(bookId.value))
const terms = computed(() => BOOKS.filter((id) => gradeOf(id) === grade.value))

// 换年级时停在同一学期（没有就取该年级第一册）
function pickGrade(g) {
  const same = `${g}${termOf(bookId.value)}`
  setBook(BOOKS.includes(same) ? same : BOOKS.find((id) => gradeOf(id) === g))
}
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
      <small>{{ icon }} {{ count(id) }}</small>
    </button>
  </div>
</template>
