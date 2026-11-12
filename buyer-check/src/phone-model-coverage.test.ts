import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from './catalog';
import { brandGuides } from './brand-guides';
import { applePhoneRegions, appleRegionIdentification } from './phone-region';
import { iphoneRegionNumbers } from './iphone-region-numbers';
import { huaweiPhoneSystem } from './huawei-phone-systems';

test('31 款 iPhone 的六个地区均有型号号码依据或明确待核实', () => {
  const models = catalog.phone.find(b => b.name === '苹果 Apple')!.models;
  assert.equal(models.length, 31);
  assert.equal(Object.keys(iphoneRegionNumbers).length, 31);
  for (const model of models) for (const region of applePhoneRegions) {
    const item = appleRegionIdentification(region, model);
    assert.ok(item, `${model} ${region}`);
    assert.match(item.source, /108044|apple\.com\/tw\/nccid|apple\.com\/cwt\/api|cdsassets\.apple\.com|apple\.com\/hk\/iphone\/cellular|www\.anfr\.fr|www\.kcn\.jp|apple\.com\/jp\/shop|assistance-1\.free\.fr/);
    assert.ok(/A\d{4}|待核实/.test(item.steps.join(' ')), `${model} ${region}`);
    if (iphoneRegionNumbers[model][region]) assert.match(item.steps.join(' '), /不能仅凭/);
  }
  assert.match(appleRegionIdentification('国行', 'iPhone 13 Pro Max')!.steps.join(' '), /A2644/);
  assert.match(appleRegionIdentification('台版', 'iPhone 15')!.steps.join(' '), /A3090/);
  assert.match(appleRegionIdentification('欧版', 'iPhone 15')!.steps.join(' '), /A3090/);
  assert.match(appleRegionIdentification('港版', 'iPhone 17e')!.steps.join(' '), /A3634.*不能仅凭/);
  assert.match(appleRegionIdentification('欧版', 'iPhone Air')!.steps.join(' '), /A3517.*不能仅凭/);
  for (const [model, code] of [['iPhone 17 Pro Max','A3526'], ['iPhone 17 Pro','A3523'], ['iPhone 16 Pro Max','A3296'], ['iPhone 16 Pro','A3293'], ['iPhone 16 Plus','A3290']]) {
    const guide = appleRegionIdentification('欧版', model)!;
    assert.ok(guide.steps.join(' ').includes(code));
    assert.match(guide.steps.join(' '), /不保证涵盖全部欧洲国家/);
    assert.match(guide.source, /cdsassets\.apple\.com/);
  }
  for (const [model, code] of [['iPhone 16e','A3409'], ['iPhone 15 Plus','A3094']]) {
    const guide = appleRegionIdentification('欧版', model)!;
    assert.ok(guide.steps.join(' ').includes(code));
    assert.match(guide.source, new RegExp(code));
  }
  for (const [model, code] of [['iPhone 15 Pro Max','A3106'], ['iPhone 14 Pro Max','A2894'], ['iPhone 14 Plus','A2886'], ['iPhone 14','A2882'], ['iPhone 13 mini','A2628'], ['iPhone 13','A2633'], ['iPhone 12 Pro Max','A2411'], ['iPhone 12 Pro','A2407'], ['iPhone 12','A2403'], ['iPhone SE（第 2 代）','A2296']]) {
    const guide = appleRegionIdentification('欧版', model)!;
    assert.ok(guide.steps.join(' ').includes(code));
    assert.match(guide.steps.join(' '), /抽检.*不能仅凭.*不代表所有欧洲国家/);
    assert.match(guide.source, /www\.anfr\.fr/);
    assert.doesNotMatch(appleRegionIdentification('台版', model)!.source, /anfr/);
  }
  assert.match(appleRegionIdentification('欧版', 'iPhone 12 mini')!.steps.join(' '), /抽检.*A2399.*不能仅凭/);
  assert.match(appleRegionIdentification('欧版', 'iPhone 12 mini')!.source, /COM054210041/);
  for (const [model, code] of [['iPhone 11', 'A2221'], ['iPhone 11 Pro', 'A2215'], ['iPhone 11 Pro Max', 'A2218'], ['iPhone SE（第 2 代）', 'A2296']]) {
    const guide = appleRegionIdentification('日版', model)!;
    assert.match(guide.steps.join(' '), new RegExp(`${code}.*不能仅凭`));
    assert.match(guide.source, /kcn\.jp/);
  }
  const japan16e = appleRegionIdentification('日版', 'iPhone 16e')!;
  assert.match(japan16e.steps.join(' '), /A3409.*A3408.*不一致.*待核实.*不能仅凭/);
  assert.match(japan16e.source, /support\.apple\.com\/ru-ru\/108044/);
  assert.equal(iphoneRegionNumbers['iPhone 16e']['日版'], undefined);
  assert.match(appleRegionIdentification('港版', 'iPhone 13 Pro Max')!.steps.join(' '), /A2644/);
  const conflict = appleRegionIdentification('港版', 'iPhone 13 mini')!;
  assert.match(conflict.steps.join(' '), /香港.*A2629.*A2628.*西班牙.*不一致.*待核实/);
  assert.match(conflict.source, /support\.apple\.com\/zh-hk\/108044/);
  assert.doesNotMatch(appleRegionIdentification('台版', 'iPhone 13 mini')!.title, /冲突/);
  for (const [model, code] of [['iPhone 15 Pro', 'A3102'], ['iPhone 14 Pro', 'A2890'], ['iPhone 13 Pro', 'A2638'], ['iPhone 13 Pro Max', 'A2643'], ['iPhone 11', 'A2221'], ['iPhone 11 Pro', 'A2215'], ['iPhone 11 Pro Max', 'A2218'], ['iPhone SE（第 3 代）', 'A2783']]) {
    const guide = appleRegionIdentification('欧版', model)!;
    assert.match(guide.steps.join(' '), new RegExp(`${code}.*法国网络兼容线索.*不能仅凭.*销售地仍待核实`));
    assert.match(guide.source, /assistance-1\.free\.fr/);
  }
  assert.equal(appleRegionIdentification('美版', 'iPhone 13 Pro Max 其他'), undefined);
});

