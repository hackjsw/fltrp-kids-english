import { audioUrl } from './content.js'
import { audioCache } from './audio-cache.js'

// 发音优先播 scripts/gen_audio.py 生成的 MP3（微软神经语音，自然很多），
// 文件缺失或播放失败时退回浏览器 speechSynthesis。跟读识别用浏览器 SpeechRecognition。

// 提示语对应 content/audio/common/ 下的文件
const COMMON_AUDIO = {
  'Great job!': 'great',
  'Great!': 'great',
  'Good!': 'good',
  'Try again.': 'try-again',
  'Good morning!': 'good-morning',
  'Good afternoon!': 'good-afternoon',
  'Good evening!': 'good-evening',
  'Welcome back!': 'welcome-back',
  'Well done!': 'well-done',
  'Amazing!': 'amazing',
  "Let's play!": 'lets-play',
  'Keep trying!': 'keep-trying',
}

// 共用一个 Audio，切换时自动停掉上一段；手机浏览器解锁一次播放后后续都能自动播
const player = typeof Audio !== 'undefined' ? new Audio() : null

// iOS/安卓要求第一次播放发生在用户点击里：首次触摸时用一段静音解锁这个 player
const SILENT = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqpAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxDsDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
if (player && typeof window !== 'undefined') {
  const unlock = () => {
    if (!player.src) player.src = SILENT
    player.play().catch(() => {})
  }
  player.addEventListener('playing', () => window.removeEventListener('pointerdown', unlock, true), { once: true })
  window.addEventListener('pointerdown', unlock, true)
}

let active = null
let currentBlob = null
let objectUrl = null

// 取消时也结清上一段 Promise，防止火车报词、答题反馈永远卡在 await。
export function stopSpeech(owner) {
  if (owner && active?.owner !== owner) return
  const previous = active
  active = null
  if (player) {
    player.onended = null
    player.onerror = null
    player.pause()
  }
  if ('speechSynthesis' in window) speechSynthesis.cancel()
  previous?.resolve('cancelled')
}

let voice = null

function pickVoice() {
  const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'))
  // 优先自然音色的美音/英音女声，孩子听着更清楚
  const prefer = [/Natural.*(Jenny|Aria|Ana|Sonia)/i, /(Jenny|Aria|Zira|Libby|Sonia)/i, /en-US/i, /en-GB/i]
  for (const re of prefer) {
    const v = voices.find((x) => re.test(`${x.name} ${x.lang}`))
    if (v) return v
  }
  return voices[0] || null
}

if ('speechSynthesis' in window) {
  voice = pickVoice()
  speechSynthesis.onvoiceschanged = () => (voice = pickVoice())
}

// 返回 ended / failed / blocked / cancelled；只有 cancelled 需要中断游戏后续流程。
// 文件无法加载时可退回 TTS；用户主动停止、或浏览器禁止自动播放时不偷偷补播。
export function speak(text, { src, rate = 0.8, owner } = {}) {
  stopSpeech()
  return new Promise((resolve) => {
    const task = { resolve, owner }
    active = task
    const current = () => active === task
    const finish = (status) => {
      if (!current()) return
      active = null
      if (player) {
        player.onended = null
        player.onerror = null
      }
      resolve(status)
    }
    const fallback = () => {
      if (!current() || task.fallback) return
      task.fallback = true
      if (player) {
        player.onended = null
        player.onerror = null
        player.pause()
      }
      if (!('speechSynthesis' in window)) return finish('failed')
      const u = new SpeechSynthesisUtterance(text)
      u.lang = voice?.lang || 'en-US'
      if (voice) u.voice = voice
      u.rate = rate
      u.onend = () => finish('ended')
      u.onerror = () => finish('failed')
      try {
        speechSynthesis.speak(u)
      } catch {
        finish('failed')
      }
    }
    const file = src || (COMMON_AUDIO[text] && `/audio/common/${COMMON_AUDIO[text]}.mp3`)
    if (!file || !player) return fallback()
    audioCache.load(file).then((blob) => {
      if (!current()) return
      if (currentBlob !== blob) {
        const previousUrl = objectUrl
        objectUrl = URL.createObjectURL(blob)
        player.src = objectUrl
        currentBlob = blob
        if (previousUrl) URL.revokeObjectURL(previousUrl)
      }
      player.currentTime = 0
      player.onended = () => finish('ended')
      player.onerror = fallback
      player.play().catch((e) => {
        if (!current()) return
        if (e.name === 'NotAllowedError') finish('blocked')
        else fallback()
      })
    }).catch(fallback)
  })
}

