const AIGenerator = {
    // 基于输入生成确定性种子
    generateSeed(input) {
        let hash = 0;
        const str = JSON.stringify(input);
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return Math.abs(hash);
    },
    
    // 基于种子的伪随机数生成器（确定性）
    seededRandom(seed) {
        let s = seed || 1;
        return function() {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    },
    
    // 从数组中基于种子选择元素
    pickFromArray(arr, seed, offset = 0) {
        const rng = this.seededRandom(seed + offset);
        return arr[Math.floor(rng() * arr.length)];
    },
    
    // 从数组中基于种子选择多个不重复元素
    pickMultiple(arr, seed, count, offset = 0) {
        const rng = this.seededRandom(seed + offset);
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    },
    
    // ===== 八字运势生成 =====
    generateBaziAnalysis(baziData) {
        const seed = this.generateSeed(baziData);
        const rng = this.seededRandom(seed);
        
        const dayMaster = baziData.dayMaster;
        const wuxing = baziData.wuxing;
        const shishen = baziData.shishen;
        
        // 命局分析 - 基于日主五行和十神关系
        const mingjuTemplates = {
            '木': [
                `您日主属木，${wuxing.wood > 2 ? '木气旺盛' : '木气偏弱'}，${wuxing.water > 1 ? '得水之滋养' : '需水来涵养'}。${shishen.food ? '食伤泄秀' : '印星护身'}，性格中既有木之仁慈，又有${wuxing.fire > 1 ? '火之热情' : '土之稳重'}。`,
                `日主甲木${wuxing.wood > 2 ? '得令得地' : '失令失地'}，${wuxing.water >= 2 ? '印星有力，根基深厚' : '印星不足，需后天补益'}。为人正直有担当，${shishen.authority ? '官星护命，行事有度' : '行事随性，不拘小节'}。`
            ],
            '火': [
                `您日主属火，${wuxing.fire > 2 ? '火势炎炎' : '火光微弱'}，${wuxing.wood > 1 ? '得木之助燃' : '需木来生扶'}。${shishen.wealth ? '财星高照' : '印星护身'}，性格热情奔放，${wuxing.earth > 1 ? '厚德载物' : '锋芒毕露'}。`,
                `日主丙火${wuxing.fire > 2 ? '光芒万丈' : '灯火阑珊'}，${wuxing.wood >= 2 ? '印绶相生，才华横溢' : '印星不足，需贵人相助'}。为人热情大方，${shishen.authority ? '官印相生，前途光明' : '自由奔放，不喜拘束'}。`
            ],
            '土': [
                `您日主属土，${wuxing.earth > 2 ? '土厚载物' : '土薄根浅'}，${wuxing.fire > 1 ? '得火之生扶' : '需火来暖土'}。${shishen.food ? '食伤生财' : '比劫帮身'}，性格沉稳踏实，${wuxing.metal > 1 ? '金玉满堂' : '勤俭持家'}。`,
                `日主戊土${wuxing.earth > 2 ? '厚重如山' : '浮萍无根'}，${wuxing.fire >= 2 ? '印星得力，根基稳固' : '印星薄弱，需努力经营'}。为人诚实守信，${shishen.wealth ? '财源广进' : '积少成多'}。`
            ],
            '金': [
                `您日主属金，${wuxing.metal > 2 ? '金气刚锐' : '金质柔弱'}，${wuxing.earth > 1 ? '得土之生养' : '需土来培育'}。${shishen.authority ? '官星制劫' : '食伤泄秀'}，性格果断坚毅，${wuxing.water > 1 ? '智慧过人' : '刚直不阿'}。`,
                `日主庚金${wuxing.metal > 2 ? '锋芒毕露' : '柔金待炼'}，${wuxing.earth >= 2 ? '印星厚实，有靠山可依' : '印星不足，需自力更生'}。为人重义气，${shishen.wealth ? '财运亨通' : '守成为上'}。`
            ],
            '水': [
                `您日主属水，${wuxing.water > 2 ? '水势浩荡' : '水浅流缓'}，${wuxing.metal > 1 ? '得金之生助' : '需金来发源'}。${shishen.food ? '食伤流通' : '印星蓄源'}，性格聪慧灵活，${wuxing.wood > 1 ? '才华横溢' : '深沉内敛'}。`,
                `日主壬水${wuxing.water > 2 ? '汪洋恣肆' : '溪流涓涓'}，${wuxing.metal >= 2 ? '印星得力，智慧超群' : '印星不足，需勤学苦练'}。为人聪明机敏，${shishen.authority ? '仕途可期' : '商海遨游'}。`
            ]
        };
        
        const wuxingKey = Object.keys(mingjuTemplates).find(k => dayMaster.includes(k)) || '木';
        const mingju = this.pickFromArray(mingjuTemplates[wuxingKey], seed, 1);
        
        // 十神详解
        const shishenDetail = this.generateShishenDetail(shishen, seed);
        
        // 五行喜忌
        const wuxingXiyi = this.generateWuxingXiyi(wuxing, seed);
        
        // 流年运势
        const liunian = this.generateLiunian(baziData, seed);
        
        // 性格分析
        const xingge = this.generateXingge(dayMaster, wuxing, shishen, seed);
        
        // 职业建议
        const zhiye = this.generateZhiye(dayMaster, wuxing, seed);
        
        // 感情解读
        const ganqing = this.generateGanqing(dayMaster, wuxing, shishen, seed);
        
        // 健康指南
        const jiankang = this.generateJiankang(wuxing, seed);
        
        return {
            mingju,
            shishenDetail,
            wuxingXiyi,
            liunian,
            xingge,
            zhiye,
            ganqing,
            jiankang
        };
    },
    
    generateShishenDetail(shishen, seed) {
        const templates = {
            authority: [
                '官星透干，行事有规矩，适合体制内发展。正官代表正直守纪，偏官代表果断有魄力。',
                '官杀混杂，内心常有矛盾，既想遵规守纪又想突破常规。建议明确方向，择一而从。'
            ],
            food: [
                '食伤旺盛，才华横溢，适合创意类工作。食神代表温和表达，伤官代表锐利批判。',
                '食伤为用，思维活跃，善于创新。但需注意言辞，避免因口生事。'
            ],
            wealth: [
                '财星得位，理财有方，一生不缺衣食。正财代表稳定收入，偏财代表意外之财。',
                '财多身弱，虽有赚钱机会但难以把握。建议量力而行，稳扎稳打。'
            ],
            seal: [
                '印星护身，学业有成，贵人运佳。正印代表传统学识，偏印代表独特见解。',
                '印绶相生，根基深厚，适合学术研究或教育行业。但需避免过于依赖他人。'
            ]
        };
        
        let result = '';
        let offset = 10;
        Object.keys(shishen || {}).forEach(key => {
            if (shishen[key] && templates[key]) {
                result += this.pickFromArray(templates[key], seed, offset) + '\n';
                offset += 5;
            }
        });
        return result || '十神配置均衡，各方面发展较为平衡，无特别突出的偏颇。';
    },
    
    generateWuxingXiyi(wuxing, seed) {
        const entries = Object.entries(wuxing);
        const sorted = entries.sort((a, b) => a[1] - b[1]);
        const weakest = sorted[0];
        const strongest = sorted[sorted.length - 1];
        
        const wuxingNames = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
        const wuxingColors = { wood: '绿色', fire: '红色', earth: '黄色', metal: '白色', water: '黑色/蓝色' };
        const wuxingDirs = { wood: '东方', fire: '南方', earth: '中央', metal: '西方', water: '北方' };
        const wuxingSeasons = { wood: '春季', fire: '夏季', earth: '四季交替之时', metal: '秋季', water: '冬季' };
        
        const xiYong = wuxingNames[weakest[0]] || '木';
        const jiShen = wuxingNames[strongest[0]] || '金';
        
        return `喜用神为${xiYong}，忌神为${jiShen}。建议多接触${wuxingColors[weakest[0]]}物品，方位宜选${wuxingDirs[weakest[0]]}，${wuxingSeasons[weakest[0]]}运势较佳。日常生活中可多穿${wuxingColors[weakest[0]]}衣物，佩戴${xiYong}属性饰品，有助于增强运势。`;
    },
    
    generateLiunian(baziData, seed) {
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1, currentYear + 2];
        const descriptions = [
            ['事业有突破性进展，贵人相助，宜积极进取', '感情生活平稳，已婚者家庭和睦', '财运亨通，投资理财均有收获', '注意肠胃保养，饮食宜清淡'],
            ['稳扎稳打之年，不宜冒进', '桃花运旺，单身者有望脱单', '正财稳定，偏财需谨慎', '注意休息，避免过度劳累'],
            ['变动之年，有转机也有挑战', '感情需多沟通，避免误会', '财来财去，需做好储蓄', '注意心血管健康，适当运动']
        ];
        
        return years.map((year, i) => ({
            year,
            career: this.pickFromArray(descriptions[i], seed, 20 + i * 3),
            love: this.pickFromArray(descriptions[i], seed, 21 + i * 3),
            wealth: this.pickFromArray(descriptions[i], seed, 22 + i * 3),
            health: this.pickFromArray(descriptions[i], seed, 23 + i * 3)
        }));
    },
    
    generateXingge(dayMaster, wuxing, shishen, seed) {
        const traits = {
            '木': ['仁慈宽厚', '正直向上', '固执己见', '优柔寡断'],
            '火': ['热情开朗', '礼貌周到', '急躁冲动', '好大喜功'],
            '土': ['诚实守信', '稳重踏实', '保守固执', '反应迟缓'],
            '金': ['果断坚毅', '重义气', '刚愎自用', '好胜争强'],
            '水': ['聪明灵活', '善于变通', '优柔寡断', '缺乏定力']
        };
        const wuxingKey = Object.keys(traits).find(k => dayMaster.includes(k)) || '木';
        const selected = this.pickMultiple(traits[wuxingKey], seed, 3, 30);
        return `您的核心性格特质为：${selected.join('、')}。在人际交往中，您${wuxing.wood > 1 ? '善于倾听他人意见' : '更倾向于独立思考'}，面对困难时${wuxing.fire > 1 ? '勇于直面挑战' : '习惯深思熟虑后再行动'}。`;
    },
    
    generateZhiye(dayMaster, wuxing, seed) {
        const careers = {
            '木': ['教育行业', '医疗保健', '文化创意', '园林绿化', '出版传媒'],
            '火': ['电子科技', '餐饮服务', '演艺娱乐', '能源电力', '广告营销'],
            '土': ['房地产', '建筑工程', '农业种植', '矿产资源', '物业管理'],
            '金': ['金融投资', '法律司法', '机械制造', '珠宝鉴定', '军警安保'],
            '水': ['物流运输', '旅游酒店', '传媒新闻', '咨询顾问', '贸易进出口']
        };
        const wuxingKey = Object.keys(careers).find(k => dayMaster.includes(k)) || '木';
        const selected = this.pickMultiple(careers[wuxingKey], seed, 3, 40);
        return `根据您的命理特征，适合从事${selected.join('、')}等领域。这些行业与您的五行属性相合，更容易取得成就。`;
    },
    
    generateGanqing(dayMaster, wuxing, shishen, seed) {
        const templates = [
            `感情方面，您${wuxing.fire > 1 ? '热情主动，容易一见钟情' : '内敛含蓄，日久生情'}。${shishen && shishen.wealth ? '财星为用，异性缘佳' : '感情需主动争取'}。建议在${wuxing.water > 1 ? '北方或水边' : '社交场合'}寻找良缘。`,
            `您的感情运势${shishen && shishen.authority ? '较为稳定，官星护身' : '起伏较大，需用心经营'}。${wuxing.metal > 1 ? '择偶标准较高' : '注重内在品质'}。婚后${wuxing.earth > 1 ? '家庭和睦' : '需多沟通协调'}。`,
            `在感情中，您属于${wuxing.wood > 1 ? '付出型' : '独立型'}伴侣。${shishen && shishen.food ? '善于表达爱意' : '更倾向于用行动证明'}。与${wuxing.fire > 1 ? '水属性' : '木属性'}的伴侣最为相配。`
        ];
        return this.pickFromArray(templates, seed, 50);
    },
    
    generateJiankang(wuxing, seed) {
        const healthMap = {
            wood: '肝胆系统，注意疏肝理气，少熬夜',
            fire: '心脏血管，注意控制情绪，避免过劳',
            earth: '脾胃消化，注意饮食规律，忌暴饮暴食',
            metal: '肺部呼吸，注意空气质量，多做有氧运动',
            water: '肾脏泌尿，注意保暖，多饮水'
        };
        const weakest = Object.entries(wuxing).sort((a, b) => a[1] - b[1])[0];
        const secondWeakest = Object.entries(wuxing).sort((a, b) => a[1] - b[1])[1];
        return `健康方面需重点关注${healthMap[weakest[0]] || '肝胆系统'}，其次注意${healthMap[secondWeakest[0]] || '脾胃消化'}。建议保持规律作息，适度运动，定期体检。`;
    },
    
    // ===== 姓名测试生成 =====
    generateNameAnalysis(nameData) {
        const seed = this.generateSeed(nameData);
        const { name, strokes, wuxing, score } = nameData;
        
        const wuxingAnalysis = this.generateNameWuxingAnalysis(wuxing, seed);
        const strokeAnalysis = this.generateStrokeAnalysis(strokes, seed);
        const personality = this.generateNamePersonality(wuxing, score, seed);
        const career = this.generateNameCareer(wuxing, score, seed);
        const love = this.generateNameLove(wuxing, score, seed);
        
        return { wuxingAnalysis, strokeAnalysis, personality, career, love };
    },
    
    generateNameWuxingAnalysis(wuxing, seed) {
        const balance = Object.values(wuxing).filter(v => v > 0).length;
        const missing = Object.entries(wuxing).filter(([k, v]) => v === 0).map(([k]) => k);
        const wuxingNames = { gold: '金', wood: '木', water: '水', fire: '火', earth: '土' };
        
        if (balance >= 4) {
            return `您的姓名五行分布较为均衡，包含${balance}种五行元素，命格基础扎实。${missing.length > 0 ? `仅缺${missing.map(m => wuxingNames[m]).join('、')}，影响不大。` : '五行俱全，实属难得。'}这种配置有利于各方面均衡发展。`;
        } else if (balance >= 3) {
            return `您的姓名五行包含${balance}种元素，${missing.length > 0 ? `缺少${missing.map(m => wuxingNames[m]).join('、')}` : '分布尚可'}。建议通过日常穿搭或佩饰补充缺失的五行元素，以达到更好的平衡。`;
        } else {
            return `您的姓名五行较为偏颇，仅有${balance}种元素，缺少${missing.map(m => wuxingNames[m]).join('、')}。五行失衡可能影响运势的稳定性，建议通过改名或后天调理来改善。`;
        }
    },
    
    generateStrokeAnalysis(strokes, seed) {
        const total = strokes.reduce((a, b) => a + b, 0);
        if (total > 30) {
            return `姓名总笔画数为${total}画，笔画较多，暗示人生道路较为丰富，经历多样。虽起步可能稍显艰辛，但厚积薄发，中年后运势渐佳。`;
        } else if (total > 20) {
            return `姓名总笔画数为${total}画，笔画适中，暗示人生较为平稳顺遂。天资聪颖，若能勤勉努力，必有所成。`;
        } else {
            return `姓名总笔画数为${total}画，笔画简洁，暗示性格直爽干练。行事果断，不拖泥带水，但需注意细节，避免粗心大意。`;
        }
    },
    
    generateNamePersonality(wuxing, score, seed) {
        const dominant = Object.entries(wuxing).sort((a, b) => b[1] - a[1])[0];
        const traits = {
            gold: '坚毅果断，重信守诺，有领导才能',
            wood: '仁慈善良，积极向上，富有创造力',
            water: '聪慧灵活，善于变通，适应力强',
            fire: '热情开朗，积极进取，感染力强',
            earth: '稳重踏实，诚实守信，包容力强'
        };
        return `姓名主导五行为${dominant[0] === 'gold' ? '金' : dominant[0] === 'wood' ? '木' : dominant[0] === 'water' ? '水' : dominant[0] === 'fire' ? '火' : '土'}，性格特质为：${traits[dominant[0]] || '综合型性格'}。${score >= 80 ? '姓名格局上佳，有助于发挥个人潜能。' : score >= 60 ? '姓名格局中规中矩，需后天努力弥补。' : '姓名格局有提升空间，建议通过后天努力改善运势。'}`;
    },
    
    generateNameCareer(wuxing, score, seed) {
        const dominant = Object.entries(wuxing).sort((a, b) => b[1] - a[1])[0];
        const careers = {
            gold: '金融、法律、技术、管理',
            wood: '教育、医疗、文化、创意',
            water: '贸易、物流、咨询、传媒',
            fire: '科技、餐饮、娱乐、营销',
            earth: '地产、建筑、农业、服务'
        };
        return `事业方面，适合从事${careers[dominant[0]] || '综合类'}等行业。${score >= 75 ? '姓名助力事业运，容易获得上司赏识和同事支持。' : '事业需靠个人努力打拼，建议选择与五行相合的行业。'}`;
    },
    
    generateNameLove(wuxing, score, seed) {
        return `感情方面，${score >= 75 ? '姓名桃花运佳，异性缘好，容易遇到心仪对象。婚后家庭和睦，夫妻恩爱。' : score >= 55 ? '感情运势平稳，需主动出击才能遇到良缘。建议多参加社交活动，扩大交友圈。' : '感情方面需多花心思经营，不可操之过急。缘分到了自然水到渠成。'}`;
    },
    
    // ===== 解梦分析生成 =====
    generateDreamAnalysis(dreamData) {
        const seed = this.generateSeed(dreamData);
        const { type, clarity, keywords } = dreamData;
        
        const symbolMeanings = {
            fly: { symbol: '飞翔', meaning: '渴望自由和超越', psychology: '反映内心对现状的不满和突破渴望' },
            fall: { symbol: '坠落', meaning: '失控感和不安全感', psychology: '反映现实中的焦虑和压力' },
            chase: { symbol: '被追', meaning: '逃避和压力', psychology: '反映现实中有未面对的问题' },
            exam: { symbol: '考试', meaning: '自我评价和焦虑', psychology: '反映对自我能力的怀疑' },
            late: { symbol: '迟到', meaning: '时间压力和责任感', psychology: '反映对错过机会的恐惧' },
            water: { symbol: '水', meaning: '情感和潜意识', psychology: '反映内心深处的情感波动' },
            snake: { symbol: '蛇', meaning: '潜意识的恐惧或欲望', psychology: '反映被压抑的本能冲动' },
            wedding: { symbol: '婚礼', meaning: '新的开始和承诺', psychology: '反映对亲密关系的渴望或恐惧' },
            lost: { symbol: '迷路', meaning: '方向感和人生迷茫', psychology: '反映对未来的不确定感' },
            fire: { symbol: '火', meaning: '激情和转变', psychology: '反映内心的强烈情绪' },
            money: { symbol: '金钱', meaning: '价值和安全感', psychology: '反映对物质生活的态度' },
            death: { symbol: '死亡', meaning: '结束和重生', psychology: '反映对变化的恐惧和期待' }
        };
        
        const info = symbolMeanings[type] || symbolMeanings.fly;
        
        const deepAnalysis = [
            `这个梦境的核心象征是"${info.symbol}"，代表着${info.meaning}。从心理学角度分析，${info.psychology}。${clarity === 'very-clear' ? '梦境非常清晰，说明这个议题在您当前生活中占据重要位置。' : clarity === 'clear' ? '梦境较为清晰，建议关注相关的生活领域。' : '梦境较为模糊，可能暗示您潜意识中尚未明确意识到的问题。'}`,
            `"${info.symbol}"在梦境中出现，暗示着${info.meaning}。深层心理分析表明，${info.psychology}。${clarity === 'very-clear' ? '清晰的梦境往往与近期的重大事件有关，建议回顾最近的生活变化。' : '模糊的梦境可能反映了您对某些问题的回避态度。'}`,
            `从荣格心理学的角度看，"${info.symbol}"是您潜意识中的重要意象，象征着${info.meaning}。${info.psychology}。建议您${clarity === 'very-clear' ? '认真对待这个梦境传递的信息' : '尝试回忆更多梦境细节'}，这可能帮助您更好地理解自己的内心需求。`
        ];
        
        const advices = [
            '建议您在日常生活中多关注自己的内心感受，适当放松压力，保持积极乐观的心态。',
            '可以尝试写梦境日记，记录每次梦境的细节和感受，有助于更好地理解潜意识的信息。',
            '建议通过冥想或放松练习来缓解内心压力，同时注意保持规律的作息时间。'
        ];
        
        return {
            symbol: info.symbol,
            meaning: info.meaning,
            psychology: info.psychology,
            deepAnalysis: this.pickFromArray(deepAnalysis, seed, 1),
            advice: this.pickFromArray(advices, seed, 2)
        };
    },
    
    // ===== 心理测试分析生成 =====
    generatePsychologyAnalysis(testData) {
        const seed = this.generateSeed(testData);
        const { type, scores, answers } = testData;
        
        if (type === 'stress') {
            return this.generateStressAnalysis(scores, seed);
        } else if (type === 'emotion') {
            return this.generateEmotionAnalysis(scores, seed);
        } else {
            return this.generatePersonalityAnalysis(scores, seed);
        }
    },
    
    generateStressAnalysis(scores, seed) {
        const { stressScore, emotionScore, resilienceScore } = scores;
        const level = stressScore > 70 ? '较高' : stressScore > 40 ? '中等' : '较低';
        
        const analysis = [
            `您的压力指数为${stressScore}分，处于${level}水平。${stressScore > 70 ? '当前压力较大，需要积极采取减压措施。' : stressScore > 40 ? '压力适中，在可控范围内。' : '压力管理良好，继续保持。'}情绪健康指数${emotionScore}分，${emotionScore > 70 ? '情绪状态良好' : emotionScore > 40 ? '情绪有波动但基本正常' : '需要关注情绪健康'}。心理韧性${resilienceScore}分，${resilienceScore > 70 ? '抗压能力强' : '需要增强心理韧性'}。`,
            `综合评估，您的压力水平为${level}。${stressScore > 60 ? '建议适当放慢生活节奏，给自己更多休息时间。' : '当前压力在可承受范围内，但也要注意及时调节。'}情绪方面${emotionScore > 60 ? '较为稳定' : '波动较大'}，心理韧性${resilienceScore > 60 ? '较强' : '有待提升'}。`
        ];
        
        const suggestions = stressScore > 60 ? [
            '建议每天安排30分钟以上的放松时间，如散步、听音乐、冥想等',
            '学会说"不"，合理分配时间和精力，避免过度承担',
            '保持规律运动，每周至少3次中等强度运动有助于缓解压力',
            '如果压力持续影响生活，建议寻求专业心理咨询帮助'
        ] : [
            '继续保持良好的压力管理习惯',
            '定期进行自我评估，关注心理健康变化',
            '培养兴趣爱好，丰富精神生活',
            '保持社交联系，与亲友分享感受'
        ];
        
        return {
            analysis: this.pickFromArray(analysis, seed, 1),
            suggestions: this.pickMultiple(suggestions, seed, 3, 5)
        };
    },
    
    generateEmotionAnalysis(scores, seed) {
        const { emotionScore, stressScore, resilienceScore } = scores;
        const level = emotionScore > 70 ? '良好' : emotionScore > 40 ? '一般' : '需关注';
        
        const analysis = [
            `您的情绪健康指数为${emotionScore}分，整体状态${level}。${emotionScore > 70 ? '您有良好的情绪调节能力，能够积极面对生活中的挑战。' : emotionScore > 40 ? '情绪有一定波动，建议学习更多情绪管理技巧。' : '当前情绪状态需要重视，建议寻求专业帮助。'}压力指数${stressScore}分，${stressScore > 60 ? '压力较大可能影响情绪' : '压力在正常范围内'}。`,
            `情绪评估结果显示，您的情绪稳定性为${level}水平。${emotionScore > 60 ? '您能够较好地识别和表达自己的情绪' : '建议加强情绪觉察能力的培养'}。心理韧性${resilienceScore}分，${resilienceScore > 60 ? '恢复力较强' : '需要增强情绪恢复能力'}。`
        ];
        
        return {
            analysis: this.pickFromArray(analysis, seed, 1),
            suggestions: this.pickMultiple([
                '练习正念冥想，每天10分钟有助于提升情绪觉察力',
                '建立情绪日记习惯，记录每日情绪变化和触发因素',
                '学会识别和命名情绪，这是情绪管理的第一步',
                '保持充足睡眠，睡眠不足会显著影响情绪稳定性',
                '适当运动可以促进内啡肽分泌，改善情绪状态'
            ], seed, 3, 10)
        };
    },
    
    generatePersonalityAnalysis(scores, seed) {
        const { introExtro, rationalEmotional, plannedSpontaneous, expressiveReserved } = scores;
        const type = (introExtro > 50 ? '外向' : '内向') + (rationalEmotional > 50 ? '理性' : '感性') + (plannedSpontaneous > 50 ? '计划型' : '随性型');
        
        const descriptions = {
            '外向理性计划型': '您是一个善于社交且有条理的人，在团队中往往是组织者的角色。决策时注重逻辑，执行力强。',
            '外向理性随性型': '您是一个活跃且灵活的人，善于即兴发挥。社交能力强，思维敏捷，但有时缺乏耐心。',
            '外向感性计划型': '您是一个温暖且有规划的人，善于照顾他人感受。在人际关系中很受欢迎，做事有条不紊。',
            '外向感性随性型': '您是一个热情且自由的人，感染力强，善于营造氛围。重视体验和感受，活在当下。',
            '内向理性计划型': '您是一个深思熟虑的人，做事严谨有序。独立思考能力强，适合需要专注和精确的工作。',
            '内向理性随性型': '您是一个安静但思维活跃的人，内心世界丰富。善于观察和分析，有独特的见解。',
            '内向感性计划型': '您是一个细腻且有规划的人，对他人情绪敏感。做事认真负责，注重细节和品质。',
            '内向感性随性型': '您是一个温柔且随性的人，内心丰富但不轻易表露。重视内心感受，追求精神层面的满足。'
        };
        
        const desc = descriptions[type] || descriptions['内向理性计划型'];
        
        return {
            type,
            analysis: desc,
            suggestions: this.pickMultiple([
                '发挥您的性格优势，选择与之匹配的职业和社交方式',
                '尝试走出舒适区，培养性格中较弱的方面',
                '了解不同性格类型的特点，提升人际沟通效果',
                '接受自己的性格特质，每种性格都有独特的价值',
                '在压力情境下，回归自己最自然的应对方式'
            ], seed, 3, 15)
        };
    },
    
    // ===== 爱情匹配分析生成 =====
    generateLoveAnalysis(loveData) {
        const seed = this.generateSeed(loveData);
        const { nameA, nameB, score, starA, starB } = loveData;
        
        const levelDesc = score >= 80 ? '天作之合' : score >= 60 ? '缘分不错' : score >= 40 ? '需要磨合' : '缘分较浅';
        
        const analysis = [
            `${nameA}与${nameB}的缘分指数为${score}分，属于${levelDesc}。${score >= 70 ? '两人之间有较强的吸引力和默契，相处起来较为融洽。' : score >= 50 ? '两人有一定的缘分基础，但需要双方共同努力经营。' : '两人的性格和价值观存在较大差异，需要更多理解和包容。'}${starA && starB ? `${starA}座与${starB}座的组合，` : ''}${score >= 60 ? '在沟通和相处中容易找到共同话题。' : '建议多花时间了解对方的想法和需求。'}`,
            `综合分析，${nameA}和${nameB}的匹配度为${score}%，${levelDesc}。${score >= 70 ? '这段关系有着良好的发展潜力，双方都愿意为对方付出。' : score >= 50 ? '关系发展需要耐心和时间，不要急于求成。' : '这段关系面临较大挑战，但并非没有转机。'}关键在于双方是否愿意为这段关系投入时间和精力。`
        ];
        
        const suggestions = score >= 70 ? [
            '珍惜彼此的缘分，多创造共同回忆',
            '保持良好的沟通习惯，有问题及时交流',
            '尊重彼此的个人空间，保持适度的独立性',
            '一起规划未来，建立共同的目标和愿景'
        ] : score >= 50 ? [
            '多花时间了解对方的兴趣爱好和价值观',
            '学会换位思考，理解对方的立场和感受',
            '寻找共同话题和活动，增进感情',
            '给彼此时间和空间，不要过于急切'
        ] : [
            '认真思考这段关系对您的意义',
            '尝试发现对方身上的闪光点',
            '如果决定继续，需要做好长期磨合的准备',
            '保持开放的心态，不要给自己太大压力'
        ];
        
        return {
            analysis: this.pickFromArray(analysis, seed, 1),
            suggestions: this.pickMultiple(suggestions, seed, 3, 20),
            levelDesc
        };
    },
    
    // ===== 星座运势生成 =====
    generateConstellationFortune(zodiacId, date) {
        const seed = this.generateSeed({ zodiacId, date });
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        
        const baseScores = {
            love: 50 + ((seed + dayOfYear * 7) % 45),
            career: 50 + ((seed + dayOfYear * 13) % 45),
            wealth: 50 + ((seed + dayOfYear * 17) % 45),
            health: 50 + ((seed + dayOfYear * 23) % 45)
        };
        
        const loveDescs = [
            '今日感情运势上升，单身者有望遇到心仪对象',
            '感情方面需要多沟通，避免因小事产生误会',
            '桃花运旺盛，社交场合中容易吸引异性目光',
            '与伴侣之间默契度提升，适合一起做决定'
        ];
        const careerDescs = [
            '工作状态良好，效率高，适合处理重要事务',
            '职场上可能遇到挑战，保持冷静应对即可',
            '贵人运佳，可能得到上司或同事的帮助',
            '创意灵感涌现，适合头脑风暴和方案策划'
        ];
        const wealthDescs = [
            '财运平稳，适合稳健理财',
            '可能有意外收入，但不宜大额投资',
            '理财需谨慎，避免冲动消费',
            '偏财运佳，可适当尝试小额投资'
        ];
        
        return {
            scores: baseScores,
            love: this.pickFromArray(loveDescs, seed, dayOfYear),
            career: this.pickFromArray(careerDescs, seed, dayOfYear + 5),
            wealth: this.pickFromArray(wealthDescs, seed, dayOfYear + 10)
        };
    },
    
    // ===== 生肖运势生成 =====
    generateZodiacFortune(zodiacId, year) {
        const seed = this.generateSeed({ zodiacId, year });
        
        const overallDescs = [
            '整体运势稳中有升，把握机遇可获突破',
            '运势起伏较大，需保持平常心应对',
            '贵人运旺，事业和财运均有提升',
            '稳扎稳打之年，积累为主不宜冒进'
        ];
        const careerDescs = [
            '事业运势上扬，有望获得晋升或加薪机会',
            '工作中可能遇到阻碍，需耐心应对',
            '适合学习新技能，为未来发展打基础',
            '团队合作运佳，多与同事协作可事半功倍'
        ];
        const loveDescs = [
            '感情运势甜蜜，单身者有望脱单',
            '桃花运旺，但需擦亮眼睛辨别真心',
            '已婚者家庭和睦，感情更加深厚',
            '感情需用心经营，多花时间陪伴对方'
        ];
        
        return {
            overall: this.pickFromArray(overallDescs, seed, 1),
            career: this.pickFromArray(careerDescs, seed, 5),
            love: this.pickFromArray(loveDescs, seed, 10),
            wealth: this.pickFromArray(['财运亨通，投资理财均有收获', '正财稳定，偏财需谨慎', '理财需保守，避免冒险投资', '财源广进，适合开拓新渠道'], seed, 15),
            health: this.pickFromArray(['注意劳逸结合，保持规律作息', '健康运势良好，继续保持良好习惯', '需注意饮食健康，避免暴饮暴食', '适当增加运动量，增强体质'], seed, 20)
        };
    },
    
    // ===== 塔罗占卜解读生成 =====
    generateTarotReading(tarotData) {
        const seed = this.generateSeed(tarotData);
        const { cards, spread, question } = tarotData;
        
        const focusKeywords = {
            love: ['感情', '缘分', '心灵契合'],
            career: ['事业', '发展', '机遇'],
            health: ['健康', '身心平衡', '能量'],
            general: ['人生方向', '内在力量', '选择']
        };
        
        let focus = 'general';
        if (question) {
            if (/爱|情|恋|婚|缘|感/.test(question)) focus = 'love';
            else if (/工|作|事|业|职|钱|财/.test(question)) focus = 'career';
            else if (/健|康|身|体|病/.test(question)) focus = 'health';
        }
        
        const keywords = focusKeywords[focus];
        const positiveCards = cards.filter(c => !c.reversed).length;
        const overallTone = positiveCards >= cards.length / 2 ? '积极' : '挑战性';
        
        const summaries = {
            positive: [
                `从牌面来看，您在${keywords[0]}方面有着${overallTone}的发展趋势。${cards.length > 1 ? '多张正面牌的出现，暗示着良好的发展势头。' : ''}建议您保持信心，积极行动。`,
                `塔罗牌为您揭示了${keywords[0]}方面的指引。整体能量偏向${overallTone}，${positiveCards > 0 ? '正面牌带来的积极能量将帮助您克服困难。' : '虽然面临挑战，但这也是成长的机会。'}`
            ],
            challenging: [
                `当前牌面显示您在${keywords[0]}方面面临一些挑战。但这并非坏事，困难往往是成长的催化剂。建议您${focus === 'love' ? '在感情中保持真诚和耐心' : focus === 'career' ? '在事业上稳扎稳打' : '关注自身的内在成长'}。`,
                `牌面提示您在${keywords[0]}领域需要更多关注。${overallTone}的能量意味着现在是反思和调整的好时机。${focus === 'love' ? '感情需要用心经营' : focus === 'career' ? '事业需要明确方向' : '关注身心平衡'}是当前的关键。`
            ]
        };
        
        const summaryPool = overallTone === '积极' ? summaries.positive : summaries.challenging;
        
        return {
            summary: this.pickFromArray(summaryPool, seed, 1),
            focus,
            focusKeywords: keywords,
            advice: this.pickFromArray([
                '信任自己的直觉，它往往比理性分析更准确',
                '保持开放的心态，接受生活中的各种可能性',
                '在做出重要决定前，给自己足够的思考时间',
                '关注当下的感受，不要过度担忧未来'
            ], seed, 30)
        };
    }
};

window.AIGenerator = AIGenerator;
