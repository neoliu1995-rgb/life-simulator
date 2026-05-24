import { jsonResponse, errorResponse, generateId, corsHeaders } from '../utils/cors.js';

export async function handleAuth(request, env, path) {
  if (path === '/api/auth/wechat' && request.method === 'POST') {
    return await wechatLogin(request, env);
  }

  if (path === '/api/auth/guest' && request.method === 'POST') {
    return await guestLogin(request, env);
  }

  if (path === '/api/auth/verify' && request.method === 'POST') {
    return await verifyToken(request, env);
  }

  return errorResponse('Not found', 404);
}

async function wechatLogin(request, env) {
  const { code } = await request.json();
  if (!code) {
    return errorResponse('Missing wechat code');
  }

  const wxRes = await fetch(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${env.WECHAT_APPID}&secret=${env.WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`
  );
  const wxData = await wxRes.json();

  if (wxData.errcode) {
    return errorResponse('Wechat auth failed: ' + wxData.errmsg, 401);
  }

  const openid = wxData.openid;
  let user = await env.DB.prepare('SELECT * FROM users WHERE wechat_openid = ?').bind(openid).first();

  if (!user) {
    const userId = generateId();
    await env.DB.prepare(
      'INSERT INTO users (id, wechat_openid, nickname, points, login_streak, last_login_at, created_at) VALUES (?, ?, ?, 100, 1, datetime(\'now\'), datetime(\'now\'))'
    ).bind(userId, openid, `用户${generateId().slice(0, 4)}`).run();

    user = { id: userId, wechat_openid: openid, nickname: `用户${userId.slice(0, 4)}`, points: 100, level: 1, login_streak: 1 };
  } else {
    const lastLogin = user.last_login_at ? new Date(user.last_login_at) : null;
    const now = new Date();
    let streak = user.login_streak || 0;
    if (lastLogin) {
      const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    await env.DB.prepare(
      'UPDATE users SET login_streak = ?, last_login_at = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(streak, user.id).run();

    user.login_streak = streak;
  }

  const token = generateId();
  await env.SESSIONS.put(`session:${token}`, JSON.stringify({ userId: user.id, type: 'wechat' }), { expirationTtl: 86400 * 30 });

  return jsonResponse({
    token,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar_url || '',
      points: user.points,
      level: user.level || 1,
      loginStreak: user.login_streak,
    },
  });
}

async function guestLogin(request, env) {
  const userId = generateId();
  const nickname = `访客${userId.slice(0, 6)}`;

  await env.DB.prepare(
    'INSERT INTO users (id, nickname, points, login_streak, last_login_at, created_at) VALUES (?, ?, 50, 1, datetime(\'now\'), datetime(\'now\'))'
  ).bind(userId, nickname).run();

  const token = generateId();
  await env.SESSIONS.put(`session:${token}`, JSON.stringify({ userId, type: 'guest' }), { expirationTtl: 86400 * 7 });

  return jsonResponse({
    token,
    user: {
      id: userId,
      nickname,
      avatar: '',
      points: 50,
      level: 1,
      loginStreak: 1,
    },
  });
}

async function verifyToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Missing token', 401);
  }

  const token = authHeader.slice(7);
  const sessionData = await env.SESSIONS.get(`session:${token}`);

  if (!sessionData) {
    return errorResponse('Invalid token', 401);
  }

  const session = JSON.parse(sessionData);
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(session.userId).first();

  if (!user) {
    return errorResponse('User not found', 404);
  }

  return jsonResponse({
    valid: true,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar_url || '',
      points: user.points,
      level: user.level || 1,
      loginStreak: user.login_streak,
    },
  });
}
