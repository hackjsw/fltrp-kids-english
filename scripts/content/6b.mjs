// 六年级下册 Module 1–10，格式见 AUTHORING.md
// Simon（Daming 在美国的表哥）统一画成 a plush boy with short blond hair；Simon's mum 画成 a plush woman with short blond hair
export default {
  id: '6b',
  title: '六年级下册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/6b.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: 'I want a hot dog, please.',
          items: [
            ['hot-dog', 'I want a hot dog, please.', '我想要一个热狗。', 'Daming pointing happily at a hot dog with a sausage in a long bun and yellow mustard', ['daming'], { same: 'hot-dog' }],
            ['hamburger', 'I want a hamburger.', '我想要一个汉堡包。', 'A plush boy with short blond hair holding a big hamburger with lettuce and cheese', [], { same: 'hamburger' }],
            ['cashier', 'cashier', '收银员', 'A smiling plush woman in a cap and apron standing behind a fast food counter with a cash register', [], { same: 'cashier' }],
            ['cola', 'Cola, please.', '请给我可乐。', 'A paper cup of cola with ice and a straw', [], { same: 'cola' }],
            ['soup', 'Can I have some soup?', '我能要点汤吗？', 'A steaming bowl of soup with a spoon', []],
            ['enjoy-your-meal', 'Enjoy your meal!', '请慢用！', 'A cashier handing a tray with two hamburgers, a hot dog and three colas over the counter', [], { same: ['cashier', 'hot-dog', 'hamburger', 'cola'] }],
            ['my-new-trousers', 'Oh no! My new trousers!', '哦，不！我的新裤子！', 'A plush man with short blond hair looking shocked at cola spilled all over his trousers', []],
          ],
        },
        {
          id: 'u2',
          title: 'What do you want to eat?',
          items: [
            ['want-to-eat', 'What do you want to eat?', '你想吃什么？', 'Lingling looking up at a picture menu on the wall of a restaurant, a finger on her chin, thinking', ['lingling']],
            ['noodles-and-cola', 'I want noodles and a cola, please.', '我想要面条和一杯可乐。', 'A bowl of noodles next to a paper cup of cola on a tray', [], { same: 'cola' }],
            ['milk-please', 'Milk, please.', '请给我牛奶。', 'Lingling holding a glass of white milk', ['lingling']],
            ['eat-some-meat', 'I want to eat some meat.', '我想吃点肉。', 'A plate with a big piece of roast meat', []],
            ['chicken-and-rice', 'I want some chicken and rice, please.', '我想要一些鸡肉和米饭。', 'A plate with chicken legs and a bowl of white rice', []],
            ['some-pears', 'And I want some pears.', '我还想要一些梨。', 'Three yellow pears in a bowl', []],
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
          title: 'When are we going to eat?',
          items: [
            ['when-going-to-eat', 'When are we going to eat?', '我们什么时候吃饭？', 'A plush boy with short blond hair rubbing his tummy beside a closed picnic basket, looking at his mum', []],
            ['half-past-twelve', 'At half past twelve.', '十二点半。', 'A round clock showing half past twelve, the hour hand between 12 and 1 and the minute hand on 6', [], { digits: true }],
            ['get-up-breakfast', "I'm going to get up and have breakfast.", '我要起床吃早饭了。', 'A sleepy plush boy stretching and yawning as he gets out of bed', []],
            ['ducks-on-lake', 'There are some ducks on the lake.', '湖上有一些鸭子。', 'Several white ducks swimming on a calm blue lake in a park', [], { same: 'ducks-m2' }],
            ['dark-clouds', "It's going to rain soon.", '快要下雨了。', 'Big dark grey clouds filling the sky over a green park', [], { same: 'cloud' }],
            ['raining-now', "Oh dear! It's raining now!", '哎呀！现在下雨了！', 'Heavy rain pouring down from dark grey clouds onto a picnic blanket in a park, a plush woman and two boys running away with their hands over their heads, raindrops and puddles clearly visible (NOT without rain)', [], { same: 'rain' }],
            ['ducks-eating-sandwiches', "They're eating our sandwiches!", '它们在吃我们的三明治！', 'Naughty white ducks pecking at sandwiches on a picnic blanket', [], { same: 'ducks-m2' }],
          ],
        },
        {
          id: 'u2',
          title: 'It will rain in Beijing.',
          items: [
            ['rain-in-beijing', 'Tomorrow, it will rain in Beijing.', '明天北京会下雨。', 'The red Tiananmen gate tower in Beijing under a dark grey sky, lots of raindrops clearly falling on it and puddles on the ground in front (the rain must be clearly visible, NOT a plain or sunny background)', [], { same: 'rain' }],
            ['snow-in-harbin', 'In Harbin, it will snow.', '哈尔滨会下雪。', 'Snow falling on a city with ice sculptures and snowy roofs', []],
            ['sunny-in-dalian', 'In Dalian, it will be sunny.', '大连会是晴天。', 'A bright sun shining over a seaside city with a blue sea and a sandy beach', [], { same: 'sun-m2' }],
            ['windy-in-xian', "In Xi'an, it will be windy.", '西安会刮风。', 'Strong wind blowing trees and leaves in front of an old city wall, a kite flying high', []],
            ['hot-in-guangzhou', 'In Guangzhou, it will be hot.', '广州会很热。', 'A plush boy sweating and fanning himself under a big hot red sun, a melting ice cream in his hand', [], { same: 'sun-m2' }],
            ['cloudy', 'It will be cloudy in Tianjin.', '天津会是多云天气。', 'A city sky full of big grey and white clouds, no sun', [], { same: 'cloud' }],
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
          title: 'I took some photos.',
          items: [
            ['took-photos', 'I took some photos.', '我拍了一些照片。', 'Daming taking a photo of ducks on a lake with a camera', ['daming'], { same: 'ducks-m3' }],
            ['big-lake-ducks', 'There were lots of ducks.', '那里有很多鸭子。', 'A big blue lake in a park with lots and lots of white ducks swimming on it', [], { same: 'ducks-m3' }],
            ['started-to-rain', 'Then it started to rain.', '然后开始下雨了。', 'The first big raindrops falling from grey clouds onto a park path', [], { same: 'rain-m3' }],
            ['ran-quickly', 'We ran quickly to hide.', '我们飞快地跑去躲雨。', 'Daming and a plush boy with short blond hair running fast toward a big tree in the rain', ['daming'], { same: 'rain-m3' }],
            ['ducks-had-a-picnic', 'They had a picnic!', '它们吃了一顿野餐！', 'Ducks sitting on a picnic blanket eating sandwiches and drinking from cups', [], { same: 'ducks-m3' }],
            ['angry-with-ducks', 'We were angry with the ducks!', '我们很生鸭子的气！', 'Two plush boys with angry faces and hands on hips looking at ducks walking away', []],
          ],
        },
        {
          id: 'u2',
          title: 'The sun is shining.',
          items: [
            ['sun-is-shining', 'The sun is shining.', '太阳照耀着。', 'A big bright sun shining in a clear blue sky over a green park', []],
            ['birds-singing', 'The birds are singing in the trees.', '鸟儿在树上唱歌。', 'Little birds sitting on tree branches with open beaks, music notes floating around them', [], { same: 'birds-m3' }],
            ['birds-flying-away', 'The birds are flying away.', '鸟儿正在飞走。', 'A group of birds flying away from a tree into a grey sky as rain starts', [], { same: 'birds-m3' }],
            ['dog-crying', "Look at the little dog. It's crying.", '看那只小狗，它在哭。', 'A little puppy sitting and crying with big tears', []],
            ['moon-shining', 'The moon is shining sadly.', '月亮在悲伤地照着。', 'A sad-faced crescent moon shining in a dark night sky full of stars', []],
            ['having-a-picnic', "In this photo, we're having a picnic.", '在这张照片里，我们在野餐。', 'A family sitting on a picnic blanket in a sunny park, eating sandwiches', []],
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
          title: "I can't carry all these things.",
          items: [
            ['cant-carry', "I can't carry all these things.", '我拿不了这么多东西。', 'A plush woman with short blond hair carrying too many shopping bags and a cake box, wobbling', [], { same: 'carry' }],
            ['on-the-phone', "Sorry, I can't. I'm on the phone.", '对不起，我帮不了。我在打电话。', 'A plush boy with short blond hair talking on a telephone and shaking his head', []],
            ['carry-the-box', 'I can carry the box.', '我能搬这个箱子。', 'Daming carrying a big cardboard box in both arms', ['daming'], { same: 'carry' }],
            ['oranges-falling', 'The oranges are falling!', '橘子掉下来了！', 'Oranges falling out of a torn paper bag and rolling on the ground', []],
            ['grab-the-balloons', 'Simon, grab the balloons!', '西蒙，抓住气球！', 'A plush boy with short blond hair jumping up to grab the strings of colourful balloons', [], { same: 'balloon' }],
            ['flying-away', "They're flying away!", '它们飞走了！', 'Colourful balloons flying away high into the blue sky, strings hanging down', [], { same: 'balloon' }],
          ],
        },
        {
          id: 'u2',
          title: 'The apples are falling down the stairs!',
          items: [
            ['apples-falling-stairs', 'The apples are falling down the stairs!', '苹果顺着楼梯滚下去了！', 'Red apples bouncing down a staircase one step after another', [], { same: 'stairs' }],
            ['stairs', 'stairs', '楼梯', 'A wooden staircase with a handrail going up', [], { same: 'stairs' }],
            ['eggs-are-broken', 'The eggs are broken!', '鸡蛋打碎了！', 'Broken eggs on the floor with yellow yolks spilling out of the shells', [], { same: 'mess' }],
            ['cola-falling', 'Now the cola is falling, too!', '现在可乐也掉下去了！', 'A big bottle of cola falling through the air and splashing', []],
            ['what-a-mess', 'What a mess!', '真是一团糟！', 'A floor covered with broken eggs, rolling apples, spilled cola and fallen shopping bags, a plush woman with her hands on her head', [], { same: ['mess', 'stairs'] }],
            ['panda-kite', "Oh! It's a panda kite.", '哦！是一只熊猫风筝。', 'A black and white panda-shaped kite falling from the sky', []],
            ['sitting-down', "He's sitting down.", '他正坐着。', 'A plush boy sitting on a chair at his school desk', []],
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
          title: 'He is playing the suona, but the telephone rings.',
          items: [
            ['playing-suona', 'He is playing the suona, but the telephone rings.', '他正在吹唢呐，可是电话响了。', 'Daming blowing a Chinese suona horn, a red telephone ringing and shaking on a table beside him', ['daming'], { same: 'telephone' }],
            ['telephone', 'telephone', '电话', 'A single red telephone with a curly cord, ringing and shaking', [], { same: 'telephone' }],
            ['bell-is-ringing', 'The bell is ringing.', '门铃在响。', 'A finger pressing a doorbell button beside a front door, sound lines around it', []],
            ['dog-is-barking', 'The dog is barking.', '狗在叫。', 'A small brown dog barking loudly with its mouth wide open', [], { same: 'dog-m5' }],
            ['tom-is-crying', 'Little Tom is crying.', '小汤姆在哭。', 'A little plush boy crying loudly with tears running down his cheeks', []],
            ['birthday-party', 'Daming is having a birthday party.', '大明正在开生日聚会。', 'Daming in a party hat in front of a birthday cake with candles, friends and balloons around', ['daming']],
            ['dog-dancing', 'The dog is barking and dancing with the suona.', '小狗跟着唢呐边叫边跳舞。', 'A small brown dog standing on its back legs and dancing while Daming plays a suona horn', ['daming'], { same: ['dog-m5', 'telephone'] }],
          ],
        },
        {
          id: 'u2',
          title: 'Some children are jumping in the water.',
          items: [
            ['jumping-in-water', 'Some children are jumping in the water.', '一些孩子在水里跳。', 'Children in rain boots jumping and splashing in big puddles in the rain', [], { same: 'rain-m5' }],
            ['pigs-sleeping', 'Some pigs are sleeping under a tree.', '一些猪在树下睡觉。', 'Three pink pigs sleeping under a big tree in the rain', []],
            ['carrying-umbrellas', 'People are carrying umbrellas.', '人们打着伞。', 'People walking along a street holding colourful umbrellas in the rain', [], { same: 'rain-m5' }],
            ['raincoat', 'A man is wearing a big hat and a raincoat.', '一个男人戴着一顶大帽子，穿着雨衣。', 'A plush man in a yellow raincoat and a big rain hat', [], { same: 'rain-m5' }],
            ['tunnel', 'The train goes into a tunnel.', '火车开进了隧道。', 'A green train going into a dark tunnel in the side of a mountain', [], { same: 'train' }],
            ['train-arrives', 'Now the train arrives at the station.', '现在火车到站了。', 'A train stopping at a railway station platform, people waiting with bags, the sun shining', [], { same: 'train' }],
            ['come-back-kite', 'Please come back, my dear kite!', '请回来吧，我亲爱的风筝！', 'A plush girl holding a broken string and reaching up as her kite flies far away into the sky', []],
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
          title: "It was Daming's birthday yesterday.",
          items: [
            ['daming-birthday', "It was Daming's birthday yesterday.", '昨天是大明的生日。', 'Daming in a party hat holding many wrapped presents, a birthday cake on the table', ['daming']],
            ['bought-him-a-book', "Simon's mum bought him a book.", '西蒙的妈妈给他买了一本书。', 'A plush woman with short blond hair giving Daming a book wrapped with a ribbon', ['daming'], { same: 'book-m6' }],
            ['space-travel-book', 'It was a book about space travel.', '那是一本关于太空旅行的书。', 'An open book showing pictures of rockets, planets and stars', [], { same: 'book-m6' }],
            ['earth', 'earth', '地球', 'The planet earth floating in dark space, blue seas and green land', [], { same: 'earth' }],
            ['surprised', 'Simon was surprised to see spaceships from China.', '西蒙看到中国的宇宙飞船很惊讶。', 'A plush boy with short blond hair with wide eyes and an open mouth, looking at a book picture of a white spaceship with a red Chinese flag on it', [], { same: ['book-m6', 'spaceship'] }],
            ['paper-spaceship', 'They made a paper spaceship together.', '他们一起做了一个纸飞船。', 'Daming and a plush boy with short blond hair folding and gluing a white paper spaceship at a table', ['daming'], { same: 'spaceship' }],
          ],
        },
        {
          id: 'u2',
          title: 'The name of the spaceship is Shenzhou V.',
          items: [
            ['shenzhou-v', 'The name of the spaceship is Shenzhou V.', '这艘飞船的名字是神舟五号。', 'A white Chinese spaceship (a capsule with two big blue solar panel wings, NOT an aeroplane, no plane wings or tail fins) flying in black space full of stars, the big round blue and green earth below it', [], { same: ['spaceship', 'earth'] }],
            ['taikonaut', 'taikonaut', '（中国的）宇航员', 'A Chinese astronaut in a white spacesuit and helmet, waving, a small Chinese flag on the arm', []],
            ['national-flag', 'national flag', '国旗', 'The red Chinese national flag with five yellow stars waving on a pole', []],
            ['seeds', 'seeds', '种子', 'A child\'s open hand holding a few small brown seeds', []],
            ['made-a-model', 'Daming made a model of a Chinese spaceship.', '大明做了一个中国飞船的模型。', 'Daming proudly holding up a small toy model spaceship he has made', ['daming'], { same: 'spaceship' }],
            ['model-of-you', "Oh, look! It's a model of you!", '哦，看！这是你的模型！', 'Daming laughing and holding a tiny doll that looks just like himself', ['daming']],
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
          title: 'My father flew into space in Shenzhou V.',
          items: [
            ['flew-into-space', 'My father flew into space in Shenzhou V.', '我爸爸乘坐神舟五号飞入了太空。', 'A white rocket blasting off into the sky with fire and smoke below it', []],
            ['spent-hours-in-space', 'He spent about twenty-one hours in space.', '他在太空中度过了大约二十一个小时。', 'An astronaut in a white spacesuit floating inside a spaceship cabin, the blue earth seen through a round window', [], { same: 'in-space' }],
            ['made-a-video', 'He also made a video in space.', '他还在太空中录了一段视频。', 'An astronaut in a white spacesuit floating in a spaceship cabin and filming with a video camera', [], { same: 'in-space' }],
            ['came-back-to-earth', 'Then he came back to the earth.', '然后他回到了地球。', 'A round return capsule with a big red and white parachute landing on green grassland', []],
            ['bird-flew', 'A bird flew into the sky.', '一只鸟飞上了天空。', 'A small bird flying up into a clear blue sky above the trees', []],
            ['go-into-space-someday', 'I want to go into space someday, too.', '有朝一日我也想飞入太空。', 'A plush boy in a toy astronaut helmet looking up at the stars and moon through a window', []],
          ],
        },
        {
          id: 'u2',
          title: "She couldn't see or hear.",
          items: [
            ['couldnt-see-or-hear', "She couldn't see or hear.", '她看不见也听不见。', 'A plush girl in an old-fashioned long dress with her eyes closed and her hands over her ears', [], { same: 'helen' }],
            ['could-read', 'But she could read.', '但是她能阅读。', 'A plush girl in an old-fashioned dress with her eyes closed, reading a book of raised dots with her fingertips', [], { same: 'helen' }],
            ['helped-blind-people', 'She also wrote books and helped blind people.', '她还写书并帮助盲人。', 'A kind plush woman helping a blind man with dark glasses and a white stick walk along a path', []],
            ['travelled-round-world', 'Helen travelled round the world and told her story.', '海伦周游世界，讲述自己的故事。', 'A plush woman with a suitcase standing beside a big globe, a plane flying around it', []],
            ['baby-couldnt-walk', "When I was a baby, I couldn't walk.", '我还是婴儿时不会走路。', 'A baby crawling on a soft rug', []],
            ['great-teacher', 'He was a great teacher.', '他是一位伟大的老师。', 'An old Chinese teacher in ancient robes with a long white beard teaching students sitting around him', []],
            ['go-to-the-zoo', 'Did you go to the zoo?', '你去动物园了吗？', 'Two plush children at a zoo looking at a giraffe and an elephant', []],
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
          title: 'Why do you have cups on your heads?',
          items: [
            ['cups-on-heads', 'Why do you have cups on your heads?', '你们为什么把杯子戴在头上？', 'Daming, Lingling and Amy laughing with paper cups upside down on their heads, Sam looking puzzled', ['daming', 'lingling', 'amy', 'sam'], { same: 'cup' }],
            ['cup', 'cup', '杯子', 'A single white paper cup', [], { same: 'cup' }],
            ['baseball', 'baseball', '棒球', 'A white baseball with red stitches, a wooden bat and a brown glove', [], { same: 'baseball' }],
            ['baseball-caps', 'There were baseball caps!', '里面是棒球帽！', 'An open school bag full of colourful baseball caps', [], { same: 'cap' }],
            ['played-baseball', 'They played baseball together.', '他们一起打棒球。', 'Children in baseball caps playing baseball in a school playground, one swinging a bat', [], { same: ['baseball', 'cap'] }],
            ['under-my-bed', "Oh, it's under my bed.", '哦，它在我的床底下。', 'A wooden bed with a blanket seen from the side, a school bag lying on the floor in the space underneath the bed (the bed must be clearly visible above the bag, NOT just a bag on its own)', []],
          ],
        },
        {
          id: 'u2',
          title: 'Why are you wearing a hat?',
          items: [
            ['wearing-a-hat', 'Why are you wearing a hat?', '你为什么戴着帽子？', 'A plush girl in a big straw sun hat under a hot bright sun', []],
            ['wearing-a-raincoat', "Because it's going to rain.", '因为要下雨了。', 'A plush boy in a yellow raincoat under dark rain clouds', []],
            ['wearing-a-tshirt', "Because I'm going to play basketball.", '因为我要去打篮球。', 'A plush boy in a T-shirt and shorts holding a basketball', []],
            ['wearing-a-dress', "Because I'm going to the theatre.", '因为我要去剧院。', 'A plush girl in a pretty party dress standing in front of a theatre stage with big open red curtains and rows of seats (the stage and red curtains must be clearly visible, NOT just a girl on her own)', []],
            ['hide-and-seek', "We're playing hide-and-seek.", '我们在玩捉迷藏。', 'One child counting with eyes covered against a tree while other children hide behind bushes', []],
            ['scared-lion', 'Why is he scared? Because there is a lion.', '他为什么害怕？因为有一头狮子。', 'A plush boy shaking with fear, a lion peeking out from behind a bush', []],
            ['looking-at-sky', 'Why are you looking at the sky?', '你为什么看着天空？', 'A plush boy looking up at the sky, a big bird sitting in a tall tree above him', []],
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
          title: 'Best wishes to you!',
          items: [
            ['best-wishes', 'Best wishes to you!', '向你致以最美好的祝愿！', 'Lingling giving Amy a card covered with hearts and flowers', ['lingling', 'amy'], { same: ['wish-card', 'give-amy'] }],
            ['good-luck', 'Good luck to you!', '祝你好运！', 'Daming giving Sam a four-leaf clover and a thumbs up, Sam holding a suitcase', ['daming', 'sam'], { same: 'sam-suitcase' }],
            ['great-friend', 'You are a great friend.', '你是一个很棒的朋友。', 'Amy and Lingling hugging each other and smiling', ['amy', 'lingling'], { same: 'friend-m9' }],
            ['miss-you', 'And I will miss you.', '我会想念你的。', 'Sam waving goodbye with a tear on his cheek, standing beside a suitcase', ['sam'], { same: 'sam-suitcase' }],
            ['brought-us-joy', 'You brought us lots of joy.', '你给我们带来了很多快乐。', 'Happy children giving a bunch of flowers to Ms Smart, everyone smiling', ['ms-smart']],
            ['best-friend', "You're my best friend.", '你是我最好的朋友。', 'Daming and Sam standing arm in arm, both grinning', ['daming', 'sam'], { same: 'friend-m9' }],
          ],
        },
        {
          id: 'u2',
          title: 'Wishing you happiness every day.',
          items: [
            ['wishing-happiness', 'Wishing you happiness every day.', '祝你每天都快乐。', 'A card with a big smiling sun, rainbows and hearts on it', [], { same: 'wish-card' }],
            ['goodbye-letters', "I'm writing goodbye letters to all my friends.", '我在给所有朋友写告别信。', 'Lingling writing a letter at her desk, a pile of envelopes beside her', ['lingling'], { same: 'letters-m9' }],
            ['this-one-for-amy', 'This one is for Amy.', '这封是给埃米的。', 'Lingling handing an envelope with a heart sticker to Amy', ['lingling', 'amy'], { same: 'give-amy' }],
            ['forty-letters', 'There are about forty letters here.', '这里大约有四十封信。', 'A very big pile of envelopes on a table, a plush man with glasses looking amazed', [], { same: 'letters-m9' }],
            ['email-from-space', "I'm writing an email to my friends from the earth.", '我在给地球上的朋友们写电子邮件。', 'A cute green alien typing on a laptop inside a spaceship, the blue earth seen through the window', []],
            ['goodbye-my-friend', 'Goodbye, goodbye, my friend!', '再见，再见，我的朋友！', 'Children waving goodbye to each other at a school gate', []],
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
          title: "We're going to different schools.",
          items: [
            ['different-schools', "We're going to different schools.", '我们要去不同的学校了。', 'Children waving to each other as they walk down two different roads toward two different school buildings', []],
            ['primary-school', "We're going to leave our primary school soon.", '我们很快就要离开小学了。', 'Young children with backpacks looking back at a small primary school with a flagpole, waving', []],
            ['speech', 'A goodbye speech by Lingling', '玲玲的告别演讲', 'Lingling standing at a microphone on a school stage, giving a speech to her classmates', ['lingling']],
            ['dog-middle-school', 'Are you going to Dog Middle School?', '你要去小狗中学吗？', 'A funny school building shaped like a big dog head, puppies with backpacks walking in', []],
            ['emails-each-other', "Let's write lots of emails to each other!", '我们互相多写电子邮件吧！', 'Two plush children far apart, each typing on a laptop, envelopes flying between them', []],
            ['always-be-friends', "We'll always be friends.", '我们永远是朋友。', 'Daming, Lingling, Sam and Amy standing in a row with their arms around each other', ['daming', 'lingling', 'sam', 'amy']],
          ],
        },
        {
          id: 'u2',
          title: "I'm going to Lake Middle School.",
          items: [
            ['lake-middle-school', "I'm going to Lake Middle School.", '我要去湖畔中学。', 'Lingling walking toward a big school building beside a blue lake', ['lingling']],
            ['park-middle-school', "I'm going to Park Middle School.", '我要去公园中学。', 'Amy walking toward a big school building next to a park with tall trees and flower beds', ['amy']],
            ['geography', 'geography', '地理', 'A globe next to an unfolded map with mountains and rivers', []],
            ['chemistry', 'chemistry', '化学', 'Glass test tubes and flasks with bubbling coloured liquids on a lab table', []],
            ['physics', 'physics', '物理', 'A red horseshoe magnet picking up small nails, a glowing light bulb beside it', []],
            ['study-history', "I'm going to study History.", '我要学习历史。', 'A plush girl reading a big book with pictures of old castles and ancient pots', []],
          ],
        },
      ],
    },
  ],
}
