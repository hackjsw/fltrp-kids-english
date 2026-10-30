# 小熊猫学英语

外研版《新标准英语》（一年级起点）一至六年级、上下册共 12 册同步练习，给自家孩子用。规划见 [docs/PLAN.md](docs/PLAN.md)。

## 运行

```bash
npm install
npm run dev
```

电脑上打开 http://localhost:5180 ，建议用 Edge 或 Chrome。

手机/平板（同一 Wi-Fi）：

```bash
npm run dev:phone
```

手机打开 `https://<电脑局域网IP>:5181`。证书是自签的，第一次要点"高级 → 继续访问"。手机浏览器只在 HTTPS 下允许用麦克风，所以魔法变声要走这个地址。

## fnOS 部署

- 普通学习：`http://192.168.3.7:5180/`；魔法变声录音：`https://192.168.3.7:5181/`。
- NAS 目录：`/vol1/1000/docker/fltrp-kids-english`。独立 Docker Compose 项目，只绑定局域网地址，开机自动恢复。
- 本地执行 `npm run build`，只部署 `dist/` 中的 `index.html`、`assets/`、`books/`、`images/`、`audio/`（不含 `audio/samples/`）。不上传 `art/`、课本 PDF、源码、`node_modules/` 或 SSH 连接资料。
- 配置保存在 `deploy/compose.yaml` 和 `deploy/nginx.conf`；在 NAS 分别放到项目根目录，静态构建放到 `site/`。镜像固定为 NAS 已有的 Nginx 镜像 ID，不额外拉取镜像。
- `tls/` 使用 NAS 已有 Classroom CA 签发的服务器证书副本，包含 `site.crt`、`site.key` 及公开的 `local-ca.crt`、`local-ca.cer`，不复制 CA 私钥。服务器证书到期日为 2027-11-28，续期后须更新本项目副本并重载 Nginx。
- 在 NAS 项目目录运行 `sudo docker compose up -d --no-build --wait`；检查用 `sudo docker compose ps` 和 `sudo docker compose logs --tail=100 web`。

手机录音需要受信任的 HTTPS 和麦克风权限。若设备已经信任
`fnOS Classroom Local CA 2026-10-27`，可直接使用 HTTPS；否则请先核对并手动安装
`http://192.168.3.7:5180/local-ca.crt`（iPhone/iPad 用 `local-ca.cer`，安装后还需在证书信任设置中开启完全信任）。
部署不会自动修改任何设备的证书信任设置。CA SHA-256 指纹：
`32:87:63:75:4D:EB:36:83:FD:45:35:C1:3B:84:7F:16:4C:C4:22:6F:5D:ED:16:16:A7:6E:EA:E4:AA:61:EA:11`。

学习进度仍保存在各设备浏览器内；HTTP、HTTPS、原电脑开发地址之间不自动互通，建议固定使用 HTTPS 入口。

## 部署到 Cloudflare

网站部署成一个 Cloudflare Worker：`worker/index.js` 先检查家庭密码，通过后返回 `dist/` 里打包好的静态文件。课本词句、单词图和音频都要登录后才能访问。

现在部署在 https://es.rew.de5.net （Cloudflare 账号 leisurelywolf@869669.xyz，Worker 名 `fltrp-kids-english`）。

**日常更新：推送到 GitHub 就自动部署**

推送到 `main` 后，Cloudflare 会自动拉代码、运行 `npm run build`，再运行 `npx wrangler deploy`。家庭密码（机密 `FAMILY_PASSWORD`）和自定义域名都保存在 Cloudflare 上，自动部署不会改动它们。构建记录在后台这个 Worker 的「部署」页里能看到。

**第一次连接 GitHub（只做一次，在 Cloudflare 后台）**

Worker 已经建好了，直接把它连到仓库，不要另外新建一个：

1. Workers 和 Pages → 点开 `fltrp-kids-english` → 设置 → 构建 → 连接，授权 Cloudflare 访问 GitHub，选仓库 `hackjsw/fltrp-kids-english`。
2. 生产分支选 `main`；构建命令 `npm run build`；部署命令 `npx wrangler deploy`；根目录留空。
3. 保存。之后每次推送到 `main` 都会自动构建和部署。

**改家庭密码**：后台这个 Worker 的 设置 → 变量和机密 里改 `FAMILY_PASSWORD`，或者在终端运行 `npx wrangler secret put FAMILY_PASSWORD` 自己输入。改完所有设备都要重新登录。

