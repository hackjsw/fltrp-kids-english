import { audioUrl } from './content.js'

// 发音优先播 scripts/gen_audio.py 生成的 MP3（微软神经语音，自然很多），
// 文件缺失或播放失败时退回浏览器 speechSynthesis。跟读识别用浏览器 SpeechRecognition。

// 提示语对应 content/audio/common/ 下的文件
const COMMON_AUDIO = {
  'Great job!': 'great',
  'Great!': 'great',
  'Good!': 'good',
  'Try again.': 'try-again',
}

// 共用一个 Audio，切换时自动停掉上一段；手机浏览器解锁一次播放后后续都能自动播
const player = typeof Audio !== 'undefined' ? new Audio() : null

// iOS/安卓要求第一次播放发生在用户点击里：首次触摸时用一段静音解锁这个 player
const SILENT = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqpAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxDsDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
if (player && typeof window !== 'undefined') {
  const unlock = () => {
    window.removeEventListener('pointerdown', unlock, true)
    if (player.src) return
    player.src = SILENT
    player.play().catch(() => {})
  }
  window.addEventListener('pointerdown', unlock, true)
}

function playFile(src) {
  return new Promise((resolve, reject) => {
    if (!player) return reject(new Error('no audio'))
    player.pause()
    player.onended = () => resolve()
    player.onerror = () => reject(new Error('load failed'))
    player.src = src
    player.currentTime = 0
    player.play().catch(reject)
  })
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

function speakTts(text, rate) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve()
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = voice?.lang || 'en-US'
    if (voice) u.voice = voice
    u.rate = rate
    u.onend = resolve
    u.onerror = resolve
    speechSynthesis.speak(u)
  })
}

// src 不传时按提示语查 common 音频；都没有就用浏览器语音
export async function speak(text, { src, rate = 0.8 } = {}) {
  const file = src || (COMMON_AUDIO[text] && `/audio/common/${COMMON_AUDIO[text]}.mp3`)
  if (file) {
    try {
      return await playFile(file)
    } catch {
      // 落到下面的 TTS
    }
  }
  return speakTts(text, rate)
}

export function speakItem(item) {
  return speak(item.text, { src: audioUrl(item) })
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canRecognize = Boolean(Recognition)

// 返回识别出的若干候选文本
export function listen({ timeoutMs = 6000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'))
    const rec = new Recognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 5
    let done = false
    const finish = (fn, v) => {
      if (done) return
      done = true
      clearTimeout(timer)
      fn(v)
    }
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
    rec.start()
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
