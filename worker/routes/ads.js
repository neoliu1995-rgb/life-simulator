import { jsonResponse } from '../utils/cors.js';

export async function handleAds(request, env, path) {
  if (path === '/api/ads/report') {
    return jsonResponse({ received: true });
  }

  return jsonResponse({ error: 'Not found' }, 404);
}
