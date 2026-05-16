/**
 * UI模块
 * 处理界面渲染和交互
 */

/**
 * 显示页面
 * @param {string} pageId - 页面ID
 */
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

/**
 * 显示Toast提示
 * @param {string} message - 消息
 * @param {string} type - 类型 (success, error, info)
 */
function showToast(message, type = 'info') {
    // 获取或创建容器
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // 创建toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 显示模态框
 * @param {string} title - 标题
 * @param {string} content - 内容HTML
 * @param {Array} buttons - 按钮配置
 */
function showModal(title, content, buttons = []) {
    // 创建模态框
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        ${buttons.length ? `<div class="modal-footer btn-group">${buttons.map(btn => 
            `<button class="btn ${btn.class || 'btn-secondary'}" data-action="${btn.action}">${btn.text}</button>`
        ).join('')}</div>` : ''}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 显示动画
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
    
    // 关闭按钮
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(overlay));
    
    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
    
    // 按钮事件
    buttons.forEach(btn => {
        const btnEl = modal.querySelector(`[data-action="${btn.action}"]`);
        if (btnEl && btn.onClick) {
            btnEl.addEventListener('click', () => {
                btn.onClick();
                closeModal(overlay);
            });
        }
    });
    
    return overlay;
}

/**
 * 关闭模态框
 * @param {HTMLElement} overlay - 模态框遮罩
 */
function closeModal(overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
}

/**
 * 确认对话框
 * @param {string} message - 消息
 * @returns {Promise<boolean>}
 */
function showConfirm(message) {
    return new Promise((resolve) => {
        showModal('确认', `<p>${message}</p>`, [
            {
                text: '取消',
                action: 'cancel',
                class: 'btn-secondary',
                onClick: () => resolve(false)
            },
            {
                text: '确定',
                action: 'confirm',
                class: 'btn-primary',
                onClick: () => resolve(true)
            }
        ]);
    });
}

/**
 * 渲染属性条
 * @param {Object} attributes - 属性值
 * @param {HTMLElement} container - 容器
 */
function renderAttributeBars(attributes, container) {
    const attrConfig = [
        { key: 'appearance', name: '颜值', icon: '✨' },
        { key: 'intelligence', name: '智力', icon: '🧠' },
        { key: 'health', name: '体质', icon: '💪' },
        { key: 'wealth', name: '家境', icon: '💰' },
        { key: 'luck', name: '运气', icon: '🍀' }
    ];
    
    container.innerHTML = attrConfig.map(attr => `
        <div class="attr-bar attr-${attr.key}">
            <span class="attr-name">${attr.icon} ${attr.name}</span>
            <div class="attr-track">
                <div class="attr-fill" style="width: ${attributes[attr.key] * 10}%"></div>
                <span class="attr-value">${attributes[attr.key]}</span>
            </div>
        </div>
    `).join('');
}

/**
 * 渲染天赋卡片
 * @param {Array} talents - 天赋列表
 * @param {HTMLElement} container - 容器
 * @param {Function} onSelect - 选择回调
 */
