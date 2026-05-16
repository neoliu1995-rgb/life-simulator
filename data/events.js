/**
 * 人生事件数据
 * 按年龄段划分：童年(0-6)、少年(7-17)、青年(18-35)、中年(36-55)、老年(56-100)
 */
const LIFE_EVENTS_DATA = {
    // 童年事件 (0-6岁)
    childhood: [
        {
            id: 'c1',
            age: 0,
            text: '你出生了，来到了这个世界。',
            type: 'neutral'
        },
        {
            id: 'c2',
            age: 1,
            text: '你学会了走路，迈出了人生第一步。',
            type: 'positive',
            condition: (attr) => attr.health >= 3
        },
        {
            id: 'c3',
            age: 2,
            text: '你开始牙牙学语，第一次叫出了"妈妈"。',
            type: 'positive'
        },
        {
            id: 'c4',
            age: 3,
            text: '你上幼儿园了，认识了第一个小伙伴。',
            type: 'neutral'
        },
        {
            id: 'c5',
            age: 4,
            text: '你在幼儿园表演节目，获得了大家的掌声。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 5
        },
        {
            id: 'c6',
            age: 5,
            text: '你生了一场大病，在医院住了一段时间。',
            type: 'negative',
            condition: (attr) => attr.health < 4
        },
        {
            id: 'c7',
            age: 6,
            text: '你开始上小学了，背上崭新的书包。',
            type: 'neutral'
        },
        {
            id: 'c8',
            age: 6,
            text: '你被选为班长，成为老师的小助手。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 5 && attr.appearance >= 4
        },
        {
            id: 'c9',
            age: 2,
            text: '你学会了骑自行车，虽然摔了几次。',
            type: 'positive',
            condition: (attr) => attr.health >= 4
        },
        {
            id: 'c10',
            age: 3,
            text: '你第一次去动物园，看到了很多动物。',
            type: 'neutral'
        },
        {
            id: 'c11',
            age: 4,
            text: '你和小伙伴吵架了，但很快就和好了。',
            type: 'neutral',
            condition: (attr) => attr.appearance >= 3
        },
        {
            id: 'c12',
            age: 5,
            text: '你学会了游泳，第一次在水中畅游。',
            type: 'positive',
            condition: (attr) => attr.health >= 5
        },
        {
            id: 'c13',
            age: 6,
            text: '你第一次自己吃饭，虽然弄得一团糟。',
            type: 'neutral'
        }
    ],

    // 少年事件 (7-17岁)
    adolescence: [
        {
            id: 'a1',
            age: 10,
            text: '你在数学竞赛中获得了三等奖。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 6
        },
        {
            id: 'a2',
            age: 12,
            text: '你升入初中，开始了新的学习生活。',
            type: 'neutral'
        },
        {
            id: 'a3',
            age: 13,
            text: '你暗恋了班上的一个同学，但不敢表白。',
            type: 'neutral'
        },
        {
            id: 'a4',
            age: 14,
            text: '你在运动会上获得了跑步冠军。',
            type: 'positive',
            condition: (attr) => attr.health >= 6
        },
        {
            id: 'a5',
            age: 15,
            text: '你升入高中，学习压力变大。',
            type: 'neutral'
        },
        {
            id: 'a6',
            age: 16,
            text: '你参加了高考，考出了不错的成绩。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 5
        },
        {
            id: 'a7',
            age: 16,
            text: '你高考失利，没能考上理想的大学。',
            type: 'negative',
            condition: (attr) => attr.intelligence < 5
        },
        {
            id: 'a8',
            age: 17,
            text: '你第一次谈恋爱，体验了青涩的爱情。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 5
        },
        {
            id: 'a9',
            age: 17,
            text: '你因为早恋被父母发现，挨了一顿骂。',
            type: 'negative',
            condition: (attr) => attr.luck < 4
        },
        {
            id: 'a10',
            age: 8,
            text: '你第一次参加钢琴比赛，获得了优秀奖。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 5
        },
        {
            id: 'a11',
            age: 11,
            text: '你加入了学校的足球队。',
            type: 'neutral',
            condition: (attr) => attr.health >= 5
        },
        {
            id: 'a12',
            age: 12,
            text: '你第一次独自骑自行车上学。',
            type: 'positive',
            condition: (attr) => attr.luck >= 4
        },
        {
            id: 'a13',
            age: 14,
            text: '你学会了弹吉他，开始自己写歌。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 4
        },
        {
            id: 'a14',
            age: 15,
            text: '你和最好的朋友因为小事闹了别扭。',
            type: 'negative',
            condition: (attr) => attr.luck < 5
        },
        {
            id: 'a15',
            age: 17,
            text: '你收到了心仪大学的录取通知书！',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 6 && attr.luck >= 4
        }
    ],

    // 青年事件 (18-35岁)
    youth: [
        {
            id: 'y1',
            age: 18,
            text: '你考上了大学，开始了大学生活。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 4
        },
        {
            id: 'y2',
            age: 20,
            text: '你在大学里遇到了真爱。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 5 && attr.luck >= 4
        },
        {
            id: 'y3',
            age: 22,
            text: '你大学毕业，开始找工作。',
            type: 'neutral'
        },
        {
            id: 'y4',
            age: 23,
            text: '你找到了一份不错的工作。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 5 && attr.luck >= 3
        },
        {
            id: 'y5',
            age: 25,
            text: '你升职加薪，事业蒸蒸日上。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 6
        },
        {
            id: 'y6',
            age: 26,
            text: '你结婚了，组建了自己的家庭。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 4 && attr.wealth >= 3
        },
        {
            id: 'y7',
            age: 28,
            text: '你有了自己的孩子，成为了一名父母。',
            type: 'positive',
            condition: (attr) => attr.health >= 4
        },
        {
            id: 'y8',
            age: 30,
            text: '你买了人生中第一套房子。',
            type: 'positive',
            condition: (attr) => attr.wealth >= 6
        },
        {
            id: 'y9',
            age: 32,
            text: '你创业失败，损失了一大笔钱。',
            type: 'negative',
            condition: (attr) => attr.luck < 4 && attr.wealth >= 5
        },
        {
            id: 'y10',
            age: 35,
            text: '你遭遇了中年危机，开始思考人生的意义。',
            type: 'neutral'
        },
        {
            id: 'y11',
            age: 19,
            text: '你加入了大学社团，认识了很多朋友。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 4
        },
        {
            id: 'y12',
            age: 21,
            text: '你第一次出国旅游，看了很多风景。',
            type: 'neutral',
            condition: (attr) => attr.wealth >= 4
        },
        {
            id: 'y13',
            age: 24,
            text: '你获得了公司的年度优秀员工奖。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 5 && attr.luck >= 3
        },
        {
            id: 'y14',
            age: 27,
            text: '你和伴侣一起买了第一辆车。',
            type: 'positive',
            condition: (attr) => attr.wealth >= 5
        },
        {
            id: 'y15',
            age: 29,
            text: '你被公司派往国外进修学习。',
            type: 'positive',
            condition: (attr) => attr.wealth >= 4 && attr.luck >= 4
        },
        {
            id: 'y16',
            age: 31,
            text: '你遭遇了职场竞争，差点失去工作。',
            type: 'negative',
            condition: (attr) => attr.luck < 3
        }
    ],

    // 中年事件 (36-55岁)
    middleAge: [
        {
            id: 'm1',
            age: 38,
            text: '你的事业达到了巅峰，成为行业精英。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 7 && attr.luck >= 5
        },
        {
            id: 'm2',
            age: 40,
            text: '你开始注重健康，养成了锻炼的习惯。',
            type: 'positive',
            condition: (attr) => attr.health >= 5
        },
        {
            id: 'm3',
            age: 42,
            text: '你的孩子考上了重点大学。',
            type: 'positive',
            condition: (attr) => attr.wealth >= 5 && attr.luck >= 4
        },
        {
            id: 'm4',
            age: 45,
            text: '你被公司裁员，失去了工作。',
            type: 'negative',
            condition: (attr) => attr.luck < 3
        },
        {
            id: 'm5',
            age: 48,
            text: '你被查出患有慢性病，需要长期服药。',
            type: 'negative',
            condition: (attr) => attr.health < 4
        },
        {
            id: 'm6',
            age: 50,
            text: '你的父母相继去世，你成了家里的顶梁柱。',
            type: 'negative'
        },
        {
            id: 'm7',
            age: 52,
            text: '你开始规划退休生活。',
            type: 'neutral'
        },
        {
            id: 'm8',
            age: 55,
            text: '你退休了，开始了新的人生阶段。',
            type: 'neutral'
        },
        {
            id: 'm9',
            age: 37,
            text: '你被提拔为部门经理，管理几十人。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 6 && attr.wealth >= 4
        },
        {
            id: 'm10',
            age: 41,
            text: '你参加了同学聚会，见到了很多老朋友。',
            type: 'neutral',
            condition: (attr) => attr.appearance >= 4
        },
        {
            id: 'm11',
            age: 44,
            text: '你投资了一套房产，增值不少。',
            type: 'positive',
            condition: (attr) => attr.wealth >= 5 && attr.luck >= 4
        },
        {
            id: 'm12',
            age: 47,
            text: '你和家人一起去国外度假了。',
            type: 'neutral',
            condition: (attr) => attr.wealth >= 4
        },
        {
            id: 'm13',
            age: 51,
            text: '你的孩子结婚了，你升级为爷爷奶奶。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 3 && attr.luck >= 3
        }
    ],

    // 老年事件 (56-100岁)
    oldAge: [
        {
            id: 'o1',
            age: 58,
            text: '你开始享受退休生活，每天遛鸟下棋。',
            type: 'positive'
        },
        {
            id: 'o2',
            age: 60,
            text: '你有了孙子孙女，享受天伦之乐。',
            type: 'positive',
            condition: (attr) => attr.luck >= 3
        },
        {
            id: 'o3',
            age: 65,
            text: '你开始写回忆录，记录自己的一生。',
            type: 'neutral',
            condition: (attr) => attr.intelligence >= 5
        },
        {
            id: 'o4',
            age: 70,
            text: '你的身体开始走下坡路，经常去医院。',
            type: 'negative',
            condition: (attr) => attr.health < 5
        },
        {
            id: 'o5',
            age: 75,
            text: '你依然精神矍铄，每天坚持锻炼。',
            type: 'positive',
            condition: (attr) => attr.health >= 6
        },
        {
            id: 'o6',
            age: 80,
            text: '你迎来了八十大寿，儿孙满堂。',
            type: 'positive',
            condition: (attr) => attr.luck >= 4
        },
        {
            id: 'o7',
            age: 85,
            text: '你安详地度过了晚年时光。',
            type: 'neutral'
        },
        {
            id: 'o8',
            age: 90,
            text: '你成为了百岁老人，被媒体报道。',
            type: 'positive',
            condition: (attr) => attr.health >= 7 && attr.luck >= 5
        },
        {
            id: 'o9',
            age: 57,
            text: '你报名参加了老年大学，学习绘画。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 3
        },
        {
            id: 'o10',
            age: 62,
            text: '你和老伴一起去了很多地方旅游。',
            type: 'neutral',
            condition: (attr) => attr.wealth >= 4
        },
        {
            id: 'o11',
            age: 68,
            text: '你经常和老朋友一起打牌聊天。',
            type: 'positive',
            condition: (attr) => attr.appearance >= 3
        },
        {
            id: 'o12',
            age: 72,
            text: '你的听力和视力开始下降了。',
            type: 'negative',
            condition: (attr) => attr.health < 4
        },
        {
            id: 'o13',
            age: 78,
            text: '你把自己的人生经历写成了一本书。',
            type: 'positive',
            condition: (attr) => attr.intelligence >= 6 && attr.luck >= 4
        },
        {
            id: 'o14',
            age: 82,
            text: '你看到了重孙，四世同堂。',
            type: 'positive',
            condition: (attr) => attr.health >= 5 && attr.luck >= 5
        }
    ]
};

