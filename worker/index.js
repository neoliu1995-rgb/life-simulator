import { handleAuth } from './routes/auth.js';
import { handleAI } from './routes/ai.js';
import { handlePayment } from './routes/payment.js';
import { handleShare } from './routes/share.js';
import { handleUser } from './routes/user.js';
import { handleAds } from './routes/ads.js';
import { corsHeaders, handleCORS } from './utils/cors.js';

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

      if (path.startsWith('/api/auth')) {
        return await handleAuth(request, env, path);
      }

      if (path.startsWith('/api/ai')) {
        return await handleAI(request, env, path);
      }

      if (path.startsWith('/api/payment')) {
        return await handlePayment(request, env, path);
      }

      if (path.startsWith('/api/share')) {
        return await handleShare(request, env, path);
      }

      if (path.startsWith('/api/user')) {
        return await handleUser(request, env, path);
      }

      if (path.startsWith('/api/health')) {
        return Response.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString() });
      }

      return fetch(request);
    } catch (err) {
      console.error('Worker error:', err);
      return Response.json({ error: 'Internal Server Error', message: err.message }, { status: 500, headers: corsHeaders });
    }
  },
};
