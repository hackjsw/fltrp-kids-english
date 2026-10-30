// 单元里的玩法。scored 的玩法计星（每个最多 3 星），用于闯关解锁
export const GAMES = [
  { id: 'cards', name: '看图学', desc: '点卡片听发音', icon: 'cards' },
  { id: 'listen', name: '听音选图', desc: '听一听，选出对的图', icon: 'headphones', scored: true },
  { id: 'bubbles', name: '泡泡快快点', desc: '60 秒，戳中听到的泡泡', icon: 'bubbles', scored: true },
  { id: 'feed', name: '喂小熊猫', desc: '把听到的图拖给小熊猫', img: '/images/ui/mascot-hungry.webp', scored: true },
  { id: 'train', name: '听音小火车', desc: '按听到的顺序装车厢', img: '/images/ui/train-engine.webp', scored: true },
  { id: 'repeat', name: '跟我读', desc: '听完大声读出来', icon: 'parrot', scored: true },
  { id: 'voice', name: '魔法变声', desc: '读一读，变成小动物的声音', img: '/images/ui/fx-mic.webp' },
]

export const SCORED = GAMES.filter((g) => g.scored).map((g) => g.id)

// 上一关拿到这么多星，下一关解锁
export const UNLOCK_STARS = 3
