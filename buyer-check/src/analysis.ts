import type { Device } from './catalog';
export type { Device } from './catalog';
export type Source = '商品描述' | '卖家回复' | '买家记录';
export type Key = 'model' | 'chip' | 'gpu' | 'memory' | 'storage' | 'battery' | 'cycles' | 'repair' | 'fault' | 'lock' | 'warranty' | 'accessories';
export type Fact = { key: Key; value: string; source: Source; raw: string; provisional?: boolean };
export type Input = { device: Device; listing: string; reply: string; observed: string; selectedModel?: string };

export const labels: Record<Key, string> = {
  model: '型号', chip: '芯片 / CPU', gpu: '显卡 / GPU', memory: '运行内存', storage: '存储容量', battery: '电池健康度', cycles: '电池循环次数', repair: '维修情况', fault: '功能异常', lock: '账号锁定', warranty: '保修情况', accessories: '包含配件'
};

type Rule = { key: Key; pattern: RegExp; value?: (m: RegExpMatchArray) => string };
type RiskRule = { devices?: Device[]; pattern: RegExp; priority: boolean; advice: string; copyForSeller?: boolean; kind?: 'batteryHazard' | 'screen' };
// Conservative patterns only: information not stated remains unknown.
const rules: Rule[] = [
  { key: 'model', pattern: /\b(Mac\s*mini\s*M[1-9](?:\s*(?:Pro|Max|Ultra))?|MacBook\s*(?:Air|Pro)(?:\s*\d{2}(?:\.\d)?\s*(?:英寸|寸|inch))?|iPhone\s*\d{1,2}(?:\s*(?:Pro\s*Max|Pro|Plus|Mini))?)/i },
  { key: 'chip', pattern: /(?:芯片|处理器|CPU)\s*[:：为是]?\s*((?:Apple\s*)?M[1-9](?:\s*(?:Pro|Max|Ultra))?|(?:Intel\s*)?(?:Core\s*)?i[3579][ -]?\d{3,5}[A-Za-z]*)\b/i, value: m => m[1] },
  { key: 'chip', pattern: /\b((?:Apple\s*)?M[1-9](?:\s*(?:Pro|Max|Ultra))?)\b/i, value: m => m[1] },
  { key: 'gpu', pattern: /\b((?:GeForce\s*)?(?:RTX|GTX)\s*\d{3,4}(?:\s*(?:Ti|SUPER))?|(?:Radeon\s*)?RX\s*\d{4}(?:\s*(?:XT|XTX))?)\b/i, value: m => m[1] },
  { key: 'memory', pattern: /(?:运行内存|内存|RAM)\s*[:：为是]?\s*(\d{1,3})\s*(?:GB|G)(?![a-z])/i, value: m => `${m[1]} GB` },
  { key: 'storage', pattern: /(?:硬盘|存储|储存|容量|SSD|磁盘)\s*[:：为是]?\s*(\d{1,4})\s*(GB|G|TB|T)(?![a-z])/i, value: m => `${m[1]} ${/^t/i.test(m[2]) ? 'TB' : 'GB'}` },
  { key: 'battery', pattern: /(?:电池健康(?:度)?|最大容量|电池容量)\s*[:：为是]?\s*(\d{1,3})\s*%/i, value: m => `${m[1]}%` },
  { key: 'cycles', pattern: /(?:电池循环(?:次数)?|循环(?:次数)?)\s*[:：为是]?\s*(\d{1,5})\s*(?:次)?/i, value: m => `${m[1]} 次` },
  { key: 'repair', pattern: /(?:无拆无修|无拆修|没有拆修|未拆修|未维修|无维修|没有维修|(?:更换过|换过)(?:原厂|副厂|第三方|非原装|原装)?(?:电池|屏幕)|有维修记录|维修过|拆修过)/ },
  { key: 'fault', pattern: /(?<!没有)(?<!并非)(?<!不是)(?:无面容(?!问题|异常|故障)|面容(?:识别)?(?:坏了|损坏|失灵|故障|不能用|无法使用|不可用)|无法开机|不能开机|开不了机|无法充电|不能充电|充不进电|屏幕不亮)/ },
  { key: 'lock', pattern: /(?:无激活锁|没有激活锁|已解除激活锁|已退出账号|有激活锁|激活锁未解除|账号未退出)/ },
  { key: 'warranty', pattern: /(?:在保修期内|仍在保修|官方在保|已过保|过保|无保修)/ },
  { key: 'accessories', pattern: /(?:(?:包含|附带|带有|带|不含|没有|无|不带)(?:原装)?(?:充电器|电源适配器|包装盒|数据线|电源线)|全套原盒|原盒|(?:不含|没有|不带)?电源线)/ }
];

