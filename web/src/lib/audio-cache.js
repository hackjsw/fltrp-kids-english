// 缓存完整 MP3，而不是让 Audio 每次重听都重新发 Range 请求。
// 同一地址的并发播放共用一次下载；只保留最近的 64 段 / 8 MB，避免手机内存一直增长。
export function createAudioCache({ maxEntries = 64, maxBytes = 8 * 1024 * 1024, fetcher = fetch } = {}) {
  const entries = new Map()
  let bytes = 0

  function drop(key) {
    bytes -= entries.get(key)?.size || 0
    entries.delete(key)
  }

  function trim() {
    while (entries.size > maxEntries || bytes > maxBytes) drop(entries.keys().next().value)
  }

  function load(src) {
    const hit = entries.get(src)
    if (hit) {
      entries.delete(src)
      entries.set(src, hit)
      return hit.promise
    }
    const entry = { size: 0 }
    entries.set(src, entry)
    entry.promise = (async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      try {
        const res = await fetcher(src, { credentials: 'same-origin', signal: controller.signal })
        if (!res.ok) throw new Error(`Audio HTTP ${res.status}`)
        const blob = await res.blob()
        if (!blob.size || !/^(audio\/|application\/octet-stream)/i.test(blob.type)) throw new Error('Invalid audio')
        if (entries.get(src) === entry) {
          entry.size = blob.size
          bytes += entry.size
          trim()
        }
        return blob
      } catch (error) {
        if (entries.get(src) === entry) drop(src)
        throw error
      } finally {
        clearTimeout(timeout)
      }
    })()
    trim()
    return entry.promise
  }

  return { load }
}

export const audioCache = createAudioCache()
