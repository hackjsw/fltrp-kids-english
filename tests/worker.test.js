import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { before, mock, test } from 'node:test'
import worker from '../worker/index.js'

const ORIGIN = 'https://worker.test'
const SECRET = 'test-only-family-password'
const MEDIA_CACHE = 'private, max-age=86400'
const ASSET_CACHE = 'private, max-age=31536000, immutable'
const UPSTREAM_CACHE = 'public, max-age=0, must-revalidate'
const PUBLIC_PATHS = ['/images/ui/outfits/default.webp', '/images/ui/bamboo.webp']
let cookie

function request(path, init) {
  return new Request(`${ORIGIN}${path}`, init)
}

function assetEnv(response = new Response('asset content', {
  headers: { 'Cache-Control': UPSTREAM_CACHE },
})) {
  return {
    FAMILY_PASSWORD: SECRET,
    ASSETS: { fetch: mock.fn(async () => response) },
  }
}

function authenticatedRequest(path, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('Cookie', `theme=light; ${cookie}; other=value`)
  return request(path, { ...init, headers })
}

function loginRequest(password = SECRET) {
  return request('/login', {
    method: 'POST',
    body: new URLSearchParams({ password }),
  })
}

function assertNotForwarded(env) {
  assert.equal(env.ASSETS.fetch.mock.callCount(), 0)
}

function assertForwarded(env, req) {
  assert.equal(env.ASSETS.fetch.mock.callCount(), 1)
  assert.equal(env.ASSETS.fetch.mock.calls[0].arguments[0], req)
}

function assertPrivateCache(response, expected) {
  assert.equal(response.headers.get('Cache-Control'), expected)
  assert.doesNotMatch(response.headers.get('Cache-Control'), /\bpublic\b/)
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
}

before(async () => {
  const response = await worker.fetch(loginRequest(), assetEnv())
  assert.equal(response.status, 303)
  cookie = response.headers.get('Set-Cookie').split(';', 1)[0]
})

test('missing or empty secret closes every route, including public images and login', async (t) => {
  for (const secret of [undefined, '']) {
    for (const path of ['/', '/audio/hello.mp3', ...PUBLIC_PATHS, '/login', '/logout']) {
      await t.test(`${secret === undefined ? 'missing' : 'empty'} secret: ${path}`, async () => {
        const env = assetEnv()
        if (secret === undefined) delete env.FAMILY_PASSWORD
        else env.FAMILY_PASSWORD = secret
        const req = path === '/login' ? loginRequest() : request(path)
        const response = await worker.fetch(req, env)
        assert.equal(response.status, 503)
        assert.equal(response.headers.get('Cache-Control'), 'no-store')
        assert.equal(response.headers.get('Set-Cookie'), null)
        assert.match(await response.text(), /FAMILY_PASSWORD/)
        assertNotForwarded(env)
      })
    }
  }
})

test('unauthenticated page navigation returns the non-cacheable login form', async () => {
  const env = assetEnv()
  const response = await worker.fetch(request('/', { headers: { Accept: 'text/html' } }), env)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('Content-Type'), /^text\/html/)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(response.headers.get('X-Frame-Options'), 'DENY')
  assert.match(await response.text(), /<form method="post" action="\/login">/)
  assertNotForwarded(env)
})

test('correct login issues a secure signed cookie and a non-cacheable redirect', async () => {
  const env = assetEnv()
  const response = await worker.fetch(loginRequest(), env)
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('Location'), '/')
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  const setCookie = response.headers.get('Set-Cookie')
  assert.match(setCookie, /^family=\d+\.[A-Za-z0-9_-]+;/)
  for (const attribute of ['Max-Age=2592000', 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax']) {
    assert.ok(setCookie.split('; ').includes(attribute), `missing cookie attribute: ${attribute}`)
  }
  assert.equal(await response.text(), '')
  assertNotForwarded(env)
})

