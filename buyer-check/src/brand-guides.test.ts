import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandGuides } from './brand-guides';
import { checklist } from './analysis';

test('iPhone 电池路径按已选型号区分，未知型号同时提示两种路径', () => {
  const steps = (model: string) => brandGuides('phone', '苹果 Apple', model).guides['查看电池与维修记录'][0].steps.join(' ');
  assert.match(steps('iPhone 14 Pro'), /电池健康与充电/);
  for (const model of ['iPhone 11', 'iPhone 12 mini', 'iPhone 13 Pro', 'iPhone 14 Pro', 'iPhone SE（第 2 代）', 'iPhone SE（第 3 代）']) {
    const battery = brandGuides('phone', '苹果', model).guides['查看电池与维修记录'][0];
    assert.match(battery.steps[0], /iOS 16\.1.*电池健康与充电.*iOS 11\.3 至 16\.0\.x.*电池健康.*具体型号是否支持该系统/);
    assert.match(battery.source, /104999/);
  }
  assert.doesNotMatch(steps('iPhone 14 Pro'), /iPhone 15 及更新款：设置/);
  assert.match(steps('iPhone 15 Pro'), /iPhone 15 及更新款：设置/);
  assert.doesNotMatch(steps('iPhone 15 Pro'), /11\.3 至 16\.0/);
  assert.match(steps(''), /电池健康与充电/);
  assert.match(steps(''), /iPhone 15 及更新款：设置/);
});

test('华为手机和电脑使用对应官方路径，维修记录说明查询边界', () => {
  const phone = brandGuides('phone', '华为 HUAWEI', 'Mate 60 Pro').guides;
  assert.ok(phone['查看电池与维修记录'].some(g => g.steps.some(s => s.includes('最大容量'))));
  assert.ok(phone['查看电池与维修记录'].some(g => g.steps.some(s => s.includes('近 6 个月'))));
  assert.ok(phone['确认账号锁定'].some(g => g.steps.some(s => s.includes('HarmonyOS 5'))));
  const laptop = brandGuides('laptop', '华为 HUAWEI', 'MateBook 14').guides;
  assert.ok(laptop['查看电池信息'].some(g => g.title.includes('Windows') && g.steps.some(s => s.includes('batteryreport'))));
  assert.ok(laptop['查看电池信息'].some(g => g.steps.some(s => s.includes('FULL CHARGE CAPACITY'))));
  assert.ok(laptop['查看电池信息'].some(g => g.title.includes('鸿蒙') && g.steps.some(s => s.includes('不要套用 Windows'))));
  assert.ok(laptop['核对保修与维修凭据'].some(g => g.title.includes('维修')));
});

test('型号冲突或未知品牌不能显示错误品牌专属指南', () => {
  assert.equal(brandGuides('phone', '华为', 'iPhone 15').mismatch, true);
  assert.equal(brandGuides('phone', '苹果', 'MacBook Pro').mismatch, true);
  assert.deepEqual(brandGuides('phone', '其他品牌', 'iPhone 15').guides, {});
  assert.deepEqual(brandGuides('camera', '苹果', 'iPhone 15').guides, {});
  assert.equal(brandGuides('phone', '', 'iPhone15').label, '苹果');
});

