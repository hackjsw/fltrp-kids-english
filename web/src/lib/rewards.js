// 奖励：竹子币、单词贴纸、每日任务和宝箱、连续学习、徽章、装扮
// 游戏结束调 finishGame()，答对一题调 markCorrect()；界面通过 rewards / events 读状态
import { computed, reactive, watch } from 'vue'
import { BADGES, BADGE_BAMBOO, OUTFITS, QUESTS, STREAK_GIFTS } from './catalog.js'
import { allUnits, bookId } from './content.js'
import { progress, recordStars, unitStars, unitTotal } from './progress.js'
import { SCORED, UNLOCK_STARS } from './games.js'

const KEY = 'kids-english-rewards'
// 一个词句累计答对这么多次，就收进贴纸册
export const STICKER_AT = 3

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const saved = load()
export const rewards = reactive({
  bamboo: 0,
  bambooTotal: 0,
  owned: ['default'],
  outfit: 'default',
  mastery: {}, // '1a/hello': 答对次数
  days: [], // 学过的日期 'YYYY-MM-DD'
  gifts: [], // 已领的连续学习礼物（天数）
  badges: {}, // id: 获得日期
  daily: null, // { day, quests: [{ id, have }], chest: false }
  stats: { games: 0, perfect: 0, correct: 0, repeats: 0, cards: 0, chests: 0, books: [] },
  seenOpen: {}, // 每册已经看过解锁动画的关卡数
  last: null, // 上次学的单元，首页"继续学习"
  ...saved,
})
rewards.stats = { games: 0, perfect: 0, correct: 0, repeats: 0, cards: 0, chests: 0, books: [], ...saved.stats }

// 旧版只在 progress 里记了 lastDay + streak，补成日期列表，连续天数不丢
if (!saved.days && progress.lastDay && progress.streak) {
  const [y, m, d] = progress.lastDay.split('-').map(Number)
  for (let i = 0; i < progress.streak; i++) rewards.days.push(dayKey(new Date(y, m - 1, d - i)))
  rewards.days.reverse()
}

watch(rewards, () => localStorage.setItem(KEY, JSON.stringify(rewards)), { deep: true })

// ---------- 弹出提示 ----------
// toast：顶部小条；badge：居中大弹窗。RewardLayer 依次显示
// hold：结算动画播放时先压住，不挡住星星和竹子
export const events = reactive({ queue: [], hold: false })
let eventId = 0
function notify(e) {
  events.queue.push({ id: ++eventId, ...e })
}
export const dismiss = (id) => (events.queue = events.queue.filter((e) => e.id !== id))

// ---------- 竹子币 ----------
// lag：已经记进余额、但飞行动画还没落地的数量。顶栏显示 bamboo - lag，动画落一颗加一颗
export const bambooFx = reactive({ lag: 0 })
export const shownBamboo = computed(() => Math.max(0, rewards.bamboo - bambooFx.lag))

export function earn(n, { animate = false } = {}) {
  if (n <= 0) return
  rewards.bamboo += n
  rewards.bambooTotal += n
  if (animate) bambooFx.lag += n
}
export function landBamboo(n) {
  bambooFx.lag = Math.max(0, bambooFx.lag - n)
}
export function settleBamboo() {
  bambooFx.lag = 0
}

// ---------- 连续学习 ----------
const daySet = computed(() => new Set(rewards.days))
export const studiedToday = computed(() => daySet.value.has(dayKey()))

