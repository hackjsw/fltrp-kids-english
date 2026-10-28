// 一年级上册 Module 3–10。Module 1–2 已在 content/books/1a/book.json 里，build 时保留。
// 每项：[id, 英文, 中文, 画面描述, 参考人物?, 选项?]
// 参考人物写 style.json 里的人物 key；选项 same=同义组（不互为干扰项），digits=画面里要有数字
export default {
  id: '1a',
  title: '一年级上册',
  subtitle: '新标准英语（一年级起点）',
  source: 'textbooks/1a.pdf（TapXWorld/ChinaTextbook），词句取自课文和书后 Words and Expressions in Each Module',
  modules: [
    {
      id: 'm3',
      title: 'Module 3',
      units: [
        {
          id: 'u1',
          title: 'Sit down!',
          items: [
            ['sit-down', 'Sit down!', '坐下！', 'Lingling sitting down on a small wooden classroom chair, hands on her knees', ['lingling']],
            ['stand-up', 'Stand up!', '起立！', 'Daming standing up straight next to a small classroom chair, arms by his sides', ['daming']],
            ['open-the-window', 'Open the window!', '打开窗户！', 'Lingling pushing open a big classroom window, fresh breeze and a bird outside', ['lingling'], { same: 'window' }],
            ['open-the-door', 'Open the door!', '开门！', 'Sam opening a round-topped felt door, peeking through', ['sam'], { same: 'door' }],
            ['see-you', 'See you!', '再见！', 'Amy waving goodbye to a small blue bird flying away out of a window', ['amy']],
          ],
        },
        {
          id: 'u2',
          title: 'Point to the window!',
          items: [
            ['window', 'window', '窗户', 'A single plush classroom window with a light blue frame, closed, sky and a cloud seen through it', [], { same: 'window' }],
            ['door', 'door', '门', 'A single plush wooden door with a round knob, closed, standing on its own', [], { same: 'door' }],
            ['desk', 'desk', '书桌', 'A single small plush school desk, empty top', []],
            ['chair', 'chair', '椅子', 'A single small plush school chair', []],
            ['point-to-the-window', 'Point to the window!', '指向窗户！', 'Sam pointing with his arm stretched toward a window', ['sam'], { same: 'window' }],
            ['point-to-the-door', 'Point to the door!', '指向门！', 'Amy pointing with her arm stretched toward a door', ['amy'], { same: 'door' }],
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
          title: "It's red.",
          items: [
            ['red', 'red', '红色', 'One round plush balloon, bright RED, with a string', [], { same: 'red' }],
            ['blue', 'blue', '蓝色', 'One round plush balloon, bright BLUE, with a string', [], { same: 'blue' }],
            ['yellow', 'yellow', '黄色', 'One round plush balloon, bright YELLOW, with a string', [], { same: 'yellow' }],
            ['green', 'green', '绿色', 'One round plush balloon, bright GREEN, with a string', [], { same: 'green' }],
            ['black', 'black', '黑色', 'One round plush balloon, BLACK, with a string', [], { same: 'black' }],
            ['white', 'white', '白色', 'One round plush balloon, pure WHITE with a soft grey outline, with a string, on a very light blue background so it stands out', []],
          ],
        },
        {
          id: 'u2',
          title: "It's a red dog.",
          items: [
            ['orange', 'orange', '橙色', 'One round plush balloon, bright ORANGE, with a string', [], { same: 'orange' }],
            ['red-dog', "It's a red dog.", '这是一只红色的狗。', 'A cute plush puppy that is entirely RED', [], { same: 'red' }],
            ['green-cat', 'A green cat!', '一只绿色的猫！', 'A cute plush kitten that is entirely GREEN', [], { same: 'green' }],
            ['blue-cat', 'And a blue cat!', '还有一只蓝色的猫！', 'A cute plush kitten that is entirely BLUE', [], { same: 'blue' }],
            ['orange-cat', "It's an orange cat.", '这是一只橙色的猫。', 'A cute plush kitten that is entirely ORANGE', [], { same: 'orange' }],
            ['yellow-black-dog', 'A yellow and black dog.', '一只黄黑相间的狗。', 'A cute plush puppy with YELLOW fur and big BLACK spots', [], { same: ['yellow', 'black'] }],
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
          title: 'This is our teacher.',
          items: [
            ['our-school', 'This is our school.', '这是我们的学校。', 'A small cute plush school building with a red roof, a clock and a flag, a little path in front', []],
            ['my-classroom', 'This is my classroom.', '这是我的教室。', 'Inside a cosy plush classroom: rows of small desks, a green blackboard, sunny windows, no people', []],
            ['our-teacher', 'This is our teacher.', '这是我们的老师。', 'Ms Smart standing in front of a blank green blackboard, smiling and holding a book', ['ms-smart']],
            ['my-desk', 'This is my desk.', '这是我的书桌。', 'Daming standing next to his small school desk, one hand on it proudly', ['daming']],
            ['my-chair', 'And this is my chair.', '这是我的椅子。', 'Lingling patting the back of her small school chair, smiling', ['lingling']],
            ['nice-to-meet-you', 'Nice to meet you.', '见到你很高兴。', 'Sam and Daming shaking hands and smiling at each other', ['sam', 'daming']],
          ],
        },
        {
          id: 'u2',
          title: 'That is a yellow cat.',
          items: [
            ['bag', 'That is a bag.', '那是一个包。', 'A single cute plush bag with a strap, light purple', []],
            ['white-cat', 'This is a white cat.', '这是一只白色的猫。', 'A cute plush kitten that is entirely WHITE, on a very light blue background so it stands out', []],
            ['yellow-cat', 'That is a yellow cat.', '那是一只黄色的猫。', 'A cute plush kitten that is entirely YELLOW', []],
            ['blue-dog', 'This is a blue dog.', '这是一只蓝色的狗。', 'A cute plush puppy that is entirely BLUE', []],
            ['black-dog', 'That is a black dog.', '那是一只黑色的狗。', 'A cute plush puppy that is entirely BLACK', []],
            ['cat-in-a-hat', "I'm a cat in a hat.", '我是戴帽子的猫。', 'A cute plush grey kitten wearing a tall red and white striped hat', []],
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
          title: "What's this?",
          items: [
            ['whats-this', "What's this?", '这是什么？', 'Sam looking curiously at a small closed gift box, a plush question mark floating above', ['sam']],
            ['schoolbag', 'schoolbag', '书包', 'A single cute plush school backpack, bright blue', []],
            ['book', 'book', '书', 'A single cute plush closed picture book, red cover, no letters', []],
            ['pen', 'pen', '钢笔', 'A single cute plush fountain pen, dark blue', []],
            ['pencil', 'pencil', '铅笔', 'A single cute plush yellow pencil with a pink eraser tip', []],
            ['ruler', 'ruler', '尺子', 'A single cute plush straight ruler, light green, with tick marks but no numbers', [], { same: 'ruler' }],
          ],
        },
        {
          id: 'u2',
          title: "It's my ruler.",
          items: [
            ['eraser', 'eraser', '橡皮', 'A single cute plush eraser, white and pink block', []],
            ['pencil-case', 'pencil case', '铅笔盒', 'A single plain plush zip pencil case, orange fabric with a zipper along the top, no face, no eyes, no animal features', []],
            ['crayon', 'crayon', '蜡笔', 'Three cute plush crayons: red, blue and green, lying side by side', []],
            ['its-my-ruler', "It's my ruler.", '这是我的尺子。', 'Amy holding up a light green ruler proudly with both hands', ['amy'], { same: 'ruler' }],
            ['its-my-pencil-case', "It's my pencil case.", '这是我的铅笔盒。', 'Lingling hugging an orange pencil case to her chest', ['lingling']],
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
          title: 'Is it a dog?',
          items: [
            ['kite', 'kite', '风筝', 'A single cute plush diamond-shaped kite, rainbow colours, with a ribbon tail, flying in a light sky', [], { same: 'kite' }],
            ['monkey', 'monkey', '猴子', 'A single cute plush brown monkey sitting', [], { same: 'monkey' }],
            ['monster', 'monster', '怪物', 'A single cute friendly plush little monster, purple, one big eye, small horns, not scary', []],
            ['cat-kite', "Oh, it's a cat kite.", '哦，是一个猫咪风筝。', 'A plush kite shaped like a cat face, flying with a ribbon tail', [], { same: 'kite' }],
            ['help', 'Help!', '救命！', 'Sam running away with a funny scared face, arms in the air, a big kite shadow behind him', ['sam']],
          ],
        },
        {
          id: 'u2',
          title: "It's a yellow cat.",
          items: [
            ['orange-box', "It's an orange box.", '这是一个橙色的箱子。', 'A single plush ORANGE box with a lid', []],
            ['orange-house', 'Is it an orange house?', '它是一座橙色的房子吗？', 'A small cute plush ORANGE house with a brown roof and a round window', []],
            ['black-monkey', "It's a black monkey.", '这是一只黑色的猴子。', 'A cute plush monkey that is entirely BLACK', [], { same: 'monkey' }],
            ['red-book', "It's a red book!", '这是一本红色的书！', 'A plush RED book standing open slightly, no letters', []],
            ['red-kite', "It's a red kite.", '这是一个红色的风筝。', 'A plush RED diamond kite with a ribbon tail flying', [], { same: 'kite' }],
            ['yellow-cat-box', 'No, it\'s a yellow cat.', '不，它是一只黄色的猫。', 'A yellow plush kitten popping out of a box, surprised', []],
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
          title: 'How many?',
          items: [
            ['one', 'one', '一', 'A big chunky plush toy shaped like the digit 1, red felt, standing up', [], { digits: true, same: 'one' }],
            ['two', 'two', '二', 'A big chunky plush toy shaped like the digit 2, orange felt, standing up', [], { digits: true }],
            ['three', 'three', '三', 'A big chunky plush toy shaped like the digit 3, yellow felt, standing up', [], { digits: true }],
            ['four', 'four', '四', 'A big chunky plush toy shaped like the digit 4, green felt, standing up', [], { digits: true }],
            ['five', 'five', '五', 'A big chunky plush toy shaped like the digit 5, blue felt, standing up', [], { digits: true, same: 'five' }],
            ['how-many', 'How many?', '多少个？', 'Daming counting on his fingers with a curious face, a few plush apples in front of him', ['daming']],
          ],
        },
        {
          id: 'u2',
          title: 'How many pink balls?',
          items: [
            ['six', 'six', '六', 'A big chunky plush toy shaped like the digit 6, purple felt, standing up', [], { digits: true }],
            ['seven', 'seven', '七', 'A big chunky plush toy shaped like the digit 7, pink felt, standing up', [], { digits: true }],
            ['eight', 'eight', '八', 'A big chunky plush toy shaped like the digit 8, light blue felt, standing up', [], { digits: true }],
            ['nine', 'nine', '九', 'A big chunky plush toy shaped like the digit 9, lime green felt, standing up', [], { digits: true }],
            ['ten', 'ten', '十', 'A big chunky plush toy shaped like the number 10, two digits side by side, red and yellow felt, standing up', [], { digits: true }],
            ['five-pink-balls', 'Five pink balls.', '五个粉色的球。', 'Exactly five big round PINK plush balls filling the whole picture, arranged in a neat pyramid of three on the bottom and two on top', [], { same: 'five' }],
            ['one-brown-ball', 'One brown ball.', '一个棕色的球。', 'Exactly one round BROWN plush ball', [], { same: 'one' }],
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
          title: 'How old are you?',
          items: [
            ['how-old-are-you', 'How old are you?', '你几岁了？', 'Ms Smart bending down and smiling, asking Lingling a question, a plush question mark between them', ['ms-smart', 'lingling']],
            ['im-six', "I'm six.", '我六岁。', 'Daming holding a big plush balloon shaped like the digit 6', ['daming'], { digits: true }],
            ['im-seven', "I'm seven.", '我七岁。', 'Amy holding a big plush balloon shaped like the digit 7', ['amy'], { digits: true }],
            ['im-ten', "I'm ten.", '我十岁。', 'Sam holding a big plush balloon shaped like the number 10', ['sam'], { digits: true }],
            ['im-three', "I'm three.", '我三岁。', 'A tiny plush toddler girl in a yellow romper holding a big plush balloon shaped like the digit 3', [], { digits: true }],
          ],
        },
        {
          id: 'u2',
          title: 'Happy birthday!',
          items: [
            ['happy-birthday', 'Happy birthday!', '生日快乐！', 'A plush birthday cake with pink frosting, candles lit, colourful confetti around', []],
            ['pen-for-you', 'A pen for you.', '送给你一支钢笔。', 'Sam handing a small gift: a dark blue pen with a red ribbon bow', ['sam']],
            ['book-for-you', 'A book for you.', '送给你一本书。', 'Lingling handing a red book wrapped with a yellow ribbon bow', ['lingling']],
            ['thank-you', 'Thank you.', '谢谢你。', 'Amy holding a wrapped present, bowing slightly with a grateful smile', ['amy']],
            ['youre-welcome', "You're welcome!", '不客气！', 'Daming smiling warmly with one hand open in a friendly welcoming gesture', ['daming']],
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
          title: 'That is my father.',
          items: [
            ['father', 'father', '父亲', 'A friendly plush dad with short brown hair and a beard, blue sweater', [], { same: 'father' }],
            ['mother', 'mother', '母亲', 'A friendly plush mum with long wavy brown hair, green dress', []],
            ['grandpa', 'grandpa', '爷爷；外公', 'A friendly plush grandpa with white hair, round glasses and a walking stick, brown vest', []],
            ['grandma', 'grandma', '奶奶；外婆', 'A friendly plush grandma with a grey hair bun, purple cardigan, holding knitting', []],
            ['friend', 'friend', '朋友', 'Daming and Sam with arms around each other\'s shoulders, laughing together', ['daming', 'sam']],
            ['that-is-my-father', 'That is my father.', '那是我的爸爸。', 'Sam pointing happily at his dad (short brown hair, beard, blue sweater) standing a little behind him', ['sam'], { same: 'father' }],
          ],
        },
        {
          id: 'u2',
          title: 'That is his car.',
          items: [
            ['sister', 'sister', '姐妹', 'Two plush girls who look alike, a big sister holding her little sister\'s hand', []],
            ['brother', 'brother', '兄弟', 'Two plush boys who look alike, a big brother with his arm around his little brother', []],
            ['his-car', 'That is his car.', '那是他的汽车。', 'A plush boy standing proudly next to a small round red toy car', []],
            ['his-ball', 'That is his ball.', '那是他的球。', 'A plush boy holding a striped beach ball', []],
            ['her-bag', 'That is her bag.', '那是她的包。', 'A plush girl carrying a pink handbag on her arm', []],
            ['her-desk', 'That is her desk.', '那是她的书桌。', 'A plush girl sitting at a small desk, drawing', []],
          ],
        },
      ],
    },
  ],
}
