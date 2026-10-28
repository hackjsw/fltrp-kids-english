import { reactive, watch } from 'vue'
import { bookId } from './content.js'

const KEY = 'kids-english-progress-v1'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const saved = load()

// 早期版本只有一年级上册，键是 'm1/u1/listen'；迁移成 '1a/m1/u1/listen'
if (saved.stars) {
  for (const k of Object.keys(saved.stars)) {
    if (/^m\d+\//.test(k)) {
      saved.stars['1a/' + k] = Math.max(saved.stars['1a/' + k] || 0, saved.stars[k])
      delete saved.stars[k]
    }
  }
  localStorage.setItem(KEY, JSON.stringify(saved))
}

// stars: { '1a/m1/u1/listen': 3, ... } 每个活动只记最高星级
export const progress = reactive({
  stars: saved.stars || {},
  lastDay: saved.lastDay || '',
  streak: saved.streak || 0,
  get totalStars() {
    return Object.values(this.stars).reduce((s, n) => s + n, 0)
  },
})

watch(progress, () => {
  localStorage.setItem(
    KEY,
    JSON.stringify({ stars: progress.stars, lastDay: progress.lastDay, streak: progress.streak }),
  )
})

export function unitStars(moduleId, unitId, activity, book = bookId.value) {
  return progress.stars[`${book}/${moduleId}/${unitId}/${activity}`] || 0
}

export function recordStars(moduleId, unitId, activity, stars) {
  const key = `${bookId.value}/${moduleId}/${unitId}/${activity}`
  progress.stars[key] = Math.max(progress.stars[key] || 0, stars)
  checkIn()
}

// 单元总星数 = 各计星玩法最高星之和
export function unitTotal(moduleId, unitId, games, book = bookId.value) {
  return games.reduce((s, g) => s + unitStars(moduleId, unitId, g, book), 0)
}

export function bookStars(book) {
  return Object.entries(progress.stars).reduce((s, [k, n]) => (k.startsWith(book + '/') ? s + n : s), 0)
}

function checkIn() {
  const t = today()
  if (progress.lastDay === t) return
  const y = new Date()
  y.setDate(y.getDate() - 1)
  const yesterday = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`
  progress.streak = progress.lastDay === yesterday ? progress.streak + 1 : 1
  progress.lastDay = t
}
