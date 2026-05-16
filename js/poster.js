/**
 * 分享海报生成模块
 * 使用Canvas生成分享海报
 */

// 海报稀有度主题
const POSTER_RARITY_THEMES = {
    legendary: {
        name: '传奇金',
        primaryColor: '#FFD700',
        secondaryColor: '#FFA500',
        glowColor: 'rgba(255, 215, 0, 0.3)',
        icon: '👑',
        particles: ['✨', '🌟', '💫', '⭐']
    },
    rare: {
        name: '稀有紫',
        primaryColor: '#6C5CE7',
        secondaryColor: '#A29BFE',
        glowColor: 'rgba(108, 92, 231, 0.3)',
        icon: '💎',
        particles: ['💎', '🔮', '✨', '🎀']
    },
    common: {
        name: '普通蓝',
        primaryColor: '#0984E3',
        secondaryColor: '#74B9FF',
        glowColor: 'rgba(9, 132, 227, 0.2)',
        icon: '🎭',
        particles: ['🎭', '✨', '💫', '🌟']
    },
    negative: {
        name: '坎坷红',
        primaryColor: '#E17055',
        secondaryColor: '#D63031',
        glowColor: 'rgba(225, 112, 85, 0.3)',
        icon: '🌙',
        particles: ['🌙', '✨', '💫', '🌑']
    }
};

// 海报模板
const POSTER_TEMPLATES = {
    default: {
        name: '经典紫',
        colors: {
            background: '#FAFAFA',
            primary: '#6C5CE7',
            secondary: '#A29BFE',
            text: '#2D3436',
            textSecondary: '#636E72',
            white: '#FFFFFF',
            gradientStart: '#6C5CE7',
            gradientEnd: '#A29BFE'
        },
        backgroundGradient: ['#FAFAFF', '#F5F5FF', '#FFFFFF'],
        decorationColors: ['rgba(108, 92, 231, 0.06)', 'rgba(162, 155, 254, 0.06)', 'rgba(253, 121, 168, 0.04)']
    },
    sunset: {
        name: '落日橙',
        colors: {
            background: '#FFF8F0',
            primary: '#FF6B35',
            secondary: '#FFB347',
            text: '#2D3436',
            textSecondary: '#636E72',
            white: '#FFFFFF',
            gradientStart: '#FF6B35',
            gradientEnd: '#FFB347'
        },
        backgroundGradient: ['#FFF8F0', '#FFE8D6', '#FFFFFF'],
        decorationColors: ['rgba(255, 107, 53, 0.06)', 'rgba(255, 179, 71, 0.06)', 'rgba(255, 140, 0, 0.04)']
    },
    ocean: {
        name: '海洋蓝',
        colors: {
            background: '#F0F8FF',
            primary: '#0984E3',
            secondary: '#74B9FF',
            text: '#2D3436',
            textSecondary: '#636E72',
            white: '#FFFFFF',
            gradientStart: '#0984E3',
            gradientEnd: '#74B9FF'
        },
        backgroundGradient: ['#F0F8FF', '#E8F4FF', '#FFFFFF'],
        decorationColors: ['rgba(9, 132, 227, 0.06)', 'rgba(116, 185, 255, 0.06)', 'rgba(0, 191, 255, 0.04)']
    },
    forest: {
        name: '森林绿',
        colors: {
            background: '#F0FFF4',
            primary: '#00B894',
            secondary: '#55EFC4',
            text: '#2D3436',
            textSecondary: '#636E72',
            white: '#FFFFFF',
            gradientStart: '#00B894',
            gradientEnd: '#55EFC4'
        },
        backgroundGradient: ['#F0FFF4', '#E8FFF0', '#FFFFFF'],
        decorationColors: ['rgba(0, 184, 148, 0.06)', 'rgba(85, 239, 196, 0.06)', 'rgba(0, 255, 127, 0.04)']
    },
    sakura: {
        name: '樱花粉',
        colors: {
            background: '#FFF0F5',
            primary: '#FD79A8',
            secondary: '#FFB6C1',
            text: '#2D3436',
            textSecondary: '#636E72',
            white: '#FFFFFF',
            gradientStart: '#FD79A8',
            gradientEnd: '#FFB6C1'
        },
        backgroundGradient: ['#FFF0F5', '#FFE8F0', '#FFFFFF'],
        decorationColors: ['rgba(253, 121, 168, 0.06)', 'rgba(255, 182, 193, 0.06)', 'rgba(255, 105, 180, 0.04)']
    }
};

