// 拼单词：单词项直接拼整个词；句子挑一个关键词挖空来拼（人名、is/the 这类词不挑）
const WORD = /^[A-Za-z]{3,10}$/
const EDGE = /^([^A-Za-z]*)(.*?)([^A-Za-z]*)$/
const NAMES = new Set(['daming', 'lingling', 'sam', 'amy', 'tom', 'smart', 'xiaoyong'])
const STOP = new Set(
  ('the and are you your yours they them their this that these those there here what where when which who whose how '
  + 'can will would could should does did has have had was were been not for with from into some any many much very too '
  + 'she her his him its our ours mine who why yes now then than but all let lets get got going goes went come came').split(' '),
)

// 返回 { word, before, after }：before/after 是句子里挖空前后的文字，单词项为空
export function pickSpell(item) {
  const text = item.text.trim()
  const whole = text.replace(/[.!?,]+$/, '')
  if (WORD.test(whole) && whole.slice(1) === whole.slice(1).toLowerCase()) return { word: whole.toLowerCase(), before: '', after: '' }
  const toks = text.split(/\s+/)
  let best = -1
  toks.forEach((tok, i) => {
    const w = tok.match(EDGE)[2]
    // 大写开头的多半是人名地名（句首的大写词也跳过，宁可少挑）
    if (!WORD.test(w) || w !== w.toLowerCase() || STOP.has(w) || NAMES.has(w)) return
    if (best < 0 || w.length > toks[best].match(EDGE)[2].length) best = i
  })
  if (best < 0) return null
  const [, lead, word, tail] = toks[best].match(EDGE)
  const prev = toks.slice(0, best).join(' ')
  const next = toks.slice(best + 1).join(' ')
  return { word, before: (prev ? prev + ' ' : '') + lead, after: tail + (next ? ' ' + next : '') }
}

export const canSpell = (item) => pickSpell(item) !== null

// 字母块：单词的每个字母，再加 extra 个不在词里的字母当干扰
export function letterTiles(word, extra = 0, rand = Math.random) {
  const letters = [...word.toLowerCase()]
  const others = [...'abcdefghijklmnopqrstuvwxyz'].filter((c) => !letters.includes(c))
  for (let k = 0; k < extra && others.length; k++) letters.push(others.splice(Math.floor(rand() * others.length), 1)[0])
  return letters
}
