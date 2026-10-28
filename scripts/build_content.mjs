// 把 scripts/content/{book}.mjs 合成 content/books/{book}/book.json 和 art/{book}/manifest.json
// 用法：node scripts/build_content.mjs 1a 1b
// 1a 的 Module 1–2 是之前手写的，从现有 book.json / manifest.json 里保留
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const style = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/style.json'), 'utf8'))

// 共享人物图都在 1a 下
const CHAR_REF = (key) =>
  key === 'mascot' ? 'mascot.png' : `1a/characters/${key}.png`

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback)

function characterText(keys) {
  return keys
    .map((k) => (k === 'mascot' ? 'the little red panda mascot with a blue backpack' : style.characters[k]))
    .filter(Boolean)
    .join('; ')
}

async function build(bookId) {
  const src = (await import(pathToFileURL(path.join(ROOT, `scripts/content/${bookId}.mjs`)).href)).default
  const bookPath = path.join(ROOT, `content/books/${bookId}/book.json`)
  const manifestPath = path.join(ROOT, `art/${bookId}/manifest.json`)
  const oldBook = readJson(bookPath, { modules: [] })
  const oldManifest = readJson(manifestPath, { images: [] })

  const newIds = new Set(src.modules.map((m) => m.id))
  const keptModules = oldBook.modules.filter((m) => !newIds.has(m.id))
  const keptPaths = new Set(keptModules.flatMap((m) => m.units.flatMap((u) => u.items.map((i) => i.image.replace(/\.webp$/, '.png')))))
  const images = oldManifest.images.filter((im) => keptPaths.has(im.path))

  const seen = new Set(keptModules.flatMap((m) => m.units.flatMap((u) => u.items.map((i) => i.id))))
  const modules = src.modules.map((m) => ({
    id: m.id,
    title: m.title,
    units: m.units.map((u) => ({
      id: u.id,
      title: u.title,
      items: u.items.map(([id, text, translation, scene, chars = [], opts = {}]) => {
        if (seen.has(id)) throw new Error(`${bookId}: duplicate item id ${id}`)
        seen.add(id)
        const png = `${m.id}/${id}.png`
        const who = characterText(chars)
        images.push({
          path: png,
          item: text,
          refs: chars.map(CHAR_REF),
          prompt: who ? `${scene}. Characters: ${who}. Keep characters exactly as in the reference images` : scene,
          digits: Boolean(opts.digits),
        })
        const item = { id, type: /\s/.test(text.trim()) && /[.!?]$/.test(text) ? 'sentence' : 'word', text, translation, image: `${m.id}/${id}.webp` }
        if (opts.same) item.same = opts.same
        return item
      }),
    })),
  }))

  const order = (id) => parseInt(id.slice(1), 10)
  const book = {
    id: src.id,
    title: src.title,
    subtitle: src.subtitle,
    source: src.source,
    modules: [...keptModules, ...modules].sort((a, b) => order(a.id) - order(b.id)),
    characters: oldBook.characters,
  }
  if (!book.characters) delete book.characters

  fs.mkdirSync(path.dirname(bookPath), { recursive: true })
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(bookPath, JSON.stringify(book, null, 2) + '\n')
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ ...oldManifest, book: bookId, images }, null, 2) + '\n',
  )
  const n = book.modules.reduce((s, m) => s + m.units.reduce((t, u) => t + u.items.length, 0), 0)
  console.log(`${bookId}: ${book.modules.length} modules, ${n} items, ${images.length} manifest images`)
}

for (const id of process.argv.slice(2)) await build(id)
