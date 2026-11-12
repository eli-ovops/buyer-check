import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, extract } from './analysis';

test('未提供的信息保持未知，已有字段保留来源', () => {
  const r = analyze({ device: 'laptop', listing: 'MacBook Pro M1，内存16GB，存储512GB，无拆修', reply: '', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'memory')?.items[0].value, '16 GB');
  assert.equal(r.rows.find(x => x.key === 'memory')?.items[0].source, '商品描述');
  assert.equal(r.rows.find(x => x.key === 'battery')?.items.length, 0);
  assert.ok(r.followups.some(q => q.includes('电池')));
});

test('对照不同来源，记录明确冲突但不把卖家说法当事实', () => {
  const r = analyze({ device: 'laptop', listing: '内存16GB，无拆修', reply: '内存16GB', observed: '内存8GB' });
  const memory = r.rows.find(x => x.key === 'memory')!;
  assert.equal(memory.conflict, true);
  assert.deepEqual(memory.items.map(f => f.source), ['商品描述', '卖家回复', '买家记录']);
  assert.ok(r.followups.some(q => q.includes('运行内存') && q.includes('不一致')));
});

test('不同单位需人工核对，拒绝不可能的健康度', () => {
  const r = analyze({ device: 'laptop', listing: '存储1TB，电池健康 150%', reply: '存储1024GB', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'storage')?.conflict, false);
  assert.equal(r.rows.find(x => x.key === 'storage')?.uncertain, true);
  assert.equal(r.rows.find(x => x.key === 'battery')?.items.length, 0);
});

test('同一份描述出现不同内存，仍然展示冲突', () => {
  const r = analyze({ device: 'laptop', listing: '内存16GB，配置说明内存8GB', reply: '', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'memory')?.conflict, true);
});

test('退出账号与激活锁是不同概念，不能直接判断冲突', () => {
  const r = analyze({ device: 'phone', listing: '已退出账号', reply: '有激活锁', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'lock')?.uncertain, true);
  assert.equal(r.rows.find(x => x.key === 'lock')?.conflict, false);
});

test('更换电池与声称无维修冲突，iPhone 不臆测电脑内存', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15 Pro，存储256GB，无拆修', reply: '换过电池', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'repair')?.conflict, true);
  assert.equal(r.rows.some(x => x.key === 'memory'), false);
  assert.equal(extract('没有提及配置', '商品描述').length, 0);
});

test('截图中的 Mac mini：利用已选型号，重点核对简称、公司设备和退换约定', () => {
  const listing = 'Mac mini M4 16+256，二六年八月末购入，9月2日激活使用，全套原盒、电源线，99新无划痕、买的时候是公司用的，现在不让用私人电脑了，所以出了\n支持上海地区自提，售出后不退不换，非偏远地区包邮';
  const r = analyze({ device: 'desktop', selectedModel: 'Mac mini M4', listing, reply: '', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'model')?.items[0].value, 'Mac mini M4');
  assert.ok(r.rows.find(x => x.key === 'memory')?.items[0].provisional);
  assert.ok(r.rows.find(x => x.key === 'storage')?.items[0].provisional);
  assert.ok(r.rows.find(x => x.key === 'accessories')?.items.length);
  assert.equal(r.rows.find(x => x.key === 'accessories')?.conflict, false);
  assert.ok(r.followups.some(q => q.includes('16+256') && q.includes('确认')));
  assert.ok(r.followups.some(q => q.includes('组织设备管理')));
  assert.ok(r.followups.some(q => q.includes('不退不换')));
  assert.ok(r.priorityQuestions.some(q => q.includes('组织设备管理')));
  assert.ok(r.priorityQuestions.some(q => q.includes('不退不换')));
  assert.equal(r.priorityQuestions.some(q => q.includes('16+256')), false);
  assert.ok(r.mentioned.includes('包含配件'));
  assert.equal(r.mentioned.includes('运行内存'), false);
  assert.ok(r.followups.some(q => q.includes('账号锁定')));
  assert.equal(r.followups.some(q => /具体型号、尺寸|集成显卡还是独立|运行内存是多少|存储容量是多少|包含哪些配件/.test(q)), false);
});

test('不同配件不是冲突，同一配件的有无说法相反才标记冲突', () => {
  const r = analyze({ device: 'desktop', listing: '全套原盒、电源线', reply: '不含电源线', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'accessories')?.conflict, true);
});

test('缩写是待确认线索，不遮蔽其他明确的配置冲突', () => {
  const r = analyze({ device: 'desktop', listing: '16+256，内存16GB', reply: '内存8GB', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'memory')?.conflict, true);
  assert.ok(r.priorityQuestions.some(q => q.includes('运行内存') && q.includes('不一致')));
  assert.ok(r.followups.some(q => q.includes('运行内存') && q.includes('不一致')));
});

test('明确故障、未移除的锁和维修线索不能因为卖家已描述而被忽略', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15，无面容，换过副厂电池，有激活锁', reply: '', observed: '' });
  assert.ok(r.priorityQuestions.some(q => q.includes('无面容') && q.includes('商品描述')));
  assert.ok(r.priorityQuestions.some(q => q.includes('有激活锁')));
  assert.ok(r.followups.some(q => q.includes('换过副厂电池') && q.includes('配件来源')));
  assert.equal(r.mentioned.includes('功能异常'), false);
  assert.equal(r.mentioned.includes('账号锁定'), false);
});

