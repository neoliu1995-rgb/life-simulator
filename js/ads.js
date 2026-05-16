/**
 * 广告模块
 * 处理广告展示、频次控制、会员验证等功能
 */

// 广告状态
const AdState = {
    isLoading: false,
    isPlaying: false,
    isCompleted: false,
    hasError: false,
    retryCount: 0,
    lastAdTime: 0,
    todayAdCount: 0
};

// 广告配置
const AdConfig = {
    cooldownSeconds: 180, // 两次广告间隔3分钟
    dailyMaxCount: 10, // 每日最多10次
    sessionMaxCount: 3, // 单次会话最多3次
    newUserFreePlays: 3, // 新用户前3局免广告
    adTimeout: 30000 // 广告加载超时30秒
};

/**
 * 检查是否应该显示广告
 */
function shouldShowAd() {
    // 检查是否是会员
    if (isMember()) {
        return false;
    }

    // 检查新用户保护
    const gameCount = getGameCount();
    if (gameCount < AdConfig.newUserFreePlays) {
        return false;
    }

    // 检查今日广告次数
    if (AdState.todayAdCount >= AdConfig.dailyMaxCount) {
        return false;
    }

    // 检查冷却时间
    const now = Date.now();
    if (now - AdState.lastAdTime < AdConfig.cooldownSeconds * 1000) {
        return false;
    }

    return true;
}

/**
 * 检查是否是会员
 */
function isMember() {
    const memberInfo = localStorage.getItem('lifeSimMember');
    if (!memberInfo) return false;
    
    try {
        const member = JSON.parse(memberInfo);
        const expiresAt = new Date(member.expiresAt).getTime();
        return expiresAt > Date.now();
    } catch {
        return false;
    }
}

/**
 * 获取游戏次数
 */
function getGameCount() {
    const history = localStorage.getItem('lifeSimHistory');
    if (!history) return 0;
    
    try {
        return JSON.parse(history).length;
    } catch {
        return 0;
    }
}

/**
 * 获取今日广告次数
 */
function getTodayAdCount() {
    const today = new Date().toDateString();
    const adStats = localStorage.getItem('lifeSimAdStats');
    
    if (!adStats) return 0;
    
    try {
        const stats = JSON.parse(adStats);
        return stats[today] || 0;
    } catch {
        return 0;
    }
}

/**
 * 记录广告展示
 */
function recordAdImpression() {
    const today = new Date().toDateString();
    const adStats = localStorage.getItem('lifeSimAdStats');
    
    let stats = {};
    if (adStats) {
        try {
            stats = JSON.parse(adStats);
        } catch {}
    }
    
    stats[today] = (stats[today] || 0) + 1;
    localStorage.setItem('lifeSimAdStats', JSON.stringify(stats));
    AdState.todayAdCount = stats[today];
    AdState.lastAdTime = Date.now();
}

/**
 * 显示广告门
 * @param {Function} onComplete - 广告完成回调
 * @param {Function} onSkip - 跳过回调（会员或失败）
 */
