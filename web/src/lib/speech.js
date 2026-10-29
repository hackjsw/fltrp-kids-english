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
  return speak(item.text, { ...options, src: audioUrl(item) })
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canRecognize = Boolean(Recognition)

// 返回识别出的若干候选文本
export function listen({ timeoutMs = 6000, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'))
    if (signal?.aborted) return resolve([])
    const rec = new Recognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 5
    let done = false
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
      finish(resolve, [])
    }, timeoutMs)
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((r) => r.transcript)
      finish(resolve, alts)
    }
    rec.onerror = (e) => finish(e.error === 'no-speech' ? resolve : reject, e.error === 'no-speech' ? [] : new Error(e.error))
    rec.onend = () => finish(resolve, [])
    try {
      rec.start()
    } catch (e) {
      finish(reject, e)
    }
  })
}

const CONTRACTIONS = {
  "i'm": ['i', 'am'],
  "what's": ['what', 'is'],
  "name's": ['name', 'is'],
  "it's": ['it', 'is'],
}

export function words(text) {
  return text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z' ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((w) => CONTRACTIONS[w] || [w])
}

// 目标句逐词比对，返回 { stars, marks:[{word, ok}] }
// 取所有识别候选里得分最高的一个
export function scoreReading(target, alternatives) {
  const targetWords = target.split(/\s+/)
  let best = { ratio: 0, marks: targetWords.map((w) => ({ word: w, ok: false })) }
  for (const alt of alternatives) {
    const heard = new Set(words(alt))
    const marks = targetWords.map((w) => ({ word: w, ok: words(w).every((x) => heard.has(x)) }))
    const ratio = marks.filter((m) => m.ok).length / marks.length
    if (ratio > best.ratio) best = { ratio, marks }
  }
  const stars = best.ratio >= 1 ? 3 : best.ratio >= 0.6 ? 2 : best.ratio > 0 ? 1 : 0
  return { stars, marks: best.marks }
}
