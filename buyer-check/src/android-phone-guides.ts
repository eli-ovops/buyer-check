import { oppoBatteryEvidence } from './oppo-battery-evidence';

export type AndroidExtraBrand = 'honor' | 'oneplus' | 'realme' | 'iqoo' | 'meizu' | 'redmagic' | 'sony' | 'motorola' | 'google';
type Guide = { title: string; steps: string[]; source: string; sourceLabel?: string };
type Guides = Record<string, Guide[]>;
const iqooSystems: Record<string, [string, string]> = {
  'iqoo 13': ['OriginOS 5，基于 Android 15', 'https://www.vivo.com.cn/vivo/param/iqoo13'],
  'iqoo 12 pro': ['OriginOS 4，基于 Android 14', 'https://www.vivo.com.cn/vivo/param/iqoo12pro'],
  'iqoo 12': ['OriginOS 4，基于 Android 14', 'https://www.vivo.com.cn/vivo/param/iqoo12'],
  'iqoo 11 pro': ['OriginOS 3，基于 Android 13', 'https://www.vivo.com.cn/vivo/param/iqoo11pro'],
  'iqoo 11': ['OriginOS 3，基于 Android 13', 'https://www.vivo.com.cn/vivo/param/iqoo11'],
  'iqoo neo10 pro+': ['OriginOS 5，基于 Android 15；全网通 V2463A', 'https://www.vivo.com.cn/vivo/param/iqooneo10proplus'],
  'iqoo neo10 pro': ['OriginOS 5，基于 Android 15；全网通 V2426A', 'https://www.vivo.com.cn/vivo/param/iqooneo10pro'],
  'iqoo neo10': ['OriginOS 5，基于 Android 15；全网通 V2425A', 'https://www.vivo.com.cn/vivo/param/iqooneo10'],
  'iqoo neo9 pro': ['OriginOS 4，基于 Android 14；全网通 V2339A', 'https://www.vivo.com.cn/vivo/param/iqooneo9pro'],
  'iqoo neo9': ['OriginOS 4，基于 Android 14；全网通 V2338A', 'https://www.vivo.com.cn/vivo/param/iqooneo9']
};
const extraSystems: Partial<Record<AndroidExtraBrand, Record<string, [string, string]>>> = {
  oneplus: {
    'oneplus 13': ['ColorOS 15.0，基于 Android 15', 'https://www.oneplus.com/cn/13/specs'],
    'oneplus 12': ['ColorOS 14.0，基于 Android 14', 'https://www.oneplus.com/cn/12/specs'],
    'oneplus ace 3 pro': ['ColorOS 14.1，基于 Android 14', 'https://www.oneplus.com/cn/ace-3-pro/specs'],
    'oneplus ace 3': ['ColorOS 14.0，基于 Android 14', 'https://www.oneplus.com/cn/ace-3/specs']
  },
  realme: {
    'realme gt7 pro': ['realme UI 6.0，基于 Android 15', 'https://www.realme.com/cn/realme-gt-7-pro/specs'],
    'realme gt6': ['realme UI 5.0，基于 Android 14', 'https://www.realme.com/cn/realme-gt-6/specs'],
    'realme gt5 pro': ['realme UI 5.0', 'https://www.realme.com/cn/realme-gt-5-pro/specs']
  },
  honor: {
    '荣耀 magic7 rsr': ['MagicOS 9.0（官方 Magic7 系列发布资料）', 'https://www.honor.com/cn/news/honor-magic7-launch/'],
    '荣耀 magic7 pro': ['MagicOS 9.0（官方 Magic7 系列发布资料）', 'https://www.honor.com/cn/news/honor-magic7-launch/'],
    '荣耀 magic7': ['MagicOS 9.0（官方 Magic7 系列发布资料）', 'https://www.honor.com/cn/news/honor-magic7-launch/'],
    '荣耀 magic6 pro': ['MagicOS 8.0（官方 Magic6 系列发布资料）', 'https://www.honor.com/cn/news/honor-magic6-launch/'],
    '荣耀 magic6': ['MagicOS 8.0（官方 Magic6 系列发布资料）', 'https://www.honor.com/cn/news/honor-magic6-launch/'],
    '荣耀 200 pro': ['MagicOS 8.0（官方荣耀 200 系列发布资料）', 'https://www.honor.com/cn/news/honor-200-series-launch/'],
    '荣耀 200': ['MagicOS 8.0（官方荣耀 200 系列发布资料）', 'https://www.honor.com/cn/news/honor-200-series-launch/']
  }
};

