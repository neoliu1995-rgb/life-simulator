const API_BASE = '/api';

const AIInterpreter = {
  async getBasicReport(testType, answers, resultKey) {
    const token = localStorage.getItem('qc_auth_token');
    if (!token) {
      return { success: false, error: '请先登录' };
    }

    try {
      const res = await fetch(`${API_BASE}/ai/interpret`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType, answers, resultKey }),
      });

      const data = await res.json();
      if (data.content) {
        return { success: true, content: data.content, level: 'basic' };
      }
      return { success: false, error: data.error || 'AI解读失败' };
    } catch (err) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },

  async getPremiumReport(testType, answers, resultKey, paymentId) {
    const token = localStorage.getItem('qc_auth_token');
    if (!token) {
      return { success: false, error: '请先登录' };
    }

    try {
      const res = await fetch(`${API_BASE}/ai/interpret-premium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType, answers, resultKey, paymentId }),
      });

      const data = await res.json();
      if (data.content) {
        return { success: true, content: data.content, level: 'premium' };
      }
      return { success: false, error: data.error || 'AI解读失败' };
    } catch (err) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },

  renderReport(content, level) {
    const container = document.createElement('div');
    container.className = `ai-report ai-report-${level}`;

    const html = this.parseMarkdown(content);
    container.innerHTML = `
      <div class="ai-report-header">
        <span class="ai-report-badge">${level === 'premium' ? '✨ AI深度解读' : '🧠 AI智能解读'}</span>
      </div>
      <div class="ai-report-content">${html}</div>
    `;

    return container;
  },

  parseMarkdown(text) {
    return text
      .replace(/## (.*)/g, '<h3 class="ai-section-title">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '\n<li>')
      .replace(/\n\d+\. /g, '\n<li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  },

  showPaywall(testType, resultKey) {
    const overlay = document.createElement('div');
    overlay.id = 'ai-paywall';
    overlay.className = 'ai-paywall-overlay';
    overlay.innerHTML = `
      <div class="ai-paywall-card">
        <button class="ai-paywall-close" onclick="this.closest('.ai-paywall-overlay').remove()">×</button>
        
        <div class="ai-paywall-icon">🔮</div>
        <h2 class="ai-paywall-title">解锁AI深度解读</h2>
        <p class="ai-paywall-desc">获取2000字个性化报告，包含职业推荐、关系指南和成长路线图</p>
        
        <div class="ai-paywall-features">
          <div class="ai-paywall-feature">🧠 深度性格画像</div>
          <div class="ai-paywall-feature">💪 核心优势分析</div>
          <div class="ai-paywall-feature">💼 职业匹配推荐</div>
          <div class="ai-paywall-feature">❤️ 人际关系指南</div>
          <div class="ai-paywall-feature">🎯 行动路线图</div>
          <div class="ai-paywall-feature">✨ 独特洞察</div>
        </div>
        
        <div class="ai-paywall-price">
          <span class="price-original">¥9.9</span>
          <span class="price-current">¥4.9</span>
          <span class="price-tag">限时优惠</span>
        </div>
        
        <button class="ai-paywall-btn" onclick="AIInterpreter.startPayment('${testType}', '${resultKey}')">
          立即解锁
        </button>
        
        <p class="ai-paywall-note">🔒 安全支付 · 即时解锁 · 不满意可退款</p>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  async startPayment(testType, resultKey) {
    const token = localStorage.getItem('qc_auth_token');
    if (!token) {
      showToast('请先登录', 'error');
      return;
    }

    const channel = window.innerWidth < 768 ? 'wechat' : 'alipay';

    try {
      const res = await fetch(`${API_BASE}/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel, testType, resultKey }),
      });

      const data = await res.json();
      if (data.paymentId) {
        this.showPaymentQR(data);
        this.pollPaymentStatus(data.paymentId, testType, resultKey);
      }
    } catch {
      showToast('支付创建失败，请稍后重试', 'error');
    }
  },

  showPaymentQR(paymentData) {
    const overlay = document.getElementById('ai-paywall');
    if (!overlay) return;

    const card = overlay.querySelector('.ai-paywall-card');
    card.innerHTML = `
      <button class="ai-paywall-close" onclick="this.closest('.ai-paywall-overlay').remove()">×</button>
      
      <div class="ai-paywall-icon">💳</div>
      <h2 class="ai-paywall-title">扫码支付</h2>
      <p class="ai-paywall-desc">请使用${paymentData.channel === 'wechat' ? '微信' : '支付宝'}扫描下方二维码</p>
      
      <div class="ai-paywall-qr">
        <img src="${paymentData.qrCodeUrl || ''}" alt="支付二维码" onerror="this.parentElement.innerHTML='<div class=\\'ai-paywall-qr-placeholder\\'>二维码加载中...</div>'">
      </div>
      
      <div class="ai-paywall-amount">¥${paymentData.amountYuan}</div>
      
      <div class="ai-paywall-waiting">
        <div class="ai-paywall-spinner"></div>
        <span>等待支付中...</span>
      </div>
      
      <p class="ai-paywall-note">支付完成后将自动解锁</p>
    `;
  },

  async pollPaymentStatus(paymentId, testType, resultKey) {
    const token = localStorage.getItem('qc_auth_token');
    let attempts = 0;
    const maxAttempts = 60;

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        showToast('支付超时，请重试', 'error');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/payment/status?paymentId=${paymentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === 'paid') {
          clearInterval(interval);
          const overlay = document.getElementById('ai-paywall');
          if (overlay) overlay.remove();

          showToast('🎉 支付成功！正在生成报告...', 'success');

          if (window.currentTestAnswers) {
            const result = await this.getPremiumReport(
              testType, window.currentTestAnswers, resultKey, paymentId
            );
            if (result.success) {
              this.displayPremiumReport(result.content);
            }
          }
        }
      } catch {
        // continue polling
      }
    }, 3000);
  },

  displayPremiumReport(content) {
    const reportContainer = document.getElementById('ai-report-container');
    if (!reportContainer) return;

    reportContainer.innerHTML = '';
    reportContainer.appendChild(this.renderReport(content, 'premium'));
    reportContainer.style.display = 'block';
    reportContainer.scrollIntoView({ behavior: 'smooth' });
  },
};

window.AIInterpreter = AIInterpreter;