// 海报配置
const POSTER_CONFIG = {
    width: 375,
    height: 667,
    padding: 24,
    fonts: {
        title: 'bold 28px -apple-system, sans-serif',
        subtitle: '16px -apple-system, sans-serif',
        normal: '14px -apple-system, sans-serif',
        small: '12px -apple-system, sans-serif',
        score: 'bold 48px -apple-system, sans-serif'
    },
    template: 'default'
};

/**
 * 设置海报模板
 * @param {string} templateId - 模板ID
 */
function setPosterTemplate(templateId) {
    if (POSTER_TEMPLATES[templateId]) {
        POSTER_CONFIG.template = templateId;
        saveTemplateChoice(templateId);
    }
}

/**
 * 获取当前模板
 * @returns {Object} 模板配置
 */
function getCurrentTemplate() {
    return POSTER_TEMPLATES[POSTER_CONFIG.template] || POSTER_TEMPLATES.default;
}

/**
 * 生成分享海报
 * @param {Object} gameData - 游戏数据
 * @param {string} templateId - 模板ID（可选）
 * @returns {Promise<string>} Base64图片数据
 */
async function generatePoster(gameData, templateId = null) {
    if (templateId && POSTER_TEMPLATES[templateId]) {
        POSTER_CONFIG.template = templateId;
    }
    
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置画布尺寸
            const scale = 2; // 高清屏适配
            canvas.width = POSTER_CONFIG.width * scale;
            canvas.height = POSTER_CONFIG.height * scale;
            ctx.scale(scale, scale);
            
            // 获取结局稀有度主题
            const rarity = gameData.ending?.rarity || 'common';
            const rarityTheme = POSTER_RARITY_THEMES[rarity] || POSTER_RARITY_THEMES.common;
            
            // 绘制背景
            drawBackground(ctx, canvas.width / scale, canvas.height / scale);
            
            // 绘制稀有度光效（仅对稀有以上结局）
            if (rarity === 'legendary' || rarity === 'rare') {
                drawRarityGlow(ctx, canvas.width / scale, canvas.height / scale, rarityTheme);
            }
            
            // 绘制头部
            drawHeader(ctx, gameData);
            
            // 绘制结局
            drawEnding(ctx, gameData, rarityTheme);
            
            // 绘制属性
            drawAttributes(ctx, gameData.attributes);
            
            // 绘制统计
            drawStats(ctx, gameData.stats);
            
            // 绘制成就（如果有）
            if (gameData.achievements && gameData.achievements.length > 0) {
                drawAchievements(ctx, gameData.achievements, rarityTheme);
            }
            
            // 绘制稀有度标记
            drawRarityBadge(ctx, rarity, rarityTheme);
            
            // 绘制底部
            drawFooter(ctx, canvas.width / scale);
            
            // 转换为Base64
            const dataUrl = canvas.toDataURL('image/png', 0.9);
            resolve(dataUrl);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 绘制稀有度光效
 */
function drawRarityGlow(ctx, width, height, rarityTheme) {
    // 顶部光芒
    const gradient = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, width);
    gradient.addColorStop(0, rarityTheme.glowColor);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 200);
    
    // 边缘光晕
    const edgeGradientLeft = ctx.createLinearGradient(0, 0, 50, 0);
    edgeGradientLeft.addColorStop(0, rarityTheme.glowColor);
    edgeGradientLeft.addColorStop(1, 'transparent');
    ctx.fillStyle = edgeGradientLeft;
    ctx.fillRect(0, 0, 50, height);
    
    const edgeGradientRight = ctx.createLinearGradient(width, 0, width - 50, 0);
    edgeGradientRight.addColorStop(0, rarityTheme.glowColor);
    edgeGradientRight.addColorStop(1, 'transparent');
    ctx.fillStyle = edgeGradientRight;
    ctx.fillRect(width - 50, 0, 50, height);
    
    // 粒子效果
    const particles = rarityTheme.particles || ['✨'];
    const particleCount = rarityTheme.rarity === 'legendary' ? 8 : 5;
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.6;
        const size = Math.random() * 16 + 12;
        ctx.font = `${size}px serif`;
        ctx.fillText(particles[i % particles.length], x, y);
    }
}

/**
 * 绘制成就
 */