export function extraAndroidGuides(brand: AndroidExtraBrand, model: string): Guides {
  const modelName = model.trim() || '该型号';
  const common = `【${modelName}】本型号、当前系统版本和国行适用情况需以实机及官方确认为准。`;
  let battery: Guide;
  let account: Guide;
  let repair: Guide;
  let warranty: Guide;
  if (brand === 'honor') {
    battery = { title: '荣耀电池相关设置', steps: ['Magic UI 6.1、MagicOS 7.0、7.1、7.2、8.0、9.0、10.0、11 的荣耀通用资料列有设置 → 电池 → 更多电池设置；部分机型为设置 → 电池 → 电池健康。这里的智能充电或峰值容量设置不等于健康百分比。', `若未显示实际最大容量，记为未知；可咨询荣耀官方服务中心。${common}`], source: 'https://www.honor.com/cn/support/content/zh-cn03061882/' };
    account = { title: '荣耀账号与查找设备', steps: ['由原持有人在设置 → 登录荣耀账号 → 账号中心 → 查找设备查看并按官方说明处理；实际路径随系统变化。', '如激活时要求原账号，须由原持有人处理，不索取密码或验证码。关闭查找或退出账号本身不证明全部锁定已解除。'], source: 'https://www.honor.com/cn/support/content/zh-cn15809726/' };
    repair = { title: '荣耀服务记录与工单', steps: ['由原持有人打开荣耀官网服务进度查询，按页面提示自行使用相关手机号和验证码查询；该型号与当前记录覆盖范围待核实。', '官方页面提示可咨询近六个月以前的维修服务，联系电话 95030；未查到记录不代表从未维修，也不能排除第三方维修。不要索取验证码。'], source: 'https://www.honor.com/cn/support/inquiry/' };
    warranty = { title: '荣耀权益查询', steps: ['由持有人打开“我的荣耀”App → 服务 → 服务权益 → 电子三包凭证，查看本机保修状态和权益；也可通过荣耀服务官网的权益查询核对。不同型号和 App 版本能否显示，以实际为准。', '荣耀说明，在 App 查询其他设备时可能只显示保内或保外，不显示具体日期；可由持有人通过官网查询。查不到时核对设备序列号并咨询官方，不要在本工具输入完整序列号或验证码。', '对照购买凭证及卖家承诺；保内不等于所有故障均可免费维修，是否适用以荣耀授权服务中心检测及保障条款为准，也无需为验机购买或激活额外服务。'], source: 'https://www.honor.com/cn/support/content/zh-cn15839671/' };
  } else if (brand === 'oneplus' || brand === 'realme') {
    battery = { title: `${brand === 'oneplus' ? '一加' : 'realme'} 电池健康待确认`, steps: [`请持有人在设置中的电池相关页面查看是否提供最大容量；该机当前系统的具体入口及是否显示百分比待实机核实。${common}`, '当前电量、充电上限与智能充电开关不是电池健康度；没有结果时保持未知或咨询官方。'], source: 'https://support.oppo.com/cn/' };
    account = brand === 'realme' ? { title: 'realme 云服务账号与重置保护', steps: ['realme 国行官方重置说明提示：重置前未退出云服务账号，重置后可能要求验证云服务密码。请持有人在设置 → 账号中核对，并自行按官方流程处理；实际菜单和本型号、当前版本适用性以实机为准。', '退出云服务账号不证明所有账号和设备保护均已解除；交付时另行核对。不要索取密码或验证码；抹除会清除数据，须由原持有人决定并操作，不为验机擅自重置。'], source: 'https://www.realme.com/cn/support/kw/article-detail/2099899' } : { title: '账号与查找手机', steps: ['请原持有人查看设备实际登录的账号和查找手机状态，并按该机官方流程处理；该型号、当前系统的具体路径待核实。', '退出一个账号不代表已解除全部激活限制；不要索取密码或验证码。'], source: 'https://www.oppo.com/content/dam/oppo/file/pdf/ColorOS%2011%E5%AE%89%E5%85%A8%E6%8A%80%E6%9C%AF%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf' };
    repair = { title: '官方服务记录', steps: [brand === 'oneplus' ? '请持有人通过 OPPO 官方服务记录入口查询可见记录，或提供官方维修工单；本型号适用范围待核实。' : '请持有人打开 realme 官方服务进度页面，按提示自行查询送修手机号或设备序列号；页面提供进行中、已完成等筛选，可核对可见工单。', '服务进度不等于完整维修史，可查时长和本型号适用范围待核实；没有记录不代表没有维修，第三方维修可能未收录。手机号和验证码由持有人自行处理。'], source: brand === 'oneplus' ? 'https://support.oppo.com/cn/app0/repair-record/?isFromHome=true&isHideToolbar=true' : 'https://www.realme.com/cn/support/progress' };
    warranty = { title: '电子保修卡', steps: [brand === 'oneplus' ? '官方通用说明：由持有人打开“我的一加” → 我的 → 电子保修卡，具体入口及本机支持情况以实机为准。' : '官方通用说明：由持有人查找设置 → 关于本机 → 官方保修 → 电子保修卡，具体入口及本机支持情况以实机为准。', '结合购机凭证和官方核实；不要要求激活或购买额外保障，也不要在本工具填写完整设备码。'], source: 'https://support.oppo.com/cn/answer/?aid=SI2105098' };
  } else if (brand === 'iqoo') {
    battery = { title: 'iQOO 电池状态（社区线索）', sourceLabel: '查看社区线索', steps: ['请在设置 → 电池中查找“电池健康与充电”或最大容量；这来自社区经验，型号和系统版本支持情况未经厂商核实。', `未显示最大容量时记为未知，不把当前电量、充电上限当作健康度。${common}`], source: 'https://bbs.vivo.com.cn/newbbs/thread/39439947' };
    account = { title: 'iQOO 账号与查找设备', steps: ['vivo 技术支持对 vivo/iQOO 提供通用入口：由原持有人查看设置 → 安全（或安全与隐私）→ 查找 → 查找设备；本型号和当前系统菜单仍需核实。', '由原持有人按官方流程处理账号与查找设备；关闭查找不代表所有设备保护均已解除，不索取密码或验证码。'], source: 'https://bbs.vivo.com.cn/newbbs/thread/36945416' };
    repair = { title: 'vivo / iQOO 服务进度', steps: ['由原持有人打开 vivo 官网服务页 → 服务进度，按页面要求自行查询；具体型号和可查范围待核实。', '进度查询不等于完整维修史；无记录不代表从未维修。账号、手机号及验证码由持有人自行处理，不在本工具中填写。'], source: 'https://www.vivo.com.cn/service.html' };
    warranty = { title: 'vivo / iQOO 电子保修卡', steps: ['由原持有人查看设置 → 系统管理或系统管理与升级 → 客户服务 → 电子保修卡；这是 vivo 通用说明，iQOO 本型号和当前系统适用性待核实。', '没有卡时不要求为验机注册或激活，可带购机凭证咨询官方。'], source: 'https://www.vivo.com.cn/service/questions?categoryId=131' };
  } else if (brand === 'meizu') {
    battery = { title: '魅族电池健康待确认', steps: [`该型号与当前 Flyme 版本的电池健康百分比入口待核实；请持有人查看电池设置或咨询魅族官方服务。${common}`, '当前电量和充电上限不是健康百分比，未显示时保持未知。'], source: 'https://care.meizu.com/' };
    account = { title: '魅族账号与查找设备', steps: ['请原持有人按当前 Flyme 版本的官方流程确认账号与查找设备状态；本型号具体入口和激活限制待核实。', '涉及清除数据由原持有人决定并操作，不索取密码或验证码。'], source: 'https://care.meizu.com/' };
    repair = { title: '魅族维修查询', steps: ['由持有人在魅族官方维修查询页面查询可见工单；手机号、验证码或序列号由持有人自行填写。', '可查记录范围待核实，未查到不代表从未维修。'], source: 'https://care.meizu.com/repair/query/index.html' };
    warranty = { title: '魅族保修查询', steps: ['由持有人在魅族官方保修及真伪查询页面查询，并结合购机凭证及官方服务中心结果核实。', '查询结果和标签不是整机真伪证明，不要在本工具输入完整序列号。'], source: 'https://service.meizu.com/authenticity.html' };
  } else if (brand === 'sony') {
    battery = { title: '索尼 Xperia 电池健康', sourceLabel: '前往索尼中国支持', steps: [`本型号国行及当前 Android 版本的电池健康百分比入口待核实。${common}`, '请在设置中查看电池相关信息；当前电量不是健康度。必要时请索尼授权服务中心检测。'], source: 'https://www.sony.com.cn/support/' };
    account = { title: 'Xperia 账号和设备保护', steps: ['请原持有人检查实际登录的 Google 等账号及设备保护，按官方流程处理；是否需要原账号验证取决于实机设置。', '不索取密码或验证码，重置会清除数据，须由原持有人决定并操作。'], source: 'https://support.google.com/android/answer/9459346?hl=zh-Hans' };
    repair = { title: '索尼维修凭证', steps: ['请持有人向索尼授权服务中心查询可提供的工单，或出示维修凭证；本型号是否提供历史记录及范围待核实。', '未查到不代表没有维修，第三方维修可能未收录。'], source: 'https://www.sony.com.cn/content/casch/serviceinfo/servicepolicy.html' };
    warranty = { title: '索尼保修核对', steps: ['请原持有人持购机发票向索尼中国授权服务中心核对购买地、机型、期限和适用条件；跨地区服务有条件，不能假定所有地区均可保修。', '不向本工具输入完整序列号或验证码。'], source: 'https://www.sony.com.cn/content/casch/serviceinfo/servicepolicy.html' };
  } else if (brand === 'google') {
    battery = { title: 'Pixel 国行电池健康待核实', steps: [`该型号的中国大陆销售与当前系统版本适用性尚未核实；电池健康百分比的国行路径也待核实。${common}`, '可查看本机电池设置；当前电量或充电上限不等于健康度，没有可确认结果时保持未知。'], source: 'https://support.google.com/store/answer/2462844' };
    account = { title: 'Pixel 国行账号保护待核实', steps: ['请原持有人核对设备实际登录的账号及设备保护，具体型号、地区与系统版本下的解除方式待核实。', '如交付时要求原账号验证，由原持有人处理；不索取密码或验证码，清除数据由持有人决定并操作。'], source: 'https://support.google.com/android/answer/9459346?hl=zh-Hans' };
    repair = { title: 'Pixel 国行维修记录待核实', steps: ['请原持有人提供维修凭证，向购买渠道或官方确认该设备能查询到的服务记录及其范围。', '中国大陆服务适用性待核实；没有记录不代表没有维修。'], source: 'https://support.google.com/store/answer/2462844' };
    warranty = { title: 'Pixel 国行保修待核实', steps: ['请卖家提供购买渠道和凭证，向官方确认实机销售地、保修和服务适用条件；国行销售与保修渠道待核实。', '不在本工具输入完整设备码或验证码，也不要仅凭商品描述判断在保。'], source: 'https://support.google.com/store/answer/2462844' };
  } else if (brand === 'motorola') {
    battery = { title: 'moto 电池健康待核实', steps: [`该型号国行和当前系统的电池健康百分比入口待核实；查看设置 → 电池，当前电量及充电上限不等于健康度。${common}`, '未显示健康数值时保持未知，必要时向联想授权服务中心咨询。'], source: 'https://iknow.lenovo.com.cn/detail/427949' };
    account = { title: 'moto 账号与查找设备', steps: ['联想的 moto 系列资料提示设备可能登录联想账号并开启查找手机；请原持有人检查设备上实际账号和查找状态，具体路径、解除方式及系统版本待核实。', '退出一个账号不代表所有设备保护均已解除；不索取密码或验证码，清除数据由原持有人决定并操作。'], source: 'https://iknow.lenovo.com.cn/detail/439859' };
    repair = { title: 'moto 维修凭证', steps: ['请原持有人出示维修工单或三包凭证上的维修记录，也可咨询联想授权服务中心；线上历史查询范围及该型号支持情况待核实。', '未查到记录不代表没有维修，第三方维修可能不在官方记录中。'], source: 'https://iknow.lenovo.com.cn/detail/203993' };
    warranty = { title: 'moto 保修查询', steps: ['联想官方说明：由原持有人在微信“联想服务”小程序输入 IMEI 绑定设备后查看保修期限；绑定涉及账号，是否使用由持有人决定。', '查询显示的期限按生产或出库日期计算，可结合有效购机凭证请官方核对。不要在本工具输入完整 IMEI 或验证码；本型号适用性以官方核实为准。'], source: 'https://iknow.lenovo.com.cn/app/detail/417781' };
  } else {
    const isRedmagic = /^红魔/i.test(modelName);
    if (!isRedmagic) {
      battery = { title: '努比亚电池健康待核实', steps: [`本型号国行、当前系统的电池健康入口和百分比支持待核实；请在电池设置中查看，未显示则保持未知。${common}`], source: 'https://shop.nubia.com/service.php?sid=2' };
      account = { title: '努比亚账号锁待核实', steps: ['请原持有人检查实际账号和设备保护状态；本型号的查找设备、激活限制与解除步骤待向官方核实。', '不要索取密码或验证码；清除数据由原持有人决定并操作。'], source: 'https://shop.nubia.com/service.php?sid=2' };
      repair = { title: '努比亚维修凭证', steps: ['请持有人出示维修工单或通过努比亚官方服务网点咨询；线上历史记录及本型号适用性待核实。未查到记录不等于从未维修。'], source: 'https://shop.nubia.com/service.php?sid=2' };
      warranty = { title: '努比亚保修核对', steps: ['请持有人结合购机凭证咨询努比亚官方服务网点，核对本机销售地及保修；具体查询方式和期限待核实。'], source: 'https://shop.nubia.com/service.php?sid=2' };
    } else {
    battery = { title: '红魔电池健康待确认', steps: [`本型号、当前系统的电池健康显示入口待核实；没有数值时保持未知，必要时咨询红魔官方。${common}`], source: 'https://shop.nubia.com/active/commonproblem.html' };
    account = { title: '红魔账号状态待确认', steps: ['请原持有人确认实际登录账号与设备锁状态；该型号具体菜单及激活限制待核实。', '不要索取密码或验证码，重置由原持有人决定并操作。'], source: 'https://shop.nubia.com/active/commonproblem.html' };
    repair = { title: '红魔维修凭证', steps: ['请持有人提供维修工单，或通过红魔官方服务渠道咨询该型号可查记录；未查到不代表没有维修。'], source: 'https://shop.nubia.com/active/commonproblem.html' };
    warranty = { title: '红魔保修凭证', steps: ['请持有人结合购机凭证向红魔官方服务中心核对本机保修；本型号查询入口及保障期限待核实。'], source: 'https://shop.nubia.com/active/postsalesservice.html' };
    }
  }
  const guides: Guides = { '查看电池与维修记录': [battery], '确认账号锁定': [account], '核对保修与维修凭据': [repair, warranty] };
  if (brand === 'honor' && /^荣耀\s*magic6\s*pro$/i.test(modelName)) guides['查看电池与维修记录'].push({
    title: '荣耀 Magic6 Pro：电池容量社区线索', sourceLabel: '查看社区线索',
    steps: ['荣耀俱乐部一篇用户帖显示发帖设备为 Magic6 Pro，作者称可在设置 → 电池 → 更多电池设置查看最大容量；帖子带 MagicOS 10 话题，但话题标签不能证明设备实际版本。', '这是用户经验，并非厂商对该机型和版本的正式支持说明；当前实机能否显示仍待核实。未显示时保持未知，不要把充电上限当作电池健康，也不能仅凭数值判断电池原装。'],
    source: 'https://club.honor.com/cn/thread-30064120-1-1.html'
  });
  if (brand === 'honor' && /^荣耀\s*magic7\s*pro$/i.test(modelName)) guides['查看电池与维修记录'].push({
    title: '荣耀 Magic7 Pro：电池容量社区线索', sourceLabel: '查看社区线索',
    steps: ['荣耀俱乐部一篇显示发帖设备为 Magic7 Pro 的帖子中，答答团回复建议查看设置 → 电池 → 更多电池设置 → 电池健康 → 最大容量；帖子带 MagicOS 10 话题且标注含 AI 生成内容，不能据此确认实机系统版本。', '这是社区回复，非型号和系统版本的厂商正式支持说明；当前实机能否显示仍待核实。未显示时保持未知，不要把充电上限当作电池健康，也不能仅凭数值判断电池原装。'],
    source: 'https://club.honor.com/cn/thread-29965968-1-1.html'
  });
  const supportedBattery = brand === 'oneplus' || brand === 'realme' ? oppoBatteryEvidence(modelName) : undefined;
  if (supportedBattery) guides['查看电池与维修记录'].push(supportedBattery);
  const magic7Code = brand === 'honor' ? ({ '荣耀 magic7': 'PTP-AN00 / AN60', '荣耀 magic7 pro': 'PTP-AN10 / AN70', '荣耀 magic7 rsr': 'PTP-AN20' } as Record<string, string>)[modelName.toLowerCase()] : undefined;
  if (magic7Code) guides['查看电池与维修记录'].push({
    title: `${modelName}：MagicOS 11 充电上限`,
    steps: [`荣耀官方更新说明将本型号对应 ${magic7Code}，列入 [REDACTED_HOST] 更新。请先在实机核对完整型号及当前版本；不能因为有更新说明就认定设备已更新。`, '该更新说明列出设置 → 电池 → 电池健康 → 自定义充电上限。充电上限是充电设置，不是电池最大容量或健康百分比；无需修改设置。', '官方更新说明未证实此页面一定显示最大容量。其他系统版本或实机未显示时，健康度保持未知；按上方通用步骤或咨询官方核对。'],
    source: 'https://club.honor.com/cn/thread-30455962-1-1.html'
  });
  const honorVersion = brand === 'honor' && extraSystems.honor?.[modelName.toLowerCase()] ? (/^荣耀\s*magic7(?:\s|$)/i.test(modelName) ? '9.0' : '8.0') : undefined;
  if (honorVersion) guides['确认账号锁定'].push({
    title: `MagicOS ${honorVersion}：查找设备与激活锁`,
    steps: [
      `先核对实际系统：荣耀 MagicOS ${honorVersion} 安全白皮书说明，启用查找设备后，设备遭强制清除数据并重启时可能要求荣耀账号重新激活。该说明为系统级资料，本型号及当前版本的具体适用性仍待核实。`,
      '请原持有人按上方官方路径核对并处理查找设备与账号；不要索取账号、锁屏密码或验证码，也不要为验机强制清除或远程擦除数据。交付时如出现验证，由原持有人自行处理；不能仅凭开关状态判断所有限制已解除。'
    ],
    source: honorVersion === '9.0' ? 'https://www.honor.com/content/dam/honor/cn/security-white-paper/imgs/MagicOS-9.0%E5%AE%89%E5%85%A8%E6%8A%80%E6%9C%AF%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf' : 'https://www.honor.com/content/dam/honor/cn/overview-test/img/MagicOS-8.0%E5%AE%89%E5%85%A8%E6%8A%80%E6%9C%AF%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf'
  });
  if (brand === 'iqoo') guides['确认账号锁定'].push({ title: 'iQOO：重置后可能要求原账号', steps: ['vivo 说明：设备开启查找设备时，强制恢复出厂设置后可能需要 vivo 账号验证才能激活；具体型号和系统适用性需核实。', '不要为了检查擅自重置或要求密码；若交付时出现账号验证，由原持有人处理，是否清除数据由持有人决定。'], source: 'https://www.vivo.com.cn/service/questions?categoryId=141' });
  if (brand === 'iqoo' && /^iqoo\s*13$/i.test(modelName)) guides['查看电池与维修记录'].push({ title: 'iQOO 13：区分充电上限与电池健康', steps: ['vivo 官方的 iQOO 13 版本 15.0.22.5.W10.V000L1 更新日志列出：设置 → 电池 → 电池健康与充电 → 优化电池充电 → 充电上限。先核对当前版本，其他版本的菜单待核实。', '这里的充电上限是充电设置，不是电池最大容量或健康百分比，也不能证明电池是否原装；不要为验机修改设置。'], source: 'https://bbs.vivo.com.cn/newbbs/thread/38407749' });
  if (brand === 'google' && /^pixel\s*9(?:\s+pro(?:\s+xl)?)?$/i.test(modelName)) guides['核对型号与存储'] = [{ title: `${modelName}：核对销售渠道`, steps: ['Google 当前商店页面列出的该型号商店购买地区不含中国大陆；这是商店渠道信息，不能单凭它判断所有销售渠道或实机真假。', '如卖家声称国行，请取得可核对的购买凭证并向官方确认销售地、服务及保修；相关国行适用性仍待核实。'], source: 'https://support.google.com/store/answer/2462844' }];
  if (brand === 'realme') {
    guides['确认账号锁定'].push({ title: 'realme：远程抹除后的账号验证', steps: ['realme 官方常见问题描述：在满足查找手机功能条件并执行远程抹除后，重新激活需要欢太账号密码。此说明针对该情形；本型号及当前系统适用性待核实。', '验机不需要执行远程抹除或登录他人账号；若交付时出现账号验证，由原持有人自行处理。抹除会清除数据，不索取密码或验证码。'], source: 'https://www.realme.com/support/faq' });
    guides['核对保修与维修凭据'].push({ title: 'realme 既有保障服务查询', steps: ['由原持有人在 realme 官网 → 服务 → 保障服务查询，按提示自行输入 IMEI 查询已有保障服务；具体支持的型号与结果以官网为准。', '该查询针对保障服务，不能单凭结果判断全部标准保修；结合购机凭证向官方核对，不要在本工具输入完整 IMEI 或验证码。'], source: 'https://www.realme.com/cn/support/care-plus-item' });
    guides['核对保修与维修凭据'].push({ title: 'realme 国行：售后渠道变化', steps: ['OPPO 官方公告称真我手机自 2026 年 4 月 1 日起接入 OPPO 自有服务体系。若原查询渠道不可用，可由持有人通过 OPPO 官方服务中心咨询本机保修与可提供的维修工单。', '渠道整合不证明既往记录已全部迁移，也不证明本机仍在保；具体型号、维修历史和保障条件需结合购机及维修凭据向官方核对。不要提供账号密码或验证码给卖家。'], source: 'https://support.oppo.com/cn/self-service/#/articleDetail?aid=2283509' });
  }
  if (brand === 'sony' && /^xperia\s*(?:1\s*vi|1\s*v|5\s*v)$/i.test(modelName)) {
    const notListed = /^xperia\s*1\s*vi$/i.test(modelName);
    guides['核对型号与存储'] = [{ title: `${modelName}：中国大陆销售记录`, steps: [notListed ? '索尼中国的联保型号对照表将 Xperia 1 VI 的中国大陆列为 X。卖家若称国行，请先向索尼中国核实购买渠道及保修，不能仅凭机型名称确认。' : '索尼中国的联保型号对照表将此型号的中国大陆列为 ○；个别二手机的实际购买地和保修仍应凭发票向官方核实。', '当前 Android 版本及本机四项检查入口仍以实机和官方核实为准。'], source: 'https://www.sony.com.cn/content/casch/serviceinfo/servicepolicy.html' }];
  }
  const sonyManual = brand === 'sony' ? ({
    'xperia 1 v': ['XQ-DQ72', 'xperia-1m5'],
    'xperia 5 v': ['XQ-DE72', 'xperia-5m5']
  } as Record<string, [string, string]>)[modelName.toLowerCase()] : undefined;
  if (sonyManual) {
    const [deviceCode, manualPath] = sonyManual;
    const manual = `https://helpguide.sony.net/mobile/${manualPath}/v1/zh-cn/contents/`;
    guides['核对型号与存储'].push({ title: `${modelName}：查看型号和系统`, steps: [`索尼 ${deviceCode} 的 Android 13 中文指南：设置 → 关于手机；在“型号”和“版本号”核对实机信息。`, '系统或应用更新后界面可能变化。型号代码或中文指南不能单独证明这台设备为国行；请结合购机凭证向索尼中国核实。'], source: `${manual}about_help_guide.html` });
    guides['查看电池与维修记录'].push({ title: `${modelName}：电池保养与健康度`, steps: [`索尼 ${deviceCode} 的 Android 13 中文指南列出：设置 → 电池 → 电池保养；系统更新后入口可能变化。`, '该页面中的 80% 或 90% 是充电上限，不是电池健康百分比。健康百分比入口仍待核实；不要为验机修改卖家的设置。'], source: `${manual}battery_care.html` });
  }
  const system = brand === 'iqoo' ? iqooSystems[modelName.toLowerCase()] : extraSystems[brand]?.[modelName.toLowerCase()];
  if (system) guides['查看电池与维修记录'].push({ title: `${modelName}：国行系统资料`, steps: [`官方资料列出 ${system[0]}；二手机当前系统可能已更新，请在设置中核对。`, '产品资料不能证明当前电池健康和维修状态。'], source: system[1] });
  return guides;
}