/**
 * 关键选择事件
 */
const CHOICE_EVENTS = [
    {
        id: 'choice1',
        age: 6,
        text: '你在学校被同学欺负了，你会怎么做？',
        choices: [
            { text: '告诉老师', effect: { intelligence: 1 }, result: '老师批评了那个同学，你学会了用智慧解决问题。' },
            { text: '打回去', effect: { health: 1 }, result: '你虽然受了点伤，但赢得了尊重。' },
            { text: '忍气吞声', effect: { luck: -1 }, result: '你选择了忍耐，但心里留下了阴影。' }
        ]
    },
    {
        id: 'choice2',
        age: 12,
        text: '你有机会参加一个特长培训班，你会选择什么？',
        choices: [
            { text: '奥数班', effect: { intelligence: 2 }, result: '你的数学能力得到了很大提升。' },
            { text: '体育班', effect: { health: 2 }, result: '你的身体素质变得更好了。' },
            { text: '艺术班', effect: { appearance: 1, luck: 1 }, result: '你培养了艺术气质，变得更自信了。' }
        ]
    },
    {
        id: 'choice3',
        age: 16,
        text: '高考前夕，你如何安排自己的时间？',
        choices: [
            { text: '拼命学习', effect: { intelligence: 2, health: -1 }, result: '你的成绩提高了，但身体有些吃不消。' },
            { text: '劳逸结合', effect: { intelligence: 1, health: 1 }, result: '你保持了良好的状态，发挥稳定。' },
            { text: '放松心态', effect: { luck: 1 }, result: '你心态很好，但成绩提升有限。' }
        ]
    },
    {
        id: 'choice4',
        age: 22,
        text: '大学毕业了，你面临什么选择？',
        choices: [
            { text: '找工作', effect: { wealth: 1 }, result: '你找到了一份稳定的工作。' },
            { text: '考研', effect: { intelligence: 2 }, result: '你继续深造，提升了学历。' },
            { text: '创业', effect: { luck: 2, wealth: -1 }, result: '你选择了冒险，未来充满未知。' }
        ]
    },
    {
        id: 'choice5',
        age: 28,
        text: '你有机会出国工作，但需要离开家人，你会怎么做？',
        choices: [
            { text: '出国发展', effect: { wealth: 2, luck: 1 }, result: '你在国外获得了更好的发展机会。' },
            { text: '留在国内', effect: { luck: 1 }, result: '你陪伴在家人身边，家庭幸福美满。' },
            { text: '带家人一起', effect: { wealth: 1, health: -1 }, result: '你们一起出国，虽然辛苦但很充实。' }
        ]
    },
    {
        id: 'choice6',
        age: 35,
        text: '你有机会投资一个项目，但风险很大，你会怎么做？',
        choices: [
            { text: '大胆投资', effect: { wealth: 3, luck: -1 }, result: '投资成功了，你获得了丰厚的回报。' },
            { text: '小额尝试', effect: { wealth: 1 }, result: '你谨慎投资，获得了稳定的收益。' },
            { text: '放弃投资', effect: { luck: 1 }, result: '你选择了稳妥，避免了潜在的风险。' }
        ]
    },
    {
        id: 'choice7',
        age: 45,
        text: '你被查出有潜在健康问题，医生建议改变生活方式，你会怎么做？',
        choices: [
            { text: '严格自律', effect: { health: 3 }, result: '你坚持锻炼和健康饮食，身体逐渐好转。' },
            { text: '适度调整', effect: { health: 1 }, result: '你做了一些改变，身体状况稳定。' },
            { text: '我行我素', effect: { health: -2 }, result: '你没有改变，身体状况继续恶化。' }
        ]
    },
    {
        id: 'choice8',
        age: 60,
        text: '退休后，你想如何度过余生？',
        choices: [
            { text: '环游世界', effect: { luck: 2, wealth: -1 }, result: '你见识了世界各地的风土人情。' },
            { text: '含饴弄孙', effect: { luck: 1 }, result: '你和家人在一起，享受天伦之乐。' },
            { text: '发展爱好', effect: { intelligence: 1, health: 1 }, result: '你学习了新技能，生活充实有趣。' }
        ]
    },
    {
        id: 'choice9',
        age: 9,
        text: '你想参加学校的兴趣小组，选择什么？',
        choices: [
            { text: '绘画小组', effect: { appearance: 1 }, result: '你画得越来越好，作品还被展出了。' },
            { text: '编程小组', effect: { intelligence: 2 }, result: '你学会了编程，自己做了个小游戏。' },
            { text: '体育小组', effect: { health: 1 }, result: '你身体更健康了，还参加了校运会。' }
        ]
    },
    {
        id: 'choice10',
        age: 18,
        text: '你想选一个专业，选什么？',
        choices: [
            { text: '计算机专业', effect: { intelligence: 2, wealth: 1 }, result: '你找到了好工作，收入很不错。' },
            { text: '医学专业', effect: { health: 2 }, result: '你成了医生，帮助了很多人。' },
            { text: '艺术专业', effect: { appearance: 2, luck: 1 }, result: '你成了艺术家，作品受到认可。' }
        ]
    },
    {
        id: 'choice11',
        age: 24,
        text: '你想提升自己，选择什么方式？',
        choices: [
            { text: '考研读博', effect: { intelligence: 3 }, result: '你获得了更高的学历，在学术上有所成就。' },
            { text: '工作晋升', effect: { wealth: 2 }, result: '你在职场上稳步发展，薪资不断增长。' },
            { text: '学习新技能', effect: { intelligence: 1, luck: 1 }, result: '你学会了很多技能，成为多面手。' }
        ]
    },
    {
        id: 'choice12',
        age: 30,
        text: '你和伴侣有矛盾，怎么解决？',
        choices: [
            { text: '沟通解决', effect: { appearance: 1, luck: 2 }, result: '你们的感情更好了。' },
            { text: '各自冷静', effect: { health: 1 }, result: '双方都想清楚了，关系有所缓和。' },
            { text: '分手', effect: { luck: -1 }, result: '你恢复了单身，可能错过好姻缘。' }
        ]
    },
    {
        id: 'choice13',
        age: 40,
        text: '你面临职业瓶颈，怎么选择？',
        choices: [
            { text: '转行', effect: { intelligence: 2, wealth: -1 }, result: '你在新的行业找到了机会。' },
            { text: '继续坚持', effect: { wealth: 1, luck: 1 }, result: '你在原岗位坚守，后来取得了突破。' },
            { text: '创业', effect: { luck: 2, wealth: -2 }, result: '你开始自己创业，虽然辛苦但很有成就感。' }
        ]
    },
    {
        id: 'choice14',
        age: 55,
        text: '你面临退休，怎么规划？',
        choices: [
            { text: '退休享福', effect: { health: 2, luck: 1 }, result: '你安享晚年，健康长寿。' },
            { text: '返聘工作', effect: { wealth: 1, health: -1 }, result: '你继续发挥余热，帮助后辈。' },
            { text: '实现梦想', effect: { intelligence: 1, luck: 2 }, result: '你完成了年轻时的梦想，没有遗憾。' }
        ]
    },
    {
        id: 'choice15',
        age: 75,
        text: '你想处理遗产，怎么安排？',
        choices: [
            { text: '给子女', effect: { wealth: -2, luck: 2 }, result: '子女们很感激你，家庭和睦。' },
            { text: '做慈善', effect: { luck: 3 }, result: '你做了很多好事，受到大家的尊敬。' },
            { text: '留给自己养老', effect: { health: 1, wealth: 1 }, result: '你晚年生活无忧，过得很舒适。' }
        ]
    }
];

