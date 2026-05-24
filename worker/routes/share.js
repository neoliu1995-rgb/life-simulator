import { jsonResponse, errorResponse, authenticateRequest, generateShortCode, corsHeaders } from '../utils/cors.js';

export async function handleShare(request, env, path) {
  if (path === '/api/share/generate' && request.method === 'POST') {
    return await generateShareLink(request, env);
  }

  if (path.startsWith('/api/share/track/') && request.method === 'GET') {
    return await trackShareClick(request, env, path);
  }

  if (path === '/api/share/stats' && request.method === 'GET') {
    return await getShareStats(request, env);
  }

  return errorResponse('Not found', 404);
}

async function generateShareLink(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { testType, resultKey, platform } = await request.json();
  if (!testType) {
    return errorResponse('Missing testType');
  }

  const shortCode = generateShortCode();

  await env.DB.prepare(
    'INSERT INTO share_links (id, user_id, test_type, result_key, platform, created_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))'
  ).bind(shortCode, session.userId, testType, resultKey || '', platform || 'general').run();

  const shareUrl = `https://quweiceshi.com/s/${shortCode}`;

  return jsonResponse({
    shortCode,
    shareUrl,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`,
    copyText: `我在趣味测试测了${testType}，结果超准！快来试试 👉 ${shareUrl}`,
  });
}

async function trackShareClick(request, env, path) {
  const shortCode = path.split('/').pop();

  const link = await env.DB.prepare('SELECT * FROM share_links WHERE id = ?').bind(shortCode).first();
  if (!link) {
    return Response.redirect('https://quweiceshi.com/', 302);
  }

  await env.DB.prepare('UPDATE share_links SET clicks = clicks + 1 WHERE id = ?').bind(shortCode).run();

  const referer = request.headers.get('Referer') || '';
  const isNewUser = !request.headers.get('Cookie')?.includes('qc_user');

  if (isNewUser) {
    await env.DB.prepare('UPDATE share_links SET conversions = conversions + 1 WHERE id = ?').bind(shortCode).run();

    if (link.user_id) {
      await env.DB.prepare(
        'INSERT INTO point_transactions (user_id, amount, reason, ref_id, created_at) VALUES (?, 50, \'share_conversion\', ?, datetime(\'now\'))'
      ).bind(link.user_id, shortCode).run();

      await env.DB.prepare('UPDATE users SET points = points + 50 WHERE id = ?').bind(link.user_id).run();
    }
  }

  const targetUrl = link.test_type ? `https://quweiceshi.com/${link.test_type}` : 'https://quweiceshi.com/';
  return Response.redirect(targetUrl, 302);
}

async function getShareStats(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const links = await env.DB.prepare(
    'SELECT * FROM share_links WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(session.userId).all();

  const totalClicks = links.results.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const totalConversions = links.results.reduce((sum, l) => sum + (l.conversions || 0), 0);

  return jsonResponse({
    totalLinks: links.results.length,
    totalClicks,
    totalConversions,
    links: links.results.map(l => ({
      shortCode: l.id,
      testType: l.test_type,
      platform: l.platform,
      clicks: l.clicks,
      conversions: l.conversions,
      createdAt: l.created_at,
    })),
  });
}