// Only flag explicit phrases as leads; wording can be ambiguous and always requires review.
const riskRules: RiskRule[] = [
  { kind: 'batteryHazard', pattern: /电池(?:有点|有|出现)?(?:鼓包|膨胀|漏液)|(?:鼓包|膨胀|漏液)的电池/g, priority: true, copyForSeller: false, advice: '请停止使用和充电，避免挤压或自行拆卸，并联系品牌官方或专业维修人员处理。' },
  { pattern: /私下转账|私下付款|站外转账|平台外转账|微信转账给我|脱离平台交易/g, priority: true, copyForSeller: false, advice: '请核实交易方式，优先在订单所在平台内沟通和付款，不扫描来历不明的付款码。' },
  { pattern: /进过水|泡过水|曾经进水|曾进水|进水机|水淹机|主板进水/g, priority: true, advice: '请确认进液时间、部位、维修情况和当前功能，要求相关记录；无法仅凭外观排除后续问题。' },
  { devices: ['phone', 'tablet'], pattern: /运营商锁|有锁机|卡贴机|卡贴解锁/g, priority: true, advice: '请确认网络限制和所需运营商；适用的 iPhone 可在“设置—通用—关于本机”查看运营商锁，具体以设备状态为准。' },
  { pattern: /分期未结清|分期还没还完|租赁未到期|租金未结清/g, priority: true, advice: '请确认设备的归属、转让权限及相关款项状态，要求卖家提供可核对的证明。' },
  { devices: ['phone', 'tablet', 'laptop', 'desktop'], pattern: /换过主板|更换过主板|主板维修过|维修过主板/g, priority: false, advice: '请确认更换或维修原因、配件来源与维修凭证，并核对型号、账号及设备功能。' },
  { devices: ['phone', 'tablet'], pattern: /扩容机|扩容过|改过容量/g, priority: false, advice: '请确认原始配置、扩容方式及实际可用容量；仅看系统显示不能证明存储硬件真实可靠。' },
  { devices: ['laptop', 'desktop'], pattern: /BIOS锁|BIOS密码未解除|固件密码未解除/gi, priority: true, advice: '请确认固件或 BIOS 是否仍受密码限制，并由原所有者按品牌官方流程处理。' },
  { devices: ['laptop', 'desktop'], pattern: /硬盘坏道|硬盘坏块|屏轴断裂|键盘失灵/g, priority: false, advice: '请确认问题范围、出现条件和维修记录；验货时检查相应功能。' },
  { devices: ['camera', 'lens'], pattern: /镜头发霉|镜片发霉|镜头有霉斑|镜片有霉斑|镜头起雾|镜头有霉/g, priority: false, advice: '请确认位置、程度和维修情况，索取不同角度清晰照片；仅凭照片不能排除内部问题。' },
  { devices: ['camera', 'lens'], pattern: /快门故障|快门失灵|无法自动对焦|自动对焦失灵|卡口不匹配|卡口不兼容/g, priority: true, advice: '请确认故障或不兼容的具体表现、搭配设备及维修情况；适配性以官方资料和实测为准。' },
  { pattern: /(?:电池|屏幕|主板|部件)(?:显示)?未知部件|未知部件|部件无法验证|部件被锁定/g, priority: false, advice: '请确认对应部件和系统提示，并查看该设备支持的维修历史；“未知”可能有多种原因，不能直接认定真假。' },
  { kind: 'screen', pattern: /屏幕烧屏|屏幕有绿线|屏幕闪烁|屏幕花屏/g, priority: false, advice: '请确认异常范围、出现条件及维修情况，验货时测试显示效果。' }
];

