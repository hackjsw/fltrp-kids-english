// 小动效：东西飞进计数器、撒彩纸、答对时的小星星。都用 Web Animations，不依赖库
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const center = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

// 计数器跳一下
export function bump(el) {
  el?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' })
}

// 从 from 元素飞 n 个图标到 to 元素；每落地一个调 onEach，全部落地调 onDone
export function flyTo(from, to, { img, n = 5, onEach, onDone } = {}) {
  if (!from || !to || reduced()) {
    onDone?.()
    return
  }
  const a = center(from)
  const b = center(to)
  let landed = 0
  for (let i = 0; i < n; i++) {
    const el = document.createElement('img')
    el.src = img
    el.className = 'fly-piece'
    el.style.left = a.x - 16 + 'px'
    el.style.top = a.y - 16 + 'px'
    document.body.appendChild(el)
    const dx = b.x - a.x
    const dy = b.y - a.y
    // 先向四周散开，再弧线飞向目标
    const sx = (Math.random() - 0.5) * 120
    const sy = -40 - Math.random() * 60
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(0.4)', opacity: 0 },
        { transform: `translate(${sx}px, ${sy}px) scale(1.1)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 1 },
      ],
      { duration: 750 + i * 90, delay: i * 70, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' },
    )
    anim.onfinish = () => {
      el.remove()
      landed++
      bump(to)
      onEach?.(landed)
      if (landed === n) onDone?.()
    }
  }
}

const COLORS = ['#ff8a4c', '#ffc531', '#4c9bff', '#3cc47c', '#ff6fa8', '#a77bff']

// 撒彩纸；from 不传就从屏幕上方中间撒
export function confetti({ from, n = 60 } = {}) {
  if (reduced()) return
  const o = from ? center(from) : { x: innerWidth / 2, y: innerHeight * 0.3 }
  for (let i = 0; i < n; i++) {
    const el = document.createElement('i')
    el.className = 'confetti-piece'
    el.style.left = o.x + 'px'
    el.style.top = o.y + 'px'
    el.style.background = COLORS[i % COLORS.length]
    if (i % 3 === 0) el.style.borderRadius = '50%'
    document.body.appendChild(el)
    const angle = Math.random() * Math.PI * 2
    const speed = 120 + Math.random() * 220
    const dx = Math.cos(angle) * speed
    const dy = Math.sin(angle) * speed - 180
    el.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx * 1.2}px, ${dy + 420}px) rotate(${720}deg)`, opacity: 0 },
      ],
      { duration: 1400 + Math.random() * 700, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' },
    ).onfinish = () => el.remove()
  }
}

// 答对时从按钮上冒几颗小星星
export function sparkle(el) {
  if (!el || reduced()) return
  const o = center(el)
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('i')
    s.className = 'sparkle-piece'
    s.textContent = '★'
    s.style.left = o.x + 'px'
    s.style.top = o.y + 'px'
    document.body.appendChild(s)
    const a = (i / 8) * Math.PI * 2
    s.animate(
      [
        { transform: 'translate(-50%,-50%) scale(0.3)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * 70}px), calc(-50% + ${Math.sin(a) * 70}px)) scale(1)`, opacity: 0 },
      ],
      { duration: 600, easing: 'ease-out', fill: 'forwards' },
    ).onfinish = () => s.remove()
  }
}
