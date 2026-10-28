import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

// content/ 直接作为静态目录：/books/1a/book.json、/images/1a/m1/hello.webp、/audio/1a/hello.mp3
// HTTPS=1 时用自签证书起 HTTPS：手机浏览器只在 HTTPS 下允许用麦克风
const https = process.env.HTTPS === '1'

// 开发服务器默认 no-cache，每次进页面都要重新校验图片和音频；
// 这些素材很少改，给 1 天缓存，改了图之后强制刷新即可
const cacheMedia = {
  name: 'cache-media',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (/^\/(images|audio)\//.test(req.url)) res.setHeader('Cache-Control', 'public, max-age=86400')
      next()
    })
  },
}

export default defineConfig({
  plugins: [vue(), cacheMedia, ...(https ? [basicSsl()] : [])],
  root: 'web',
  publicDir: '../content',
  build: { outDir: '../dist', emptyOutDir: true },
  server: { port: https ? 5181 : 5180 },
})
