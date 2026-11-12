export const applePhoneRegions = ['国行', '港版', '台版', '美版', '日版', '欧版'] as const;
export type PhoneRegion = '' | typeof applePhoneRegions[number];

// 法国监管抽检样机只能提供型号线索，不能推断实机购买地或覆盖整个欧洲。
const frenchTests: Record<string, string> = {
  'iPhone 15 Pro Max': 'https://www.anfr.fr/das/COM054240002/NAN-COM054240002-01%20%201-7502-24-61-02_TR1-R01.pdf',
  'iPhone 14 Pro Max': 'https://www.anfr.fr/das/COM013230001/AM-COM013230001-01%20%201-6460_23-18-02.pdf',
  'iPhone 14 Plus': 'https://www.anfr.fr/das/COM013230002/AM-COM013230002-01%20%201-6460_23-20-02.pdf',
  'iPhone 14': 'https://www.anfr.fr/das/COM013230003/AM-COM013230003-01%20%201-6460_23-10-02.pdf',
  'iPhone 13 mini': 'https://www.anfr.fr/das/COM091220013/VIL-COM0912200013-02%20%201-4050_22-12-02.pdf',
  'iPhone 13': 'https://www.anfr.fr/das/COM044210022/DON-COM044210022-03%20%201-1800_21-229-02.pdf',
  'iPhone 12 Pro Max': 'https://www.anfr.fr/das/COM062210010/TOU-COM062210010-02%20%201-1800_21-193-02.pdf',
  'iPhone 12 Pro': 'https://www.anfr.fr/das/COM062210001/VIL-COM062210001-02%20%201-1800_21-164-02.pdf',
  'iPhone 12 mini': 'https://www.anfr.fr/das/COM054210041/NAN-COM054210041-02%20%201-1800_21-268-02.pdf',
  'iPhone 12': 'https://www.anfr.fr/fileadmin/CP/CP_2023/CP_MAJ_APPLE_vdef_fr.pdf',
  'iPhone SE（第 2 代）': 'https://www.anfr.fr/das/COM083200016/AM-COM083200016-02%20%201-0026_20-97-02.pdf'
};

export function phoneRegions(isApple: boolean): readonly PhoneRegion[] {
  return isApple ? applePhoneRegions : ['国行'];
}

export function appleRegionGuidance(region: PhoneRegion, model: string) {
  if (!region) return undefined;
  const knownModel = Object.keys(iphoneRegionNumbers).find(name => name.normalize('NFKC').replace(/\s+/g, '').toLowerCase() === model.normalize('NFKC').replace(/\s+/g, '').toLowerCase());
  const generation = knownModel?.normalize('NFKC').match(/^iphone\s*(\d{1,2})(?!\d)/i);
  const number = generation ? Number(generation[1]) : undefined;
  const steps = [
    `所选${region}是待核实的信息。请向卖家确认购买地区，在设置 → 通用 → 关于本机中点击型号号码右侧的部件号码，查看 A 开头的型号号码，并结合购买凭证核对；型号号码不一定能唯一确定销售地区。`,
    '请核对实体卡槽、eSIM、运营商锁及你要使用的运营商网络；不要仅凭地区版本判断能否使用或已解锁。',
    '保修适用地区和剩余期限请由持有人向 Apple 查询，避免仅凭版本名称作判断。'
  ];
  if (region === '欧版') steps.push('欧洲涉及多个销售国家或地区，请进一步确认具体销售地及当地规格。');
  if (/^iphone\s*air$/i.test(model.trim())) steps.push('Apple 中国大陆资料说明 iPhone Air 仅通过 eSIM 激活，不支持实体 SIM 卡；请先核对型号和拟使用的运营商。');
  if (region === '美版' && number && number >= 14 && number <= 16) steps.push('Apple 将在美国购买的 iPhone 14、15、16 系列及 16e 列为仅通过 eSIM 激活；具体型号和销售地仍须核实。');
  if (region === '美版' && number === 17) steps.push('Apple 将在美国购买的 iPhone 17 系列及 17e 列为仅通过 eSIM 激活；具体型号和购买地仍须核实。');
  if (region === '日版' && number === 17) steps.push('Apple 将在日本购买的 iPhone 17 系列及 17e 列为仅通过 eSIM 激活；具体型号和销售地仍须核实。');
  return { title: `iPhone ${region}：销售地区与网络`, steps, source: 'https://support.apple.com/zh-cn/118569' };
}

