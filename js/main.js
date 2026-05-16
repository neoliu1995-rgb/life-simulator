/**
 * 主程序入口
 * 初始化应用和事件绑定
 */

// DOM元素缓存
const Elements = {
    pages: {},
    containers: {},
    buttons: {},
    inputs: {}
};

// 初始化完成标志
let isInitialized = false;

/**
 * 初始化应用
 */
function initApp() {
    if (isInitialized) return;
    
    console.log('初始化AI人生重开模拟器...');
    
    // 缓存DOM元素
    cacheElements();
    
    // 绑定事件
    bindEvents();
    
    // 检查存储
    checkStorage();
    
    // 加载保存的模板选择
    if (typeof loadTemplateChoice === 'function') {
        loadTemplateChoice();
    }
    
    // 显示开始页面
    showPage('page-start');
    
    isInitialized = true;
    console.log('初始化完成');
}

/**
 * 缓存DOM元素
 */
function cacheElements() {
    // 页面
    document.querySelectorAll('.page').forEach(page => {
        Elements.pages[page.id] = page;
    });
    
    // 容器
    Elements.containers = {
        attributes: document.getElementById('attributes-container'),
        talents: document.getElementById('talents-container'),
        events: document.getElementById('events-container'),
        history: document.getElementById('history-container')
    };
    
    // 按钮
    Elements.buttons = {
        start: document.getElementById('btn-start'),
        randomize: document.getElementById('btn-randomize'),
        confirmAttributes: document.getElementById('btn-confirm-attributes'),
        confirmTalent: document.getElementById('btn-confirm-talent'),
        nextEvent: document.getElementById('btn-next-event'),
        fastForward: document.getElementById('btn-fast-forward'),
        restart: document.getElementById('btn-restart'),
        share: document.getElementById('btn-share'),
        history: document.getElementById('btn-history'),
        backToStart: document.getElementById('btn-back-start')
    };
    
    // 输入框
    Elements.inputs = {
        playerName: document.getElementById('player-name')
    };
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 开始按钮
    Elements.buttons.start?.addEventListener('click', handleStart);
    
    // 随机分配按钮
    Elements.buttons.randomize?.addEventListener('click', handleRandomize);
    
    // 确认属性按钮
    Elements.buttons.confirmAttributes?.addEventListener('click', handleConfirmAttributes);
    
    // 确认天赋按钮
    Elements.buttons.confirmTalent?.addEventListener('click', handleConfirmTalent);
    
    // 下一个事件按钮
    Elements.buttons.nextEvent?.addEventListener('click', handleNextEvent);
    
    // 快进按钮
    Elements.buttons.fastForward?.addEventListener('click', handleFastForward);
    
    // 重新开始按钮
    Elements.buttons.restart?.addEventListener('click', handleRestart);
    
    // 分享按钮
    Elements.buttons.share?.addEventListener('click', handleShare);
    
    // 历史记录按钮
    Elements.buttons.history?.addEventListener('click', handleShowHistory);
    
    // 返回开始页面
    Elements.buttons.backToStart?.addEventListener('click', handleBackToStart);
    
    // 属性滑块
    document.querySelectorAll('.attr-slider').forEach(slider => {
        slider.addEventListener('input', handleAttributeChange);
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
}

/**
 * 检查存储
 */
function checkStorage() {
    if (!isStorageAvailable()) {
        showToast('您的浏览器不支持本地存储，游戏记录将无法保存', 'error');
    }
}

// ==================== 事件处理函数 ====================

/**
 * 开始游戏
 */
function handleStart() {
    // 重置游戏状态
    resetGameState();
    
    // 获取玩家名称
    const playerName = Elements.inputs.playerName?.value.trim();
    if (playerName) {
        GameState.playerName = playerName;
    }
    
    // 显示属性分配页面
    showPage('page-attributes');
    
    // 初始化属性滑块
    initAttributeSliders();
}

/**
 * 初始化属性滑块
 */
function initAttributeSliders() {
    const sliders = document.querySelectorAll('.attr-slider');
    sliders.forEach(slider => {
        const attrName = slider.dataset.attr;
        slider.value = GameState.attributes[attrName];
        updateSliderDisplay(slider);
    });
    
    updateRemainingPoints();
}

/**
 * 更新滑块显示
 */
function updateSliderDisplay(slider) {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    if (valueDisplay) {
        valueDisplay.textContent = slider.value;
    }
}

/**
 * 更新剩余点数显示
 */
function updateRemainingPoints() {
    const remainingEl = document.getElementById('remaining-points');
    if (remainingEl) {
        const remaining = getRemainingPoints();
        const oldValue = parseInt(remainingEl.textContent);
        
        if (remaining !== oldValue) {
            // 添加数值变化动画
            remainingEl.classList.add('glow');
            setTimeout(() => {
                remainingEl.classList.remove('glow');
            }, 300);
        }
        
        remainingEl.textContent = remaining;
        
        // 如果没有剩余点数，添加警告样式
        if (remaining <= 0) {
            remainingEl.classList.add('warning');
        } else {
            remainingEl.classList.remove('warning');
        }
    }
}

/**
 * 属性变化处理
 */
function handleAttributeChange(e) {
    const slider = e.target;
    const attrName = slider.dataset.attr;
    const newValue = parseInt(slider.value);
    
    // 计算当前总点数（不包括这个滑块正在改变的属性）
    const currentOtherTotal = Object.entries(GameState.attributes)
        .filter(([key]) => key !== attrName)
        .reduce((sum, [, val]) => sum + val, 0);
    
    const maxAllowed = GameState.totalPoints - currentOtherTotal;
    
    // 如果尝试设置的值超过允许的最大值，限制在最大值
    if (newValue > maxAllowed) {
        slider.value = maxAllowed;
        GameState.attributes[attrName] = maxAllowed;
        
        // 使用视觉提示而不是弹窗
        showVisualFeedback(slider);
    } else {
        GameState.attributes[attrName] = newValue;
    }
    
    updateSliderDisplay(slider);
    updateRemainingPoints();
}

/**
 * 显示视觉反馈（代替弹窗提示）
 * @param {HTMLElement} slider - 滑块元素
 */
function showVisualFeedback(slider) {
    const sliderContainer = slider.closest('.slider-container');
    if (sliderContainer) {
        // 添加抖动效果
        sliderContainer.classList.add('shake');
        
        // 几秒后移除
        setTimeout(() => {
            sliderContainer.classList.remove('shake');
        }, 500);
    }
}

/**
 * 随机分配属性
 */
function handleRandomize() {
    randomizeAttributes();
    
    // 更新滑块显示
    document.querySelectorAll('.attr-slider').forEach(slider => {
        const attrName = slider.dataset.attr;
        slider.value = GameState.attributes[attrName];
        updateSliderDisplay(slider);
    });
    
    updateRemainingPoints();
    showToast('属性已随机分配');
}

/**
 * 确认属性
 */
function handleConfirmAttributes() {
    // 检查是否分配完所有点数
    const remaining = getRemainingPoints();
    if (remaining > 0) {
        showToast(`还有 ${remaining} 点未分配！`, 'error');
        return;
    }
    
    // 初始化天赋选择
    initTalentSelection();
    
    // 显示天赋选择页面
    showPage('page-talent');
    
    // 渲染天赋卡片
    renderTalentCards(
        GameState.availableTalents,
        Elements.containers.talents,
        (talent) => {
            GameState.selectedTalent = talent;
            Elements.buttons.confirmTalent.disabled = false;
        }
    );
    
    // 禁用确认按钮直到选择天赋
    if (Elements.buttons.confirmTalent) {
        Elements.buttons.confirmTalent.disabled = true;
    }
}

/**
 * 确认天赋
 */
function handleConfirmTalent() {
    if (!GameState.selectedTalent) {
        showToast('请选择一个天赋！', 'error');
        return;
    }
    
    // 应用天赋效果
    selectTalent(GameState.selectedTalent);
    
    // 开始人生
    startLife();
    
    // 显示人生页面
    showPage('page-life');
    
    // 清空事件容器
    if (Elements.containers.events) {
        Elements.containers.events.innerHTML = '';
    }
    
    // 显示初始属性
    renderAttributeBars(GameState.attributes, document.getElementById('current-attributes'));
    
    // 开始事件播放
    startEventPlayback(
        Elements.containers.events,
        document.querySelector('.progress-bar'),
        handleLifeComplete
    );
}

/**
 * 下一个事件
 */
function handleNextEvent() {
    skipCurrentEvent();
}

/**
 * 快进到结局
 */
function handleFastForward() {
    if (confirm('确定要跳过剩余事件吗？')) {
        fastForwardToEnd(
            Elements.containers.events,
            document.querySelector('.progress-bar'),
            handleLifeComplete
        );
    }
}

/**
 * 人生完成回调
 */
function handleLifeComplete() {
    // 结束人生
    endLife();
    
    // 显示结局页面
    showPage('page-ending');
    
    // 直接渲染结局（广告功能暂时禁用，专注用户体验）
    renderEnding();
}

/**
 * 渲染结局
 */
function renderEnding() {
    const summary = getGameSummary();
    const rating = getScoreRating(summary.stats.totalScore);
    
    // 更新结局信息
    const endingNameEl = document.getElementById('ending-name');
    const endingDescEl = document.getElementById('ending-desc');
    const scoreValueEl = document.getElementById('score-value');
    const ratingBadgeEl = document.getElementById('rating-badge');
    
    if (endingNameEl) endingNameEl.textContent = summary.ending.name;
    if (endingDescEl) endingDescEl.textContent = summary.ending.description;
    if (scoreValueEl) animateNumber(scoreValueEl, summary.stats.totalScore);
    if (ratingBadgeEl) {
        ratingBadgeEl.textContent = rating.grade;
        ratingBadgeEl.className = `rating-badge rating-${rating.grade}`;
    }
    
    // 更新统计
    const statsContainer = document.getElementById('ending-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${summary.maxAge}</div>
                <div class="stat-label">享年</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${summary.stats.positiveCount}</div>
                <div class="stat-label">好事</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${summary.stats.negativeCount}</div>
                <div class="stat-label">坏事</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${summary.stats.choiceCount}</div>
                <div class="stat-label">抉择</div>
            </div>
        `;
    }

    // 渲染最终属性
    renderAttributeBars(summary.attributes, document.getElementById('final-attributes'));

    // 渲染成就（启用庆祝效果）
    const gameCount = getGameCount();
    const endingsGot = getEndingsGot();
    const achievements = checkAchievements(
        summary.stats,
        GameState.events,
        gameCount,
        endingsGot,
        GameState.selectedTalent?.type
    );
    renderAchievements(achievements, document.getElementById('achievements-container'), true);
}

/**
 * 重新开始
 */
function handleRestart() {
    showConfirm('确定要重新开始吗？当前人生记录已保存。').then(confirmed => {
        if (confirmed) {
            resetGameState();
            showPage('page-start');
        }
    });
}

/**
 * 分享
 */
async function handleShare() {
    const summary = getGameSummary();
    
    showToast('正在生成海报...', 'info');
    
    try {
        const posterData = await generatePoster(summary);
        showPosterPreview(posterData, summary);
    } catch (error) {
        console.error('生成海报失败:', error);
        showToast('生成海报失败', 'error');
    }
}

/**
 * 显示历史记录
 */
function handleShowHistory() {
    showPage('page-history');
    renderHistoryList(Elements.containers.history);
}

/**
 * 返回开始页面
 */
function handleBackToStart() {
    showPage('page-start');
}

/**
 * 键盘事件处理
 */
function handleKeyboard(e) {
    // ESC关闭模态框
    if (e.key === 'Escape') {
        const overlay = document.querySelector('.modal-overlay.active');
        if (overlay) {
            closeModal(overlay);
        }
    }
    
    // 空格键继续
    if (e.key === ' ' && GameState.phase === 'playing') {
        e.preventDefault();
        skipCurrentEvent();
    }
}

// ==================== 初始化 ====================

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 导出全局函数供其他模块使用
window.onLifeComplete = handleLifeComplete;
