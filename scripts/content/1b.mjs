// 一年级下册 Module 1–10，格式同 1a.mjs
export default {
  id: '1b',
  title: '一年级下册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/1b.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: "He's a doctor.",
          items: [
            ['doctor', 'doctor', '医生', 'A friendly plush doctor (man) in a white coat with a stethoscope', [], { same: 'doctor' }],
            ['teacher', 'teacher', '教师', 'Ms Smart holding a book in front of a blank green blackboard', ['ms-smart'], { same: 'teacher' }],
            ['hes-a-doctor', "He's a doctor.", '他是一名医生。', 'A plush man doctor in a white coat with a stethoscope, smiling and waving', [], { same: 'doctor' }],
            ['shes-a-teacher', "She's a teacher.", '她是一名教师。', 'Ms Smart pointing at a blank green blackboard with a pointer stick', ['ms-smart'], { same: 'teacher' }],
            ['hes-a-boy', "He's a boy.", '他是男孩。', 'Daming standing proudly with hands on hips', ['daming']],
            ['shes-a-girl', "She's a girl.", '她是女孩。', 'Lingling standing and smiling sweetly with hands clasped', ['lingling']],
          ],
        },
        {
          id: 'u2',
          title: "She's a nurse.",
          items: [
            ['nurse', 'nurse', '护士', 'A friendly plush woman nurse in a light pink uniform and nurse cap, holding a clipboard', [], { same: 'nurse' }],
            ['driver', 'driver', '司机', 'A friendly plush bus driver man in a cap, sitting at the wheel of a small yellow bus', []],
            ['policeman', 'policeman', '警察', 'A friendly plush policeman in a dark blue uniform and police hat, waving', []],
            ['pupil', 'pupil', '小学生', 'Sam wearing a school backpack, walking happily to school', ['sam']],
            ['shes-a-nurse', "She's a nurse.", '她是一名护士。', 'A plush woman nurse in a pink uniform giving a teddy bear a plaster', [], { same: 'nurse' }],
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
          title: "Where's the bird?",
          items: [
            ['wheres-the-bird', "Where's the bird?", '小鸟在哪里？', 'Amy looking around with a hand above her eyes, searching, a plush question mark floating', ['amy']],
            ['in-the-hat', "It's in my hat.", '它在我的帽子里。', 'A small blue plush bird peeking out from INSIDE an upside-down straw hat', [], { same: 'hat-in' }],
            ['on-the-hat', "It's on my hat.", '它在我的帽子上。', 'A small blue plush bird sitting ON TOP of a straw hat', [], { same: 'hat-on' }],
            ['under-the-hat', "It's under my hat.", '它在我的帽子下面。', 'A small blue plush bird peeking out from UNDER the brim of a straw hat lying on the floor', [], { same: 'hat-under' }],
            ['hat', 'hat', '帽子', 'A single cute plush straw sun hat with a red ribbon', [], { same: ['hat-in', 'hat-on', 'hat-under'] }],
          ],
        },
        {
          id: 'u2',
          title: 'The toy car is under the bed.',
          items: [
            ['bed', 'bed', '床', 'A single cute plush small bed with a blue blanket and a pillow', []],
            ['toy-car', 'toy car', '玩具汽车', 'A single cute plush toy car, red, round shape', []],
            ['bear', 'bear', '熊', 'A single cute plush teddy bear, light brown, sitting', [], { same: ['bear-under', 'bear-on'] }],
            ['bear-under-bed', 'The bear is under the bed.', '小熊在床底下。', 'A small bed; a teddy bear is UNDER the bed, peeking out', [], { same: 'bear-under' }],
            ['bear-on-bed', 'The bear is on the bed.', '小熊在床上。', 'A small bed; a teddy bear is sitting ON the bed', [], { same: 'bear-on' }],
            ['cat-under-desk', 'The cat is under the desk.', '小猫在书桌底下。', 'A small school desk; a grey kitten is lying UNDER the desk', []],
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
          title: "Where's the orange cat?",
          items: [
            ['wheres-the-orange-cat', "Where's the orange cat?", '橙色的猫在哪里？', 'An orange kitten hiding under a small bed, only its tail and face showing', []],
            ['cat-on-bed', 'On the bed.', '在床上。', 'A white kitten curled up ON a small bed', []],
            ['i-dont-know', "I don't know!", '我不知道！', 'Lingling shrugging with both palms up and a puzzled face', ['lingling']],
            ['eleven', 'eleven', '十一', 'A big chunky plush toy shaped like the number 11, two digits side by side, teal felt, standing up', [], { digits: true }],
            ['twelve', 'twelve', '十二', 'A big chunky plush toy shaped like the number 12, two digits side by side, coral felt, standing up', [], { digits: true }],
          ],
        },
        {
          id: 'u2',
          title: 'How many green birds?',
          items: [
            ['tree', 'tree', '树', 'A single cute plush round green tree with a brown trunk', [], { same: 'tree' }],
            ['fish', 'fish', '鱼', 'A single cute plush orange fish with big eyes', []],
            ['so-many-birds', 'So many birds!', '这么多鸟！', 'A round plush tree full of many small colourful birds sitting on its branches', [], { same: 'tree' }],
            ['four-green-birds', 'Four green birds.', '四只绿色的鸟。', 'Exactly four small GREEN plush birds in a row on a branch', []],
            ['lets-count', "Let's count!", '我们来数一数吧！', 'Daming and Amy counting on their fingers together, looking up', ['daming', 'amy']],
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
          title: 'This is my head.',
          items: [
            ['head', 'head', '头', 'Sam patting the top of his head with both hands', ['sam']],
            ['face', 'face', '脸', 'Lingling framing her face with both hands, big smile', ['lingling']],
            ['nose', 'nose', '鼻子', 'Daming touching the tip of his nose with one finger', ['daming']],
            ['ear', 'ear', '耳朵', 'Amy cupping a hand behind her ear, listening', ['amy']],
            ['mouth', 'mouth', '嘴', 'Sam pointing at his own wide open smiling mouth', ['sam']],
            ['eye', 'eye', '眼睛', 'Lingling pointing at her own eye, the other eye winking', ['lingling']],
          ],
        },
        {
          id: 'u2',
          title: 'These are your eyes.',
          items: [
            ['leg', 'leg', '腿', 'Daming standing on one leg, pointing at the raised leg', ['daming']],
            ['hand', 'hand', '手', 'Amy holding up both open hands, palms out, fingers spread', ['amy']],
            ['feet', 'feet', '脚', 'Two cute plush bare feet, side by side, wiggling toes', []],
            ['body', 'body', '身体', 'The little red panda mascot stretching its whole body like a star, arms and legs wide', ['mascot']],
            ['these-are-your-eyes', 'These are your eyes.', '这些是你的眼睛。', 'A cute plush baby spider with eight big round eyes, smiling', []],
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
          title: "They're cows.",
          items: [
            ['cow', 'cow', '奶牛', 'A single cute plush black and white cow', [], { same: 'cow' }],
            ['pig', 'pig', '猪', 'A single cute plush pink pig', [], { same: 'pig' }],
            ['duck', 'duck', '鸭子', 'A single cute plush yellow duck', [], { same: 'duck' }],
            ['chicken', 'chicken', '鸡', 'A single cute plush white hen with a red comb', []],
            ['egg', 'egg', '鸡蛋', 'Three cute plush eggs in a little straw nest', []],
            ['farm', 'farm', '农场', 'A small cute plush farm: red barn, fence, green field, no animals', []],
            ['theyre-cows', "They're cows.", '它们是奶牛。', 'Two cute plush black and white cows standing side by side', [], { same: 'cow' }],
          ],
        },
        {
          id: 'u2',
          title: "It's thin.",
          items: [
            ['fat', 'fat', '胖的', 'A very round chubby plush black cat sitting', [], { same: 'fat' }],
            ['thin', 'thin', '瘦的', 'A very thin skinny tall plush pig standing', [], { same: ['thin', 'pig'] }],
            ['big', 'big', '大的', 'One huge round plush pink pig filling most of the picture, a tiny ladybug beside its foot to show how big it is', [], { same: ['big', 'pig'] }],
            ['little', 'little', '小的', 'One tiny little plush pink piglet, very small in the middle of a lot of empty white space, next to a big flower that towers over it', [], { same: ['little', 'pig'] }],
            ['fat-cat', 'Look at the black cat. It\'s very fat.', '看那只黑猫，它很胖。', 'A very round chubby plush black cat lying down, happy', [], { same: 'fat' }],
            ['six-baby-pigs', 'Six baby pigs.', '六只小猪。', 'Exactly six plush piglets, four pink and two black, in two rows of three, large enough to fill the whole picture', [], { same: 'pig' }],
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
          title: 'These snakes are short.',
          items: [
            ['snake', 'snake', '蛇', 'A single cute friendly plush green snake, coiled, smiling', [], { same: ['snake-long', 'snake-short'] }],
            ['elephant', 'elephant', '大象', 'A single cute plush grey elephant', [], { same: 'elephant' }],
            ['giraffe', 'giraffe', '长颈鹿', 'A single cute plush giraffe with a very long neck', [], { same: 'giraffe' }],
            ['tiger', 'tiger', '老虎', 'A single cute plush tiger, orange with black stripes', [], { same: 'tiger' }],
            ['zoo', 'zoo', '动物园', 'A small cute plush zoo entrance gate with animal shapes on top, trees behind, no letters', []],
            ['long-snake', 'These snakes are long.', '这些蛇很长。', 'Two very LONG plush green snakes stretched out across the image', [], { same: 'snake-long' }],
            ['short-snake', 'These snakes are short.', '这些蛇很短。', 'Two very SHORT stubby plush green snakes, tiny and round', [], { same: 'snake-short' }],
            ['tall-giraffe', 'The giraffes are tall.', '长颈鹿很高。', 'Two very TALL plush giraffes standing, necks reaching up', [], { same: 'giraffe' }],
          ],
        },
        {
          id: 'u2',
          title: "They're little and cute.",
          items: [
            ['horse', 'horse', '马', 'A single cute plush brown horse', [], { same: 'horse' }],
            ['strong', 'strong', '强壮的', 'A cute plush brown bear lifting a dumbbell over its head, very strong', []],
            ['cute', 'cute', '可爱的', 'A very cute tiny plush baby horse (foal) with big sparkly eyes', [], { same: 'horse' }],
            ['lion', 'lion', '狮子', 'A single cute plush lion with a big fluffy mane', [], { same: 'lion' }],
            ['little-and-cute', "They're little and cute.", '它们又小又可爱。', 'Two tiny cute plush baby horses (foals) side by side', [], { same: 'horse' }],
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
          title: 'There is a cat in the tree.',
          items: [
            ['cat-in-the-tree', 'There is a cat in the tree.', '树上有一只猫。', 'A small grey kitten sitting high up IN a round plush tree', []],
            ['elephant-under-tree', 'There is an elephant under the tree.', '树下有一头大象。', 'A plush grey elephant standing UNDER a round tree', [], { same: 'elephant' }],
            ['table', 'table', '桌子', 'A single cute plush round wooden table', []],
            ['policeman-over-there', 'There is a policeman over there.', '那边有一位警察。', 'A small plush policeman in blue uniform standing far away in the distance, waving', []],
            ['help-the-cat', "Let's help the cat.", '我们来帮助小猫吧。', 'Daming and Sam reaching up toward a kitten stuck in a tree', ['daming', 'sam']],
          ],
        },
        {
          id: 'u2',
          title: 'There are three brown monkeys.',
          items: [
            ['three-brown-monkeys', 'There are three brown monkeys.', '有三只棕色的猴子。', 'Exactly three brown plush monkeys sitting side by side', []],
            ['two-white-horses', 'There are two white horses.', '有两匹白马。', 'Exactly two WHITE plush horses on a light green background', []],
            ['seven-tigers', 'There are seven tigers.', '有七只老虎。', 'Exactly seven small cute plush tigers in two rows', [], { same: 'tiger' }],
            ['two-elephants', 'There are two elephants at the zoo.', '动物园里有两头大象。', 'Exactly two plush grey elephants side by side', [], { same: 'elephant' }],
            ['animal', 'animal', '动物', 'A group of cute plush animals together: a lion, an elephant, a monkey and a giraffe', [], { same: 'lion' }],
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
          title: "There's a pair of shorts under that duck.",
          items: [
            ['shirt', 'shirt', '衬衫', 'A single cute plush light blue shirt with buttons and a collar, laid flat', [], { same: 'shirt' }],
            ['shorts', 'shorts', '短裤', 'A single pair of cute plush green shorts, laid flat', [], { same: 'shorts' }],
            ['shoes', 'shoes', '鞋子', 'A single pair of cute plush red sneakers', [], { same: 'shoes' }],
            ['socks', 'socks', '短袜', 'A single pair of cute plush striped socks', []],
            ['shorts-under-duck', "There's a pair of shorts under that duck.", '那只鸭子下面有一条短裤。', 'A yellow plush duck sitting on top of a pair of green shorts', [], { same: 'shorts' }],
            ['lets-swim', "Let's swim!", '我们去游泳吧！', 'Sam and Daming in swimming trunks jumping into a blue pond', ['sam', 'daming'], { same: 'swim' }],
          ],
        },
        {
          id: 'u2',
          title: 'There are two footballs under my desk.',
          items: [
            ['football', 'football', '足球', 'A single cute plush black and white football (soccer ball)', [], { same: 'football' }],
            ['basketball', 'basketball', '篮球', 'A single cute plush orange basketball', [], { same: 'basketball' }],
            ['ping-pong', 'ping-pong', '乒乓球', 'A cute plush red ping-pong paddle and a small white ball', [], { same: 'pingpong' }],
            ['two-footballs', 'There are two footballs under my desk.', '我的书桌下面有两个足球。', 'A small school desk with exactly two round black and white soccer balls (classic pentagon pattern, NOT American footballs, NOT rugby balls) on the floor UNDER the desk', [], { same: 'football' }],
            ['dress', 'dress', '连衣裙', 'A single cute plush pink dress on a hanger', []],
            ['skirt', 'skirt', '短裙', 'A single cute plush yellow pleated skirt, laid flat', []],
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
          title: 'I like football.',
          items: [
            ['i-like-football', 'I like football.', '我喜欢足球。', 'Daming kicking a football happily', ['daming'], { same: 'football' }],
            ['i-like-basketball', 'I like basketball.', '我喜欢篮球。', 'Sam bouncing a basketball happily', ['sam'], { same: 'basketball' }],
            ['we-like-football', 'We like football, too.', '我们也喜欢足球。', 'Lingling and Amy holding a football together and cheering', ['lingling', 'amy'], { same: 'football' }],
            ['play-together', "Let's play together!", '我们一起玩吧！', 'Daming, Sam, Lingling and Amy holding hands in a circle, laughing', ['daming', 'sam', 'lingling', 'amy']],
            ['lions-are-big', 'Lions are big, cats are small.', '狮子大，猫小。', 'A big plush lion next to a tiny plush kitten', [], { same: 'lion' }],
          ],
        },
        {
          id: 'u2',
          title: "What's your favourite sport?",
          items: [
            ['favourite-sport', "What's your favourite sport?", '你最喜欢什么运动？', 'Amy asking Daming a question, a football, a basketball and a ping-pong paddle floating between them', ['amy', 'daming']],
            ['swimming', 'swimming', '游泳', 'Lingling swimming happily in blue water wearing goggles', ['lingling'], { same: 'swim' }],
            ['favourite-colour', "What's your favourite colour?", '你最喜欢什么颜色？', 'A plush painter palette with red, yellow, blue and green paint blobs', []],
            ['favourite-animal', "What's your favourite animal?", '你最喜欢什么动物？', 'A plush panda, a plush lion and a plush dog sitting together', []],
            ['meatball', 'meatball', '肉丸子', 'A cute plush bowl with three round brown meatballs', []],
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
          title: "Let's play football!",
          items: [
            ['lets-play-football', "Let's play football!", '我们踢足球吧！', 'Sam and Daming running after a football on green grass', ['sam', 'daming'], { same: 'football' }],
            ['lets-play-basketball', "Let's play basketball!", '我们打篮球吧！', 'Amy throwing a basketball toward a small hoop', ['amy'], { same: 'basketball' }],
            ['lets-play-ping-pong', "Let's play ping-pong!", '我们打乒乓球吧！', 'Lingling and Daming playing ping-pong at a small green table', ['lingling', 'daming'], { same: 'pingpong' }],
            ['lets-go-swimming', "Let's go swimming!", '我们去游泳吧！', 'Amy and Lingling in swimsuits with a ring float running toward a pool', ['amy', 'lingling'], { same: 'swim' }],
            ['good-idea', 'Good idea!', '好主意！', 'Daming with a bright plush light bulb glowing above his head, thumbs up', ['daming']],
            ['im-hot', "I'm hot.", '我很热。', 'Sam fanning himself with his hand, red cheeks, a big plush sun behind him', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: "Let's sing!",
          items: [
            ['lets-sing', "Let's sing!", '我们唱歌吧！', 'Lingling singing happily with plush music notes floating around her', ['lingling']],
            ['lets-dance', "Let's dance!", '我们跳舞吧！', 'Amy dancing and twirling in her yellow dress', ['amy']],
            ['im-tired', "I'm tired.", '我累了。', 'Daming yawning with sleepy eyes, sitting on the floor', ['daming']],
            ['lets-sit-down', "Let's sit down!", '我们坐下吧！', 'Sam and Amy sitting down on a soft plush bench, relaxing', ['sam', 'amy']],
            ['sing-and-dance', "Let's sing and dance!", '我们又唱又跳吧！', 'The little red panda mascot singing and dancing with music notes around', ['mascot']],
          ],
        },
      ],
    },
  ],
}
