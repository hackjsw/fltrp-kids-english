import { computed, ref } from 'vue'

// 一年级上下册；以后加二年级在这里加
export const BOOKS = ['1a', '1b']

const BOOK_KEY = 'kids-english-book'
export const books = ref({})
export const bookId = ref(BOOKS.includes(localStorage.getItem(BOOK_KEY)) ? localStorage.getItem(BOOK_KEY) : BOOKS[0])
export const book = computed(() => books.value[bookId.value] || null)
export const error = ref('')

export function setBook(id) {
  if (!BOOKS.includes(id)) return
  bookId.value = id
  localStorage.setItem(BOOK_KEY, id)
}

export async function loadBook() {
  try {
    const list = await Promise.all(
      BOOKS.map(async (id) => {
        const res = await fetch(`/books/${id}/book.json`)
        if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
        return res.json()
      }),
    )
    books.value = Object.fromEntries(list.map((b) => [b.id, b]))
  } catch (e) {
    error.value = `教材内容加载失败：${e.message}`
  }
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
