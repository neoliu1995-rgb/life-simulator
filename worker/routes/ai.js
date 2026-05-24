import { jsonResponse, errorResponse, authenticateRequest, corsHeaders } from '../utils/cors.js';

const SYSTEM_PROMPTS = {
  mbti: `你是一位拥有20年经验的心理学专家和职业规划师，擅长MBTI性格分析。
用户刚完成MBTI测试，你需要根据他们的具体答题情况，生成极具个性化的解读。

要求：
1. 不要使用笼统的MBTI描述，必须结合用户的具体选择进行分析
2. 使用温暖但专业的语气，像朋友一样交流
3. 给出可操作的建议，而非空泛的理论
4. 中文输出，适当使用emoji增强可读性
5. 结构清晰，使用标题和列表
6. 必须在分析中引用用户的具体答题情况`,

  bazi: `你是一位精通八字命理的专家，拥有深厚的传统文化功底。
用户刚完成八字排盘，你需要根据他们的生辰八字信息，生成个性化的命理分析。

要求：
1. 结合五行生克、十神关系等专业理论
2. 语言通俗易懂，避免过于晦涩的术语
3. 给出积极正面的建议，避免恐吓性预测
4. 适当引用古籍经典增加权威性
5. 强调"命由天定，运由己造"的积极观念`,

  zodiac: `你是一位星座运势专家，擅长将西方占星术与现代心理学结合。
用户刚完成星座测试，你需要生成个性化的星座分析。

要求：
1. 结合太阳、月亮、上升星座综合分析
2. 给出近期运势预测（积极正面为主）
3. 提供实用的开运建议
4. 语言轻松有趣，适合社交媒体传播`,

  constellation: `你是一位星座运势专家，擅长将西方占星术与现代心理学结合。
用户刚查看星座详情，你需要生成个性化的星座分析报告。

要求：
1. 深入分析该星座的性格特征
2. 结合当前星象给出运势建议
3. 提供爱情、事业、财运三方面分析
4. 语言温暖有力量，给用户信心`,

  dream: `你是一位梦境解析专家，融合荣格心理学和传统文化。
用户刚提交了梦境描述，你需要进行专业的梦境分析。

要求：
1. 从潜意识和象征意义两个层面解读
2. 结合用户的生活状态给出建议
3. 避免过于玄学的解释，保持科学性
4. 给出积极的心理暗示`,

  default: `你是一位专业的心理测试分析师，擅长各类性格和运势测试的解读。
请根据用户的测试结果，生成个性化的分析报告。

要求：
1. 结合用户的具体数据进行分析
2. 语言温暖专业
3. 给出可操作的建议
4. 适当使用emoji增强可读性`,
};

function buildPrompt(testType, answers, level) {
  const systemPrompt = SYSTEM_PROMPTS[testType] || SYSTEM_PROMPTS.default;

  let userPrompt = '';
  if (typeof answers === 'string') {
    userPrompt = answers;
  } else if (Array.isArray(answers)) {
    userPrompt = answers.map((a, i) => `问题${i + 1}: ${a.question || ''}\n用户选择: ${a.answer || a.option || ''}`).join('\n\n');
  } else {
    userPrompt = JSON.stringify(answers);
  }

  if (level === 'basic') {
    return {
      system: systemPrompt,
      user: `${userPrompt}\n\n请生成简短的性格摘要（150-200字），包含：\n1. 核心性格特征（2-3个关键词）\n2. 最突出的优势\n3. 一句话建议\n\n注意：保持简洁有力，让用户想看更多。`,
    };
  }

  return {
    system: systemPrompt,
    user: `${userPrompt}\n\n请生成完整的深度解读报告，包含以下部分：\n\n## 🧠 性格画像\n（200字，结合具体答题情况的核心性格描述）\n\n## 💪 核心优势\n（3条，每条30字以内，从答题模式中提炼）\n\n## ⚠️ 成长空间\n（2条，温和地指出可以提升的地方）\n\n## 💼 职业推荐\n（5个，按匹配度排序，简述理由）\n\n## ❤️ 人际关系\n（恋爱+友情各1条建议）\n\n## 🎯 行动指南\n（3条，本月可以开始做的具体行动）\n\n## ✨ 你的独特之处\n（1段话，基于答题中的特殊组合，给出独特洞察）`,
  };
}

export async function handleAI(request, env, path) {
  if (path === '/api/ai/interpret' && request.method === 'POST') {
    return await interpretBasic(request, env);
  }

  if (path === '/api/ai/interpret-premium' && request.method === 'POST') {
    return await interpretPremium(request, env);
  }

  return errorResponse('Not found', 404);
}

async function interpretBasic(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { testType, answers, resultKey } = await request.json();
  if (!testType) {
    return errorResponse('Missing testType');
  }

  const { system, user } = buildPrompt(testType, answers, 'basic');

  try {
    const aiResponse = await callOpenAI(env, system, user, 500);
    const content = aiResponse.choices[0].message.content;

    return jsonResponse({
      level: 'basic',
      content,
      testType,
      resultKey: resultKey || '',
    });
  } catch (err) {
    console.error('AI basic interpret error:', err);
    return errorResponse('AI service temporarily unavailable', 503);
  }
}

async function interpretPremium(request, env) {
  const session = await authenticateRequest(request, env);
  if (!session) {
    return errorResponse('Unauthorized', 401);
  }

  const { testType, answers, resultKey, paymentId } = await request.json();
  if (!testType) {
    return errorResponse('Missing testType');
  }

  if (paymentId) {
    const payment = await env.DB.prepare('SELECT * FROM payments WHERE id = ? AND status = ?').bind(paymentId, 'paid').first();
    if (!payment) {
      return errorResponse('Payment not verified', 402);
    }
  }

  const { system, user } = buildPrompt(testType, answers, 'premium');

  try {
    const aiResponse = await callOpenAI(env, system, user, 3000);
    const content = aiResponse.choices[0].message.content;
    const tokensUsed = aiResponse.usage?.total_tokens || 0;

    let testResultId = null;
    const existingResult = await env.DB.prepare(
      'SELECT id FROM test_results WHERE user_id = ? AND test_type = ? AND result_key = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(session.userId, testType, resultKey || '').first();

    if (existingResult) {
      testResultId = existingResult.id;
      await env.DB.prepare('UPDATE test_results SET is_premium = 1 WHERE id = ?').bind(testResultId).run();
    }

    await env.DB.prepare(
      'INSERT INTO ai_reports (user_id, test_result_id, report_level, content_json, model_used, tokens_used, payment_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))'
    ).bind(session.userId, testResultId, 'premium', content, 'gpt-4o-mini', tokensUsed, paymentId || null).run();

    return jsonResponse({
      level: 'premium',
      content,
      testType,
      resultKey: resultKey || '',
    });
  } catch (err) {
    console.error('AI premium interpret error:', err);
    return errorResponse('AI service temporarily unavailable', 503);
  }
}

async function callOpenAI(env, systemPrompt, userPrompt, maxTokens) {
  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  return response.json();
}
