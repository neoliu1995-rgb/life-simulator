const STORAGE_KEYS = {
    TEST_RECORDS: 'life_sim_test_records',
    ACHIEVEMENTS: 'life_sim_achievements',
    USER_PROFILE: 'life_sim_user_profile'
};

const StorageManager = {
    saveTestRecord: function(type, data) {
        const records = this.getTestRecords();
        const record = {
            id: Date.now(),
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        };
        records.unshift(record);
        if (records.length > 50) {
            records.pop();
        }
        localStorage.setItem(STORAGE_KEYS.TEST_RECORDS, JSON.stringify(records));
        return record;
    },

    getTestRecords: function(type = null) {
        const records = localStorage.getItem(STORAGE_KEYS.TEST_RECORDS);
        const parsed = records ? JSON.parse(records) : [];
        if (type) {
            return parsed.filter(r => r.type === type);
        }
        return parsed;
    },

    getRecentRecords: function(count = 10) {
        const records = this.getTestRecords();
        return records.slice(0, count);
    },

    clearTestRecords: function() {
        localStorage.removeItem(STORAGE_KEYS.TEST_RECORDS);
    },

    unlockAchievement: function(achievementId) {
        const achievements = this.getAchievements();
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
            return true;
        }
        return false;
    },

    getAchievements: function() {
        const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        return achievements ? JSON.parse(achievements) : [];
    },

    isAchievementUnlocked: function(achievementId) {
        const achievements = this.getAchievements();
        return achievements.includes(achievementId);
    },

    saveUserProfile: function(profile) {
        const existing = this.getUserProfile();
        const merged = { ...existing, ...profile };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(merged));
        return merged;
    },

    getUserProfile: function() {
        const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : {};
    },

    clearAllData: function() {
        localStorage.removeItem(STORAGE_KEYS.TEST_RECORDS);
        localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    },

    getStatistics: function() {
        const records = this.getTestRecords();
        const stats = {
            total: records.length,
            byType: {},
            recent: records.slice(0, 5)
        };
        
        records.forEach(record => {
            if (!stats.byType[record.type]) {
                stats.byType[record.type] = 0;
            }
            stats.byType[record.type]++;
        });
        
        return stats;
    }
};

const ACHIEVEMENTS = {
    FIRST_TEST: { id: 'first_test', name: '初试牛刀', description: '完成第一次测试', icon: '🎮' },
    MBTI_EXPERT: { id: 'mbti_expert', name: '性格专家', description: '完成5次MBTI测试', icon: '🧠' },
    LOVE_MATCHER: { id: 'love_matcher', name: '爱情专家', description: '完成5次爱情匹配', icon: '💕' },
    BAZI_MASTER: { id: 'bazi_master', name: '命理大师', description: '完成5次八字测算', icon: '🔮' },
    LIFE_SIMULATOR: { id: 'life_simulator', name: '人生玩家', description: '完成10次人生重开', icon: '🎲' },
    PERFECT_MATCH: { id: 'perfect_match', name: '天作之合', description: '获得100%爱情匹配', icon: '💯' },
    COLLECTOR: { id: 'collector', name: '成就收藏家', description: '解锁所有成就', icon: '🏆' }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, ACHIEVEMENTS, STORAGE_KEYS };
}