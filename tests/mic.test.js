import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { openMic, micHint, micState, RECOGNIZER_BROKEN } from '../web/src/lib/mic.js'

const saved = { secure: globalThis.isSecureContext, nav: Object.getOwnPropertyDescriptor(globalThis, 'navigator') }
function setNavigator(value) {
  Object.defineProperty(globalThis, 'navigator', { value, configurable: true, writable: true })
}
afterEach(() => {
  globalThis.isSecureContext = saved.secure
  if (saved.nav) Object.defineProperty(globalThis, 'navigator', saved.nav)
})

test('opening the mic on an insecure page explains https instead of calling the browser', async () => {
  globalThis.isSecureContext = false
  let called = false
  setNavigator({ mediaDevices: { getUserMedia: async () => (called = true) } })
  await assert.rejects(openMic(), (e) => e.name === 'InsecureContext')
  assert.equal(called, false)
})

test('a browser without getUserMedia is reported as unsupported', async () => {
  globalThis.isSecureContext = true
  setNavigator({})
  await assert.rejects(openMic(), (e) => e.name === 'NoMediaDevices')
})

test('the mic opens when the page is secure and the browser supports it', async () => {
  globalThis.isSecureContext = true
  const stream = { id: 'mic' }
  setNavigator({ mediaDevices: { getUserMedia: async (c) => (assert.deepEqual(c, { audio: true }), stream) } })
  assert.equal(await openMic(), stream)
})

test('a site blocked in the browser and a browser app without system permission get different instructions', () => {
  const site = micHint(Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' }))
  assert.match(site.text, /地址栏/)
  assert.doesNotMatch(site.text, /手机「设置」/)
  assert.equal(site.code, 'NotAllowedError: Permission denied')
  const system = micHint(Object.assign(new Error('Permission denied by system'), { name: 'NotAllowedError' }))
  assert.match(system.text, /手机「设置」/)
  assert.doesNotMatch(system.text, /地址栏/)
  // 只有页面真的不安全时才提 https，权限问题不再说成 https
  assert.doesNotMatch(site.text + system.text, /https/)
})

test('other mic failures get their own hint and keep the browser error code', () => {
  assert.match(micHint({ name: 'NotReadableError', message: '' }).text, /占着/)
  assert.match(micHint({ name: 'NotFoundError' }).text, /没找到/)
  assert.match(micHint({ name: 'InsecureContext', message: 'insecure' }).text, /https/)
  const unknown = micHint(new TypeError('boom'))
  assert.match(unknown.text, /刷新/)
  assert.equal(unknown.code, 'TypeError: boom')
})

test('micState reads the browser permission and tolerates browsers without the API', async () => {
  setNavigator({ permissions: { query: async ({ name }) => (assert.equal(name, 'microphone'), { state: 'denied' }) } })
  assert.equal(await micState(), 'denied')
  setNavigator({})
  assert.equal(await micState(), '')
  setNavigator({ permissions: { query: async () => { throw new TypeError('not a valid permission name') } } })
  assert.equal(await micState(), '')
})

test('recognizer errors that mean the service is unusable switch to self-rating', () => {
  assert.ok(RECOGNIZER_BROKEN.includes('not-allowed'))
  assert.ok(RECOGNIZER_BROKEN.includes('service-not-allowed'))
  assert.ok(!RECOGNIZER_BROKEN.includes('no-speech'))
  assert.ok(!RECOGNIZER_BROKEN.includes('aborted'))
})