**临时从本机部署**（一般用不到）：wrangler 登录上面的账号（`npx wrangler login`）后运行 `npm run deploy`。

**其他**

- 本地模拟线上环境：在项目根目录建 `.dev.vars`，写一行 `FAMILY_PASSWORD=随便一个测试密码`（这个文件不入库），然后 `npm run cf:dev`，打开 http://127.0.0.1:8787 。
- 退出登录：访问 `/logout`。
- 本地 `npm run dev` 不走 Worker，没有密码，家里局域网用还是原来的方式。
- 「跟我读」已经去掉：浏览器自带的语音识别在国内多半连不上（Chrome 要连谷歌的服务器），没法自动打分。`web/src/lib/speech.js` 里的识别和打分代码先留着，以后接云端发音评测可以再用。

## 免费额度与缓存

- Cloudflare Workers Free 的请求额度是**整个账号每天 100,000 次**（UTC 零点重置），不是每个 Worker 各有 100,000 次。静态资源直出免费且不限次数，但本站 `run_worker_first: true` 会先验证家庭密码，因此到达服务器的图片、MP3 等请求也消耗 Worker 请求额度。保留这个保护，不让课本文件绕过登录。
- 主要优化发生在浏览器端：带 hash 的构建资源缓存一年；图片、MP3 私有缓存一天；200、206、304 保持同一缓存策略。首页和教材 JSON 每次校验，错误和登录/退出响应不缓存。CDN 命中或 304 本身并不代表没有 Worker 请求，只有浏览器直接复用、不发请求时才省下这次额度。
- 进入单元只预取选项图片，不再预下载整个 Module 的音频。MP3 首次播放时按需下载，当前页面生命周期内复用完整音频；并发请求合并，最多保留最近 64 段 / 8 MB。已缓存 MP3 的重听和本地录音回放不调用生成音频的服务，也不会重复发放奖励；文件缺失时仍有浏览器 TTS 兜底。
- 刷新页面、浏览器淘汰缓存或缓存过期后，仍可能重新请求。同名图片/MP3 更新最多有一天缓存延迟；需立即更新时改文件名并更新引用。家庭密码控制新的网络访问，不能收回已经下载到设备的文件。
- 学习进度、竹子、贴纸在设备本地，未使用 D1/KV/R2 或定时轮询；不要把这些本地操作当作云端调用。真实账号使用量须以 Cloudflare 后台为准，还要计算同账号其他 Worker 及外部访问。

