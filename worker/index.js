export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/ads.txt' || url.pathname === '/ads.txt/') {
      return new Response('google.com, pub-4849808315998185, DIRECT, f08c47fec0942fa0\n', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    return new Response('Not found', { status: 404 });
  }
};