function runFrom(start) {
  let n = 0
  const d = new Date(start)
  while (daySet.value.has(dayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
// 今天还没学时，从昨天往回数（今天学了就续上，不算断）
export const streak = computed(() => {
  const d = new Date()
  if (!daySet.value.has(dayKey(d))) d.setDate(d.getDate() - 1)
  return runFrom(d)
})

function markDay() {
  const t = dayKey()
  if (daySet.value.has(t)) return
  rewards.days.push(t)
  for (const g of STREAK_GIFTS) {
    if (streak.value >= g.days && !rewards.gifts.includes(g.days)) {
      rewards.gifts.push(g.days)
      earn(g.bamboo)
      notify({ kind: 'toast', icon: 'flame', text: `连续学习 ${g.days} 天！`, bamboo: g.bamboo })
    }
  }
}

// ---------- 每日任务 ----------
function seeded(str) {
  let h = 2166136261
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function ensureDaily() {
  const t = dayKey()
  if (rewards.daily?.day === t) return
  const rand = seeded(t)
  const pool = [...QUESTS].sort(() => rand() - 0.5)
  const picked = []
  for (const q of pool) {
    if (picked.length < 3 && !picked.some((p) => p.stat === q.stat)) picked.push(q)
  }
  rewards.daily = { day: t, quests: picked.map((q) => ({ id: q.id, have: 0 })), chest: false }
}

export const dailyQuests = computed(() =>
  (rewards.daily?.quests || []).map((q) => {
    const tpl = QUESTS.find((x) => x.id === q.id)
    return { ...tpl, have: Math.min(q.have, tpl.goal), done: q.have >= tpl.goal }
  }),
)
export const chestReady = computed(
  () => dailyQuests.value.length > 0 && dailyQuests.value.every((q) => q.done) && !rewards.daily.chest,
)

function bumpQuest(stat, n = 1) {
  ensureDaily()
  for (const q of rewards.daily.quests) {
    const tpl = QUESTS.find((x) => x.id === q.id)
    if (tpl.stat !== stat || q.have >= tpl.goal) continue
    q.have += n
    if (q.have >= tpl.goal) {
      notify({ kind: 'toast', icon: tpl.icon, text: `任务完成：${tpl.text}` })
      if (chestReady.value) notify({ kind: 'toast', icon: 'gift', text: '今天的宝箱可以打开啦！' })
    }
  }
}

export function openChest() {
  if (!chestReady.value) return 0
  rewards.daily.chest = true
  const n = 10 + Math.floor(Math.random() * 11)
  earn(n, { animate: true })
  rewards.stats.chests++
  checkBadges()
  return n
}
// ---------- 答题 / 游戏结束 ----------
// 每答对一题。返回 true 表示这个词句刚好集满，变成了新贴纸
export function markCorrect(item) {
  const k = `${bookId.value}/${item.id}`
  const before = rewards.mastery[k] || 0
  rewards.mastery[k] = before + 1
  rewards.stats.correct++
  bumpQuest('correct')
  if (before + 1 === STICKER_AT) {
    notify({ kind: 'toast', img: `/images/${bookId.value}/${item.image}`, text: `新贴纸：${item.text}` })
    bumpQuest('stickers')
    checkBadges()
    return true
  }
  return false
}

export function markRepeat() {
  rewards.stats.repeats++
  bumpQuest('repeats')
}

export function markCard() {
  rewards.stats.cards++
  bumpQuest('cards')
  markDay()
}

const bookCleared = (book) =>
  allUnits().every(({ mod, unit }) => unitTotal(mod.id, unit.id, SCORED, book) >= UNLOCK_STARS)

// 游戏结束：记星、打卡、任务、发竹子。返回给结算页 { bamboo, prev, newBest }
export function finishGame(moduleId, unitId, activity, stars) {
  const prev = unitStars(moduleId, unitId, activity)
  recordStars(moduleId, unitId, activity, stars)
  const found = allUnits().find(({ mod, unit }) => mod.id === moduleId && unit.id === unitId)
  if (found) rememberUnit(found.mod, found.unit)
  markDay()
  rewards.stats.games++
  if (stars === 3) rewards.stats.perfect++
  bumpQuest('games')
  if (stars > 0) bumpQuest('stars', stars)
  if (stars === 3) bumpQuest('perfect')

  // 每局 1 + 星数；第一次拿满分再奖 5
  const bamboo = 1 + stars + (stars === 3 && prev < 3 ? 5 : 0)
  earn(bamboo, { animate: true })

  if (!rewards.stats.books.includes(bookId.value) && bookCleared(bookId.value)) rewards.stats.books.push(bookId.value)
  checkBadges()
  return { bamboo, prev, newBest: prev > 0 && stars > prev }
}

// ---------- 徽章 ----------
export const stickerCount = computed(() => Object.values(rewards.mastery).filter((n) => n >= STICKER_AT).length)
export const bookStickers = (book) =>
  Object.entries(rewards.mastery).filter(([k, n]) => k.startsWith(book + '/') && n >= STICKER_AT).length

export function checkBadges() {
  const c = {
    ...rewards.stats,
    books: rewards.stats.books.length,
    streak: streak.value,
    stickers: stickerCount.value,
    outfits: rewards.owned.length - 1,
  }
  for (const b of BADGES) {
    if (rewards.badges[b.id] || !b.test(c)) continue
    rewards.badges[b.id] = dayKey()
    earn(BADGE_BAMBOO)
    notify({ kind: 'badge', badge: b })
  }
}

// ---------- 装扮 ----------
export const outfit = computed(() => OUTFITS.find((o) => o.id === rewards.outfit) || OUTFITS[0])

export function buy(id) {
  const o = OUTFITS.find((x) => x.id === id)
  if (!o || rewards.owned.includes(id) || rewards.bamboo < o.price) return false
  rewards.bamboo -= o.price
  rewards.owned.push(id)
  rewards.outfit = id
  checkBadges()
  return true
}

export function wear(id) {
  if (rewards.owned.includes(id)) rewards.outfit = id
}

// ---------- 继续学习 ----------
export function rememberUnit(mod, unit) {
  rewards.last = { book: bookId.value, module: mod.id, unit: unit.id, title: `${mod.title} · ${unit.title}`, image: unit.items[0].image }
}

ensureDaily()
// 老用户第一次打开新版：按已有进度补发应得的徽章
checkBadges()
