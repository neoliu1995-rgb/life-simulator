/**
 * 天赋数据
 * type: 'common' | 'rare' | 'negative'
 * effect: 对属性的影响
 */
const TALENTS_DATA = [
    // 普通天赋
    {
        id: 't1',
        name: '天生丽质',
        description: '你天生就有一副好皮囊，走到哪里都引人注目。',
        type: 'common',
        effect: { appearance: 2 },
        rarity: 1
    },
    {
        id: 't2',
        name: '聪明伶俐',
        description: '你的大脑运转速度比别人快一拍。',
        type: 'common',
        effect: { intelligence: 2 },
        rarity: 1
    },
    {
        id: 't3',
        name: '身强体壮',
        description: '你从小就很健康，很少生病。',
        type: 'common',
        effect: { health: 2 },
        rarity: 1
    },
    {
        id: 't4',
        name: '家境殷实',
        description: '你的家庭条件不错，从小衣食无忧。',
        type: 'common',
        effect: { wealth: 2 },
        rarity: 1
    },
    {
        id: 't5',
        name: '福星高照',
        description: '你总是能在关键时刻遇到好运。',
        type: 'common',
        effect: { luck: 2 },
        rarity: 1
    },
    {
        id: 't6',
        name: '艺术细胞',
        description: '你对艺术有着独特的感知力。',
        type: 'common',
        effect: { intelligence: 1, luck: 1 },
        rarity: 1
    },
    {
        id: 't7',
        name: '社交达人',
        description: '你很擅长与人打交道，朋友众多。',
        type: 'common',
        effect: { appearance: 1, luck: 1 },
        rarity: 1
    },
    {
        id: 't20',
        name: '运动健将',
        description: '你在体育方面很有天赋，运动细胞发达。',
        type: 'common',
        effect: { health: 1, appearance: 1 },
        rarity: 1
    },
    {
        id: 't21',
        name: '理财高手',
        description: '你对金钱很敏感，总能抓住赚钱机会。',
        type: 'common',
        effect: { intelligence: 1, wealth: 1 },
        rarity: 1
    },
    {
        id: 't22',
        name: '乐观开朗',
        description: '你总是保持积极乐观，很少有烦恼。',
        type: 'common',
        effect: { health: 1, luck: 1 },
        rarity: 1
    },
    {
        id: 't23',
        name: '学霸体质',
        description: '你学习能力强，考试成绩总是名列前茅。',
        type: 'common',
        effect: { intelligence: 1, wealth: 1 },
        rarity: 1
    },

    // 稀有天赋
    {
        id: 't8',
        name: '天选之人',
        description: '命运似乎特别眷顾你，好事总会发生。',
        type: 'rare',
        effect: { luck: 5 },
        rarity: 3
    },
    {
        id: 't9',
        name: '天才少年',
        description: '你的智商远超常人，学什么都快。',
        type: 'rare',
        effect: { intelligence: 4, health: -1 },
        rarity: 3
    },
    {
        id: 't10',
        name: '富二代',
        description: '你出生在富裕家庭，人生起点就比别人高。',
        type: 'rare',
        effect: { wealth: 5 },
        rarity: 3
    },
    {
        id: 't11',
        name: '不死之身',
        description: '你的生命力极其顽强，总能化险为夷。',
        type: 'rare',
        effect: { health: 4, luck: 1 },
        rarity: 3
    },
    {
        id: 't12',
        name: '万人迷',
        description: '你的魅力无法抵挡，所有人都喜欢你。',
        type: 'rare',
        effect: { appearance: 4, luck: 1 },
        rarity: 3
    },
    {
        id: 't13',
        name: '幸运儿',
        description: '彩票、抽奖、考试，你总能有好运。',
        type: 'rare',
        effect: { luck: 3, wealth: 2 },
        rarity: 3
    },
    {
        id: 't24',
        name: '时空旅人',
        description: '你似乎能预知一些事情的发生。',
        type: 'rare',
        effect: { intelligence: 2, luck: 2 },
        rarity: 3
    },
    {
        id: 't25',
        name: '创业天才',
        description: '你有非凡的商业头脑，总能发现商机。',
        type: 'rare',
        effect: { intelligence: 2, wealth: 3 },
        rarity: 3
    },
    {
        id: 't26',
        name: '长生不老',
        description: '你的寿命远超常人，总能看到更多风景。',
        type: 'rare',
        effect: { health: 3, luck: 2 },
        rarity: 3
    },
    {
        id: 't27',
        name: '预言家',
        description: '你的直觉很准，总能提前察觉到危险。',
        type: 'rare',
        effect: { intelligence: 3, luck: 1 },
        rarity: 3
    },
    {
        id: 't28',
        name: '贵族血统',
        description: '你来自显赫家族，天生就比别人起点高。',
        type: 'rare',
        effect: { wealth: 4, appearance: 1 },
        rarity: 3
    },

    // 负面天赋
    {
        id: 't14',
        name: '天生残疾',
        description: '你出生时就带有身体缺陷。',
        type: 'negative',
        effect: { health: -3, appearance: -1 },
        rarity: 1
    },
    {
        id: 't15',
        name: '家境贫寒',
        description: '你的家庭非常贫困，从小就要吃苦。',
        type: 'negative',
        effect: { wealth: -3 },
        rarity: 1
    },
    {
        id: 't16',
        name: '厄运缠身',
        description: '你似乎总是倒霉，坏事总会找上门。',
        type: 'negative',
        effect: { luck: -4 },
        rarity: 1
    },
    {
        id: 't17',
        name: '相貌平平',
        description: '你的长相很普通，甚至有点丑。',
        type: 'negative',
        effect: { appearance: -3 },
        rarity: 1
    },
    {
        id: 't18',
        name: '愚笨迟钝',
        description: '你的反应总是比别人慢半拍。',
        type: 'negative',
        effect: { intelligence: -3 },
        rarity: 1
    },
    {
        id: 't19',
        name: '体弱多病',
        description: '你从小就身体不好，经常生病。',
        type: 'negative',
        effect: { health: -3 },
        rarity: 1
    },
    {
        id: 't29',
        name: '天煞孤星',
        description: '你总是独自面对一切，很难有真心朋友。',
        type: 'negative',
        effect: { appearance: -1, luck: -2 },
        rarity: 1
    },
    {
        id: 't30',
        name: '倒霉蛋',
        description: '你总是遇到不顺心的事，喝凉水都塞牙。',
        type: 'negative',
        effect: { luck: -3, wealth: -1 },
        rarity: 1
    }
];