export function appleRegionIdentification(region: PhoneRegion, model: string) {
  if (!region) return undefined;
  const key = Object.keys(iphoneRegionNumbers).find(name => name.normalize('NFKC').replace(/\s+/g, '').toLowerCase() === model.normalize('NFKC').replace(/\s+/g, '').toLowerCase());
  if (!key) return undefined;
  if (region === '港版' && key === 'iPhone 13 mini') return {
    title: `${key} ${region}：型号资料有冲突`,
    steps: ['Apple 香港型号识别页将 A2629 列为中国大陆，将 A2628 列为其他国家和地区；Apple 西班牙识别页却将香港列在 A2629 下。两页说法不一致，港版对应号码待核实。', '请结合购买凭证、实际型号号码与 Apple 官方支持核对；不要单凭其中一个号码认定销售地或真伪。'],
    source: 'https://support.apple.com/zh-hk/108044'
  };
  if (region === '日版' && key === 'iPhone 16e') return {
    title: `${key} ${region}：型号资料有冲突`,
    steps: ['Apple 日本规格页及日本商店翻新机资料列出 A3409；Apple 俄语型号识别页将日本列在 A3408 下。官方页面说法不一致，日版对应号码待核实。', '请结合购买凭证、实际型号号码向 Apple 官方确认；不能仅凭其中一个号码认定销售地或真伪。'],
    source: 'https://support.apple.com/ru-ru/108044'
  };
  const code = iphoneRegionNumbers[key][region];
  const japanCarrier = region === '日版' && ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE（第 2 代）'].includes(key);
  const franceCarrier = region === '欧版' && ['iPhone 15 Pro', 'iPhone 14 Pro', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE（第 3 代）'].includes(key);
  const frenchTest = region === '欧版' && code ? frenchTests[key] : undefined;
  const networkSource = ['iPhone 17', 'iPhone 17e', 'iPhone Air'].includes(key) && (region === '港版' || region === '欧版') ? 'https://www.apple.com/hk/iphone/cellular/' : undefined;
  const europeanSource = key === 'iPhone 15' ? 'https://cdsassets.apple.com/live/6GJYWVAV/information/locale/fr-fr/ma2155_iphone-15-info.pdf' : key === 'iPhone 16' ? 'https://regulatoryinfo.apple.com/cwt/api/ext/file?fileId=energyLabels%2FA3287_V1%2FA3287%2FA3287_Product_Information_Sheet_EN_EU.pdf' : key === 'iPhone 15 Plus' || key === 'iPhone 16e' ? `https://regulatoryinfo.apple.com/cwt/api/ext/file?fileId=energyLabels%2F${code}_V1%2F${code}%2F${code}_Product_Information_Sheet_FR_French.pdf` : ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus'].includes(key) ? 'https://cdsassets.apple.com/live/6GJYWVAV/information/locale/fr-fr/iphone-16-info.pdf' : ['iPhone 17 Pro Max', 'iPhone 17 Pro'].includes(key) ? 'https://cdsassets.apple.com/live/6GJYWVAV/information/locale/fr-fr/iphone-17-pro-info.pdf' : undefined;
  return {
    title: `${key} ${region}：型号号码`,
    steps: [code
      ? frenchTest
        ? `法国频率管理机构公开的抽检资料记录 ${key} 样机型号为 ${code}；这是法国市场的型号线索，不能仅凭号码确认此机销售地或真伪，也不代表所有欧洲国家。`
        : japanCarrier
        ? `日本运营商 KCN 的兼容性清单称，测试的是日本销售的 ${key} 型号 ${code}；这是该运营商的测试记录，不能仅凭号码确认此机销售地或真伪。`
        : franceCarrier
        ? `法国运营商 Free 的网络兼容清单列出 ${key} 的 ${code}；这是法国网络兼容线索，不代表全部欧洲国家，不能仅凭号码确认此机销售地或真伪，具体销售地仍待核实。`
        : networkSource
        ? `Apple 网络型号表将 ${code} 与香港及法国、爱尔兰等国家或地区列在一起；它仅是网络地区线索，不能仅凭号码确认销售地或真伪。`
        : region === '欧版' && europeanSource
        ? `Apple 欧洲资料列出 ${code}；这是部分欧洲市场的型号依据，不保证涵盖全部欧洲国家，也不能仅凭它确认销售地或真伪。`
        : region === '台版'
        ? `Apple 台湾 NCC 认证清单列出 ${code}；认证型号也可能用于其他地区，不能仅凭它确认销售地或真伪。`
        : `Apple 识别资料将 ${code} 列为该地区销售的型号之一；部分型号号码也用于其他地区，不能仅凭它确认销售地或真伪。`
      : 'Apple 识别资料中未明确列出该地区的独立型号号码，记为待核实；请结合购买凭证及官方支持核对。'],
    source: frenchTest ?? (japanCarrier ? 'https://www.kcn.jp/service/mobile/typea/device/apple.html' : franceCarrier ? 'https://assistance-1.free.fr/mobile/terminaux/' : undefined) ?? networkSource ?? (region === '欧版' && code && europeanSource ? europeanSource : region === '台版' && code ? 'https://www.apple.com/tw/nccid/' : 'https://support.apple.com/zh-cn/108044')
  };
}

export function appleEsimGuidance(region: PhoneRegion, model = '') {
  if (!region) return undefined;
  if (region === '国行') {
    const key = Object.keys(iphoneRegionNumbers).find(name => name.normalize('NFKC').replace(/\s+/g, '').toLowerCase() === model.normalize('NFKC').replace(/\s+/g, '').toLowerCase());
    if (key !== 'iPhone Air' && key !== 'iPhone 17e') return undefined;
    return {
      title: `${key}：中国大陆 eSIM 核对`,
      steps: [
        `Apple 列出 ${key} 的${key === 'iPhone Air' ? ' A3518' : ' A3635'} 支持中国大陆 eSIM；请先核对实机 A 开头的型号号码与购买凭证，不能仅凭选择“国行”认定。`,
        key === 'iPhone Air' ? 'iPhone Air 只能通过 eSIM 激活，不支持实体 SIM 卡。' : 'iPhone 17e 可通过 eSIM 或实体 nano-SIM 卡激活；请核对实机卡槽与运营商支持。',
        'Apple 说明在中国大陆激活 eSIM 需前往运营商营业厅办理身份核验；是否符合具体办理条件请向运营商确认，不需要在验机时办理。'
      ],
      source: 'https://support.apple.com/zh-hk/123879'
    };
  }
  return {
    title: '境外购买的 iPhone：大陆 eSIM',
    steps: ['若确认设备在中国大陆境外购买，Apple 提示不能安装中国大陆运营商提供的 eSIM；选择地区不等于已核实购买地，请结合实机和运营商确认使用方案。'],
    source: 'https://support.apple.com/zh-cn/123879'
  };
}
import { iphoneRegionNumbers } from './iphone-region-numbers';

