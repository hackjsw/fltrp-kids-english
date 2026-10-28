// 三年级上册 Module 1–10，格式见 AUTHORING.md
export default {
  id: '3a',
  title: '三年级上册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/3a.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: 'Do you use chopsticks in the UK?',
          items: [
            ['chopsticks', 'chopsticks', '筷子', 'A pair of wooden chopsticks resting across a small empty bowl', [], { same: 'chopsticks' }],
            ['knife-and-fork', 'a knife and fork', '一副刀叉', 'A silver knife and fork lying side by side on a folded napkin', [], { same: 'knife-fork' }],
            ['rice', 'rice', '米饭', 'A small bowl full of white rice', [], { same: 'rice' }],
            ['noodles', 'noodles', '面条', 'A big bowl of noodles with a few green vegetables on top', [], { same: 'noodles' }],
            ['use-chopsticks-uk', 'Do you use chopsticks in the UK?', '你们在英国用筷子吗？', 'Daming holding up a pair of chopsticks and asking Sam, who looks puzzled', ['daming', 'sam'], { same: 'chopsticks' }],
            ['we-use-knife-and-fork', 'We use a knife and fork.', '我们用刀叉。', 'Sam at a table cutting food on a plate with a knife and fork', ['sam'], { same: 'knife-fork' }],
            ['im-hungry', "I'm hungry.", '我饿了。', 'Sam rubbing his tummy with a hungry face, looking at an empty plate', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: "I'm eating hamburgers and chips.",
          items: [
            ['hamburger', 'hamburger', '汉堡包', 'A single big hamburger with lettuce, cheese and a bun', [], { same: 'hamburger' }],
            ['chips', 'chips', '炸薯条', 'A red paper carton full of golden chips', [], { same: 'chips' }],
            ['fast-food', 'fast food', '快餐', 'A tray with a hamburger, a carton of chips and a cup of drink', [], { same: ['hamburger', 'chips'] }],
            ['eating-hamburgers-chips', "I'm eating hamburgers and chips.", '我正在吃汉堡包和薯条。', 'Amy eating a hamburger, a carton of chips in front of her', ['amy'], { same: ['hamburger', 'chips'] }],
            ['eating-grass', "I'm eating grass.", '我正在吃草。', 'A white sheep happily munching green grass in a field', [], { same: 'grass' }],
            ['grass', 'grass', '草', 'A small patch of fresh green grass, nothing else', [], { same: 'grass' }],
            ['daming-eating-rice', 'Daming is eating rice.', '大明正在吃米饭。', 'Daming eating a bowl of rice with chopsticks', ['daming'], { same: ['rice', 'chopsticks'] }],
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
          title: "We're making a cake.",
          items: [
            ['cake', 'cake', '蛋糕', 'A single round cake with white cream and red strawberries on top', [], { same: 'cake' }],
            ['making-a-cake', "We're making a cake.", '我们正在做蛋糕。', 'Sam and Amy stirring a big mixing bowl together in a kitchen, flour on the table', ['sam', 'amy'], { same: 'cake' }],
            ['making-a-plane', "We're making a plane.", '我们正在做飞机。', 'Daming and Lingling folding a white paper plane together', ['daming', 'lingling']],
            ['be-quiet-reading', "Please be quiet! I'm reading.", '请安静！我在看书。', 'A boy with curly red hair reading a book on a sofa, holding a finger to his lips', []],
            ['riding-my-bike', "I'm riding my bike.", '我在骑自行车。', 'A little boy with curly red hair riding a small red bike, a brown dog running beside him', []],
            ['amy-playing-piano', "Amy's playing the piano.", '埃米在弹钢琴。', 'Amy sitting at a piano, pressing the keys, music notes floating up', ['amy']],
            ['sam-playing-drums', "Sam's playing the drums.", '萨姆在打鼓。', 'Sam hitting a drum set loudly with two drumsticks', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: "I'm watching TV.",
          items: [
            ['watching-tv', "I'm watching TV.", '我在看电视。', 'A woman with long brown hair sitting on a sofa watching a TV', []],
            ['watering-flowers', "I'm watering the flowers.", '我在给花浇水。', 'A man with short blond hair watering red flowers with a green watering can', []],
            ['cat-is-running', 'A cat is running.', '一只猫在跑。', 'A grey cat running fast across the grass', []],
            ['doing-homework', "He's doing his homework.", '他在做作业。', 'A boy sitting at a desk writing in an exercise book with a pencil', []],
            ['sleeping', 'sleeping', '睡觉', 'A little girl sleeping in bed, eyes closed, under a blue blanket', []],
            ['drawing', 'drawing', '画画', 'A little girl drawing a sun and a house with crayons on paper', []],
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
          title: 'These ducks are very naughty!',
          items: [
            ['dragon-boats', "They're dragon boats.", '它们是龙舟。', 'Two long dragon boats with dragon heads on a lake, people rowing', [], { same: ['boat', 'lake'] }],
            ['lake', 'lake', '湖', 'A calm blue lake surrounded by green trees, nothing on the water', [], { same: 'lake' }],
            ['bread', 'bread', '面包', 'A single loaf of brown bread', [], { same: 'bread' }],
            ['paper-flowers', "Oh, they're paper flowers!", '哦，它们是纸花！', 'A vase of colourful flowers made of folded paper', []],
            ['lets-row', "OK. Let's row.", '好的，我们划船吧。', 'Sam and Amy rowing a small wooden boat with oars', ['sam', 'amy'], { same: ['boat', 'lake'] }],
            ['feed-the-ducks', "Let's feed the ducks.", '我们喂鸭子吧。', 'Amy throwing bread crumbs to three calm ducks by the water', ['amy'], { same: ['duck', 'bread'] }],
            ['naughty-ducks', 'These ducks are very naughty!', '这些鸭子真淘气！', 'Three ducks pecking at Sam\'s shoes and pulling his shorts, Sam running away', ['sam'], { same: 'duck' }],
          ],
        },
        {
          id: 'u2',
          title: 'The ducks are playing in the rain.',
          items: [
            ['ducks-in-the-rain', 'The ducks are playing in the rain.', '鸭子们在雨中玩耍。', 'Ducks splashing happily in puddles while rain falls', [], { same: 'duck' }],
            ['ducks-hiding', 'These are hiding under the tree.', '这些（鸭子）藏在树下。', 'Two little ducks hiding under a big green tree', [], { same: 'duck' }],
            ['hide-and-seek', "They're playing hide-and-seek.", '他们在玩捉迷藏。', 'Daming covering his eyes against a tree while Lingling hides behind a bush', ['daming', 'lingling']],
            ['green-trees', 'They are green trees.', '它们是绿树。', 'A row of three round green trees', []],
            ['they-are-tigers', 'They are tigers.', '它们是老虎。', 'Two tigers, orange with black stripes, standing side by side', []],
            ['rice-noodles', "They're rice noodles.", '它们是米线。', 'A big bowl of thin white rice noodles in soup', []],
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
          title: 'I can jump far.',
          items: [
            ['jump-far', 'I can jump far.', '我能跳得远。', 'Sam leaping far over a long sandpit', ['sam']],
            ['run-fast', 'I can run fast.', '我能跑得快。', 'Amy running very fast on a race track, hair flying', ['amy']],
            ['you-are-slow', 'You are slow.', '你很慢。', 'A tortoise walking very slowly along a path', []],
            ['im-the-winner', "I'm the winner.", '我是胜利者。', 'Amy standing on the top step of a winners\' podium, holding a gold cup', ['amy']],
            ['swim', 'swim', '游泳', 'Daming swimming in a blue pool', ['daming']],
            ['dance', 'dance', '跳舞', 'Lingling dancing and spinning with her arms up', ['lingling']],
          ],
        },
        {
          id: 'u2',
          title: 'What can you see?',
          items: [
            ['what-can-you-see', 'What can you see?', '你能看见什么？', 'Amy looking through a pair of binoculars', ['amy']],
            ['koala', 'koala', '考拉', 'A single grey koala hugging a tree branch', [], { same: 'koala' }],
            ['it-can-fly', 'It can fly.', '它会飞。', 'A small blue bird flying in the sky with wings spread', []],
            ['it-cant-fly', "It can't fly.", '它不会飞。', 'A penguin standing on ice, flapping its short wings', []],
            ['it-can-cry', 'It can cry.', '它会哭。', 'A little grey koala crying big tears', [], { same: 'koala' }],
            ['climb', 'climb', '爬', 'Daming climbing up a tree trunk', ['daming']],
            ['throw-it-high', 'Can you throw it very high?', '你能把它扔得很高吗？', 'Sam throwing a red ball very high up into the sky', ['sam']],
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
          title: 'Can I have an ice cream?',
          items: [
            ['have-an-ice-cream', 'Can I have an ice cream, please?', '我能吃个冰激凌吗？', 'Sam looking hopefully at a big pink ice cream cone', ['sam']],
            ['have-a-drink', 'Can I have a drink, please?', '我能喝点饮料吗？', 'A glass of orange juice with a straw', []],
            ['can-i-watch-tv', 'Can I watch TV, please?', '我能看电视吗？', 'Sam holding a TV remote control and pointing at a TV', ['sam']],
            ['some-sweets', 'Can I have some sweets, please?', '我能吃些糖果吗？', 'A glass jar full of colourful sweets', []],
            ['you-can-have-a-cake', 'But you can have a cake!', '但你可以吃块蛋糕！', 'A woman with long brown hair handing a slice of cake on a plate', []],
            ['shop', 'shop', '商店', 'A small shop front with an awning and fruit boxes outside, no letters', []],
            ['youre-ill', "You're ill!", '你生病了！', 'Sam lying in bed with a thermometer in his mouth and red cheeks', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: 'Can I come in?',
          items: [
            ['can-i-come-in', 'Can I come in?', '我能进来吗？', 'Lingling knocking on a door that is a little open, peeking in', ['lingling']],
            ['library', 'library', '图书馆', 'A small library room with tall shelves full of books', [], { same: 'library' }],
            ['read-this-book', 'Can I read this book?', '我能读这本书吗？', 'Daming holding up one big book, asking with a smile', ['daming'], { same: 'library' }],
            ['can-i-sing-here', 'Can I sing here?', '我能在这里唱歌吗？', 'Amy singing with music notes floating around her', ['amy']],
            ['write-a-letter', 'Can I write a letter here?', '我能在这里写信吗？', 'Lingling writing a letter at a table, an envelope beside her', ['lingling']],
            ['fly-a-kite', 'Can I fly a kite?', '我能放风筝吗？', 'Sam flying a red kite in the sky', ['sam']],
            ['its-snowing', "It's snowing.", '下雪了。', 'Snowflakes falling on a little house and snowy trees', []],
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
          title: "I've got new shorts and new shoes.",
          items: [
            ['new-shorts-and-shoes', "I've got new shorts and new shoes.", '我有新短裤和新鞋子。', 'Sam proudly showing his new white shorts and new red shoes', ['sam'], { same: ['shorts', 'shoes'] }],
            ['new-football', "I've got a new football.", '我有一个新足球。', 'Daming holding up a shiny new black and white football', ['daming']],
            ['new-friend', "I've got a new friend.", '我有一个新朋友。', 'Lingling hugging a small white puppy, both happy', ['lingling']],
            ['new-dress', "I've got a new dress.", '我有一条新连衣裙。', 'Amy holding up a new red dress on a hanger', ['amy'], { same: 'dress' }],
            ['be-careful', 'Be careful!', '小心！', 'Daming pulling Sam back just before he steps into a big muddy puddle', ['daming', 'sam']],
            ['wash-them', 'I can wash them!', '我可以把它们洗干净！', 'A woman washing muddy shorts in a basin of soapy water', [], { same: 'shorts' }],
          ],
        },
        {
          id: 'u2',
          title: "He's got a new shirt.",
          items: [
            ['new-shirt', "He's got a new shirt.", '他有一件新衬衫。', 'A Chinese boy wearing a new light blue shirt with buttons', [], { same: 'shirt' }],
            ['new-trousers', "He's got new trousers.", '他有一条新裤子。', 'A Chinese boy wearing new long brown trousers', []],
            ['she-new-shoes', "She's got new shoes.", '她有一双新鞋子。', 'A Chinese girl looking down at her new pink shoes', [], { same: 'shoes' }],
            ['pear', 'pear', '梨', 'A single yellow-green pear', []],
            ['peach', 'peach', '桃子', 'A single pink peach with a green leaf', []],
            ['hes-got-a-mouse', "He's got a mouse.", '他有一只老鼠。', 'A boy holding a little grey mouse in his hands', []],
            ['very-long-nose', "It's got a very long nose.", '它有一个很长的鼻子。', 'A grey elephant lifting its very long trunk', []],
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
          title: 'Have you got a headache?',
          items: [
            ['headache', 'headache', '头痛', 'Daming holding his forehead with both hands, wincing', ['daming'], { same: 'headache' }],
            ['stomach-ache', 'stomach ache', '胃痛', 'Sam holding his tummy with both hands, wincing', ['sam'], { same: 'stomach' }],
            ['test', 'test', '考试', 'A sheet of test paper with ticks and a pencil on a desk, no letters', [], { same: 'test' }],
            ['have-you-got-a-headache', 'Have you got a headache?', '你头痛吗？', 'A woman with long brown hair gently touching Daming\'s forehead, Daming holding his head', ['daming'], { same: 'headache' }],
            ['are-you-sad', 'Are you sad?', '你难过吗？', 'Sam sitting alone on a bench looking sad, head down', ['sam']],
            ['clever-boy', "You're a clever boy.", '你是个聪明的孩子。', 'Sam smiling proudly, holding up a test paper with a big red tick', ['sam'], { same: 'test' }],
          ],
        },
        {
          id: 'u2',
          title: "She's got a cold.",
          items: [
            ['cold', 'cold', '感冒', 'A girl sneezing into a tissue, red nose, a box of tissues beside her', [], { same: 'cold' }],
            ['cough', 'cough', '咳嗽', 'A boy coughing into his elbow', [], { same: 'cough' }],
            ['shes-got-a-cold', "She's got a cold.", '她感冒了。', 'A girl with a red nose wrapped in a blanket, holding a tissue', [], { same: 'cold' }],
            ['hes-got-a-cough', "He's got a cough.", '他咳嗽了。', 'A boy in bed coughing, a glass of water beside him', [], { same: 'cough' }],
            ['sorry-im-late', "Sorry, I'm late.", '对不起，我迟到了。', 'Daming rushing in through a classroom door, out of breath, with his schoolbag', ['daming']],
            ['class-begins', 'Now class begins.', '现在开始上课。', 'Ms Smart standing in front of a blank blackboard, children sitting at desks', ['ms-smart']],
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
          title: "This is Sam's book.",
          items: [
            ['sams-book', "This is Sam's book.", '这是萨姆的书。', 'Daming handing a blue book to Sam', ['daming', 'sam']],
            ['sams-red-pen', "This is Sam's red pen.", '这是萨姆的红钢笔。', 'Sam holding up a red pen', ['sam']],
            ['toy-horse', 'That is my toy horse.', '那是我的玩具马。', 'Lingling hugging a small brown toy horse', ['lingling']],
            ['damings-ball', "That is Daming's ball.", '那是大明的球。', 'Daming holding a colourful ball', ['daming']],
            ['bobs-house', "This is Bob's house.", '这是鲍勃的家。', 'A brown dog sitting in front of a small wooden dog house', [], { same: 'dog-house' }],
            ['cats-house-now', "It's the cat's house now!", '现在它是猫的家了！', 'A grey cat sitting inside a small wooden dog house, a brown dog outside looking surprised', [], { same: 'dog-house' }],
          ],
        },
        {
          id: 'u2',
          title: "Is this your grandma's umbrella?",
          items: [
            ['umbrella', 'umbrella', '雨伞', 'A single open blue umbrella', [], { same: 'umbrella' }],
            ['grandmas-umbrella', "Is this your grandma's umbrella?", '这是你奶奶的雨伞吗？', 'A grandma with grey hair holding a purple umbrella with flowers', [], { same: 'umbrella' }],
            ['its-raining', "It's raining.", '下雨了。', 'Heavy rain falling from grey clouds onto a street', []],
            ['its-broken', "It's broken!", '它坏了！', 'An umbrella blown inside out, its sticks bent and broken', [], { same: 'umbrella' }],
            ['amys-cat', "Is this Amy's cat?", '这是埃米的猫吗？', 'Amy pointing at a small white kitten', ['amy']],
            ['sams-dog', "Is this Sam's dog?", '这是萨姆的狗吗？', 'Sam patting a small brown dog', ['sam']],
            ['father-bears-bag', "This is Father Bear's bag.", '这是熊爸爸的包。', 'A big father bear carrying a brown bag', []],
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
          title: "I'm going to do the long jump.",
          items: [
            ['do-the-long-jump', "I'm going to do the long jump.", '我要参加跳远。', 'Daming leaping forward into a sandpit', ['daming']],
            ['do-the-high-jump', 'Amy is going to do the high jump.', '埃米要参加跳高。', 'Amy jumping over a high bar onto a soft mat', ['amy']],
            ['run-a-race', "I'm going to run a race.", '我要参加赛跑。', 'Sam crouching at the starting line of a race track, ready to run', ['sam']],
            ['from-the-moon', "I'm from the moon.", '我来自月球。', 'A friendly little green alien standing on the moon, waving', [], { same: 'alien' }],
            ['make-new-friends', "I'm going to make new friends.", '我要交新朋友。', 'A friendly little green alien shaking hands with Lingling', ['lingling'], { same: 'alien' }],
            ['come-on-daming', 'Come on, Daming!', '加油，大明！', 'Lingling and Amy cheering with pom-poms', ['lingling', 'amy']],
          ],
        },
        {
          id: 'u2',
          title: "I'm going to be a driver.",
          items: [
            ['be-a-driver', "I'm going to be a driver.", '我将来要当司机。', 'Sam sitting at the big steering wheel of a bus, pretending to drive', ['sam'], { same: 'driver' }],
            ['hes-a-driver', "He's a driver.", '他是司机。', 'A smiling man driving a yellow taxi', [], { same: 'driver' }],
            ['be-a-doctor', "I'm going to be a doctor.", '我将来要当医生。', 'Daming wearing a white coat with a stethoscope', ['daming']],
            ['be-a-pilot', "I'm going to be a pilot.", '我将来要当飞行员。', 'Lingling in a pilot cap standing beside a small plane', ['lingling']],
            ['be-a-nurse', "I'm going to be a nurse.", '我将来要当护士。', 'Amy in a nurse cap holding a first aid box', ['amy']],
            ['policeman', 'policeman', '警察', 'A policeman in a dark blue uniform and police hat, waving', []],
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
          title: 'Are you going to Hong Kong?',
          items: [
            ['airport', 'airport', '飞机场', 'An airport with a big plane parked beside the terminal building', [], { same: 'airport' }],
            ['going-to-hong-kong', 'Are you going to Hong Kong?', '你要去香港吗？', 'Sam talking to a Chinese boy pulling a suitcase in an airport hall', ['sam'], { same: 'airport' }],
            ['sea', 'sea', '大海', 'A wide blue sea with small waves and a sandy beach', [], { same: 'sea' }],
            ['swim-in-the-sea', "I'm going to swim in the sea.", '我要去海里游泳。', 'Sam swimming in the blue sea with a swim ring', ['sam'], { same: 'sea' }],
            ['xiaoyongs-bag', "This is Xiaoyong's bag!", '这是小勇的包！', 'Sam holding up a blue travel bag, looking surprised', ['sam']],
            ['ride-a-bike', 'ride a bike', '骑自行车', 'Lingling riding a pink bike in the park', ['lingling']],
            ['read-a-book', 'read a book', '读书', 'Daming sitting under a tree reading a book', ['daming']],
          ],
        },
        {
          id: 'u2',
          title: 'What are you going to see?',
          items: [
            ['see-the-monkey-king', "I'm going to see The Monkey King.", '我要去看《大闹天宫》。', 'Lingling watching a cinema screen showing the Monkey King with his golden staff', ['lingling'], { same: 'film' }],
            ['see-a-film', "I'm going to see a film.", '我要去看电影。', 'A boy sitting in a cinema seat with a box of popcorn, looking at a big screen', [], { same: 'film' }],
            ['visit-my-friends', "I'm going to visit my friends.", '我要去看望我的朋友。', 'Daming at a front door with a gift, two friends opening the door and waving', ['daming']],
            ['going-to-dance', "I'm going to dance.", '我要去跳舞。', 'Amy dancing in a dance class', ['amy']],
            ['have-a-class', "I'm going to have a class.", '我要去上课。', 'Sam sitting at a desk in a classroom with his book open', ['sam']],
            ['see-lions-and-tigers', "We're going to see lions and tigers.", '我们要去看狮子和老虎。', 'A lion and a tiger standing side by side at the zoo', []],
          ],
        },
      ],
    },
  ],
}
