import type { Device } from './catalog';
import { findModelEvidence } from './model-evidence';
import { oppoBatteryEvidence } from './oppo-battery-evidence';

export type AdditionalBrand = 'xiaomi' | 'oppo' | 'vivo' | 'samsung' | 'lenovo' | 'asus';
type Guide = { title: string; steps: string[]; source: string; sourceLabel?: string };
type Guides = Record<string, Guide[]>;

// 这里只记录三星中国支持页实际列出的手册目录，不推断出厂版本或目录内步骤。
const samsungManuals: Record<string, { code: string; versions: string; source: string }> = {
  'galaxy s24 ultra': { code: 'SM-S9280', versions: 'Android 14、15、16', source: 'https://www.samsung.com.cn/support/model.SM-S9280ZKPCHC/' },
  'galaxy s24+': { code: 'SM-S9260', versions: 'Android 14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-S9260ZVDCHC/' },
  'galaxy s24': { code: 'SM-S9210', versions: 'Android 15、16', source: 'https://www.samsung.com.cn/support/model/SM-S9210ZKDCHC/' },
  'galaxy s25 ultra': { code: 'SM-S9380', versions: 'Android 15、16', source: 'https://www.samsung.com.cn/support/model.SM-S9380ZBWCHC/' },
  'galaxy s25+': { code: 'SM-S9360', versions: 'Android 15、16', source: 'https://www.samsung.com.cn/support/model.SM-S9360DBDCHC/' },
  'galaxy s25': { code: 'SM-S9310', versions: 'Android 15、16', source: 'https://www.samsung.com.cn/support/model/SM-S9310DBGCHC/' },
  'galaxy s23 ultra': { code: 'SM-S9180', versions: 'Android 13、14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-S9180ZEDCHC/' },
  'galaxy s23+': { code: 'SM-S9160', versions: 'Android 13、14、15、16', source: 'https://www.samsung.com.cn/support/model.SM-S9160ZGDCHC/' },
  'galaxy s23': { code: 'SM-S9110', versions: 'Android 13、14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-S9110LIGCHC/' },
  'galaxy z fold6': { code: 'SM-F9560', versions: 'Android 14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-F9560ZWGCHC/' },
  'galaxy z flip6': { code: 'SM-F7410', versions: 'Android 14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-F7410LGECHC/' },
  'galaxy z fold5': { code: 'SM-F9460', versions: 'Android 13、14、15、16', source: 'https://www.samsung.com.cn/support/model/SM-F9460ZEHCHC/' },
  'galaxy z flip5': { code: 'SM-F7310', versions: 'Android 13、14', source: 'https://www.samsung.com.cn/support/model.SM-F7310LGECHC/' }
};

