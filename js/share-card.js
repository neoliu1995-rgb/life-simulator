const API_BASE = '/api';

const ShareCard = {
  async generate(testType, resultData) {
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 2;
    canvas.width = 540 * dpr;
    canvas.height = 720 * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    this.drawBackground(ctx, 540, 720);
    this.drawLogo(ctx);
    this.drawResult(ctx, testType, resultData);
    this.drawStats(ctx, resultData);
    this.drawQRSection(ctx);
    this.drawFooter(ctx);

    return canvas.toDataURL('image/png', 0.95);
  },

  drawBackground(ctx, w, h) {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#1a1a3a');
    gradient.addColorStop(1, '#0a0a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    const accentGradient = ctx.createLinearGradient(0, 0, w, 0);
    accentGradient.addColorStop(0, '#FF6B6B');
    accentGradient.addColorStop(0.5, '#4ECDC4');
    accentGradient.addColorStop(1, '#45B7D1');
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, w, 4);
  },

  drawLogo(ctx) {
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('🎲 趣味测试', 30, 45);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('quweiceshi.com', 510, 45);
  },

  drawResult(ctx, testType, resultData) {
    const typeLabels = {
      mbti: 'MBTI性格测试',
      bazi: '八字运势',
      zodiac: '生肖运势',
      constellation: '星座运势',
      love: '爱情匹配',
      dream: '解梦',
      namestat: '姓名测试',
      psychology: '心理测试',
      attachment: '依恋测试',
      tarot: '塔罗占卜',
    };

    ctx.textAlign = 'center';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(typeLabels[testType] || '趣味测试', 270, 90);

    if (resultData.type) {
      const gradient = ctx.createLinearGradient(170, 120, 370, 120);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(0.5, '#4ECDC4');
      gradient.addColorStop(1, '#45B7D1');
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.fillStyle = gradient;
      ctx.fillText(resultData.type, 270, 170);
    }

    if (resultData.title) {
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(resultData.title, 270, 210);
    }

    if (resultData.description) {
      ctx.font = '15px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      this.wrapText(ctx, `"${resultData.description}"`, 270, 250, 440, 22);
    }
  },

  drawStats(ctx, resultData) {
    if (!resultData.stats) return;

    const stats = resultData.stats;
    const startY = 340;
    const barWidth = 360;
    const barHeight = 12;
    const startX = 90;

    stats.forEach((stat, i) => {
      const y = startY + i * 50;

      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'left';
      ctx.fillText(stat.label, startX, y);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.roundRect(startX, y + 8, barWidth, barHeight, 6);
      ctx.fill();

      const gradient = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(0.5, '#4ECDC4');
      gradient.addColorStop(1, '#45B7D1');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(startX, y + 8, barWidth * (stat.value / 100), barHeight, 6);
      ctx.fill();

      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = '#4ECDC4';
      ctx.textAlign = 'right';
      ctx.fillText(`${stat.value}%`, startX + barWidth + 40, y + 18);
    });
  },

  drawQRSection(ctx) {
    const y = 560;

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(30, y, 480, 100, 12);
    ctx.fill();

    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('👆 扫码或搜索 quweiceshi.com 测测你是哪种类型', 270, y + 35);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('#MBTI #性格测试 #趣味测试', 270, y + 65);
  },

  drawFooter(ctx) {
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('结果仅供参考娱乐 · quweiceshi.com', 270, 700);
  },

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  },

  async shareToSocial(testType, resultData) {
    const token = localStorage.getItem('qc_auth_token');

    let shareUrl = `https://quweiceshi.com/${testType}`;
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/share/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testType,
            resultKey: resultData.type || '',
            platform: 'general',
          }),
        });
        const data = await res.json();
        if (data.shareUrl) {
          shareUrl = data.shareUrl;
        }
      } catch {
        // use default URL
      }
    }

    const typeLabels = {
      mbti: 'MBTI性格测试',
      bazi: '八字运势',
      zodiac: '生肖运势',
      constellation: '星座运势',
      love: '爱情匹配',
      dream: '解梦',
      namestat: '姓名测试',
      psychology: '心理测试',
      attachment: '依恋测试',
      tarot: '塔罗占卜',
    };

    const shareText = `我在趣味测试测了${typeLabels[testType] || '测试'}，结果是${resultData.type || ''}！${resultData.description || ''} 快来试试 👉 ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `趣味测试 - ${typeLabels[testType] || ''}`,
          text: shareText,
          url: shareUrl,
        });
        return { success: true };
      } catch {
        // user cancelled
      }
    }

    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  },

  async downloadCard(testType, resultData) {
    const imageData = await this.generate(testType, resultData);
    const link = document.createElement('a');
    link.download = `趣味测试_${testType}_${resultData.type || 'result'}.png`;
    link.href = imageData;
    link.click();
  },
};

window.ShareCard = ShareCard;
