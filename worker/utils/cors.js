export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function handleCORS(request) {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function jsonResponse(data, status = 200) {
  return Response.json(data, { status, headers: corsHeaders });
}

export function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status, headers: corsHeaders });
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
