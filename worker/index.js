// Cloudflare Worker：家庭密码 + 静态资源（Vite 打包的 dist/）
// - 密码放在 Secret FAMILY_PASSWORD 里，不进代码库；没设置时整站关闭
// - 登录后发一个签名 cookie，30 天内同一设备不用再输；改密码后所有设备要重新登录
// - 只有登录页要用的两张图不用登录；课本词句、单词图、音频都要先登录

const COOKIE = 'family'
const MAX_AGE = 30 * 24 * 3600
const PUBLIC = new Set(['/images/ui/outfits/default.webp', '/images/ui/bamboo.webp'])

const enc = new TextEncoder()
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

// 先各自做 SHA-256 再逐字节比较，长度一致、耗时不随内容变化
async function sameText(a, b) {
  const [x, y] = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))))
  const u = new Uint8Array(x)
  const v = new Uint8Array(y)
  let diff = 0
  for (let i = 0; i < u.length; i++) diff |= u[i] ^ v[i]
  return diff === 0
}

async function makeToken(secret) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE)
  return `${exp}.${await hmac(secret, `family:${exp}`)}`
}

async function validToken(secret, token) {
  const [exp, sig] = (token || '').split('.')
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false
  return sameText(sig, await hmac(secret, `family:${exp}`))
}

function readCookie(req) {
  const m = /(?:^|;\s*)family=([^;]+)/.exec(req.headers.get('Cookie') || '')
  return m ? decodeURIComponent(m[1]) : ''
}

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function page(title, body, status = 200) {
  return new Response(
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:'PingFang SC','Microsoft YaHei',system-ui,sans-serif;
    background:linear-gradient(#fff8f1,#ffe9d6);color:#4a3426}
  .box{width:min(340px,88vw);background:#fff;border-radius:30px;padding:24px 22px;text-align:center;box-shadow:0 8px 0 #f1dccb}
  img{width:150px;height:150px;object-fit:contain}
  h1{font-size:24px;margin:4px 0}
  p{color:#a08876;margin:6px 0 16px}
  input{width:100%;box-sizing:border-box;font-size:20px;padding:12px 14px;border:3px solid #ffe0c7;border-radius:16px;outline:none;text-align:center}
  input:focus{border-color:#ff8a4c}
  button{margin-top:14px;width:100%;font-size:20px;font-weight:800;color:#fff;background:#ff8a4c;border:0;border-radius:999px;padding:12px;box-shadow:0 5px 0 #e06a2c;cursor:pointer}
  .err{color:#ff5a5a;font-weight:700}
</style></head><body><div class="box">${body}</div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY' } },
  )
}

const loginPage = (error = '') =>
  page(
    '小熊猫学英语',
    `<img src="/images/ui/outfits/default.webp" alt="">
<h1>小熊猫学英语</h1>
<p>请家长输入家庭密码<br>这台设备 30 天内不用再输</p>
${error ? `<p class="err">${esc(error)}</p>` : ''}
<form method="post" action="/login">
  <input type="password" name="password" autocomplete="current-password" placeholder="家庭密码" required autofocus>
  <button type="submit">进入</button>
</form>`,
    error ? 401 : 200,
  )

// 打包文件名带 hash，可以长期缓存；图和音频改动少，缓存一天；其余（index.html、book.json）每次校验
function cacheControl(path) {
  if (path.startsWith('/assets/')) return 'private, max-age=31536000, immutable'
  if (/^\/(images|audio)\//.test(path)) return 'private, max-age=86400'
  return 'private, no-cache'
}

async function serve(req, env, path) {
  const res = await env.ASSETS.fetch(req)
  const out = new Response(res.body, res)
  if (res.ok) out.headers.set('Cache-Control', cacheControl(path))
  out.headers.set('X-Content-Type-Options', 'nosniff')
  return out
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url)
    const path = url.pathname
    const secret = env.FAMILY_PASSWORD

    if (!secret) {
      return page('还没设置密码', '<h1>还没设置家庭密码</h1><p>在 Cloudflare 后台给这个 Worker 添加 Secret：FAMILY_PASSWORD</p>', 503)
    }

    if (path === '/login' && req.method === 'POST') {
      const form = await req.formData().catch(() => null)
      const pw = String(form?.get('password') || '')
      if (!(await sameText(pw, secret))) {
        // 输错放慢一点，降低猜密码的速度
        await new Promise((r) => setTimeout(r, 1000))
        return loginPage('密码不对，再试一次')
      }
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${encodeURIComponent(await makeToken(secret))}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        },
      })
    }

    if (path === '/logout') {
      return new Response(null, {
        status: 303,
        headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax` },
      })
    }

    if (await validToken(secret, readCookie(req))) return serve(req, env, path)
    if (PUBLIC.has(path)) return serve(req, env, path)

    // 没登录：网页请求给登录页，其他（图片、音频、JSON）一律 401
    const wantsPage = req.method === 'GET' && (req.headers.get('Accept') || '').includes('text/html')
    return wantsPage ? loginPage() : new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  },
}
