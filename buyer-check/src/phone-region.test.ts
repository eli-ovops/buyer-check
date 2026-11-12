import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appleEsimGuidance, appleRegionGuidance, phoneRegions } from './phone-region';
import { brandGuides } from './brand-guides';
import { modelEvidence } from './model-evidence';

test('手机地区选项按品牌限制，未选地区不生成版本结论', () => {
  assert.deepEqual(phoneRegions(false), ['国行']);
  assert.deepEqual(phoneRegions(true), ['国行', '港版', '台版', '美版', '日版', '欧版']);
  assert.equal(appleRegionGuidance('', 'iPhone 15'), undefined);
  for (const region of phoneRegions(true)) {
    const guide = appleRegionGuidance(region, 'iPhone 15');
    assert.ok(guide);
    assert.match(guide.steps.join(' '), /待核实/);
  }
});

test('美版和日版 eSIM 说明限定地区和对应型号，欧版需确认国家', () => {
  assert.match(appleRegionGuidance('美版', 'iPhone 15')!.steps.join(' '), /iPhone 14、15、16/);
  assert.doesNotMatch(appleRegionGuidance('港版', 'iPhone 15')!.steps.join(' '), /仅通过 eSIM 激活/);
  assert.match(appleRegionGuidance('日版', 'iPhone 17 Pro')!.steps.join(' '), /日本购买/);
  assert.match(appleRegionGuidance('美版', 'iPhone 17')!.steps.join(' '), /美国购买的 iPhone 17/);
  assert.match(appleRegionGuidance('港版', 'iPhone Air')!.steps.join(' '), /不支持实体 SIM/);
  assert.doesNotMatch(appleRegionGuidance('日版', 'iPhone 16')!.steps.join(' '), /日本购买的 iPhone 17/);
  assert.doesNotMatch(appleRegionGuidance('美版', 'iPhone 15 仿制款')!.steps.join(' '), /仅通过 eSIM 激活/);
  assert.doesNotMatch(appleRegionGuidance('日版', 'iPhone 17 假型号')!.steps.join(' '), /日本购买的 iPhone 17/);
  assert.match(appleRegionGuidance('欧版', '')!.steps.join(' '), /具体销售地/);
  for (const region of ['港版', '台版', '美版', '日版', '欧版'] as const) assert.match(appleEsimGuidance(region)!.source, /123879/);
  assert.equal(appleEsimGuidance('国行'), undefined);
});

test('国行 eSIM 按实机型号提示且提供型号号码查看方法', () => {
  assert.match(appleRegionGuidance('国行', 'iPhone Air')!.steps.join(' '), /关于本机.*点击.*部件号码.*A 开头/);
  assert.match(appleEsimGuidance('国行', 'iPhone Air')!.steps.join(' '), /A3518.*不能仅凭.*只能通过 eSIM.*营业厅.*不需要在验机时办理/);
  assert.match(appleEsimGuidance('国行', 'iPhone 17e')!.steps.join(' '), /A3635.*不能仅凭.*实体 nano-SIM.*运营商/);
  assert.equal(appleEsimGuidance('国行', 'iPhone 17'), undefined);
  assert.equal(appleEsimGuidance('国行', 'iPhone Air Pro'), undefined);
  assert.match(appleEsimGuidance('港版', 'iPhone 17e')!.steps.join(' '), /境外购买.*不能安装/);
});

test('安卓型号资料不再记录其他销售地区，国行未核实保持未知', () => {
  for (const entry of modelEvidence.filter(e => e.device === 'phone')) {
    assert.doesNotMatch(entry.identity, /印度|意大利|马来西亚|英国|香港|海外|全球/);
  }
  const guides = brandGuides('phone', '小米', 'Xiaomi 15 Ultra').guides['查看电池与维修记录'];
  assert.ok(!guides.some(g => /台湾版/.test(g.title)));
  assert.ok(modelEvidence.find(e => e.model === 'Redmi Note 14')?.identity.includes('待核实'));
});
