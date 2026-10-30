import assert from 'node:assert/strict'
import { test } from 'node:test'

globalThis.localStorage = { getItem: () => null, setItem() {} }
const { pickPairs, deck } = await import('../web/src/lib/memory.js')

const item = (id, same) => ({ id, text: id, image: `${id}.webp`, ...(same ? { same } : {}) })

test('memory uses the unit first and tops up from the same module', () => {
  const unit = [item('a'), item('b')]
  const mod = [...unit, item('c'), item('d')]
  const got = pickPairs(unit, mod, 3)
  assert.equal(got.length, 3)
  assert.ok(unit.every((u) => got.includes(u)))
  assert.equal(new Set(got.map((x) => x.id)).size, 3)
})

test('synonyms never share a memory round', () => {
  const unit = [item('hi', 'greet'), item('hello', 'greet'), item('bye')]
  for (let k = 0; k < 20; k++) {
    const got = pickPairs(unit, unit, 3)
    assert.equal(got.length, 2)
    assert.ok(!(got.some((x) => x.id === 'hi') && got.some((x) => x.id === 'hello')))
  }
})

test('each picked item becomes one sound card and one picture card', () => {
  const items = [item('a'), item('b'), item('c')]
  const cards = deck(items)
  assert.equal(cards.length, 6)
  for (const it of items) assert.deepEqual(cards.filter((c) => c.item === it).map((c) => c.kind).sort(), ['pic', 'sound'])
  assert.equal(new Set(cards.map((c) => c.key)).size, 6)
})
