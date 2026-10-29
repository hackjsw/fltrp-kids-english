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

手机打开 `https://<电脑局域网IP>:5181`。证书是自签的，第一次要点"高级 → 继续访问"。手机浏览器只在 HTTPS 下允许用麦克风，所以跟读要走这个地址。

## fnOS 部署

- 普通学习：`http://192.168.3.7:5180/`；跟读录音：`https://192.168.3.7:5181/`。
- NAS 目录：`/vol1/1000/docker/fltrp-kids-english`。独立 Docker Compose 项目，只绑定局域网地址，开机自动恢复。
- 本地执行 `npm run build`，只部署 `dist/` 中的 `index.html`、`assets/`、`books/`、`images/`、`audio/`（不含 `audio/samples/`）。不上传 `art/`、课本 PDF、源码、`node_modules/` 或 SSH 连接资料。
- 配置保存在 `deploy/compose.yaml` 和 `deploy/nginx.conf`；在 NAS 分别放到项目根目录，静态构建放到 `site/`。镜像固定为 NAS 已有的 Nginx 镜像 ID，不额外拉取镜像。
- `tls/` 使用 NAS 已有 Classroom CA 签发的服务器证书副本，包含 `site.crt`、`site.key` 及公开的 `local-ca.crt`、`local-ca.cer`，不复制 CA 私钥。服务器证书到期日为 2027-11-28，续期后须更新本项目副本并重载 Nginx。
- 在 NAS 项目目录运行 `sudo docker compose up -d --no-build --wait`；检查用 `sudo docker compose ps` 和 `sudo docker compose logs --tail=100 web`。

手机跟读需要受信任的 HTTPS 和麦克风权限。若设备已经信任
`fnOS Classroom Local CA 2026-10-27`，可直接使用 HTTPS；否则请先核对并手动安装
`http://192.168.3.7:5180/local-ca.crt`（iPhone/iPad 用 `local-ca.cer`，安装后还需在证书信任设置中开启完全信任）。
部署不会自动修改任何设备的证书信任设置。CA SHA-256 指纹：
`32:87:63:75:4D:EB:36:83:FD:45:35:C1:3B:84:7F:16:4C:C4:22:6F:5D:ED:16:16:A7:6E:EA:E4:AA:61:EA:11`。

学习进度仍保存在各设备浏览器内；HTTP、HTTPS、原电脑开发地址之间不自动互通，建议固定使用 HTTPS 入口。

## 发音

发音是 `scripts/gen_audio.py` 用 edge-tts（微软神经语音，默认美音女孩声 en-US-AnaNeural，语速 -15%）预先生成的 MP3，放在 `content/audio/`。加了新词句后重新运行：

```bash
python -I scripts/gen_audio.py
```

换音色加 `--voice en-US-EmmaNeural --force`。`content/audio/samples/` 里有 4 个候选音色的试听。生成需要联网，App 播放只读本地文件；文件缺失时退回浏览器自带语音。

## 奖励

- 竹子：每局游戏 1 + 星数，第一次满分再 +5；每日宝箱 10–20；每个徽章 +10；连续学习 3/7/14/30 天各有礼物。用来在「衣橱」给小熊猫换装（12 套，15–80 竹子）。
- 贴纸：一个词句累计答对 3 次收进贴纸册。
- 每日任务：每天按日期挑 3 个，全部完成可开宝箱。
- 数值都在 `web/src/lib/catalog.js` 和 `web/src/lib/rewards.js` 里改；进度存在浏览器 localStorage（`kids-english-progress-v1`、`kids-english-rewards`）。
- 界面图（装扮、徽章、宝箱、竹子）的提示词在 `art/ui/manifest.json`，用 `node scripts/gen_images.mjs ui` 生成。

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
