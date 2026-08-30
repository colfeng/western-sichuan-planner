export type Locale = "zh" | "en";

export type Copy = { zh: string; en: string };
export type Theme = "scenery" | "culture" | "wildlife" | "hiking" | "rest";
export type Effort = "low" | "medium" | "high";
export type RegionId = "gateway" | "aba" | "siguniang" | "maerkang" | "heishui" | "grassland" | "jiuzhai" | "danba" | "kangding" | "return";
export type Vehicle = "sedan" | "suv" | "ev";

export type RouteAnchor = {
  id: string;
  name: Copy;
  altitude: number;
  canStay: boolean;
  region: RegionId;
  latitude: number;
};

export type RouteLeg = {
  from: string;
  to: string;
  hours: number;
  km: number;
  road: string;
  id: string;
  evSupport: "good" | "limited";
};

export type Attraction = {
  id: string;
  anchorId: string;
  name: Copy;
  region: RegionId;
  themes: Theme[];
  visitHours: number;
  detourHours: number;
  detourKm: number;
  altitude: number;
  effort: Effort;
  summary: Copy;
  sourceUrl: string;
  bestMonths?: number[];
  opening?: Copy;
  reservation?: Copy;
  verifiedOn?: string;
};

export type LodgingArea = {
  anchorId: string;
  name: Copy;
  services: Copy;
  tradeoff: Copy;
};

export const c = (zh: string, en: string): Copy => ({ zh, en });

export const regionNames: Record<RegionId, Copy> = {
  gateway: c("成都门户", "Chengdu gateway"),
  aba: c("卧龙·四姑娘山", "Wolong · Siguniang"),
  siguniang: c("汶川·四姑娘山", "Wenchuan · Siguniang"),
  maerkang: c("理县·马尔康·阿坝县", "Li County · Barkam · Ngawa County"),
  heishui: c("黑水·冰川彩林", "Heishui · glaciers and forests"),
  grassland: c("红原·若尔盖", "Hongyuan · Ruoergai"),
  jiuzhai: c("松潘·黄龙·九寨沟", "Songpan · Huanglong · Jiuzhaigou"),
  danba: c("丹巴段", "Danba section"),
  kangding: c("康定环线", "Kangding loop"),
  return: c("泸定·雅安返程", "Luding · Ya'an return"),
};

export const themeNames: Record<Theme, Copy> = {
  scenery: c("自然风景", "Scenery"),
  culture: c("人文历史", "Culture"),
  wildlife: c("生态动物", "Wildlife"),
  hiking: c("徒步", "Hiking"),
  rest: c("轻松停留", "Easy stop"),
};

export const effortNames: Record<Effort, Copy> = {
  low: c("轻松", "Easy"),
  medium: c("适中", "Moderate"),
  high: c("强度高", "Demanding"),
};

const anchors: RouteAnchor[] = [
  { id: "chengdu", name: c("成都", "Chengdu"), altitude: 500, canStay: true, region: "gateway", latitude: 30.57 },
  { id: "dujiangyan", name: c("都江堰", "Dujiangyan"), altitude: 720, canStay: true, region: "gateway", latitude: 31.00 },
  { id: "yingxiu", name: c("映秀", "Yingxiu"), altitude: 900, canStay: true, region: "siguniang", latitude: 31.06 },
  { id: "wenchuan", name: c("汶川", "Wenchuan"), altitude: 1325, canStay: true, region: "siguniang", latitude: 31.48 },
  { id: "wolong", name: c("卧龙", "Wolong"), altitude: 2000, canStay: true, region: "siguniang", latitude: 31.04 },
  { id: "balang", name: c("巴朗山沿线", "Balang corridor"), altitude: 3500, canStay: false, region: "siguniang", latitude: 30.93 },
  { id: "siguniang", name: c("四姑娘山镇", "Mount Siguniang Town"), altitude: 3200, canStay: true, region: "siguniang", latitude: 31.00 },
  { id: "xiaojin", name: c("小金", "Xiaojin"), altitude: 2360, canStay: true, region: "siguniang", latitude: 31.00 },
  { id: "lixian", name: c("理县", "Li County"), altitude: 1888, canStay: true, region: "maerkang", latitude: 31.44 },
  { id: "miyaluo", name: c("米亚罗·古尔沟", "Miyaluo · Guergou"), altitude: 2700, canStay: true, region: "maerkang", latitude: 31.66 },
  { id: "maerkang", name: c("马尔康", "Barkam"), altitude: 2600, canStay: true, region: "maerkang", latitude: 31.90 },
  { id: "aba-county", name: c("阿坝县", "Ngawa County"), altitude: 3290, canStay: true, region: "maerkang", latitude: 32.90 },
  { id: "lianbaoyeze", name: c("莲宝叶则", "Lianbaoyeze"), altitude: 4100, canStay: false, region: "maerkang", latitude: 33.10 },
  { id: "hongyuan", name: c("红原", "Hongyuan"), altitude: 3500, canStay: true, region: "grassland", latitude: 32.79 },
  { id: "tangke", name: c("唐克", "Tangke"), altitude: 3440, canStay: true, region: "grassland", latitude: 33.42 },
  { id: "ruoergai", name: c("若尔盖", "Ruoergai"), altitude: 3440, canStay: true, region: "grassland", latitude: 33.58 },
  { id: "maoxian", name: c("茂县", "Mao County"), altitude: 1580, canStay: true, region: "jiuzhai", latitude: 31.68 },
  { id: "heishui", name: c("黑水", "Heishui"), altitude: 2350, canStay: true, region: "heishui", latitude: 32.06 },
  { id: "songpan", name: c("松潘", "Songpan"), altitude: 2850, canStay: true, region: "jiuzhai", latitude: 32.65 },
  { id: "chuanzhusi", name: c("川主寺", "Chuanzhusi"), altitude: 2980, canStay: true, region: "jiuzhai", latitude: 32.78 },
  { id: "huanglong", name: c("黄龙", "Huanglong"), altitude: 3200, canStay: false, region: "jiuzhai", latitude: 32.74 },
  { id: "jiuzhaigou", name: c("九寨沟口", "Jiuzhaigou entrance"), altitude: 2000, canStay: true, region: "jiuzhai", latitude: 33.26 },
  { id: "danba", name: c("丹巴", "Danba"), altitude: 1900, canStay: true, region: "danba", latitude: 30.88 },
  { id: "bamei", name: c("八美", "Bamei"), altitude: 3500, canStay: true, region: "kangding", latitude: 30.50 },
  { id: "tagong", name: c("塔公", "Tagong"), altitude: 3730, canStay: true, region: "kangding", latitude: 30.32 },
  { id: "xinduqiao", name: c("新都桥", "Xinduqiao"), altitude: 3460, canStay: true, region: "kangding", latitude: 30.04 },
  { id: "kangding", name: c("康定", "Kangding"), altitude: 2560, canStay: true, region: "kangding", latitude: 30.05 },
  { id: "luding", name: c("泸定", "Luding"), altitude: 1330, canStay: true, region: "return", latitude: 29.91 },
  { id: "yaan", name: c("雅安", "Ya'an"), altitude: 600, canStay: true, region: "return", latitude: 30.01 },
];

