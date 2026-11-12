import type { Device } from './catalog';
import type { AdditionalBrand } from './other-brand-guides';

/** 型号资料只证明标注的事实，不能证明实机系统或验机入口。 */
export type ModelEvidence = {
  device: Device;
  brand: AdditionalBrand;
  model: string;
  identity: string;
  source?: string;
};
type Row = readonly [string, string, string?];
const xiaomi: Row[] = [
  ['Xiaomi 15S Pro', '中国大陆厂商产品页列有此型号；与 15 Pro 区分。', 'https://www.mi.com/prod/xiaomi-15s-pro'],
  ['Xiaomi 15 Pro', '小米集团发布资料称 Xiaomi 15 系列搭载澎湃 OS 2，并明确包含 Xiaomi 15 Pro；当前系统和销售地区需另行核对。', 'https://ir.mi.com/system/files-encrypted/nasdaq_kms/assets/2024/11/18/5-32-31/24Q3_Announcement.pdf'],
  ['Xiaomi 15', '小米集团发布资料称 Xiaomi 15 系列搭载澎湃 OS 2，并明确包含 Xiaomi 15；当前系统和销售地区需另行核对。', 'https://ir.mi.com/system/files-encrypted/nasdaq_kms/assets/2024/11/18/5-32-31/24Q3_Announcement.pdf'],
  ['Xiaomi 14 Ultra', '小米中国大陆厂商产品页列有此型号；国行具体系统和电池健康入口待核实。', 'https://www.mi.com/prod/xiaomi-14-ultra/specs'],
  ['Xiaomi 14 Pro', '小米集团资料称中国大陆发布的 Xiaomi 14 系列搭载澎湃 OS，页面规格以 Xiaomi 14 Pro 为例；系统具体版本、当前系统及销售地区需另行核对。', 'https://ir.mi.com/static-files/645b5520-40a0-4840-b88e-57ebbab1e880'],
  ['Xiaomi 14', '小米集团资料称中国大陆发布的 Xiaomi 14 系列搭载澎湃 OS；系统具体版本、当前系统及销售地区需另行核对。', 'https://ir.mi.com/static-files/645b5520-40a0-4840-b88e-57ebbab1e880'],
  ['Xiaomi 13 Ultra', '小米中国大陆产品资料列有此型号；国行当前系统需核对。', 'https://www.mi.com/xiaomi-13-ultra'],
  ['Xiaomi 13 Pro', '小米中国大陆规格页面列有 MIUI 14，二手机当前系统需另行核对。', 'https://www.mi.com/xiaomi-13-pro/specs'],
  ['Xiaomi 13', '小米中国大陆资料列出 Xiaomi 13 系列搭载 MIUI 14；当前系统需另行核对。', 'https://ir.mi.com/static-files/0935e50a-7984-4d69-8d91-f809e1f99c28'],
  ['REDMI K80 Pro', '中国大陆厂商参数页列有 K80 Pro；不要与 K80 混淆。', 'https://www.mi.com/prod/redmi-k80-pro/specs'],
  ['REDMI K80', '厂商公告曾列出 K80 搭载澎湃 OS 2；当前版本应查看实机。', 'https://ir.mi.com/system/files-encrypted/nasdaq_kms/assets/2025/04/24/5-27-15/%E8%8B%B1%E6%96%87.pdf'],
  ['Redmi K70 至尊版', '中国大陆厂商参数页列有 K70 至尊版；不要与 K70 混淆。', 'https://www.mi.com/prod/redmi-k70-ultra/specs'],
  ['Redmi K70', '厂商页面列有 Redmi K70；具体出厂与当前系统版本待核实。', 'https://www.mi.com/redmi-k70/specs'],
  ['Redmi Note 14 Pro+', '小米中国商城列有此型号；国行系统和电池健康入口待核实。', 'https://www.mi.com/shop/buy/detail?cfrom=search&product_id=20425'],
  ['Redmi Note 14', '国行完整型号、网络版本和系统信息待核实。'],
];
const oppo: Row[] = [
  ['OPPO Find X8', '中国大陆规格列出入网型号 PKB110 与 ColorOS 15.0；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x8/specs/'],
  ['OPPO Find X8 Pro', '中国大陆规格列出入网型号 PKC110 与 ColorOS 15.0；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x8-pro/specs/'],
  ['OPPO Find N3', '中国大陆规格列出入网型号 PHN110 与 ColorOS 13.2；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-find-n/find-n3/specs/'],
  ['OPPO Reno14', '中国大陆规格列出入网型号 PLA110 与 ColorOS 15.0；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-reno/reno14/specs/'],
  ['OPPO Reno14 Pro', '中国大陆规格列出入网型号 PKZ110 与 ColorOS 15.0；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-reno/reno14-pro/specs/'],
  ['OPPO Reno13', '中国大陆规格列出入网型号 PKM110 与 ColorOS 15.0；实机当前系统需另行核对。', 'https://www.oppo.com/cn/smartphones/series-reno/reno13/specs/'],
  ['OPPO Find X9 Ultra', '中国大陆规格列出入网型号 PMA110 和 ColorOS 16.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x9-ultra/specs/'],
  ['OPPO Find X9 Pro', '中国大陆规格列出 ColorOS 16；实机可能已更新。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x9-pro/specs/'],
  ['OPPO Find X9', '中国大陆规格列出入网型号 PLJ110 和 ColorOS 16.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x9/specs/'],
  ['OPPO Find X8 Ultra', '中国大陆规格列出入网型号 PKJ110 和 ColorOS 15.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x8-ultra/specs/'],
  ['OPPO Find X7 Ultra', '中国大陆规格列出入网型号 PHY110 和 ColorOS 14.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x7-ultra/specs/'],
  ['OPPO Find X7', '中国大陆规格列出入网型号 PHZ110 和 ColorOS 14.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-find-x/find-x7/specs/'],
  ['OPPO Find N5', '中国大陆规格列出 ColorOS 15.0；二手机可能已更新。', 'https://www.oppo.com/cn/smartphones/series-find-n/find-n5/specs/'],
  ['OPPO Reno15 Pro', '中国大陆规格列出入网型号 PLV110 和 ColorOS 16.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-reno/reno15-pro/specs/'],
  ['OPPO Reno15', '中国大陆规格列出入网型号 PLW110 和 ColorOS 16.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-reno/reno15/specs/'],
  ['OPPO Reno13 Pro', '中国大陆规格列出入网型号 PKK110 和 ColorOS 15.0；当前系统以实机为准。', 'https://www.oppo.com/cn/smartphones/series-reno/reno13-pro/specs/'],
  ['OPPO Reno12 Pro', '中国大陆规格列出 ColorOS 14.1；二手机可能已更新。', 'https://www.oppo.com/cn/smartphones/series-reno/reno12-pro/specs/'],
  ['OPPO Reno12', '中国大陆规格列出入网型号 PJV110 和 ColorOS 14.1；实机可能已更新。', 'https://www.oppo.com/cn/smartphones/series-reno/reno12/specs/'],
];
const vivo: Row[] = [
  ['vivo X200', 'vivo 中国规格列出全网通 V2415A、基于 Android 15 的 OriginOS 5；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/x200'],
  ['vivo X200 Pro', 'vivo 中国规格列出全网通 V2405A、V2405DA，含普通及卫星通信版本；基于 Android 15 的 OriginOS 5，当前系统需另行核对。', 'https://m.vivo.com.cn/vivo/param/x200pro'],
  ['vivo X200 Ultra', 'vivo 中国规格列出全网通 V2454A、V2454DA，含普通及卫星通信版本，基于 Android 15 的 OriginOS 5；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/x200ultra'],
  ['vivo X200 Pro mini', 'vivo 中国规格列出 Android 15 与 OriginOS 5；当前系统可能已更新。', 'https://www.vivo.com.cn/vivo/param/x200promini'],
  ['vivo X200s', 'vivo 中国发布资料提到 OriginOS 5；当前系统可能已更新。', 'https://www.vivo.com.cn/brand/news/detail?id=1307'],
  ['vivo X100 Ultra', 'vivo 中国规格列出 Android 14 与 OriginOS 4；当前系统可能已更新。', 'https://www.vivo.com.cn/vivo/param/x100ultra'],
  ['vivo X100 Pro', 'vivo 中国规格列出全网通 V2324A、基于 Android 14 的 OriginOS 4；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/x100pro'],
  ['vivo X100', 'vivo 中国规格列出全网通 V2309A、基于 Android 14 的 OriginOS 4；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/x100'],
  ['vivo X Fold5', 'vivo 中国规格列出 Android 15 与 OriginOS 5；当前系统可能已更新。', 'https://www.vivo.com.cn/vivo/param/xfold5'],
  ['vivo X Fold3 Pro', 'vivo 中国规格列出全网通 V2337A、基于 Android 14 的 OriginOS 4；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/xfold3pro'],
  ['vivo X Fold3', 'vivo 中国规格列出全网通 V2303A、基于 Android 14 的 OriginOS 4；当前系统和销售地区需另行核对。', 'https://www.vivo.com.cn/vivo/param/xfold3'],
];
const samsung: Row[] = [
  ['Galaxy Z Fold5', '三星中国支持页列出型号 SM-F9460；实机销售地区和当前 One UI 版本仍需核对。', 'https://www.samsung.com.cn/support/model/SM-F9460ZEHCHC/'],
  ['Galaxy Z Flip5', '三星中国支持页列出型号 SM-F7310；实机销售地区和当前 One UI 版本仍需核对。', 'https://www.samsung.com.cn/support/model.SM-F7310LGECHC/'],
];
const lenovoLaptops: Row[] = [
  ['小新 Pro 16', '联想搜索资料列出 ARH7、IAH7 用户指南，正文访问超时；其他年份和后缀待核实。', 'https://iknow.lenovo.com.cn/app/detail/204104'],
  ['小新 Air 14', '联想搜索资料列出 Air 14 ILL11 用户指南，正文访问超时；其他年份和后缀待核实。', 'https://iknow.lenovo.com.cn/detail/435413'],
  ['拯救者 Y7000P', '联想资料列有 2025 款 Windows 11 配置；其他年份及当前系统不能照搬。', 'https://www.lenovo.com.cn/wiki/notebook/page/119.html'],
  ['拯救者 R9000P', '联想资料列有 2025 款 Windows 11 配置；其他年份及当前系统不能照搬。', 'https://www.lenovo.com.cn/wiki/notebook/page/119.html'],
  ['拯救者 R7000P', '联想资料列有 2025 款 Windows 11 配置；其他年份及当前系统不能照搬。', 'https://www.lenovo.com.cn/wiki/notebook/page/119.html'],
  ['ThinkBook 14+', '厂商资料包含多个年份和配置，请核对完整机器型号及当前系统。', 'https://m.lenovo.com.cn/wiki/article-50093.html'],
  ['ThinkBook 16+', '厂商资料包含多个年份和配置，请核对完整机器型号及当前系统。', 'https://m.lenovo.com.cn/wiki/article-50093.html'],
  ['ThinkPad X1 Carbon', '联想列出 Gen 11 用户指南；不同代数和机器类型需分别核对。', 'https://www.lenovo.com.cn/wiki/article-206523.html'],
  ['ThinkPad X13', '联想列出 Gen 2 及 20WK 等机器类型指南；其他代数与版本需另核对。', 'https://www.lenovo.com.cn/wiki/article-195197.html'],
  ['YOGA Pro 14s', '联想列出 82D30002CD 的 Windows 11 配置；其他代次、配置和当前系统需另核对。', 'https://item.lenovo.com.cn/product/1018258.html'],
];
const asusLaptops: Row[] = [
  ['ROG 幻 14', '华硕资料列出幻14（2026）GA403G 等型号；不同年份和 Air 版本需分别核对。', 'https://www.asus.com.cn/support/faq/1045151/'],
  ['ROG 幻 16', '华硕资料列出幻16（2025）GA605K；不同年份、Air 或双屏版本需分别核对。', 'https://www.asus.com.cn/support/faq/1045151/'],
  ['ROG 枪神 8', '华硕产品页列有枪神8 G614；Plus 等其他版本需核对完整代号。', 'https://rog.asus.com.cn/laptops/rog-strix/rog-strix-g16-2024/'],
  ['ROG 魔霸新锐', '华硕资料列有不同年份的魔霸新锐；请核对年份和 G614 等完整代号。', 'https://www.asus.com.cn/support/faq/1045151/'],
];
const lenovoDesktops: Row[] = [
  ['拯救者 刃 7000', '联想资料列出刃 7000 系列多个后缀，先核对年份和完整机器型号。', 'https://tools.lenovo.com.cn/doc/detail/id/1946/h'],
  ['拯救者 刃 9000', '联想资料列出刃 9000 系列多个后缀，先核对年份和完整机器型号。', 'https://tools.lenovo.com.cn/doc/detail/id/1946/h'],
  ['ThinkCentre M 系列', '联想资料列出 M75s、M90q 等型号；请核对完整机器类型、出厂配置与使用单位。', 'https://m.lenovo.com.cn/wiki/article-49182.html'],
  ['天逸 510', '联想搜索资料列出天逸 510 系列和 510S 等后缀，正文访问超时；完整型号待核实。', 'https://www.lenovo.com.cn/wiki/article-50153.html'],
];
const asusDesktops: Row[] = [
  ['ROG 电竞主机系列', '这是产品系列而非具体型号；华硕列表搜索资料列有多种主机，正文访问超时，请核对完整机器代号。', 'https://rog.asus.com.cn/desktops-group/allmodels/'],
  ['天选 X 系列', '华硕天选 X 2023 的 S502ME 规格列有 Windows 11；其他代次、配置和当前系统需另核对。', 'https://www.asus.com.cn/displays-desktops/tower-pcs/asus-desktop/s502me/techspec/'],
];
const rows = (device: Device, brand: AdditionalBrand, items: Row[]): ModelEvidence[] => items.map(([model, identity, source]) => ({ device, brand, model, identity, source }));
export const modelEvidence: ModelEvidence[] = [
  ...rows('phone', 'xiaomi', xiaomi), ...rows('phone', 'oppo', oppo), ...rows('phone', 'vivo', vivo), ...rows('phone', 'samsung', samsung),
  ...rows('laptop', 'lenovo', lenovoLaptops), ...rows('laptop', 'asus', asusLaptops), ...rows('desktop', 'lenovo', lenovoDesktops), ...rows('desktop', 'asus', asusDesktops),
];
const normalized = (value: string) => value.normalize('NFKC').replace(/\s+/g, '').toLowerCase();
export function findModelEvidence(device: Device, brand: AdditionalBrand, model: string): ModelEvidence | undefined {
  return modelEvidence.find(item => item.device === device && item.brand === brand && normalized(item.model) === normalized(model));
}
