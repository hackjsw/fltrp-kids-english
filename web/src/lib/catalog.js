// 奖励系统的静态配置：装扮、徽章、打卡礼物、每日任务

// 小熊猫装扮（整套换图，图在 content/images/ui/outfits/）
export const OUTFITS = [
  { id: 'default', name: '原来的样子', price: 0 },
  { id: 'scarf', name: '红围巾', price: 15 },
  { id: 'sunglasses', name: '酷酷墨镜', price: 20 },
  { id: 'chef', name: '小厨师', price: 25 },
  { id: 'painter', name: '小画家', price: 30 },
  { id: 'football', name: '足球小将', price: 30 },
  { id: 'doctor', name: '小医生', price: 40 },
  { id: 'pirate', name: '小海盗', price: 45 },
  { id: 'police', name: '小警察', price: 45 },
  { id: 'wizard', name: '小魔法师', price: 60 },
  { id: 'astronaut', name: '宇航员', price: 70 },
  { id: 'knight', name: '小骑士', price: 70 },
  { id: 'king', name: '小国王', price: 80 },
].map((o) => ({ ...o, img: `/images/ui/outfits/${o.id}.webp` }))

// 徽章：test 收到当前统计（见 rewards.js 的 context）
export const BADGE_BAMBOO = 10
export const BADGES = [
  { id: 'first', name: '初次上路', desc: '完成第一个游戏', test: (c) => c.games >= 1 },
  { id: 'perfect', name: '满分小星星', desc: '第一次拿到 3 颗星', test: (c) => c.perfect >= 1 },
  { id: 'streak3', name: '坚持 3 天', desc: '连续学习 3 天', test: (c) => c.streak >= 3 },
  { id: 'streak7', name: '坚持 7 天', desc: '连续学习 7 天', test: (c) => c.streak >= 7 },
  { id: 'streak30', name: '坚持 30 天', desc: '连续学习 30 天', test: (c) => c.streak >= 30 },
  { id: 'sticker50', name: '贴纸达人', desc: '收集 50 张贴纸', test: (c) => c.stickers >= 50 },
  { id: 'sticker200', name: '贴纸大王', desc: '收集 200 张贴纸', test: (c) => c.stickers >= 200 },
  { id: 'speaker', name: '小小播音员', desc: '跟读 50 句', test: (c) => c.repeats >= 50 },
  { id: 'chest10', name: '寻宝高手', desc: '打开 10 个宝箱', test: (c) => c.chests >= 10 },
  { id: 'bookclear', name: '一册通关', desc: '打开一册书的全部关卡', test: (c) => c.books >= 1 },
  { id: 'fashion', name: '时尚达人', desc: '拥有 5 套新装扮', test: (c) => c.outfits >= 5 },
]

// 连续学习礼物（每档只领一次）
export const STREAK_GIFTS = [
  { days: 3, bamboo: 10 },
  { days: 7, bamboo: 25 },
  { days: 14, bamboo: 40 },
  { days: 30, bamboo: 80 },
]

// 每日任务模板：每天按日期挑 3 个 stat 不同的
export const QUESTS = [
  { id: 'games2', text: '完成 2 个游戏', icon: '🎮', goal: 2, stat: 'games' },
  { id: 'games3', text: '完成 3 个游戏', icon: '🎮', goal: 3, stat: 'games' },
  { id: 'stars5', text: '拿到 5 颗星', icon: '⭐', goal: 5, stat: 'stars' },
  { id: 'stars8', text: '拿到 8 颗星', icon: '⭐', goal: 8, stat: 'stars' },
  { id: 'correct15', text: '答对 15 题', icon: '✅', goal: 15, stat: 'correct' },
  { id: 'correct25', text: '答对 25 题', icon: '✅', goal: 25, stat: 'correct' },
  { id: 'repeat5', text: '跟读 5 句', icon: '🎤', goal: 5, stat: 'repeats' },
  { id: 'perfect1', text: '拿一次满分', icon: '🌟', goal: 1, stat: 'perfect' },
  { id: 'sticker1', text: '收集 1 张新贴纸', icon: '🏷️', goal: 1, stat: 'stickers' },
  { id: 'cards10', text: '看图学 10 张卡', icon: '🃏', goal: 10, stat: 'cards' },
]
