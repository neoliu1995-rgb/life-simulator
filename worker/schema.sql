-- quweiceshi.com 数据库Schema
-- Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL DEFAULT '',
    avatar_url TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    wechat_openid TEXT UNIQUE,
    points INTEGER DEFAULT 100,
    level INTEGER DEFAULT 1,
    login_streak INTEGER DEFAULT 0,
    last_login_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_wechat ON users(wechat_openid);
CREATE INDEX idx_users_phone ON users(phone);

CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    test_type TEXT NOT NULL,
    result_key TEXT NOT NULL,
    answers_json TEXT,
    result_data_json TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_test_results_user ON test_results(user_id);
CREATE INDEX idx_test_results_type ON test_results(test_type);
CREATE INDEX idx_test_results_user_type ON test_results(user_id, test_type);

CREATE TABLE IF NOT EXISTS ai_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    test_result_id INTEGER NOT NULL REFERENCES test_results(id),
    report_level TEXT NOT NULL DEFAULT 'basic',
    content_json TEXT NOT NULL,
    prompt_version TEXT DEFAULT 'v1',
    model_used TEXT DEFAULT 'gpt-4o-mini',
    tokens_used INTEGER DEFAULT 0,
    payment_id TEXT,
    amount INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_ai_reports_user ON ai_reports(user_id);
CREATE INDEX idx_ai_reports_result ON ai_reports(test_result_id);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    ai_report_id INTEGER REFERENCES ai_reports(id),
    channel TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    channel_trade_no TEXT,
    raw_response_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    paid_at TEXT,
    expired_at TEXT
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE IF NOT EXISTS point_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    ref_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_point_tx_user ON point_transactions(user_id);

CREATE TABLE IF NOT EXISTS share_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    test_type TEXT NOT NULL,
    result_key TEXT,
    platform TEXT DEFAULT 'general',
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_share_links_user ON share_links(user_id);

CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_achievements_user ON user_achievements(user_id);