test('wrong password and malformed login form never expose assets or set a cookie', async (t) => {
  for (const [name, req] of [
    ['wrong password', loginRequest('incorrect-test-password')],
    ['malformed form', request('/login', { method: 'POST', body: 'not a form' })],
  ]) {
    await t.test(name, async () => {
      const env = assetEnv()
      const response = await worker.fetch(req, env)
      assert.equal(response.status, 401)
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
      assert.equal(response.headers.get('Set-Cookie'), null)
      assert.match(await response.text(), /密码不对/)
      assertNotForwarded(env)
    })
  }
})

test('unauthenticated protected resources and whitelist lookalikes return 401', async (t) => {
  for (const path of [
    '/audio/hello.mp3', '/images/words/cat.webp', '/book.json',
    '/assets/index-AbCd1234.js', '/index.html',
    '/images/ui/outfits/other.webp', '/images/ui/bamboo.webp.extra',
    '/images/ui/outfits/default.webp/extra',
  ]) {
    await t.test(path, async () => {
      const env = assetEnv()
      const response = await worker.fetch(request(path, { headers: { Accept: '*/*' } }), env)
      assert.equal(response.status, 401)
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
      assert.equal(await response.text(), 'Unauthorized')
      assertNotForwarded(env)
    })
  }
})

test('only the exact public image paths bypass authentication, including with a query', async (t) => {
  for (const path of PUBLIC_PATHS) {
    await t.test(path, async () => {
      const env = assetEnv()
      const req = request(`${path}?v=test`)
      const response = await worker.fetch(req, env)
      assert.equal(response.status, 200)
      assertPrivateCache(response, MEDIA_CACHE)
      assert.equal(await response.text(), 'asset content')
      assertForwarded(env, req)
    })
  }
})

test('a cookie obtained through login authorizes protected resources', async () => {
  const env = assetEnv()
  const req = authenticatedRequest('/book.json?edition=test')
  const response = await worker.fetch(req, env)
  assert.equal(response.status, 200)
  assert.equal(await response.text(), 'asset content')
  assertForwarded(env, req)
})

test('tampered, expired, and old-password cookies do not authorize assets', async (t) => {
  const expired = String(Math.floor(Date.now() / 1000) - 60)
  const signature = createHmac('sha256', SECRET).update(`family:${expired}`).digest('base64url')
  for (const [name, testCookie, secret] of [
    ['tampered', `${cookie}x`, SECRET],
    ['expired', `family=${expired}.${signature}`, SECRET],
    ['password rotated', cookie, 'different-test-only-password'],
  ]) {
    await t.test(name, async () => {
      const env = assetEnv()
      env.FAMILY_PASSWORD = secret
      const response = await worker.fetch(request('/audio/hello.mp3', {
        headers: { Cookie: testCookie },
      }), env)
      assert.equal(response.status, 401)
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
      assertNotForwarded(env)
    })
  }
})

test('media 200, 206, and 304 responses keep a one-day private cache and asset metadata', async (t) => {
  for (const [path, type] of [['/audio/hello.mp3', 'audio/mpeg'], ['/images/words/cat.webp', 'image/webp']]) {
    for (const status of [200, 206, 304]) {
      await t.test(`${path}: ${status}`, async () => {
        const body = status === 304 ? null : status === 206 ? 'part' : 'full media'
        const headers = new Headers({
          'Cache-Control': UPSTREAM_CACHE,
          'Content-Type': type,
          ETag: '"media-v1"',
          'Last-Modified': 'Mon, 01 Jan 2024 00:00:00 GMT',
          'Accept-Ranges': 'bytes',
          Vary: 'Accept-Encoding',
        })
        if (body !== null) headers.set('Content-Length', String(body.length))
        if (status === 206) headers.set('Content-Range', 'bytes 0-3/10')
        const upstream = new Response(body, { status, headers })
        const env = assetEnv(upstream)
        const req = authenticatedRequest(`${path}?v=1`, {
          headers: status === 206 ? { Range: 'bytes=0-3' } : status === 304 ? { 'If-None-Match': '"media-v1"' } : {},
        })
        const response = await worker.fetch(req, env)
        assert.equal(response.status, status)
        assertPrivateCache(response, MEDIA_CACHE)
        for (const header of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'ETag', 'Last-Modified', 'Vary']) {
          assert.equal(response.headers.get(header), upstream.headers.get(header), `${header} must be preserved`)
        }
        assert.equal(upstream.headers.get('Cache-Control'), UPSTREAM_CACHE, 'must not mutate upstream headers')
        if (status === 304) assert.equal(response.body, null)
        assert.equal(await response.text(), body ?? '')
        assertForwarded(env, req)
      })
    }
  }
})

