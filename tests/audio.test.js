import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createAudioCache } from '../web/src/lib/audio-cache.js'

const audioResponse = (body = 'mp3') => new Response(body, { headers: { 'Content-Type': 'audio/mpeg' } })
const tick = () => new Promise((resolve) => setImmediate(resolve))

test('concurrent requests and replays share one complete download', async () => {
  let requests = 0
  let complete
  const cache = createAudioCache({ fetcher: (src, options) => {
    requests++
    assert.equal(options.credentials, 'same-origin')
    assert.equal(options.headers?.Range, undefined)
    return new Promise((resolve) => (complete = resolve))
  } })
  const first = cache.load('/audio/a.mp3')
  const second = cache.load('/audio/a.mp3')
  assert.equal(first, second)
  complete(audioResponse())
  const blob = await first
  assert.equal(await cache.load('/audio/a.mp3'), blob)
  assert.equal(requests, 1)
})

test('failed, empty and HTML responses are not kept in the audio cache', async () => {
  for (const bad of [new Response('no', { status: 401 }), new Response(''), new Response('<html>', { headers: { 'Content-Type': 'text/html' } })]) {
    let requests = 0
    const cache = createAudioCache({ fetcher: async () => ++requests === 1 ? bad : audioResponse() })
    await assert.rejects(cache.load('/audio/a.mp3'))
    assert.equal((await cache.load('/audio/a.mp3')).type, 'audio/mpeg')
    assert.equal(requests, 2)
  }
})

test('LRU cache bounds the number and size of recordings', async () => {
  let requests = 0
  const cache = createAudioCache({ maxEntries: 2, maxBytes: 6, fetcher: async () => { requests++; return audioResponse() } })
  await cache.load('a')
  await cache.load('b')
  await cache.load('a')
  await cache.load('c')
  await cache.load('a')
  assert.equal(requests, 3)
  await cache.load('b')
  assert.equal(requests, 4)
  let bigRequests = 0
  const big = createAudioCache({ maxBytes: 2, fetcher: async () => { bigRequests++; return audioResponse() } })
  await big.load('big')
  await big.load('big')
  assert.equal(bigRequests, 2)
})

class FakeAudio {
  static instance
  constructor() { FakeAudio.instance = this; this.src = ''; this.plays = []; this.currentTime = 0 }
  addEventListener() {}
  pause() { this.paused = true }
  play() {
    this.paused = false
    this.plays.push(this.src)
    return this.failure ? Promise.reject(this.failure) : Promise.resolve()
  }
}
class FakeRecognition {
  static instance
  constructor() { FakeRecognition.instance = this }
  start() {}
  stop() { this.onend?.() }
  abort() { this.aborted = true; this.onend?.() }
}
globalThis.Audio = FakeAudio
globalThis.localStorage = { getItem: () => null }
globalThis.speechSynthesis = {
  getVoices: () => [], cancel() {}, utterances: [],
  speak(u) { this.utterances.push(u) },
}
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text } }
globalThis.window = { speechSynthesis, SpeechRecognition: FakeRecognition, addEventListener() {}, removeEventListener() {} }
const { audioCache } = await import('../web/src/lib/audio-cache.js')
const testPlayerCache = createAudioCache({ fetcher: (...args) => globalThis.fetch(...args) })
audioCache.load = testPlayerCache.load
const { speak, stopSpeech, listen, scoreReading } = await import('../web/src/lib/speech.js')
const player = FakeAudio.instance
const originalFetch = globalThis.fetch

afterEach(() => {
  stopSpeech()
  globalThis.fetch = originalFetch
  player.failure = null
  player.plays = []
  speechSynthesis.utterances = []
})

test('actual player replays the same blob URL without downloading or resetting its source', async () => {
  let requests = 0
  globalThis.fetch = async () => { requests++; return audioResponse() }
  const one = speak('one', { src: '/audio/replay.mp3' })
  await tick()
  const src = player.src
  assert.match(src, /^blob:/)
  player.onended()
  assert.equal(await one, 'ended')
  const two = speak('one', { src: '/audio/replay.mp3' })
  await tick()
  assert.equal(player.src, src)
  player.onended()
  assert.equal(await two, 'ended')
  assert.equal(requests, 1)
  assert.equal(player.plays.length, 2)
})