官方规则：[Workers 定价](https://developers.cloudflare.com/workers/platform/pricing/)、[Static Assets 计费](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)、[平台限制](https://developers.cloudflare.com/workers/platform/limits/)。

## 玩法

- 难度按年级（`web/src/lib/games.js` 的 `level()`）：一年级听选、喂熊猫只有 2 张图，五六年级听选 4 张图；低年级泡泡飘得慢、同时最多 4 个，小火车每轮 2–3 节车厢。
- 答错有提示：听选、喂熊猫、错题复习答错一次，那张图变灰不能再点；再错，正确的图晃一晃。小火车答错不清空，只把这一节再报一遍，同一节错两次对的图晃一晃。泡泡 6 秒没戳中，再报一遍，对的泡泡发光。
- 错题复习：第一次就答错的词句记进错题本（`kids-english-rewards` 里的 `review`），第二天首页出现「复习一下」。隔 1、3、7 天连续答对 3 次才算记住，复习时答错从头来。
- 三年级起：听选里每 3 题（五六年级每 2 题）有一题不放声音，改成看英文选图；单元里多一个「排句子」，把打乱的词块按顺序点出来（不算闯关星星）。
- 拼单词（三年级起）：看图、听发音，按顺序点字母块拼出单词。单词项拼整个词；句子挖掉一个关键词来拼（挑最长的那个，人名、大写开头的词和 is/the 这类小词不挑），句子其余部分照常显示。三四年级多 1 个干扰字母，五六年级多 2 个；点错晃一下，同一格错两次，对的字母块晃一晃。和排句子一样不算闯关星星。
- 新鲜感：连对 2 次起出现「连对 N」，音一次比一次高；听选、喂熊猫每局一道幸运题，泡泡每局一个金色泡泡，第一次就答对多给 2 根竹子。
- 翻翻乐（代替原来的「跟我读」）：卡片扣着，翻开喇叭卡会读出一个词句，再翻出对应的图片配成一对。一年级 3 对、二年级 4 对、三四年级 5 对、五六年级 6 对；一二年级开局先把所有卡亮 2.5 秒。翻错的次数不超过对数算 3 星。以前在跟读上拿的星星照样算解锁关卡。
- 麦克风：魔法变声打不开麦克风时会按原因提示（没给浏览器这个 App 麦克风权限、麦克风被占用、浏览器不支持录音等），提示下面显示浏览器的错误代码。浏览器禁止了这个网站用麦克风时，提示去地址栏左边的图标里把麦克风改成允许；手机系统没给浏览器 App 权限时，提示去手机「设置」。

## 发音

发音是 `scripts/gen_audio.py` 用 edge-tts（微软神经语音，默认美音女孩声 en-US-AnaNeural，语速 -15%）预先生成的 MP3，放在 `content/audio/`。加了新词句后重新运行：

```bash
python -I scripts/gen_audio.py
```

换音色加 `--voice en-US-EmmaNeural --force`。`content/audio/samples/` 里有 4 个候选音色的试听。生成需要联网，App 播放只读本地文件；文件缺失时退回浏览器自带语音。

看图学、听选、喂熊猫、泡泡、火车、翻翻乐、拼单词、变声、首页问候、贴纸和结算页都有明确的「重听」入口。火车重听整列；翻翻乐点翻开的喇叭卡或配好的卡再听一遍；变声区分示范与自己的录音。录音时停止示范，离开页面清理播放与延迟任务。

回归检查：

```bash
npm test
```

## 奖励

- 竹子：每局游戏 1 + 星数，第一次满分再 +5；每日宝箱 10–20；每个徽章 +10；连续学习 3/7/14/30 天各有礼物。用来在「衣橱」给小熊猫换装（12 套，15–80 竹子）。
- 贴纸：一个词句累计答对 3 次收进贴纸册。
- 每日任务：每天按日期挑 3 个，全部完成可开宝箱。
- 数值都在 `web/src/lib/catalog.js` 和 `web/src/lib/rewards.js` 里改；进度存在浏览器 localStorage（`kids-english-progress-v1`、`kids-english-rewards`）。
- 界面图（装扮、徽章、宝箱、竹子）的提示词在 `art/ui/manifest.json`，用 `node scripts/gen_images.mjs ui` 生成。
- 界面小图标和装饰贴纸（底部标签、玩法、星星、喇叭、彩虹等）一张拼图出一批：提示词和格子顺序在 `art/ui/sheets.json`，本地 Magpie 生成拼图后运行 `python -I scripts/icon_sheets.py`，按透明区域切开、打包成一张精灵图 `web/src/assets/icons.webp`，页面里用 `Icon.vue` 按名字显示，整站只多一次图片请求。

## 目录

- `scripts/content/{1a…6b}.mjs`：每册的词句和每张图的画面描述（按课本整理，写法见 `scripts/content/AUTHORING.md`）；1a 的 Module 1–2 直接写在 `content/books/1a/book.json` 里
- `content/books/{book}/book.json`：App 读取的教材内容（打开哪一册才加载哪一册），由 `node scripts/build_content.mjs {book}` 生成
- `art/`：Magpie 生成的原图 PNG；`art/{book}/manifest.json` 记录每张图的提示词和参考图
- `content/images/`：App 实际加载的 WebP（单词图 512px，约 10–40 KB）
- `content/audio/`：发音 MP3
- `scripts/style.json`：统一风格提示词和人物外貌
- `web/`：Vue 3 前端
- `textbooks/`：课本 PDF 和检查用的预览图（不入库）

## 加新单元 / 新的一册

1. 在 `scripts/content/{book}.mjs` 里加 module、unit 和词句（格式见文件开头注释），新册还要加进 `web/src/lib/content.js` 的 `BOOKS`。
2. `node scripts/build_content.mjs {book}` 生成 book.json 和图片清单。
3. `node scripts/gen_images.mjs {book}` 调本地 Magpie 批量生成缺失的图（4 张并发，失败自动重试 3 次）。
4. `python -I scripts/contact_sheet.py art/{book}/m3 -o textbooks/sheet.jpg` 拼预览图人工检查（检查标准见 `scripts/content/REVIEW.md`），画坏的删掉 PNG 重跑第 3 步。
5. `python -I scripts/optimize_images.py` 压成 WebP，`python -I scripts/gen_audio.py --book {book}` 生成发音。
