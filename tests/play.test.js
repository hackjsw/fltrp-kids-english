import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addDays, afterMiss, afterHit, dueKeys } from '../web/src/lib/review.js'
import { tiles, canOrder, sameWord } from '../web/src/lib/order.js'
import { level, gamesFor } from '../web/src/lib/games.js'

test('a missed word comes back tomorrow and needs three spaced correct reviews', () => {
  let e = afterMiss('2026-10-30')
  assert.deepEqual(e, { box: 0, due: '2026-10-31' })
  e = afterHit(e, '2026-10-31')
  assert.deepEqual(e, { box: 1, due: '2026-11-03' })
  e = afterHit(e, '2026-11-03')
  assert.deepEqual(e, { box: 2, due: '2026-11-10' })
  assert.equal(afterHit(e, '2026-11-10'), null)
})

test('missing again during review starts over', () => {
  assert.deepEqual(afterMiss('2026-11-03'), { box: 0, due: '2026-11-04' })
})

test('review dates cross month, year and leap days', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addDays('2028-02-28', 1), '2028-02-29')
  assert.equal(addDays('2026-02-28', 7), '2026-03-07')
})

test('only due words are reviewed, oldest first, up to the limit', () => {
  const review = {
    '1a/hello': { box: 0, due: '2026-10-30' },
    '3a/lake': { box: 1, due: '2026-10-28' },
    '2b/cat': { box: 0, due: '2026-11-02' },
    '1a/bye': { box: 0, due: '2026-10-28' },
  }
  assert.deepEqual(dueKeys(review, '2026-10-30'), ['1a/bye', '3a/lake', '1a/hello'])
  assert.deepEqual(dueKeys(review, '2026-10-30', 2), ['1a/bye', '3a/lake'])
  assert.deepEqual(dueKeys({}, '2026-10-30'), [])
})

test('sentence tiles drop edge punctuation but keep apostrophes and times', () => {
  assert.deepEqual(tiles("Let's feed the ducks."), ["Let's", 'feed', 'the', 'ducks'])
  assert.deepEqual(tiles("It's 6:30 am in New York."), ["It's", '6:30', 'am', 'in', 'New', 'York'])
  assert.deepEqual(tiles("OK. Let's row."), ['OK', "Let's", 'row'])
  assert.ok(sameWord('The', 'the'))
  assert.ok(!sameWord('the', 'they'))
})

test('sentence ordering needs 3 to 10 words', () => {
  assert.ok(!canOrder({ text: 'Hello!' }))
  assert.ok(canOrder({ text: 'This is a cat.' }))
  assert.ok(!canOrder({ text: 'one two three four five six seven eight nine ten eleven' }))
})

test('difficulty follows the grade', () => {
  assert.equal(level(1).options, 2)
  assert.equal(level(3).options, 3)
  assert.equal(level(6).options, 4)
  assert.equal(level(2).readEvery, 0)
  assert.equal(level(3).readEvery, 3)
  assert.equal(level(5).readEvery, 2)
  assert.ok(level(1).bubbles.rise[0] > level(4).bubbles.rise[0])
  assert.ok(level(1).bubbles.max < level(4).bubbles.max)
  assert.ok(level(1).train.plan.every((n) => n <= 3))
})

test('sentence ordering only appears from grade 3 with enough sentences', () => {
  const items = [{ text: 'This is a cat.' }, { text: 'I like red apples.' }, { text: 'dog' }]
  const ids = (g, list) => gamesFor(g, list).map((x) => x.id)
  assert.ok(!ids(2, items).includes('order'))
  assert.ok(ids(3, items).includes('order'))
  assert.ok(!ids(3, items.slice(1)).includes('order'))
  assert.equal(ids(1, items).length, 7)
})