function riskClues(input: Input) {
  const sources: { text: string; source: Source }[] = [
    { text: input.listing, source: '商品描述' }, { text: input.reply, source: '卖家回复' }, { text: input.observed, source: '买家记录' }
  ];
  return riskRules.flatMap(rule => {
    if (rule.devices && !rule.devices.includes(input.device)) return [];
    for (const { text, source } of sources) for (const match of text.matchAll(rule.pattern)) {
      const prefix = text.slice(Math.max(0, (match.index ?? 0) - 10), match.index);
      // Local negation reduces obvious false positives, but is not full sentence understanding.
      if (/(?:没有|不建议|不需要|不接受|不支持|不会|不要|禁止|拒绝|无需|不走|不进行|从未|未曾|并非|不是|无|未|没|不)\s*$/.test(prefix)) continue;
      if (/^(?:已解除|已移除|已解锁)/.test(text.slice((match.index ?? 0) + match[0].length))) continue;
      return [{ ...rule, raw: match[0], source }];
    }
    return [];
  });
}

export function extract(text: string, source: Source): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();
  for (const rule of rules) {
    const pattern = new RegExp(rule.pattern.source, `${rule.pattern.flags}g`);
    for (const match of text.matchAll(pattern)) {
      const value = (rule.value ? rule.value(match) : (match[1] ?? match[0])).trim();
      if (rule.key === 'battery' && Number.parseInt(value, 10) > 100) continue;
      const identity = `${rule.key}:${normalized(rule.key, value)}`;
      if (seen.has(identity)) continue;
      facts.push({ key: rule.key, value, source, raw: match[0] });
      seen.add(identity);
    }
  }
  return facts;
}

export function normalized(key: Key, value: string): string {
  const v = value.toLowerCase().replace(/\s+/g, '');
  if (key === 'repair') {
    if (/^(无拆无修|无拆修|没有拆修|未拆修|未维修|无维修|没有维修)$/.test(v)) return 'no-repair-claimed';
    return 'repair-claimed';
  }
  if (key === 'lock') {
    if (/^(无激活锁|没有激活锁|已解除激活锁)$/.test(v)) return 'unlocked-claimed';
    if (/^(有激活锁|激活锁未解除)$/.test(v)) return 'locked-claimed';
  }
  return v;
}

