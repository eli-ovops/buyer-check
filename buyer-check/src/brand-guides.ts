import { catalog, devices, type Device } from './catalog';
import { additionalGuides, type AdditionalBrand } from './other-brand-guides';
import { extraAndroidGuides, type AndroidExtraBrand } from './android-phone-guides';
import { huaweiPhoneSystem } from './huawei-phone-systems';

type Guide = { title: string; steps: string[]; source: string; sourceLabel?: string };
type Guides = Record<string, Guide[]>;
type Brand = 'apple' | 'huawei' | AdditionalBrand | AndroidExtraBrand;

const aliases: Record<Brand, string[]> = {
  apple: ['苹果', 'apple', '苹果 apple', 'apple 苹果'], huawei: ['华为', 'huawei', '华为 huawei', 'huawei 华为'],
  xiaomi: ['小米', 'xiaomi', '小米 xiaomi', '红米', 'redmi', '红米 redmi'], oppo: ['oppo'], vivo: ['vivo'],
  samsung: ['三星', 'samsung', '三星 samsung'], lenovo: ['联想', 'lenovo', '联想 lenovo'], asus: ['华硕', 'asus', '华硕 asus'],
  honor: ['荣耀', 'honor', '荣耀 honor'], oneplus: ['一加', 'oneplus', '一加 oneplus'], realme: ['真我', 'realme', '真我 realme'],
  iqoo: ['iqoo'], meizu: ['魅族', 'meizu', '魅族 meizu'], redmagic: ['努比亚', 'nubia', '努比亚 nubia'], sony: ['索尼', 'sony', '索尼 sony'], motorola: ['摩托罗拉', 'motorola', '摩托罗拉 motorola', 'moto'], google: ['谷歌', 'google', '谷歌 google']
};
const normalize = (value: string) => value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
const brandFor = (value: string): Brand | undefined => (Object.keys(aliases) as Brand[]).find(key => aliases[key].includes(normalize(value)));

const appleCoverage: Guide = {
  title: 'Apple 保修查询',
  steps: ['iPhone：设置 → 通用 → AppleCare 与保修 → 选择设备。Mac：苹果菜单 → 系统设置 → 通用 → AppleCare 与保修 → 选择设备。', '如果页面不可用，可由设备持有人通过 Apple 官方保障查询或支持渠道核对；保障信息不证明商品或配件真伪。'],
  source: 'https://support.apple.com/zh-cn/102607'
};
const huaweiCoverage: Guide = {
  title: '华为权益查询',
  steps: ['打开“我的华为”App → 服务 → 快捷服务 → 权益查询；按页面提示选择设备。', '也可由设备持有人在华为官网的保修期及权益查询页面操作。查询结果及发票应与设备核对，不要向本工具输入完整序列号。'],
  source: 'https://consumer.huawei.com/cn/support/content/zh-cn00697536/'
};
const huaweiRepairs: Guide = {
  title: '华为服务（维修）记录',
  steps: ['由设备持有人打开“我的华为”App → 我的 → 服务记录，查看可查询的近期记录。', '华为官方说明线上仅支持查询近 6 个月的服务记录；没有记录不代表没有维修。更早记录可由持有人咨询官方，第三方维修也可能不在记录中。', '如官网查询需要手机号或验证码，请持有人自行操作，不要索取验证码。'],
  source: 'https://consumer.huawei.com/cn/support/content/zh-cn15887303/'
};
const macRepairs: Guide = {
  title: 'Mac 部件与维修',
  steps: ['仅在搭载 Apple 芯片且使用 macOS Tahoe 26 或更高版本的 Mac 上：系统设置 → 通用 → 关于本机 → 部件与维修；支持的部件依机型而异。', '该入口仅在系统检测到符合条件的维修时显示；看不到入口不代表没有维修。“未知”等提示需要进一步核实。'],
  source: 'https://support.apple.com/zh-cn/123123'
};
const macLock: Guide = {
  title: 'Mac 账号锁',
  steps: ['请原所有者在系统设置中处理 Apple 账户与“查找我的 Mac”，并按 Apple 官方流程确认激活锁；不要索取密码。', '如果设备可能属于组织，还需由原组织确认设备管理状态；抹除数据由设备所有者决定和操作。'],
  source: 'https://support.apple.com/zh-cn/102541'
};
const huaweiLock: Guide = {
  title: '华为账号与查找设备',
  steps: ['HarmonyOS 5 及以上：由原所有者打开设置 → 华为账号 → 查找设备，按官方说明关闭本机的查找设备并处理账号。', '设备激活时若仍要求原账号，由原所有者处理；不要索取账号密码或验证码。重置会清除数据，须由所有者决定并操作。'],
  source: 'https://consumer.huawei.com/cn/support/content/zh-cn16010157/'
};
const huaweiOlderLock: Guide = {
  title: 'HarmonyOS 4.0 / 4.2 / 4.3：遇到激活锁时',
  steps: ['华为官方说明这些版本重置或登录时可能出现激活设备页面；如果要求原华为账号，应由原所有者按官方流程处理。', '可由原所有者登录华为云空间，在查找设备中选择本机并移除；需要验证原账号，不索取密码或验证码。设备是否已解除须在交付时核对。'],
  source: 'https://consumer.huawei.com/cn/support/content/zh-cn00448755/'
};

