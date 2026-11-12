import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recognizeListing } from './recognize';

test('识别商品类型、品牌和型号，不把目录外的型号当作已核验', () => {
  assert.deepEqual(recognizeListing('松下 剃须刀 es-lm36'), { device: 'shaver', brand: '松下 Panasonic', model: 'ES-LM36', unlistedModel: true, ambiguous: false });
  assert.deepEqual(recognizeListing('iPhone 15 Pro Max 256GB'), { device: 'phone', brand: '苹果 Apple', model: 'iPhone 15 Pro Max', unlistedModel: false, ambiguous: false });
  assert.deepEqual(recognizeListing('佳能相机 EOS R50'), { device: 'camera', brand: '佳能 Canon', model: 'EOS R50', unlistedModel: false, ambiguous: false });
  assert.equal(recognizeListing('佳能相机 EOS R500').model, undefined);
  assert.equal(recognizeListing('松下剃须刀').model, undefined);
  assert.deepEqual(recognizeListing('MacBook Pro M1，内存 16GB'), { device: 'laptop', brand: '苹果 Apple', model: 'MacBook Pro', unlistedModel: true, ambiguous: false });
});

test('多种设备或缺少依据时不猜测类型', () => {
  assert.deepEqual(recognizeListing('iPhone 15 Pro 和 AirPods 4'), { ambiguous: true });
  assert.deepEqual(recognizeListing('内存 16GB，存储 512GB'), { ambiguous: false });
  assert.deepEqual(recognizeListing('https://example.com/iphone-15-pro'), { ambiguous: false });
});
