import { jsonResponse, errorResponse, authenticateRequest, generateId, corsHeaders } from '../utils/cors.js';

const PREMIUM_PRICE = 490;

export async function handlePayment(request, env, path) {
  if (path === '/api/payment/create' && request.method === 'POST') {
    return await createPayment(request, env);
  }

  if (path === '/api/payment/wechat-notify' && request.method === 'POST') {
    return await wechatNotify(request, env);
  }

  if (path === '/api/payment/alipay-notify' && request.method === 'POST') {
    return await alipayNotify(request, env);
  }

  if (path === '/api/payment/status' && request.method === 'GET') {
    return await checkPaymentStatus(request, env);
  }

  return errorResponse('Not found', 404);
}

async function createPayment(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { channel, testType, resultKey } = await request.json();
  if (!channel || !testType) {
    return errorResponse('Missing required fields');
  }

  const paymentId = generateId();

  await env.DB.prepare(
    'INSERT INTO payments (id, user_id, channel, amount, status, created_at, expired_at) VALUES (?, ?, ?, ?, \'pending\', datetime(\'now\'), datetime(\'now\', \'+30 minutes\'))'
  ).bind(paymentId, session.userId, channel, PREMIUM_PRICE).run();

  if (channel === 'wechat') {
    return await createWechatPayment(env, paymentId, PREMIUM_PRICE);
  } else if (channel === 'alipay') {
    return await createAlipayPayment(env, paymentId, PREMIUM_PRICE);
  }

  return errorResponse('Unsupported payment channel');
}

async function createWechatPayment(env, paymentId, amount) {
  const body = {
    appid: env.WECHAT_APPID,
    mch_id: env.WECHAT_MCH_ID,
    nonce_str: generateId().replace(/-/g, ''),
    body: '趣味测试 - AI深度解读报告',
    out_trade_no: paymentId,
    total_fee: amount,
    spbill_create_ip: '127.0.0.1',
    notify_url: `https://quweiceshi.com/api/payment/wechat-notify`,
    trade_type: 'NATIVE',
  };

  return jsonResponse({
    paymentId,
    channel: 'wechat',
    amount: PREMIUM_PRICE,
    amountYuan: (PREMIUM_PRICE / 100).toFixed(2),
    status: 'pending',
    message: '请使用微信扫码支付',
  });
}

async function createAlipayPayment(env, paymentId, amount) {
  return jsonResponse({
    paymentId,
    channel: 'alipay',
    amount: PREMIUM_PRICE,
    amountYuan: (PREMIUM_PRICE / 100).toFixed(2),
    status: 'pending',
    message: '请使用支付宝扫码支付',
  });
}

async function wechatNotify(request, env) {
  const body = await request.text();

  const result_code = 'SUCCESS';
  const out_trade_no = 'test';

  if (result_code === 'SUCCESS') {
    await env.DB.prepare(
      'UPDATE payments SET status = \'paid\', channel_trade_no = ?, paid_at = datetime(\'now\') WHERE id = ?'
    ).bind(out_trade_no, out_trade_no).run();
  }

  return new Response('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>', {
    headers: { 'Content-Type': 'application/xml' },
  });
}

async function alipayNotify(request, env) {
  const formData = await request.formData();
  const trade_status = formData.get('trade_status');
  const out_trade_no = formData.get('out_trade_no');
  const trade_no = formData.get('trade_no');

  if (trade_status === 'TRADE_SUCCESS') {
    await env.DB.prepare(
      'UPDATE payments SET status = \'paid\', channel_trade_no = ?, paid_at = datetime(\'now\') WHERE id = ?'
    ).bind(trade_no, out_trade_no).run();
  }

  return new Response('success');
}

async function checkPaymentStatus(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const paymentId = url.searchParams.get('paymentId');
  if (!paymentId) {
    return errorResponse('Missing paymentId');
  }

  const payment = await env.DB.prepare('SELECT * FROM payments WHERE id = ? AND user_id = ?').bind(paymentId, session.userId).first();

  if (!payment) {
    return errorResponse('Payment not found', 404);
  }

  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
    amount: payment.amount,
    amountYuan: (payment.amount / 100).toFixed(2),
    channel: payment.channel,
    paidAt: payment.paid_at,
  });
}
