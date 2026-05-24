const API_BASE = '/api';

const UserAuth = {
  token: null,
  user: null,

  init() {
    this.token = localStorage.getItem('qc_auth_token');
    if (this.token) {
      this.verifyToken();
    }
  },

  async verifyToken() {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
      });
      const data = await res.json();
      if (data.valid) {
        this.user = data.user;
        this.onAuthStateChanged(this.user);
        return true;
      }
      this.logout();
      return false;
    } catch {
      this.logout();
      return false;
    }
  },

  async wechatLogin(code) {
    try {
      const res = await fetch(`${API_BASE}/auth/wechat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.token) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('qc_auth_token', this.token);
        this.onAuthStateChanged(this.user);
        return { success: true, user: this.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async guestLogin() {
    try {
      const res = await fetch(`${API_BASE}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.token) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('qc_auth_token', this.token);
        this.onAuthStateChanged(this.user);
        return { success: true, user: this.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('qc_auth_token');
    this.onAuthStateChanged(null);
  },

  isLoggedIn() {
    return !!this.token && !!this.user;
  },

  async getProfile() {
    if (!this.token) return null;
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateProfile(data) {
    if (!this.token) return { success: false };
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && this.user) {
        Object.assign(this.user, data);
      }
      return result;
    } catch {
      return { success: false };
    }
  },

  async saveTestResult(testType, resultKey, answers, resultData) {
    if (!this.token) return { success: false };
    try {
      const res = await fetch(`${API_BASE}/user/test-results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType, resultKey, answers, resultData }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async getRecommendations() {
    if (!this.token) return [];
    try {
      const res = await fetch(`${API_BASE}/user/recommendations`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
      });
      const data = await res.json();
      return data.recommendations || [];
    } catch {
      return [];
    }
  },

  onAuthStateChanged(user) {
    document.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
  },
};

window.UserAuth = UserAuth;
