import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandSuggestions, catalog, devices, modelSuggestions } from './catalog';
import { analyze, checklist } from './analysis';
import { checklistDetails } from './checklist-details';

test('设备类型均有可执行的核对项，品牌目录不重复', () => {
  assert.equal(new Set(devices.map(device => device.id)).size, devices.length);
  for (const { id } of devices) {
    assert.ok(checklist[id].length >= 3, `${id} 缺少检查项`);
    assert.equal(new Set(brandSuggestions(id)).size, brandSuggestions(id).length);
    for (const brand of catalog[id]) assert.equal(new Set(brand.models).size, brand.models.length, `${id} ${brand.name} 型号重复`);
  }
});

test('品牌匹配按类别隔离，并支持手动输入的简称', () => {
  assert.ok(modelSuggestions('phone', '华为').includes('Mate 60 Pro'));
  assert.ok(modelSuggestions('phone', 'apple').includes('iPhone 15 Pro'));
  assert.ok(modelSuggestions('laptop', '苹果').some(model => model.includes('MacBook')));
  assert.equal(modelSuggestions('camera', '华为').length, 0);
  assert.deepEqual(modelSuggestions('phone', '未收录品牌'), []);
});

test('相机核对不应出现笔记本或手机专属项目', () => {
  const report = analyze({ device: 'camera', listing: '佳能 EOS R50', reply: '', observed: '' });
  assert.equal(report.rows.some(row => row.key === 'battery' || row.key === 'memory'), false);
  assert.ok(checklist.camera.some(item => item.title.includes('镜头')));
  assert.equal(checklist.camera.some(item => item.title.includes('账号锁定')), false);
});

test('处理器、显卡和配置字段只记录明确写出的内容', () => {
  const report = analyze({ device: 'desktop', listing: 'CPU i7-12700，显卡 RTX 3090，内存 32GB', reply: '', observed: '' });
  assert.equal(report.rows.find(row => row.key === 'gpu')?.items[0].value, 'RTX 3090');
  assert.equal(report.rows.find(row => row.key === 'memory')?.items[0].value, '32 GB');
  assert.equal(report.rows.find(row => row.key === 'storage')?.items.length, 0);
});

test('每个设备的展开步骤都对应已有验机项', () => {
  for (const { id } of devices) {
    const details = checklistDetails[id];
    assert.ok(details && Object.keys(details).length > 0, `${id} 缺少操作步骤`);
    for (const [title, steps] of Object.entries(details)) {
      assert.ok(checklist[id].some(item => item.title === title), `${id} 的步骤没有对应验机项：${title}`);
      assert.ok(steps.length >= 1);
    }
  }
});