test('iPhone 维修步骤依据型号及 iOS 版本分支', () => {
  const item = (model: string) => brandGuides('phone', '苹果', model).guides['查看电池与维修记录'];
  assert.match(item('iPhone 15')[0].steps.join(' '), /iOS 17\.4/);
  assert.match(item('iPhone Air')[0].steps.join(' '), /iPhone 15 及更新款/);
  assert.match(item('iPhone SE（第 3 代）')[0].steps.join(' '), /电池健康与充电/);
  assert.match(item('iPhone SE（第 3 代）')[1].steps.join(' '), /电池维修信息/);
  assert.match(item('iPhone 11')[1].steps.join(' '), /电池和显示屏/);
  assert.match(item('iPhone 12')[1].steps.join(' '), /iOS 15\.2/);
  const batteryNotice = item('iPhone 15').find(g => g.title === 'iPhone：电池提示如何判断')!;
  assert.match(batteryNotice.steps.join(' '), /iOS 18.*iPhone 15.*已使用.*无法验证.*可能不准确/);
  assert.match(batteryNotice.source, /103269/);
  assert.match(item('iPhone 12').find(g => g.title === 'iPhone：电池提示如何判断')!.steps.join(' '), /当前所选型号和系统是否支持此提示需以实机/);
  assert.match(item('iPhone 12')[1].steps.join(' '), /完成维修.*不要为验机自行升级、重启或启动维修/);
  const partsLock = item('iPhone 15').find(g => g.title === 'iPhone：部件可能另有激活锁')!;
  assert.match(partsLock.steps.join(' '), /部件被锁定至其他 Apple 账户/);
  assert.match(partsLock.steps.join(' '), /iCloud\.com\/find.*原持有人自行决定/);
  assert.match(partsLock.source, /120610/);
  for (const model of ['iPhone 14', 'iPhone 15', 'iPhone 16e', 'iPhone 17 Pro', 'iPhone Air']) {
    const front = item(model).find(g => g.title === 'iPhone：前置摄像头与面容 ID')!;
    assert.match(front.steps.join(' '), /面容 ID 问题.*iPhone 14.*不为验机自行启动维修或恢复/);
    assert.match(front.source, /120567/);
    assert.match(front.steps[2], /^iPhone 1[45]$/.test(model) ? /旧机型不套用/ : /iPhone 16.*已使用/);
  }
  for (const model of ['iPhone 12', 'iPhone 12 mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max']) {
    const front = item(model).find(g => g.title === 'iPhone：前置摄像头与面容 ID')!;
    assert.match(front.steps.join(' '), /原深感摄像头.*面容 ID 问题.*未显示不能证明没有维修.*iPhone 12.*不为验机启动维修或恢复设备/);
    assert.match(front.steps[2], /旧机型不套用/);
    assert.doesNotMatch(front.steps.join(' '), /iPhone 14 及更新机型的前置摄像头更换后/);
    assert.match(front.source, /120567/);
  }
  for (const model of ['iPhone 11', 'iPhone SE（第 3 代）', 'iPhone 99']) {
    assert.ok(!item(model).some(g => g.title === 'iPhone：前置摄像头与面容 ID'));
  }
  for (const model of ['iPhone 99', 'iPhone 15 仿制款', 'iPhone SE（第 1 代）']) {
    const guides = item(model);
    assert.match(guides[1].steps.join(' '), /该型号适用的部件及系统版本待核实/);
    assert.doesNotMatch(guides[1].steps.join(' '), /Apple 对 iPhone (?:12|11|SE)/);
  }
  for (const model of catalog.phone.find(b => b.name === '苹果 Apple')!.models) {
    const allGuides = brandGuides('phone', '苹果', model).guides;
    const carrier = allGuides['核对型号与存储'].find(g => g.title === 'iPhone：检查运营商锁')!;
    assert.match(carrier.steps.join(' '), /iOS 14.*运营商锁.*无 SIM 卡限制.*不能|iOS 14.*运营商锁.*无 SIM 卡限制.*不代表/);
    assert.match(carrier.source, /109316/);
    const warranty = allGuides['核对保修与维修凭据'];
    assert.match(warranty[1].steps.join(' '), /购买地.*待核实.*欧版.*具体购买国家/);
    assert.match(warranty[1].steps.join(' '), /不等于一定不能在大陆获得服务/);
    assert.match(warranty[1].source, /apple\.com\.cn\/legal\/statutory-warranty/);
    const locks = allGuides['确认账号锁定'];
    assert.match(locks[0].steps.join(' '), /iPhone 已与物主锁定.*未解除前不要完成交易.*不能代替完成后续设置和激活核对/);
    assert.match(locks[1].steps.join(' '), /iOS 26.*查找我的 iPhone.*不要.*密码或验证码.*不能证明/);
    assert.match(locks[1].source, /\/26\/ios\/26/);
    assert.match(locks[2].steps.join(' '), /VPN 与设备管理.*不要自行删除.*不证明/);
  }
});

