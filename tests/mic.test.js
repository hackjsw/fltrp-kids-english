import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { openMic, micHint, RECOGNIZER_BROKEN } from '../web/src/lib/mic.js'

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

test('each mic failure gets its own hint and keeps the browser error code', () => {
  const denied = micHint(Object.assign(new Error('Permission denied by system'), { name: 'NotAllowedError' }))
  assert.match(denied.text, /设置/)
  assert.equal(denied.code, 'NotAllowedError: Permission denied by system')
  assert.match(micHint({ name: 'NotReadableError', message: '' }).text, /占着/)
  assert.match(micHint({ name: 'NotFoundError' }).text, /没找到/)
  assert.match(micHint({ name: 'InsecureContext', message: 'insecure' }).text, /https/)
  const unknown = micHint(new TypeError('boom'))
  assert.match(unknown.text, /刷新/)
  assert.equal(unknown.code, 'TypeError: boom')
  // 只有页面真的不安全时才提 https，权限问题不再说成 https
  assert.doesNotMatch(denied.text, /https/)
})

test('recognizer errors that mean the service itself is unusable switch to self-rating', () => {
  assert.ok(RECOGNIZER_BROKEN.includes('not-allowed'))
  assert.ok(RECOGNIZER_BROKEN.includes('service-not-allowed'))
  assert.ok(!RECOGNIZER_BROKEN.includes('no-speech'))
  assert.ok(!RECOGNIZER_BROKEN.includes('aborted'))
})
