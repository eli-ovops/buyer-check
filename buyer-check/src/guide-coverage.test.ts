import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalog, type Device } from './catalog';
import { brandGuides } from './brand-guides';
import { checklist } from './analysis';

test('已支持品牌的目录型号均有对应检查入口，台式机不显示电池', () => {
  const targets: Partial<Record<Device, string[]>> = {
    phone: ['小米 Xiaomi', '红米 REDMI', 'OPPO', 'vivo', '三星 Samsung'],
    laptop: ['联想 Lenovo', '华硕 ASUS'],
    desktop: ['联想 Lenovo', '华硕 ASUS']
  };
  let checkedModels = 0;
  for (const [device, brands] of Object.entries(targets) as [Device, string[]][]) {
    for (const name of brands) {
      const entry = catalog[device].find(brand => brand.name === name);
      assert.ok(entry, `${device} 缺少品牌 ${name}`);
      for (const model of entry.models) {
        checkedModels++;
        const result = brandGuides(device, name, model);
        assert.equal(result.mismatch, false, `${name} ${model} 误判冲突`);
        assert.ok(result.label, `${name} ${model} 没有品牌指南`);
        const battery = device === 'phone' ? '查看电池与维修记录' : '查看电池信息';
        const account = device === 'desktop' ? '核对账号和组织管理' : '确认账号锁定';
        assert.ok(result.guides[account]?.length, `${name} ${model} 缺少账号步骤`);
        assert.ok(result.guides['核对保修与维修凭据']?.length, `${name} ${model} 缺少保修步骤`);
        assert.ok(result.guides['核对保修与维修凭据'].some(guide => /维修|服务记录/.test(`${guide.title}${guide.steps.join('')}`)), `${name} ${model} 缺少维修说明`);
        if (device === 'desktop') assert.equal(result.guides[battery], undefined);
        else assert.ok(result.guides[battery]?.length, `${name} ${model} 缺少电池步骤`);
        for (const [item, guides] of Object.entries(result.guides)) {
          assert.ok(checklist[device].some(check => check.title === item), `${name} ${model} 指引无对应检查项 ${item}`);
          for (const guide of guides) {
            assert.ok(guide.steps.length > 0, `${name} ${model} 的 ${guide.title} 没有步骤`);
            assert.match(guide.source, /^https:\/\//, `${name} ${model} 的 ${guide.title} 缺少官方来源`);
          }
        }
      }
    }
  }
  assert.ok(checkedModels >= 90, `仅检查 ${checkedModels} 款型号`);
});

test('型号资料逐一接入四类核验提示，台式机电池不适用且不串型号', async () => {
  const { modelEvidence, findModelEvidence } = await import('./model-evidence');
  assert.ok(modelEvidence.length >= 53);
  assert.equal(new Set(modelEvidence.map(e => `${e.device}/${e.brand}/${e.model}`)).size, modelEvidence.length);
  const names = { xiaomi: '小米 Xiaomi', oppo: 'OPPO', vivo: 'vivo', samsung: '三星 Samsung', lenovo: '联想 Lenovo', asus: '华硕 ASUS' } as const;
  for (const entry of modelEvidence) {
    const brandName = entry.brand === 'xiaomi' && /^redmi/i.test(entry.model) ? '红米 REDMI' : names[entry.brand];
    assert.ok(catalog[entry.device].find(b => b.name === brandName)?.models.includes(entry.model), `${entry.model} 不在目录`);
    const result = brandGuides(entry.device, brandName, entry.model);
    const batteryKey = entry.device === 'phone' ? '查看电池与维修记录' : '查看电池信息';
    const accountKey = entry.device === 'desktop' ? '核对账号和组织管理' : '确认账号锁定';
    const text = (key: string) => (result.guides[key] ?? []).flatMap(g => g.steps).join(' ');
    assert.match(text(accountKey), /待核实/);
    assert.match(text('核对保修与维修凭据'), /保修查询适用性待核实/);
    assert.match(text('核对保修与维修凭据'), /维修记录范围待核实/);
    if (entry.device !== 'desktop') assert.match(text(batteryKey), /当前系统版本下是否提供电池健康入口及百分比待核实/);
    else {
      assert.equal(result.guides['查看电池信息'], undefined);
      assert.match(text('核对保修与维修凭据'), /台式机不适用笔记本电池健康检查/);
    }
    assert.ok(Object.values(result.guides).flat().some(g => g.steps.some(s => s.includes(entry.identity))), `${entry.model} 型号说明未显示`);
    assert.equal(findModelEvidence(entry.device, entry.brand, `${entry.model} 假型号`), undefined);
    if (entry.source) assert.match(entry.source, /^https:\/\//);
  }
});

test('新型号指南不会污染共享品牌指南', async () => {
  const before = brandGuides('phone', 'OPPO', '').guides['核对保修与维修凭据'].map(g => g.steps.join(' ')).join(' ');
  brandGuides('phone', 'OPPO', 'OPPO Find X9 Pro');
  const after = brandGuides('phone', 'OPPO', '').guides['核对保修与维修凭据'].map(g => g.steps.join(' ')).join(' ');
  assert.equal(after, before);
});

test('ThinkBook 分部件保修提示限定型号并标明以实机查询为准', () => {
  for (const model of ['ThinkBook 14+', 'ThinkBook 16+']) {
    const guide = brandGuides('laptop', '联想 Lenovo', model).guides['核对保修与维修凭据'].find(g => g.title.includes('分部件保修'));
    assert.ok(guide);
    assert.match(guide.steps.join(' '), /2023 年/);
    assert.match(guide.steps.join(' '), /不证明这台二手机仍在保修/);
  }
  assert.equal(brandGuides('laptop', '联想 Lenovo', 'ThinkPad X13').guides['核对保修与维修凭据'].some(g => g.title.includes('分部件保修')), false);
});
