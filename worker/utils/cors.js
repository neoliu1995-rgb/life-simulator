const ALLOWED_ORIGINS = [
  'https://quweiceshi.com',
  'https://www.quweiceshi.com',
  'https://life-simulatorlife-simulator-web-v2life-simulator-web-v2li.pages.dev',
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function handleCORS(request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(request) });
}

export function jsonResponse(data, status = 200, request) {
  return Response.json(data, { status, headers: getCorsHeaders(request || { headers: { get: () => '' } }) });
}

export function errorResponse(message, status = 400, request) {
  return Response.json({ error: message }, { status, headers: getCorsHeaders(request || { headers: { get: () => '' } }) });
}

const rateLimitMap = new Map();

export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.startTime > windowMs) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

export function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
}

export async function authenticateRequest(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const sessionData = await env.SESSIONS.get(`session:${token}`);
    if (!sessionData) return null;
    const session = JSON.parse(sessionData);
    return session;
  } catch {
    return null;
  }
}

export function generateId() {
  return crypto.randomUUID();
}

export function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(6);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 6; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}
