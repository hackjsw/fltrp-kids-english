import { computed, ref } from 'vue'

// 一至六年级上下册。内容做好一册就加一册
export const BOOKS = ['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b']

const GRADE_CN = ['', '一', '二', '三', '四', '五', '六']
export const gradeOf = (id) => Number(id[0])
export const termOf = (id) => id[1] // a 上册 / b 下册
export const bookTitle = (id) => `${GRADE_CN[gradeOf(id)]}年级${termOf(id) === 'a' ? '上' : '下'}册`
export const GRADES = [...new Set(BOOKS.map(gradeOf))]

const BOOK_KEY = 'kids-english-book'
export const books = ref({})
export const bookId = ref(BOOKS.includes(localStorage.getItem(BOOK_KEY)) ? localStorage.getItem(BOOK_KEY) : BOOKS[0])
export const book = computed(() => books.value[bookId.value] || null)
export const error = ref('')

// 12 册的 book.json 按需加载：只取当前这一册，切换时再取
const loading = {}
function fetchBook(id) {
  loading[id] ||= fetch(`/books/${id}/book.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
      return res.json()
    })
    .then((b) => {
      books.value = { ...books.value, [id]: b }
      return b
    })
    .catch((e) => {
      delete loading[id]
      error.value = `教材内容加载失败：${e.message}`
    })
  return loading[id]
}

export function setBook(id) {
  if (!BOOKS.includes(id)) return
  error.value = ''
  bookId.value = id
  localStorage.setItem(BOOK_KEY, id)
  fetchBook(id)
}

// 换年级时停在同一学期（没有就取该年级第一册）
export function pickGrade(g) {
  const same = `${g}${termOf(bookId.value)}`
  setBook(BOOKS.includes(same) ? same : BOOKS.find((id) => gradeOf(id) === g))
}

export function loadBook() {
  return fetchBook(bookId.value)
}

export function imageUrl(path) {
  return `/images/${bookId.value}/${path}`
}

export function audioUrl(item) {
  return `/audio/${bookId.value}/${item.id}.mp3`
}

// 进单元时把这个 Module 的图和音频都预取到缓存，答题时切图不用等
const warmed = new Set()
export function preloadModule(moduleId) {
  const key = `${bookId.value}/${moduleId}`
  if (warmed.has(key)) return
  warmed.add(key)
  for (const it of moduleItems(moduleId)) {
    const img = new Image()
    img.src = imageUrl(it.image)
    fetch(audioUrl(it)).catch(() => {})
  }
}
export function findUnit(moduleId, unitId) {
  const mod = book.value?.modules.find((m) => m.id === moduleId)
  const unit = mod?.units.find((u) => u.id === unitId)
  return unit ? { mod, unit } : null
}

// 本 Module 全部学习项，作为听音选图的干扰项池
export function moduleItems(moduleId) {
  const mod = book.value?.modules.find((m) => m.id === moduleId)
  return mod ? mod.units.flatMap((u) => u.items) : []
}

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 是否可以当 a 的干扰项：不是同一项，也不共享同义组（hi/hello、red 气球/红色的狗）
// same 可以是字符串或数组（一项同时属于几组，比如黄黑相间的狗属于 yellow 和 black）
const groups = (it) => (Array.isArray(it.same) ? it.same : it.same ? [it.same] : [])
export function canConfuse(a, b) {
  if (a.id === b.id) return false
  const ga = groups(a)
  return !groups(b).some((g) => ga.includes(g))
}

// 从 pool 抽 n 个干扰项，和 targets 里每一项都不冲突
export function distractors(targets, pool, n) {
  return shuffle(pool.filter((p) => targets.every((t) => canConfuse(t, p)))).slice(0, n)
}

export function unitItems(moduleId, unitId) {
  return findUnit(moduleId, unitId)?.unit.items || []
}

// 全书单元按顺序排成闯关路线
export function allUnits() {
  return (book.value?.modules || []).flatMap((m) => m.units.map((u) => ({ mod: m, unit: u })))
}
