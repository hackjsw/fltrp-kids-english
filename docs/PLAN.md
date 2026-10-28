# 外研版（一年级起点）小学英语学习 App 规划

## 前提

- 教材：外研社《新标准英语》一年级起点，1–6 年级共 12 册。
- 部署：本地 Docker，家里电脑或 NAS 上运行，孩子用平板/手机浏览器访问（可"添加到主屏幕"当 App 用）。
- 用途：自己孩子使用，不对外发布，可录入课本原文的词表和句子。

## 技术架构

| 部分 | 选型 | 说明 |
|---|---|---|
| 前端 | Vue 3 + Vite + PWA | 针对平板横屏和手机竖屏做适配，大按钮、少文字 |
| 后端 | Node.js (Fastify) + SQLite | 单用户场景，SQLite 足够，数据文件挂载到宿主机 |
| 发音音频 | Piper TTS（本地容器），可选导入课本 MP3 | 优先用课本原音频，没有的再用 TTS 补 |
| 跟读评分 | faster-whisper（本地容器）+ 文本比对打分 | 识别孩子读的内容，和目标单词/句子逐词比对，给 1–3 星 |
| 可选增强 | 讯飞/腾讯口语评测 API | 需要音素级纠音时再接，需要联网和 API Key |
| 图片 | 本地 Magpie 图像服务 | 统一风格批量生成，见下文 |

Docker Compose 服务：`web`（nginx 托管前端 + 反代）、`api`、`tts`、`asr`。数据卷：`data/`（SQLite、录音）、`content/`（教材内容、图片、音频）。

## 内容结构

```
Book（1A 一年级上册）
 └─ Module（Module 1）
     └─ Unit（Unit 1 / Unit 2）
         └─ Item { id, type: word|sentence|chant|dialog,
                   text, translation, image, audio }
```

内容以 YAML/JSON 文件存放在 `content/books/{book}/`，家长按课本录入词表和句子即可，题目自动生成。

## 功能（按期）

**第一期 MVP**：一年级上册前 2 个 Module
- 单词卡：图 + 发音，点击重听
- 听音选图：从同单元抽 3 个干扰图
- 听音选词：适合认字后使用，一年级可先隐藏
- 单词/句子跟读：录音 → 识别 → 星级 + 读错的词标红
- 闯关地图：每课一关，过关得星星
- 简版奖励：星星计数、连续打卡天数

**第二期**
- 补齐一年级上下册内容
- 儿歌（Chant）跟唱、课文逐句跟读
- 错题本 + 间隔重复复习
- 家长页：每日时长上限、学习记录

**第三期**
- 字母认读与看图拼词（二、三年级开始用）
- 情景对话角色扮演
- 扩展到更高年级

## 图片素材流程

1. 定吉祥物和统一风格提示词（本文件末尾记录最终选定版本）。
2. 按词表批量生成，1024×1024，存到 `content/images/{book}/{module}/{word}.png`。
3. `content/images/manifest.json` 记录每张图的单词、提示词、生成时间，便于重做和审核。
4. 按钮、背景、勋章、闯关地图用同一风格生成。

## 注意事项

- 录音只存本地，默认保留 30 天后自动清理。
- 单次学习 15 分钟提醒休息，每日上限可在家长页设置。

## 风格定稿

选定 **B 3D 毛绒**，参考图 `assets/style-samples/B-mascot.png`。

所有图共用的风格后缀（`scripts/style.json` 里同一份）：

> Soft 3D plush toy render, fluffy felt texture, pastel warm colors, smooth rounded cuddly forms, gentle soft studio lighting, simple composition with one clear subject, plain pure white background, centered, no text, no letters, no words.

- 吉祥物场景图把 `B-mascot.png` 作为参考图传入，保证小熊猫形象一致。
- 人物（Daming、Lingling、Sam、Amy、Ms Smart）各有一段固定外貌描述，见 `scripts/style.json`。

## 前期运行方式

前期不用 Docker，直接本地运行：`npm install` 后执行 `npm run dev`。
- 发音：浏览器 `speechSynthesis`（Windows/Edge 自带英文语音）。
- 跟读识别：浏览器 `SpeechRecognition`（Edge/Chrome，需要联网）。不支持的浏览器会退回到"录音 → 回放 → 自评"。
- Piper TTS、faster-whisper 留到上 Docker 时再接。