function classify(device: Device, brandInput: string, modelInput: string): { brand?: Brand; mismatch: boolean } {
  if (!['phone', 'laptop', 'desktop'].includes(device)) return { mismatch: false };
  const brand = normalize(brandInput);
  const model = normalize(modelInput);
  const selected = brandFor(brand);
  // Exact catalog matches avoid guessing the category of similarly named models.
  const matches = model ? devices.flatMap(({ id }) => catalog[id].filter(entry => entry.models.some(name => normalize(name) === model)).map(entry => ({ device: id, brand: brandFor(entry.name) }))) : [];
  const modelDevice = matches.length && matches.every(match => match.device === matches[0].device) ? matches[0].device : /^iphone(?:\s*\d|\s*se\b|\b)/.test(model) ? 'phone' : /^macbook/.test(model) ? 'laptop' : /^(?:mac\s*(?:mini|studio|pro)|imac)/.test(model) ? 'desktop' : /^(?:huawei\s*)?matebook/.test(model) ? 'laptop' : undefined;
  const modelBrand: Brand | undefined = matches.length && matches[0].brand && matches.every(match => match.brand === matches[0].brand) ? matches[0].brand : /^(?:iphone|macbook|mac\s*(?:mini|studio|pro)|imac)/.test(model) ? 'apple' : /^(?:huawei|matebook|mate\s*\d|pura|nova)/.test(model) ? 'huawei' : undefined;
  // Do not infer a brand from an unknown manual brand, or silently ignore conflicting selections.
  if (brand && !selected) return { mismatch: false };
  if (selected && modelBrand && selected !== modelBrand || modelDevice && device !== modelDevice) return { mismatch: true };
  return { brand: selected ?? modelBrand, mismatch: false };
}