const windowsBattery: Guide = {
  title: 'Windows 笔记本电池报告',
  steps: ['先确认使用 Windows 10 或 11：按 Win + R，输入 cmd，回车后输入 powercfg /batteryreport；按终端显示的本机路径打开报告。该操作会生成本地文件，分享前请遮挡个人信息。', '查看 Installed Batteries 中的 DESIGN CAPACITY、FULL CHARGE CAPACITY；两者单位一致且设计容量大于 0 时，可用满充容量 ÷ 设计容量估算比例。CYCLE COUNT 仅在设备提供时显示。', '比例和循环次数只是参考，不能证明电池原装；缺失或无效时记为未知。其他系统不要套用此命令。'],
  source: 'https://consumer.huawei.com/cn/support/content/zh-cn00792538/'
};
const windowsAccount: Guide = {
  title: 'Windows 账号与组织管理',
  steps: ['Windows：设置 → 账户 → 访问工作单位或学校，查看是否有组织账号；菜单名称可能随系统版本变化。', '组织账户、设备管理和固件密码需分别核实；没有显示组织账号不代表已解除所有管理。由原持有人和原组织处理，不要索要密码或自行断开账户。'],
  source: 'https://support.microsoft.com/zh-cn/windows/security/identity-signin/manage-user-accounts-in-windows'
};
const battery: Record<'xiaomi' | 'oppo' | 'vivo' | 'samsung', Guide> = {
  xiaomi: { title: '小米 / Redmi 手机电池', sourceLabel: '前往官方服务', steps: ['在设置中查看电池相关页面是否提供最大容量；国行具体型号及系统的健康度入口待核实。', '找不到健康或最大容量时记为未知；当前电量和充电保护设置不能代替健康度，也不能单凭数值证明电池原装。'], source: 'https://www.mi.com/service/' },
  oppo: { title: 'OPPO 手机电池', steps: ['先在设置中查看当前 ColorOS 版本，再查看电池页面是否提供“最大电池容量”；OPPO 官方将其描述为相对于新电池的容量。本机型号及当前系统的入口和显示条件待核实。', '若显示“获取失败”或没有相应数据，健康度记为未知；OPPO 建议获取失败时到官方服务中心检测。电池容量只是参考，充电保护开关和当前电量不是健康度，也不能单凭数值判断电池原装。'], source: 'https://support.oppo.com/cn/self-service/#/articleDetail?aid=2174837' },
  vivo: { title: 'vivo 手机电池', steps: ['部分机型可在设置 → 电池 → 电池健康与充电或更多设置查看最大容量；也可尝试 i管家 → 手机管理 → 推荐工具 → 手机健康。菜单和支持情况依机型、系统而异。', '没有最大容量时记为未知，不要把当前电量当成健康度；数值不能单独证明电池原装。'], source: 'https://bbs.vivo.com.cn/newbbs/thread/38063102' },
  samsung: { title: '三星国行手机电池诊断', steps: ['三星中国的说明：打开盖乐世社区 → 售后 → 手机诊断，选择电池状态；菜单会随机型、系统或应用版本变化。', '诊断结果可能是状态而非健康百分比；没有该选项时记为未知，可咨询三星官方服务。诊断结果不能单独证明电池原装。'], source: 'https://www.samsung.com.cn/support/mobile-devices/how-to-check-the-battery-status-on-your-samsung-galaxy-phone/' }
};
const account: Record<'xiaomi' | 'oppo' | 'vivo' | 'samsung', Guide> = {
  xiaomi: { title: '小米账号与激活锁', steps: ['由原持有人查看设置 → 小米账号 → 查找 → 右上角“…” → 本机查找设置；不同系统菜单可能不同，请持有人按官方流程处理。', '退出账号不一定证明设备可供新用户激活；若激活时要求原账号，由原持有人处理。不要索取密码或验证码，抹除数据由所有者决定并操作。'], source: 'https://i.mi.com/guide/zh-CN/find/disable' },
  oppo: { title: 'OPPO 账号与查找手机', steps: ['请原持有人在设置中确认 OPPO 账号及查找手机状态，并按实际 ColorOS 版本的官方流程处理。菜单因型号和系统不同而异。', '退出账号不等于已经验证可重新激活；如设备要求原账号，请原持有人处理。不要索取密码或验证码；重置会清除数据，由所有者决定并操作。'], source: 'https://www.oppo.com/content/dam/oppo/file/pdf/ColorOS%2011%E5%AE%89%E5%85%A8%E6%8A%80%E6%9C%AF%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf' },
  vivo: { title: 'vivo 账号与查找设备', steps: ['由原持有人查看设置 → 安全（或安全与隐私）→ 查找 → 查找设备；此为 vivo 官方通用入口，机型、系统和地区不同可能有差异。', '请原持有人处理账号与查找设备；如果激活时要求原账号，由原持有人处理。不要索取密码或验证码；重置可能清除数据，由所有者决定并操作。'], source: 'https://bbs.vivo.com.cn/newbbs/thread/36945416' },
  samsung: { title: '三星及系统账号', steps: ['由原持有人查看设置 → 三星账户 → 查找我的手机；名称与入口可能随 One UI 和型号变化。按官方指引处理账户及查找功能。', '同时核对实机其他账号及重置后的设备保护；退出某个账号不代表所有锁定都已解除。不要索取密码或验证码，重置由所有者决定并操作。'], source: 'https://www.samsung.com.cn/support/apps-services/what-is-finding-my-phone/' }
};
const service: Record<AdditionalBrand, Guide[]> = {
  xiaomi: [{ title: '小米电子保修卡', steps: ['由持有人在小米官方电子保修卡页面按提示查询并核对商品与购买凭证；部分机型或地区可能不支持。', '不要在本工具输入完整 IMEI、序列号或验证码。保修结果、标签或包装一致均不能单独证明整机及配件真伪。'], source: 'https://chat.kefu.mi.com/page/warrantyCard/' }, { title: '小米商城设备权益', steps: ['由持有人在小米商城 App 查看其账号下的“我的设备”，确认能否看到保修期限、激活期限及已有保障；此功能可能涉及个人信息和隐私提示，由持有人自行决定是否使用。', '对照购机凭证及官方最终核定；购买记录或保障记录不能证明没有维修，也不要为验机购买额外服务。'], source: 'https://www.mi.com/article/detail/e247a1d1df1d.html' }, { title: '小米维修记录', steps: ['请原持有人查看小米商城 → 售后服务 → 服务记录，或提供官方售后服务单；查询不到时可由持有人咨询小米官方。', '该记录可能只对应持有人账户或部分官方服务，并非设备完整维修史；第三方维修可能未收录。'], source: 'https://www.mi.com/service/aftersale/list' }],
  oppo: [{ title: 'OPPO 保修与产品信息', steps: ['请持有人在 OPPO 官方“真伪及保修权益查询”页面自行输入设备编码，核对型号、保修及购买凭证；向他人展示时遮挡完整编码。', '官方查询信息只是判定真伪的参考之一，最终保修需结合凭证和官方核实。'], source: 'https://support.oppo.com/cn/check/' }, { title: 'OPPO 电子保修卡', steps: ['若已安装“我的 OPPO”，可由持有人打开 → 我的（常用服务）→ 电子保修卡（真伪查询）；页面及可查询情况因机型和版本而异。', '电子保卡与购买凭证、实机型号应一并核对；查不到或未显示记录不代表无保修或没有维修。'], source: 'https://support.oppo.com/cn/answer/?aid=SI2105098' }, { title: 'OPPO 服务记录', steps: ['由持有人打开 OPPO 官方服务记录入口，按页面提示自行查询；不要索取账号密码或验证码。', '可查历史时长、记录范围和本型号适用性待核实；未查到不代表没有维修，第三方维修可能未收录。'], source: 'https://support.oppo.com/cn/app0/repair-record/?isFromHome=true&isHideToolbar=true' }],
  vivo: [{ title: 'vivo 电子保修卡', steps: ['可由持有人在设置 → 系统管理或系统管理与升级 → 客户服务 → 电子保修卡查看已存在的凭证，核对有效期、购机凭证和设备；界面因系统而异。', '如尚未激活，不要为验机要求卖家激活或注册，必要时带购机凭证询问 vivo 官方。不要在本工具填写完整 IMEI 或验证码。'], source: 'https://www.vivo.com.cn/service/questions?categoryId=131' }, { title: 'vivo 服务记录', steps: ['由持有人打开 vivo 官网服务页 → 服务进度，按页面要求自行查询，或提供售后维修工单；手机号和账号由持有人自行使用。', '服务进度不是完整维修史；可见记录不一定包含全部历史或第三方维修，无记录不代表从未维修。'], source: 'https://www.vivo.com.cn/service.html' }],
  samsung: [{ title: '三星保修凭据', steps: ['由持有人通过三星中国服务中心页面或官方客服，结合购买发票、设备型号和序列号核对保修适用地区、期限及条件。', '手机激活日期不等于保修截止日；标签和查询结果也不能单独证明整机真伪。'], source: 'https://support-cn.samsung.com/support/ServiceLocations.html' }, { title: '三星维修结果单', steps: ['由持有人打开三星中国服务中心页面 → 维修结果单查询，按页面要求查询可见工单；必要时向原维修网点或官方服务中心咨询。', '查询通常依赖相应工单或持有人信息，不能覆盖全部第三方或历史维修；没有记录不代表从未维修。'], source: 'https://support-cn.samsung.com/support/ServiceLocations.html' }],
  lenovo: [{ title: '联想保修与出厂配置', steps: ['由持有人在联想官方服务网站输入主机编号，选择保修查询或配置查询，对照型号、购买凭证和当前配置；小新及 ThinkPad 的入口以官网显示为准。', '出厂配置不等于当前配置，升级、更换与维修需另行核实；查不到不代表设备为假。勿在本工具输入完整序列号。'], source: 'https://iknow.lenovo.com.cn/spider/detail/kd/26858' }, { title: '联想维修凭据', steps: ['请持有人通过“联想服务”小程序或官方服务渠道查询可见的维修进度，并提供维修工单；不要索取账号密码或验证码。', '维修进度与可提供的记录不一定包含全部历史；未查到不代表没有维修。'], source: 'https://m.lenovo.com.cn/wiki/article-49938.html' }],
  asus: [{ title: '华硕保修查询', steps: ['由持有人在华硕官方保修查询页面选择对应服务地区，按提示输入产品序号，核对结果与购买凭证。', '结果仅供参考，不证明所有部件原装；不要在本工具输入完整序列号。'], source: 'https://www.asus.com.cn/support/faq/1041323/' }, { title: '华硕 MyASUS 维修记录', steps: ['如设备已在持有人账号注册，可由持有人打开 MyASUS → 用户中心 → 我的产品，查看可用的维修历史和保修状态。', '不要求卖家提供账号密码；记录不一定包含全部维修，未显示不代表从未维修。'], source: 'https://www.asus.com.cn/support/faq/1045660/' }]
};