test('国行新增品牌提供官方入口，具体机型与当前系统仍需核实', () => {
  for (const model of ['realme GT7 Pro', 'realme GT6', 'realme GT5 Pro']) {
    const account = brandGuides('phone', 'realme', model).guides['确认账号锁定'].find(g => g.title === 'realme：远程抹除后的账号验证')!;
    assert.match(account.steps.join(' '), /远程抹除.*欢太账号密码.*针对该情形.*待核实.*不需要执行远程抹除.*不索取密码/);
    assert.match(account.source, /realme\.com\/support\/faq/);
  }
  for (const model of ['荣耀 Magic6 Pro', '荣耀 Magic7 Pro']) {
    const clue = brandGuides('phone', '荣耀', model).guides['查看电池与维修记录'].find(g => g.title.includes('电池容量社区线索'))!;
    assert.equal(clue.sourceLabel, '查看社区线索');
    assert.match(clue.steps.join(' '), /更多电池设置.*不能.*版本.*社区|更多电池设置.*不能证明.*版本.*用户经验/);
    assert.match(clue.steps.join(' '), /待核实.*未知.*不能仅凭数值/);
  }
  assert.ok(!brandGuides('phone', '荣耀', '荣耀 Magic7').guides['查看电池与维修记录'].some(g => g.title.includes('电池容量社区线索')));
  for (const [brand, model] of [['荣耀 HONOR','荣耀 Magic7'],['一加 OnePlus','OnePlus 13'],['真我 realme','realme GT5 Pro'],['iQOO','iQOO 13'],['魅族 Meizu','魅族 21'],['努比亚 nubia','红魔 9 Pro']]) {
    const result = brandGuides('phone',brand,model);
    assert.equal(result.mismatch,false);
    for (const section of ['查看电池与维修记录','确认账号锁定','核对保修与维修凭据']) assert.ok(result.guides[section]?.length, `${model} ${section}`);
  }
  for (const model of ['moto razr 50 Ultra', 'moto razr 50', 'moto X50 Ultra']) {
    const guides = brandGuides('phone', '摩托罗拉 Motorola', model).guides;
    assert.match(guides['核对保修与维修凭据'][1].steps.join(' '), /绑定设备.*由持有人决定/);
    assert.match(guides['查看电池与维修记录'][0].steps.join(' '), /待核实/);
    assert.ok(guides['确认账号锁定'].length);
  }
  const nubia = brandGuides('phone', '努比亚 nubia', 'nubia Z60 Ultra');
  assert.match(nubia.guides['核对保修与维修凭据'][1].title, /努比亚/);
  assert.ok(!Object.values(nubia.guides).flat().some(g => /红魔/.test(g.title)));
  assert.match(brandGuides('phone','iQOO','iQOO 13').guides['查看电池与维修记录'].find(g => g.title.includes('系统资料'))!.steps.join(' '), /OriginOS 5/);
  assert.match(brandGuides('phone','真我 realme','realme GT5 Pro').guides['查看电池与维修记录'].find(g => g.title.includes('系统资料'))!.steps.join(' '), /realme UI 5\.0/);
  for (const model of catalog.phone.find(b => b.name === '真我 realme')!.models) {
    const guides = brandGuides('phone', '真我 realme', model).guides;
    const account = guides['确认账号锁定'][0];
    assert.match(account.steps.join(' '), /重置后可能要求验证云服务密码.*设置 → 账号.*不证明所有账号.*不为验机擅自重置/);
    assert.match(account.source, /realme\.com\/cn\/support\/kw\/article-detail\/2099899/);
    const repair = guides['核对保修与维修凭据'][0];
    assert.match(repair.steps.join(' '), /已完成.*不等于完整维修史.*验证码由持有人自行处理/);
    assert.match(repair.source, /realme\.com\/cn\/support\/progress/);
    const transfer = guides['核对保修与维修凭据'].find(g => g.title === 'realme 国行：售后渠道变化')!;
    assert.match(transfer.steps.join(' '), /2026 年 4 月 1 日.*OPPO.*不证明既往记录已全部迁移.*不证明本机仍在保/);
    assert.match(transfer.source, /aid=2283509/);
  }
  assert.match(brandGuides('phone', '一加', 'OnePlus 13').guides['确认账号锁定'][0].source, /ColorOS/);
  assert.equal(brandGuides('phone','iQOO','iQOO 13').guides['查看电池与维修记录'][0].sourceLabel, '查看社区线索');
  for (const model of catalog.phone.find(b => b.name === 'iQOO')!.models) {
    const guides = brandGuides('phone', 'iQOO', model).guides;
    assert.match(guides['确认账号锁定'][0].steps.join(' '), /安全.*查找设备.*当前系统.*核实/);
    assert.match(guides['确认账号锁定'][1].steps.join(' '), /强制恢复出厂设置.*不要为了检查擅自重置/);
    assert.match(guides['核对保修与维修凭据'][0].steps.join(' '), /进度查询不等于完整维修史/);
  }
  const iqoo13 = brandGuides('phone','iQOO','iQOO 13').guides['查看电池与维修记录'].find(g => g.title.includes('区分充电上限'))!;
  assert.match(iqoo13.steps.join(' '), /15\.0\.22\.5\.W10\.V000L1.*不是电池最大容量/);
  assert.ok(!brandGuides('phone','iQOO','iQOO 12').guides['查看电池与维修记录'].some(g => g.title.includes('区分充电上限')));
  assert.match(brandGuides('phone','iQOO','iQOO Neo9 Pro').guides['查看电池与维修记录'].find(g => g.title.includes('系统资料'))!.steps.join(' '), /OriginOS 4.*V2339A/);
  assert.match(brandGuides('phone','一加','OnePlus Ace 3 Pro').guides['查看电池与维修记录'].find(g => g.title.includes('系统资料'))!.steps.join(' '), /ColorOS 14\.1/);
  assert.match(brandGuides('phone','荣耀','荣耀 200').guides['查看电池与维修记录'].find(g => g.title.includes('系统资料'))!.steps.join(' '), /MagicOS 8\.0/);
  for (const [model, code] of [['荣耀 Magic7', 'PTP-AN00 / AN60'], ['荣耀 Magic7 Pro', 'PTP-AN10 / AN70'], ['荣耀 Magic7 RSR', 'PTP-AN20']]) {
    const item = brandGuides('phone', '荣耀', model).guides['查看电池与维修记录'].find(g => g.title.includes('MagicOS 11 充电上限'))!;
    assert.ok(item.steps.join(' ').includes(code));
    assert.match(item.steps.join(' '), /11\.0\.0\.110.*不能因为有更新说明就认定设备已更新.*不是电池最大容量.*健康度保持未知/);
    assert.match(item.source, /club\.honor\.com/);
  }
  assert.ok(!brandGuides('phone', '荣耀', '荣耀 Magic6').guides['查看电池与维修记录'].some(g => g.title.includes('MagicOS 11 充电上限')));
  const honor = brandGuides('phone','荣耀','荣耀 Magic7').guides['核对保修与维修凭据'];
  assert.match(honor[0].source, /honor\.com\/cn\/support\/inquiry/);
  assert.match(honor[0].steps.join(' '), /六个月以前.*95030/);
  assert.match(honor[1].source, /zh-cn15839671/);
  assert.match(honor[1].steps.join(' '), /我的荣耀.*服务权益.*电子三包凭证.*其他设备.*不显示具体日期.*保内不等于.*免费维修/);
  for (const model of ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7']) {
    const guides = brandGuides('phone', '谷歌 Google', model).guides;
    for (const item of ['查看电池与维修记录', '确认账号锁定', '核对保修与维修凭据']) assert.match(guides[item].flatMap(g => g.steps).join(' '), /待核实/);
    if (/^Pixel 9/.test(model)) assert.match(guides['核对型号与存储'][0].steps.join(' '), /商店.*不含中国大陆.*不能单凭/);
    else assert.equal(guides['核对型号与存储'], undefined);
  }
  assert.match(brandGuides('phone','索尼','Xperia 1 VI').guides['核对型号与存储'][0].steps.join(' '), /中国大陆列为 X/);
  assert.match(brandGuides('phone','索尼','Xperia 1 V').guides['核对型号与存储'][0].steps.join(' '), /中国大陆列为 ○/);
  for (const [model, code, path] of [['Xperia 1 V', 'XQ-DQ72', 'xperia-1m5'], ['Xperia 5 V', 'XQ-DE72', 'xperia-5m5']]) {
    const guides = brandGuides('phone', '索尼', model).guides;
    const identity = guides['核对型号与存储'].find(g => g.title.includes('查看型号和系统'))!;
    const battery = guides['查看电池与维修记录'].find(g => g.title.includes('电池保养与健康度'))!;
    assert.match(identity.steps.join(' '), new RegExp(`${code}.*Android 13.*不能单独证明`));
    assert.match(battery.steps.join(' '), /Android 13.*充电上限.*不是电池健康百分比.*待核实/);
    assert.ok(battery.source.includes(path));
  }
  assert.ok(!brandGuides('phone','索尼','Xperia 1 VI').guides['查看电池与维修记录'].some(g => g.title.includes('电池保养与健康度')));
});