export function speakItem(item, options) {
  return speak(item.text, { ...options, src: audioUrl(item, options?.book) })
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canRecognize = Boolean(Recognition)

// 返回识别出的若干候选文本。打开 interimResults：孩子读得慢、识别还没定稿就停了，
// 用最后一次的中间结果，不算「没听到」
export function listen({ timeoutMs = 7000, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'))
    if (signal?.aborted) return resolve([])
    const rec = new Recognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.maxAlternatives = 5
    let done = false
    let partial = []
    const finish = (fn, v) => {
      if (done) return
      done = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      fn(v)
    }
    const abort = () => {
      finish(resolve, [])
      rec.abort()
    }
    signal?.addEventListener('abort', abort, { once: true })
    const timer = setTimeout(() => {
      rec.stop()
      finish(resolve, partial)
    }, timeoutMs)
    rec.onresult = (e) => {
      // 一句话可能分成几段：把每段的同一号候选拼起来
      const segs = Array.from(e.results)
      const n = Math.max(0, ...segs.map((r) => r.length))
      const alts = Array.from({ length: n }, (_, k) => segs.map((r) => (r[k] || r[0]).transcript).join(' ').trim()).filter(Boolean)
      if (segs.length && segs.every((r) => r.isFinal)) finish(resolve, alts)
      else if (alts.length) partial = alts
    }
    rec.onerror = (e) => (['no-speech', 'aborted'].includes(e.error) ? finish(resolve, partial) : finish(reject, new Error(e.error)))
    rec.onend = () => finish(resolve, partial)
    try {
      rec.start()
    } catch (e) {
      finish(reject, e)
    }
  })
}