test('品牌指南只挂在对应设备实际存在的检查项上', () => {
  for (const device of ['phone', 'laptop', 'desktop'] as const) for (const brand of ['苹果', '华为']) {
    const result = brandGuides(device, brand, '');
    for (const [title, guides] of Object.entries(result.guides)) {
      assert.ok(checklist[device].some(item => item.title === title), `${device} 缺少 ${title}`);
      for (const guide of guides) assert.match(guide.source, /^https:\/\/(?:support\.apple\.com|www\.apple\.com\.cn|consumer\.huawei\.com)\//);
    }
  }
  assert.equal(brandGuides('desktop', '苹果', 'Mac mini M4').guides['查看电池信息'], undefined);
});

test('新增品牌按设备、品牌及型号展示对应指引', () => {
  const phones = [ ['小米 Xiaomi', 'Xiaomi 15'], ['红米 REDMI', 'Redmi K70'], ['OPPO', 'OPPO Find X8'], ['vivo', 'vivo X200'], ['三星 Samsung', 'Galaxy S25'] ];
  for (const [brand, model] of phones) {
    const result = brandGuides('phone', brand, model);
    assert.equal(result.mismatch, false);
    for (const item of ['查看电池与维修记录', '确认账号锁定', '核对保修与维修凭据']) assert.ok(result.guides[item]?.length, `${brand} 缺少 ${item}`);
    assert.ok(result.guides['查看电池与维修记录'][0].steps.some(step => /未知|未显示/.test(step)));
  }
  for (const [brand, model] of [['联想 Lenovo', 'ThinkPad T14'], ['华硕 ASUS', '天选 5']]) {
    for (const device of ['laptop', 'desktop'] as const) {
      const result = brandGuides(device, brand, device === 'laptop' ? model : '');
      for (const [item, guides] of Object.entries(result.guides)) {
        assert.ok(checklist[device].some(entry => entry.title === item));
        assert.ok(guides.every(guide => guide.source.startsWith('https://')));
      }
      assert.equal(Boolean(result.guides['查看电池信息']), device === 'laptop');
      assert.ok(result.guides['核对保修与维修凭据']);
    }
  }
  assert.ok(brandGuides('phone', '三星', 'Galaxy Z Fold6').guides['核对外观与配件']);
  assert.equal(brandGuides('phone', '三星', 'Galaxy S25').guides['核对外观与配件'], undefined);
  assert.equal(brandGuides('phone', 'OPPO', 'Galaxy S25').mismatch, true);
  assert.equal(brandGuides('desktop', '联想', 'ThinkPad T14').mismatch, true);
  assert.deepEqual(brandGuides('laptop', '小米 Xiaomi', 'Xiaomi Book Pro 14').guides, {});
  assert.equal(brandGuides('phone', '', 'vivo X200').label, 'vivo');
});

test('型号专属说明只匹配有依据的型号，并保留版本与数据边界', () => {
  const titles = (device: 'phone' | 'laptop', brand: string, model: string, item: string) => (brandGuides(device, brand, model).guides[item] ?? []).map(guide => guide.title);
  assert.ok(titles('phone', '小米', 'Xiaomi 15', '查看电池与维修记录').includes('Xiaomi 15：区分电池健康和充电上限'));
  assert.ok(!titles('phone', '小米', 'Xiaomi 15 Pro', '查看电池与维修记录').includes('Xiaomi 15：区分电池健康和充电上限'));
  for (const model of ['Xiaomi 15', 'Xiaomi 15 Pro']) {
    const data = brandGuides('phone', '小米', model).guides;
    const facts = data['查看电池与维修记录'].find(g => g.title === `${model}：型号和系统资料`)!;
    assert.match(facts.steps.join(' '), /澎湃 OS 2.*当前系统和销售地区需另行核对/);
    const extended = data['核对保修与维修凭据'].find(g => g.title === '小米延保：核对购买记录与转让条件')!;
    assert.match(extended.steps.join(' '), /这份延保条款.*不得转让.*其他保障产品.*不要据此推断基础保修/);
    assert.match(data['核对保修与维修凭据'].find(g => g.title === '小米维修记录')!.steps.join(' '), /该型号可查询的维修记录范围待核实/);
  }
  assert.ok(!titles('phone', 'OPPO', 'OPPO Find X8', '查看电池与维修记录').includes('Find X8：按系统版本核对'));
  assert.ok(!titles('phone', 'OPPO', 'OPPO Find X8 Pro', '查看电池与维修记录').includes('Find X8：按系统版本核对'));
  assert.ok(titles('phone', 'vivo', 'vivo X200', '确认账号锁定').includes('vivo X200：查找设备位置'));
  assert.ok(!titles('phone', 'vivo', 'vivo X200 Pro', '确认账号锁定').includes('vivo X200：查找设备位置'));
  const x200 = brandGuides('phone', 'vivo', 'vivo X200').guides;
  assert.match(x200['确认账号锁定'].find(g => g.title === 'vivo X200：查找设备位置')!.steps.join(' '), /Android 15 参数.*最新系统.*不能据此保证所有 Android 15/);
  assert.match(x200['核对保修与维修凭据'].find(g => g.title === 'vivo X200：电子保修卡')!.steps.join(' '), /系统管理与升级.*客户服务.*最新系统.*不要求.*注册或激活/);
  assert.ok(!titles('phone', 'vivo', 'vivo X200 Pro', '核对保修与维修凭据').includes('vivo X200：电子保修卡'));
  for (const [model, code] of [['vivo X200', 'V2415A'], ['vivo X200 Pro', 'V2405A、V2405DA']]) {
    const facts = brandGuides('phone', 'vivo', model).guides['查看电池与维修记录'].find(g => g.title.includes('型号和系统资料'))!;
    assert.ok(facts.steps.join(' ').includes(code));
    assert.match(facts.steps.join(' '), /Android 15.*OriginOS 5.*当前系统/);
  }
  for (const [model, code] of [['vivo X100', 'V2309A'], ['vivo X100 Pro', 'V2324A'], ['vivo X Fold3', 'V2303A'], ['vivo X Fold3 Pro', 'V2337A']]) {
    const facts = brandGuides('phone', 'vivo', model).guides['查看电池与维修记录'].find(g => g.title.includes('型号和系统资料'))!;
    assert.ok(facts.steps.join(' ').includes(code));
    assert.match(facts.steps.join(' '), /Android 14.*OriginOS 4.*当前系统/);
  }
  assert.ok(titles('phone', '三星', 'Galaxy S25+', '查看电池与维修记录').includes('Galaxy S24 / S25：Samsung Members 诊断'));
  assert.ok(!titles('phone', '三星', 'Galaxy S23', '查看电池与维修记录').includes('Galaxy S24 / S25：Samsung Members 诊断'));
  assert.ok(titles('laptop', '联想', 'ThinkPad T14', '查看电池信息').includes('ThinkPad T14：先核对代数'));
  assert.ok(!titles('laptop', '联想', 'ThinkPad E14', '查看电池信息').includes('ThinkPad T14：先核对代数'));
  assert.ok(titles('laptop', '华硕', '天选 5', '查看电池信息').includes('天选 5：MyASUS 功能按实机确认'));
  const vivoService = brandGuides('phone', 'vivo', 'vivo X200').guides['核对保修与维修凭据'].flatMap(guide => guide.steps).join(' ');
  assert.match(vivoService, /不要为验机要求卖家激活/);
  assert.match(vivoService, /不一定包含全部历史/);
  assert.equal(x200['确认账号锁定'].find(g => g.title === 'vivo 账号与查找设备')!.source, 'https://bbs.vivo.com.cn/newbbs/thread/36945416');
  for (const [brand, model, title] of [['vivo', 'vivo X200', 'vivo 服务记录'], ['iQOO', 'iQOO 13', 'vivo / iQOO 服务进度']]) {
    const record = brandGuides('phone', brand, model).guides['核对保修与维修凭据'].find(g => g.title === title)!;
    assert.equal(record.source, 'https://www.vivo.com.cn/service.html');
    assert.match(record.steps.join(' '), /服务进度.*完整维修史/);
  }
});

test('其他热门型号展示条件化步骤，并排除相似型号误匹配', () => {
  const guides = (device: 'phone' | 'laptop', brand: string, model: string, item: string) => brandGuides(device, brand, model).guides[item] ?? [];
  const includes = (device: 'phone' | 'laptop', brand: string, model: string, item: string, title: string) => guides(device, brand, model, item).some(guide => guide.title === title);
  assert.ok(!includes('phone', '红米', 'Redmi Note 14 Pro', '查看电池与维修记录', 'Redmi Note 14 Pro：先确认网络版本'));
  assert.ok(!includes('phone', '红米', 'Redmi Note 14 Pro+', '查看电池与维修记录', 'Redmi Note 14 Pro：先确认网络版本'));
  for (const model of ['OPPO Find X8 Pro', 'OPPO Find N3']) assert.ok(!includes('phone', 'OPPO', model, '查看电池与维修记录', 'Find X8 Pro / N3：先确认 ColorOS'));
  assert.ok(includes('phone', 'vivo', 'vivo X200 Pro', '查看电池与维修记录', 'vivo X200 Pro：先确认系统版本'));
  assert.ok(!includes('phone', 'vivo', 'vivo X200 Pro mini', '查看电池与维修记录', 'vivo X200 Pro：先确认系统版本'));
  for (const model of ['Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra']) assert.ok(!includes('phone', '三星', model, '查看电池与维修记录', 'Galaxy S23 系列：电池诊断与充电保护'));
  assert.ok(!includes('phone', '三星', 'Galaxy Z Fold6', '查看电池与维修记录', 'Galaxy Z Fold6 / Flip6：电池状态'));
  assert.ok(!includes('phone', '三星', 'Galaxy Z Fold5', '查看电池与维修记录', 'Galaxy Z Fold6 / Flip6：电池状态'));
  assert.ok(includes('laptop', '联想', 'ThinkPad E14', '查看电池信息', 'ThinkPad E14：确认代数与充电阈值'));
  assert.ok(includes('laptop', '华硕', '灵耀 14', '查看电池信息', '灵耀 14：核对年份和机器代号'));
  assert.ok(!includes('laptop', '华硕', '灵耀 14 Air', '查看电池信息', '灵耀 14：核对年份和机器代号'));
  const account = guides('phone', 'vivo', 'vivo X200 Pro', '确认账号锁定').flatMap(guide => guide.steps).join(' ');
  assert.match(account, /安全.*查找.*查找设备/);
  assert.match(account, /密码或验证码/);
});

test('新增型号指南按具体型号显示，切换时不污染品牌通用指南', () => {
  const titles = (device: 'phone' | 'laptop', brand: string, model: string, item: string) => (brandGuides(device, brand, model).guides[item] ?? []).map(guide => guide.title);
  const battery = '查看电池与维修记录';
  const service = '核对保修与维修凭据';
  assert.ok(titles('phone', '红米', 'Redmi K70 Pro', battery).includes('Redmi K70 Pro：电池保护与健康度'));
  assert.ok(!titles('phone', '红米', 'Redmi K70', battery).includes('Redmi K70 Pro：电池保护与健康度'));
  for (const model of ['vivo X100', 'vivo X100 Pro']) assert.ok(titles('phone', 'vivo', model, battery).includes('vivo X100 / X100 Pro：核对系统版本'));
  for (const model of ['vivo X Fold3', 'vivo X Fold3 Pro']) assert.ok(titles('phone', 'vivo', model, battery).includes('vivo X Fold3 / Pro：区分机型与系统'));
  assert.ok(!titles('phone', 'vivo', 'vivo X Fold5', battery).includes('vivo X Fold3 / Pro：区分机型与系统'));
  assert.ok(titles('phone', 'OPPO', 'OPPO Reno13', battery).includes('OPPO Reno13：先核对实际系统'));
  assert.ok(!titles('phone', 'OPPO', 'OPPO Reno13 Pro', battery).includes('OPPO Reno13：先核对实际系统'));
  const mixTitle = 'Xiaomi MIX Fold 4 / MIX Flip：保障权益';
  assert.ok(titles('phone', '小米', 'Xiaomi MIX Fold 4', service).includes(mixTitle));
  assert.ok(!titles('phone', '小米', 'Xiaomi 15', service).includes(mixTitle));
  const lenovoTitle = '小新 / 拯救者：出厂配置与保修';
  assert.ok(titles('laptop', '联想', '小新 Pro 14', service).includes(lenovoTitle));
  assert.ok(!titles('laptop', '联想', 'ThinkPad T14', service).includes(lenovoTitle));
  const asusTitle = '天选 4：先核对完整机器代号';
  assert.ok(titles('laptop', '华硕', '天选 4', service).includes(asusTitle));
  assert.ok(!titles('laptop', '华硕', '天选 5', service).includes(asusTitle));
});

test('安卓仅保留国行容量与正确型号的说明', () => {
  const get = (device: 'phone' | 'laptop', brand: string, model: string, item: string) => brandGuides(device, brand, model).guides[item] ?? [];
  const ultra = get('phone', '小米', 'Xiaomi 15 Ultra', '查看电池与维修记录');
  assert.ok(ultra.some(g => g.steps.join(' ').includes('6000mAh') && g.source.includes('/prod/xiaomi-15-ultra')));
  assert.ok(!ultra.some(g => g.title.includes('台湾版')));
  assert.ok(!get('phone', '小米', 'Xiaomi 15 Pro', '查看电池与维修记录').some(g => g.title.startsWith('Xiaomi 15 Ultra')));
  const reno = get('phone', 'OPPO', 'OPPO Reno14 Pro', '查看电池与维修记录');
  assert.ok(reno.some(g => g.title === 'OPPO Reno14 Pro：确认当前系统'));
  assert.ok(!reno.some(g => g.title === 'OPPO Reno14：核对标准版与系统'));
  assert.ok(get('laptop', '华硕', '无畏 14', '查看电池信息').some(g => g.title === '无畏 14：核对机器代号'));
});