function drawAchievements(ctx, achievements, rarityTheme) {
    const startY = 420;
    const padding = POSTER_CONFIG.padding;
    const maxDisplay = 3;
    const template = getCurrentTemplate();
    
    const displayAchievements = achievements.slice(0, maxDisplay);
    const remaining = achievements.length - maxDisplay;
    
    ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillStyle = template.colors.textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText('🏅 获得成就', padding, startY);
    
    displayAchievements.forEach((achievement, index) => {
        const y = startY + 25 + index * 30;
        
        // 成就图标和名称
        ctx.font = '14px -apple-system, sans-serif';
        ctx.fillText(`${achievement.icon} ${achievement.name}`, padding, y);
    });
    
    if (remaining > 0) {
        ctx.font = '12px -apple-system, sans-serif';
        ctx.fillStyle = template.colors.textSecondary;
        ctx.fillText(`+${remaining} more`, padding, startY + 25 + maxDisplay * 30);
    }
}

/**
 * 绘制稀有度标记
 */
function drawRarityBadge(ctx, rarity, rarityTheme) {
    const badgeX = POSTER_CONFIG.width - POSTER_CONFIG.padding - 60;
    const badgeY = 85;
    
    // 稀有度徽章背景
    ctx.fillStyle = rarityTheme.primaryColor;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // 稀有度图标
    ctx.font = '20px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rarityTheme.icon, badgeX, badgeY);
    
    // 稀有度名称
    ctx.font = 'bold 10px -apple-system, sans-serif';
    ctx.fillText(rarityTheme.name, badgeX, badgeY + 38);
}

/**
 * 绘制背景
 */