function renderTalentCards(talents, container, onSelect) {
    container.innerHTML = talents.map((talent, index) => {
        const tagClass = talent.type === 'rare' ? 'tag-rare' : 
                        talent.type === 'negative' ? 'tag-negative' : 'tag-common';
        
        // 添加稀有度类名
        const rarityClass = talent.type === 'rare' ? 'rare' : 
                            talent.type === 'negative' ? 'negative' : '';
        
        // 天赋图标
        const talentIcon = talent.type === 'rare' ? '✨' : 
                          talent.type === 'negative' ? '⚠️' : '📋';
        
        const effects = Object.entries(talent.effect).map(([key, value]) => {
            const attrNames = {
                appearance: '颜值',
                intelligence: '智力',
                health: '体质',
                wealth: '家境',
                luck: '运气'
            };
            const sign = value > 0 ? '+' : '';
            const effectClass = value > 0 ? 'positive' : 'negative';
            return `<span class="talent-effect ${effectClass}">${attrNames[key]} ${sign}${value}</span>`;
        }).join('');
        
        return `
            <div class="talent-card talent-card-appear ${rarityClass}" data-index="${index}" data-id="${talent.id}">
                <div class="talent-header">
                    <span class="talent-name">${talentIcon} ${talent.name}</span>
                    <span class="tag ${tagClass}">${talent.type === 'rare' ? '稀有' : talent.type === 'negative' ? '负面' : '普通'}</span>
                </div>
                <p class="talent-desc">${talent.description}</p>
                <div class="talent-effects">${effects}</div>
            </div>
        `;
    }).join('');
    
    // 添加点击事件
    container.querySelectorAll('.talent-card').forEach(card => {
        card.addEventListener('click', () => {
            // 移除其他选中状态
            container.querySelectorAll('.talent-card').forEach(c => c.classList.remove('selected'));
            // 添加选中状态
            card.classList.add('selected');
            // 回调
            const index = parseInt(card.dataset.index);
            if (onSelect) onSelect(talents[index]);
        });
    });
    
    // 触发动画
    setTimeout(() => {
        container.querySelectorAll('.talent-card-appear').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

/**
 * 渲染事件卡片
 * @param {Object} event - 事件
 * @param {HTMLElement} container - 容器
 */
function renderEventCard(event, container) {
    const stageNames = {
        childhood: '童年',
        adolescence: '少年',
        youth: '青年',
        middleAge: '中年',
        oldAge: '老年'
    };

    const stageName = stageNames[event.stage] || '';

    // 根据事件类型添加不同的类
    const typeClass = event.type === 'positive' ? 'event-positive' :
                      event.type === 'negative' ? 'event-negative' :
                      event.type === 'choice' ? 'event-choice' : '';

    const card = document.createElement('div');
    card.className = `event-card ${event.type} ${typeClass} event-appear`;
    card.innerHTML = `
        <div class="event-type-badge">${getEventTypeIcon(event.type)}</div>
        <div class="event-age">${stageName} · ${event.age}岁</div>
        <div class="event-text">${event.text}</div>
    `;

    container.appendChild(card);

    // 滚动到新事件
    card.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/**
 * 获取事件类型图标
 * @param {string} type - 事件类型
 * @returns {string} emoji图标
 */
function getEventTypeIcon(type) {
    switch (type) {
        case 'positive': return '🎉';
        case 'negative': return '😢';
        case 'choice': return '🤔';
        default: return '📖';
    }
}

/**
 * 渲染选择卡片
 * @param {Object} choiceEvent - 选择事件
 * @param {HTMLElement} container - 容器
 * @param {Function} onSelect - 选择回调
 */
function renderChoiceCards(choiceEvent, container, onSelect) {
    container.innerHTML = `
        <div class="choice-event">
            <h3 class="choice-title">${choiceEvent.age}岁 · 人生抉择</h3>
            <p class="choice-question">${choiceEvent.text}</p>
            <div class="choice-options">
                ${choiceEvent.choices.map((choice, index) => `
                    <div class="choice-card" data-index="${index}">
                        <div class="choice-text">${choice.text}</div>
                        <div class="choice-effect">${formatChoiceEffect(choice.effect)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 添加点击事件
    container.querySelectorAll('.choice-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const index = parseInt(card.dataset.index);
            if (onSelect) onSelect(choiceEvent.choices[index]);
        });
    });
}

/**
 * 格式化选择效果
 * @param {Object} effect - 效果
 * @returns {string}
 */
function formatChoiceEffect(effect) {
    const attrNames = {
        appearance: '颜值',
        intelligence: '智力',
        health: '体质',
        wealth: '家境',
        luck: '运气'
    };
    
    return Object.entries(effect).map(([key, value]) => {
        const sign = value > 0 ? '+' : '';
        return `${attrNames[key]} ${sign}${value}`;
    }).join('  ');
}

/**
 * 渲染历史记录列表
 * @param {HTMLElement} container - 容器
 */
function renderHistoryList(container) {
    const history = getGameHistory();
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📜</div>
                <p>暂无历史记录</p>
                <p>开始新的人生吧！</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = history.map(record => `
        <div class="history-card" data-id="${record.id}">
            <div class="history-header">
                <span class="history-date">${record.date}</span>
                <span class="history-score">${record.score}分</span>
            </div>
            <div class="history-ending">${record.ending.name} · 享年${record.maxAge}岁</div>
        </div>
    `).join('');
    
    // 添加点击事件
    container.querySelectorAll('.history-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const record = history.find(r => r.id === id);
            if (record) {
                showHistoryDetail(record);
            }
        });
    });
}