export function brandGuides(device: Device, brandInput: string, modelInput: string): { guides: Guides; label?: string; mismatch: boolean } {
  const { brand, mismatch } = classify(device, brandInput, modelInput);
  if (!brand || mismatch) return { guides: {}, mismatch };
  if (brand === 'honor' || brand === 'oneplus' || brand === 'realme' || brand === 'iqoo' || brand === 'meizu' || brand === 'redmagic' || brand === 'sony' || brand === 'motorola' || brand === 'google') {
    if (device !== 'phone') return { guides: {}, mismatch: false };
    const labels: Record<AndroidExtraBrand, string> = { honor: '荣耀', oneplus: '一加', realme: 'realme', iqoo: 'iQOO', meizu: '魅族', redmagic: '努比亚', sony: '索尼', motorola: '摩托罗拉', google: '谷歌' };
    return { guides: extraAndroidGuides(brand, modelInput), label: labels[brand], mismatch: false };
  }
  if (brand !== 'apple' && brand !== 'huawei') return additionalGuides(brand, device, modelInput);
  const guides: Guides = {};
  const add = (item: string, ...entries: Guide[]) => { guides[item] = entries; };
  if (brand === 'apple' && device === 'phone') {
    const knownApplePhone = catalog.phone.find(entry => entry.name === '苹果 Apple')?.models.some(name => normalize(name).replace(/\s+/g, '') === normalize(modelInput).replace(/\s+/g, '')) ?? false;
    const generation = knownApplePhone ? modelInput.normalize('NFKC').match(/^iphone\s*(\d{1,2})(?!\d)/i) : null;
    const newer = generation ? Number(generation[1]) >= 15 : knownApplePhone && /^iphone\s*air$/i.test(modelInput.trim()) ? true : knownApplePhone && /^iphone\s*se\b/i.test(modelInput.trim()) ? false : undefined;
    const batteryPath = newer === true ? 'iPhone 15 及更新款：设置 → 电池 → 电池健康；iOS 17.4 及更高版本可查看最大容量和循环次数等。' : newer === false ? '先查看实机系统版本：iPhone 14 及更早款（含 SE）在 iOS 16.1 及以上可查看设置 → 电池 → 电池健康与充电；iOS 11.3 至 16.0.x 可查看设置 → 电池 → 电池健康。具体型号是否支持该系统、实际菜单和显示内容以实机为准。' : 'iPhone 15 及更新款：设置 → 电池 → 电池健康；iPhone 14 及更早款：设置 → 电池 → 电池健康与充电。旧系统菜单可能不同，请先核对型号与系统。';
    const cycleNote = newer === false ? '循环次数是否可查看取决于具体机型和系统，未显示则保持未知。' : 'iPhone 15 及更新款在适用系统中可能显示循环次数等信息，未显示则保持未知。';
    const repairCoverage = knownApplePhone && /^iphone\s*se\b/i.test(modelInput.trim()) ? 'Apple 对 iPhone SE 第 2、3 代的资料列出电池维修信息。' : generation && Number(generation[1]) === 11 ? 'Apple 对 iPhone 11 各款的资料列出电池和显示屏维修信息。' : newer === true || generation && Number(generation[1]) >= 12 ? 'Apple 对 iPhone 12 及更新机型的资料列出电池、显示屏、主板和前后摄像头；显示情况与系统、维修状况有关。' : '该型号适用的部件及系统版本待核实，不能按名称猜测。';
    add('核对型号与存储', {
      title: 'iPhone：检查运营商锁',
      steps: ['先查看实际 iOS 版本。Apple 对 iOS 14 及以上的说明：设置 → 通用 → 关于本机，查看“运营商锁”；显示“无 SIM 卡限制”表示运营商解锁。具体型号、地区与菜单显示以实机为准。', '若显示锁定到某个运营商，请卖家与该运营商确认是否可以解锁、费用与时间；无法查看或未确认时记为未知。不要自行抹除设备，也不要将运营商锁和 Apple 激活锁混为一谈。', '运营商解锁不代表该机一定支持你所在地区的网络频段、实体 SIM 或当地 eSIM，还需与目标运营商核对。'],
      source: 'https://support.apple.com/zh-cn/109316'
    });
    add('查看电池与维修记录', {
      title: 'iPhone 电池健康',
      steps: [batteryPath, `查看最大容量及是否建议维修。${cycleNote}数值不能单独证明电池原装。`],
      source: newer === false ? 'https://support.apple.com/zh-tw/104999' : 'https://support.apple.com/zh-cn/106348'
    }, {
      title: 'iPhone 部件与维修',
      steps: ['iOS 15.2 及更高版本：设置 → 通用 → 关于本机 → 部件与维修历史；是否出现取决于机型与维修情况。更早的系统可能只提示更换的部件是否被识别为未知，具体显示以实机为准。', repairCoverage, '核对显示的“正品”“未知”“未验证”“二手”或“完成维修”等状态；不同机型和系统的可见状态不同。“未知”原因不止一种，不要据此单独断定假件。', '如提示“完成维修”，请卖家说明更换和校准情况；未完成校准可能影响面容 ID 或触控 ID。不要为验机自行升级、重启或启动维修，由持有人和维修方按官方指引处理。', '同一部件多次维修可能仅显示最近一次，未显示记录不证明从未维修。'],
      source: 'https://support.apple.com/zh-cn/102658'
    }, {
      title: 'iPhone：电池提示如何判断',
      steps: [newer === true ? 'Apple 对使用 iOS 18 的 iPhone 15 及更新机型说明：在部件与维修历史中，电池可能显示“已使用”，表示该电池此前使用过或装在另一台 iPhone；具体显示以实机为准。' : 'Apple 对使用 iOS 18 的 iPhone 15 及更新机型说明：电池可能显示“已使用”；当前所选型号和系统是否支持此提示需以实机及官方资料为准。', '如果显示无法验证电池是否为正品，Apple 提醒电池健康信息可能不准确；请结合维修工单和官方检测，不能仅凭百分比认定电池原装。', '若显示“完成维修”，请持有人向维修方核对校准情况；不为验机自行执行维修或更改设备。'],
      source: 'https://support.apple.com/zh-cn/103269'
    }, {
      title: 'iPhone：部件可能另有激活锁',
      steps: ['如果“部件与维修”或维修助理提示部件被锁定至其他 Apple 账户，先请卖家说明更换来源，并由相关原持有人按 Apple 官方流程处理；不要索取他人密码。', 'Apple 指引部件原持有人在 iCloud.com/find 登录自己的账户，选择原设备并移除；原设备在线时移除选项可能不可用，如显示丢失状态需关闭丢失模式。操作涉及原设备与账户，由原持有人自行决定并完成。', 'Apple 提示未解锁的部件可能无法按预期工作，且该部件不符合 Apple 有限保修或 AppleCare 计划的服务条件；实际显示与型号、系统及维修情况有关。'],
      source: 'https://support.apple.com/zh-cn/120610'
    });
    if (generation && Number(generation[1]) >= 12 || knownApplePhone && /^iphone\s*air$/i.test(modelInput.trim())) {
      const supportsReusedFrontCamera = generation ? Number(generation[1]) >= 16 : true;
      guides['查看电池与维修记录'].push({
        title: 'iPhone：前置摄像头与面容 ID',
        steps: [
          '在设置 → 通用 → 关于本机 → 部件与维修历史中查看“原深感摄像头”或“面容 ID 问题”提示；实际显示取决于机型、系统和维修情况，未显示不能证明没有维修。',
          generation && Number(generation[1]) < 14 ? 'Apple 提示 iPhone 12 及更新机型可查看前置摄像头是否更换；面容 ID 问题可能有多种原因，未完成校准时面容 ID 可能不可用。请与卖家核对前置摄像头和面容 ID 功能及维修凭据，不为验机启动维修或恢复设备。' : 'Apple 提示 iPhone 14 及更新机型的前置摄像头更换后，如未完成维修或恢复设备，摄像头可能无法正常工作；面容 ID 也可能在校准前无法使用。请向卖家核对功能并索取可遮挡个人信息的维修凭据，不为验机自行启动维修或恢复设备。',
          supportsReusedFrontCamera ? 'Apple 说明 iPhone 16 及更新机型完成校准后，使用过的同型号前置摄像头可能显示“已使用”；该提示本身不能证明设备从未有其他维修。' : 'Apple 对 iPhone 16 及更新机型给出同型号二手前置摄像头的提示；所选旧机型不套用该结论，是否显示、维修记录和实际功能仍需核实。'
        ],
        source: 'https://support.apple.com/zh-cn/120567'
      });
    }
    add('确认账号锁定', { title: 'iPhone 激活锁', steps: ['开机或唤醒时若显示“iPhone 已与物主锁定”，说明仍受激活锁保护；请卖家处理，未解除前不要完成交易。不要索取对方密码或验证码。', '如交付时开始设置后要求原所有者账户，说明仍关联原账户；交由原所有者按 Apple 流程移除。仅看到“你好”说明设备已抹掉，不能代替完成后续设置和激活核对。', '请原所有者按 Apple 官方流程处理账户和激活锁；抹除会清除数据，须由所有者决定并操作。'], source: 'https://support.apple.com/zh-cn/108794' }, {
      title: 'iOS 26：核对“查找我的 iPhone”',
      steps: ['先核对实机系统。Apple 的 iOS 26 手册给出的入口为：设置 → 持有人姓名 → 查找 → 查找我的 iPhone；其他系统版本或实际界面可能不同。', '交付前由原持有人自行决定并按 Apple 流程处理，关闭时可能需要其账户密码；不要要求对方提供密码或验证码。仅查看开关状态不能证明交付后的激活、组织管理等限制均已解除。'],
      source: 'https://support.apple.com/zh-cn/guide/iphone/iph4a8b98f75/26/ios/26'
    }, {
      title: 'iPhone：查看组织设备管理',
      steps: ['Apple 指引可在设置 → 通用 → VPN 与设备管理中查看配置描述文件；具体菜单和当前系统、型号适用性以实机为准。', '如果存在公司或学校管理，要求卖家确认是否有权转让并由原组织处理；不要自行删除描述文件。未看到描述文件不证明设备在重新设置时不会再次进入组织管理。'],
      source: 'https://support.apple.com/zh-cn/guide/personal-safety/ips327569a75/web'
    });
    add('核对保修与维修凭据', { ...appleCoverage, steps: ['iPhone：设置 → 通用 → AppleCare 与保修 → 选择设备。', appleCoverage.steps[1]] }, {
      title: 'iPhone 购买地与跨地区保修',
      steps: ['请卖家提供购买地和可核对的购买凭证；所选“国行、港版、台版、美版、日版或欧版”仅是待核实的描述。欧版还应确认具体购买国家。', 'Apple 中国的说明区分中国大陆购买产品的相关保修政策与 Apple 有限保修，并提示服务可能限制在最初销售的国家或地区。境外购买不等于一定不能在大陆获得服务；请由持有人向 Apple 确认本机的保障、维修地点和条件。'],
      source: 'https://www.apple.com.cn/legal/statutory-warranty/'
    });
  } else if (brand === 'huawei' && device === 'phone') {
    add('核对型号与存储', { title: '华为：查看当前系统版本', steps: ['华为对部分 HarmonyOS 手机的说明为：从桌面打开设置，点击列表最上方的设备名称，进入关于本机查看软件版本。', '不同系统和型号的入口可能不同；找不到时在设置中搜索“关于手机”，仍未找到则记为待核实。'], source: 'https://consumer.huawei.com/cn/support/content/zh-cn16092083/' });
    add('查看电池与维修记录', { title: '华为手机电池健康', steps: ['设置 → 电池 → 更多电池设置（或电池健康）→ 最大容量。具体界面因设备和系统而异。', '若显示评估中、异常或无该项目，不要推断为 100% 或无问题；电池容量本身不能证明原装。'], source: 'https://consumer.huawei.com/cn/support/content/zh-cn15817608/' }, huaweiRepairs);
    add('确认账号锁定', huaweiLock, huaweiOlderLock);
    add('核对保修与维修凭据', huaweiCoverage);
    const modelSystem = huaweiPhoneSystem(modelInput);
    if (modelSystem) guides['查看电池与维修记录'].push(modelSystem);
    // 厂商条款明确列出的系列；不把系列证据扩大到其他手动输入型号。
    const knownHuawei = catalog.phone.find(entry => entry.name === '华为 HUAWEI')?.models.some(name => normalize(name) === normalize(modelInput));
    if (knownHuawei && /^(?:mate\s*(?:60|70|80)(?:\s|$)|pura\s*(?:70|80)(?:\s|$)|nova\s*(?:12|13|14|15)(?:\s|$))/i.test(modelInput.trim())) {
      guides['查看电池与维修记录'].push({ title: `${modelInput.trim()}：官方系列电池入口`, steps: ['华为保障条款针对该系列列出设置 → 电池 → 电池健康 → 最大容量。先查看当前系统；如果页面不同或没有显示，请记为待核实。', '这是系列级说明，未逐一说明所有系统版本。数值和截图不能证明电池原装；不需要为验机购买保障服务。'], source: 'https://consumer.huawei.com/cn/support/huawei-care/disclaimer/' });
    }
    if (knownHuawei && ['mate x5', 'mate x6', 'mate x7', 'pura x'].includes(normalize(modelInput))) {
      guides['核对保修与维修凭据'].push({
        title: `${modelInput.trim()}：核对折叠屏保障`,
        steps: ['如果卖家声称附带华为 Care+ 意外无忧，请核对原合同、保障期限和剩余次数，并由持有人向官方确认转让后是否适用。', '华为一年期条款对该型号的内屏和外屏分别规定保障及维修服务费；有保障不等于免费维修。具体保障版本、损坏情况和费用以合同及官方核定为准，不需要为验机购买。'],
        source: 'https://consumer.huawei.com/cn/support/huawei-care/disclaimer/'
      });
    }
  } else if (brand === 'apple') {
    if (device === 'laptop') add('查看电池信息', { title: 'MacBook 电池健康与循环', steps: ['苹果菜单 → 系统设置 → 电池 → 电池健康；旧系统菜单可能不同。', '按住 Option 并点按苹果菜单 → 系统信息 → 硬件 → 电源，查看电池信息里的循环计数。单一数值不能证明电池原装。'], source: 'https://support.apple.com/zh-cn/102888' });
    add(device === 'laptop' ? '确认账号锁定' : '核对账号和组织管理', macLock);
    add('核对保修与维修凭据', macRepairs, { ...appleCoverage, steps: ['Mac：苹果菜单 → 系统设置 → 通用 → AppleCare 与保修 → 选择设备。', appleCoverage.steps[1]] });
  } else {
    if (device === 'laptop') add('查看电池信息', { title: '华为 Windows 笔记本', steps: ['先确认操作系统。Windows 10/11：按 Win + R，输入 cmd 并打开；输入 powercfg /batteryreport 后按回车，按显示的路径打开本机报告。', '报告中 Installed Batteries → CYCLE COUNT 为循环次数（如设备提供）。该操作会生成本地报告，注意遮挡个人信息；未显示不代表无问题。'], source: 'https://consumer.huawei.com/cn/support/content/zh-cn00698549/' }, { title: 'Windows 电池容量如何理解', steps: ['在报告中查看 DESIGN CAPACITY（设计容量）和 FULL CHARGE CAPACITY（满充容量）；两项有数值且单位一致时，可用满充容量 ÷ 设计容量 × 100% 估算当前比例。', '这是参考值，温度等条件会影响显示，不能单凭它判断电池真伪或全部状况；数据缺失或设计容量为 0 时保持未知。'], source: 'https://consumer.huawei.com/cn/support/content/zh-cn00792538/' }, { title: '华为鸿蒙笔记本', steps: ['鸿蒙电脑不要套用 Windows 命令；部分机型可在设置 → 电池 → 电池健康查看，显示内容以该机型及系统为准。', '若找不到容量或循环次数，应保持未知，向官方确认；不要把充电上限当作电池健康度。'], source: 'https://consumer.huawei.com/cn/support/matebook-pro-s-care/' });
    add(device === 'laptop' ? '确认账号锁定' : '核对账号和组织管理', { ...huaweiLock, title: '华为电脑账号与查找设备', steps: ['先确认系统：HarmonyOS 5 及以上，可由原所有者在设置 → 华为账号 → 查找设备中按官方说明处理本机绑定。', 'Windows 电脑的系统登录、组织管理及固件密码需要分别核对；不能仅凭退出华为账号认定均已解除。不索取密码或验证码。'] });
    add('核对保修与维修凭据', huaweiRepairs, huaweiCoverage);
  }
  return { guides, label: brand === 'apple' ? '苹果' : '华为', mismatch: false };
}