/**
 * 获取随机天赋（3选1）
 * @returns {Array} 3个天赋
 */
function getRandomTalents() {
    const result = [];
    const weights = { common: 60, rare: 20, negative: 20 };
    
    // 按权重随机选择
    const selectByWeight = () => {
        const rand = Math.random() * 100;
        if (rand < weights.rare) return 'rare';
        if (rand < weights.rare + weights.negative) return 'negative';
        return 'common';
    };
    
    // 从指定类型中随机选一个
    const selectFromType = (type) => {
        const talents = TALENTS_DATA.filter(t => t.type === type);
        return talents[Math.floor(Math.random() * talents.length)];
    };
    
    // 选择3个不重复的天赋
    while (result.length < 3) {
        const type = selectByWeight();
        const talent = selectFromType(type);
        if (!result.find(t => t.id === talent.id)) {
            result.push(talent);
        }
    }
    
    return result;
}

/**
 * 应用天赋效果
 * @param {Object} attributes - 当前属性
 * @param {Object} talent - 天赋
 * @returns {Object} 新属性
 */
function applyTalentEffect(attributes, talent) {
    const newAttributes = { ...attributes };
    for (const [key, value] of Object.entries(talent.effect)) {
        newAttributes[key] = Math.max(0, Math.min(10, newAttributes[key] + value));
    }
    return newAttributes;
}
