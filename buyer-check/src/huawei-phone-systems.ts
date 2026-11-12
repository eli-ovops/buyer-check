// 中国大陆厂商规格页明确列出的版本，仅用于核对，不推断二手机当前系统。
const entries: Record<string, [string, string]> = {
  'Mate 80 Pro Max': ['HarmonyOS 6.0', 'mate80-pro-max'],
  'Mate 80 Pro': ['HarmonyOS 6.0', 'mate80-pro'],
  'Mate 80': ['HarmonyOS 6.0', 'mate80'],
  'Mate 70 RS': ['HarmonyOS 4.3，可升级到 5.0', 'mate70-rs-ultimate-design'],
  'Mate 70 Pro+': ['HarmonyOS 4.3；鸿蒙 NEXT 先锋版出厂为 5.0', 'mate70-pro-plus'],
  'Mate 70 Pro': ['HarmonyOS 4.3；鸿蒙 NEXT 先锋版出厂为 5.0', 'mate70-pro'],
  'Mate 70': ['HarmonyOS 4.3；鸿蒙 NEXT 先锋版出厂为 5.0', 'mate70'],
  'Pura 80 Ultra': ['HarmonyOS 5.1；部分设备出厂预装 6 或以上', 'pura80-ultra'],
  'Pura 80 Pro+': ['HarmonyOS 5.1；部分设备出厂预装 6 或以上', 'pura80-pro-plus'],
  'Pura 80 Pro': ['HarmonyOS 5.1；部分设备出厂预装 6 或以上', 'pura80-pro'],
  'Pura 80': ['HarmonyOS 5.1；部分设备出厂预装 6 或以上', 'pura80'],
  'Mate X7': ['HarmonyOS 6.0', 'mate-x7'],
  'Mate X6': ['HarmonyOS 4.3；鸿蒙 NEXT 先锋版出厂为 5.0', 'mate-x6'],
  'Pura X': ['HarmonyOS 5.0.1；部分设备出厂预装 6 或以上', 'pura-x'],
  'nova 15 Ultra': ['HarmonyOS 6.0', 'nova15-ultra'],
  'nova 15 Pro': ['HarmonyOS 6.0', 'nova15-pro'],
  'nova 15': ['HarmonyOS 6.0', 'nova15'],
  'nova 14': ['鸿蒙操作系统 5.0', 'nova14']
};
// 下列版本是厂商资料中的适用版本或功能门槛，不是出厂版本或实机已安装版本。
const modelNotes: Record<string, [string, string]> = {
  'Mate 60': ['官方功能支持表列出 BRA-AL00，相关功能要求 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn16048049/'],
  'Mate 60 Pro': ['官方列出 ALN-AL00 / AL80 的 HarmonyOS 4.2 用户指南', 'https://consumer.huawei.com/cn/support/content/zh-cn15999209/'],
  'Mate 60 Pro+': ['官方功能支持表列出 ALN-AL10，相关功能要求 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn16048049/'],
  'Mate X5': ['官方功能支持表列出 ALT-AL10，相关功能要求 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn16048049/'],
  'Pura 70': ['官方功能支持表列出 ADY-AL00，相关功能要求 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn16048049/'],
  'Pura 70 Pro': ['官方功能支持表列出 HBN-AL00，相关功能要求 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn16048049/'],
  'Pura 70 Pro+': ['官方列出 HBN-AL10 / AL80 的 HarmonyOS 5.0 用户指南', 'https://consumer.huawei.com/cn/support/content/zh-cn16021597/'],
  'Pura 70 Ultra': ['官方列出 HBP-AL00 的 HarmonyOS 5.0 用户指南', 'https://consumer.huawei.com/cn/support/content/zh-cn16021601/'],
  'nova 14 Ultra': ['官方列出 MRT-AL10 的 HarmonyOS 6.1 用户指南', 'https://consumer.huawei.com/cn/support/content/zh-cn16095147/'],
  'nova 14 Pro': ['官方列出 MIA-AL00 的 HarmonyOS 5.0 用户指南', 'https://consumer.huawei.com/cn/support/content/zh-cn16048737/'],
  'nova 13 Pro': ['官方对该型号的功能说明列出 HarmonyOS 4.2', 'https://consumer.huawei.com/cn/support/content/zh-cn16031878/'],
  'nova 13': ['官方对该型号的功能说明列出 HarmonyOS 4.2', 'https://consumer.huawei.com/cn/support/content/zh-cn16031878/'],
  'nova 12 Pro': ['官方对该型号一项功能说明涉及 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn15987256/'],
  'nova 12': ['官方对该型号一项功能说明涉及 HarmonyOS [REDACTED_HOST] 及以上', 'https://consumer.huawei.com/cn/support/content/zh-cn15987256/']
};
export function huaweiPhoneSystem(model: string) {
  const normalized = model.normalize('NFKC').replace(/\s+/g, '').toLowerCase();
  const noteKey = Object.keys(modelNotes).find(name => name.normalize('NFKC').replace(/\s+/g, '').toLowerCase() === normalized);
  if (noteKey) {
    const [note, source] = modelNotes[noteKey];
    return { title: `${noteKey}：国行系统资料`, steps: [`${note}；请在实机设置中核对型号和当前系统版本。`, '指南或功能门槛不代表出厂版本、实机已升级或电池等功能一定可用。'], source };
  }
  const key = Object.keys(entries).find(name => name.normalize('NFKC').replace(/\s+/g, '').toLowerCase() === normalized);
  if (!key) return undefined;
  const [system, slug] = entries[key];
  return { title: `${key}：国行系统资料`, steps: [`华为中国大陆规格页列出 ${system}；二手机当前版本可能不同，请在实机设置中核对。`, '规格页不能证明设备当前系统、电池健康或维修状态。'], source: `https://consumer.huawei.com/cn/phones/${slug}/specs/` };
}
