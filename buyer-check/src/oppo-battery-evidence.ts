// 官方名单包含明确机型及系列；只匹配目录内可明确归入所列系列的名称。
const models: Record<string, string> = {
  'oppo find x9 pro': 'Find X9 系列', 'oppo find x9': 'Find X9 系列',
  'oppo find x8 ultra': 'Find X8 Ultra', 'oppo find x8 pro': 'Find X8 系列', 'oppo find x8': 'Find X8 系列',
  'oppo find x7 ultra': 'Find X7 系列', 'oppo find x7': 'Find X7 系列',
  'oppo find n5': 'Find N5', 'oppo find n3': 'Find N3',
  'oppo reno15 pro': 'Reno15 Pro', 'oppo reno15': 'Reno15',
  'oppo reno14 pro': 'Reno14 系列', 'oppo reno14': 'Reno14 系列',
  'oneplus 13': '一加 13', 'oneplus 12': '一加 12',
  'oneplus ace 3 pro': '一加 Ace 3 Pro', 'oneplus ace 3': '一加 Ace 3',
  'realme gt7 pro': '真我 GT7 Pro', 'realme gt6': '真我 GT6', 'realme gt5 pro': '真我 GT5 Pro'
};

export function oppoBatteryEvidence(model: string) {
  const listedAs = models[model.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()];
  if (!listedAs) return undefined;
  return {
    title: `${model.trim()}：官方列出的电池容量入口`,
    steps: [`OPPO 官方名单列出 ${listedAs}；页面给出的路径为设置 → 电池 → 电池健康 → 最大电池容量。先核对本机完整型号和当前系统。`, '该说明未逐一列明各型号支持的 ColorOS 或 realme UI 版本；菜单及数据以实机为准，找不到或获取失败记为未知。不要把当前电量或充电上限当作电池健康度，也不能仅凭数值证明电池原装。'],
    source: 'https://support.oppo.com/cn/self-service/#/articleDetail?aid=2124198'
  };
}