export const routeAnchors = Object.fromEntries(anchors.map((anchor) => [anchor.id, anchor]));

export const anchorCoordinates: Record<string, { longitude: number; latitude: number }> = {
  chengdu: { longitude: 104.0665, latitude: 30.5728 },
  dujiangyan: { longitude: 103.6469, latitude: 31.0015 },
  yingxiu: { longitude: 103.485, latitude: 31.061 },
  wenchuan: { longitude: 103.59, latitude: 31.476 },
  wolong: { longitude: 103.17, latitude: 31.039 },
  balang: { longitude: 102.95, latitude: 30.95 },
  siguniang: { longitude: 102.84, latitude: 31.0 },
  xiaojin: { longitude: 102.36, latitude: 30.999 },
  lixian: { longitude: 103.17, latitude: 31.44 },
  miyaluo: { longitude: 102.81, latitude: 31.66 },
  maerkang: { longitude: 102.22, latitude: 31.9 },
  "aba-county": { longitude: 101.7, latitude: 32.9 },
  lianbaoyeze: { longitude: 101.12, latitude: 33.1 },
  hongyuan: { longitude: 102.55, latitude: 32.79 },
  tangke: { longitude: 102.48, latitude: 33.42 },
  ruoergai: { longitude: 102.96, latitude: 33.58 },
  maoxian: { longitude: 103.85, latitude: 31.68 },
  heishui: { longitude: 102.99, latitude: 32.06 },
  songpan: { longitude: 103.6, latitude: 32.65 },
  chuanzhusi: { longitude: 103.61, latitude: 32.78 },
  huanglong: { longitude: 103.83, latitude: 32.74 },
  jiuzhaigou: { longitude: 103.92, latitude: 33.26 },
  danba: { longitude: 101.89, latitude: 30.88 },
  bamei: { longitude: 101.5, latitude: 30.5 },
  tagong: { longitude: 101.54, latitude: 30.32 },
  xinduqiao: { longitude: 101.49, latitude: 30.04 },
  kangding: { longitude: 101.96, latitude: 30.05 },
  luding: { longitude: 102.23, latitude: 29.91 },
  yaan: { longitude: 103.0, latitude: 30.01 },
};

const leg = (id: string, from: string, to: string, hours: number, km: number, road: string, evSupport: RouteLeg["evSupport"] = "good"): RouteLeg => ({ id, from, to, hours, km, road, evSupport });

export const roadLegs: RouteLeg[] = [
  leg("cd-djy", "chengdu", "dujiangyan", 1.2, 70, "S9 / G4217"),
  leg("djy-yx", "dujiangyan", "yingxiu", 0.8, 45, "G4217"),
  leg("yx-wc", "yingxiu", "wenchuan", 0.8, 45, "G4217"),
  leg("yx-wl", "yingxiu", "wolong", 1.2, 55, "G350"),
  leg("wl-bl", "wolong", "balang", 1.3, 58, "G350", "limited"),
  leg("bl-sgn", "balang", "siguniang", 1.0, 42, "G350", "limited"),
  leg("sgn-xj", "siguniang", "xiaojin", 1.2, 55, "G350"),
  leg("xj-db", "xiaojin", "danba", 2.2, 105, "G350", "limited"),
  leg("wc-lx", "wenchuan", "lixian", 1.4, 80, "G317"),
  leg("lx-myl", "lixian", "miyaluo", 1.5, 85, "G317"),
  leg("myl-mek", "miyaluo", "maerkang", 2.4, 145, "G317"),
  leg("mek-ab", "maerkang", "aba-county", 3.8, 230, "G248 / S220", "limited"),
  leg("ab-lbyz", "aba-county", "lianbaoyeze", 1.4, 75, "S452", "limited"),
  leg("mek-hy", "maerkang", "hongyuan", 3.3, 200, "G248"),
  leg("myl-hy", "miyaluo", "hongyuan", 3.1, 185, "G248"),
  leg("hy-tk", "hongyuan", "tangke", 2.2, 135, "G248"),
  leg("tk-reg", "tangke", "ruoergai", 1.4, 85, "G213"),
  leg("reg-sp", "ruoergai", "songpan", 2.7, 165, "G213"),
  leg("wc-mx", "wenchuan", "maoxian", 1.7, 105, "G213"),
  leg("mx-hs", "maoxian", "heishui", 3.0, 185, "G347", "limited"),
  leg("hs-hy", "heishui", "hongyuan", 4.0, 225, "G347 / G248", "limited"),
  leg("mx-sp", "maoxian", "songpan", 2.6, 160, "G213"),
  leg("sp-czs", "songpan", "chuanzhusi", 0.5, 25, "G213"),
  leg("czs-hl", "chuanzhusi", "huanglong", 1.2, 55, "G544", "limited"),
  leg("czs-jzg", "chuanzhusi", "jiuzhaigou", 2.0, 120, "G544"),
  leg("db-bm", "danba", "bamei", 3.3, 150, "G350", "limited"),
  leg("bm-tg", "bamei", "tagong", 0.7, 35, "G248"),
  leg("tg-xdq", "tagong", "xinduqiao", 1.4, 65, "G248 / G318"),
  leg("xdq-kd", "xinduqiao", "kangding", 1.8, 78, "G318"),
  leg("kd-ld", "kangding", "luding", 1.1, 55, "G4218 / G318"),
  leg("db-ld", "danba", "luding", 4.0, 200, "S211", "limited"),
  leg("ld-ya", "luding", "yaan", 1.7, 105, "G4218"),
  leg("ya-cd", "yaan", "chengdu", 1.9, 140, "G5"),
];