export function additionalGuides(brand: AdditionalBrand, device: Device, model: string): { guides: Guides; label?: string; mismatch: boolean } {
  const isPhone = brand === 'xiaomi' || brand === 'oppo' || brand === 'vivo' || brand === 'samsung';
  if (isPhone && device !== 'phone' || !isPhone && device !== 'laptop' && device !== 'desktop') return { guides: {}, mismatch: false };
  const labels: Record<AdditionalBrand, string> = { xiaomi: '小米 / Redmi', oppo: 'OPPO', vivo: 'vivo', samsung: '三星', lenovo: '联想', asus: '华硕' };
  const guides: Guides = { '核对保修与维修凭据': [...service[brand]] };
  const selectedModel = model.normalize('NFKC').trim();
  if (brand === 'xiaomi') guides['核对保修与维修凭据'].push({
    title: '小米延保：核对购买记录与转让条件',
    steps: ['若卖家承诺附带延长保修，请持有人提供已购服务订单及对应条款：小米这份延保条款列出线上订单可在小米商城 App → 我的订单查看，线下米家购买后可查看订单详情短信。请遮挡个人信息。', '小米这份延保条款写明该服务不得转让；其他保障产品的条件可能不同，是否适用于本机及二手转让请结合实际订单向官方核实。不要据此推断基础保修是否有效，也无需为验机购买服务。'],
    source: 'https://api.jr.mi.com/insurance/document/phone_accidentIns.html?couponFrom=rule&insuranceSku=49696'
  });
  if (brand === 'samsung') guides['核对保修与维修凭据'].push({
    title: '三星：核对设备激活日期',
    steps: ['由持有人打开三星中国“设备激活日期查询”页面，按提示自行填写 IMEI 或 MEID、序列号及验证码，核对首次激活时间与卖家描述。官网说明支持 2017 年 9 月后上市的手机，以及 2017 年 9 月后生产的 S8；本机实际可查性以页面结果为准。', '完整设备码及验证码不要提供给本工具或其他人。激活日期不等于保修截止日期，也不能单凭查询结果证明整机及部件原装；仍需结合购买凭证和官方服务核对。'],
    source: 'https://support-cn.samsung.com.cn/supportcn/imei/default.aspx'
  });
  if (isPhone) {
    guides['查看电池与维修记录'] = [battery[brand]];
    const supportedBattery = brand === 'oppo' ? oppoBatteryEvidence(selectedModel) : undefined;
    if (supportedBattery) guides['查看电池与维修记录'].push(supportedBattery);
    guides['确认账号锁定'] = [account[brand], { title: 'Google 设备保护（如适用）', steps: ['如果实机使用过 Google 账号，请原持有人确认该账号及设备保护状态；是否使用 Google 服务取决于地区、系统和设备配置。', '设备重置后可能要求验证原账号或屏幕锁。不要索取密码、验证码或尝试绕过；是否清除数据和重置由所有者决定并操作。'], source: 'https://support.google.com/android/answer/9459346?hl=zh-Hans' }];
    if (brand === 'oppo') guides['确认账号锁定'].push({
      title: 'OPPO：重置后出现查找手机锁',
      steps: ['OPPO 官方重置说明区分 ColorOS 13 及以上的操作，并提醒：若重置后出现“查找手机”锁定，激活需要对应手机账号且设备联网。该说明未逐一确认具体机型或每个版本的适用情况。', '请原持有人自行处理账号验证；如无法找回账号，可由持有人携购机凭证咨询 OPPO 官方服务中心。不要索取密码或验证码，不要为验机执行重置或抹除数据。'],
      source: 'https://gcss-robot.oppo.com/online/preview.html?sign=Y2FyZElkPTM4OSZyb2JvdElkPTEmdGVuYW50Q29kZT1vcHBv'
    });
    if (brand === 'xiaomi' && /^xiaomi\s*15$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'Xiaomi 15：区分电池健康和充电上限', sourceLabel: '前往官方服务', steps: ['该型号国行、当前系统的电池健康入口待核实；请先查看实机电池设置或咨询官方。', '充电上限不是电池最大容量，不要为了验机更改卖家的设置。'], source: 'https://www.mi.com/service/' });
    if (brand === 'xiaomi' && /^xiaomi\s*15\s*ultra$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'Xiaomi 15 Ultra：中国大陆版标称容量', steps: ['请先核对购买地区和具体版本。小米中国大陆产品资料列出典型容量 6000mAh、额定容量 5860mAh；标称值不是当前健康度。', '若卖家声称为国行，可将此作为核对线索；实际机型、生产批次、系统或更换情况仍需查凭证及向官方核实。'], source: 'https://www.mi.com/prod/xiaomi-15-ultra' });;
    if (brand === 'xiaomi' && /^redmi\s*k70\s*pro$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'Redmi K70 Pro：电池保护与健康度', steps: ['小米官方介绍 K70 Pro 搭载澎湃电池管理系统和电池健康 3.0；先在设置 → 电池中查看当前系统是否提供最大容量或电池状态，具体界面以实机为准。', '官方所称“电池健康 3.0”是电池管理技术名称，不是该机的健康百分比；如只看到电量或充电保护状态，健康度仍记为未知。'], source: 'https://www.mi.com/redmi-k70-pro' });
    if (brand === 'xiaomi' && /^xiaomi\s*mix\s*(?:fold\s*4|flip)$/i.test(selectedModel)) guides['核对保修与维修凭据'].push({ title: 'Xiaomi MIX Fold 4 / MIX Flip：保障权益', steps: ['先核对是 MIX Fold 4 还是 MIX Flip。小米针对这两款 MiCare 的说明提到，使用澎湃 OS 的设备可在设置 → 我的设备 → 保修期查看相关入口；不同系统版本及地区以实机为准。', '该入口可能展示购买服务的信息，验机时仅核对既有保障和有效凭证，不需要购买、激活或登记；服务能否随二手转让应由持有人向官方确认。'], source: 'https://api.jr.mi.com/insurance/document/phone_accidentIns_id.html?from=local&id=4836962127531503616' });
    if (brand === 'oppo' && /^oppo\s*reno\s*13$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'OPPO Reno13：先核对实际系统', steps: ['OPPO 中国 Reno13 产品页面列出 ColorOS 15；二手机可能已升级，先到设置 → 关于本机或关于设备查看实际版本与型号，不把 Reno13 Pro 当作标准版。', '按上方 OPPO 通用电池步骤查看实机有没有最大容量；目前没有核实 ColorOS 15 的该机专用健康百分比入口，未显示记为未知。'], source: 'https://www.oppo.com/cn/smartphones/series-reno/reno13/' });
    if (brand === 'oppo' && /^oppo\s*reno\s*14$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'OPPO Reno14：核对标准版与系统', steps: ['OPPO 中国的标准版规格标识为 Reno14、入网型号 PLA110，出厂页面列有 ColorOS 15.0；请在实机设置 → 关于本机查看型号和当前系统，勿把 Pro 或其他地区版本视为相同。', '电池健康按上方通用方法检查；官方产品规格不能证明实机仍运行出厂系统，也不能证明电池原装。'], source: 'https://www.oppo.com/cn/smartphones/series-reno/reno14/specs/' });
    if (brand === 'oppo' && /^oppo\s*reno\s*14\s*pro$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'OPPO Reno14 Pro：确认当前系统', steps: ['OPPO 中国的 Reno14 Pro 产品资料列有 ColorOS 15；实机可能已更新或属于其他地区，先在设置 → 关于本机查看完整型号和当前版本。', '按 OPPO 通用方法查看实机能否显示最大容量，缺失记为未知；出厂参数不是当前电池健康度。'], source: 'https://www.oppo.com/cn/smartphones/series-reno/reno14-pro/' });
    if (brand === 'vivo' && /^vivo\s*x200$/i.test(selectedModel)) {
      guides['确认账号锁定'].push({ title: 'vivo X200：查找设备位置', steps: ['vivo X200 官方使用手册将“查找”及“查找设备”列在“设置 → 安全”章节，由持有人查看状态。手册链接带有 Android 15 参数，但正文提示仅适用于该机最新系统；不能据此保证所有 Android 15 版本相同，实机菜单待核实。', '由原持有人处理账号和查找设备，再按交易约定确认能否供新用户设置；状态关闭本身不证明所有锁都已解除。'], source: 'https://m.vivo.com.cn/instructions/index?modelName=PD2415&pageId=277625&modelNameExt=vivo%20X200&androidVersion=15.0&funtouchVersion=15.0&scrollTop' });
      guides['核对保修与维修凭据'].push({ title: 'vivo X200：电子保修卡', steps: ['vivo X200 官方手册的“系统管理与升级 → 客户服务”章节提及电子保修卡；由持有人在设置中查看已有凭证。手册说明面向该机最新系统，本机菜单与版本需核实。', '查看时核对购买凭证和官方显示的保障信息；没有电子保修卡不代表没有保修，不要求持有人为验机注册或激活。'], source: 'https://m.vivo.com.cn/instructions/index?modelName=PD2415&pageId=277624&modelNameExt=vivo%20X200&androidVersion=15.0&funtouchVersion=15.0&scrollTop' });
    }
    if (brand === 'vivo' && /^vivo\s*x200\s*pro$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'vivo X200 Pro：先确认系统版本', steps: ['国行 X200 Pro 出厂规格列为基于 Android 15 的 OriginOS 5；二手机可能已经更新或是其他地区版本，先在设置中查看实际系统版本。', '电池最大容量按上方 vivo 通用路径检查；官方通用说明仅称部分机型支持，未显示则记为未知，不凭出厂版本推断。'], source: 'https://m.vivo.com.cn/vivo/param/x200pro' });
    if (brand === 'vivo' && /^vivo\s*x100(?:\s*pro)?$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'vivo X100 / X100 Pro：核对系统版本', steps: ['vivo 官方资料将 X100 和 X100 Pro 的出厂系统列为基于 Android 14 的 OriginOS 4；二手机可能已更新，先确认实际系统，勿将 Pro 的配置直接套给标准版。', '在设置 → 电池 → 电池健康与充电或更多设置中查找最大容量；该路径为 vivo 部分机型的通用说明，找不到时记为未知。维修与保修仍需按官方入口查询。'], source: 'https://www.vivo.com.cn/service/questions/all?categoryId=158&questionId=1450' });
    if (brand === 'vivo' && /^vivo\s*x\s*fold\s*3(?:\s*pro)?$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'vivo X Fold3 / Pro：区分机型与系统', steps: ['先核对是 X Fold3 还是 X Fold3 Pro。vivo 对两款机型的资料均列出 OriginOS 4；实机可能已升级或使用其他地区系统。', '该系列的设置 → 电池 → 长续航模式是省电设置，不是电池健康百分比。通过上方 vivo 电池通用入口查看是否有最大容量；未显示就记为未知。'], source: 'https://www.vivo.com.cn/service/questions/all?categoryId=158&questionId=1597' });
    if (brand === 'samsung' && /^galaxy\s*s(?:24|25)(?:\s*(?:ultra|\+))?$/i.test(selectedModel)) guides['查看电池与维修记录'].push({ title: 'Galaxy S24 / S25：Samsung Members 诊断', steps: ['国行优先按上方三星中国的盖乐世社区步骤检查；该型号及当前 One UI 的具体菜单和支持情况仍需以实机确认。', '结果可能是状态而不是健康百分比；不要索取账号密码，也不要将充电上限当作电池健康度。'], source: 'https://www.samsung.com.cn/support/mobile-devices/how-to-check-the-battery-status-on-your-samsung-galaxy-phone/' });
    if (brand === 'samsung') guides['查看电池与维修记录'].push({ title: '三星设备维护诊断：系统条件', steps: ['三星中国说明：运行 Android 12 或更高版本的 Galaxy 设备，可尝试设置 → 设备维护 → 诊断 → 手机诊断；具体菜单和本型号支持情况以实机为准。', '可选择电池相关项目查看状态；诊断状态不是电池健康百分比，找不到对应功能时记为待核实。'], source: 'https://www.samsung.com.cn/support/mobile-devices/check-device-status-and-run-diagnostics-samsung-galaxy/' });
    const samsungManual = brand === 'samsung' ? samsungManuals[selectedModel.toLowerCase()] : undefined;
    if (samsungManual) guides['核对型号与存储'] = [{ title: `${selectedModel}：型号和手册目录`, steps: [`三星中国支持页列出的型号为 ${samsungManual.code}，手册目录包含 ${samsungManual.versions}；这不代表二手机当前运行这些版本。`, '请持有人在设置 → 关于手机核对型号，并查看实际系统版本；型号或手册目录不能单独证明销售地。电池健康、维修记录、账号锁和保修的具体型号与版本适用性仍待核实。'], source: samsungManual.source }, { title: '三星：查看手机型号', steps: ['三星通用说明：设置 → 关于手机可查看型号；界面可能随设备与软件版本变化。', '展示截图时遮挡完整序列号、IMEI 和手机号。'], source: 'https://www.samsung.com.cn/support/mobile-devices/how-to-find-phone-model-number-serial-number-or-imei-number/' }];
    if (brand === 'samsung' && /^\s*(?:samsung\s+)?galaxy\s*z\s*(?:fold|flip)/i.test(model)) guides['核对外观与配件'] = [{ title: 'Galaxy Z Fold / Flip 折叠屏', steps: ['在卖家同意且设备无明显损坏时，轻柔打开查看内外屏、折痕附近和铰链是否有裂痕、漏液或显示异常，与商品描述核对。', '不要用指甲或硬物按压屏幕、撕除保护层或用力开合；轻微折痕本身不等于故障。'], source: 'https://www.samsung.com.cn/support/mobile-devices/what-is-the-foldable-display-and-protective-film-on-my-smartphone/' }];
  } else {
    guides[device === 'laptop' ? '确认账号锁定' : '核对账号和组织管理'] = [windowsAccount];
    if (device === 'laptop') {
      guides['查看电池信息'] = [windowsBattery];
      if (brand === 'asus') guides['查看电池信息'].push({ title: '华硕 MyASUS 电池诊断', steps: ['如设备支持并已安装 MyASUS，可打开 MyASUS → 系统诊断，查看是否有电池问题诊断；选项依机型和版本而异。', '诊断结果不等于完整电池寿命评估；如果找不到该功能，保持未知并咨询官方。'], source: 'https://www.asus.com.cn/support/faq/1012793/' });
      if (brand === 'lenovo' && /^thinkpad\s*t14(?:\s+gen\s*\d+)?$/i.test(selectedModel)) guides['查看电池信息'].push({ title: 'ThinkPad T14：先核对代数', steps: ['T14 有多个代次，先请卖家提供完整型号与代数；联想针对 T14 Gen 2 的官方资料提到 Lenovo Vantage → My Device → Power View → See Battery Details，界面语言和版本可能不同。', '其他代次或找不到该入口时，以本机显示和官方支持为准，也可使用上面的 Windows 电池报告；不要仅凭软件数值认定电池原装。'], source: 'https://support.lenovo.com/no/nb/solutions/ht512607' });
      if (brand === 'lenovo' && /^thinkpad\s*e14(?:\s+gen\s*\d+)?$/i.test(selectedModel)) guides['查看电池信息'].push({ title: 'ThinkPad E14：确认代数与充电阈值', steps: ['先确认 E14 的完整代数；联想 E14 Gen 6 的英文手册提到 Vantage 中可以设置电池充电阈值，其他代次、系统或界面未必相同。', '低于 100% 停充可能与阈值有关，阈值不是电池健康百分比；无需修改设置。健康情况可结合上面的 Windows 电池报告及维修凭证核对。'], source: 'https://support.lenovo.com/kr/ko/documentation/SG10277/Use_the_TrackPoint_Quick_Menu?language=en' });
      if (brand === 'lenovo' && /^(?:小新\s*pro\s*14|拯救者\s*y9000p)$/i.test(selectedModel)) guides['核对保修与维修凭据'].push({ title: '小新 / 拯救者：出厂配置与保修', steps: ['小新 Pro 14 和拯救者 Y9000P 有不同年份与配置。请持有人在联想官方服务网站按主机编号选择保修查询或配置查询，再与当前系统信息和卖家承诺对照。', '原厂配置只能作为出厂参考，内存或硬盘可能后来升级；询问更换与维修凭证，不要仅凭差异认定造假。'], source: 'https://newsupport.lenovo.com.cn/commonProblemsDetail.html?noteid=182870' });
      if (brand === 'asus' && /^天选\s*5$/i.test(selectedModel)) guides['查看电池信息'].push({ title: '天选 5：MyASUS 功能按实机确认', steps: ['先确认电脑实际运行 Windows 且有 MyASUS，再查看系统诊断中是否提供电池测试；此处使用华硕通用说明，未核实所有天选 5 配置均有该功能。', '若没有对应选项，使用 Windows 电池报告或咨询华硕服务中心，结果记为待核实。'], source: 'https://www.asus.com.cn/support/faq/1012793/' });
      if (brand === 'asus' && /^天选\s*4$/i.test(selectedModel)) guides['核对保修与维修凭据'].push({ title: '天选 4：先核对完整机器代号', steps: ['天选 4 存在不同配置。Windows 10/11 可在已安装的 MyASUS → 系统信息中查看设备型号，和机身标签及卖家描述核对；软件界面依版本而异。', '由持有人用完整型号与序列号查询适用保修并提供维修凭证；仅凭“天选 4”名称不能确定具体保障，也不要在本工具输入完整序列号。'], source: 'https://www.asus.com.cn/support/faq/1030673/' });
      if (brand === 'asus' && /^灵耀\s*14(?:\s*2024|\s*\(?ux3405\)?)?$/i.test(selectedModel)) guides['查看电池信息'].push({ title: '灵耀 14：核对年份和机器代号', steps: ['先核对是否为灵耀 14 2024 款 UX3405；“灵耀 14”有多代。华硕该型号规格列有 MyASUS 的系统诊断与电池健康充电，并注明仅针对 Windows 11 进行兼容性测试。', '“电池健康充电”是充电管理功能，不等于电池剩余健康百分比；实际选项依配置和系统为准。'], source: 'https://www.asus.com.cn/laptops/for-home/zenbook/asus-zenbook-14-oled-ux3405/techspec/' });
      if (brand === 'asus' && /^无畏\s*14$/i.test(selectedModel)) guides['查看电池信息'].push({ title: '无畏 14：核对机器代号', steps: ['无畏 14 有多个代次。华硕 X1407Q 产品资料介绍了 MyASUS 电池健康管理；请先按系统信息和标签核对是否为该代号，其他版本的功能待核实。', '资料中的 80% 为充电管理设置而非电池健康度。仅查看不更改设置，电池容量可结合 Windows 报告及维修凭证核对。'], source: 'https://www.asus.com.cn/laptops/for-home/vivobook/asus-vivobook-14-x1407q/' });
    }
  }
  const evidence = findModelEvidence(device, brand, selectedModel);
  if (evidence) {
    // 只扩展本次结果，避免改动共享的品牌指南或污染后续型号。
    const addNote = (key: string, index: number, note: string) => {
      const item = guides[key]?.[index];
      if (item) guides[key][index] = { ...item, steps: [...item.steps, note] };
    };
    const batteryKey = device === 'phone' ? '查看电池与维修记录' : '查看电池信息';
    const accountKey = device === 'desktop' ? '核对账号和组织管理' : '确认账号锁定';
    if (device !== 'desktop') addNote(batteryKey, 0, `【${evidence.model}】本机地区和当前系统版本下是否提供电池健康入口及百分比待核实；先按以上步骤查找，未显示记为未知。`);
    addNote(accountKey, 0, `【${evidence.model}】该型号在实机地区和当前系统版本下的账号锁及组织管理具体页面待核实；请由原持有人按以上通用步骤核对。`);
    addNote('核对保修与维修凭据', 0, `【${evidence.model}】该型号和销售地区的保修查询适用性待核实；按以上官方渠道结合凭证确认。`);
    const repairIndex = service[brand].length - 1;
    addNote('核对保修与维修凭据', repairIndex, `【${evidence.model}】该型号可查询的维修记录范围待核实；请持有人按以上渠道查询并提供工单，没有记录不代表没有维修。`);
    if (brand === 'lenovo' && /^ThinkBook\s*(?:14|16)\+$/i.test(selectedModel)) {
      guides['核对保修与维修凭据'].push({
        title: `${evidence.model}：核对分部件保修`,
        steps: ['联想 2023 年 ThinkBook 系列保修资料将电池和主要部件分别列示；不要把整机、主要部件和电池的保障范围当成完全相同。', '实际期限、服务类型、适用地区和具体机型以官方按机器查询结果及购买凭证为准；该资料不证明这台二手机仍在保修。'],
        source: 'https://think.lenovo.com.cn/htmls/other/detail_1684215300384.html'
      });
    }
    const target = device === 'desktop' ? '核对保修与维修凭据' : batteryKey;
    if (evidence.source) guides[target].push({
      title: `${evidence.model}：型号和系统资料`,
      steps: [evidence.identity, '资料仅用于核对型号或所标注的系统版本；当前系统、具体验机页面和功能支持情况均以实机与官方确认为准。', ...(device === 'desktop' ? ['台式机不适用笔记本电池健康检查。'] : [])],
      source: evidence.source
    });
    else addNote(target, 0, `【型号资料待核实】${evidence.identity}${device === 'desktop' ? ' 台式机不适用笔记本电池健康检查。' : ''}`);
  }
  return { guides, label: labels[brand], mismatch: false };
}