test('无问题和锁已解除的说法不应误报为明确故障或已锁', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15，无面容问题，没有激活锁', reply: '', observed: '' });
  assert.equal(r.priorityQuestions.some(q => q.includes('面容') || q.includes('激活锁')), false);
  assert.ok(r.followups.some(q => q.includes('官方流程确认账号和激活锁')));
});

test('常见交易和设备风险保留来源，分别给出具体的核对建议', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15，电池鼓包，进过水，有锁机，分期未结清，屏幕烧屏，显示未知部件', reply: '私下转账', observed: '' });
  for (const term of ['电池鼓包', '进过水', '有锁机', '分期未结清']) assert.ok(r.priorityQuestions.some(q => q.includes(term) && q.includes('商品描述')), term);
  assert.ok(r.priorityQuestions.some(q => q.includes('私下转账') && q.includes('卖家回复') && q.includes('平台')));
  assert.equal(r.batteryHazard, true);
  assert.ok(r.followups.some(q => q.includes('未知部件') && q.includes('多种原因')));
  assert.ok(r.followups.some(q => q.includes('屏幕烧屏')));
  assert.ok(r.followups.some(q => q.includes('屏幕烧屏') && q.includes('不要通电')));
  assert.equal(r.priorityQuestions.some(q => q.includes('未知部件')), false);
  assert.equal(r.sellerQuestions.some(q => q.includes('请停止使用和充电')), false);
  assert.equal(r.sellerQuestions.some(q => q.includes('不扫描来历不明的付款码')), false);
  assert.ok(r.sellerQuestions.some(q => q.includes('进过水')));
});

test('否认风险的常见表达不应被当成卖家承认风险', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15，没有电池鼓包，未曾进过水，不接受私下转账，无运营商锁，不需要卡贴机，没有未知部件，屏幕没有屏幕烧屏，分期已结清', reply: '', observed: '' });
  for (const term of ['电池鼓包', '进过水', '私下转账', '运营商锁', '卡贴机', '未知部件', '屏幕烧屏', '分期未结清']) assert.equal(r.followups.some(q => q.includes(`“${term}”`)), false, term);
  assert.equal(r.batteryHazard, false);
});

test('明确的 iPhone 标题容量按原文记录，其他来源冲突仍能识别', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15 Pro 256G', reply: '存储128GB', observed: '' });
  assert.equal(r.rows.find(x => x.key === 'storage')?.items[0].value, '256 GB');
  assert.equal(r.rows.find(x => x.key === 'storage')?.conflict, true);
  assert.ok(r.priorityQuestions.some(q => q.includes('存储容量') && q.includes('不一致')));
});

test('电池损伤时不建议进行显示或电池通电测试', () => {
  const r = analyze({ device: 'phone', listing: 'iPhone 15，电池有点鼓包，屏幕花屏', reply: '', observed: '' });
  assert.equal(r.batteryHazard, true);
  assert.ok(r.followups.some(q => q.includes('屏幕花屏') && q.includes('不要通电')));
  assert.equal(r.followups.some(q => q.includes('验货时测试显示效果')), false);
  assert.ok(r.followups.some(q => q.includes('不要通电或充电测试')));
});

test('运营商锁与具体设备类别关联，不把相机描述误当作手机限制', () => {
  const r = analyze({ device: 'camera', listing: '相机描述：无运营商锁', reply: '', observed: '' });
  assert.equal(r.followups.some(q => q.includes('运营商锁')), false);
});

test('设备专属风险按类别识别，同时保留常见否定与已解除表达', () => {
  const camera = analyze({ device: 'camera', listing: '佳能相机，镜头发霉，快门故障', reply: '', observed: '' });
  assert.ok(camera.followups.some(q => q.includes('镜头发霉') && q.includes('镜片') === false));
  assert.ok(camera.priorityQuestions.some(q => q.includes('快门故障')));
  const computer = analyze({ device: 'laptop', listing: '笔记本 BIOS锁，硬盘坏道', reply: '', observed: '' });
  assert.ok(computer.priorityQuestions.some(q => q.includes('BIOS锁')));
  assert.ok(computer.followups.some(q => q.includes('硬盘坏道')));
  const phone = analyze({ device: 'phone', listing: 'iPhone 15，扩容过，换过主板', reply: '', observed: '' });
  assert.ok(phone.followups.some(q => q.includes('扩容过')));
  assert.ok(phone.followups.some(q => q.includes('换过主板')));
  const other = analyze({ device: 'phone', listing: '手机镜头发霉', reply: '', observed: '' });
  assert.equal(other.followups.some(q => q.includes('“镜头发霉”')), false);
  const clear = analyze({ device: 'laptop', listing: 'BIOS锁已解除，没有硬盘坏道', reply: '', observed: '' });
  assert.equal(clear.followups.some(q => q.includes('“BIOS锁”') || q.includes('“硬盘坏道”')), false);
});

test('电脑有电池损伤线索时，设备专属提示也不建议通电检查', () => {
  const r = analyze({ device: 'laptop', listing: '笔记本电池鼓包，硬盘坏道', reply: '', observed: '' });
  assert.ok(r.followups.some(q => q.includes('硬盘坏道') && q.includes('不要通电')));
  assert.equal(r.followups.some(q => q.includes('验货时检查相应功能')), false);
});
