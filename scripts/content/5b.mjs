// 五年级下册 Module 1–10，格式见 AUTHORING.md
export default {
  id: '5b',
  title: '五年级下册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/5b.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: 'She was a driver before.',
          items: [
            ['she-was-a-driver', 'She was a driver before.', '她以前是一名司机。', 'A young plush woman with black hair in a driver cap standing proudly beside a big red bus', [], { same: 'bus' }],
            ['she-drove-a-bus', 'She drove a bus.', '她开公共汽车。', 'A young plush woman with black hair driving a big red bus down a city street', [], { same: 'bus' }],
            ['flute-player', 'He was a flute player before.', '他以前是一名笛子演奏者。', 'A young plush man with black hair playing a long bamboo flute on a stage', [], { same: 'flute' }],
            ['play-the-flute-too', 'I can play the flute, too.', '我也会吹笛子。', 'Sam blowing a flute loudly while Amy covers her ears, laughing', ['sam', 'amy']],
            ['erhu-player', "He's an erhu player.", '他是一名二胡演奏者。', 'A plush old man with grey hair sitting on a chair playing a Chinese erhu', []],
            ['he-was-a-doctor', 'He was a doctor.', '他以前是一名医生。', 'A plush man in a white coat with a stethoscope in a hospital room', []],
          ],
        },
        {
          id: 'u2',
          title: 'He worked in an office.',
          items: [
            ['office', 'office', '办公室', 'An office room with a desk, a computer, a chair and a plant', [], { same: 'office' }],
            ['worked-in-an-office', 'He worked in an office.', '他以前在办公室工作。', 'A plush man in a shirt and tie typing on a computer at an office desk', [], { same: 'office' }],
            ['worked-in-a-factory', 'She worked in a factory.', '她以前在工厂工作。', 'A plush woman in blue overalls working at a big machine in a factory', []],
            ['hes-fishing', "He's fishing.", '他在钓鱼。', 'A plush grandpa with grey hair sitting by a lake holding a fishing rod', []],
            ['drove-a-taxi', 'He drove a taxi ten years ago.', '十年前他开出租车。', 'A plush man driving a yellow taxi along a street', []],
            ['worked-on-a-farm', 'She worked on a farm.', '她以前在农场工作。', 'A plush woman in a straw hat feeding chickens on a farm with a red barn', []],
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
          title: 'What did she have for lunch?',
          items: [
            ['email-from-lingling', "I've got an email from Lingling.", '我收到了玲玲的一封电子邮件。', 'Daming at a computer pointing at a photo of Lingling on the screen', ['daming']],
            ['sausage', 'sausage', '香肠', 'Three plump brown sausages on a plate', [], { same: 'sausage' }],
            ['eggs-and-sausages', 'She had eggs and sausages.', '她吃了鸡蛋和香肠。', 'A breakfast plate with two fried eggs and sausages', [], { same: 'sausage' }],
            ['she-had-sandwiches', 'She had sandwiches.', '她吃了三明治。', 'A plate of triangle sandwiches with lettuce, tomato and cheese', []],
            ['fish-and-chips', 'She had fish and chips.', '她吃了炸鱼加炸薯条。', 'A paper cone of golden fried fish and chips with a lemon slice', []],
            ['bread-meat-vegetables', 'Bread, meat and vegetables.', '面包、肉和蔬菜。', 'A dinner plate with a slice of bread, a piece of meat, carrots and peas', []],
          ],
        },
        {
          id: 'u2',
          title: 'Lunch is usually at half past twelve.',
          items: [
            ['lunch-at-half-past-twelve', 'Lunch is usually at half past twelve.', '午饭通常在十二点半。', 'A big round wall clock showing half past twelve above a table with lunch on it', [], { digits: true }],
            ['dinner-at-half-past-six', 'Dinner is usually at half past six.', '晚饭通常在六点半。', 'A plush family eating dinner by lamplight, a wall clock showing half past six, dark sky outside', [], { digits: true }],
            ['chicken', 'chicken', '鸡肉', 'A golden roast chicken on a big plate', [], { same: 'chicken' }],
            ['sunday-lunch', 'They eat chicken, potatoes and other vegetables.', '他们吃鸡肉、土豆和其他蔬菜。', 'A plush family at a Sunday lunch table with roast chicken, potatoes and vegetables', [], { same: 'chicken' }],
            ['noodles-and-an-egg', 'Today he has noodles and an egg.', '今天他吃面条和一个鸡蛋。', 'Daming eating a big bowl of long noodles with an egg on top', ['daming']],
            ['want-a-hamburger', 'I want a hamburger.', '我想要一个汉堡包。', 'A plush boy holding up a big hamburger with a happy face', []],
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
          title: 'Have you got the Harry Potter DVDs?',
          items: [
            ['dvd', 'DVD', '数字化视频光盘', 'A shiny silver disc next to its plain blue plastic case', [], { same: 'dvd' }],
            ['librarian', 'librarian', '图书馆管理员', 'A plush woman librarian with glasses behind a library desk with piles of books', [], { same: 'librarian' }],
            ['have-you-got-the-dvds', 'Excuse me. Have you got the Harry Potter DVDs?', '打扰一下，你们有《哈利·波特》的光盘吗？', 'Amy at the library desk asking a plush woman librarian with glasses, pointing at a disc', ['amy'], { same: ['dvd', 'librarian'] }],
            ['look-on-the-computer', "I'll look on the computer.", '我在电脑上查一下。', 'A plush woman librarian with glasses typing on a computer at the library desk', [], { same: ['librarian', 'computer'] }],
            ['lots-of-books', "You've got lots of books here!", '你们这里有很多书！', 'Lingling and Amy looking up at tall library shelves full of books', ['lingling', 'amy'], { same: 'library' }],
            ['your-library-card', 'Your library card, please.', '请出示你的借书证。', 'Amy handing a small library card across the desk', ['amy'], { same: 'borrow' }],
          ],
        },
        {
          id: 'u2',
          title: 'You can use the computers.',
          items: [
            ['this-is-our-library', 'This is our library.', '这是我们的图书馆。', 'A big bright library room with shelves of books, tables and chairs', [], { same: 'library' }],
            ['borrow-books', 'You can borrow books.', '你可以借书。', 'A plush boy carrying a stack of library books out of the library', [], { same: 'borrow' }],
            ['use-the-computers', 'You can use the computers.', '你可以使用电脑。', 'Plush pupils sitting in a row using computers in a library', [], { same: 'computer' }],
            ['do-your-homework', 'You can do your homework.', '你可以做作业。', 'A plush girl writing in an exercise book at a library table', []],
            ['cant-talk', "But you can't talk to your friends.", '但你不可以和朋友说话。', 'A plush boy in a library holding a finger to his lips, saying shh', []],
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
          title: 'Did you read them?',
          items: [
            ['its-grandma', "Daming, it's Grandma!", '大明，我是奶奶！', 'A plush grandma with grey hair and glasses smiling and talking on the phone', []],
            ['sent-you-a-maths-game', 'I sent you a maths game.', '我给你寄了一个数学游戏。', 'Daming opening a parcel and finding a colourful board game with number cards inside', ['daming']],
            ['did-you-read-them', 'I sent you English books. Did you read them?', '我给你寄了英语书。你读了吗？', 'Daming sitting on a sofa reading one of a pile of new picture books', ['daming']],
            ['american-chocolate', 'And I sent you American chocolate.', '我还给你寄了美国巧克力。', 'A box of chocolates tied with a red, white and blue ribbon with stars', [], { same: 'chocolate-m4' }],
            ['mimi-eating-chocolate', 'Oh, Mimi is eating my chocolate!', '哦，咪咪在吃我的巧克力！', 'A naughty grey cat on a table nibbling a bar of chocolate', [], { same: 'chocolate-m4' }],
            ['did-you-ride-the-bike', 'Did you ride the bike?', '你骑那辆自行车了吗？', 'Daming happily riding a shiny new blue bike', ['daming']],
            ['did-you-fly-the-kite', 'Did you fly the kite?', '你放那只风筝了吗？', 'A plush boy flying a red kite in a windy field', [], { same: 'kite' }],
          ],
        },
        {
          id: 'u2',
          title: 'My favourite season is spring.',
          items: [
            ['spring', 'My favourite season is spring.', '我最喜欢的季节是春天。', 'A spring scene with blossom on the trees and ducks swimming in a river', [], { same: 'spring' }],
            ['summer', 'I love summer. I can go swimming.', '我爱夏天。我可以去游泳。', 'A plush girl swimming in a blue pool under a hot sun', []],
            ['autumn', 'The leaves fall from the trees.', '树叶从树上落下来。', 'A plush boy playing in a pile of orange and red autumn leaves falling from a tree', []],
            ['snow', 'I can play with the snow.', '我可以玩雪。', 'A plush girl in gloves and a scarf building a snowman', [], { same: 'snow' }],
            ['go-skiing', 'I can go skiing in winter.', '冬天我可以去滑雪。', 'A plush boy skiing down a snowy hill with his father', [], { same: 'snow' }],
            ['fly-my-kite-in-spring', 'I can fly my kite in spring.', '春天我可以放风筝。', 'A plush girl flying a kite in a park full of spring flowers', [], { same: ['kite', 'spring'] }],
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
          title: 'Your bag is broken.',
          items: [
            ['your-bag-is-broken', 'Lingling, your bag is broken!', '玲玲，你的包坏了！', 'Lingling holding up a bag with a torn strap and a big hole', ['lingling']],
            ['it-looks-dirty', 'But it looks dirty.', '但它看起来脏。', 'A cheap old bag covered in brown dirty stains on a shop shelf', []],
            ['black-bag-is-heavy', "This black bag is nice. But it's very heavy.", '这个黑包很好看，但很重。', 'In a bag shop, Lingling straining with both hands to lift a big black leather schoolbag with straps and buckles from the shelf, NOT a rubbish bag', ['lingling'], { same: 'heavy' }],
            ['green-one-is-light', "Look at this green one. It's light.", '看这个绿色的，它很轻。', 'Ms Smart holding up a small green bag easily with one finger', ['ms-smart']],
            ['red-bag-with-wheels', 'This red bag has got wheels.', '这个红色的包有轮子。', 'A red bag with little wheels and a pull-up handle', []],
            ['how-much-is-it', 'How much is it?', '它多少钱？', 'Ms Smart asking a plush sales assistant in a shop, pointing at a price tag', ['ms-smart']],
            ['yellow-pencils-broken', 'The yellow pencils are broken.', '黄色的铅笔断了。', 'Three yellow pencils snapped in half on a desk', []],
          ],
        },
        {
          id: 'u2',
          title: 'Mine is pink.',
          items: [
            ['carry-it-on-my-back', 'I carry it on my back.', '我把它背在背上。', 'A plush boy walking with a red and blue schoolbag on his back', []],
            ['carry-with-my-hand', 'I carry it with my hand.', '我用手提着它。', 'A plush girl carrying a brown bag by its handle in one hand', []],
            ['over-my-shoulder', 'Mine is pink. I carry it over my shoulder.', '我的是粉色的。我把它挎在肩上。', 'A plush girl with a pink bag hanging over her shoulder', []],
            ['eight-thin-legs', "It's got eight thin legs.", '它有八条细腿。', 'A friendly spider with eight long thin legs', []],
            ['very-long-ears', "It's got very long ears.", '它有很长的耳朵。', 'A white rabbit with very long ears', []],
            ['very-big-mouth', "It's got a very big mouth.", '它有一张很大的嘴。', 'A hippo with its very big mouth wide open', []],
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
          title: "We'll see lots of very big stones.",
          items: [
            ['big-stones', "We'll see lots of very big stones.", '我们将会看到很多非常大的石头。', 'Lingling and Amy standing small in front of huge grey standing stones on green grass', ['lingling', 'amy'], { same: 'stones' }],
            ['in-a-circle', 'They are in a circle.', '它们围成一个圆圈。', 'Huge grey standing stones arranged in a big circle on a green field, seen from a little above', [], { same: 'stones' }],
            ['circle', 'circle', '圆，圆形', 'A big round red circle drawn with chalk on the ground', []],
            ['three-hours-by-car', 'By car. It will take three hours.', '坐汽车。要花三个小时。', 'A small blue car driving along a long winding country road over green hills', []],
            ['thousand', 'thousand', '一千', 'A big chunky plush toy shaped like the number 1000, four digits side by side, yellow felt, standing up', [], { digits: true }],
            ['great-wall', 'How old is the Great Wall?', '长城有多少年历史了？', 'The Great Wall of China winding over green mountains', [], { same: 'great-wall' }],
          ],
        },
        {
          id: 'u2',
          title: 'It was amazing.',
          items: [
            ['helicopter', 'helicopter', '直升机', 'A single red helicopter flying in a blue sky', [], { same: 'helicopter' }],
            ['helicopter-ride', 'We took a short helicopter ride over Stonehenge!', '我们乘直升机在巨石阵上空短暂飞行了一圈！', 'Lingling waving from the window of a red helicopter flying over a circle of big stones', ['lingling'], { same: ['helicopter', 'stones'] }],
            ['took-nice-photos', 'I took some nice photos there.', '我在那儿拍了一些好看的照片。', 'Lingling holding a camera and taking a photo, smiling', ['lingling']],
            ['went-to-the-great-wall', 'We went to the Great Wall.', '我们去了长城。', 'A plush family walking along the top of the Great Wall', [], { same: 'great-wall' }],
            ['take-a-bike-ride', 'Daming, come and take a bike ride.', '大明，来骑自行车吧。', 'Daming riding a bike along a path in a park', ['daming']],
            ['the-elephant-danced', 'The elephant danced.', '那头大象跳舞了。', 'A grey elephant dancing happily on its back legs', []],
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
          title: "My father goes to work at 8 o'clock every morning.",
          items: [
            ['goes-to-work-at-8', "My father goes to work at 8 o'clock every morning.", '我爸爸每天早上八点去上班。', 'A plush policeman in a blue uniform leaving home in the morning, a clock showing eight o\'clock', [], { digits: true }],
            ['hes-an-actor', "He's an actor.", '他是一名演员。', 'A grown-up plush man actor wearing a king costume with a gold crown and long red cape, bowing on a wooden theatre stage with red velvet curtains on both sides and a bright spotlight on him', [], { same: 'actor' }],
            ['shes-a-nurse', "She's a nurse.", '她是一名护士。', 'A plush nurse in a white uniform walking down a hospital corridor at night', []],
            ['shes-a-taxi-driver', "She's a taxi driver.", '她是一名出租车司机。', 'A plush woman driving a yellow taxi in the early morning', []],
            ['busy', "He's very busy.", '他非常忙。', 'A plush man talking on two phones at once with papers flying around his desk', [], { same: 'busy' }],
            ['evening', 'evening', '傍晚，晚上', 'An orange and purple evening sky with the sun setting behind houses', []],
          ],
        },
        {
          id: 'u2',
          title: "I'll be home at 7 o'clock.",
          items: [
            ['ill-be-home-at-7', "I'll be home at 7 o'clock.", '我会在七点钟到家。', 'A plush dad with short brown hair in a suit opening the front door at seven o\'clock while Sam and Amy run to greet him', ['sam', 'amy'], { digits: true }],
            ['happy-birthday', 'Happy birthday!', '生日快乐！', 'Ms Smart, Sam and Amy holding a birthday cake out to a plush dad with short brown hair in a suit', ['ms-smart', 'sam', 'amy']],
            ['quarter-to-seven', "It's a quarter to seven.", '现在是六点四十五分。', 'A big round clock showing a quarter to seven', [], { digits: true }],
            ['late-and-tired', "I'm late and I'm tired.", '我迟到了，而且很累。', 'A plush man yawning and walking slowly with a briefcase', []],
            ['ill-be-late', "School starts at 8 o'clock. I'll be late.", '八点钟上课。我要迟到了。', 'A plush boy running to school with his schoolbag bouncing, looking at his watch', []],
            ['she-gets-up-at-7', "She gets up at 7 o'clock.", '她七点钟起床。', 'A plush woman stretching as she gets out of bed, an alarm clock ringing beside her', []],
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
          title: 'Will you help me?',
          items: [
            ['will-you-help-me', 'Will you help me? Of course I will.', '你愿意帮我吗？我当然愿意。', 'Daming holding paper and sticks, asking a plush girl with short black hair for help, she nods', ['daming'], { same: 'make-kite' }],
            ['chopsticks', 'What about chopsticks?', '筷子怎么样？', 'A pair of red Chinese chopsticks on a small gift box', [], { same: 'chopsticks' }],
            ['ill-make-a-kite', "Good idea! I'll make a kite!", '好主意！我要做一只风筝！', 'Daming with a happy idea face holding up a kite frame of sticks', ['daming'], { same: 'make-kite' }],
            ['chinese-dragon-kite', "It's a Chinese dragon.", '它是一条中国龙。', 'A long colourful Chinese dragon kite flying in the sky', [], { same: 'dragon' }],
            ['paper-fish', "I'll make a paper fish for her.", '我要给它做一条纸鱼。', 'A plush girl folding an orange paper fish while a cat watches', []],
            ['visit-my-cousin', "I'm going to visit my cousin in New York.", '我要去纽约看望我的表哥。', 'Daming with a suitcase waving goodbye, a plane and tall New York buildings in the background', ['daming']],
          ],
        },
        {
          id: 'u2',
          title: 'I made a kite.',
          items: [
            ['scissors', 'scissors', '剪刀', 'A single pair of scissors with red handles', [], { same: 'scissors' }],
            ['string', 'string', '线，细绳', 'A ball of white string with a loose end', [], { same: 'string' }],
            ['drew-a-dragon', 'I drew a dragon on a piece of yellow paper.', '我在一张黄纸上画了一条龙。', 'A plush girl drawing a dragon with a pencil on a big sheet of yellow paper', [], { same: ['dragon', 'draw'] }],
            ['i-painted-it', 'I painted it.', '我给它涂了颜色。', 'A plush girl painting a dragon picture with a brush and bright colours', [], { same: ['dragon', 'draw'] }],
            ['cut-the-paper', 'I cut the paper with scissors.', '我用剪刀剪纸。', 'A plush girl cutting yellow paper with scissors', [], { same: 'scissors' }],
            ['put-sticks-on-it', 'I put sticks on it.', '我在上面放了棍子。', 'A plush girl gluing two thin sticks onto the back of a paper kite', [], { same: ['stick', 'kite-craft'] }],
            ['tied-strings', 'I tied strings to it.', '我在上面系了线。', 'A plush girl tying a long string to a paper kite', [], { same: ['string', 'kite-craft'] }],
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
          title: 'We laughed a lot.',
          items: [
            ['two-letters', "Wow! I've got two letters in English!", '哇！我收到了两封英文信！', 'Daming happily holding up two envelopes, one in each hand', ['daming']],
            ['childrens-theatre', "Last week, we went to a children's theatre.", '上周我们去了一家儿童剧院。', 'Plush children taking their seats in a theatre with red curtains and a stage', [], { same: 'theatre' }],
            ['men-wore-womens-clothes', "The men wore women's clothes.", '男演员穿着女人的衣服。', "Two plush men actors with moustaches wearing long flowery dresses on a stage", []],
            ['women-wore-mens-clothes', "The women wore men's clothes.", '女演员穿着男人的衣服。', 'Two plush women actors with long hair wearing suits and top hats on a stage', []],
            ['we-laughed-a-lot', 'It was very funny. We laughed a lot.', '非常滑稽。我们笑得很开心。', 'Plush children in theatre seats laughing hard and holding their tummies', [], { same: 'theatre' }],
            ['ate-hamburgers-and-chips', 'We all ate hamburgers and chips.', '我们都吃了汉堡包和薯条。', 'Plush children at a restaurant table eating hamburgers and chips', []],
            ['dog-wore-a-hat', 'I saw a dog. It wore a hat.', '我看见一只狗。它戴着帽子。', 'A funny brown dog wearing a tall blue hat', []],
          ],
        },
        {
          id: 'u2',
          title: 'Mum bought new chopsticks for you.',
          items: [
            ['bought-new-chopsticks', 'Mum bought new chopsticks for you.', '妈妈给你买了新筷子。', 'A plush woman with long brown hair holding up a new pair of chopsticks in a gift box', []],
            ['another-bed', 'Dad put another bed in my room.', '爸爸在我房间里又放了一张床。', 'A plush man with brown hair pushing a second small bed into a bedroom next to the first one', []],
            ['borrowed-a-bike', 'We borrowed a bike for you.', '我们给你借了一辆自行车。', 'A plush boy with brown hair wheeling a bike with a red bow on it', []],
            ['book-about-history', 'Dad read a book about Chinese history.', '爸爸读了一本关于中国历史的书。', 'A plush man with brown hair reading a big book with the Great Wall and a Chinese emperor on the cover', []],
            ['saw-a-koala', 'He saw a koala.', '他看见了一只考拉。', 'A cute grey koala hugging a eucalyptus tree branch', []],
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
          title: 'What did you put in your bag?',
          items: [
            ['ticket', 'ticket', '票', 'A single plane ticket with a small plane picture on it', [], { same: 'plane' }],
            ['passport', 'passport', '护照', 'A single dark red passport booklet', []],
            ['what-did-you-put-in', 'What did you put in your bag?', '你往包里放了什么？', 'Daming packing clothes, shoes and wrapped presents into an open suitcase', ['daming']],
            ['go-to-the-airport', "I'll go to the airport.", '我将去机场。', 'Daming pulling his suitcase towards the big glass doors of an airport terminal building, a control tower and parked planes visible behind it, the airport building clearly shown', ['daming']],
            ['take-the-plane', "Then I'll take the plane to the US.", '然后我会坐飞机去美国。', 'A big white plane taking off into a blue sky', [], { same: 'plane' }],
          ],
        },
        {
          id: 'u2',
          title: 'I played on the beach.',
          items: [
            ['played-on-the-beach', 'I played on the beach.', '我在海滩上玩。', 'A plush girl building a sandcastle on a sunny beach by the sea', []],
            ['made-a-new-friend', 'I made a new friend there.', '我在那儿交了一个新朋友。', 'Two plush girls shaking hands and smiling on a beach', []],
            ['climbed-the-mountain', 'I climbed the mountain and had a picnic.', '我爬了山，还野餐了。', 'Plush children having a picnic on a blanket at the top of a mountain', []],
            ['went-to-the-moon', 'Last night, I went to the moon.', '昨晚我去了月球。', 'A plush boy in a space suit standing on the grey moon, the Earth in the sky', []],
            ['going-by-ship', "I'm going by ship.", '我要坐船去。', 'A big white ship sailing on the blue sea', []],
            ['he-danced', 'We had a party yesterday. He danced.', '我们昨天开了个聚会。他跳舞了。', 'A plush boy dancing at a party with balloons and streamers', []],
          ],
        },
      ],
    },
  ],
}
