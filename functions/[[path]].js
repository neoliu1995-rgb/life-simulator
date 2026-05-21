export const onRequest = async (context) => {
  if (context.request.url.endsWith('/ads.txt') || context.request.url.endsWith('/ads.txt/')) {
    return new Response('google.com, pub-4849808315998185, DIRECT, f08c47fec0942fa0\n', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }
  return context.next();
};
