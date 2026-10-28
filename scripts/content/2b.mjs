// 二年级下册 Module 1–10，格式见 AUTHORING.md
export default {
  id: '2b',
  title: '二年级下册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/2b.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: "What's the weather like?",
          items: [
            ['sunny', 'sunny', '晴朗的', 'A big bright smiling plush sun in a clear blue sky', [], { same: 'sunny' }],
            ['windy', 'windy', '刮风的', 'Round trees bending in a strong wind, leaves blowing through the air', [], { same: 'windy' }],
            ['cap', 'cap', '帽子', 'A single cute plush blue baseball cap', [], { same: 'cap' }],
            ['sofa', 'sofa', '沙发', 'A single cute plush red sofa with two cushions', [], { same: 'sofa' }],
            ['hot-and-sunny', "It's hot and sunny.", '天气又热又晴朗。', 'Sam and Amy wearing caps under a big hot bright sun, wiping their foreheads', ['sam', 'amy'], { same: ['sunny', 'cap'] }],
            ['oh-no-my-cap', 'Oh no! My cap!', '哎呀！我的帽子！', 'Amy reaching up as the wind blows her blue cap away into the air', ['amy'], { same: ['windy', 'cap'] }],
            ['its-raining-now', "It's raining now!", '现在下雨了！', 'Amy and Sam standing in the rain, raindrops falling from grey clouds', ['amy', 'sam']],
          ],
        },
        {
          id: 'u2',
          title: 'I like swimming.',
          items: [
            ['it-snows', "It's cold and it snows.", '天气寒冷，还下雪。', 'Snow falling on snowy trees and a little snowman, a cold winter day', [], { same: 'snow' }],
            ['i-like-skiing', 'I like skiing.', '我喜欢滑雪。', 'Daming skiing down a snowy slope with ski poles', ['daming'], { same: 'snow' }],
            ['i-like-swimming', 'I like swimming.', '我喜欢游泳。', 'Lingling swimming happily in a blue pool on a hot sunny day', ['lingling'], { same: 'swim' }],
            ['i-like-running', 'I like running.', '我喜欢跑步。', 'Sam running fast through a park with orange autumn leaves falling', ['sam']],
            ['i-like-flying-kites', 'I like flying kites.', '我喜欢放风筝。', 'Amy flying a colourful kite in a spring park with blossoming trees', ['amy'], { same: 'kite' }],
            ['its-warm', "It's warm.", '天气暖和。', 'A gentle warm spring meadow: green grass with little flowers and a tree with pink blossoms filling most of the picture, only a small soft sun in the corner; NOT just a big sun on its own', [], { same: ['kite', 'sunny'] }],
          ],
        },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2',
      units: [
        {
          id: 'u1',
          title: "She's listening to the radio.",
          items: [
            ['radio', 'radio', '收音机', 'A single cute plush old-style radio with a round dial and an antenna', [], { same: 'radio' }],
            ['newspaper', 'newspaper', '报纸', 'A single cute plush folded newspaper with grey blocks and small pictures instead of text', [], { same: 'newspaper' }],
            ['camera', 'camera', '照相机', 'A single cute plush camera', [], { same: 'camera' }],
            ['listening-to-the-radio', "She's listening to the radio.", '她正在听收音机。', 'A plush woman with long brown hair sitting in an armchair listening to a radio, music notes floating out', [], { same: 'radio' }],
            ['reading-a-newspaper', "He's reading a newspaper.", '他正在看报纸。', 'A plush man with short brown hair and glasses sitting and reading a big newspaper', [], { same: 'newspaper' }],
            ['playing-with-his-train', "Tom's playing with his train.", 'Tom正在玩他的火车。', 'A small plush boy with short curly brown hair sitting on the floor playing with a toy train', []],
            ['smile-please', 'Smile, please!', '请笑一笑！', 'Sam holding up a camera to take a photo of Amy, who is smiling', ['sam', 'amy'], { same: 'camera' }],
          ],
        },
        {
          id: 'u2',
          title: "I'm drawing a picture.",
          items: [
            ['letter', 'letter', '信', 'A single cute plush envelope with a red heart sticker', [], { same: 'letter' }],
            ['drawing-a-panda', "I'm drawing a panda.", '我正在画一只熊猫。', 'Daming drawing a panda on a big sheet of paper with crayons', ['daming'], { same: 'draw' }],
            ['writing-a-letter', "I'm writing a letter.", '我正在写信。', 'A plush girl with curly red hair sitting at a desk writing a letter with a pencil, an envelope beside her', [], { same: 'letter' }],
            ['colouring-the-picture', "Now, I'm colouring the picture.", '现在我正在给图画涂色。', 'A plush girl with curly red hair colouring a flower picture with bright crayons', [], { same: 'draw' }],
            ['playing-the-piano', "She's playing the piano.", '她正在弹钢琴。', 'Amy playing a black piano happily, music notes floating', ['amy']],
            ['my-father-is-eating', 'My father is eating.', '我爸爸正在吃东西。', 'A plush man with short black hair eating a bowl of noodles with chopsticks', []],
          ],
        },
      ],
    },
    {
      id: 'm3',
      title: 'Module 3',
      units: [
        {
          id: 'u1',
          title: "Sam isn't tidying his room.",
          items: [
            ['homework', 'homework', '家庭作业', 'A single cute plush exercise book lying open with a pencil on it', [], { same: 'homework' }],
            ['card', 'card', '贺卡', 'A single cute plush birthday card with a heart and a cake on the front', [], { same: 'card' }],
            ['isnt-tidying-his-room', "Sam isn't tidying his room.", 'Sam没有在整理房间。', 'Sam sitting on the floor of a very messy bedroom with toys and clothes everywhere', ['sam'], { same: 'room' }],
            ['tidy-your-room', 'Tidy your room!', '整理你的房间！', 'Amy putting toys neatly into a box in her bedroom', ['amy'], { same: 'room' }],
            ['doing-his-homework', "He's doing his homework.", '他正在做作业。', 'Daming sitting at a desk writing in an exercise book', ['daming'], { same: 'homework' }],
            ['hes-sleeping', "He's sleeping.", '他正在睡觉。', 'Sam sleeping with his head on his desk, small sleepy bubbles floating above him', ['sam']],
            ['happy-birthday-mum', 'Happy birthday!', '生日快乐！', 'Sam giving a birthday card to a smiling plush woman with long brown hair', ['sam'], { same: 'card' }],
          ],
        },
        {
          id: 'u2',
          title: 'Are you doing your homework?',
          items: [
            ['flower', 'flower', '花', 'A single cute plush red flower with green leaves', [], { same: 'flower' }],
            ['are-you-doing-your-homework', 'Are you doing your homework?', '你在做作业吗？', 'Lingling writing in an exercise book at her desk, looking up', ['lingling'], { same: 'homework' }],
            ['picture-of-flowers', "I'm drawing a picture of flowers.", '我在画一幅花的画。', 'Amy at her desk drawing colourful flowers on a sheet of paper', ['amy'], { same: 'flower' }],
            ['listening-to-music', 'Are you listening to music?', '你在听音乐吗？', 'Daming wearing headphones with music notes around his head', ['daming']],
            ['reading-a-book', 'Are you reading a book?', '你在看书吗？', 'Lingling sitting on her bed reading a picture book', ['lingling']],
            ['watching-tv', 'Are you watching TV?', '你在看电视吗？', 'Sam sitting on a sofa watching a TV set; the TV with a glowing screen is clearly visible in front of him, NOT just a remote control', ['sam']],
          ],
        },
      ],
    },
    {
      id: 'm4',
      title: 'Module 4',
      units: [
        {
          id: 'u1',
          title: 'What are you doing?',
          items: [
            ['lingling-is-calling-amy', 'Lingling is calling Amy.', '玲玲在给Amy打电话。', 'Lingling holding a phone to her ear, smiling', ['lingling'], { same: 'phone' }],
            ['are-you-drinking', 'Are you drinking?', '你在喝东西吗？', 'Amy drinking a glass of orange juice through a straw', ['amy']],
            ['im-swimming', "I'm swimming.", '我在游泳。', 'Amy swimming in a blue pool, splashing', ['amy']],
            ['are-you-dancing', 'Are you dancing?', '你在跳舞吗？', 'Amy dancing and twirling', ['amy']],
            ['are-you-eating', 'Are you eating?', '你在吃东西吗？', 'Amy eating a sandwich', ['amy']],
            ['im-talking-to-you', "I'm talking to you!", '我在和你说话！', 'Amy talking on a phone, laughing', ['amy'], { same: 'phone' }],
            ['what-noise', "What's that noise?", '那是什么声音？', 'A small plush boy with short curly brown hair playing with a loud toy train, plush sound waves coming from it', []],
          ],
        },
        {
          id: 'u2',
          title: "What's he doing?",
          items: [
            ['hes-eating', "He's eating.", '他在吃东西。', 'A plush boy with short black hair eating a big red apple', []],
            ['hes-running', "He's running.", '他在跑步。', 'A plush boy with short black hair running fast', []],
            ['five-stones', "They're playing five-stones.", '她们在玩抓石子游戏。', 'Lingling and Amy sitting on the ground playing with five small round stones', ['lingling', 'amy']],
            ['behind-the-tree', "He's behind the tree.", '他在树后面。', 'Sam hiding behind a round tree trunk, peeking out', ['sam'], { same: 'hide' }],
            ['hide-and-seek', "He's playing hide-and-seek with me.", '他在和我玩捉迷藏。', 'Daming covering his eyes and counting while Sam hides behind a tree', ['daming', 'sam'], { same: 'hide' }],
            ['put-on-your-shoes', 'Please put on your shoes!', '请穿上你的鞋！', 'A plush boy with short black hair hurrying to put on his shoes', []],
          ],
        },
      ],
    },
    {
      id: 'm5',
      title: 'Module 5',
      units: [
        {
          id: 'u1',
          title: 'Lingling is skipping.',
          items: [
            ['lingling-is-skipping', 'Lingling is skipping.', '玲玲在跳绳。', 'Lingling jumping over a skipping rope', ['lingling'], { same: 'skip' }],
            ['sad', 'sad', '伤心的', 'A sad plush girl with two short braids sitting alone on a bench, a tear on her cheek', []],
            ['clapping-games', 'Those girls are playing clapping games.', '那些女孩在玩拍手游戏。', 'Two plush girls facing each other and clapping hands together', [], { same: 'clap' }],
            ['daming-and-sam-hide-and-seek', 'Daming and Sam are playing hide-and-seek.', '大明和Sam在玩捉迷藏。', 'Daming hiding behind a bush while Sam looks for him', ['daming', 'sam']],
            ['opening-the-door', "I'm opening the door.", '我在开门。', 'The little red panda mascot opening a wooden door', ['mascot']],
            ['hurry-up', "Hurry up! Don't be late!", '快点！别迟到！', 'A plush boy with short black hair running fast with his school bag, a big round clock behind him', []],
          ],
        },
        {
          id: 'u2',
          title: 'What are the kids playing?',
          items: [
            ['playing-catch', "They're playing catch.", '他们在玩追人游戏。', 'Kids chasing each other in a school playground', [], { same: 'catch' }],
            ['the-girls-are-running', 'The girls are running.', '女孩们在跑。', 'Two plush girls running away and laughing', [], { same: 'catch' }],
            ['boys-are-catching-them', 'The boys are catching them.', '男孩们在抓她们。', 'Two plush boys chasing two plush girls with arms out to catch them', [], { same: 'catch' }],
            ['some-are-skipping', 'Some are skipping.', '有些在跳绳。', 'Three plush children jumping skipping ropes in a playground', [], { same: 'skip' }],
            ['football-match', 'Some are playing football together in a match.', '有些在一起踢足球比赛。', 'Plush children playing a football match on a school field', []],
            ['can-i-play', 'Can I play with them?', '我能和他们一起玩吗？', 'The little red panda mascot standing at the edge of a school playground, looking hopefully at three plush children who are playing ball together in the background; the children must be clearly visible, NOT the mascot alone', ['mascot']],
          ],
        },
      ],
    },
    {
      id: 'm6',
      title: 'Module 6',
      units: [
        {
          id: 'u1',
          title: 'I usually play basketball.',
          items: [
            ['usually-play-basketball', 'On Sundays, I usually play basketball.', '星期天我通常打篮球。', 'Daming playing basketball on an outdoor court', ['daming']],
            ['hes-ill', "He's in bed. He's ill.", '他躺在床上，他病了。', 'Daming lying in bed with a thermometer in his mouth and a red nose', ['daming']],
            ['usually-ride-my-bike', 'I usually ride my bike.', '我通常骑自行车。', 'Daming riding a red bicycle along a path', ['daming'], { same: 'bike' }],
            ['usually-do-my-homework', 'I usually do my homework.', '我通常做作业。', 'Daming sitting at his desk doing homework in an exercise book', ['daming']],
            ['go-home-at-four', 'I usually go home at four.', '我通常四点回家。', 'A plush boy with a school bag walking up to a house, a big round clock showing 4 o\'clock', [], { digits: true }],
            ['youre-reading-a-book', "You're reading a book.", '你在看书。', 'Sam sitting on a sofa reading a book, his bicycle parked behind him', ['sam'], { same: 'bike' }],
          ],
        },
        {
          id: 'u2',
          title: 'My grandma usually cooks.',
          items: [
            ['kitchen', 'kitchen', '厨房', 'A cute plush kitchen with a stove, pots and a fridge, no people', [], { same: 'cook' }],
            ['grandma-cooks', 'My grandma usually cooks.', '我奶奶通常做饭。', 'A plush grandma with grey hair in a bun cooking at a stove with a pan', [], { same: 'cook' }],
            ['go-shopping', 'go shopping', '去购物', 'A plush woman pushing a shopping trolley full of food', [], { same: 'shop' }],
            ['im-cooking', "I'm in the kitchen and I'm cooking.", '我在厨房里做饭。', 'A plush girl with a black ponytail in an apron stirring a pot in the kitchen', [], { same: 'cook' }],
            ['father-goes-shopping', 'My father is going shopping.', '我爸爸正在去购物。', 'A plush man with short black hair carrying shopping bags out of a shop', [], { same: 'shop' }],
            ['grandmas-birthday', "Today is Grandma's birthday!", '今天是奶奶的生日！', 'A plush grandma with grey hair smiling in front of a birthday cake with candles', []],
          ],
        },
      ],
    },
    {
      id: 'm7',
      title: 'Module 7',
      units: [
        {
          id: 'u1',
          title: "It's Children's Day today.",
          items: [
            ['childrens-day', "It's Children's Day today.", '今天是儿童节。', 'Happy plush children holding balloons and flowers at a colourful school celebration', []],
            ['doing-a-play', 'Daming is doing a play with some children.', '大明和一些孩子在演戏。', 'Daming in a costume acting on a small stage with two other children', ['daming']],
            ['singing-a-song', 'Lingling is singing a song.', '玲玲在唱歌。', 'Lingling singing on a stage, music notes floating', ['lingling']],
            ['amy-is-dancing', 'Amy is dancing.', 'Amy在跳舞。', 'Amy dancing on a stage, twirling in her dress', ['amy']],
            ['saying-a-poem', 'Sam is saying a poem.', 'Sam在朗诵诗歌。', 'Sam standing on a stage reciting with one hand on his chest', ['sam']],
            ['dragon-dance', 'Some children are doing a dragon dance.', '一些孩子在舞龙。', 'Children holding up a long colourful Chinese dragon on poles, dancing', []],
          ],
        },
        {
          id: 'u2',
          title: "We're having a picnic.",
          items: [
            ['picnic', 'picnic', '野餐', 'A picnic blanket with a basket, sandwiches and fruit on the grass, no people', [], { same: 'picnic' }],
            ['beach', 'beach', '海滩', 'A cute plush sunny beach with sand, blue sea and a beach umbrella, no people', [], { same: 'beach' }],
            ['having-a-picnic', "We're having a picnic.", '我们在野餐。', 'A plush family sitting on a picnic blanket on a sunny beach, eating', [], { same: ['picnic', 'beach'] }],
            ['flying-a-kite', 'My father is flying a kite.', '我爸爸在放风筝。', 'A plush man with short black hair flying a kite on the beach', []],
            ['grandma-is-sleeping', 'My grandma is sleeping.', '我奶奶在睡觉。', 'A plush grandma with grey hair asleep in a beach chair', []],
            ['lions-are-eating', "They're eating.", '它们在吃东西。', 'Two cute plush lions eating from a big bowl', []],
          ],
        },
      ],
    },
    {
      id: 'm8',
      title: 'Module 8',
      units: [
        {
          id: 'u1',
          title: 'The train is going up a hill.',
          items: [
            ['station', 'station', '车站', 'A cute plush train station with a platform and a roof, no train', [], { same: 'station' }],
            ['hospital', 'hospital', '医院', 'A cute plush white hospital building with a red cross on it', [], { same: 'hospital' }],
            ['going-up-a-hill', 'The train is going up a hill.', '火车在上山。', 'A red toy train climbing UP a green hill, front of the train pointing up the slope', [], { same: 'up' }],
            ['going-down-a-hill', "Now, it's going down a hill.", '现在火车在下山。', 'A red toy train rolling DOWN a green hill, front of the train pointing down the slope', [], { same: 'down' }],
            ['going-past-a-hospital', "It's going past a hospital.", '火车正经过一家医院。', 'A red toy train passing in front of a white hospital building with a red cross', [], { same: 'hospital' }],
            ['stopping-at-the-station', "Now, it's stopping at the station.", '现在火车正在进站停车。', 'A red toy train standing still beside a station platform with a roof and a bench; the station building and platform must be clearly visible, NOT just the train alone', [], { same: 'station' }],
          ],
        },
        {
          id: 'u2',
          title: 'The horse is turning around.',
          items: [
            ['turning-around', 'The horse is turning around.', '马在转身。', 'A cute plush brown horse standing on the spot with its body bent into a U-shape, its head turned all the way back to look at its own tail, a big curved circular arrow around it; NOT running or galloping', []],
            ['horse-is-jumping', 'The horse is jumping.', '马在跳。', 'A cute plush brown horse jumping high over a small fence', []],
            ['horse-is-running', 'The horse is running.', '马在跑。', 'A cute plush brown horse galloping fast across a green field', []],
            ['horse-coming-back', 'The horse is coming back.', '马回来了。', 'A cute plush brown horse trotting toward a smiling plush girl with short black hair who is waiting with open arms at a wooden farm gate; the girl and the gate must be clearly visible, NOT the horse alone', []],
            ['touching-the-sky', "We're touching the sky.", '我们摸到了天空。', 'Lingling and Amy standing on tiptoe with both arms stretched straight up as high as they can, fingertips reaching into a blue sky with fluffy white clouds above them; NOT waving', ['lingling', 'amy']],
            ['touching-the-ground', "We're touching the ground.", '我们摸到了地面。', 'Daming and Sam bending down and touching the grass with both hands', ['daming', 'sam']],
          ],
        },
      ],
    },
    {
      id: 'm9',
      title: 'Module 9',
      units: [
        {
          id: 'u1',
          title: 'Turn left!',
          items: [
            ['turn-left', 'Turn left!', '向左转！', 'Sam at a crossroads turning to HIS LEFT, a big curved arrow pointing left', ['sam'], { same: 'left' }],
            ['turn-right', 'Turn right!', '向右转！', 'Sam at a crossroads turning to HIS RIGHT, a big curved arrow pointing right', ['sam'], { same: 'right' }],
            ['go-straight-on', 'Go straight on!', '直走！', 'Sam walking straight ahead along a road, a big straight arrow pointing forward', ['sam'], { same: 'straight' }],
            ['road', 'road', '路', 'A cute plush road with trees on both sides, no people', []],
            ['excuse-me', "Excuse me. Where's Xihu Road?", '劳驾，西湖路在哪里？', 'Sam politely asking a plush policeman in a blue uniform for the way', ['sam']],
            ['im-lost', "Daming, I'm lost!", '大明，我迷路了！', 'Sam standing alone at a crossroads, scratching his head and looking lost', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: 'Where do you live?',
          items: [
            ['factory', 'factory', '工厂', 'A cute plush factory building with chimneys puffing white smoke', [], { same: 'factory' }],
            ['go-past-the-factory', 'You go past the factory.', '你经过工厂。', 'A plush girl with a black ponytail walking past a factory with chimneys', [], { same: 'factory' }],
            ['im-going-home', "I'm going home.", '我要回家。', 'A plush girl with a black ponytail and a school bag walking along a path toward the front door of her cosy house, waving; the house must be clearly visible, NOT a plain background', []],
            ['go-out-of-the-school', 'Go out of the school.', '走出学校。', 'A plush girl with a black ponytail walking out through an open school gate, a school building behind her; the gate and the school must be clearly visible, NOT a plain background', []],
            ['i-live-on-the-hill', 'I live on the hill.', '我住在山上。', 'A cute plush white goat standing on top of a green hill', []],
            ['i-live-at-the-zoo', 'I live at the zoo.', '我住在动物园。', 'A cute plush panda sitting happily inside the zoo next to bamboo', []],
          ],
        },
      ],
    },
    {
      id: 'm10',
      title: 'Module 10',
      units: [
        {
          id: 'u1',
          title: "It's next to the park.",
          items: [
            ['supermarket', 'supermarket', '超市', 'A cute plush supermarket building with a shopping trolley outside', [], { same: 'supermarket' }],
            ['taxi', 'taxi', '出租车', 'A single cute plush yellow taxi car', [], { same: 'taxi' }],
            ['next-to-the-park', "It's next to the park.", '它在公园旁边。', 'A plush supermarket building right next to a green park with trees', [], { same: 'supermarket' }],
            ['in-front-of-the-school', "It's in front of the school.", '它在学校前面。', 'A zoo gate with animal shapes standing in front of a school building', []],
            ['im-a-taxi-driver', "I'm a taxi driver!", '我是出租车司机！', 'A plush young man with short black hair standing proudly beside a yellow taxi', [], { same: 'taxi' }],
            ['turn-back', 'Turn back.', '往回走。', 'A plush boy turning around to walk back the way he came, a U-shaped arrow behind him', []],
            ['nice-to-meet-you', 'Nice to meet you.', '很高兴见到你。', 'Sam shaking hands with a plush young man with short black hair', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: "He's helping a child.",
          items: [
            ['cinema', 'cinema', '电影院', 'A cute plush cinema building with a big film reel on the roof', [], { same: 'cinema' }],
            ['helping-a-child', "I'm helping a child.", '我在帮助一个孩子。', 'A plush young man with short black hair kneeling to comfort a little crying girl', []],
            ['mother-in-front-of-cinema', 'Her mother, Mrs White, is in front of the cinema!', '她妈妈在电影院前面！', 'A plush woman with long blonde hair standing in front of a cinema building with a big film reel on its roof, looking around; the cinema must be clearly visible behind her, NOT a plain background', [], { same: 'cinema' }],
            ['a-car-is-coming', 'A car is coming.', '一辆车开过来了。', 'A small red car driving along a street toward the viewer', []],
            ['look-left-look-right', 'Look left, look right.', '向左看，向右看。', 'Daming standing at the edge of the road turning his head to look both ways', ['daming']],
            ['lets-cross-now', "Let's cross now.", '我们现在过马路吧。', 'Daming and Lingling holding hands and crossing the road on a zebra crossing', ['daming', 'lingling']],
          ],
        },
      ],
    },
  ],
}
