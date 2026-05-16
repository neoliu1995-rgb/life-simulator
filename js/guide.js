/**
 * 新手引导模块
 * 提供首次使用的引导流程
 */

// 当前引导步骤
let currentGuideStep = 1;
const totalGuideSteps = 5;

/**
 * 初始化新手引导
 */
function initGuide() {
    // 检查是否需要显示引导
    if (shouldShowGuide()) {
        showGuide();
    }
}

/**
 * 检查是否需要显示引导
 */
function shouldShowGuide() {
    const gameCount = getGameCount ? getGameCount() : 0;
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');

    // 如果游戏次数为0且没有看过引导，显示引导
    return gameCount === 0 && !hasSeenGuide;
}

/**
 * 显示引导
 */
function showGuide() {
    const overlay = document.getElementById('guide-overlay');
    if (!overlay) return;

    overlay.style.display = 'flex';
    currentGuideStep = 1;
    updateGuideStep();

    // 绑定事件
    bindGuideEvents();
}

/**
 * 隐藏引导
 */
function hideGuide() {
    const overlay = document.getElementById('guide-overlay');
    if (!overlay) return;

    overlay.style.display = 'none';
    localStorage.setItem('hasSeenGuide', 'true');
}

/**
 * 绑定引导事件
 */
function bindGuideEvents() {
    // 下一步按钮
    document.querySelectorAll('.guide-btn').forEach(btn => {
        btn.addEventListener('click', handleGuideNext);
    });

    // 跳过按钮
    const skipBtn = document.querySelector('.guide-skip');
    if (skipBtn) {
        skipBtn.addEventListener('click', hideGuide);
    }

    // 进度点点击
    document.querySelectorAll('.guide-dot').forEach(dot => {
        dot.addEventListener('click', handleDotClick);
    });
}

/**
 * 处理下一步按钮点击
 */
function handleGuideNext() {
    if (currentGuideStep < totalGuideSteps) {
        currentGuideStep++;
        updateGuideStep();
    } else {
        // 引导完成
        hideGuide();
    }
}

/**
 * 处理进度点点击
 */
function handleDotClick(e) {
    const step = parseInt(e.target.dataset.step);
    if (step) {
        currentGuideStep = step;
        updateGuideStep();
    }
}

/**
 * 更新引导步骤显示
 */
function updateGuideStep() {
    // 更新步骤显示
    document.querySelectorAll('.guide-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.toggle('active', stepNum === currentGuideStep);
    });

    // 更新进度点
    document.querySelectorAll('.guide-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.toggle('active', dotStep === currentGuideStep);
    });
}

/**
 * 获取游戏次数
 */
function getGameCount() {
    try {
        const history = JSON.parse(localStorage.getItem('lifeSimHistory') || '[]');
        return history.length;
    } catch {
        return 0;
    }
}

// 页面加载完成后初始化引导
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGuide, 500);
});