test('authenticated HEAD requests retain media headers without a response body', async () => {
  const env = assetEnv(new Response(null, {
    headers: { 'Content-Length': '10', 'Accept-Ranges': 'bytes', 'Cache-Control': UPSTREAM_CACHE },
  }))
  const req = authenticatedRequest('/audio/hello.mp3', { method: 'HEAD' })
  const response = await worker.fetch(req, env)
  assertPrivateCache(response, MEDIA_CACHE)
  assert.equal(response.headers.get('Content-Length'), '10')
  assert.equal(response.body, null)
  assertForwarded(env, req)
})

test('hashed build assets receive private immutable caching on 200 and 304', async (t) => {
  for (const path of ['/assets/index-AbCd1234.js', '/assets/index-EfGh5678.css']) {
    for (const status of [200, 304]) {
      await t.test(`${path}: ${status}`, async () => {
        const env = assetEnv(new Response(status === 304 ? null : 'built asset', {
          status, headers: { 'Cache-Control': UPSTREAM_CACHE, ETag: '"build-v1"' },
        }))
        const response = await worker.fetch(authenticatedRequest(path), env)
        assert.equal(response.status, status)
        assertPrivateCache(response, ASSET_CACHE)
        assert.equal(response.headers.get('ETag'), '"build-v1"')
      })
    }
  }
})

test('index and JSON responses require private revalidation, including 304', async (t) => {
  for (const path of ['/', '/index.html', '/book.json']) {
    for (const status of [200, 304]) {
      await t.test(`${path}: ${status}`, async () => {
        const env = assetEnv(new Response(status === 304 ? null : 'document', {
          status, headers: { 'Cache-Control': 'public, max-age=31536000, immutable', ETag: '"document-v1"' },
        }))
        const response = await worker.fetch(authenticatedRequest(path), env)
        assert.equal(response.status, status)
        assertPrivateCache(response, 'private, no-cache')
        assert.equal(response.headers.get('ETag'), '"document-v1"')
      })
    }
  }
})

test('error responses never acquire the successful asset long-cache policy', async (t) => {
  for (const path of ['/audio/hello.mp3', '/assets/index-AbCd1234.js']) {
    for (const status of [401, 403, 404, 416, 429, 500, 503]) {
      await t.test(`${path}: ${status}`, async () => {
        const env = assetEnv(new Response('upstream error', {
          status, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' },
        }))
        const response = await worker.fetch(authenticatedRequest(path), env)
        assert.equal(response.status, status)
        assert.equal(response.headers.get('Cache-Control'), 'no-store')
        assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
        assert.equal(response.headers.get('Retry-After'), '60')
        assert.equal(await response.text(), 'upstream error')
      })
    }
  }
  await t.test('an error without cache headers does not gain a long TTL', async () => {
    const env = assetEnv(new Response('not found', { status: 404 }))
    const response = await worker.fetch(authenticatedRequest('/images/missing.webp'), env)
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
  })
})


test('malformed cookie is treated as logged out instead of crashing', async () => {
  const env = assetEnv()
  const response = await worker.fetch(request('/', { headers: { Cookie: 'family=%', Accept: 'text/html' } }), env)
  assert.equal(response.status, 200)
  assert.match(await response.text(), /<form/)
  assertNotForwarded(env)
})

test('upstream errors and logout redirects cannot be cached', async () => {
  const env = assetEnv(new Response('error', { status: 500, headers: { 'Cache-Control': 'public, max-age=31536000' } }))
  const response = await worker.fetch(authenticatedRequest('/images/missing.webp'), env)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  const logout = await worker.fetch(authenticatedRequest('/logout'), env)
  assert.equal(logout.status, 303)
  assert.equal(logout.headers.get('Cache-Control'), 'no-store')
  assert.match(logout.headers.get('Set-Cookie'), /Max-Age=0/)
})