test('rapid replay settles old promises and plays only the latest request', async () => {
  let complete
  let requests = 0
  globalThis.fetch = () => { requests++; return new Promise((resolve) => (complete = resolve)) }
  const first = speak('rapid', { src: '/audio/rapid.mp3' })
  const second = speak('rapid', { src: '/audio/rapid.mp3' })
  assert.equal(await first, 'cancelled')
  complete(audioResponse())
  await tick()
  assert.equal(player.plays.length, 1)
  player.onended()
  assert.equal(await second, 'ended')
  assert.equal(requests, 1)
})

test('stopping during a download cannot play later or fall back to TTS', async () => {
  let complete
  globalThis.fetch = () => new Promise((resolve) => (complete = resolve))
  const pending = speak('stale', { src: '/audio/stale.mp3' })
  stopSpeech()
  assert.equal(await pending, 'cancelled')
  complete(audioResponse())
  await tick()
  assert.equal(player.plays.length, 0)
  assert.equal(speechSynthesis.utterances.length, 0)
})

test('unmounting an old audio owner does not cancel the new page', async () => {
  globalThis.fetch = async () => audioResponse()
  const old = Symbol()
  const current = Symbol()
  const one = speak('old', { src: '/audio/old.mp3', owner: old })
  const two = speak('new', { src: '/audio/new.mp3', owner: current })
  assert.equal(await one, 'cancelled')
  stopSpeech(old)
  await tick()
  assert.equal(player.paused, false)
  player.onended()
  assert.equal(await two, 'ended')
})

test('load failures fall back once, but autoplay blocks do not', async () => {
  globalThis.fetch = async () => new Response('not found', { status: 404 })
  const missing = speak('missing', { src: '/audio/missing.mp3' })
  await tick()
  assert.equal(speechSynthesis.utterances.length, 1)
  speechSynthesis.utterances[0].onend()
  assert.equal(await missing, 'ended')
  speechSynthesis.utterances = []
  globalThis.fetch = async () => audioResponse()
  player.failure = new DOMException('gesture required', 'NotAllowedError')
  assert.equal(await speak('blocked', { src: '/audio/blocked.mp3' }), 'blocked')
  assert.equal(speechSynthesis.utterances.length, 0)
})

test('recording recognition can be cancelled when leaving the page', async () => {
  const controller = new AbortController()
  const pending = listen({ signal: controller.signal })
  controller.abort()
  assert.deepEqual(await pending, [])
  assert.equal(FakeRecognition.instance.aborted, true)
})

test('recognition keeps the last partial transcript when the child stops before it is final', async () => {
  const pending = listen()
  const rec = FakeRecognition.instance
  rec.onresult({ results: [Object.assign([{ transcript: 'I am da' }], { isFinal: false })] })
  rec.onresult({ results: [Object.assign([{ transcript: 'I am da ming' }], { isFinal: false })] })
  rec.onend()
  assert.deepEqual(await pending, ['I am da ming'])
})

test('a final recognition result resolves right away with every alternative', async () => {
  const pending = listen()
  FakeRecognition.instance.onresult({ results: [Object.assign([{ transcript: 'hello' }, { transcript: 'hallo' }], { isFinal: true })] })
  assert.deepEqual(await pending, ['hello', 'hallo'])
})

test('read-along scoring accepts how recognizers write what the child said', () => {
  const ok = [
    ["I'm Daming.", 'I am da ming'],
    ["It's 6:30 am in New York.", 'it is six thirty a.m. in new york'],
    ['At 7, I get up.', 'at seven I get up'],
    ['My favourite colour is blue.', 'my favorite colors is blue'],
    ['Hi, Sam!', 'high sam'],
    ['Two elephants.', 'to elefants'],
    ["They're dragon boats.", 'their dragon boat'],
    ["Let's feed the ducks.", 'lets feed ducks'],
  ]
  for (const [target, heard] of ok) assert.equal(scoreReading(target, [heard]).stars, 3, `${target} <- ${heard}`)
})

test('read-along scoring still catches wrong and missing words', () => {
  const cat = scoreReading('This is a cat.', ['this is a hat'])
  assert.equal(cat.stars, 2)
  assert.deepEqual(cat.marks.map((m) => m.ok), [true, true, true, false])
  assert.equal(scoreReading('I like red apples.', ['I like green']).stars, 1)
  assert.equal(scoreReading("I'm Daming.", ['I am']).stars, 1)
  assert.equal(scoreReading('Good morning!', []).stars, 0)
  assert.equal(scoreReading('Good morning!', ['could morning', 'good morning']).stars, 3)
})
