export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/ads.txt') {
      return new Response('google.com, pub-4849808315998185, DIRECT, f08c47fec0942fa0\n', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    // 对于其他请求，直接回源
    return fetch(request);
  },
};
