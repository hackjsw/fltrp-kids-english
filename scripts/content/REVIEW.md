# 检查生成的单词图

图片是按 `art/{book}/manifest.json` 用本地图像模型生成的原图，存在 `art/{book}/m*/{id}.png`。每张图对应 `content/books/{book}/book.json` 里的一项（同 Module 同 id）。

## 怎么看

```bash
python -I scripts/contact_sheet.py art/{book}/m1 art/{book}/m2 -o textbooks/review-{book}-m1m2.jpg --cols 7 --cell 150
```

一次拼 2 个 Module（约 25 张），用 Read 打开 jpg 看。每张图下面有 `m1/id` 标签，对照 book.json 里这一项的英文和 `scripts/content/{book}.mjs` 里的画面描述。

## 算画坏、要重画的

1. **画的不是这一项**：主体错了、少了关键东西（"two footballs" 画成橄榄球、"seven tigers" 只有 4 只、"under the desk" 画在桌上）。数量类的要数清楚。
2. **混进了吉祥物小熊猫**：没有引用 mascot 的图里出现红色小熊猫、或者别的动物长着小熊猫的脸/环纹尾巴/蓝色书包。
3. **课本主角长得不对**：Daming（黑短发、红 T 恤、蓝短裤）、Lingling（黑双马尾、粉色蝴蝶结、粉裙子）、Sam（金色短发、绿 T 恤、棕短裤）、Amy（棕色马尾、黄裙子）、Ms Smart（棕色卷短发、圆眼镜、浅蓝开衫）明显变了样。
4. **图里出现文字、字母**（数字类 `digits: true` 的图除外；图里能看清的数字要对）。
5. **同一个 Module 里两张图几乎一样**，孩子听音选图时分不清，而且它们没有被 `same` 分到同一组。这种情况优先**改 `same`** 让它们不互为干扰项；只有改 `same` 还不够（比如整个 Unit 都长一样）才重画。
6. 画面太小、太乱、主体看不清，或者明显不是毛绒玩具风格。

小瑕疵（背景透明/白底不统一、构图略偏）不用管。

## 发现问题后

- 在 `scripts/content/{book}.mjs` 里把这一项的画面描述改得更明确（写清数量、位置、"NOT ..."），需要时补 `same`。
- 删掉对应的 PNG：`rm art/{book}/m3/xxx.png`（以后统一重画会只补缺失的图）。
- 改完运行 `node scripts/build_content.mjs {book}` 确认通过。
- **不要**运行 `gen_images.mjs`（会和别的检查同时请求图像服务）。不要改其他册的文件，不要 git commit。

## 汇报

每册列出：删掉要重画的图（`m3/id`：问题一句话），只改了 `same` 的项，以及看过的总张数。