function showAdGate(onComplete, onSkip) {
    // 创建广告门遮罩
    const overlay = document.createElement('div');
    overlay.id = 'ad-gate-overlay';
    overlay.className = 'ad-gate-overlay';
    overlay.innerHTML = `
        <div class="ad-gate-container">
            <div class="ad-gate-content">
                <div class="ad-gate-icon">🎬</div>
                <h2 class="ad-gate-title">恭喜你完成了这一生！</h2>
                <p class="ad-gate-subtitle">观看短视频，揭晓你的最终评分和结局</p>
                
                <div class="ad-gate-timer">
                    <span class="timer-icon">⏱️</span>
                    <span>预计等待时间：15-30秒</span>
                </div>
                
                <button id="ad-gate-watch" class="ad-gate-btn ad-gate-btn-primary">
                    立即查看我的结局
                </button>
                
                <div class="ad-gate-divider">
                    <span class="divider-line"></span>
                    <span class="divider-text">或</span>
                    <span class="divider-line"></span>
                </div>
                
                <button id="ad-gate-member" class="ad-gate-btn ad-gate-btn-secondary">
                    👑 开通会员免广告
                </button>
            </div>
            
            <!-- 广告播放器（初始隐藏） -->
            <div id="ad-player" class="ad-player" style="display: none;">
                <div class="ad-player-content">
                    <div class="ad-placeholder">
                        <div class="ad-loader"></div>
                        <p>广告加载中...</p>
                    </div>
                    <div class="ad-countdown">
                        <span id="ad-countdown-text">广告播放中...</span>
                        <span id="ad-countdown-time"></span>
                    </div>
                </div>
                <button id="ad-close-btn" class="ad-close-btn" style="display: none;">
                    跳过广告
                </button>
            </div>
            
            <!-- 广告完成提示 -->
            <div id="ad-complete" class="ad-complete" style="display: none;">
                <div class="ad-complete-content">
                    <div class="complete-icon">🎉</div>
                    <h3>感谢观看！</h3>
                    <p>正在为你揭晓结局...</p>
                    <div class="complete-loader"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 绑定事件
    const watchBtn = overlay.querySelector('#ad-gate-watch');
    const memberBtn = overlay.querySelector('#ad-gate-member');
    
    watchBtn.addEventListener('click', () => {
        playAd(onComplete, onSkip);
    });
    
    memberBtn.addEventListener('click', () => {
        showMemberModal();
    });
}

/**
 * 播放广告（模拟实现）
 */
function playAd(onComplete, onSkip) {
    const overlay = document.getElementById('ad-gate-overlay');
    const content = overlay.querySelector('.ad-gate-content');
    const player = overlay.querySelector('#ad-player');
    const complete = overlay.querySelector('#ad-complete');
    const closeBtn = overlay.querySelector('#ad-close-btn');
    const countdownText = overlay.querySelector('#ad-countdown-text');
    const countdownTime = overlay.querySelector('#ad-countdown-time');
    
    // 显示播放器
    content.style.display = 'none';
    player.style.display = 'flex';
    
    // 记录广告展示
    recordAdImpression();
    
    // 模拟广告加载（实际应用中调用广告SDK）
    setTimeout(() => {
        // 模拟广告播放
        const placeholder = player.querySelector('.ad-placeholder');
        placeholder.innerHTML = `
            <div class="ad-video-mock">
                <div class="ad-video-thumbnail">🎥</div>
                <div class="ad-video-info">
                    <span class="ad-badge">广告</span>
                    <p>趣味视频广告</p>
                </div>
            </div>
        `;
        
        // 5秒后显示跳过按钮
        let skipCountdown = 5;
        countdownTime.textContent = `跳过 ${skipCountdown}s`;
        
        const skipInterval = setInterval(() => {
            skipCountdown--;
            if (skipCountdown > 0) {
                countdownTime.textContent = `跳过 ${skipCountdown}s`;
            } else {
                clearInterval(skipInterval);
                closeBtn.style.display = 'block';
                countdownText.textContent = '点击跳过';
                countdownTime.textContent = '';
            }
        }, 1000);
        
        // 绑定跳过按钮
        closeBtn.addEventListener('click', () => {
            clearInterval(skipInterval);
            showAdComplete(onComplete);
        });
        
        // 模拟广告自动结束（15秒）
        setTimeout(() => {
            clearInterval(skipInterval);
            showAdComplete(onComplete);
        }, 15000);
        
    }, 2000);
}

/**
 * 显示广告完成
 */
function showAdComplete(onComplete) {
    const overlay = document.getElementById('ad-gate-overlay');
    const player = overlay.querySelector('#ad-player');
    const complete = overlay.querySelector('#ad-complete');
    
    player.style.display = 'none';
    complete.style.display = 'flex';
    
    // 延迟后关闭广告门
    setTimeout(() => {
        overlay.remove();
        if (onComplete) {
            onComplete();
        }
    }, 2000);
}

/**
 * 显示会员开通弹窗
 */
function showMemberModal() {
    const overlay = document.getElementById('ad-gate-overlay');
    
    const modal = document.createElement('div');
    modal.id = 'member-modal';
    modal.className = 'member-modal';
    modal.innerHTML = `
        <div class="member-modal-content">
            <button id="member-close" class="member-close-btn">×</button>
            
            <div class="member-header">
                <div class="member-icon">👑</div>
                <h2>升级会员，畅享无广告体验</h2>
                <p>告别等待，立即解锁所有内容</p>
            </div>
            
            <div class="member-plans">
                <div class="member-plan member-plan-popular">
                    <div class="plan-badge">推荐</div>
                    <h3>月度会员</h3>
                    <div class="plan-price">
                        <span class="price">¥9.9</span>
                        <span class="period">/月</span>
                    </div>
                    <ul class="plan-features">
                        <li>✓ 完全免广告</li>
                        <li>✓ 专属天赋解锁</li>
                        <li>✓ 额外属性点</li>
                    </ul>
                    <button class="plan-btn" data-plan="monthly">立即开通</button>
                </div>
                
                <div class="member-plan">
                    <h3>年度会员</h3>
                    <div class="plan-price">
                        <span class="price">¥79.9</span>
                        <span class="period">/年</span>
                    </div>
                    <div class="plan-discount">省20%</div>
                    <ul class="plan-features">
                        <li>✓ 完全免广告</li>
                        <li>✓ 专属天赋解锁</li>
                        <li>✓ 无限重开次数</li>
                        <li>✓ AI定制人生</li>
                    </ul>
                    <button class="plan-btn" data-plan="yearly">立即开通</button>
                </div>
            </div>
            
            <div class="member-promo">
                <span class="promo-badge">新用户专享</span>
                <span>首月仅需 ¥1</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 绑定事件
    const closeBtn = modal.querySelector('#member-close');
    const planBtns = modal.querySelectorAll('.plan-btn');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    planBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.target.dataset.plan;
            handleMemberPurchase(plan);
        });
    });
}

/**
 * 处理会员购买（模拟）
 */
function handleMemberPurchase(plan) {
    // 模拟购买成功
    const expiresAt = new Date();
    if (plan === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    
    const memberInfo = {
        plan: plan,
        expiresAt: expiresAt.toISOString(),
        purchasedAt: new Date().toISOString()
    };
    
    localStorage.setItem('lifeSimMember', JSON.stringify(memberInfo));
    
    // 关闭弹窗并刷新
    const modal = document.getElementById('member-modal');
    if (modal) modal.remove();
    
    const adOverlay = document.getElementById('ad-gate-overlay');
    if (adOverlay) adOverlay.remove();
    
    // 显示购买成功提示
    showToast('🎉 会员开通成功！', 'success');
    
    // 重新渲染结局页面
    if (window.renderEnding) {
        window.renderEnding();
    }
}

/**
 * 关闭广告门
 */
function closeAdGate() {
    const overlay = document.getElementById('ad-gate-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 导出函数供外部使用
window.showAdGate = showAdGate;
window.shouldShowAd = shouldShowAd;
window.closeAdGate = closeAdGate;
window.isMember = isMember;