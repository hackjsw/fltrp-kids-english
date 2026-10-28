# 小熊猫学英语

外研版《新标准英语》（一年级起点）同步练习，给自家孩子用。规划见 [docs/PLAN.md](docs/PLAN.md)。

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

## 发音

发音是 `scripts/gen_audio.py` 用 edge-tts（微软神经语音，默认美音女孩声 en-US-AnaNeural，语速 -15%）预先生成的 MP3，放在 `content/audio/`。加了新词句后重新运行：

```bash
python -I scripts/gen_audio.py
```

换音色加 `--voice en-US-EmmaNeural --force`。`content/audio/samples/` 里有 4 个候选音色的试听。生成需要联网，App 播放只读本地文件；文件缺失时退回浏览器自带语音。

## 目录

- `scripts/content/1a.mjs`、`1b.mjs`：一年级上下册词句和每张图的画面描述（按课本整理）；1a 的 Module 1–2 直接写在 `content/books/1a/book.json` 里
- `content/books/{1a,1b}/book.json`：App 读取的教材内容，由 `node scripts/build_content.mjs 1a 1b` 生成
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
4. `python -I scripts/contact_sheet.py art/{book}/m3 -o textbooks/sheet.jpg` 拼预览图人工检查，画坏的删掉 PNG 重跑第 3 步。
5. `python -I scripts/optimize_images.py` 压成 WebP，`python -I scripts/gen_audio.py --book {book}` 生成发音。
