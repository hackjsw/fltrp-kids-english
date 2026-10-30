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

// 安卓手机轻微震动；iOS 和电脑上没有这个接口，自动跳过
const buzzPhone = (pattern) => navigator.vibrate?.(pattern)

export const sfx = {
  pop: () => {
    tone(500, { dur: 0.1, to: 1400, vol: 0.25 })
    buzzPhone(12)
  },
  ding: () => {
    tone(880, { dur: 0.12 })
    tone(1320, { start: 0.1, dur: 0.22 })
    buzzPhone(12)
  },
  // 连对：一次比一次高，最多升 8 个半音
  combo: (n) => {
    const f = 523 * 2 ** (Math.min(n, 8) / 12)
    tone(f, { dur: 0.12, type: 'triangle', vol: 0.2 })
    tone(f * 1.5, { start: 0.08, dur: 0.18, type: 'triangle', vol: 0.18 })
  },
  buzz: () => {
    tone(170, { dur: 0.22, type: 'square', vol: 0.07 })
    buzzPhone([25, 40, 25])
  },
  chomp: () => {
    tone(220, { dur: 0.07, type: 'triangle', vol: 0.25, to: 120 })
    tone(220, { start: 0.12, dur: 0.07, type: 'triangle', vol: 0.25, to: 120 })
    buzzPhone(15)
  },
  toot: () => {
    tone(523, { dur: 0.25, type: 'triangle', vol: 0.2 })
    tone(659, { start: 0.3, dur: 0.4, type: 'triangle', vol: 0.2 })
  },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, { start: i * 0.11, dur: 0.2 })),
  // 结算页第 n 颗星，一颗比一颗高
  star: (n = 0) => tone([659, 784, 988][n] || 988, { dur: 0.18, type: 'triangle', vol: 0.2 }),
  // 竹子币落进计数器
  coin: () => {
    tone(1568, { dur: 0.06, vol: 0.1 })
    tone(2093, { start: 0.05, dur: 0.12, vol: 0.1 })
  },
  unlock: () => [392, 523, 659, 784].forEach((f, i) => tone(f, { start: i * 0.08, dur: 0.16, type: 'triangle', vol: 0.18 })),
  chest: () => {
    tone(196, { dur: 0.12, type: 'triangle', vol: 0.25 })
    ;[784, 988, 1175, 1568].forEach((f, i) => tone(f, { start: 0.15 + i * 0.07, dur: 0.18, vol: 0.14 }))
  },
  // 普通按钮的轻点声
  tap: () => {
    tone(700, { dur: 0.04, vol: 0.05 })
    buzzPhone(6)
  },
}
