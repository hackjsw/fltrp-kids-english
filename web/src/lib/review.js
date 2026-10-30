// 错题复习：第一次就答错的词句记进错题本，第二天再考；隔 1、3、7 天连续答对 3 次才算记住
// 纯函数，状态存在 rewards.review：{ '3a/lake': { box: 0, due: '2026-10-31' } }
export const STEPS = [1, 3, 7]

export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number)
  const t = new Date(y, m - 1, d + n)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

// 答错（平时玩或复习时都算）：从头来，明天再考
export function afterMiss(today) {
  return { box: 0, due: addDays(today, STEPS[0]) }
}

// 复习时答对：进一格；三格都过了返回 null，表示记住了，从错题本里拿掉
export function afterHit(entry, today) {
  const box = (entry?.box || 0) + 1
  return box >= STEPS.length ? null : { box, due: addDays(today, STEPS[box]) }
}

// 今天该复习的，到期最早的排前面
export function dueKeys(review, today, limit = Infinity) {
  return Object.entries(review)
    .filter(([, e]) => e.due <= today)
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[1].box - b[1].box)
    .slice(0, limit)
    .map(([k]) => k)
}
