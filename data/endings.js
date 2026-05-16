/**
 * 结局数据
 * 根据人生统计计算结局称号
 */
const ENDINGS_DATA = [
    {
        id: 'e1',
        name: '人生赢家',
        description: '你的人生堪称完美，事业有成，家庭幸福，健康长寿。',
        condition: (stats) => stats.totalScore >= 80 && stats.maxAge >= 80,
        rarity: 'legendary'
    },
    {
        id: 'e2',
        name: '富豪人生',
        description: '你积累了大量财富，成为了令人羡慕的富人。',
        condition: (stats) => stats.avgWealth >= 7,
        rarity: 'rare'
    },
    {
        id: 'e3',
        name: '学者之路',
        description: '你一生追求知识，成为了受人尊敬的学者。',
        condition: (stats) => stats.avgIntelligence >= 7,
        rarity: 'rare'
    },
    {
        id: 'e4',
        name: '健康达人',
        description: '你拥有健康的体魄，活到了高寿。',
        condition: (stats) => stats.avgHealth >= 7 && stats.maxAge >= 85,
        rarity: 'rare'
    },
    {
        id: 'e5',
        name: '魅力四射',
        description: '你的魅力无人能挡，一生桃花运不断。',
        condition: (stats) => stats.avgAppearance >= 7,
        rarity: 'rare'
    },
    {
        id: 'e6',
        name: '幸运之星',
        description: '你一生好运连连，总能逢凶化吉。',
        condition: (stats) => stats.avgLuck >= 7,
        rarity: 'rare'
    },
    {
        id: 'e7',
        name: '平凡人生',
        description: '你度过了平凡的一生，虽无大风大浪，但也安稳幸福。',
        condition: (stats) => stats.totalScore >= 40 && stats.totalScore < 60,
        rarity: 'common'
    },
    {
        id: 'e8',
        name: '坎坷命运',
        description: '你的人生充满坎坷，但你坚强地走了下来。',
        condition: (stats) => stats.totalScore >= 20 && stats.totalScore < 40,
        rarity: 'common'
    },
    {
        id: 'e9',
        name: '悲惨人生',
        description: '你的人生充满苦难，命运对你不公。',
        condition: (stats) => stats.totalScore < 20,
        rarity: 'negative'
    },
    {
        id: 'e10',
        name: '英年早逝',
        description: '你的人生虽然短暂，但依然精彩。',
        condition: (stats) => stats.maxAge < 40,
        rarity: 'negative'
    },
    {
        id: 'e11',
        name: '长寿老人',
        description: '你活到了很高的年龄，见证了时代的变迁。',
        condition: (stats) => stats.maxAge >= 90,
        rarity: 'rare'
    },
    {
        id: 'e12',
        name: '逆袭人生',
        description: '你从逆境中崛起，最终获得了成功。',
        condition: (stats) => stats.initialScore < 30 && stats.totalScore >= 50,
        rarity: 'legendary'
    },
    {
        id: 'e13',
        name: '跌宕起伏',
        description: '你的人生大起大落，经历了各种滋味。',
        condition: (stats) => stats.positiveCount >= 5 && stats.negativeCount >= 5,
        rarity: 'common'
    },
    {
        id: 'e14',
        name: '一帆风顺',
        description: '你的人生顺风顺水，几乎没有遇到什么挫折。',
        condition: (stats) => stats.negativeCount <= 2 && stats.totalScore >= 50,
        rarity: 'rare'
    },
    {
        id: 'e15',
        name: '多灾多难',
        description: '你的一生灾难不断，但你依然坚强地活着。',
        condition: (stats) => stats.negativeCount >= 8,
        rarity: 'negative'
    },
    {
        id: 'e16',
        name: '艺术人生',
        description: '你在艺术领域有所建树，作品受人喜爱。',
        condition: (stats) => stats.avgAppearance >= 6 && stats.avgIntelligence >= 6,
        rarity: 'rare'
    },
    {
        id: 'e17',
        name: '创业大亨',
        description: '你创办了成功的企业，成为商业巨头。',
        condition: (stats) => stats.avgWealth >= 8 && stats.avgIntelligence >= 6,
        rarity: 'legendary'
    },
    {
        id: 'e18',
        name: '体育健将',
        description: '你在体育方面表现出色，取得了优异成绩。',
        condition: (stats) => stats.avgHealth >= 8,
        rarity: 'rare'
    },
    {
        id: 'e19',
        name: '社交达人',
        description: '你朋友遍天下，社交圈广泛，受人欢迎。',
        condition: (stats) => stats.avgAppearance >= 5 && stats.avgLuck >= 6,
        rarity: 'common'
    },
    {
        id: 'e20',
        name: '投资天才',
        description: '你投资眼光独到，财富不断增长。',
        condition: (stats) => stats.avgWealth >= 6 && stats.avgLuck >= 6,
        rarity: 'rare'
    },
    {
        id: 'e21',
        name: '书香门第',
        description: '你家庭文化氛围浓厚，一生与书为伴。',
        condition: (stats) => stats.avgIntelligence >= 6 && stats.avgWealth >= 4,
        rarity: 'common'
    },
    {
        id: 'e22',
        name: '乐天派',
        description: '你永远保持乐观，困难在你面前不堪一击。',
        condition: (stats) => stats.avgLuck >= 5 && stats.avgHealth >= 5,
        rarity: 'common'
    },
    {
        id: 'e23',
        name: '职场精英',
        description: '你在职场中表现出色，步步高升。',
        condition: (stats) => stats.avgIntelligence >= 6 && stats.avgAppearance >= 4,
        rarity: 'common'
    },
    {
        id: 'e24',
        name: '慈善家',
        description: '你一生乐善好施，帮助了很多人。',
        condition: (stats) => stats.avgWealth >= 5 && stats.avgLuck >= 5,
        rarity: 'rare'
    },
    {
        id: 'e25',
        name: '家庭和睦',
        description: '你家庭幸福美满，儿孙满堂，安享晚年。',
        condition: (stats) => stats.avgLuck >= 6 && stats.maxAge >= 70,
        rarity: 'common'
    },
    {
        id: 'e26',
        name: '科技先锋',
        description: '你在科技领域有所贡献，推动了时代进步。',
        condition: (stats) => stats.avgIntelligence >= 8,
        rarity: 'legendary'
    },
    {
        id: 'e27',
        name: '浪漫人生',
        description: '你一生浪漫，收获了美好的爱情。',
        condition: (stats) => stats.avgAppearance >= 6 && stats.avgLuck >= 5,
        rarity: 'rare'
    },
    {
        id: 'e28',
        name: '探险者',
        description: '你走遍了世界各地，见多识广。',
        condition: (stats) => stats.avgWealth >= 5 && stats.avgHealth >= 5,
        rarity: 'common'
    },
    {
        id: 'e29',
        name: '传承者',
        description: '你把自己的知识和技能传授给了后人。',
        condition: (stats) => stats.avgIntelligence >= 5 && stats.avgAppearance >= 3,
        rarity: 'common'
    },
    {
        id: 'e30',
        name: '梦想成真',
        description: '你完成了自己的人生梦想，没有遗憾。',
        condition: (stats) => stats.totalScore >= 70,
        rarity: 'legendary'
    }
];

