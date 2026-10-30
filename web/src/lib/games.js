// 单元里的玩法。scored 的玩法计星（每个最多 3 星），用于闯关解锁
import { canOrder } from './order.js'

export const GAMES = [
  { id: 'cards', name: '看图学', desc: '点卡片听发音', icon: 'cards' },
  { id: 'listen', name: '听音选图', desc: '听一听，选出对的图', icon: 'headphones', scored: true },
  { id: 'bubbles', name: '泡泡快快点', desc: '60 秒，戳中听到的泡泡', icon: 'bubbles', scored: true },
  { id: 'feed', name: '喂小熊猫', desc: '把听到的图拖给小熊猫', img: '/images/ui/mascot-hungry.webp', scored: true },
  { id: 'train', name: '听音小火车', desc: '按听到的顺序装车厢', img: '/images/ui/train-engine.webp', scored: true },
  { id: 'repeat', name: '跟我读', desc: '听完大声读出来', icon: 'parrot', scored: true },
  // 三年级起、单元里至少有两句能排的句子才出现；不算闯关星星
  { id: 'order', name: '排句子', desc: '把词块排成一句话', icon: 'blocks', when: (grade, items) => grade >= 3 && items.filter(canOrder).length >= 2 },
  { id: 'voice', name: '魔法变声', desc: '读一读，变成小动物的声音', img: '/images/ui/fx-mic.webp' },
]

export const SCORED = GAMES.filter((g) => g.scored).map((g) => g.id)

// 这个单元能玩的玩法
export const gamesFor = (grade, items) => GAMES.filter((g) => !g.when || g.when(grade, items))

// 上一关拿到这么多星，下一关解锁
export const UNLOCK_STARS = 3

// 难度按年级：低年级图少、泡泡慢、火车短；三年级起有看英文选图
export function level(grade) {
  const low = grade <= 2
  return {
    options: grade <= 1 ? 2 : grade <= 4 ? 3 : 4, // 听选、错题复习的图片数
    foods: grade <= 1 ? 2 : 3, // 喂熊猫的食物数（手机上一排最多放 3 个）
    readEvery: grade >= 5 ? 2 : grade >= 3 ? 3 : 0, // 每几题有一题看英文选图，0 = 没有
    bubbles: low
      ? { duration: 60, spawnMs: 1600, max: 4, rise: [9, 11.5], targetRate: 0.4, stars: [1, 5, 8] }
      : { duration: 60, spawnMs: 1300, max: 5, rise: [7.5, 9.5], targetRate: 0.3, stars: [1, 6, 10] },
    train: low ? { plan: [2, 2, 2, 3], choices: 4 } : grade <= 4 ? { plan: [2, 3, 3, 3], choices: 5 } : { plan: [3, 3, 3, 3], choices: 6 },
  }
}
