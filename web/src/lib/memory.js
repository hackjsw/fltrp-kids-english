// 翻翻乐：挑几组不会混淆的词句，每组一张「喇叭卡」和一张「图片卡」
import { canConfuse, shuffle } from './content.js'

// 先从本单元挑，不够再从同一个 Module 补；同义的（hi/hello）不放在同一局
export function pickPairs(unitItems, moduleItems, n) {
  const picked = []
  for (const it of [...shuffle(unitItems), ...shuffle(moduleItems.filter((m) => !unitItems.includes(m)))]) {
    if (picked.length >= n) break
    if (picked.every((p) => canConfuse(it, p))) picked.push(it)
  }
  return picked
}

export const deck = (items) =>
  shuffle(items.flatMap((item) => [
    { key: `${item.id}-sound`, item, kind: 'sound' },
    { key: `${item.id}-pic`, item, kind: 'pic' },
  ]))
