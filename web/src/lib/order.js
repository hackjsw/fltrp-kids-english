// 排句子：把句子拆成词块让孩子按顺序点。词块去掉两头的标点，排好后再显示原句
const EDGE = /^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g

export const tiles = (text) => text.split(/\s+/).map((w) => w.replace(EDGE, '')).filter(Boolean)

// 3–10 个词的句子才拿来排：太短没意思，太长手机上摆不下
export function canOrder(item) {
  const n = tiles(item.text).length
  return n >= 3 && n <= 10
}

// 同一个词出现两次（比如两个 the），点哪一块都算对
const norm = (w) => w.toLowerCase().replace(/’/g, "'")
export const sameWord = (a, b) => norm(a) === norm(b)
