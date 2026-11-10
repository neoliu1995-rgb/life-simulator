import { handleAuth } from './routes/auth.js';
import { handleAI } from './routes/ai.js';
import { handlePayment } from './routes/payment.js';
import { handleShare } from './routes/share.js';
import { handleUser } from './routes/user.js';
import { handleAds } from './routes/ads.js';
import { handleCORS, checkRateLimit, getClientIP, jsonResponse, errorResponse } from './utils/cors.js';

const RATE_LIMITS = {
  auth: { limit: 10, windowMs: 60000 },
  ai: { limit: 10, windowMs: 3600000 },
  payment: { limit: 5, windowMs: 60000 },
  share: { limit: 20, windowMs: 3600000 },
  user: { limit: 30, windowMs: 60000 },
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/ads.txt') {
        return new Response('google.com, pub-4849808315998185, DIRECT, f08c47fec0942fa0\n', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
        });
      }

      const clientIP = getClientIP(request);

      if (path.startsWith('/api/auth')) {
        const rl = checkRateLimit(`auth:${clientIP}`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
        if (!rl.allowed) return errorResponse('Too many requests', 429, request);
        return await handleAuth(request, env, path);
      }

      if (path.startsWith('/api/ai')) {
        const rl = checkRateLimit(`ai:${clientIP}`, RATE_LIMITS.ai.limit, RATE_LIMITS.ai.windowMs);
        if (!rl.allowed) return errorResponse('AI usage limit reached, please try later', 429, request);
        return await handleAI(request, env, path);
      }

      if (path.startsWith('/api/payment')) {
        const rl = checkRateLimit(`pay:${clientIP}`, RATE_LIMITS.payment.limit, RATE_LIMITS.payment.windowMs);
        if (!rl.allowed) return errorResponse('Too many payment requests', 429, request);
        return await handlePayment(request, env, path);
      }

      if (path.startsWith('/api/share')) {
        const rl = checkRateLimit(`share:${clientIP}`, RATE_LIMITS.share.limit, RATE_LIMITS.share.windowMs);
        if (!rl.allowed) return errorResponse('Too many share requests', 429, request);
        return await handleShare(request, env, path);
      }

      if (path.startsWith('/api/user')) {
        return await handleUser(request, env, path);
      }

      if (path.startsWith('/api/health')) {
        return jsonResponse({ status: 'ok', version: '2.1.0', timestamp: new Date().toISOString() }, 200, request);
      }

      return fetch(request);
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal Server Error', 500, request);
    }
  },
};
