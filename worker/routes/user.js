import { jsonResponse, errorResponse, authenticateRequest, corsHeaders } from '../utils/cors.js';

export async function handleUser(request, env, path) {
  if (path === '/api/user/profile' && request.method === 'GET') {
    return await getProfile(request, env);
  }

  if (path === '/api/user/profile' && request.method === 'PUT') {
    return await updateProfile(request, env);
  }

  if (path === '/api/user/test-results' && request.method === 'GET') {
    return await getTestResults(request, env);
  }

  if (path === '/api/user/test-results' && request.method === 'POST') {
    return await saveTestResult(request, env);
  }

  if (path === '/api/user/points' && request.method === 'GET') {
    return await getPointsHistory(request, env);
  }

  if (path === '/api/user/recommendations' && request.method === 'GET') {
    return await getRecommendations(request, env);
  }

  if (path === '/api/user/dashboard' && request.method === 'GET') {
    return await getDashboard(request, env);
  }

  return errorResponse('Not found', 404);
}

async function getProfile(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(session.userId).first();
  if (!user) {
    return errorResponse('User not found', 404);
  }

  const testCount = await env.DB.prepare('SELECT COUNT(*) as count FROM test_results WHERE user_id = ?').bind(session.userId).first();
  const reportCount = await env.DB.prepare('SELECT COUNT(*) as count FROM ai_reports WHERE user_id = ?').bind(session.userId).first();

  return jsonResponse({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar_url || '',
    points: user.points,
    level: user.level || 1,
    loginStreak: user.login_streak,
    testCount: testCount?.count || 0,
    reportCount: reportCount?.count || 0,
    createdAt: user.created_at,
  });
}

async function updateProfile(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { nickname, avatar } = await request.json();

  if (nickname) {
    await env.DB.prepare('UPDATE users SET nickname = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(nickname, session.userId).run();
  }
  if (avatar) {
    await env.DB.prepare('UPDATE users SET avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(avatar, session.userId).run();
  }

  return jsonResponse({ success: true });
}

async function getTestResults(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const testType = url.searchParams.get('type');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  let query = 'SELECT * FROM test_results WHERE user_id = ?';
  const params = [session.userId];

  if (testType) {
    query += ' AND test_type = ?';
    params.push(testType);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const results = await env.DB.prepare(query).bind(...params).all();

  return jsonResponse({
    results: results.results.map(r => ({
      id: r.id,
      testType: r.test_type,
      resultKey: r.result_key,
      isPremium: !!r.is_premium,
      shareCount: r.share_count,
      createdAt: r.created_at,
    })),
  });
}

async function saveTestResult(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { testType, resultKey, answers, resultData } = await request.json();
  if (!testType || !resultKey) {
    return errorResponse('Missing required fields');
  }

  const existing = await env.DB.prepare(
    'SELECT id FROM test_results WHERE user_id = ? AND test_type = ? AND result_key = ?'
  ).bind(session.userId, testType, resultKey).first();

  if (existing) {
    return jsonResponse({ success: true, id: existing.id, message: 'Result already saved' });
  }

  const result = await env.DB.prepare(
    'INSERT INTO test_results (user_id, test_type, result_key, answers_json, result_data_json, created_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))'
  ).bind(session.userId, testType, resultKey, JSON.stringify(answers || {}), JSON.stringify(resultData || {})).run();

  await env.DB.prepare(
    'INSERT INTO point_transactions (user_id, amount, reason, created_at) VALUES (?, 10, \'complete_test\', datetime(\'now\'))'
  ).bind(session.userId).run();

  await env.DB.prepare('UPDATE users SET points = points + 10 WHERE id = ?').bind(session.userId).run();

  return jsonResponse({ success: true, id: result.meta.last_row_id, pointsEarned: 10 });
}

async function getPointsHistory(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const transactions = await env.DB.prepare(
    'SELECT * FROM point_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).bind(session.userId).all();

  return jsonResponse({
    transactions: transactions.results.map(t => ({
      amount: t.amount,
      reason: t.reason,
      createdAt: t.created_at,
    })),
  });
}

async function getRecommendations(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const completedTypes = await env.DB.prepare(
    'SELECT DISTINCT test_type FROM test_results WHERE user_id = ?'
  ).bind(session.userId).all();

  const completed = new Set(completedTypes.results.map(r => r.test_type));

  const allTests = [
    { type: 'mbti', name: 'MBTI性格测试', icon: '🧠', priority: 1 },
    { type: 'bazi', name: '八字运势', icon: '🔮', priority: 2 },
    { type: 'zodiac', name: '生肖运势', icon: '🐉', priority: 3 },
    { type: 'constellation', name: '星座运势', icon: '⭐', priority: 4 },
    { type: 'love', name: '爱情匹配', icon: '💕', priority: 5 },
    { type: 'dream', name: '解梦', icon: '🌙', priority: 6 },
    { type: 'namestat', name: '姓名测试', icon: '📝', priority: 7 },
    { type: 'psychology', name: '心理测试', icon: '🎭', priority: 8 },
    { type: 'attachment', name: '依恋测试', icon: '💝', priority: 9 },
    { type: 'tarot', name: '塔罗占卜', icon: '🃏', priority: 10 },
  ];

  const recommendations = [];

  if (completed.has('mbti') && !completed.has('love')) {
    recommendations.push({
      type: 'love',
      name: '爱情匹配测试',
      icon: '💕',
      reason: '既然你知道了自己的MBTI类型，看看谁最适合你',
      priority: 'high',
    });
  }

  if (completed.has('mbti') && !completed.has('bazi')) {
    recommendations.push({
      type: 'bazi',
      name: '八字运势',
      icon: '🔮',
      reason: '从东方命理角度解读你的人生轨迹',
      priority: 'high',
    });
  }

  if (completed.has('constellation') && !completed.has('zodiac')) {
    recommendations.push({
      type: 'zodiac',
      name: '生肖运势',
      icon: '🐉',
      reason: '结合生肖看你的年度运势',
      priority: 'medium',
    });
  }

  const uncompleted = allTests.filter(t => !completed.has(t.type));
  for (const test of uncompleted) {
    if (!recommendations.find(r => r.type === test.type)) {
      recommendations.push({
        ...test,
        reason: '还没有试过这个测试哦',
        priority: 'low',
      });
    }
  }

  return jsonResponse({ recommendations: recommendations.slice(0, 5) });
}

async function getDashboard(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(session.userId).first();
  const testCount = await env.DB.prepare('SELECT COUNT(*) as count FROM test_results WHERE user_id = ?').bind(session.userId).first();
  const recentTests = await env.DB.prepare(
    'SELECT test_type, result_key, created_at FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
  ).bind(session.userId).all();

  const recommendations = await (async () => {
    const completedTypes = await env.DB.prepare(
      'SELECT DISTINCT test_type FROM test_results WHERE user_id = ?'
    ).bind(session.userId).all();
    return completedTypes.results.length;
  })();

  return jsonResponse({
    user: {
      nickname: user.nickname,
      avatar: user.avatar_url || '',
      points: user.points,
      level: user.level || 1,
      loginStreak: user.login_streak,
    },
    stats: {
      totalTests: testCount?.count || 0,
      uniqueTypes: recommendations,
    },
    recentTests: recentTests.results,
  });
}
