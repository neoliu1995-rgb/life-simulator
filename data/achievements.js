/**
 * 成就数据
 * 记录游戏中的特殊成就
 */
const ACHIEVEMENTS_DATA = [
    {
        id: 'a1',
        name: '初次体验',
        description: '完成第一次人生重开',
        icon: '🎮',
        condition: (stats, events) => true
    },
    {
        id: 'a2',
        name: '人生赢家',
        description: '获得S级评价',
        icon: '👑',
        condition: (stats, events) => stats.totalScore >= 80
    },
    {
        id: 'a3',
        name: '长寿之星',
        description: '活到100岁',
        icon: '🎂',
        condition: (stats, events) => stats.maxAge >= 100
    },
    {
        id: 'a4',
        name: '英年早逝',
        description: '在40岁之前去世',
        icon: '💔',
        condition: (stats, events) => stats.maxAge < 40
    },
    {
        id: 'a5',
        name: '逆袭人生',
        description: '从低分逆袭到高分',
        icon: '🚀',
        condition: (stats, events) => stats.initialScore < 30 && stats.totalScore >= 60
    },
    {
        id: 'a6',
        name: '一帆风顺',
        description: '没有负面事件',
        icon: '🌈',
        condition: (stats, events) => stats.negativeCount === 0
    },
    {
        id: 'a7',
        name: '多灾多难',
        description: '经历10次以上负面事件',
        icon: '🌪️',
        condition: (stats, events) => stats.negativeCount >= 10
    },
    {
        id: 'a8',
        name: '选择大师',
        description: '做出所有关键选择',
        icon: '🎯',
        condition: (stats, events) => stats.choiceCount >= 15
    },
    {
        id: 'a9',
        name: '财富积累',
        description: '财富属性达到最高',
        icon: '💰',
        condition: (stats, events) => stats.avgWealth >= 10
    },
    {
        id: 'a10',
        name: '颜值巅峰',
        description: '颜值属性达到最高',
        icon: '✨',
        condition: (stats, events) => stats.avgAppearance >= 10
    },
    {
        id: 'a11',
        name: '聪明绝顶',
        description: '智力属性达到最高',
        icon: '🧠',
        condition: (stats, events) => stats.avgIntelligence >= 10
    },
    {
        id: 'a12',
        name: '钢铁之躯',
        description: '体质属性达到最高',
        icon: '💪',
        condition: (stats, events) => stats.avgHealth >= 10
    },
    {
        id: 'a13',
        name: '天选之子',
        description: '运气属性达到最高',
        icon: '🍀',
        condition: (stats, events) => stats.avgLuck >= 10
    },
    {
        id: 'a14',
        name: '重开上瘾',
        description: '完成5次人生',
        icon: '🔄',
        condition: (stats, events, gameCount) => gameCount >= 5
    },
    {
        id: 'a15',
        name: '经验丰富',
        description: '完成10次人生',
        icon: '📚',
        condition: (stats, events, gameCount) => gameCount >= 10
    },
    {
        id: 'a16',
        name: '收藏家',
        description: '获得所有结局称号',
        icon: '🏆',
        condition: (stats, events, gameCount, endingsGot) => endingsGot >= 20
    },
    {
        id: 'a17',
        name: '幸运儿',
        description: '选择稀有天赋',
        icon: '⭐',
        condition: (stats, events, gameCount, endingsGot, talentType) => talentType === 'rare' || talentType === 'legendary'
    },
    {
        id: 'a18',
        name: '挑战人生',
        description: '选择负面天赋',
        icon: '⚔️',
        condition: (stats, events, gameCount, endingsGot, talentType) => talentType === 'negative'
    },
    {
        id: 'a19',
        name: '完美主义',
        description: '每一项属性都超过5',
        icon: '🎖️',
        condition: (stats, events) => stats.avgAppearance >= 6 && stats.avgIntelligence >= 6 && stats.avgHealth >= 6 && stats.avgWealth >= 6 && stats.avgLuck >= 6
    },
    {
        id: 'a20',
        name: '知足常乐',
        description: '每一项属性都不超过3',
        icon: '☮️',
        condition: (stats, events) => stats.avgAppearance <= 3 && stats.avgIntelligence <= 3 && stats.avgHealth <= 3 && stats.avgWealth <= 3 && stats.avgLuck <= 3
    }
];

/**
 * 检查获得的成就
 * @param {Object} stats - 人生统计
 * @param {Array} events - 事件列表
 * @param {number} gameCount - 游戏次数
 * @param {number} endingsGot - 获得的结局数
 * @param {string} talentType - 天赋类型
 * @returns {Array} 获得的成就
 */
function checkAchievements(stats, events, gameCount = 0, endingsGot = 0, talentType = null) {
    const achievementsGot = [];
    
    for (const achievement of ACHIEVEMENTS_DATA) {
        if (achievement.condition(stats, events, gameCount, endingsGot, talentType)) {
            achievementsGot.push(achievement);
        }
    }
    
    return achievementsGot;
}