const attraction = (
  id: string,
  anchorId: string,
  name: Copy,
  region: RegionId,
  themes: Theme[],
  visitHours: number,
  detourHours: number,
  detourKm: number,
  altitude: number,
  effort: Effort,
  summary: Copy,
  sourceUrl: string,
  details: Partial<Pick<Attraction, "bestMonths" | "opening" | "reservation" | "verifiedOn">> = {},
): Attraction => ({ id, anchorId, name, region, themes, visitHours, detourHours, detourKm, altitude, effort, summary, sourceUrl, ...details });

const SGNS = "https://www.sgns.cn/play/line";
const DANBA = "https://www.danba.gov.cn/czdb/article/719505";
const KANGDING = "https://www.kangding.gov.cn/kdlyxl/article/107031";

export const attractions: Attraction[] = [
  attraction("dujiangyan-irrigation", "dujiangyan", c("都江堰水利工程", "Dujiangyan Irrigation System"), "gateway", ["culture", "scenery"], 3, 0.4, 16, 730, "low", c("适合在进山前安排的半日人文景点。", "A half-day heritage stop before entering the mountains."), "https://www.djy.gov.cn/"),
  attraction("guanxian-town", "dujiangyan", c("灌县古城", "Guanxian Ancient Town"), "gateway", ["culture", "rest"], 1.5, 0.2, 8, 720, "low", c("适合作为补给、步行和较低海拔住宿点。", "A low-altitude stop for supplies, walking and an easy first night."), "https://www.djy.gov.cn/"),
  attraction("yingxiu-memorial", "yingxiu", c("映秀震中纪念地", "Yingxiu Memorial"), "aba", ["culture"], 1.5, 0.2, 8, 900, "low", c("需要保持肃静的纪念性停留。", "A memorial visit that calls for respectful conduct."), "https://www.wenchuan.gov.cn/"),
  attraction("yingxiu-old-town", "yingxiu", c("映秀老街与河谷", "Yingxiu old town and valley"), "aba", ["culture", "rest"], 1, 0.1, 4, 900, "low", c("短时休息与了解山地城镇重建。", "A short stop to understand the rebuilt mountain town."), "https://www.wenchuan.gov.cn/"),
  attraction("panda-shenshuping", "wolong", c("神树坪熊猫基地", "Shenshuping Panda Base"), "aba", ["wildlife"], 3, 0.6, 24, 1700, "low", c("建议预留半天，不与长距离驾驶日叠加。", "Allow half a day and avoid pairing it with a long drive."), "https://www.abazhou.gov.cn/"),
  attraction("wolong-museum", "wolong", c("卧龙自然与地震博物馆", "Wolong nature and earthquake museum"), "aba", ["wildlife", "culture"], 1.5, 0.2, 7, 2000, "low", c("天气不佳时也可安排的室内停留。", "An indoor stop that also works in poor weather."), "https://www.abazhou.gov.cn/"),
  attraction("gengda-valley", "wolong", c("耿达河谷慢游", "Gengda valley slow stop"), "aba", ["scenery", "rest"], 1.5, 0.3, 12, 1600, "low", c("仅在正规停车区域停留，不设置路肩拍照点。", "Stop only in formal parking areas, never on the road shoulder."), "https://www.abazhou.gov.cn/"),
  attraction("balang-viewpoint", "balang", c("巴朗山沿线正规观景点", "Balang corridor formal viewpoints"), "aba", ["scenery"], 0.7, 0.2, 6, 3600, "medium", c("受天气影响明显，雨雾时应直接取消。", "Highly weather-sensitive; skip it in rain or fog."), "https://www.sgns.cn/"),
  attraction("maobiliang", "balang", c("猫鼻梁观景台", "Maobiliang Viewpoint"), "aba", ["scenery", "rest"], 0.5, 0.1, 3, 3500, "low", c("短暂停留即可，不在道路出入口聚集。", "Keep the stop short and keep access lanes clear."), "https://www.sgns.cn/"),
  attraction("shuangqiao", "siguniang", c("双桥沟", "Shuangqiao Valley"), "aba", ["scenery"], 6, 0.3, 12, 3200, "low", c("配套较完善，但仍需考虑快速升高海拔。", "Well serviced, but the rapid altitude gain still matters."), SGNS),
  attraction("changping", "siguniang", c("长坪沟", "Changping Valley"), "aba", ["scenery", "hiking"], 7, 0.2, 8, 3300, "medium", c("接近整日活动，不宜当天继续长距离赶路。", "A near full-day outing; do not add a long drive afterward."), SGNS),
  attraction("haizi", "siguniang", c("海子沟", "Haizi Valley"), "aba", ["scenery", "hiking"], 8, 0.2, 8, 3400, "high", c("高海拔长线徒步，需要独立整日和体力评估。", "A demanding high-altitude hike requiring a full day and fitness check."), "https://www.sgns.cn/understand/hzg"),
  attraction("siguniang-town", "siguniang", c("四姑娘山镇慢行", "Mount Siguniang Town walk"), "aba", ["culture", "rest"], 1.2, 0, 0, 3200, "low", c("适合作为高海拔抵达后的低强度活动。", "A low-intensity activity after arriving at altitude."), "https://www.sgns.cn/"),
  attraction("dawei-meeting", "xiaojin", c("达维会师纪念地", "Dawei historical memorial"), "aba", ["culture"], 1.5, 0.5, 20, 2700, "low", c("把红色历史内容放入小金段的短停。", "Adds a concise historical stop to the Xiaojin section."), "https://www.xiaojin.gov.cn/"),
  attraction("wori-tusi", "xiaojin", c("沃日土司官寨", "Wori Tusi Manor"), "aba", ["culture", "scenery"], 1.8, 0.5, 22, 2500, "low", c("适合人文优先方案，需核对当日开放情况。", "A culture-focused stop; verify opening status for the day."), "https://www.xiaojin.gov.cn/"),
  attraction("xiaojin-supply", "xiaojin", c("小金县城补给", "Xiaojin resupply stop"), "aba", ["rest"], 1, 0.1, 4, 2360, "low", c("把加油、用餐和休息合并为一次正规停留。", "Combine fuel, food and rest into one formal stop."), "https://www.xiaojin.gov.cn/"),
  attraction("jiaju", "danba", c("甲居藏寨", "Jiaju Tibetan Village"), "danba", ["culture", "scenery"], 3, 0.8, 28, 2200, "medium", c("村道较窄，优先使用景区交通与正规停车场。", "Village roads are narrow; prefer managed transport and formal parking."), DANBA),
  attraction("zhonglu", "danba", c("中路藏寨", "Zhonglu Tibetan Village"), "danba", ["culture", "scenery"], 3, 0.9, 32, 2100, "medium", c("适合慢游，不建议与甲居压缩在同一短下午。", "Best visited slowly; do not squeeze it with Jiaju into one short afternoon."), DANBA),
  attraction("suopo", "danba", c("梭坡古碉群", "Suopo ancient watchtowers"), "danba", ["culture"], 2, 0.5, 18, 2000, "medium", c("以村落和古碉观察为主，尊重居民生活空间。", "Focus on the village and towers while respecting residents' space."), DANBA),
  attraction("danba-town", "danba", c("丹巴县城与大渡河谷", "Danba town and Dadu valley"), "danba", ["culture", "rest"], 1.5, 0, 0, 1900, "low", c("低海拔恢复、补给和重新确认返程道路。", "A lower-altitude recovery and resupply point before the return."), DANBA),
  attraction("dangling", "danba", c("党岭长线", "Dangling backcountry trip"), "danba", ["scenery", "hiking"], 10, 4.2, 150, 3300, "high", c("偏远长线，不适合塞进普通三至五日自驾环线。", "A remote, demanding extension unsuitable for a normal 3–5 day loop."), "https://www.danba.gov.cn/gzdb/article/234330"),
  attraction("moshi-park", "bamei", c("墨石公园", "Moshi Park"), "kangding", ["scenery"], 3, 0.5, 20, 3500, "medium", c("只有选择康定大环线时才顺路。", "Efficient only when taking the larger Kangding loop."), KANGDING),
  attraction("huiyuan-temple", "bamei", c("惠远寺", "Huiyuan Temple"), "kangding", ["culture"], 1.5, 0.5, 22, 3500, "low", c("宗教场所应遵守现场拍摄和参观规则。", "Follow all on-site rules for visits and photography."), KANGDING),
  attraction("yala-view", "bamei", c("雅拉雪山沿线远眺", "Yala Snow Mountain corridor view"), "kangding", ["scenery"], 0.8, 0.2, 8, 3600, "low", c("只设置正规观景停留，天气差时删除。", "Use formal viewpoints only and remove the stop in poor weather."), KANGDING),
  attraction("tagong-grassland", "tagong", c("塔公草原", "Tagong Grassland"), "kangding", ["scenery", "culture"], 2, 0.3, 10, 3730, "low", c("高海拔停留，避免跑跳和过度活动。", "A high-altitude stop; avoid strenuous activity."), KANGDING),
  attraction("tagong-monastery", "tagong", c("塔公寺", "Tagong Monastery"), "kangding", ["culture"], 1.5, 0.2, 6, 3730, "low", c("尊重宗教礼仪，开放时间以现场为准。", "Respect religious practice and verify opening hours on site."), KANGDING),
  attraction("muya-pagoda", "tagong", c("木雅金塔周边", "Muya Golden Pagoda area"), "kangding", ["culture", "scenery"], 1, 0.2, 7, 3750, "low", c("作为塔公段的短停，不重复增加相似观景点。", "A short Tagong-area stop without duplicating similar viewpoints."), KANGDING),
  attraction("xinduqiao-corridor", "xinduqiao", c("新都桥景观走廊", "Xinduqiao landscape corridor"), "kangding", ["scenery"], 2, 0.3, 12, 3460, "low", c("不设置公路中央或路肩摄影点。", "No photography stops in traffic lanes or on road shoulders."), KANGDING),
  attraction("xinduqiao-town", "xinduqiao", c("新都桥镇休整", "Xinduqiao town rest"), "kangding", ["rest"], 1, 0, 0, 3460, "low", c("用于加油、用餐和检查车辆状态。", "For fuel, food and a vehicle check."), KANGDING),
  attraction("kangding-old-town", "kangding", c("康定老城慢行", "Kangding old town walk"), "kangding", ["culture", "rest"], 2, 0.2, 6, 2560, "low", c("下降至较低海拔后的恢复性停留。", "A recovery stop after descending to a lower altitude."), KANGDING),
  attraction("paoma-mountain", "kangding", c("跑马山", "Paoma Mountain"), "kangding", ["culture", "scenery"], 3, 0.4, 12, 2800, "medium", c("与康定城区组合，不与木格措同日硬塞。", "Combine with the city, not a compressed same-day Mugecuo visit."), KANGDING),
  attraction("mugecuo", "kangding", c("木格措", "Mugecuo"), "kangding", ["scenery"], 5, 1.4, 50, 3200, "medium", c("需要半天以上，并产生明显往返绕行。", "Requires more than half a day and a substantial round-trip detour."), KANGDING),
  attraction("luding-bridge", "luding", c("泸定桥与老城", "Luding Bridge and old town"), "return", ["culture", "rest"], 1.5, 0.2, 7, 1330, "low", c("返程中的低海拔历史停留。", "A lower-altitude historical stop on the return."), "https://www.luding.gov.cn/"),
  attraction("hailuogou", "luding", c("海螺沟支线", "Hailuogou side trip"), "return", ["scenery"], 7, 2.8, 105, 1600, "medium", c("需要额外一日更合理，不应作为短暂停靠。", "Best given an extra day rather than treated as a brief stop."), "https://www.luding.gov.cn/"),
  attraction("bifengxia", "yaan", c("碧峰峡", "Bifengxia"), "return", ["scenery", "wildlife"], 5, 1.2, 45, 1100, "medium", c("适合延长一天，不建议放在疲劳返程末段。", "Works with an extra day, not at the end of a tiring return."), "https://www.yaan.gov.cn/"),
  attraction("shangli-town", "yaan", c("上里古镇", "Shangli Ancient Town"), "return", ["culture", "rest"], 3, 1, 42, 900, "low", c("需要从主返程线往返，适合作为雅安住宿日活动。", "Requires a return detour and works best with a Ya'an overnight."), "https://www.yaan.gov.cn/"),
  attraction("taoping-qiang", "lixian", c("桃坪羌寨", "Taoping Qiang Village"), "maerkang", ["culture"], 2.5, 0.5, 24, 1500, "low", c("可作为进入理县走廊的人文停留，开放状态以官方当日信息为准。", "A cultural stop on the Li County corridor; verify same-day opening information."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("bipenggou", "lixian", c("毕棚沟", "Bipenggou"), "maerkang", ["scenery", "hiking"], 6, 1.2, 50, 3000, "medium", c("建议单独预留大半天；秋色季和冰雪期体验差异明显。", "Allow most of a day; autumn colours and winter conditions are very different."), "https://www.abazhou.gov.cn/", { bestMonths: [5,6,7,8,9,10,11], opening: c("开放时间随季节和天气调整", "Hours vary by season and weather"), verifiedOn: "2026-08-30" }),
  attraction("miyaluo-autumn", "miyaluo", c("米亚罗秋色走廊", "Miyaluo autumn corridor"), "maerkang", ["scenery"], 2.5, 0.4, 18, 2700, "low", c("季节性很强，只设置正规停车点，不把公路沿线当景区。", "Highly seasonal; use formal parking and do not treat road shoulders as viewpoints."), "https://www.abazhou.gov.cn/", { bestMonths: [9,10,11], verifiedOn: "2026-08-30" }),
  attraction("zhuokeji", "maerkang", c("卓克基土司官寨", "Zhuokeji Tusi Manor"), "maerkang", ["culture"], 3, 0.4, 16, 2700, "low", c("马尔康走廊的核心人文停留，需核对预约和开放公告。", "A key cultural stop near Barkam; check reservations and opening notices."), "https://www.abazhou.gov.cn/", { opening: c("以景区当日公告为准", "Subject to same-day official notice"), verifiedOn: "2026-08-30" }),
  attraction("maerkang-town", "maerkang", c("马尔康城区休整", "Barkam rest stop"), "maerkang", ["rest", "culture"], 1.5, 0, 0, 2600, "low", c("适合作为补给和降低第二天连续驾驶压力的住宿点。", "A practical overnight and resupply stop that reduces next-day driving pressure."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("lianbaoyeze", "lianbaoyeze", c("莲宝叶则", "Lianbaoyeze"), "maerkang", ["scenery", "hiking"], 6, 0.5, 20, 4200, "high", c("超高海拔景区，建议住阿坝县往返，不在景区节点过夜。", "A very high-altitude visit; make it a return trip from Ngawa County rather than sleeping at the scenic node."), "https://www.abazhou.gov.cn/abazhou/c101955/202508/42e0b97f3ae84165964b24f9e5c5f760.shtml", { bestMonths: [5,6,7,8,9,10], opening: c("冬季和恶劣天气可能调整，须查官方公告", "Winter and severe weather may change access; check official notices"), reservation: c("出发前核验实名购票要求", "Verify real-name ticket requirements before departure"), verifiedOn: "2026-08-30" }),
  attraction("moon-bay", "hongyuan", c("红原月亮湾", "Hongyuan Moon Bay"), "grassland", ["scenery", "rest"], 2.5, 0.3, 12, 3500, "low", c("草原河湾景观，适合作为红原住宿日前后的低强度活动。", "A grassland river bend suited to a low-intensity stop around a Hongyuan overnight."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("omtang", "hongyuan", c("俄么塘花海", "Omtang Flower Sea"), "grassland", ["scenery"], 4, 1.2, 55, 3500, "medium", c("花期型景点，非花期不应因名称而默认推荐。", "A bloom-dependent attraction that should not be assumed worthwhile out of season."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [6,7], opening: c("季节性开放，以官方公告为准", "Seasonal; follow official opening notices"), verifiedOn: "2026-08-30" }),
  attraction("hongyuan-grassland", "hongyuan", c("红原草原正规观景点", "Hongyuan grassland viewpoints"), "grassland", ["scenery", "rest"], 1.5, 0.2, 8, 3500, "low", c("仅选正规停车区域，避免在国省道随意停车。", "Use formal parking only; never stop casually on national or provincial roads."), "https://www.abazhou.gov.cn/", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("yellow-river-bend", "tangke", c("黄河九曲第一湾", "First Bend of the Yellow River"), "grassland", ["scenery"], 3, 0.4, 18, 3450, "medium", c("日落观景会与避免夜路冲突，规划器不会默认安排日落后返程。", "Sunset viewing conflicts with avoiding night driving, so the planner does not assume a post-sunset return."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("flower-lake", "ruoergai", c("若尔盖花湖", "Ruoergai Flower Lake"), "grassland", ["scenery", "wildlife"], 4.5, 1.0, 45, 3460, "medium", c("湿地生态景区，按栈道和景区规则游览，不进入保护区。", "A wetland visit: stay on managed paths and outside protected areas."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9], opening: c("受生态保护和季节安排影响", "Subject to conservation and seasonal arrangements"), verifiedOn: "2026-08-30" }),
  attraction("ruoergai-town", "ruoergai", c("若尔盖县城休整", "Ruoergai rest stop"), "grassland", ["rest"], 1.2, 0, 0, 3440, "low", c("作为高原北部补给和住宿节点，不对应具体商家推荐。", "A northern plateau resupply and overnight node, without recommending individual businesses."), "https://www.abazhou.gov.cn/", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("songpan-old-town", "songpan", c("松潘古城", "Songpan Old Town"), "jiuzhai", ["culture", "rest"], 2.5, 0.2, 8, 2850, "low", c("可与当日较短转场组合，开放区域与收费项目现场核验。", "Works with a shorter transfer day; verify open areas and paid activities on site."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("huanglong", "huanglong", c("黄龙风景区", "Huanglong Scenic Area"), "jiuzhai", ["scenery", "hiking"], 7, 0.5, 18, 3500, "high", c("高海拔整日景区；索道也不能消除高反风险。", "A full-day high-altitude visit; the cableway does not remove altitude risk."), "https://www.huanglong.com/cn/jqjs/hljq?id=4584", { bestMonths: [5,6,7,8,9,10,11], opening: c("开放与索道运行以黄龙官网公告为准", "Opening and cableway status follow Huanglong official notices"), reservation: c("出发前从官方入口核验购票预约", "Verify booking through the official channel before departure"), verifiedOn: "2026-08-30" }),
  attraction("munigou", "songpan", c("牟尼沟", "Munigou"), "jiuzhai", ["scenery", "hiking"], 5, 1.2, 50, 3000, "medium", c("松潘支线景区，适合替代而不是叠加黄龙整日游。", "A Songpan side trip best treated as an alternative to, not an addition to, a full Huanglong day."), "https://www.abazhou.gov.cn/", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("jiuzhaigou", "jiuzhaigou", c("九寨沟风景区", "Jiuzhaigou National Park"), "jiuzhai", ["scenery"], 9, 0.4, 15, 2600, "medium", c("必须作为整日活动安排，不与当天长距离返程叠加。", "Treat this as a full-day visit and do not add a long return drive."), "https://www.jiuzhai.com/intelligent-service/tickets", { bestMonths: [4,5,6,7,8,9,10,11], opening: c("旺季与淡季入园时段不同，以官网当日公告为准", "Entry windows differ by season; follow the current official notice"), reservation: c("实名预约；官方提示无预约不出行", "Real-name reservation; official guidance says do not travel without one"), verifiedOn: "2026-08-30" }),
  attraction("shennianchi", "jiuzhaigou", c("神仙池", "Shenxianchi"), "jiuzhai", ["scenery", "hiking"], 6, 2.2, 95, 3000, "medium", c("与九寨沟主景区不同方向，需额外留出完整时间。", "A separate direction from the main Jiuzhaigou park and requires substantial extra time."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("qiang-city", "maoxian", c("中国古羌城", "Ancient Qiang City"), "jiuzhai", ["culture"], 3, 0.4, 15, 1600, "low", c("适合作为九寨沟方向进出时的低海拔人文停留。", "A lower-altitude cultural stop when entering or leaving the Jiuzhaigou corridor."), "https://www.abazhou.gov.cn/", { bestMonths: [3,4,5,6,7,8,9,10,11], verifiedOn: "2026-08-30" }),
  attraction("diexi", "maoxian", c("叠溪—松坪沟", "Diexi · Songpinggou"), "jiuzhai", ["scenery", "culture"], 6, 1.7, 75, 2400, "medium", c("需要大半日支线时间，地灾或强降雨预警时应取消。", "Requires most of a day; cancel during geohazard or heavy-rain warnings."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10,11], verifiedOn: "2026-08-30" }),
  attraction("sanjiang-eco", "yingxiu", c("汶川三江生态旅游区", "Wenchuan Sanjiang"), "aba", ["scenery", "rest"], 5, 2.0, 85, 1500, "medium", c("映秀方向的支线自然景区，适合增加一晚而不是压入长途转场日。", "A nature side trip from Yingxiu, best with an extra night rather than a long transfer day."), "https://www.abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [4,5,6,7,8,9,10], opening: c("开放范围受天气与景区公告影响", "Open areas depend on weather and official notices"), reservation: c("出发前从官方入口核验购票与预约", "Verify ticketing and reservations through the official source"), verifiedOn: "2026-08-30" }),
  attraction("qiangren-valley", "wenchuan", c("汶川羌人谷", "Wenchuan Qiangren Valley"), "aba", ["culture", "scenery"], 3.5, 0.8, 35, 1700, "low", c("以羌族村落和河谷为主，参观时尊重居民空间与现场规则。", "A Qiang cultural valley where visitors should respect residents and on-site rules."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], opening: c("具体开放项目以属地公告为准", "Specific open activities follow local notices"), verifiedOn: "2026-08-30" }),
  attraction("ganbao-village", "lixian", c("甘堡藏寨", "Ganbao Tibetan Village"), "maerkang", ["culture", "rest"], 2.5, 0.4, 16, 1900, "low", c("G317沿线的人文停留，可与理县城区或桃坪羌寨择一组合。", "A cultural stop along G317, best combined selectively with Li County or Taoping."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], opening: c("公共区域与经营项目开放状态分别核验", "Verify public areas and operated activities separately"), verifiedOn: "2026-08-30" }),
  attraction("guergou", "miyaluo", c("古尔沟河谷休整", "Guergou valley rest"), "maerkang", ["rest", "scenery"], 2, 0.3, 12, 2400, "low", c("仅作为住宿区域和河谷休整，不推荐具体温泉酒店或商家。", "An overnight and valley-rest area without endorsing individual hot-spring hotels."), "https://www.abazhou.gov.cn/", { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], opening: c("公共区域全年可到访，经营项目自行核验", "Public areas are generally accessible; verify operated services independently"), verifiedOn: "2026-08-30" }),
  attraction("lianghekou-memorial", "xiaojin", c("两河口会议纪念地", "Lianghekou Meeting Memorial"), "aba", ["culture"], 2, 0.8, 35, 2800, "low", c("红色历史主题停留，纪念场馆开放时间需在出发前核验。", "A historic memorial stop; verify museum opening hours before departure."), "https://www.abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [4,5,6,7,8,9,10], opening: c("纪念场馆开放以官方或属地公告为准", "Museum access follows official or local notices"), verifiedOn: "2026-08-30" }),
  attraction("dagu-glacier", "heishui", c("达古冰川", "Dagu Glacier"), "heishui", ["scenery", "hiking"], 7, 0.8, 35, 4860, "high", c("索道上站海拔极高，应单独安排一日并保留因天气取消的余地。", "The upper cableway station is extremely high; reserve a full day and a weather cancellation option."), "https://abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [1,2,3,5,6,7,8,9,10,11,12], opening: c("景区及索道运行以官方当日公告为准", "Park and cableway operation follow same-day official notices"), reservation: c("出发前核验实名购票与入园时段", "Verify real-name ticketing and entry windows before departure"), verifiedOn: "2026-08-30" }),
  attraction("naizigou", "heishui", c("奶子沟彩林", "Naizigou Forest"), "heishui", ["scenery"], 4, 0.8, 38, 2600, "low", c("秋季色彩最集中；只在正规停车点停留，不把省道路肩当观景台。", "Most colourful in autumn; use formal parking rather than road shoulders."), "https://abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [9,10,11], opening: c("沿线开放与交通状态需结合属地公告", "Access and traffic status require local notice checks"), verifiedOn: "2026-08-30" }),
  attraction("san-ao-snow-mountain", "heishui", c("三奥雪山景区", "San'ao Snow Mountain"), "heishui", ["scenery", "hiking"], 8, 1.0, 45, 3600, "high", c("登山与长线徒步不等同普通观光，需使用正规线路并评估天气和体力。", "Mountaineering and long hikes require managed routes plus weather and fitness assessment."), "https://abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [5,6,7,8,9,10], opening: c("线路开放和活动许可必须查官方公告", "Route access and activity permission require official confirmation"), reservation: c("高强度活动可能需要另行预约或向导", "Demanding activities may require separate booking or a guide"), verifiedOn: "2026-08-30" }),
  attraction("luhua-meeting", "heishui", c("芦花会议纪念地", "Luhua Meeting Memorial"), "heishui", ["culture"], 2, 0.3, 12, 2350, "low", c("适合与黑水县城住宿组合的人文历史停留。", "A cultural and historic stop suited to a Heishui overnight."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10,11], opening: c("场馆开放时间以属地公告为准", "Museum hours follow local notices"), verifiedOn: "2026-08-30" }),
  attraction("waqie-pagodas", "hongyuan", c("瓦切塔林", "Waqie Pagoda Forest"), "grassland", ["culture", "scenery"], 2, 0.7, 32, 3450, "low", c("宗教文化场所，遵守现场礼仪、拍摄和无人机规定。", "A religious cultural site: follow etiquette, photography and drone rules."), "https://www.abazhou.gov.cn/", { bestMonths: [5,6,7,8,9,10], opening: c("开放范围以现场和属地公告为准", "Accessible areas follow on-site and local notices"), verifiedOn: "2026-08-30" }),
  attraction("long-march-monument", "songpan", c("红军长征纪念碑碑园", "Long March Monument Park"), "jiuzhai", ["culture"], 2, 0.3, 12, 3000, "low", c("川主寺附近的人文停留，可与短转场日组合。", "A cultural stop near Chuanzhusi that fits a shorter transfer day."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], opening: c("园区及展馆开放时间分别核验", "Verify park and exhibition-hall hours separately"), verifiedOn: "2026-08-30" }),
  attraction("zhangzha-rest", "jiuzhaigou", c("漳扎镇与沟口休整", "Zhangzha and park entrance rest"), "jiuzhai", ["rest", "culture"], 1.5, 0, 0, 2000, "low", c("用于提前抵达、确认预约和补给，不包含具体酒店餐厅推荐。", "For early arrival, reservation checks and supplies, without individual hotel or restaurant endorsements."), "https://www.jiuzhai.com/", { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], opening: c("公共区域可到访，经营项目自行核验", "Public areas are accessible; verify operated services independently"), verifiedOn: "2026-08-30" }),
  attraction("pingtou-qiang", "maoxian", c("坪头羌寨", "Pingtou Qiang Village"), "jiuzhai", ["culture", "rest"], 2.5, 0.5, 20, 1700, "low", c("茂县附近的羌族村落停留，注意居民生活空间和停车秩序。", "A Qiang village stop near Mao County; respect residents and parking rules."), "https://www.abazhou.gov.cn/", { bestMonths: [4,5,6,7,8,9,10], opening: c("公共区域与经营体验需分别核验", "Verify public areas and operated experiences separately"), verifiedOn: "2026-08-30" }),
  attraction("moxi-town", "luding", c("磨西古镇", "Moxi Old Town"), "return", ["culture", "rest"], 2.5, 1.8, 80, 1600, "low", c("海螺沟方向支线上的住宿与历史停留，不与疲劳返程硬塞。", "An overnight and historic stop on the Hailuogou branch, not for a rushed return day."), "https://www.luding.gov.cn/", { bestMonths: [3,4,5,6,7,8,9,10,11], opening: c("公共街区与场馆开放状态分别核验", "Verify public streets and venues separately"), verifiedOn: "2026-08-30" }),
  attraction("mengding-mountain", "yaan", c("蒙顶山", "Mengding Mountain"), "return", ["scenery", "culture", "hiking"], 5, 1.2, 48, 1450, "medium", c("适合作为返程前增加一晚的茶文化与低山徒步活动。", "A tea-culture and lower-mountain outing best with an extra night before returning."), "https://www.yaan.gov.cn/", { bestMonths: [3,4,5,6,7,8,9,10,11], opening: c("景区开放和索道状态以官方公告为准", "Park and cableway status follow official notices"), reservation: c("节假日前核验购票与预约要求", "Verify holiday ticketing and reservation requirements"), verifiedOn: "2026-08-30" }),
];

export const lodgingAreas: LodgingArea[] = [
  { anchorId: "wenchuan", name: c("汶川县城", "Wenchuan town"), services: c("补给和医疗相对完整，海拔较低", "Relatively complete supplies and medical access at lower altitude"), tradeoff: c("距北部草原和九寨沟仍较远", "Still far from the northern grasslands and Jiuzhaigou") },
  { anchorId: "lixian", name: c("理县城区", "Li County town"), services: c("适合渐进升高海拔", "Useful for gradual altitude gain"), tradeoff: c("旺季住宿容量需提前核验", "Peak-season capacity needs advance checking") },
  { anchorId: "maerkang", name: c("马尔康城区", "Barkam urban area"), services: c("西部走廊的重要补给节点", "A major resupply node on the western corridor"), tradeoff: c("前往莲宝叶则仍需长距离驾驶", "Lianbaoyeze still requires a long onward drive") },
  { anchorId: "aba-county", name: c("阿坝县城区", "Ngawa County town"), services: c("莲宝叶则往返的合理基地", "A practical base for Lianbaoyeze"), tradeoff: c("住宿海拔约3290米", "Sleeping altitude is about 3,290 m") },
  { anchorId: "hongyuan", name: c("红原县城", "Hongyuan town"), services: c("草原线路补给较集中", "Concentrated supplies on the grassland corridor"), tradeoff: c("高海拔且冬季天气风险高", "High altitude with elevated winter weather risk") },
  { anchorId: "heishui", name: c("黑水县城", "Heishui town"), services: c("达古冰川与彩林走廊的合理住宿基地", "A practical base for Dagu Glacier and the forest corridor"), tradeoff: c("前往北部草原的部分道路弯多且补给有限", "Some onward roads to the northern grasslands are winding with limited supplies") },
  { anchorId: "ruoergai", name: c("若尔盖县城", "Ruoergai town"), services: c("花湖和北部草原的住宿节点", "An overnight node for Flower Lake and northern grasslands"), tradeoff: c("距黄龙、九寨沟仍需转场", "Still requires a transfer to Huanglong or Jiuzhaigou") },
  { anchorId: "songpan", name: c("松潘城区", "Songpan town"), services: c("可连接若尔盖、黄龙和九寨沟", "Connects Ruoergai, Huanglong and Jiuzhaigou"), tradeoff: c("节假日道路与停车压力较大", "Holiday traffic and parking can be heavy") },
  { anchorId: "jiuzhaigou", name: c("漳扎镇/沟口住宿区域", "Zhangzha / park entrance area"), services: c("便于次日按预约时段入园", "Convenient for the next day's reserved entry"), tradeoff: c("旺季价格与容量波动，本项目不推荐具体酒店", "Peak-season prices and capacity vary; this project names no individual hotels") },
];

export const sourceSummary = [
  {
    agency: c("四姑娘山景区官方网站", "Mount Siguniang official site"),
    scope: c("三沟介绍、游览方式与官方线路", "Valley descriptions, visit modes and official itineraries"),
    url: "https://www.sgns.cn/play/line",
    cadence: c("按需核对", "Checked as needed"),
  },
  {
    agency: c("丹巴县人民政府", "Danba County Government"),
    scope: c("甲居、中路、梭坡等官方文旅信息", "Official information for Jiaju, Zhonglu and Suopo"),
    url: DANBA,
    cadence: c("按需核对", "Checked as needed"),
  },
  {
    agency: c("康定市人民政府", "Kangding Municipal Government"),
    scope: c("康定、新都桥、塔公官方推荐线路", "Official routes for Kangding, Xinduqiao and Tagong"),
    url: KANGDING,
    cadence: c("按需核对", "Checked as needed"),
  },
  {
    agency: c("九寨沟景区官方网站", "Jiuzhaigou official site"),
    scope: c("实名预约、入园时段、票务和临时公告", "Real-name booking, entry windows, tickets and temporary notices"),
    url: "https://www.jiuzhai.com/news/notice",
    cadence: c("出发前复核", "Recheck before departure"),
  },
  {
    agency: c("黄龙景区官方网站", "Huanglong official site"),
    scope: c("景区介绍、开放与索道运行入口", "Scenic-area, opening and cableway information"),
    url: "https://www.huanglong.com/",
    cadence: c("出发前复核", "Recheck before departure"),
  },
  {
    agency: c("甘孜州交通运输局 · 阿坝州人民政府", "Garzê Transport Bureau · Ngawa Government"),
    scope: c("统一周任务发现道路公告与景区更新候选；只保留标题、来源和链接", "The unified weekly job discovers road notices and attraction updates, storing only titles, sources and links"),
    url: "https://jtj.gzz.gov.cn/zwgk",
    cadence: c("每周自动发现", "Discovered weekly"),
  },
];

export const strategySuggestions = {
  comfort: ["qiang-city", "songpan-old-town", "maerkang-town", "moon-bay", "xiaojin-supply", "luding-bridge"],
  scenery: ["moon-bay", "flower-lake", "yellow-river-bend", "miyaluo-autumn", "shuangqiao", "tagong-grassland"],
  culture: ["yingxiu-memorial", "taoping-qiang", "zhuokeji", "songpan-old-town", "jiaju", "tagong-monastery"],
} as const;
