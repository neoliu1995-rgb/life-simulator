import { jsonResponse, errorResponse, authenticateRequest, generateId } from '../utils/cors.js';

const PREMIUM_PRICE = 490;
const XUNHU_GATEWAY = 'https://api.xunhupay.com/payment/do.html';

function md5(str) {
  const utf8 = new TextEncoder().encode(str);
  let s = '';
  for (let i = 0; i < utf8.length; i++) s += String.fromCharCode(utf8[i]);

  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

  function md5blk(s) {
    var md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = '0123456789abcdef'.split('');
  function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++) {
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
    }
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
    return x.join('');
  }

  function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
  }

  var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return hex(state);
}

function generateXunhuHash(params, appSecret) {
  const sortedKeys = Object.keys(params)
    .filter(k => k !== 'hash' && params[k] !== '' && params[k] !== null && params[k] !== undefined)
    .sort();
  const stringA = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  return md5(stringA + appSecret);
}

function generateNonceStr() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 32; i++) {
    result += chars[arr[i] % chars.length];
  }
  return result;
}

export async function handlePayment(request, env, path) {
  if (path === '/api/payment/create' && request.method === 'POST') {
    return await createPayment(request, env);
  }
  if (path === '/api/payment/notify' && request.method === 'POST') {
    return await paymentNotify(request, env);
  }
  if (path === '/api/payment/status' && request.method === 'GET') {
    return await checkPaymentStatus(request, env);
  }
  return errorResponse('Not found', 404);
}

async function createPayment(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) return errorResponse('Unauthorized', 401);

  if (!env.XUNHU_APPID || !env.XUNHU_APPSECRET) {
    console.error('Xunhu payment not configured');
    return errorResponse('支付暂未开通', 503);
  }

  const { testType, resultKey, returnUrl } = await request.json();
  if (!testType) return errorResponse('Missing testType');

  const paymentId = generateId();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `INSERT INTO payments (id, user_id, channel, amount, status, created_at, expired_at)
     VALUES (?, ?, ?, ?, 'pending', datetime('now'), datetime('now', '+30 minutes'))`
  ).bind(paymentId, session.userId, 'xunhupay', PREMIUM_PRICE).run();

  const params = {
    version: '1.1',
    appid: env.XUNHU_APPID,
    trade_order_id: paymentId,
    total_fee: (PREMIUM_PRICE / 100).toFixed(2),
    title: '趣味测试-AI深度解读',
    time: now.toString(),
    notify_url: 'https://quweiceshi.com/api/payment/notify',
    nonce_str: generateNonceStr(),
    attach: `${testType}:${resultKey || ''}`,
  };

  if (returnUrl) {
    const separator = returnUrl.includes('?') ? '&' : '?';
    params.return_url = `${returnUrl}${separator}payment_id=${paymentId}`;
  }

  params.hash = generateXunhuHash(params, env.XUNHU_APPSECRET);

  try {
    const response = await fetch(XUNHU_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    });

    const data = await response.json();

    if (data.errcode !== 0 && data.errcode !== undefined && data.errcode !== null) {
      console.error('Xunhu API error:', data.errcode, data.errmsg);
      await env.DB.prepare('UPDATE payments SET status = ? WHERE id = ?').bind('failed', paymentId).run();
      return errorResponse(data.errmsg || '支付创建失败', 500);
    }

    return jsonResponse({
      paymentId,
      channel: 'xunhupay',
      amount: PREMIUM_PRICE,
      amountYuan: (PREMIUM_PRICE / 100).toFixed(2),
      status: 'pending',
      qrCodeUrl: data.url_qrcode || '',
      payUrl: data.url || '',
    });
  } catch (err) {
    console.error('Xunhu payment fetch error:', err);
    return errorResponse('支付服务暂不可用', 503);
  }
}

async function paymentNotify(request, env) {
  let params;
  const contentType = request.headers.get('Content-Type') || '';

  try {
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      params = Object.fromEntries(formData);
    } else if (contentType.includes('application/json')) {
      params = await request.json();
    } else {
      const text = await request.text();
      params = Object.fromEntries(new URLSearchParams(text));
    }
  } catch (err) {
    console.error('Notify parse error:', err);
    return new Response('fail', { status: 400 });
  }

  if (!env.XUNHU_APPID || !env.XUNHU_APPSECRET) {
    console.error('Xunhu not configured for notify');
    return new Response('fail', { status: 500 });
  }

  const receivedHash = params.hash;
  const calculatedHash = generateXunhuHash(params, env.XUNHU_APPSECRET);

  if (receivedHash !== calculatedHash) {
    console.error('Notify hash mismatch:', { received: receivedHash, calculated: calculatedHash });
    return new Response('fail', { status: 400 });
  }

  if (params.status === 'OD') {
    const paymentId = params.trade_order_id;
    const transactionId = params.transaction_id || '';

    const existing = await env.DB.prepare('SELECT status FROM payments WHERE id = ?').bind(paymentId).first();
    if (existing && existing.status === 'pending') {
      await env.DB.prepare(
        `UPDATE payments SET status = 'paid', channel_trade_no = ?, raw_response_json = ?, paid_at = datetime('now')
         WHERE id = ? AND status = 'pending'`
      ).bind(transactionId, JSON.stringify(params), paymentId).run();
    }
  }

  return new Response('success');
}

async function checkPaymentStatus(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const paymentId = url.searchParams.get('paymentId');
  if (!paymentId) return errorResponse('Missing paymentId');

  const payment = await env.DB.prepare(
    'SELECT * FROM payments WHERE id = ? AND user_id = ?'
  ).bind(paymentId, session.userId).first();

  if (!payment) return errorResponse('Payment not found', 404);

  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
    amount: payment.amount,
    amountYuan: (payment.amount / 100).toFixed(2),
    channel: payment.channel,
    paidAt: payment.paid_at,
  });
}