/**
 * 根据属性生成人生事件
 * @param {Object} attributes - 属性值
 * @param {number} currentAge - 当前年龄
 * @returns {Array} 事件列表
 */
function generateLifeEvents(attributes, currentAge = 0) {
    const events = [];
    let age = 0;
    
    // 确定最终年龄（基于体质和运气）
    const baseAge = 70;
    const healthBonus = attributes.health * 2;
    const luckBonus = attributes.luck;
    const maxAge = Math.min(100, Math.max(50, baseAge + healthBonus + luckBonus + Math.floor(Math.random() * 10)));
    
    // 按阶段生成事件
    const stages = [
        { name: 'childhood', range: [0, 6], data: LIFE_EVENTS_DATA.childhood },
        { name: 'adolescence', range: [7, 17], data: LIFE_EVENTS_DATA.adolescence },
        { name: 'youth', range: [18, 35], data: LIFE_EVENTS_DATA.youth },
        { name: 'middleAge', range: [36, 55], data: LIFE_EVENTS_DATA.middleAge },
        { name: 'oldAge', range: [56, 100], data: LIFE_EVENTS_DATA.oldAge }
    ];
    
    // 生成各阶段事件
    for (const stage of stages) {
        const stageEvents = stage.data.filter(event => {
            if (event.condition) {
                return event.condition(attributes);
            }
            return true;
        });
        
        for (const event of stageEvents) {
            if (event.age <= maxAge) {
                events.push({
                    ...event,
                    stage: stage.name
                });
            }
        }
    }
    
    // 添加关键选择
    for (const choice of CHOICE_EVENTS) {
        if (choice.age <= maxAge) {
            events.push({
                ...choice,
                type: 'choice',
                stage: getStageByAge(choice.age)
            });
        }
    }
    
    // 按年龄排序
    events.sort((a, b) => a.age - b.age);
    
    // 添加死亡事件
    events.push({
        id: 'death',
        age: maxAge,
        text: `你的人生走到了终点，享年${maxAge}岁。`,
        type: 'death'
    });
    
    return events;
}

/**
 * 根据年龄获取阶段
 */
function getStageByAge(age) {
    if (age <= 6) return 'childhood';
    if (age <= 17) return 'adolescence';
    if (age <= 35) return 'youth';
    if (age <= 55) return 'middleAge';
    return 'oldAge';
}

/**
 * 获取阶段名称
 */
function getStageName(stage) {
    const names = {
        childhood: '童年',
        adolescence: '少年',
        youth: '青年',
        middleAge: '中年',
        oldAge: '老年'
    };
    return names[stage] || '未知';
}