// ---------- 跟读打分 ----------
// 识别结果和课本写法常常对不上：I'm/I am、7/seven、to/two、colour/color、Daming/da ming，这些都算读对
const CONTRACTIONS = {
  "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are', "he's": 'he is', "she's": 'she is',
  "it's": 'it is', "that's": 'that is', "what's": 'what is', "where's": 'where is', "who's": 'who is', "there's": 'there is',
  "here's": 'here is', "how's": 'how is', "name's": 'name is', "let's": 'let us', "i'll": 'i will', "you'll": 'you will',
  "we'll": 'we will', "they'll": 'they will', "he'll": 'he will', "she'll": 'she will', "it'll": 'it will',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "i'd": 'i would',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not',
  "wasn't": 'was not', "weren't": 'were not', "can't": 'can not', "won't": 'will not', "haven't": 'have not',
  "hasn't": 'has not', "couldn't": 'could not', "wouldn't": 'would not', "shouldn't": 'should not', cannot: 'can not',
}
// 识别器有时把撇号丢了（dont、im）。目标句和识别结果走同一套展开，撞上真词（its、well）也不会判错
for (const [k, v] of Object.entries(CONTRACTIONS)) CONTRACTIONS[k.replace(/'/g, '')] ||= v

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const say = (n) => (n < 20 ? ONES[n] : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '') : String(n))

// 读音一样或英美拼法不同，算同一个词
const ALIASES = [
  'to two too', 'for four', 'one won', 'eight ate', 'there their theyre', 'your youre', 'whose whos', 'hear here', 'right write', 'see sea', 'no know',
  'son sun', 'by buy bye', 'hi high', 'red read', 'blue blew', 'eye i', 'wear where', 'meet meat', 'night knight',
  'flower flour', 'colour color', 'favourite favorite', 'grey gray', 'centre center', 'theatre theater', 'metre meter',
  'mum mom mummy mommy', 'ms miss', 'mr mister', 'ok okay',
]
const CANON = new Map(ALIASES.flatMap((g) => g.split(' ').map((w) => [w, g.split(' ')[0]])))
const canon = (w) => CANON.get(w) || w

function words(text) {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\b([ap])\.\s?m\b\.?/g, '$1m')
    .replace(/(\d+):00\b/g, "$1 o'clock")
    .replace(/(\d+):(\d+)/g, '$1 $2')
    .replace(/\d+/g, (d) => ` ${say(Number(d))} `)
    .replace(/[^a-z' ]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ''))
    .filter(Boolean)
    .flatMap((w) => (CONTRACTIONS[w] || w).split(' '))
    .map((w) => w.replace(/'/g, ''))
}

// 简单的复数 / 三单：cats→cat、glasses→glass、watches→watch；太短的词不动（is、bus、yes）
const stem = (w) => (w.length > 3 ? w.replace(/(ss|sh|ch|x|z)es$/, '$1').replace(/([^s])s$/, '$1') : w)

function lev(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const t = d[j]
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = t
    }
  }
  return d[b.length]
}
// 长词允许错一两个字母（rabbit/rabit、elephant/elefant）；短词必须对上，cat 和 hat 不能混
function near(a, b) {
  const tol = Math.min(a.length, b.length) >= 8 ? 2 : Math.min(a.length, b.length) >= 5 ? 1 : 0
  return tol > 0 && Math.abs(a.length - b.length) <= tol && lev(a, b) <= tol
}
// 课本里的中国名字识别器最容易听错（da men、ling lin），再放宽一点
const NAMES = new Set(['daming', 'lingling', 'xiaoyong'])
const nameLike = (h, t) => NAMES.has(stem(t)) && Math.abs(h.length - stem(t).length) <= 2 && lev(h, stem(t)) <= 2
const same = (h, t) => h === t || canon(stem(h)) === canon(stem(t)) || near(h, t) || nameLike(h, t)

// 识别器漏掉冠词很常见，读没读都不扣分
const FREE = new Set(['a', 'an', 'the'])

// 目标句逐词比对，返回 { stars, marks:[{word, ok}] }；取所有识别候选里得分最高的一个
export function scoreReading(target, alternatives) {
  const tokens = target.split(/\s+/).filter(Boolean)
  const parts = tokens.map(words)
  const counts = (p) => p.length > 0 && !p.every((x) => FREE.has(x))
  const total = parts.filter(counts).length
  let best = { ratio: -1, marks: [] }
  for (const alt of alternatives.length ? alternatives : ['']) {
    const w = words(alt)
    // 识别器把 Daming 拆成 da ming 时，相邻两个词拼起来也比一比
    const heard = [...w, ...w.slice(1).map((x, i) => w[i] + x)]
    const has = (p) => FREE.has(p) || heard.some((h) => same(h, p))
    const marks = tokens.map((word, i) => {
      const p = parts[i]
      // they're 常被识别成 their：原词去掉撇号也比一比
      const raw = word.toLowerCase().replace(/[^a-z]/g, '')
      return { word, ok: p.every(has) || (p.length > 1 && heard.some((h) => same(h, p.join('')) || same(h, raw))) }
    })
    const hits = marks.filter((m, i) => m.ok && counts(parts[i])).length
    const ratio = total ? hits / total : 1
    if (ratio > best.ratio) best = { ratio, marks }
  }
  const r = best.ratio
  return { stars: r >= 0.85 ? 3 : r >= 0.6 ? 2 : r > 0 ? 1 : 0, marks: best.marks }
}
