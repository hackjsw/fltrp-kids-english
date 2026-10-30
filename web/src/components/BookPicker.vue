<script setup>
// 闯关地图、贴纸册顶部的选书条：平时只显示当前这一册，点开再换年级和上下册。count(id) 决定册名旁边的数字
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { book, bookId, setBook, BOOKS, gradeOf, termOf, bookTitle } from '../lib/content.js'
import GradeCircles from './GradeCircles.vue'
import Icon from './Icon.vue'

defineProps({ count: Function, icon: { type: String, default: 'star' } })

const open = ref(false)
const root = ref(null)
// 面板里先选年级只是预览，点了上册/下册才真正换书：换书时页面会重新加载，面板跟着关掉
const grade = ref(gradeOf(bookId.value))
const terms = computed(() => BOOKS.filter((id) => gradeOf(id) === grade.value))

// 点面板外面或按 Esc 收起
function outside(e) {
  if (!root.value?.contains(e.target)) open.value = false
}
function onKey(e) {
  if (e.key === 'Escape') open.value = false
}
function listen(on) {
  const fn = on ? 'addEventListener' : 'removeEventListener'
  document[fn]('pointerdown', outside, true)
  document[fn]('keydown', onKey)
}
watch(open, (on) => {
  listen(on)
  if (on) grade.value = gradeOf(bookId.value)
})
onBeforeUnmount(() => listen(false))

function chooseGrade(g) {
  grade.value = g
}
function chooseTerm(id) {
  setBook(id)
  open.value = false
}
</script>

<template>
  <div ref="root" class="book-bar">
    <button type="button" class="book-current" :aria-expanded="open" @click="open = !open">
      <span>{{ bookTitle(bookId) }}</span>
      <span class="book-count"><Icon :name="icon" /> {{ count(bookId) }}</span>
      <span class="book-caret" aria-hidden="true">▾</span>
    </button>
    <Transition name="pop">
      <div v-if="open" class="book-panel">
        <p class="book-panel-title">选年级</p>
        <GradeCircles :current="grade" @pick="chooseGrade" />
        <div class="book-terms">
          <button v-for="id in terms" :key="id" type="button" class="book-term" :class="{ on: id === bookId }" @click="chooseTerm(id)">
            {{ termOf(id) === 'a' ? '上册' : '下册' }}
            <small><Icon :name="icon" /> {{ count(id) }}</small>
          </button>
        </div>
        <p v-if="book" class="book-panel-note">{{ book.subtitle }}</p>
      </div>
    </Transition>
  </div>
</template>