/**
 * 显示历史详情
 * @param {Object} record - 记录
 */
function showHistoryDetail(record) {
    const rating = getScoreRating(record.score);
    
    showModal(`${record.ending.name}`, `
        <div class="ending-card">
            <div class="rating-badge rating-${rating.grade}">${rating.grade}</div>
            <p class="ending-desc">${record.ending.description}</p>
            <div class="divider"></div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${record.maxAge}</div>
                    <div class="stat-label">享年</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${record.score}</div>
                    <div class="stat-label">总分</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${record.stats.positiveCount}</div>
                    <div class="stat-label">好事</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${record.stats.negativeCount}</div>
                    <div class="stat-label">坏事</div>
                </div>
            </div>
        </div>
    `, [
        {
            text: '关闭',
            action: 'close',
            class: 'btn-secondary'
        }
    ]);
}

/**
 * 更新进度条
 * @param {number} progress - 进度 (0-100)
 * @param {HTMLElement} progressBar - 进度条元素
 */
function updateProgress(progress, progressBar) {
    const progressFill = progressBar.querySelector('.progress');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

/**
 * 显示加载状态
 * @param {HTMLElement} container - 容器
 */
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
    `;
}

/**
 * 隐藏加载状态
 * @param {HTMLElement} container - 容器
 */
function hideLoading(container) {
    const loading = container.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

/**
 * 数字动画
 * @param {HTMLElement} element - 元素
 * @param {number} target - 目标值
 * @param {number} duration - 持续时间(ms)
 */
function animateNumber(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * 渲染获得的成就
 * @param {Array} achievements - 成就列表
 * @param {HTMLElement} container - 容器
 * @param {boolean} showCelebration - 是否显示庆祝效果
 */
function renderAchievements(achievements, container, showCelebration = false) {
    if (achievements.length === 0) {
        container.innerHTML = `
            <div class="achievements-empty">
                <div class="icon">🎯</div>
                <p>此次人生未获得成就</p>
            </div>
        `;
        return;
    }

    container.innerHTML = achievements.map((achievement, index) => `
        <div class="achievement-item animate-popIn ${showCelebration && index === 0 ? 'achievement-celebration' : ''}"
             style="${showCelebration ? `animation-delay: ${index * 0.2}s` : ''}">
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `).join('');

    // 显示庆祝效果
    if (showCelebration && achievements.length > 0) {
        celebrateAchievements(achievements);
    }
}

/**
 * 成就庆祝效果
 * @param {Array} achievements - 成就列表
 */
function celebrateAchievements(achievements) {
    // 显示祝贺Toast
    if (achievements.length >= 3) {
        showToast(`🎉 太棒了！你获得了 ${achievements.length} 个成就！`, 'success');
    } else if (achievements.length > 0) {
        showToast(`✨ 恭喜获得成就：${achievements[0].name}`, 'success');
    }

    // 彩色纸屑效果
    createConfetti();
}

/**
 * 创建彩色纸屑
 */
function createConfetti() {
    const colors = ['#FFD700', '#6C5CE7', '#00B894', '#FF6B6B', '#74B9FF', '#A29BFE'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        document.body.appendChild(confetti);

        // 移除纸屑
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