test('华为国行系统版本按精确型号和产品条件匹配', () => {
  assert.match(huaweiPhoneSystem('Mate 70 Pro+')!.steps.join(' '), /先锋版出厂为 5\.0/);
  assert.match(huaweiPhoneSystem('Pura 80 Pro')!.steps.join(' '), /部分设备出厂预装/);
  assert.match(huaweiPhoneSystem('nova 14')!.steps.join(' '), /5\.0/);
  assert.match(huaweiPhoneSystem('Mate 60')!.steps.join(' '), /BRA-AL00.*6\.0\.0\.108/);
  assert.match(huaweiPhoneSystem('nova 12 Pro')!.steps.join(' '), /4\.0\.0\.158/);
  assert.equal(huaweiPhoneSystem('Mate 70 Pro Max'), undefined);
});

test('华为系列电池依据与旧系统激活锁不扩展到未知型号', () => {
  const mate = brandGuides('phone', '华为', 'Mate 60 Pro');
  assert.ok(mate.guides['查看电池与维修记录'].some(g => g.title.includes('官方系列电池入口')));
  assert.ok(mate.guides['确认账号锁定'].some(g => g.title.includes('4.0 / 4.2 / 4.3')));
  const x5 = brandGuides('phone', '华为', 'Mate X5');
  assert.ok(!x5.guides['查看电池与维修记录'].some(g => g.title.includes('官方系列电池入口')));
  const samsung = brandGuides('phone', '三星', 'Galaxy S24');
  assert.match(samsung.guides['查看电池与维修记录'][0].source, /samsung\.com\.cn/);
  for (const model of ['Galaxy S24', 'Galaxy S25 Ultra', 'Galaxy Z Fold5']) {
    const activation = brandGuides('phone', '三星', model).guides['核对保修与维修凭据'].find(g => g.title === '三星：核对设备激活日期')!;
    assert.match(activation.steps.join(' '), /IMEI.*序列号.*验证码.*首次激活时间.*不等于保修截止日期.*不能单凭/);
    assert.match(activation.source, /supportcn\/imei\/default\.aspx/);
  }
  for (const [model, code, versions] of [['Galaxy S24 Ultra', 'SM-S9280', 'Android 14、15、16'], ['Galaxy S24+', 'SM-S9260', 'Android 14、15、16'], ['Galaxy S24', 'SM-S9210', 'Android 15、16'], ['Galaxy S25 Ultra', 'SM-S9380', 'Android 15、16'], ['Galaxy S25+', 'SM-S9360', 'Android 15、16'], ['Galaxy S25', 'SM-S9310', 'Android 15、16']]) {
    const entry = brandGuides('phone', '三星', model).guides['核对型号与存储'][0];
    assert.ok(entry.steps.join(' ').includes(code));
    assert.ok(entry.steps.join(' ').includes(versions));
    assert.match(entry.steps.join(' '), /不代表二手机当前运行.*不能单独证明销售地.*待核实/);
  }
  for (const [model, code, versions] of [['Galaxy S23 Ultra', 'SM-S9180', 'Android 13、14、15、16'], ['Galaxy S23+', 'SM-S9160', 'Android 13、14、15、16'], ['Galaxy S23', 'SM-S9110', 'Android 13、14、15、16'], ['Galaxy Z Fold6', 'SM-F9560', 'Android 14、15、16'], ['Galaxy Z Flip6', 'SM-F7410', 'Android 14、15、16'], ['Galaxy Z Fold5', 'SM-F9460', 'Android 13、14、15、16'], ['Galaxy Z Flip5', 'SM-F7310', 'Android 13、14']]) {
    const entry = brandGuides('phone', '三星', model).guides['核对型号与存储'][0];
    assert.ok(entry.steps.join(' ').includes(code));
    assert.ok(entry.steps.join(' ').includes(versions));
    assert.match(entry.steps.join(' '), /不代表二手机当前运行.*不能单独证明销售地.*待核实/);
  }
  for (const [model, code] of [['Galaxy Z Fold5', 'SM-F9460'], ['Galaxy Z Flip5', 'SM-F7310']]) {
    const guides = brandGuides('phone', '三星', model).guides;
    const identity = guides['查看电池与维修记录'].find(g => g.title.includes('型号和系统资料'))!;
    assert.ok(identity.steps.join(' ').includes(code));
    assert.match(identity.steps.join(' '), /销售地区和当前 One UI 版本仍需核对/);
    assert.doesNotMatch(identity.steps.join(' '), /国行完整型号.*待核实/);
    assert.match(identity.source, /samsung\.com\.cn/);
  }
  assert.equal(brandGuides('phone', '三星', 'Galaxy S24 FE').guides['核对型号与存储'], undefined);
  const oppoRecord = brandGuides('phone', 'OPPO', 'OPPO Find X8').guides['核对保修与维修凭据'].find(g => g.title === 'OPPO 服务记录')!;
  assert.match(oppoRecord.steps.join(' '), /历史时长.*待核实/);
  assert.doesNotMatch(oppoRecord.steps.join(' '), /一年内/);
  assert.match(oppoRecord.source, /repair-record/);
  for (const model of catalog.phone.find(b => b.name === 'OPPO')!.models) {
    const battery = brandGuides('phone', 'OPPO', model).guides['查看电池与维修记录'][0];
    assert.match(battery.steps.join(' '), /最大电池容量.*型号及当前系统.*待核实.*获取失败.*未知.*不能单凭数值判断电池原装/);
    assert.match(battery.source, /aid=2174837/);
  }
  for (const [brand, model, listed] of [
    ['OPPO', 'OPPO Find X9 Pro', 'Find X9 系列'], ['OPPO', 'OPPO Find X9', 'Find X9 系列'],
    ['OPPO', 'OPPO Find X8 Ultra', 'Find X8 Ultra'], ['OPPO', 'OPPO Find X8 Pro', 'Find X8 系列'], ['OPPO', 'OPPO Find X8', 'Find X8 系列'],
    ['OPPO', 'OPPO Find X7 Ultra', 'Find X7 系列'], ['OPPO', 'OPPO Find X7', 'Find X7 系列'],
    ['OPPO', 'OPPO Find N5', 'Find N5'], ['OPPO', 'OPPO Find N3', 'Find N3'],
    ['OPPO', 'OPPO Reno15 Pro', 'Reno15 Pro'], ['OPPO', 'OPPO Reno15', 'Reno15'],
    ['OPPO', 'OPPO Reno14 Pro', 'Reno14 系列'], ['OPPO', 'OPPO Reno14', 'Reno14 系列'],
    ['一加', 'OnePlus 13', '一加 13'], ['一加', 'OnePlus 12', '一加 12'],
    ['一加', 'OnePlus Ace 3 Pro', '一加 Ace 3 Pro'], ['一加', 'OnePlus Ace 3', '一加 Ace 3'],
    ['真我', 'realme GT7 Pro', '真我 GT7 Pro'], ['真我', 'realme GT6', '真我 GT6'], ['真我', 'realme GT5 Pro', '真我 GT5 Pro']
  ]) {
    const entry = brandGuides('phone', brand, model).guides['查看电池与维修记录'].find(g => g.title.includes('官方列出的电池容量入口'))!;
    assert.ok(entry.steps[0].includes(listed));
    assert.match(entry.steps.join(' '), /设置 → 电池 → 电池健康 → 最大电池容量.*未逐一列明.*以实机为准.*未知/);
    assert.match(entry.source, /aid=2124198/);
  }
  for (const model of ['OPPO Find X9 Ultra', 'OPPO Reno13', 'OPPO Reno13 Pro', 'OPPO Reno12', 'OPPO Reno12 Pro']) {
    assert.ok(!brandGuides('phone', 'OPPO', model).guides['查看电池与维修记录'].some(g => g.title.includes('官方列出的电池容量入口')));
  }
  for (const [brand, model] of [['三星','Galaxy S24'], ['OPPO','OPPO Find X8'], ['小米','Xiaomi 15']]) {
    const relevant = Object.values(brandGuides('phone', brand, model).guides).flat();
    assert.ok(relevant.every(g => !/\/global\/|\/ae\/|\/ph\/|\/lk\//.test(g.source)), `${model} 应使用国行资料`);
  }
});

test('华为折叠屏保障提示只适用于条款列明的目录型号', () => {
  for (const model of ['Mate X5', 'Mate X6', 'Mate X7', 'Pura X']) {
    const item = brandGuides('phone', '华为', model).guides['核对保修与维修凭据'].find(g => g.title.includes('核对折叠屏保障'))!;
    assert.match(item.steps.join(' '), /原合同.*剩余次数.*转让后是否适用.*一年期.*内屏和外屏.*服务费.*不等于免费维修/);
    assert.match(item.source, /huawei-care\/disclaimer/);
  }
  for (const model of ['Mate 60 Pro', 'Mate X5 Pro', 'Pura X Max']) {
    assert.ok(!brandGuides('phone', '华为', model).guides['核对保修与维修凭据'].some(g => g.title.includes('核对折叠屏保障')));
  }
});

test('荣耀目录机型的激活锁提示限定系统条件和原持有人操作', () => {
  for (const [model, version] of [['荣耀 Magic7', '9.0'], ['荣耀 Magic7 Pro', '9.0'], ['荣耀 Magic7 RSR', '9.0'], ['荣耀 Magic6', '8.0'], ['荣耀 Magic6 Pro', '8.0'], ['荣耀 200', '8.0'], ['荣耀 200 Pro', '8.0']]) {
    const item = brandGuides('phone', '荣耀', model).guides['确认账号锁定'].find(g => g.title === `MagicOS ${version}：查找设备与激活锁`)!;
    assert.match(item.steps.join(' '), /先核对实际系统.*强制清除数据.*具体适用性仍待核实.*原持有人.*不要索取.*不要为验机/);
    assert.ok(item.source.includes(`MagicOS-${version}`));
  }
  assert.ok(!brandGuides('phone', '荣耀', '荣耀 Magic7 假型号').guides['确认账号锁定'].some(g => g.title.includes('安全白皮书') || g.title.includes('MagicOS 9.0：')));
});

test('OPPO 国行账号锁提示限定情形且不要求重置', () => {
  for (const model of ['OPPO Find X8', 'OPPO Reno 14', 'OPPO Find X7']) {
    const guide = brandGuides('phone', 'OPPO', model).guides['确认账号锁定'].find(g => g.title === 'OPPO：重置后出现查找手机锁')!;
    assert.match(guide.steps.join(' '), /ColorOS 13.*若重置后出现.*对应手机账号.*联网.*未逐一确认.*原持有人.*不要索取.*不要为验机执行重置/);
    assert.match(guide.source, /gcss-robot\.oppo\.com/);
  }
  assert.ok(!brandGuides('phone', 'vivo', 'vivo X200').guides['确认账号锁定'].some(g => g.title === 'OPPO：重置后出现查找手机锁'));
});
