import { catalog, devices, type Device } from './catalog';

const typeHints: Partial<Record<Device, RegExp>> = {
  phone: /手机|iphone/i, laptop: /笔记本|macbook|matebook|thinkpad/i,
  tablet: /平板|ipad|matepad/i, desktop: /台式电脑|台式机|电脑主机|mac\s*mini|imac/i,
  camera: /相机|微单|单反|\beos\b/i, lens: /镜头/i, drone: /无人机/i,
  console: /游戏机|掌机|playstation|nintendo\s*switch|steam\s*deck/i,
  headphones: /耳机|airpods/i, watch: /手表|apple\s*watch/i,
  gpu: /显卡|\brtx\s*\d/i, shaver: /剃须刀|刮胡刀|剃须器/i
};

function matches(text: string, value: string) {
  // Spaces and hyphens are commonly omitted in listings; don't match a prefix of another alphanumeric code.
  const escaped = value.normalize('NFKC').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[\s-]+/g, '[\\s-]*');
  const left = /^[a-z0-9]/i.test(value) ? '(?<![a-z0-9])' : '';
  const right = /[a-z0-9]$/i.test(value) ? '(?![a-z0-9])' : '';
  return new RegExp(left + escaped + right, 'i').test(text);
}

export function recognizeListing(input: string) {
  // ponytail: explicit names and catalog strings only; broader language recognition needs a reviewed extraction service.
  const text = input.normalize('NFKC').replace(/https?:\/\/\S+/gi, ' ');
  const models = devices.flatMap(({ id }) => catalog[id].flatMap(brand => brand.models
    .filter(model => matches(text, model)).map(model => ({ device: id, brand: brand.name, model }))));
  const foundTypes = devices.filter(({ id }) => typeHints[id]?.test(text) || models.some(model => model.device === id)).map(({ id }) => id);
  if (foundTypes.length !== 1) return { ambiguous: foundTypes.length > 1 };
  const device = foundTypes[0];
  const matchedBrands = catalog[device].filter(brand => brand.name.split(/\s+/).some(alias => matches(text, alias)));
  const candidates = models.filter(model => model.device === device && (!matchedBrands.length || matchedBrands.some(brand => brand.name === model.brand)))
    .sort((a, b) => b.model.length - a.model.length);
  const longest = candidates[0]?.model.length;
  const best = candidates.filter(candidate => candidate.model.length === longest);
  const modelMatch = best.length === 1 && matchedBrands.length < 2 ? best[0] : undefined;
  const family = device === 'laptop' ? text.match(/\bMacBook\s*(?:Pro|Air)\b/i)?.[0] : undefined;
  const brand = matchedBrands.length === 1 ? matchedBrands[0].name : matchedBrands.length === 0 ? modelMatch?.brand ?? (family ? '苹果 Apple' : undefined) : undefined;
  // Preserve the seller's exact model code, including unlisted model codes; it is not proof of a real model.
  const rawModel = device === 'shaver' && brand === '松下 Panasonic'
    ? text.match(/(?<![a-z0-9])ES[-\s]?[a-z]{0,3}\d{2,5}[a-z0-9-]*(?![a-z0-9])/i)?.[0].replace(/\s+/g, '-').toUpperCase()
    : undefined;
  const partialModel = rawModel ?? (brand === '苹果 Apple' ? family : undefined);
  return { device, brand, model: modelMatch?.model ?? partialModel, unlistedModel: Boolean(partialModel && !modelMatch), ambiguous: false };
}
