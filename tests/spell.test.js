import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pickSpell, canSpell, letterTiles } from '../web/src/lib/spell.js'
import { gamesFor, level } from '../web/src/lib/games.js'

test('a single-word item is spelled whole, in lower case', () => {
  assert.deepEqual(pickSpell({ text: 'chopsticks' }), { word: 'chopsticks', before: '', after: '' })
  assert.deepEqual(pickSpell({ text: 'Halloween' }), { word: 'halloween', before: '', after: '' })
})

test('a sentence blanks its longest content word and keeps the rest', () => {
  assert.deepEqual(pickSpell({ text: 'This river is very wide.' }), { word: 'river', before: 'This ', after: ' is very wide.' })
  assert.deepEqual(pickSpell({ text: "Don't feed the fish!" }), { word: 'feed', before: "Don't ", after: ' the fish!' })
  assert.deepEqual(pickSpell({ text: 'I want a hot dog, please.' }), { word: 'please', before: 'I want a hot dog, ', after: '.' })
})

test('names, capitalised words and function words are never blanked', () => {
  assert.equal(pickSpell({ text: "I'm Daming." }), null)
  assert.equal(pickSpell({ text: 'How are you?' }), null)
  assert.equal(canSpell({ text: 'Hello, Sam!' }), false)
  assert.equal(pickSpell({ text: 'I went to London.' }), null)
  assert.equal(pickSpell({ text: 'DVD' }), null)
})

test('letter tiles hold every letter of the word plus distractors not in it', () => {
  const tiles = letterTiles('apple', 2, () => 0)
  assert.equal(tiles.length, 7)
  assert.deepEqual(tiles.slice(0, 5), ['a', 'p', 'p', 'l', 'e'])
  assert.ok(tiles.slice(5).every((c) => !'apple'.includes(c)))
  assert.deepEqual(letterTiles('cat'), ['c', 'a', 't'])
})

test('spelling appears from grade 3 when the unit has at least two spellable items', () => {
  const items = [{ text: 'chopsticks' }, { text: 'This river is very wide.' }, { text: 'How are you?' }]
  const ids = (g, list) => gamesFor(g, list).map((x) => x.id)
  assert.ok(!ids(2, items).includes('spell'))
  assert.ok(ids(3, items).includes('spell'))
  assert.ok(!ids(3, items.slice(1)).includes('spell'))
  assert.equal(level(3).spellExtra, 1)
  assert.equal(level(6).spellExtra, 2)
})
