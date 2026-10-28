# 写 scripts/content/{book}.mjs 的规则

给 App「小熊猫学英语」整理外研版《新标准英语》（一年级起点）每册的词句。每册一个文件，导出一个对象，App 会从中生成配图（本地图像模型）、发音和 7 种小游戏（看图学、听音选图、泡泡、喂小熊猫、听音小火车、跟读、变声）。格式和写法参照已有的 `scripts/content/1b.mjs`，先读它。

## 来源

- 课本文字：`textbooks/{book}.txt`（PDF 抽出的文字，`===== PAGE n =====` 分页）。目录在 PAGE 4–5，书后 `Words and Expressions in Each Module` 是每个 Module 的词表（中文释义从这里取）。
- 每册 10 个 Module，每个 Module 2 个 Unit。Review Module 不收。
- Unit 标题用目录里的原文（直引号 `'`，不要用 `’`）。

## 每个 Unit 选 5–7 项

- 一部分是**单词/短语**（书后词表里该 Module 的黑体核心词），一部分是**课文原句**（该 Unit 的重点句型，一般就是 Unit 标题句和「Listen, point and find "..."」里的句子）。
- 句子尽量取课文原句；太长的取最短的完整分句，**不超过 10 个词**。不要自己编句子。
- 每一项都必须**能画成一张图**，而且同一个 Unit / Module 里的图要**一眼能区分**：游戏会让孩子听一句话，从 3–5 张同 Module 的图里选对的那张。抽象词（the, and, very）不收；时态差异（played vs play）画不出来的，选画面不同的句子。
- 中文翻译写给小学生看，简短自然。

## 每项格式

```js
['id', 'English text', '中文', 'image scene description', ['人物 key', ...], { same: ..., digits: true }]
```

- `id`：小写短横线，**整册唯一**（不同 Module 也不能重复；同一个词在两个 Module 都出现时换个 id，如 `apple`、`apples-m5`）。
- 画面描述（英文）：一句话说清画什么，主体明确，**不要写画风**（画风脚本会统一加）。不要出现文字/字母；数字类图片加 `{ digits: true }`。
- 课本主角只有这几个可以用 key 引用（会自动带参考图保证长相一致）：`daming`、`lingling`、`sam`、`amy`、`ms-smart`、`mascot`（小熊猫吉祥物）。其他人物（Tom、Ms Li、爸爸妈妈、Panpan 等）**不要写 key**，在描述里直接写外貌，如 `a plush boy with curly red hair`。
- 第 5 个元素是人物 key 数组，没有人物写 `[]`。
- `same`：同义组。两项画面或意思太像、不能互相当干扰项时，给它们同一个组名（字符串，或数组表示同时属于几组）。例：`hat` 和 `It's on my hat.`；`swimming` 和 `Let's go swimming!`；`big`（一头大猪）和 `pig`。宁可多标，不要让孩子遇到两张都对的图。

## 文件结构

```js
// 二年级上册 Module 1–10，格式见 AUTHORING.md
export default {
  id: '2a',
  title: '二年级上册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/2a.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    { id: 'm1', title: 'Module 1', units: [ { id: 'u1', title: "...", items: [ ... ] }, { id: 'u2', ... } ] },
    ...
  ],
}
```

册名：2a 二年级上册、2b 二年级下册、3a 三年级上册……6b 六年级下册。

## 写完自查

```bash
node scripts/build_content.mjs {book}
```

这会检查 id 重复并输出 `{book}: 10 modules, N items`。报错就改到通过。只改自己负责的 `scripts/content/{book}.mjs`，以及 build 生成的 `content/books/{book}/book.json` 和 `art/{book}/manifest.json`，其他文件不要动，不要 git commit。