export function analyze(input: Input) {
  const isComputer = input.device === 'laptop' || input.device === 'desktop' || input.device === 'tablet' || input.device === 'phone';
  const shorthandFacts = (text: string, source: Source): Fact[] => {
    if (!isComputer) return [];
    return [...text.matchAll(/(?<![\d.])(\d{1,2})\s*[+＋]\s*(\d{2,4})(?:\s*(?:GB|G))?(?![\d.])/gi)].flatMap(m => [
      { key: 'memory' as const, value: `${m[1]}（单位和含义待确认）`, source, raw: m[0], provisional: true },
      { key: 'storage' as const, value: `${m[2]}（单位和含义待确认）`, source, raw: m[0], provisional: true }
    ]);
  };
  const phoneStorage = (text: string, source: Source): Fact[] => {
    if (input.device !== 'phone') return [];
    return [...text.matchAll(/\biPhone\s*\d{1,2}(?:\s*(?:Pro\s*Max|Pro|Plus|Mini))?\s+(\d{2,4})\s*(GB|G|TB|T)(?![a-z0-9])/gi)].map(m => ({ key: 'storage' as const, value: `${m[1]} ${/^t/i.test(m[2]) ? 'TB' : 'GB'}`, source, raw: m[0] }));
  };
  const facts = [
    ...extract(input.listing, '商品描述'), ...shorthandFacts(input.listing, '商品描述'), ...phoneStorage(input.listing, '商品描述'),
    ...extract(input.reply, '卖家回复'), ...shorthandFacts(input.reply, '卖家回复'), ...phoneStorage(input.reply, '卖家回复'),
    ...extract(input.observed, '买家记录'), ...shorthandFacts(input.observed, '买家记录'), ...phoneStorage(input.observed, '买家记录')
  ];
  const keysByDevice: Record<Device, Key[]> = {
    laptop: ['model', 'chip', 'gpu', 'memory', 'storage', 'battery', 'cycles', 'repair', 'lock', 'warranty', 'accessories'],
    phone: ['model', 'storage', 'battery', 'repair', 'lock', 'warranty', 'accessories'],
    tablet: ['model', 'storage', 'battery', 'repair', 'lock', 'warranty', 'accessories'],
    desktop: ['model', 'chip', 'gpu', 'memory', 'storage', 'repair', 'warranty', 'accessories'],
    camera: ['model', 'repair', 'warranty', 'accessories'], lens: ['model', 'repair', 'warranty', 'accessories'],
    drone: ['model', 'battery', 'repair', 'warranty', 'accessories'],
    console: ['model', 'storage', 'repair', 'lock', 'warranty', 'accessories'],
    headphones: ['model', 'battery', 'repair', 'warranty', 'accessories'],
    watch: ['model', 'battery', 'repair', 'lock', 'warranty', 'accessories'],
    gpu: ['model', 'gpu', 'repair', 'warranty', 'accessories'], shaver: ['model', 'repair', 'warranty', 'accessories'], other: ['model', 'repair', 'warranty', 'accessories']
  };
  const isAppleComputer = (input.device === 'desktop' || input.device === 'laptop') && /\b(?:Mac\s*(?:mini|studio|pro)|MacBook|iMac)\b/i.test(`${input.selectedModel ?? ''} ${input.listing}`);
  const isAppleSilicon = isAppleComputer && /\bM[1-9](?:\s*(?:Pro|Max|Ultra))?\b/i.test(`${input.selectedModel ?? ''} ${input.listing}`);
  const keys = [...keysByDevice[input.device]];
  if (isAppleComputer && !keys.includes('lock')) keys.push('lock');
  keys.push('fault');
  const rows = keys.map(key => {
    const items = facts.filter(f => f.key === key);
    const distinct = new Set(items.filter(f => !f.provisional).map(f => normalized(key, f.value)));
    // Units and lock/account descriptions are not always directly comparable.
    const differentUnits = key === 'storage' && items.some(f => /tb$/i.test(f.value)) && items.some(f => /gb$/i.test(f.value));
    const differentLockConcepts = key === 'lock' && items.some(f => /退出账号/.test(f.value)) && items.some(f => /激活锁/.test(f.value));
    const accessoryStates = new Map<string, Set<boolean>>();
    if (key === 'accessories') for (const item of items) {
      const name = item.value.match(/充电器|电源适配器|包装盒|原盒|数据线|电源线/)?.[0].replace('原盒', '包装盒');
      if (name) { const states = accessoryStates.get(name) ?? new Set<boolean>(); states.add(!/^(不含|没有|无|不带)/.test(item.value)); accessoryStates.set(name, states); }
    }
    const conflict = key === 'fault' ? false : key === 'accessories' ? [...accessoryStates.values()].some(states => states.size > 1) : distinct.size > 1 && !differentUnits && !differentLockConcepts;
    const uncertain = !conflict && (items.some(f => f.provisional) || distinct.size > 1 && (differentUnits || differentLockConcepts));
    return { key, label: labels[key], items, conflict, uncertain };
  });
  const questions: Partial<Record<Key, string>> = {
    model: '请问具体型号、尺寸或版本是什么？',
    chip: '请问处理器 / 芯片的具体型号是什么？方便提供设置页面吗？',
    gpu: '请问显卡是集成显卡还是独立显卡？具体型号是什么？',
    memory: '请问运行内存是多少？方便提供系统信息截图吗？',
    storage: '请问存储容量是多少？方便提供系统信息截图吗？',
    battery: '请问电池健康状况如何？方便提供设备中可查看的相关页面吗？',
    cycles: '请问电池循环次数是多少？方便提供系统信息中的电源页面吗？',
    repair: '请问设备是否有拆修、更换部件或已知功能异常？',
    lock: '交付前能否确认账号锁定状态，并按官方流程完成移除？',
    warranty: '请问是否仍在保修期内？是否有可核对的购买或保修凭据？',
    accessories: '请问包含哪些配件？它们是否能正常使用？'
  };
  const allText = `${input.listing}\n${input.reply}`;
  const clues = riskClues(input);
  const batteryHazard = clues.some(clue => clue.kind === 'batteryHazard');
  if (batteryHazard) questions.battery = '请确认电池损伤情况及专业处理方案；损伤线索未排除前，不要通电或充电测试。';
  const priorityQuestions: string[] = [];
  if (/公司|单位|企业/.test(allText) && isAppleComputer) priorityQuestions.push('描述提到公司或单位使用：请确认卖家是否有权转让，并核对是否仍受组织设备管理（MDM）约束；如有，请由原组织处理。');
  if (/不退不换|不支持退换|售出后.{0,6}不退/.test(allText)) priorityQuestions.push('描述提到不退不换：请在下单前与卖家确认商品不符、故障及验货时的处理方式，并以平台规则为准。');
  const lockRow = rows.find(row => row.key === 'lock');
  const locked = lockRow?.items.find(item => /^(有激活锁|激活锁未解除|账号未退出)$/.test(item.value));
  if (locked) priorityQuestions.push(`${locked.source}提到“${locked.raw}”：请原持有人按品牌官方流程处理，并在交付前核对；不要索取账号密码。${lockRow?.conflict || lockRow?.uncertain ? '相关表述存在差异，还需进一步核对。' : ''}`);
  const faults = rows.find(row => row.key === 'fault')?.items ?? [];
  for (const fact of faults) priorityQuestions.push(`${fact.source}提到“${fact.raw}”：请确认具体故障、影响范围、是否维修过及验货处理方式。`);
  const clueText = (clue: typeof clues[number]) => `${clue.source}提到“${clue.raw}”：${batteryHazard && /验货时|测试/.test(clue.advice) ? '请确认异常范围及维修情况；电池损伤线索未排除前不要通电或运行测试。' : clue.advice}`;
  for (const clue of clues.filter(item => item.priority)) priorityQuestions.push(clueText(clue));
  for (const row of rows.filter(row => row.conflict && !(row.key === 'lock' && locked))) priorityQuestions.push(`关于${row.label}，目前不同信息不一致，能否说明并提供对应依据？`);
  const otherQuestions: string[] = [];
  for (const clue of clues.filter(item => !item.priority)) otherQuestions.push(clueText(clue));
  if (input.device === 'camera') otherQuestions.push('请确认机身及镜头型号、卡口和配件，并提供近期实拍照片；快门次数能否查询取决于机型。');
  if (input.device === 'lens') otherQuestions.push('请确认镜头型号、卡口及适配的机身，并说明镜片、对焦和维修情况。');
  if (input.device === 'phone' && !clues.some(clue => /运营商锁|有锁机|卡贴/.test(clue.raw))) otherQuestions.push(batteryHazard ? '请确认网络版本和运营商限制；电池损伤线索未排除前不要通电测试。' : '请确认网络版本和运营商限制；按对应品牌与机型说明核对。');
  const shorthand = facts.find(f => f.provisional);
  if (shorthand) otherQuestions.push(`描述中的“${shorthand.raw}”是否指运行内存和存储容量？请卖家提供系统信息截图确认具体数值和单位。`);
  const repairRow = rows.find(row => row.key === 'repair');
  const repaired = repairRow?.items.find(item => normalized('repair', item.value) === 'repair-claimed');
  if (repaired && !repairRow?.conflict) otherQuestions.push(`${repaired.source}提到“${repaired.raw}”：请确认维修内容、配件来源、维修凭证和目前功能。`);
  if (lockRow?.items.length && !locked && !lockRow.conflict && !lockRow.uncertain) otherQuestions.push('请按品牌官方流程确认账号和激活锁状态，由原持有人处理，不索取密码。');
  otherQuestions.push(...rows.flatMap(row => row.conflict
    ? []
    : row.key === 'lock' && locked ? []
    : row.items.some(item => item.provisional) ? []
    : row.uncertain ? [`关于${row.label}，不同表述需要进一步核对，能否说明并提供对应依据？`]
    : row.key === 'model' && input.selectedModel?.trim() ? []
    : row.key === 'gpu' && isAppleSilicon ? []
    : row.items.length === 0 && questions[row.key] ? [questions[row.key]!] : []));
  const followups = [...priorityQuestions, ...otherQuestions];
  const mentioned = rows.filter(row => !row.conflict && !row.uncertain && ['model', 'memory', 'storage', 'accessories'].includes(row.key) && row.items.some(item => item.source === '商品描述')).map(row => row.label);
  // ponytail: colors indicate review priority, not an assessment of authenticity or safety.
  const buyerOnly = new Set(clues.filter(item => item.copyForSeller === false).map(clueText));
  const sellerQuestions = followups.filter(question => !buyerOnly.has(question));
  return { facts, rows, followups, priorityQuestions, mentioned, sellerQuestions, batteryHazard };
}

