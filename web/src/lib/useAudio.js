import { onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { speak, speakItem, stopSpeech } from './speech.js'

// 页面离开时清理声音和延迟任务，旧题目的回调不能在新页面继续播音。
export function useAudio() {
  const owner = Symbol()
  let active = true
  const timers = new Map()
  const wait = (ms) => new Promise((resolve) => {
    if (!active) return resolve(false)
    const id = setTimeout(() => {
      timers.delete(id)
      resolve(active)
    }, ms)
    timers.set(id, resolve)
  })
  function dispose() {
    active = false
    for (const [id, resolve] of timers) {
      clearTimeout(id)
      resolve(false)
    }
    timers.clear()
    stopSpeech(owner)
  }
  onBeforeRouteLeave(dispose)
  onBeforeUnmount(dispose)
  return {
    speak: (text, options) => active ? speak(text, { ...options, owner }) : Promise.resolve('cancelled'),
    speakItem: (item) => active ? speakItem(item, { owner }) : Promise.resolve('cancelled'),
    stopSpeech,
    wait,
    isActive: () => active,
  }
}
