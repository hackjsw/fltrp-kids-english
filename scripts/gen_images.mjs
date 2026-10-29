// 按 art/{book}/manifest.json 批量调用本地 Magpie 图像服务生成缺失的图片
// 用法：node scripts/gen_images.mjs 1a 1b [--concurrency 4] [--only m3/sit-down.png] [--force]
// 原图存到 art/{book}/{path}，之后跑 scripts/optimize_images.py 压成 WebP
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENDPOINT = process.env.MAGPIE_URL || 'http://127.0.0.1:3425/mcp/magpie/image'
const style = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/style.json'), 'utf8'))

const args = process.argv.slice(2)
const flag = (name, def) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : def
}
const books = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--'))
const concurrency = Number(flag('--concurrency', 4))
const only = flag('--only')
const force = args.includes('--force')

let rpcId = 0
async function rpc(method, params, timeoutMs = 120000) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await res.text()
  // 可能是 SSE：取最后一个 data: 行
  const body = text.trimStart().startsWith('{') ? text : text.split('\n').filter((l) => l.startsWith('data:')).pop()?.slice(5)
  const j = JSON.parse(body)
  if (j.error) throw new Error(j.error.message)
  return j.result
}

const call = (name, args) => rpc('tools/call', { name, arguments: args }, 180000)

function pendingId(result) {
  return result?._meta?.['usemagpie.ai/pending'] || /id "([^"]+)"/.exec(result?.content?.[0]?.text || '')?.[1]
}

function imageData(result) {
  const img = (result?.content || []).find((c) => c.type === 'image' && c.data)
  return img ? Buffer.from(img.data, 'base64') : null
}

function errorText(result) {
  return (result?.content || []).map((c) => c.text).filter(Boolean).join(' ').slice(0, 200)
}

const toDataUrl = (file) => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`

async function generateOne(job) {
  const refs = job.refs.map((r) => path.join(ROOT, 'art', r)).filter((f) => fs.existsSync(f))
  // 有参考图时提醒保持人物一致；没有人物的图用一张家具图当材质参考。
  // 不能用吉祥物：动物会照着小熊猫的体型画，还背上它的书包
  // 界面图（徽章、宝箱）可以单独指定材质参考 styleRefs
  const fallback = (job.styleRefs || ['1a/m3/chair.png']).map((r) => path.join(ROOT, 'art', r))
  const styleRef = refs.length ? refs : fallback
  // digits：画面主体就是数字或字母，要画清楚；其他图一律不要文字
  const digits = job.digits ? ' The digit or letter shapes must be clearly readable, and no other text.' : ' No text, no letters, no numbers.'
  const refHint = refs.length
    ? 'Keep the characters exactly as in the reference images.'
    : 'Use the reference image only for its soft plush material and lighting; do not copy its subject, shape or accessories.'
  // transparent：界面图要叠在彩色背景上，去掉白底
  const styleText = job.transparent ? style.style.replace('plain pure white background', 'transparent background') : style.style
  const prompt = `${job.prompt}. ${refHint} ${styleText}${digits}`
  let result = await call('generate_image', {
    prompt,
    size: style.size,
    reference_images: styleRef.slice(0, 4).map(toDataUrl),
    ...(job.transparent ? { background: 'transparent' } : {}),
  })
  for (let k = 0; k < 30; k++) {
    const data = imageData(result)
    if (data) return data
    const id = pendingId(result)
    if (!id) throw new Error(errorText(result) || 'no image')
    result = await call('generation_result', { id })
  }
  throw new Error('timeout')
}

async function runJob(job, tries = 3) {
  for (let t = 1; t <= tries; t++) {
    try {
      const data = await generateOne(job)
      fs.mkdirSync(path.dirname(job.out), { recursive: true })
      fs.writeFileSync(job.out, data)
      return true
    } catch (e) {
      console.log(`  retry ${t}/${tries} ${job.rel}: ${e.message}`)
      await new Promise((r) => setTimeout(r, 3000 * t))
    }
  }
  return false
}

const jobs = []
for (const book of books) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, `art/${book}/manifest.json`), 'utf8'))
  for (const im of manifest.images) {
    const rel = `${book}/${im.path}`
    const out = path.join(ROOT, 'art', rel)
    if (only && im.path !== only && rel !== only) continue
    if (!force && fs.existsSync(out)) continue
    jobs.push({ ...im, rel, out })
  }
}

await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'gen_images', version: '1' } })
console.log(`${jobs.length} images to generate, concurrency ${concurrency}`)

let done = 0
const failed = []
const queue = [...jobs]
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    for (let job; (job = queue.shift()); ) {
      const ok = await runJob(job)
      done++
      if (!ok) failed.push(job.rel)
      console.log(`[${done}/${jobs.length}] ${ok ? 'ok  ' : 'FAIL'} ${job.rel}`)
    }
  }),
)
console.log(`finished: ${jobs.length - failed.length} ok, ${failed.length} failed`)
if (failed.length) console.log('failed:\n' + failed.join('\n'))