/**
 * 计算人生统计
 * @param {Object} initialAttributes - 初始属性
 * @param {Array} events - 人生事件
 * @param {number} maxAge - 最大年龄
 * @returns {Object} 统计数据
 */
function calculateLifeStats(initialAttributes, events, maxAge) {
    let positiveCount = 0;
    let negativeCount = 0;
    let choiceCount = 0;
    
    // 统计事件类型
    for (const event of events) {
        if (event.type === 'positive') positiveCount++;
        if (event.type === 'negative') negativeCount++;
        if (event.type === 'choice') choiceCount++;
    }
    
    // 计算总分
    const initialScore = Object.values(initialAttributes).reduce((a, b) => a + b, 0);
    const avgAttributes = {
        appearance: initialAttributes.appearance,
        intelligence: initialAttributes.intelligence,
        health: initialAttributes.health,
        wealth: initialAttributes.wealth,
        luck: initialAttributes.luck
    };
    
    // 计算总分（考虑年龄加成）
    const ageBonus = Math.floor(maxAge / 10);
    const eventBonus = positiveCount * 2 - negativeCount;
    const totalScore = Math.min(100, Math.max(0, initialScore * 2 + ageBonus + eventBonus));
    
    return {
        initialScore,
        totalScore,
        maxAge,
        avgAppearance: avgAttributes.appearance,
        avgIntelligence: avgAttributes.intelligence,
        avgHealth: avgAttributes.health,
        avgWealth: avgAttributes.wealth,
        avgLuck: avgAttributes.luck,
        positiveCount,
        negativeCount,
        choiceCount
    };
}

/**
 * 获取结局
 * @param {Object} stats - 人生统计
 * @returns {Object} 结局
 */
function getEnding(stats) {
    // 按优先级检查结局条件
    const sortedEndings = [...ENDINGS_DATA].sort((a, b) => {
        const rarityOrder = { legendary: 0, rare: 1, common: 2, negative: 3 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
    
    for (const ending of sortedEndings) {
        if (ending.condition(stats)) {
            return ending;
        }
    }
    
    // 默认结局
    return {
        id: 'default',
        name: '普通人',
        description: '你度过了普通的一生。',
        rarity: 'common'
    };
}

/**
 * 获取评分等级
 * @param {number} score - 总分
 * @returns {Object} 评级信息
 */
function getScoreRating(score) {
    if (score >= 80) return { grade: 'S', text: '完美人生', color: '#FFD700' };
    if (score >= 70) return { grade: 'A', text: '优秀人生', color: '#FF6B6B' };
    if (score >= 60) return { grade: 'B', text: '良好人生', color: '#4ECDC4' };
    if (score >= 50) return { grade: 'C', text: '普通人生', color: '#95E1D3' };
    if (score >= 40) return { grade: 'D', text: '一般人生', color: '#F38181' };
    return { grade: 'E', text: '坎坷人生', color: '#AAAAAA' };
}
