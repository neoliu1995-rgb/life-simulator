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
      if (typeof showToast === 'function') showToast('请先登录', 'error');
      return;
    }

    const returnUrl = window.location.href.split('?')[0];

    try {
      const res = await fetch(`${API_BASE}/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType, resultKey, returnUrl }),
      });

      const data = await res.json();

      if (data.error) {
        if (typeof showToast === 'function') showToast(data.error, 'error');
        return;
      }

      if (data.paymentId) {
        if (data.payUrl && window.innerWidth < 768) {
          this._activePayment = { paymentId: data.paymentId, testType, resultKey };
          localStorage.setItem('qc_pending_payment', JSON.stringify(this._activePayment));
          window.location.href = data.payUrl;
          return;
        }
        this.showPaymentQR(data);
        this.pollPaymentStatus(data.paymentId, testType, resultKey);
      }
    } catch {
      if (typeof showToast === 'function') showToast('支付创建失败，请稍后重试', 'error');
    }
  },

  showPaymentQR(paymentData) {
    const overlay = document.getElementById('ai-paywall');
    if (!overlay) return;

    const qrSrc = paymentData.qrCodeUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData.qrCodeUrl)}`
      : '';

    const card = overlay.querySelector('.ai-paywall-card');
    card.innerHTML = `
      <button class="ai-paywall-close" onclick="AIInterpreter.cancelPayment()">×</button>
      
      <div class="ai-paywall-icon">💳</div>
      <h2 class="ai-paywall-title">扫码支付</h2>
      <p class="ai-paywall-desc">使用微信或支付宝扫描下方二维码完成支付</p>
      
      <div class="ai-paywall-qr">
        ${qrSrc ? `<img src="${qrSrc}" alt="支付二维码" onerror="this.parentElement.innerHTML='<div class=\\'ai-paywall-qr-placeholder\\'>二维码加载中...</div>'">` : '<div class="ai-paywall-qr-placeholder">正在生成二维码...</div>'}
      </div>
      
      <div class="ai-paywall-amount">¥${paymentData.amountYuan}</div>
      
      <div class="ai-paywall-waiting">
        <div class="ai-paywall-spinner"></div>
        <span>等待支付中...</span>
      </div>
      
      <button class="ai-paywall-check-btn" onclick="AIInterpreter.manualCheckPayment()">
        我已完成支付
      </button>
      
      <p class="ai-paywall-note">支付完成后将自动解锁</p>
    `;
  },

  cancelPayment() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    const overlay = document.getElementById('ai-paywall');
    if (overlay) overlay.remove();
  },

  async manualCheckPayment() {
    if (!this._activePaymentId) return;

    const token = localStorage.getItem('qc_auth_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/payment/status?paymentId=${this._activePaymentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'paid') {
        this.onPaymentSuccess(this._activePaymentId, this._activeTestType, this._activeResultKey);
      } else {
        if (typeof showToast === 'function') showToast('尚未检测到支付，请稍后再试', 'info');
      }
    } catch {
      if (typeof showToast === 'function') showToast('查询失败，请稍后重试', 'error');
    }
  },

  pollPaymentStatus(paymentId, testType, resultKey) {
    this._activePaymentId = paymentId;
    this._activeTestType = testType;
    this._activeResultKey = resultKey;

    if (this._pollTimer) clearInterval(this._pollTimer);

    let attempts = 0;
    const maxAttempts = 100;

    this._pollTimer = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(this._pollTimer);
        this._pollTimer = null;
        if (typeof showToast === 'function') showToast('支付超时，请重新尝试', 'error');
        return;
      }

      const token = localStorage.getItem('qc_auth_token');
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/payment/status?paymentId=${paymentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === 'paid') {
          this.onPaymentSuccess(paymentId, testType, resultKey);
        }
      } catch {
        // continue polling
      }
    }, 3000);
  },

  async onPaymentSuccess(paymentId, testType, resultKey) {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }

    const overlay = document.getElementById('ai-paywall');
    if (overlay) overlay.remove();

    localStorage.removeItem('qc_pending_payment');

    if (typeof showToast === 'function') showToast('🎉 支付成功！正在生成报告...', 'success');

    if (window.currentTestAnswers) {
      const result = await this.getPremiumReport(
        testType, window.currentTestAnswers, resultKey, paymentId
      );
      if (result.success) {
        this.displayPremiumReport(result.content);
      }
    }
  },

  displayPremiumReport(content) {
    const reportContainer = document.getElementById('ai-report-container');
    if (!reportContainer) return;

    reportContainer.innerHTML = '';
    reportContainer.appendChild(this.renderReport(content, 'premium'));
    reportContainer.style.display = 'block';
    reportContainer.scrollIntoView({ behavior: 'smooth' });
  },

  async checkPendingPayment() {
    const pending = localStorage.getItem('qc_pending_payment');
    if (!pending) return;

    try {
      const { paymentId, testType, resultKey } = JSON.parse(pending);
      const token = localStorage.getItem('qc_auth_token');
      if (!token || !paymentId) {
        localStorage.removeItem('qc_pending_payment');
        return;
      }

      const res = await fetch(`${API_BASE}/payment/status?paymentId=${paymentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'paid') {
        localStorage.removeItem('qc_pending_payment');
        if (typeof showToast === 'function') showToast('🎉 支付成功！正在生成报告...', 'success');
        if (window.currentTestAnswers) {
          const result = await this.getPremiumReport(testType, window.currentTestAnswers, resultKey, paymentId);
          if (result.success) {
            this.displayPremiumReport(result.content);
          }
        }
      } else {
        localStorage.removeItem('qc_pending_payment');
      }
    } catch {
      localStorage.removeItem('qc_pending_payment');
    }
  },

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');

    if (paymentId) {
      window.history.replaceState({}, '', window.location.pathname);
      this.checkPendingPayment();
    }
  },
};

window.AIInterpreter = AIInterpreter;

document.addEventListener('DOMContentLoaded', () => {
  AIInterpreter.init();
});
