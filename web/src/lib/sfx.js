// 游戏音效：WebAudio 现场合成，不需要音频文件
let ctx = null

export function audioCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  // iOS 要在用户点击里恢复
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, { start = 0, dur = 0.15, type = 'sine', vol = 0.18, to } = {}) {
  const ac = audioCtx()
  const t = ac.currentTime + start
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export const sfx = {
  pop: () => tone(500, { dur: 0.1, to: 1400, vol: 0.25 }),
  ding: () => {
    tone(880, { dur: 0.12 })
    tone(1320, { start: 0.1, dur: 0.22 })
  },
  buzz: () => tone(170, { dur: 0.22, type: 'square', vol: 0.07 }),
  chomp: () => {
    tone(220, { dur: 0.07, type: 'triangle', vol: 0.25, to: 120 })
    tone(220, { start: 0.12, dur: 0.07, type: 'triangle', vol: 0.25, to: 120 })
  },
  toot: () => {
    tone(523, { dur: 0.25, type: 'triangle', vol: 0.2 })
    tone(659, { start: 0.3, dur: 0.4, type: 'triangle', vol: 0.2 })
  },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, { start: i * 0.11, dur: 0.2 })),
}
