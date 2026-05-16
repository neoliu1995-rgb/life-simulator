/**
 * 游戏核心逻辑模块
 */

// 游戏状态
const GameState = {
    playerName: '',
    attributes: {
        appearance: 4,
        intelligence: 4,
        health: 4,
        wealth: 4,
        luck: 4
    },
    totalPoints: 20,
    usedPoints: 0,
    selectedTalent: null,
    availableTalents: [],
    events: [],
    currentEventIndex: 0,
    choices: [],
    maxAge: 0,
    ending: null,
    stats: null,
    phase: 'start' // start, attributes, talent, playing, ending
};

/**
 * 重置游戏状态
 */
function resetGameState() {
    GameState.playerName = '';
    GameState.attributes = {
        appearance: 4,
        intelligence: 4,
        health: 4,
        wealth: 4,
        luck: 4
    };
    GameState.totalPoints = 20;
    GameState.usedPoints = 20; // 初始已用20点
    GameState.selectedTalent = null;
    GameState.availableTalents = [];
    GameState.events = [];
    GameState.currentEventIndex = 0;
    GameState.choices = [];
    GameState.maxAge = 0;
    GameState.ending = null;
    GameState.stats = null;
    GameState.phase = 'start';
}

/**
 * 设置属性值
 * @param {string} attrName - 属性名
 * @param {number} value - 值
 * @returns {boolean} 是否设置成功
 */
function setAttribute(attrName, value) {
    const oldValue = GameState.attributes[attrName];
    const diff = value - oldValue;
    
    // 检查是否超出可用点数
    if (diff > 0 && GameState.usedPoints + diff > GameState.totalPoints) {
        return false;
    }
    
    // 检查值范围
    if (value < 0 || value > 10) {
        return false;
    }
    
    GameState.attributes[attrName] = value;
    GameState.usedPoints += diff;
    
    return true;
}

/**
 * 获取剩余点数
 * @returns {number}
 */
function getRemainingPoints() {
    return GameState.totalPoints - GameState.usedPoints;
}

/**
 * 初始化天赋选择
 */
function initTalentSelection() {
    GameState.availableTalents = getRandomTalents();
    GameState.phase = 'talent';
}

/**
 * 选择天赋
 * @param {Object} talent - 天赋
 */
function selectTalent(talent) {
    GameState.selectedTalent = talent;
    
    // 应用天赋效果
    GameState.attributes = applyTalentEffect(GameState.attributes, talent);
    
    // 更新已用点数
    GameState.usedPoints = Object.values(GameState.attributes).reduce((a, b) => a + b, 0);
}

/**
 * 开始人生
 */
function startLife() {
    GameState.phase = 'playing';
    
    // 生成人生事件
    GameState.events = generateLifeEvents(GameState.attributes);
    
    // 获取最大年龄
    const deathEvent = GameState.events.find(e => e.type === 'death');
    GameState.maxAge = deathEvent ? deathEvent.age : 70;
    
    // 重置事件索引
    GameState.currentEventIndex = 0;
    GameState.choices = [];
}

/**
 * 获取下一个事件
 * @returns {Object|null}
 */
function getNextEvent() {
    if (GameState.currentEventIndex >= GameState.events.length) {
        return null;
    }
    
    const event = GameState.events[GameState.currentEventIndex];
    GameState.currentEventIndex++;
    
    return event;
}

/**
 * 处理选择
 * @param {Object} choice - 选择
 */
function handleChoice(choice) {
    // 记录选择
    GameState.choices.push({
        age: GameState.events[GameState.currentEventIndex - 1]?.age,
        choice: choice.text,
        result: choice.result
    });
    
    // 应用效果
    for (const [key, value] of Object.entries(choice.effect)) {
        GameState.attributes[key] = Math.max(0, Math.min(10, GameState.attributes[key] + value));
    }
}

/**
 * 结束人生
 */
function endLife() {
    GameState.phase = 'ending';
    
    // 计算统计
    GameState.stats = calculateLifeStats(
        GameState.attributes,
        GameState.events,
        GameState.maxAge
    );
    
    // 获取结局
    GameState.ending = getEnding(GameState.stats);
    
    // 保存记录
    if (typeof saveGameResult === 'function') {
        saveGameResult({
            playerName: GameState.playerName,
            attributes: GameState.attributes,
            talent: GameState.selectedTalent,
            events: GameState.events,
            choices: GameState.choices,
            maxAge: GameState.maxAge,
            ending: GameState.ending,
            stats: GameState.stats
        });
    }
}

/**
 * 获取当前进度
 * @returns {number} 0-100
 */
function getProgress() {
    if (GameState.events.length === 0) return 0;
    return Math.floor((GameState.currentEventIndex / GameState.events.length) * 100);
}

/**
 * 获取当前年龄
 * @returns {number}
 */
function getCurrentAge() {
    if (GameState.currentEventIndex === 0) return 0;
    const event = GameState.events[GameState.currentEventIndex - 1];
    return event ? event.age : 0;
}

/**
 * 检查是否还有事件
 * @returns {boolean}
 */
function hasMoreEvents() {
    return GameState.currentEventIndex < GameState.events.length;
}

/**
 * 获取游戏摘要
 * @returns {Object}
 */
function getGameSummary() {
    // 获取成就
    const gameCount = getGameCount ? getGameCount() : 0;
    const endingsGot = getEndingsGot ? getEndingsGot() : 0;
    const talentType = GameState.selectedTalent?.type || null;
    const achievements = checkAchievements
        ? checkAchievements(GameState.stats, GameState.events, gameCount, endingsGot, talentType)
        : [];

    return {
        playerName: GameState.playerName,
        attributes: { ...GameState.attributes },
        talent: GameState.selectedTalent,
        maxAge: GameState.maxAge,
        ending: GameState.ending,
        stats: GameState.stats,
        events: GameState.events,
        choices: GameState.choices,
        achievements: achievements
    };
}

/**
 * 随机分配属性
 */
function randomizeAttributes() {
    // 重置属性
    GameState.attributes = {
        appearance: 0,
        intelligence: 0,
        health: 0,
        wealth: 0,
        luck: 0
    };
    
    // 随机分配20点
    let remaining = GameState.totalPoints;
    const attrKeys = Object.keys(GameState.attributes);
    
    // 先给每个属性分配1-3点基础值
    for (const key of attrKeys) {
        const base = Math.floor(Math.random() * 3) + 1;
        GameState.attributes[key] = base;
        remaining -= base;
    }
    
    // 随机分配剩余点数
    while (remaining > 0) {
        const key = attrKeys[Math.floor(Math.random() * attrKeys.length)];
        if (GameState.attributes[key] < 10) {
            GameState.attributes[key]++;
            remaining--;
        }
    }
    
    // 更新已用点数
    GameState.usedPoints = GameState.totalPoints;
}