export const checklist: Record<Device, { title: string; detail: string }[]> = {
  laptop: [
    { title: '核对外观与配件', detail: '检查屏幕、机身四角和接口，核对卖家承诺的附件。' },
    { title: '核对型号与配置', detail: '在系统信息中查看型号、芯片、内存和存储，逐项与描述对照。' },
    { title: '查看电池信息', detail: '参考品牌官方说明查看电池健康或循环次数；单个数值不能证明电池原装。' },
    { title: '测试基本功能', detail: '检查键盘、触控板、扬声器、摄像头、无线连接和充电等适用功能。' },
    { title: '确认账号锁定', detail: '根据设备品牌官方指引确认账号和激活锁状态；由原所有者操作，不索取密码。' },
    { title: '核对保修与维修凭据', detail: '通过品牌官方渠道核对可用的保修和维修记录；未查到记录不代表从未维修。' }
  ],
  phone: [
    { title: '核对外观与配件', detail: '查看屏幕、机身、摄像头和接口，核对卖家承诺的附件。' },
    { title: '核对型号与存储', detail: '在系统设置中核对型号和存储容量，与商品描述对照。' },
    { title: '查看电池与维修记录', detail: '按照对应机型的官方说明查看可见信息；未显示记录不等于从未维修。' },
    { title: '测试基本功能', detail: '检查触屏、摄像头、扬声器、麦克风、无线连接和充电等适用功能。' },
    { title: '确认账号锁定', detail: '按设备品牌官方指引检查激活锁；由原所有者处理，不索取密码。' },
    { title: '核对保修与维修凭据', detail: '通过品牌官方渠道核对可用的保修和维修记录；未查到记录不代表从未维修。' }
  ],
  tablet: [
    { title: '核对外观与配件', detail: '检查屏幕、机身、接口，以及卖家承诺的手写笔或键盘等配件。' },
    { title: '核对型号与存储', detail: '查看设备设置，对照型号、存储及蜂窝网络版本等卖家承诺。' },
    { title: '检查电池与功能', detail: '测试触控、充电、扬声器、无线连接等适用功能。' },
    { title: '确认账号锁定', detail: '按照品牌官方说明，由原所有者处理账号和锁定状态。' }
  ],
  desktop: [
    { title: '核对外观与配件', detail: '检查机箱、接口、电源线和承诺附带的配件。' },
    { title: '核对核心配置', detail: '在系统中对照处理器、显卡、内存及存储，不能仅凭系统名称断定内部部件真实性。' },
    { title: '测试基础功能', detail: '检查开机、显示输出、网络和接口等基础功能；异常需要进一步检测。' },
    { title: '核对账号和组织管理', detail: '如适用，按品牌官方流程确认账号锁和组织设备管理状态；由原所有者或组织处理，不索取密码。' },
    { title: '核对维修和交易约定', detail: '与卖家确认过往维修、已知故障及订单验货规则。' },
    { title: '核对保修与维修凭据', detail: '通过品牌官方渠道核对可用的保修和维修记录；未查到记录不代表从未维修。' }
  ],
  camera: [
    { title: '检查机身与配件', detail: '核对机身外观、卡口、屏幕、电池、充电设备及卖家承诺的配件。' },
    { title: '核对型号和镜头', detail: '对照机身型号及随附镜头；型号和附件以实物为准。' },
    { title: '测试拍摄功能', detail: '在适当条件下测试开机、拍照、录像、存储、按键和对焦。' },
    { title: '确认使用和维修记录', detail: '询问已知故障及维修；快门次数等信息能否核验取决于机型和工具。' }
  ],
  lens: [
    { title: '核对型号与卡口', detail: '确认镜头型号、焦距、光圈、卡口及适配情况；勿只凭外观判断。' },
    { title: '检查外观与镜片', detail: '在适当光线下查看镜片、卡口及外壳，图片不能排除内部问题。' },
    { title: '测试对焦与操作', detail: '有条件时在兼容机身上测试对焦、光圈、变焦或防抖等适用功能。' },
    { title: '核对配件与维修', detail: '检查前后盖、遮光罩等约定配件，并核对维修和已知问题。' }
  ],
  drone: [
    { title: '核对机身与配件', detail: '检查机身、桨叶、云台、遥控器、充电设备和卖家承诺的配件。' },
    { title: '确认电池状态', detail: '查看设备支持的电池状态；电池鼓包、破损或异常时停止使用。' },
    { title: '确认绑定及功能', detail: '按厂商官方流程核对账号绑定和基础功能，不能仅凭卖家承诺。' },
    { title: '核对维修和使用记录', detail: '询问已知碰撞、进水、维修情况；是否可核实取决于设备与记录。' }
  ],
  console: [
    { title: '核对型号与配件', detail: '对照主机版本、存储、手柄、线材和卖家承诺的附件。' },
    { title: '测试开机与显示', detail: '检查开机、显示输出、网络、手柄连接及适用功能。' },
    { title: '确认账号及限制', detail: '按厂商官方说明检查账号绑定和使用限制，不索要密码。' },
    { title: '核对维修和交易约定', detail: '询问维修与已知故障，查看订单中约定的验货条件。' }
  ],
  headphones: [
    { title: '核对型号与配件', detail: '检查耳机、充电盒、线材、耳塞等卖家承诺的物品。' },
    { title: '测试连接与声音', detail: '在自己的设备上测试左右声道、麦克风、按键及连接等适用功能。' },
    { title: '检查充电与电池', detail: '测试充电；电池真实续航往往需要较长时间核实。' },
    { title: '确认绑定与维修', detail: '按品牌官方说明确认设备绑定情况，核对维修和保修信息。' }
  ],
  watch: [
    { title: '核对型号与配件', detail: '检查手表、表带、充电器及卖家承诺的配件。' },
    { title: '测试基础功能', detail: '检查开机、触控、按键、充电及与适用手机的连接。' },
    { title: '核对电池和维修', detail: '检查该机型可查看的电池状态，确认卖家所述维修记录。' },
    { title: '确认账号锁定', detail: '按品牌官方指引核对配对与账号锁定，由原所有者处理。' }
  ],
  gpu: [
    { title: '核对完整型号', detail: '核对芯片型号、显卡品牌和具体版本，不能只看商品标题。' },
    { title: '检查外观与配件', detail: '检查外壳、风扇、供电及视频接口和约定配件；外观不能证明内部无故障。' },
    { title: '测试基本输出', detail: '有条件时在兼容设备上检查识别和显示输出；基础测试不能排除所有负载问题。' },
    { title: '核对使用与维修', detail: '询问维修、更换部件和已知异常，无法验证的使用历史保持未知。' }
  ],
  shaver: [
    { title: '核对型号与外观', detail: '查看机身铭牌，对照商品描述中的型号，检查外壳和刀头的破损或污渍。' },
    { title: '检查刀头与清洁情况', detail: '确认刀头状态、清洁情况及卖家承诺；仅凭外观不能判断使用历史。' },
    { title: '测试通电和充电', detail: '在安全条件下测试开关、运行和充电等适用功能。' },
    { title: '核对配件与售后', detail: '核对充电器、保护盖等约定配件，确认维修、保修和验货条件。' }
  ],
  other: [
    { title: '核对型号与配件', detail: '对照实物型号、外观与卖家列出的配件。' },
    { title: '检查基础功能', detail: '结合具体设备和品牌官方说明检查适用功能；没有依据时不要臆测。' },
    { title: '核对维修和交易约定', detail: '确认卖家描述的维修、已知问题以及订单验货和售后条件。' }
  ]
};