function drawBackground(ctx, width, height) {
    const template = getCurrentTemplate();
    
    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    template.backgroundGradient.forEach((color, index) => {
        gradient.addColorStop(index / (template.backgroundGradient.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 装饰圆形
    const circles = [
        { x: width - 30, y: 80, r: 120, color: template.decorationColors[0] },
        { x: 40, y: height - 120, r: 90, color: template.decorationColors[1] },
        { x: width - 20, y: height - 200, r: 70, color: template.decorationColors[2] }
    ];
    
    circles.forEach(circle => {
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制装饰点
    ctx.fillStyle = template.decorationColors[0].replace('0.06', '0.1');
    const dots = [
        { x: 50, y: 150 }, { x: 100, y: 180 }, { x: width - 80, y: 400 },
        { x: width - 40, y: 500 }, { x: 70, y: height - 100 }, { x: width - 60, y: height - 80 }
    ];
    
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.random() * 4 + 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

/**
 * 绘制头部
 */
function drawHeader(ctx, gameData) {
    const padding = POSTER_CONFIG.padding;
    const template = getCurrentTemplate();
    
    // 标题
    ctx.font = POSTER_CONFIG.fonts.title;
    ctx.fillStyle = template.colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('人生重开模拟器', POSTER_CONFIG.width / 2, padding + 30);
    
    // 副标题
    ctx.font = POSTER_CONFIG.fonts.subtitle;
    ctx.fillStyle = template.colors.textSecondary;
    ctx.fillText(`享年 ${gameData.maxAge} 岁`, POSTER_CONFIG.width / 2, padding + 55);
}

/**
 * 绘制结局
 */
function drawEnding(ctx, gameData, rarityTheme) {
    const y = 100;
    const centerX = POSTER_CONFIG.width / 2;
    const template = getCurrentTemplate();
    
    // 结局名称背景 - 根据稀有度添加光晕
    if (rarityTheme && (rarityTheme.primaryColor !== template.colors.primary)) {
        // 稀有结局使用特殊背景
        const gradient = ctx.createLinearGradient(
            POSTER_CONFIG.padding, y,
            POSTER_CONFIG.padding, y + 80
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = template.colors.white;
    }
    roundRect(ctx, POSTER_CONFIG.padding, y, POSTER_CONFIG.width - POSTER_CONFIG.padding * 2, 80, 12);
    ctx.fill();
    
    // 阴影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    
    // 结局名称 - 使用稀有度颜色
    ctx.font = POSTER_CONFIG.fonts.title;
    ctx.fillStyle = rarityTheme?.primaryColor || template.colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText(gameData.ending.name, centerX, y + 35);
    
    // 结局描述
    ctx.font = POSTER_CONFIG.fonts.small;
    ctx.fillStyle = template.colors.textSecondary;
    ctx.fillText(gameData.ending.description.substring(0, 20), centerX, y + 60);
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}

/**
 * 绘制属性
 */
function drawAttributes(ctx, attributes) {
    const startY = 200;
    const padding = POSTER_CONFIG.padding;
    const barHeight = 24;
    const barGap = 12;
    
    const attrConfig = [
        { key: 'appearance', name: '颜值', color: '#FF6B6B' },
        { key: 'intelligence', name: '智力', color: '#4ECDC4' },
        { key: 'health', name: '体质', color: '#95E1D3' },
        { key: 'wealth', name: '家境', color: '#F9CA24' },
        { key: 'luck', name: '运气', color: '#A29BFE' }
    ];
    
    attrConfig.forEach((attr, index) => {
        const y = startY + index * (barHeight + barGap);
        const value = attributes[attr.key];
        const barWidth = POSTER_CONFIG.width - padding * 2;
        const fillWidth = (value / 10) * barWidth;
        
        // 属性名
        ctx.font = POSTER_CONFIG.fonts.small;
        ctx.fillStyle = POSTER_CONFIG.colors.textSecondary;
        ctx.textAlign = 'left';
        ctx.fillText(attr.name, padding, y + 8);
        
        // 背景条
        ctx.fillStyle = '#F0F0F0';
        roundRect(ctx, padding, y + 14, barWidth, 10, 5);
        ctx.fill();
        
        // 填充条
        const gradient = ctx.createLinearGradient(padding, 0, padding + fillWidth, 0);
        gradient.addColorStop(0, attr.color);
        gradient.addColorStop(1, adjustColor(attr.color, 20));
        ctx.fillStyle = gradient;
        roundRect(ctx, padding, y + 14, fillWidth, 10, 5);
        ctx.fill();
        
        // 数值
        ctx.font = POSTER_CONFIG.fonts.small;
        ctx.fillStyle = POSTER_CONFIG.colors.white;
        ctx.textAlign = 'right';
        ctx.fillText(value.toString(), padding + fillWidth - 8, y + 22);
    });
}

/**
 * 绘制统计
 */
function drawStats(ctx, stats) {
    const startY = 400;
    const padding = POSTER_CONFIG.padding;
    const itemWidth = (POSTER_CONFIG.width - padding * 2 - 20) / 3;
    const itemHeight = 60;
    const template = getCurrentTemplate();
    
    const statItems = [
        { label: '总分', value: stats.totalScore, color: template.colors.primary },
        { label: '好事', value: stats.positiveCount, color: '#00B894' },
        { label: '坏事', value: stats.negativeCount, color: '#E17055' }
    ];
    
    statItems.forEach((item, index) => {
        const x = padding + index * (itemWidth + 10);
        
        // 背景
        ctx.fillStyle = template.colors.white;
        roundRect(ctx, x, startY, itemWidth, itemHeight, 8);
        ctx.fill();
        
        // 数值
        ctx.font = POSTER_CONFIG.fonts.score;
        ctx.fillStyle = item.color;
        ctx.textAlign = 'center';
        ctx.fillText(item.value.toString(), x + itemWidth / 2, startY + 35);
        
        // 标签
        ctx.font = POSTER_CONFIG.fonts.small;
        ctx.fillStyle = template.colors.textSecondary;
        ctx.fillText(item.label, x + itemWidth / 2, startY + 52);
    });
}

/**
 * 绘制底部
 */
function drawFooter(ctx, width) {
    const y = POSTER_CONFIG.height - 40;
    const template = getCurrentTemplate();
    
    ctx.font = POSTER_CONFIG.fonts.small;
    ctx.fillStyle = template.colors.textSecondary;
    ctx.textAlign = 'center';
    ctx.fillText('AI人生重开模拟器', width / 2, y);
    
    ctx.font = POSTER_CONFIG.fonts.small;
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText(new Date().toLocaleDateString('zh-CN'), width / 2, y + 18);
}

/**
 * 保存模板选择
 */
function saveTemplateChoice(templateId) {
    localStorage.setItem('posterTemplate', templateId);
}

/**
 * 加载模板选择
 */
function loadTemplateChoice() {
    const saved = localStorage.getItem('posterTemplate');
    if (saved && POSTER_TEMPLATES[saved]) {
        POSTER_CONFIG.template = saved;
    }
}

/**
 * 绘制圆角矩形
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * 调整颜色亮度
 */
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 下载海报
 * @param {string} dataUrl - Base64图片数据
 * @param {string} filename - 文件名
 */
function downloadPoster(dataUrl, filename = 'life-simulator-poster.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

/**
 * 分享海报（调用系统分享）
 * @param {string} dataUrl - Base64图片数据
 */
async function sharePoster(dataUrl) {
    if (!navigator.share) {
        showToast('您的浏览器不支持分享功能', 'error');
        return false;
    }

    try {
        // 将Base64转换为Blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'life-simulator.png', { type: 'image/png' });

        await navigator.share({
            title: '我的人生重开结果',
            text: '来看看我的人生结局吧！',
            files: [file]
        });

        return true;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('分享失败:', error);
            showToast('分享失败', 'error');
        }
        return false;
    }
}

/**
 * 分享到指定平台
 * @param {string} platform - 平台名称
 * @param {string} dataUrl - 海报数据
 */
function shareToPlatform(platform, dataUrl) {
    const shareText = `我的人生结局是"${currentGameData?.ending?.name}"，快来试试你的命运吧！🎮`;
    const shareUrl = window.location.href;

    let shareLink = '';

    switch (platform) {
        case 'weixin':
            // 微信分享需要开放平台支持，这里仅复制文本
            navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            showToast('分享内容已复制，请粘贴到微信');
            return;

        case '朋友圈':
            navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            showToast('分享内容已复制，请粘贴到朋友圈');
            return;

        case 'weibo':
            shareLink = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            return;

        case 'douyin':
            navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            showToast('分享内容已复制，请粘贴到抖音');
            return;

        case 'xiaohongshu':
            navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            showToast('分享内容已复制，请粘贴到小红书');
            return;

        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            return;

        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            return;

        case 'link':
        default:
            navigator.clipboard.writeText(shareUrl);
            showToast('分享链接已复制到剪贴板');
            return;
    }
}

// 当前预览的海报数据
let currentPosterData = null;
let currentGameData = null;

/**
 * 显示海报预览
 * @param {string} dataUrl - Base64图片数据
 * @param {Object} gameData - 游戏数据
 */
function showPosterPreview(dataUrl, gameData) {
    currentPosterData = dataUrl;
    currentGameData = gameData;
    
    renderPosterPreview();
}

/**
 * 渲染海报预览
 */
async function renderPosterPreview() {
    const templateOptions = Object.entries(POSTER_TEMPLATES).map(([id, template]) => {
        const isSelected = id === POSTER_CONFIG.template;
        return `
            <button
                class="template-option ${isSelected ? 'selected' : ''}"
                data-template="${id}"
                style="background: linear-gradient(135deg, ${template.colors.gradientStart}, ${template.colors.gradientEnd});"
            >
                ${template.name}
            </button>
        `;
    }).join('');

    const sharePlatforms = `
        <div class="share-platforms">
            <div class="share-platforms-title">分享到</div>
            <div class="share-platforms-grid">
                <button class="share-platform-btn" onclick="shareToPlatform('weixin', currentPosterData)">
                    <span class="share-icon">💬</span>
                    <span>微信</span>
                </button>
                <button class="share-platform-btn" onclick="shareToPlatform('朋友圈', currentPosterData)">
                    <span class="share-icon">📱</span>
                    <span>朋友圈</span>
                </button>
                <button class="share-platform-btn" onclick="shareToPlatform('weibo', currentPosterData)">
                    <span class="share-icon">🌐</span>
                    <span>微博</span>
                </button>
                <button class="share-platform-btn" onclick="shareToPlatform('douyin', currentPosterData)">
                    <span class="share-icon">🎵</span>
                    <span>抖音</span>
                </button>
                <button class="share-platform-btn" onclick="shareToPlatform('xiaohongshu', currentPosterData)">
                    <span class="share-icon">📕</span>
                    <span>小红书</span>
                </button>
                <button class="share-platform-btn" onclick="shareToPlatform('link', currentPosterData)">
                    <span class="share-icon">🔗</span>
                    <span>复制链接</span>
                </button>
            </div>
        </div>
    `;

    const content = `
        <div class="poster-preview-container">
            <div class="template-selector">
                <h4 style="margin-bottom: 12px; color: #2D3436;">选择模板</h4>
                <div class="template-options">
                    ${templateOptions}
                </div>
            </div>
            <div class="poster-preview" style="margin-top: 16px;">
                <img src="${currentPosterData}" alt="人生海报" style="width: 100%; border-radius: 12px;">
            </div>
            ${sharePlatforms}
        </div>
    `;

    showModal('人生海报', content, [
        {
            text: '保存图片',
            action: 'save',
            class: 'btn-primary',
            onClick: () => downloadPoster(currentPosterData)
        },
        {
            text: '关闭',
            action: 'close',
            class: 'btn-secondary'
        }
    ]);

    // 绑定模板选择事件
    setTimeout(() => {
        document.querySelectorAll('.template-option').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const templateId = e.target.dataset.template;
                setPosterTemplate(templateId);
                currentPosterData = await generatePoster(currentGameData, templateId);
                const img = document.querySelector('.poster-preview img');
                if (img) {
                    img.src = currentPosterData;
                }
                document.querySelectorAll('.template-option').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
    }, 100);
}
