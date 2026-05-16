/**
 * 事件处理模块
 * 处理人生事件的显示和交互
 */

// 事件显示配置
const EVENT_CONFIG = {
    autoPlayDelay: 1500, // 自动播放延迟
    choiceTimeout: 0 // 选择超时（0表示不超时）
};

// 当前事件状态
let currentEventState = {
    isPlaying: false,
    isPaused: false,
    currentEvent: null,
    autoPlayTimer: null
};

/**
 * 开始事件播放
 * @param {HTMLElement} container - 事件容器
 * @param {HTMLElement} progressContainer - 进度容器
 * @param {Function} onComplete - 完成回调
 */
function startEventPlayback(container, progressContainer, onComplete) {
    currentEventState.isPlaying = true;
    currentEventState.isPaused = false;
    
    playNextEvent(container, progressContainer, onComplete);
}

/**
 * 播放下一个事件
 */
function playNextEvent(container, progressContainer, onComplete) {
    if (!currentEventState.isPlaying || currentEventState.isPaused) {
        return;
    }
    
    const event = getNextEvent();
    
    // 检查是否还有事件
    if (!event) {
        currentEventState.isPlaying = false;
        if (onComplete) onComplete();
        return;
    }
    
    // 更新进度
    const progress = getProgress();
    updateProgress(progress, progressContainer);
    
    // 更新年龄显示
    updateAgeDisplay(event.age);
    
    // 处理不同类型的事件
    if (event.type === 'choice') {
        // 显示选择
        showChoiceEvent(event, container);
    } else if (event.type === 'death') {
        // 死亡事件
        renderEventCard(event, container);
        currentEventState.isPlaying = false;
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 2000);
    } else {
        // 普通事件
        renderEventCard(event, container);
        
        // 自动播放下一个
        currentEventState.autoPlayTimer = setTimeout(() => {
            playNextEvent(container, progressContainer, onComplete);
        }, EVENT_CONFIG.autoPlayDelay);
    }
}

/**
 * 更新年龄显示
 * @param {number} age - 当前年龄
 */
function updateAgeDisplay(age) {
    const ageEl = document.getElementById('current-age');
    if (ageEl) {
        ageEl.textContent = `${age}岁`;
    }
}

/**
 * 更新属性条显示
 */
function updateAttributeBars() {
    const container = document.getElementById('current-attributes');
    if (container && typeof renderAttributeBars === 'function') {
        renderAttributeBars(GameState.attributes, container);
    }
}

/**
 * 显示选择事件
 * @param {Object} event - 选择事件
 * @param {HTMLElement} container - 容器
 */
function showChoiceEvent(event, container) {
    currentEventState.isPaused = true;
    currentEventState.currentEvent = event;
    
    // 创建选择容器
    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'choice-container';
    container.appendChild(choiceContainer);
    
    // 渲染选择卡片
    renderChoiceCards(event, choiceContainer, (choice) => {
        // 处理选择
        handleChoice(choice);
        
        // 更新属性条显示
        updateAttributeBars();
        
        // 显示结果
        const resultCard = document.createElement('div');
        resultCard.className = 'event-card positive event-appear';
        resultCard.innerHTML = `
            <div class="event-age">选择结果</div>
            <div class="event-text">${choice.result}</div>
        `;
        container.appendChild(resultCard);
        
        // 移除选择容器
        choiceContainer.remove();
        
        // 继续播放
        currentEventState.isPaused = false;
        currentEventState.currentEvent = null;
        
        setTimeout(() => {
            playNextEvent(container, document.querySelector('.progress-bar'), window.onLifeComplete);
        }, 1500);
    });
    
    // 滚动到选择
    choiceContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 暂停事件播放
 */
function pauseEventPlayback() {
    currentEventState.isPaused = true;
    if (currentEventState.autoPlayTimer) {
        clearTimeout(currentEventState.autoPlayTimer);
        currentEventState.autoPlayTimer = null;
    }
}

/**
 * 继续事件播放
 */
function resumeEventPlayback() {
    currentEventState.isPaused = false;
}

/**
 * 停止事件播放
 */
function stopEventPlayback() {
    currentEventState.isPlaying = false;
    currentEventState.isPaused = false;
    currentEventState.currentEvent = null;
    
    if (currentEventState.autoPlayTimer) {
        clearTimeout(currentEventState.autoPlayTimer);
        currentEventState.autoPlayTimer = null;
    }
}

/**
 * 跳过当前事件
 */
function skipCurrentEvent() {
    if (currentEventState.autoPlayTimer) {
        clearTimeout(currentEventState.autoPlayTimer);
        currentEventState.autoPlayTimer = null;
    }
    
    // 触发下一个事件
    const container = document.getElementById('events-container');
    const progressContainer = document.querySelector('.progress-bar');
    
    playNextEvent(container, progressContainer, window.onLifeComplete);
}

/**
 * 快进到结局
 * @param {HTMLElement} container - 事件容器
 * @param {HTMLElement} progressContainer - 进度容器
 * @param {Function} onComplete - 完成回调
 */
function fastForwardToEnd(container, progressContainer, onComplete) {
    stopEventPlayback();
    
    // 清空容器
    container.innerHTML = '';
    
    // 显示所有事件摘要
    const events = GameState.events;
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'events-summary';
    
    // 只显示关键事件
    const keyEvents = events.filter(e => 
        e.type === 'positive' || e.type === 'negative' || e.type === 'choice' || e.type === 'death'
    );
    
    keyEvents.forEach(event => {
        renderEventCard(event, summaryContainer);
    });
    
    container.appendChild(summaryContainer);
    
    // 更新进度到100%
    updateProgress(100, progressContainer);
    
    // 完成回调
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 1000);
}

/**
 * 获取事件统计
 * @returns {Object}
 */
function getEventStats() {
    const events = GameState.events;
    
    return {
        total: events.length,
        positive: events.filter(e => e.type === 'positive').length,
        negative: events.filter(e => e.type === 'negative').length,
        neutral: events.filter(e => e.type === 'neutral').length,
        choices: events.filter(e => e.type === 'choice').length
    };
}

/**
 * 格式化事件时间线
 * @returns {Array}
 */
function formatEventTimeline() {
    const events = GameState.events;
    const timeline = [];
    
    // 按阶段分组
    const stages = {
        childhood: { name: '童年', events: [] },
        adolescence: { name: '少年', events: [] },
        youth: { name: '青年', events: [] },
        middleAge: { name: '中年', events: [] },
        oldAge: { name: '老年', events: [] }
    };
    
    events.forEach(event => {
        if (event.stage && stages[event.stage]) {
            stages[event.stage].events.push(event);
        }
    });
    
    return Object.values(stages);
}
