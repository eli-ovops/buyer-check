// Product names are navigation suggestions, not verified specifications or proof of condition.
export type Device = 'phone' | 'laptop' | 'tablet' | 'desktop' | 'camera' | 'lens' | 'drone' | 'console' | 'headphones' | 'watch' | 'gpu' | 'shaver' | 'other';
export type Brand = { name: string; models: string[] };
export const devices: { id: Device; label: string }[] = [
  { id: 'phone', label: '手机' }, { id: 'laptop', label: '笔记本电脑' },
  { id: 'tablet', label: '平板电脑' }, { id: 'desktop', label: '台式电脑 / 主机' },
  { id: 'camera', label: '相机 / 运动相机' }, { id: 'lens', label: '相机镜头' },
  { id: 'drone', label: '无人机' }, { id: 'console', label: '游戏机 / 掌机' },
  { id: 'headphones', label: '耳机' }, { id: 'watch', label: '智能手表' },
  { id: 'gpu', label: '显卡' }, { id: 'shaver', label: '电动剃须刀' }, { id: 'other', label: '其他数码设备' }
];

export const catalog: Record<Device, Brand[]> = {
  phone: [
    { name: '苹果 Apple', models: ['iPhone 17 Pro Max','iPhone 17 Pro','iPhone 17','iPhone 17e','iPhone Air','iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16 Plus','iPhone 16','iPhone 16e','iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15 Plus','iPhone 15','iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14 Plus','iPhone 14','iPhone 13 Pro Max','iPhone 13 Pro','iPhone 13 mini','iPhone 13','iPhone 12 Pro Max','iPhone 12 Pro','iPhone 12 mini','iPhone 12','iPhone 11 Pro Max','iPhone 11 Pro','iPhone 11','iPhone SE（第 3 代）','iPhone SE（第 2 代）'] },
    { name: '华为 HUAWEI', models: ['Mate 80 Pro Max','Mate 80 Pro','Mate 80','Mate 70 RS','Mate 70 Pro+','Mate 70 Pro','Mate 70','Mate 60 Pro+','Mate 60 Pro','Mate 60','Pura 80 Ultra','Pura 80 Pro+','Pura 80 Pro','Pura 80','Pura 70 Ultra','Pura 70 Pro+','Pura 70 Pro','Pura 70','Mate X7','Mate X6','Mate X5','Pura X','nova 15 Ultra','nova 15 Pro','nova 15','nova 14 Ultra','nova 14 Pro','nova 14','nova 13 Pro','nova 13','nova 12 Pro','nova 12'] },
    { name: '小米 Xiaomi', models: ['Xiaomi 15S Pro','Xiaomi 15 Ultra','Xiaomi 15 Pro','Xiaomi 15','Xiaomi 14 Ultra','Xiaomi 14 Pro','Xiaomi 14','Xiaomi 13 Ultra','Xiaomi 13 Pro','Xiaomi 13','Xiaomi MIX Fold 4','Xiaomi MIX Flip'] },
    { name: '红米 REDMI', models: ['REDMI K80 Pro','REDMI K80','Redmi K70 至尊版','Redmi K70 Pro','Redmi K70','Redmi Note 14 Pro+','Redmi Note 14 Pro','Redmi Note 14'] },
    { name: '荣耀 HONOR', models: ['荣耀 Magic7 RSR','荣耀 Magic7 Pro','荣耀 Magic7','荣耀 Magic6 Pro','荣耀 Magic6','荣耀 200 Pro','荣耀 200'] },
    { name: 'OPPO', models: ['OPPO Find X9 Ultra','OPPO Find X9 Pro','OPPO Find X9','OPPO Find X8 Ultra','OPPO Find X8 Pro','OPPO Find X8','OPPO Find X7 Ultra','OPPO Find X7','OPPO Find N5','OPPO Find N3','OPPO Reno15 Pro','OPPO Reno15','OPPO Reno14 Pro','OPPO Reno14','OPPO Reno13 Pro','OPPO Reno13','OPPO Reno12 Pro','OPPO Reno12'] },
    { name: '一加 OnePlus', models: ['OnePlus 13','OnePlus 12','OnePlus Ace 3 Pro','OnePlus Ace 3'] },
    { name: '真我 realme', models: ['realme GT7 Pro','realme GT6','realme GT5 Pro'] },
    { name: 'vivo', models: ['vivo X200 Ultra','vivo X200 Pro','vivo X200 Pro mini','vivo X200s','vivo X200','vivo X100 Ultra','vivo X100 Pro','vivo X100','vivo X Fold5','vivo X Fold3 Pro','vivo X Fold3'] },
    { name: 'iQOO', models: ['iQOO 13','iQOO 12 Pro','iQOO 12','iQOO 11 Pro','iQOO 11','iQOO Neo10 Pro+','iQOO Neo10 Pro','iQOO Neo10','iQOO Neo9 Pro','iQOO Neo9'] },
    { name: '三星 Samsung', models: ['Galaxy S25 Ultra','Galaxy S25+','Galaxy S25','Galaxy S24 Ultra','Galaxy S24+','Galaxy S24','Galaxy S23 Ultra','Galaxy S23+','Galaxy S23','Galaxy Z Fold6','Galaxy Z Flip6','Galaxy Z Fold5','Galaxy Z Flip5'] },
    { name: '谷歌 Google', models: ['Pixel 9 Pro XL','Pixel 9 Pro','Pixel 9','Pixel 8 Pro','Pixel 8','Pixel 7 Pro','Pixel 7'] },
    { name: '索尼 Sony', models: ['Xperia 1 VI','Xperia 1 V','Xperia 5 V'] },
    { name: '魅族 Meizu', models: ['魅族 21 Pro','魅族 21','魅族 20 Pro','魅族 20'] },
    { name: '努比亚 nubia', models: ['红魔 9 Pro','nubia Z60 Ultra'] },
    { name: '摩托罗拉 Motorola', models: ['moto razr 50 Ultra','moto razr 50','moto X50 Ultra'] }
  ],
  laptop: [
    { name: '苹果 Apple', models: ['MacBook Air 13 英寸 M1','MacBook Air 13 英寸 M2','MacBook Air 13 英寸 M3','MacBook Air 13 英寸 M4','MacBook Air 15 英寸 M2','MacBook Air 15 英寸 M3','MacBook Air 15 英寸 M4','MacBook Pro 13 英寸 M1','MacBook Pro 13 英寸 M2','MacBook Pro 14 英寸 M1 Pro','MacBook Pro 14 英寸 M1 Max','MacBook Pro 14 英寸 M2 Pro','MacBook Pro 14 英寸 M2 Max','MacBook Pro 14 英寸 M3','MacBook Pro 14 英寸 M3 Pro','MacBook Pro 14 英寸 M3 Max','MacBook Pro 14 英寸 M4','MacBook Pro 14 英寸 M4 Pro','MacBook Pro 14 英寸 M4 Max','MacBook Pro 14 英寸 M5','MacBook Pro 14 英寸 M5 Pro','MacBook Pro 14 英寸 M5 Max','MacBook Pro 16 英寸 M1 Pro','MacBook Pro 16 英寸 M1 Max','MacBook Pro 16 英寸 M2 Pro','MacBook Pro 16 英寸 M2 Max','MacBook Pro 16 英寸 M3 Pro','MacBook Pro 16 英寸 M3 Max','MacBook Pro 16 英寸 M4 Pro','MacBook Pro 16 英寸 M4 Max','MacBook Pro 16 英寸 M5 Pro','MacBook Pro 16 英寸 M5 Max'] },
    { name: '联想 Lenovo', models: ['小新 Pro 14','小新 Pro 16','小新 Air 14','拯救者 Y9000P','拯救者 Y7000P','拯救者 R9000P','拯救者 R7000P','ThinkBook 14+','ThinkBook 16+','ThinkPad X1 Carbon','ThinkPad X13','ThinkPad T14','ThinkPad E14','YOGA Pro 14s'] },
    { name: '华为 HUAWEI', models: ['MateBook X Pro','MateBook X','MateBook 14','MateBook 16s','MateBook D 14','MateBook D 16','MateBook Pro','MateBook Fold'] },
    { name: '戴尔 Dell', models: ['XPS 13','XPS 15','XPS 17','Inspiron 14','Latitude 7440','Alienware m16','Alienware m18'] },
    { name: '惠普 HP', models: ['战 66','星 Book Pro 14','暗影精灵 10','暗影精灵 9','Spectre x360 14','EliteBook 840'] },
    { name: '华硕 ASUS', models: ['灵耀 14','无畏 14','天选 5','天选 4','ROG 幻 14','ROG 幻 16','ROG 枪神 8','ROG 魔霸新锐'] },
    { name: '宏碁 Acer', models: ['非凡 Go','掠夺者 擎 Neo','暗影骑士·擎','Swift Go 14'] },
    { name: '微软 Microsoft', models: ['Surface Laptop 7','Surface Laptop 6','Surface Laptop 5','Surface Laptop Studio 2','Surface Pro 11','Surface Pro 9'] },
    { name: '小米 Xiaomi', models: ['Xiaomi Book Pro 14','Xiaomi Book Pro 16','REDMI Book Pro 14','REDMI Book Pro 16'] },
    { name: '荣耀 HONOR', models: ['荣耀 MagicBook Art 14','荣耀 MagicBook Pro 16','荣耀 MagicBook X 14','荣耀 MagicBook X 16'] },
    { name: '雷蛇 Razer', models: ['Razer Blade 14','Razer Blade 16','Razer Blade 18'] },
    { name: '微星 MSI', models: ['微星 泰坦','微星 绝影','微星 冲锋坦克'] },
    { name: '机械革命 MECHREVO', models: ['蛟龙 16 Pro','极光 Pro','无界 14'] }
  ],
  tablet: [
    { name: '苹果 Apple', models: ['iPad Pro 13 英寸（M5）','iPad Pro 13 英寸（M4）','iPad Pro 12.9 英寸（第 6 代）','iPad Pro 12.9 英寸（第 5 代）','iPad Pro 11 英寸（M5）','iPad Pro 11 英寸（M4）','iPad Air 13 英寸（M3）','iPad Air 13 英寸（M2）','iPad Air 11 英寸（M3）','iPad Air 11 英寸（M2）','iPad Air（第 5 代）','iPad（A16）','iPad（第 10 代）','iPad（第 9 代）','iPad mini（A17 Pro）','iPad mini（第 6 代）'] },
    { name: '华为 HUAWEI', models: ['MatePad Pro 13.2 英寸','MatePad Pro 12.2 英寸','MatePad Air','MatePad 11.5 S','MatePad 11','MatePad Mini'] },
    { name: '小米 Xiaomi', models: ['小米平板 7 Pro','小米平板 7','小米平板 6S Pro','小米平板 6 Pro','小米平板 6','Redmi Pad Pro','Redmi Pad'] },
    { name: '荣耀 HONOR', models: ['荣耀平板 MagicPad 2','荣耀平板 MagicPad','荣耀平板 V8 Pro','荣耀平板 9'] },
    { name: 'OPPO', models: ['OPPO Pad 3 Pro','OPPO Pad 3','OPPO Pad 2','OPPO Pad Air'] },
    { name: 'vivo', models: ['vivo Pad5 Pro','vivo Pad5','vivo Pad3 Pro','vivo Pad3','vivo Pad2'] },
    { name: '三星 Samsung', models: ['Galaxy Tab S9 Ultra','Galaxy Tab S9+','Galaxy Tab S9','Galaxy Tab S8 Ultra','Galaxy Tab S8'] },
    { name: '微软 Microsoft', models: ['Surface Pro 11','Surface Pro 9','Surface Pro 8','Surface Go 4'] },
    { name: '联想 Lenovo', models: ['拯救者 Y700','小新 Pad Pro','小新 Pad'] }
  ],
  desktop: [
    { name: '苹果 Apple', models: ['Mac mini M1','Mac mini M2','Mac mini M4','iMac 24 英寸','Mac Studio','Mac Pro'] },
    { name: '联想 Lenovo', models: ['拯救者 刃 7000','拯救者 刃 9000','ThinkCentre M 系列','天逸 510'] },
    { name: '戴尔 Dell', models: ['OptiPlex 系列','Alienware Aurora 系列','Inspiron 台式机系列'] },
    { name: '惠普 HP', models: ['战 99 系列','OMEN 暗影精灵台式机系列','EliteDesk 系列'] },
    { name: '华硕 ASUS', models: ['ROG 电竞主机系列','天选 X 系列'] },
    { name: '自组装', models: [] }
  ],
  camera: [
    { name: '索尼 Sony', models: ['Alpha 7 IV（ILCE-7M4）','Alpha 7 III（ILCE-7M3）','Alpha 7R V（ILCE-7RM5）','Alpha 7C II','Alpha 7C','Alpha 6700','Alpha 6400','ZV-E10','ZV-E10 II','ZV-1','FX3','FX30'] },
    { name: '佳能 Canon', models: ['EOS R5','EOS R6','EOS R6 Mark II','EOS R8','EOS R7','EOS R10','EOS R50','EOS R100','EOS R','EOS RP','EOS 90D','EOS 5D Mark IV'] },
    { name: '尼康 Nikon', models: ['Nikon Z9','Nikon Z8','Nikon Z7II','Nikon Z6III','Nikon Z6II','Nikon Z6','Nikon Z5II','Nikon Z5','Nikon Zf','Nikon Zfc','Nikon Z50II','Nikon Z50','Nikon Z30'] },
    { name: '富士 FUJIFILM', models: ['X100VI','X100V','X-T5','X-T4','X-S20','X-S10','X-H2','X-H2S','X-M5'] },
    { name: '松下 Panasonic', models: ['LUMIX S5II','LUMIX S5','LUMIX GH6','LUMIX GH5'] },
    { name: '大疆 DJI', models: ['Osmo Pocket 3','DJI Pocket 2','Osmo Action 6','Osmo Action 5 Pro','Osmo Action 4','Osmo Action 3','Osmo 360'] },
    { name: '影石 Insta360', models: ['Insta360 X4','Insta360 X3','Insta360 GO 3','Insta360 Ace Pro'] },
    { name: 'GoPro', models: ['HERO13 Black','HERO12 Black','HERO11 Black','HERO10 Black'] }
  ],
  lens: [
    { name: '佳能 Canon', models: ['RF 24-105mm F4 L IS USM','RF 50mm F1.8 STM','RF-S 18-45mm F4.5-6.3 IS STM','EF 50mm f/1.8 STM'] },
    { name: '索尼 Sony', models: ['FE 24-70mm F2.8 GM II','FE 24-105mm F4 G OSS','FE 35mm F1.8','E 18-135mm F3.5-5.6 OSS'] },
    { name: '尼康 Nikon', models: ['NIKKOR Z 24-70mm f/4 S','NIKKOR Z 50mm f/1.8 S','NIKKOR Z DX 16-50mm f/3.5-6.3 VR'] },
    { name: '适马 SIGMA', models: ['24-70mm F2.8 DG DN II | Art','18-50mm F2.8 DC DN | Contemporary'] },
    { name: '腾龙 TAMRON', models: ['28-75mm F/2.8 Di III VXD G2','17-70mm F/2.8 Di III-A VC RXD'] },
    { name: '富士 FUJIFILM', models: ['XF 18-55mm F2.8-4 R LM OIS','XF 35mm F2 R WR'] }
  ],
  drone: [
    { name: '大疆 DJI', models: ['DJI Mavic 3 Pro','DJI Mavic 3','DJI Air 3','DJI Air 2S','DJI Mini 4 Pro','DJI Mini 3 Pro','DJI Mini 3','DJI Mini 2','DJI Avata 2','DJI Avata','DJI Neo'] },
    { name: '道通 Autel', models: ['EVO II Pro','EVO Lite+','EVO Nano+'] }
  ],
  console: [
    { name: '索尼 Sony', models: ['PlayStation 5 Pro','PlayStation 5','PlayStation 4 Pro','PlayStation 4','PlayStation Portal'] },
    { name: '任天堂 Nintendo', models: ['Nintendo Switch（OLED 款）','Nintendo Switch','Nintendo Switch Lite'] },
    { name: '微软 Microsoft', models: ['Xbox Series X','Xbox Series S','Xbox One X','Xbox One S'] },
    { name: 'Valve', models: ['Steam Deck OLED','Steam Deck'] },
    { name: '华硕 ASUS', models: ['ROG Ally X','ROG Ally'] },
    { name: '联想 Lenovo', models: ['Legion Go'] }
  ],
  headphones: [
    { name: '苹果 Apple', models: ['AirPods 5','AirPods Pro 3','AirPods Pro 2（USB-C）','AirPods Pro 2（闪电）','AirPods Pro（第 1 代）','AirPods 4（主动降噪）','AirPods 4','AirPods 3','AirPods 2','AirPods Max 2','AirPods Max 1（USB-C）','AirPods Max 1（闪电）'] },
    { name: '索尼 Sony', models: ['WH-1000XM5','WH-1000XM4','WF-1000XM5','WF-1000XM4','LinkBuds S'] },
    { name: '华为 HUAWEI', models: ['FreeBuds Pro 4','FreeBuds Pro 3','FreeBuds 6','FreeBuds 5','FreeClip'] },
    { name: 'Bose', models: ['QuietComfort Ultra Headphones','QuietComfort Headphones','QuietComfort Ultra Earbuds'] },
    { name: '森海塞尔 Sennheiser', models: ['MOMENTUM 4 Wireless','MOMENTUM True Wireless 4'] },
    { name: 'Beats', models: ['Beats Studio Pro','Beats Fit Pro','Beats Solo 4'] },
    { name: '小米 Xiaomi', models: ['Xiaomi Buds 5','Xiaomi Buds 4 Pro','Redmi Buds 5 Pro'] }
  ],
  watch: [
    { name: '苹果 Apple', models: ['Apple Watch Ultra 2','Apple Watch Ultra','Apple Watch Series 10','Apple Watch Series 9','Apple Watch Series 8','Apple Watch SE（第 2 代）'] },
    { name: '华为 HUAWEI', models: ['HUAWEI WATCH 4 Pro','HUAWEI WATCH 4','HUAWEI WATCH GT 5 Pro','HUAWEI WATCH GT 5','HUAWEI WATCH GT 4','HUAWEI WATCH FIT 3'] },
    { name: '小米 Xiaomi', models: ['Xiaomi Watch S4','Xiaomi Watch S3','Redmi Watch 4'] },
    { name: '三星 Samsung', models: ['Galaxy Watch7','Galaxy Watch6','Galaxy Watch5'] },
    { name: '佳明 Garmin', models: ['fēnix 7','Forerunner 965','Forerunner 265','Venu 3'] }
  ],
  gpu: [
    { name: 'NVIDIA', models: ['GeForce RTX 5090','GeForce RTX 5080','GeForce RTX 5070','GeForce RTX 4090','GeForce RTX 4080 SUPER','GeForce RTX 4080','GeForce RTX 4070 SUPER','GeForce RTX 4070','GeForce RTX 4060 Ti','GeForce RTX 4060','GeForce RTX 3090','GeForce RTX 3080','GeForce RTX 3070','GeForce RTX 3060 Ti','GeForce RTX 3060'] },
    { name: 'AMD', models: ['Radeon RX 7900 XTX','Radeon RX 7900 XT','Radeon RX 7800 XT','Radeon RX 7700 XT','Radeon RX 7600','Radeon RX 6900 XT','Radeon RX 6800 XT','Radeon RX 6700 XT'] },
    { name: '英特尔 Intel', models: ['Intel Arc A770','Intel Arc A750','Intel Arc B580'] },
    { name: '华硕 ASUS', models: [] }, { name: '微星 MSI', models: [] }, { name: '技嘉 GIGABYTE', models: [] },
    { name: '七彩虹 Colorful', models: [] }, { name: '影驰 GALAX', models: [] }, { name: '蓝宝石 Sapphire', models: [] }
  ],
  shaver: [
    { name: '松下 Panasonic', models: ['ES-JLM36', 'ES-MLM36', 'ES-LM31', 'ES-CT30', 'ES-LV74', 'ES-LV9C', 'ES-LV5A', 'ES-LV9A'] },
    { name: '飞利浦 Philips', models: [] }, { name: '博朗 Braun', models: [] }
  ],
  other: []
};

function normalize(value: string): string { return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim(); }
export function brandSuggestions(device: Device): string[] { return catalog[device].map(brand => brand.name); }
export function modelSuggestions(device: Device, brand: string): string[] {
  const query = normalize(brand);
  if (!query) return [];
  const exact = catalog[device].filter(item => normalize(item.name) === query);
  const candidates = exact.length ? exact : catalog[device].filter(item => normalize(item.name).includes(query));
  return [...new Set(candidates.flatMap(item => item.models))];
}
