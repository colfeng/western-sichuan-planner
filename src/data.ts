export type Locale = "zh" | "en";

export type Copy = { zh: string; en: string };
export type Theme = "scenery" | "culture" | "wildlife" | "hiking" | "rest";
export type Effort = "low" | "medium" | "high";
export type RegionId = "gateway" | "aba" | "siguniang" | "maerkang" | "heishui" | "grassland" | "jiuzhai" | "danba" | "kangding" | "daocheng" | "return";
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
  bestMonths: number[];
  opening: Copy;
  reservation?: Copy;
  verifiedOn: string;
  updateSourceId?: string;
};

export type LodgingArea = {
  anchorId: string;
  name: Copy;
  services: Copy;
  tradeoff: Copy;
  stayAdvice?: Copy;
  dining?: Copy;
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
  daocheng: c("雅江·理塘·稻城亚丁", "Yajiang · Litang · Daocheng Yading"),
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
  { id: "yajiang", name: c("雅江", "Yajiang"), altitude: 2640, canStay: true, region: "daocheng", latitude: 30.03 },
  { id: "litang", name: c("理塘", "Litang"), altitude: 4010, canStay: true, region: "daocheng", latitude: 30.00 },
  { id: "sangdui", name: c("桑堆·海子山", "Sangdui · Haizi Mountain"), altitude: 3940, canStay: false, region: "daocheng", latitude: 29.28 },
  { id: "daocheng", name: c("稻城县城", "Daocheng town"), altitude: 3750, canStay: true, region: "daocheng", latitude: 29.04 },
  { id: "shangrila", name: c("香格里拉镇", "Shangri-La Town"), altitude: 2900, canStay: true, region: "daocheng", latitude: 28.57 },
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
  yajiang: { longitude: 101.014, latitude: 30.032 },
  litang: { longitude: 100.269, latitude: 29.996 },
  sangdui: { longitude: 100.112, latitude: 29.278 },
  daocheng: { longitude: 100.297, latitude: 29.038 },
  shangrila: { longitude: 100.333, latitude: 28.57 },
  kangding: { longitude: 101.96, latitude: 30.05 },
  luding: { longitude: 102.23, latitude: 29.91 },
  yaan: { longitude: 103.0, latitude: 30.01 },
};

const leg = (id: string, from: string, to: string, hours: number, km: number, road: string, evSupport: RouteLeg["evSupport"] = "good"): RouteLeg => ({ id, from, to, hours, km, road, evSupport });

export const roadLegs: RouteLeg[] = [
  // Open-road planning baselines, calibrated on 2026-08-31 against published
  // expressway/project mileages. Breaks, congestion and active controls are
  // intentionally handled elsewhere instead of being baked into drive time.
  leg("cd-djy", "chengdu", "dujiangyan", 1.0, 70, "S9 / G4217"),
  leg("djy-yx", "dujiangyan", "yingxiu", 0.4, 25, "G4217"),
  leg("yx-wc", "yingxiu", "wenchuan", 0.7, 50, "G4217"),
  leg("yx-wl", "yingxiu", "wolong", 1.2, 55, "G350"),
  leg("wl-bl", "wolong", "balang", 1.3, 58, "G350", "limited"),
  leg("bl-sgn", "balang", "siguniang", 1.0, 42, "G350", "limited"),
  leg("sgn-xj", "siguniang", "xiaojin", 1.0, 45, "G350"),
  leg("xj-db", "xiaojin", "danba", 1.5, 70, "G350", "limited"),
  leg("lx-xj", "lixian", "xiaojin", 2.0, 95, "G622 / 理小路", "limited"),
  leg("wc-lx", "wenchuan", "lixian", 0.8, 55, "G4217 / G317"),
  leg("lx-myl", "lixian", "miyaluo", 0.7, 55, "G4217 / G317"),
  leg("myl-mek", "miyaluo", "maerkang", 0.8, 65, "G4217 / G317"),
  leg("mek-ab", "maerkang", "aba-county", 3.0, 185, "G0615 / G248 / S220", "limited"),
  leg("ab-lbyz", "aba-county", "lianbaoyeze", 1.4, 75, "S452", "limited"),
  leg("mek-hy", "maerkang", "hongyuan", 2.2, 145, "G0615 / G248"),
  leg("hy-ab", "hongyuan", "aba-county", 3.2, 180, "G347 / S217", "limited"),
  leg("myl-hy", "miyaluo", "hongyuan", 3.1, 185, "G248"),
  leg("hy-tk", "hongyuan", "tangke", 1.6, 95, "G248"),
  leg("tk-reg", "tangke", "ruoergai", 1.1, 65, "G213"),
  leg("reg-sp", "ruoergai", "songpan", 2.5, 150, "G213"),
  leg("wc-mx", "wenchuan", "maoxian", 1.0, 50, "G213"),
  leg("mx-hs", "maoxian", "heishui", 2.2, 120, "G347", "limited"),
  leg("hs-hy", "heishui", "hongyuan", 3.0, 165, "G347 / G248", "limited"),
  leg("mx-sp", "maoxian", "songpan", 2.6, 160, "G213"),
  leg("sp-czs", "songpan", "chuanzhusi", 0.4, 20, "G213"),
  leg("czs-hl", "chuanzhusi", "huanglong", 1.2, 55, "G544", "limited"),
  leg("czs-jzg", "chuanzhusi", "jiuzhaigou", 2.0, 95, "G544"),
  leg("db-bm", "danba", "bamei", 2.4, 115, "G350", "limited"),
  leg("bm-tg", "bamei", "tagong", 0.7, 35, "G248"),
  leg("tg-xdq", "tagong", "xinduqiao", 1.0, 45, "G248 / G318"),
  leg("xdq-kd", "xinduqiao", "kangding", 1.7, 75, "G318"),
  leg("xdq-yj", "xinduqiao", "yajiang", 1.6, 70, "G318", "limited"),
  leg("yj-lt", "yajiang", "litang", 2.6, 135, "G318", "limited"),
  leg("lt-sd", "litang", "sangdui", 1.7, 100, "G227 / 理亚公路", "limited"),
  leg("sd-dc", "sangdui", "daocheng", 0.9, 50, "G227 / 理亚公路", "limited"),
  leg("dc-xgl", "daocheng", "shangrila", 1.6, 75, "G227 / 景区连接线", "limited"),
  leg("kd-ld", "kangding", "luding", 0.7, 40, "G4218 / G318"),
  leg("db-ld", "danba", "luding", 4.0, 200, "S211", "limited"),
  leg("ld-ya", "luding", "yaan", 1.3, 95, "G4218"),
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
): Attraction => {
  const regionalMonths: Record<RegionId, number[]> = {
    gateway: [1,2,3,4,5,6,7,8,9,10,11,12],
    aba: [4,5,6,7,8,9,10],
    siguniang: [4,5,6,7,8,9,10],
    maerkang: [4,5,6,7,8,9,10],
    heishui: [4,5,6,7,8,9,10,11],
    grassland: [5,6,7,8,9,10],
    jiuzhai: [4,5,6,7,8,9,10,11],
    danba: [3,4,5,6,7,8,9,10,11],
    kangding: [4,5,6,7,8,9,10,11],
    daocheng: [4,5,6,7,8,9,10,11],
    return: [3,4,5,6,7,8,9,10,11],
  };
  const publicStop = themes.includes("rest");
  const culturalVenue = themes.includes("culture") && !themes.includes("scenery") && !themes.includes("wildlife") && !themes.includes("hiking");
  const defaultOpening = publicStop
    ? c("公共街区、县城或正规沿线停留不设统一开放时段；只进入允许通行的公共区域，室内场馆和经营项目按当日公告。", "Public streets, towns and formal roadside stops have no single opening window. Use accessible public areas only; indoor venues and operated activities follow same-day notices.")
    : culturalVenue
      ? c("室内场馆或宗教空间按当日开放和值守安排进入；外部公共区域可达不代表内部场馆开放。", "Indoor venues and religious spaces follow same-day opening and staffing arrangements; access to the surrounding public area does not imply indoor access.")
      : c("景区开放时段可能随季节、天气和临时管控调整；本页不缓存固定时刻，出发前以官方当日公告为准。", "Opening windows may change with season, weather and temporary controls. This site does not cache fixed hours; use the same-day official notice.");
  return {
    id, anchorId, name, region, themes, visitHours, detourHours, detourKm, altitude, effort, summary, sourceUrl,
    bestMonths: details.bestMonths ?? regionalMonths[region],
    opening: details.opening ?? defaultOpening,
    ...(details.reservation ? { reservation: details.reservation } : {}),
    verifiedOn: details.verifiedOn ?? "2026-08-30",
  };
};

const SGNS = "https://www.sgns.cn/play/line";
const DANBA = "https://www.danba.gov.cn/czdb/article/719505";
const KANGDING = "https://www.kangding.gov.cn/kdlyxl/article/107031";
const ABA_ROUTES = "https://www.abazhou.gov.cn/abazhou/c101955/202106/bd45c9c73cea48ddbb9c40f0e52f3d31.shtml";
const HEISHUI_TRAVEL = "https://www.abazhou.gov.cn/abazhou/c101955/202310/863a67a497a64e6983a82df4719c0b74.shtml";
const WENCHUAN_TRAVEL = "https://wenchuan.gov.cn/wcxrmzf/c100133/201608/1b47274633344b759226afe6f078b039.shtml";
const XIAOJIN_HISTORY = "https://xiaojin.gov.cn/xjxrmzf/c100133/201505/ce0f456f95f34cac99bc0cd3be9d69d0.shtml";
const MAERKANG_TRAVEL = "https://www.abazhou.gov.cn/abazhou/c101960/202509/51c193b81fdb4badbc8bf565e8ba4660.shtml";
const LUDING_TRAVEL = "https://www.luding.gov.cn/zrzy/article/682818";
const YAAN_ROUTES = "https://www.yaan.gov.cn/mob/openinfo.html?id=d8d8dac404384ad383deabb7e5670dc7";
const ABA_3A = "https://www.abazhou.gov.cn/abazhou/c101955/202210/060d9a189f9f4133af19b4ff0a671c4e.shtml";
const ABA_ROAD_SERVICES = "https://abazhou.gov.cn/abazhou/c109639/202510/fec568fd9a5449cc908ea2cca0f0c431.shtml";

export const attractions: Attraction[] = [
  attraction("dujiangyan-irrigation", "dujiangyan", c("都江堰水利工程", "Dujiangyan Irrigation System"), "gateway", ["culture", "scenery"], 3, 0.4, 16, 730, "low", c("适合在进山前安排的半日人文景点。", "A half-day heritage stop before entering the mountains."), "https://www.djy.gov.cn/dyjgb_rmzfwz/c181378/lymap.shtml"),
  attraction("guanxian-town", "dujiangyan", c("灌县古城", "Guanxian Ancient Town"), "gateway", ["culture", "rest"], 1.5, 0.2, 8, 720, "low", c("适合作为补给、步行和较低海拔住宿点。", "A low-altitude stop for supplies, walking and an easy first night."), "https://www.djy.gov.cn/dyjgb_rmzfwz/c181378/lymap.shtml"),
  attraction("yingxiu-memorial", "yingxiu", c("映秀震中纪念地", "Yingxiu Memorial"), "aba", ["culture"], 1.5, 0.2, 8, 900, "low", c("需要保持肃静的纪念性停留。", "A memorial visit that calls for respectful conduct."), WENCHUAN_TRAVEL),
  attraction("yingxiu-old-town", "yingxiu", c("映秀老街与河谷", "Yingxiu old town and valley"), "aba", ["culture", "rest"], 1, 0.1, 4, 900, "low", c("短时休息与了解山地城镇重建。", "A short stop to understand the rebuilt mountain town."), WENCHUAN_TRAVEL),
  attraction("panda-shenshuping", "wolong", c("神树坪熊猫基地", "Shenshuping Panda Base"), "aba", ["wildlife"], 3, 0.6, 24, 1700, "low", c("建议预留半天，不与长距离驾驶日叠加。", "Allow half a day and avoid pairing it with a long drive."), ABA_ROUTES),
  attraction("wolong-museum", "wolong", c("卧龙自然与地震博物馆", "Wolong nature and earthquake museum"), "aba", ["wildlife", "culture"], 1.5, 0.2, 7, 2000, "low", c("天气不佳时也可安排的室内停留。", "An indoor stop that also works in poor weather."), ABA_ROUTES),
  attraction("gengda-valley", "wolong", c("耿达河谷慢游", "Gengda valley slow stop"), "aba", ["scenery", "rest"], 1.5, 0.3, 12, 1600, "low", c("仅在正规停车区域停留，不设置路肩拍照点。", "Stop only in formal parking areas, never on the road shoulder."), ABA_ROUTES),
  attraction("balang-viewpoint", "balang", c("巴朗山沿线正规观景点", "Balang corridor formal viewpoints"), "aba", ["scenery"], 0.7, 0.2, 6, 3600, "medium", c("受天气影响明显，雨雾时应直接取消。", "Highly weather-sensitive; skip it in rain or fog."), "https://www.sgns.cn/"),
  attraction("maobiliang", "balang", c("猫鼻梁观景台", "Maobiliang Viewpoint"), "aba", ["scenery", "rest"], 0.5, 0.1, 3, 3500, "low", c("短暂停留即可，不在道路出入口聚集。", "Keep the stop short and keep access lanes clear."), "https://www.sgns.cn/"),
  attraction("shuangqiao", "siguniang", c("双桥沟", "Shuangqiao Valley"), "aba", ["scenery"], 6, 0.3, 12, 3200, "low", c("配套较完善，但仍需考虑快速升高海拔。", "Well serviced, but the rapid altitude gain still matters."), SGNS, { reservation: c("按四姑娘山官方购票规则提前核验实名和入园时段。", "Verify real-name ticketing and the entry window through the Mount Siguniang official channel.") }),
  attraction("changping", "siguniang", c("长坪沟", "Changping Valley"), "aba", ["scenery", "hiking"], 7, 0.2, 8, 3300, "medium", c("接近整日活动，不宜当天继续长距离赶路。", "A near full-day outing; do not add a long drive afterward."), SGNS, { reservation: c("按四姑娘山官方购票规则提前核验实名和入园时段。", "Verify real-name ticketing and the entry window through the Mount Siguniang official channel.") }),
  attraction("haizi", "siguniang", c("海子沟", "Haizi Valley"), "aba", ["scenery", "hiking"], 8, 0.2, 8, 3400, "high", c("高海拔长线徒步，需要独立整日和体力评估。", "A demanding high-altitude hike requiring a full day and fitness check."), "https://www.sgns.cn/understand/hzg", { reservation: c("除景区票务外，长线户外活动还应按官方规则确认登记或许可。", "Besides park ticketing, confirm any registration or permission required for long outdoor routes.") }),
  attraction("siguniang-town", "siguniang", c("四姑娘山镇慢行", "Mount Siguniang Town walk"), "aba", ["culture", "rest"], 1.2, 0, 0, 3200, "low", c("适合作为高海拔抵达后的低强度活动。", "A low-intensity activity after arriving at altitude."), "https://www.sgns.cn/"),
  attraction("dawei-meeting", "xiaojin", c("达维会师纪念地", "Dawei historical memorial"), "aba", ["culture"], 1.5, 0.5, 20, 2700, "low", c("把红色历史内容放入小金段的短停。", "Adds a concise historical stop to the Xiaojin section."), XIAOJIN_HISTORY),
  attraction("wori-tusi", "xiaojin", c("沃日土司官寨", "Wori Tusi Manor"), "aba", ["culture", "scenery"], 1.8, 0.5, 22, 2500, "low", c("适合人文优先方案，需核对当日开放情况。", "A culture-focused stop; verify opening status for the day."), "https://xiaojin.gov.cn/xjxrmzf/c100050/202004/eee0647e57ae42ebbb979e1fc9a9eeff.shtml"),
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
  attraction("luding-bridge", "luding", c("泸定桥与老城", "Luding Bridge and old town"), "return", ["culture", "rest"], 1.5, 0.2, 7, 1330, "low", c("返程中的低海拔历史停留。", "A lower-altitude historical stop on the return."), LUDING_TRAVEL),
  attraction("hailuogou", "luding", c("海螺沟支线", "Hailuogou side trip"), "return", ["scenery"], 7, 2.8, 105, 1600, "medium", c("需要额外一日更合理，不应作为短暂停靠。", "Best given an extra day rather than treated as a brief stop."), LUDING_TRAVEL),
  attraction("bifengxia", "yaan", c("碧峰峡", "Bifengxia"), "return", ["scenery", "wildlife"], 5, 1.2, 45, 1100, "medium", c("适合延长一天，不建议放在疲劳返程末段。", "Works with an extra day, not at the end of a tiring return."), YAAN_ROUTES),
  attraction("shangli-town", "yaan", c("上里古镇", "Shangli Ancient Town"), "return", ["culture", "rest"], 3, 1, 42, 900, "low", c("需要从主返程线往返，适合作为雅安住宿日活动。", "Requires a return detour and works best with a Ya'an overnight."), YAAN_ROUTES),
  attraction("taoping-qiang", "lixian", c("桃坪羌寨", "Taoping Qiang Village"), "maerkang", ["culture"], 2.5, 0.5, 24, 1500, "low", c("可作为进入理县走廊的人文停留，开放状态以官方当日信息为准。", "A cultural stop on the Li County corridor; verify same-day opening information."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("bipenggou", "lixian", c("毕棚沟", "Bipenggou"), "maerkang", ["scenery", "hiking"], 6, 1.2, 50, 3000, "medium", c("建议单独预留大半天；秋色季和冰雪期体验差异明显。", "Allow most of a day; autumn colours and winter conditions are very different."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10,11], opening: c("开放时间随季节、天气和景区公告调整。", "Hours vary with season, weather and official notices."), verifiedOn: "2026-08-30" }),
  attraction("miyaluo-autumn", "miyaluo", c("米亚罗秋色走廊", "Miyaluo autumn corridor"), "maerkang", ["scenery"], 2.5, 0.4, 18, 2700, "low", c("季节性很强，只设置正规停车点，不把公路沿线当景区。", "Highly seasonal; use formal parking and do not treat road shoulders as viewpoints."), ABA_ROUTES, { bestMonths: [9,10,11], verifiedOn: "2026-08-30" }),
  attraction("zhuokeji", "maerkang", c("卓克基土司官寨", "Zhuokeji Tusi Manor"), "maerkang", ["culture"], 3, 0.4, 16, 2700, "low", c("马尔康走廊的核心人文停留，需核对预约和开放公告。", "A key cultural stop near Barkam; check reservations and opening notices."), MAERKANG_TRAVEL, { bestMonths: [4,5,6,7,8,9,10], opening: c("官寨室内展陈按景区当日开放和值守安排进入。", "Indoor manor exhibitions follow same-day opening and staffing arrangements."), verifiedOn: "2026-08-30" }),
  attraction("maerkang-town", "maerkang", c("马尔康城区休整", "Barkam rest stop"), "maerkang", ["rest", "culture"], 1.5, 0, 0, 2600, "low", c("适合作为补给和降低第二天连续驾驶压力的住宿点。", "A practical overnight and resupply stop that reduces next-day driving pressure."), MAERKANG_TRAVEL, { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("lianbaoyeze", "lianbaoyeze", c("莲宝叶则", "Lianbaoyeze"), "maerkang", ["scenery", "hiking"], 6, 0.5, 20, 4200, "high", c("超高海拔景区，建议住阿坝县往返，不在景区节点过夜。", "A very high-altitude visit; make it a return trip from Ngawa County rather than sleeping at the scenic node."), "https://www.abazhou.gov.cn/abazhou/c101955/202508/42e0b97f3ae84165964b24f9e5c5f760.shtml", { bestMonths: [5,6,7,8,9,10], opening: c("冬季和恶劣天气可能调整，须查官方公告", "Winter and severe weather may change access; check official notices"), reservation: c("出发前核验实名购票要求", "Verify real-name ticket requirements before departure"), verifiedOn: "2026-08-30" }),
  attraction("moon-bay", "hongyuan", c("红原月亮湾", "Hongyuan Moon Bay"), "grassland", ["scenery", "rest"], 2.5, 0.3, 12, 3500, "low", c("草原河湾景观，适合作为红原住宿日前后的低强度活动。", "A grassland river bend suited to a low-intensity stop around a Hongyuan overnight."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("omtang", "hongyuan", c("俄么塘花海", "Omtang Flower Sea"), "grassland", ["scenery"], 4, 1.2, 55, 3500, "medium", c("花期型景点，非花期不应因名称而默认推荐。", "A bloom-dependent attraction that should not be assumed worthwhile out of season."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [6,7], opening: c("季节性开放，以官方公告为准", "Seasonal; follow official opening notices"), verifiedOn: "2026-08-30" }),
  attraction("hongyuan-grassland", "hongyuan", c("红原草原正规观景点", "Hongyuan grassland viewpoints"), "grassland", ["scenery", "rest"], 1.5, 0.2, 8, 3500, "low", c("仅选正规停车区域，避免在国省道随意停车。", "Use formal parking only; never stop casually on national or provincial roads."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("yellow-river-bend", "tangke", c("黄河九曲第一湾", "First Bend of the Yellow River"), "grassland", ["scenery"], 3, 0.4, 18, 3450, "medium", c("日落观景会与避免夜路冲突，规划器不会默认安排日落后返程。", "Sunset viewing conflicts with avoiding night driving, so the planner does not assume a post-sunset return."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("flower-lake", "ruoergai", c("若尔盖花湖", "Ruoergai Flower Lake"), "grassland", ["scenery", "wildlife"], 4.5, 1.0, 45, 3460, "medium", c("湿地生态景区，按栈道和景区规则游览，不进入保护区。", "A wetland visit: stay on managed paths and outside protected areas."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9], opening: c("受生态保护和季节安排影响", "Subject to conservation and seasonal arrangements"), verifiedOn: "2026-08-30" }),
  attraction("ruoergai-town", "ruoergai", c("若尔盖县城休整", "Ruoergai rest stop"), "grassland", ["rest"], 1.2, 0, 0, 3440, "low", c("作为高原北部补给和住宿节点，不对应具体商家推荐。", "A northern plateau resupply and overnight node, without recommending individual businesses."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("songpan-old-town", "songpan", c("松潘古城", "Songpan Old Town"), "jiuzhai", ["culture", "rest"], 2.5, 0.2, 8, 2850, "low", c("可与当日较短转场组合，开放区域与收费项目现场核验。", "Works with a shorter transfer day; verify open areas and paid activities on site."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("huanglong", "huanglong", c("黄龙风景区", "Huanglong Scenic Area"), "jiuzhai", ["scenery", "hiking"], 7, 0.5, 18, 3500, "high", c("高海拔整日景区；索道也不能消除高反风险。", "A full-day high-altitude visit; the cableway does not remove altitude risk."), "https://www.huanglong.com/cn/jqjs/hljq?id=4584", { bestMonths: [5,6,7,8,9,10,11], opening: c("开放与索道运行以黄龙官网公告为准", "Opening and cableway status follow Huanglong official notices"), reservation: c("出发前从官方入口核验购票预约", "Verify booking through the official channel before departure"), verifiedOn: "2026-08-30" }),
  attraction("munigou", "songpan", c("牟尼沟", "Munigou"), "jiuzhai", ["scenery", "hiking"], 5, 1.2, 50, 3000, "medium", c("松潘支线景区，适合替代而不是叠加黄龙整日游。", "A Songpan side trip best treated as an alternative to, not an addition to, a full Huanglong day."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("jiuzhaigou", "jiuzhaigou", c("九寨沟风景区", "Jiuzhaigou National Park"), "jiuzhai", ["scenery"], 9, 0.4, 15, 2600, "medium", c("必须作为整日活动安排，不与当天长距离返程叠加。", "Treat this as a full-day visit and do not add a long return drive."), "https://www.jiuzhai.com/intelligent-service/tickets", { bestMonths: [4,5,6,7,8,9,10,11], opening: c("旺季与淡季入园时段不同，以官网当日公告为准", "Entry windows differ by season; follow the current official notice"), reservation: c("实名预约；官方提示无预约不出行", "Real-name reservation; official guidance says do not travel without one"), verifiedOn: "2026-08-30" }),
  attraction("shennianchi", "jiuzhaigou", c("神仙池", "Shenxianchi"), "jiuzhai", ["scenery", "hiking"], 6, 2.2, 95, 3000, "medium", c("与九寨沟主景区不同方向，需额外留出完整时间。", "A separate direction from the main Jiuzhaigou park and requires substantial extra time."), "https://www.abazhou.gov.cn/abazhou/c109755/202205/caedf2d5745a4ff0a27cfa2d2c8684a6.shtml", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-30" }),
  attraction("qiang-city", "maoxian", c("中国古羌城", "Ancient Qiang City"), "jiuzhai", ["culture"], 3, 0.4, 15, 1600, "low", c("适合作为九寨沟方向进出时的低海拔人文停留。", "A lower-altitude cultural stop when entering or leaving the Jiuzhaigou corridor."), ABA_ROUTES, { bestMonths: [3,4,5,6,7,8,9,10,11], verifiedOn: "2026-08-30" }),
  attraction("diexi", "maoxian", c("叠溪—松坪沟", "Diexi · Songpinggou"), "jiuzhai", ["scenery", "culture"], 6, 1.7, 75, 2400, "medium", c("需要大半日支线时间，地灾或强降雨预警时应取消。", "Requires most of a day; cancel during geohazard or heavy-rain warnings."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10,11], verifiedOn: "2026-08-30" }),
  attraction("sanjiang-eco", "yingxiu", c("汶川三江生态旅游区", "Wenchuan Sanjiang"), "aba", ["scenery", "rest"], 5, 2.0, 85, 1500, "medium", c("映秀方向的支线自然景区，适合增加一晚而不是压入长途转场日。", "A nature side trip from Yingxiu, best with an extra night rather than a long transfer day."), "https://www.abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [4,5,6,7,8,9,10], opening: c("开放范围受天气与景区公告影响", "Open areas depend on weather and official notices"), reservation: c("出发前从官方入口核验购票与预约", "Verify ticketing and reservations through the official source"), verifiedOn: "2026-08-30" }),
  attraction("qiangren-valley", "wenchuan", c("汶川羌人谷", "Wenchuan Qiangren Valley"), "aba", ["culture", "scenery"], 3.5, 0.8, 35, 1700, "low", c("以羌族村落和河谷为主，参观时尊重居民空间与现场规则。", "A Qiang cultural valley where visitors should respect residents and on-site rules."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], opening: c("具体开放项目以属地公告为准。", "Specific open activities follow local notices."), verifiedOn: "2026-08-30" }),
  attraction("ganbao-village", "lixian", c("甘堡藏寨", "Ganbao Tibetan Village"), "maerkang", ["culture", "rest"], 2.5, 0.4, 16, 1900, "low", c("G317沿线的人文停留，可与理县城区或桃坪羌寨择一组合。", "A cultural stop along G317, best combined selectively with Li County or Taoping."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], opening: c("公共村寨区域可通行；展陈、表演和经营体验按当日安排。", "Public village areas are accessible; exhibitions, performances and operated experiences follow same-day arrangements."), verifiedOn: "2026-08-30" }),
  attraction("guergou", "miyaluo", c("古尔沟河谷休整", "Guergou valley rest"), "maerkang", ["rest", "scenery"], 2, 0.3, 12, 2400, "low", c("仅作为住宿区域和河谷休整，不推荐具体温泉酒店或商家。", "An overnight and valley-rest area without endorsing individual hot-spring hotels."), ABA_ROUTES, { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], opening: c("公共河谷和镇区不设统一开放时段；温泉等经营项目单独核验。", "Public valley and town areas have no single opening window; verify operated hot-spring services separately."), verifiedOn: "2026-08-30" }),
  attraction("lianghekou-memorial", "xiaojin", c("两河口会议纪念地", "Lianghekou Meeting Memorial"), "aba", ["culture"], 2, 0.8, 35, 2800, "low", c("红色历史主题停留，纪念场馆开放时间需在出发前核验。", "A historic memorial stop; verify museum opening hours before departure."), "https://www.abazhou.gov.cn/abazhou/jqjs/common_list.shtml", { bestMonths: [4,5,6,7,8,9,10], opening: c("纪念场馆开放以官方或属地公告为准", "Museum access follows official or local notices"), verifiedOn: "2026-08-30" }),
  attraction("dagu-glacier", "heishui", c("达古冰川", "Dagu Glacier"), "heishui", ["scenery", "hiking"], 7, 0.8, 35, 4860, "high", c("索道上站海拔极高，应单独安排一日并保留因天气取消的余地。", "The upper cableway station is extremely high; reserve a full day and a weather cancellation option."), HEISHUI_TRAVEL, { bestMonths: [1,2,3,5,6,7,8,9,10,11,12], opening: c("景区及索道运行以官方当日公告为准。", "Park and cableway operation follow same-day official notices."), reservation: c("出发前核验实名购票与入园时段。", "Verify real-name ticketing and entry windows before departure."), verifiedOn: "2026-08-30" }),
  attraction("naizigou", "heishui", c("奶子沟彩林", "Naizigou Forest"), "heishui", ["scenery"], 4, 0.8, 38, 2600, "low", c("秋季色彩最集中；只在正规停车点停留，不把省道路肩当观景台。", "Most colourful in autumn; use formal parking rather than road shoulders."), HEISHUI_TRAVEL, { bestMonths: [9,10,11], opening: c("沿线开放与交通状态需结合属地公告。", "Access and traffic status require local notice checks."), verifiedOn: "2026-08-30" }),
  attraction("san-ao-snow-mountain", "heishui", c("三奥雪山景区", "San'ao Snow Mountain"), "heishui", ["scenery", "hiking"], 8, 1.0, 45, 3600, "high", c("登山与长线徒步不等同普通观光，需使用正规线路并评估天气和体力。", "Mountaineering and long hikes require managed routes plus weather and fitness assessment."), HEISHUI_TRAVEL, { bestMonths: [5,6,7,8,9,10], opening: c("线路开放和活动许可必须查官方公告。", "Route access and activity permission require official confirmation."), reservation: c("高强度活动须在到访前确认预约、许可和正规向导要求。", "Confirm booking, permits and managed-guide requirements before demanding activities."), verifiedOn: "2026-08-30" }),
  attraction("luhua-meeting", "heishui", c("芦花会议纪念地", "Luhua Meeting Memorial"), "heishui", ["culture"], 2, 0.3, 12, 2350, "low", c("适合与黑水县城住宿组合的人文历史停留。", "A cultural and historic stop suited to a Heishui overnight."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10,11], opening: c("纪念场馆按属地当日开放和值守安排进入。", "The memorial venue follows same-day local opening and staffing arrangements."), verifiedOn: "2026-08-30" }),
  attraction("waqie-pagodas", "hongyuan", c("瓦切塔林", "Waqie Pagoda Forest"), "grassland", ["culture", "scenery"], 2, 0.7, 32, 3450, "low", c("宗教文化场所，遵守现场礼仪、拍摄和无人机规定。", "A religious cultural site: follow etiquette, photography and drone rules."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10], opening: c("开放范围以现场宗教活动和属地公告为准。", "Accessible areas follow on-site religious activity and local notices."), verifiedOn: "2026-08-30" }),
  attraction("long-march-monument", "songpan", c("红军长征纪念碑碑园", "Long March Monument Park"), "jiuzhai", ["culture"], 2, 0.3, 12, 3000, "low", c("川主寺附近的人文停留，可与短转场日组合。", "A cultural stop near Chuanzhusi that fits a shorter transfer day."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], opening: c("室外碑园与室内展陈按各自当日开放安排进入。", "The outdoor monument park and indoor exhibitions follow their respective same-day access arrangements."), verifiedOn: "2026-08-30" }),
  attraction("zhangzha-rest", "jiuzhaigou", c("漳扎镇与沟口休整", "Zhangzha and park entrance rest"), "jiuzhai", ["rest", "culture"], 1.5, 0, 0, 2000, "low", c("用于提前抵达、确认预约和补给，不包含具体酒店餐厅推荐。", "For early arrival, reservation checks and supplies, without individual hotel or restaurant endorsements."), "https://www.jiuzhai.com/", { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], opening: c("公共区域可到访，经营项目自行核验", "Public areas are accessible; verify operated services independently"), verifiedOn: "2026-08-30" }),
  attraction("shuimo-town", "yingxiu", c("水磨古镇", "Shuimo Ancient Town"), "aba", ["culture", "rest"], 2.5, 1.2, 45, 1100, "low", c("汶川南部的藏羌文化与灾后重建停留，适合与映秀择一或增加半日。", "A southern Wenchuan cultural and reconstruction stop, best as an alternative to Yingxiu or with an extra half day."), WENCHUAN_TRAVEL, { bestMonths: [3,4,5,6,7,8,9,10,11] }),
  attraction("zhegushan", "miyaluo", c("鹧鸪山自然公园", "Zhegushan Nature Park"), "maerkang", ["scenery", "hiking"], 5, 1.3, 55, 3200, "medium", c("季节差异明显的高山景区，冰雪项目和普通观光不能使用同一套时间假设。", "A high-mountain park with strong seasonal differences; snow activities and ordinary sightseeing need different time assumptions."), ABA_ROUTES, { bestMonths: [1,2,3,5,6,7,8,9,10,11,12] }),
  attraction("xisuo-village", "maerkang", c("西索民居", "Xisuo Village"), "maerkang", ["culture", "rest"], 2, 0.3, 12, 2700, "low", c("卓克基附近的嘉绒民居停留，应尊重居民生活空间，不把村道当停车场。", "A Jiarong residential stop near Zhuokeji; respect residents and never use village lanes as parking."), MAERKANG_TRAVEL, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("songgang-watchtowers", "maerkang", c("松岗直波碉群", "Songgang-Zhibo Watchtowers"), "maerkang", ["culture", "scenery"], 2.5, 1.2, 55, 2800, "low", c("嘉绒古碉与村寨景观，需要单独留出支线时间并使用正规停车点。", "Jiarong watchtowers and villages requiring a dedicated side trip and formal parking."), MAERKANG_TRAVEL, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("shenzuo-village", "aba-county", c("神座村", "Shenzuo Village"), "maerkang", ["culture", "scenery", "rest"], 4, 2.5, 110, 3200, "medium", c("阿坝县方向的偏远村寨支线，不能与莲宝叶则整日游压在同一天。", "A remote village side trip from Ngawa County that should not share a day with a full Lianbaoyeze visit."), ABA_ROUTES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("manzetang-wetland", "aba-county", c("曼则塘湿地", "Manzetang Wetland"), "maerkang", ["scenery", "wildlife"], 4, 2.0, 95, 3400, "medium", c("高原湿地生态停留，只使用允许进入的道路和观景区域，不进入保护区腹地。", "A plateau-wetland stop using permitted roads and viewpoints only, never the protected interior."), ABA_ROUTES, { bestMonths: [5,6,7,8,9] }),
  attraction("yangrong-hade", "heishui", c("羊茸·哈德藏寨", "Yangrong Hade Village"), "heishui", ["culture", "scenery", "rest"], 3, 0.8, 35, 2500, "low", c("彩林季的人文村寨停留，公共参观与经营体验需分开理解。", "A cultural village stop during forest season; distinguish public access from operated experiences."), HEISHUI_TRAVEL, { bestMonths: [5,6,7,8,9,10,11] }),
  attraction("seergu-village", "heishui", c("色尔古藏寨", "Seergu Tibetan Village"), "heishui", ["culture", "scenery"], 2.5, 1.0, 40, 2200, "low", c("传统村寨与碉楼人文停留，参观时避让居民空间并遵守现场规则。", "A traditional village and watchtower stop; respect residential space and on-site rules."), HEISHUI_TRAVEL, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("kalong-valley", "heishui", c("卡龙沟", "Kalong Valley"), "heishui", ["scenery", "hiking"], 6, 2.6, 110, 3100, "medium", c("黑水远端支线景区，必须预留完整白天并在强降雨或地灾预警时取消。", "A remote Heishui side trip requiring a full daylight window and cancellation during heavy-rain or geohazard warnings."), HEISHUI_TRAVEL, { bestMonths: [5,6,7,8,9,10,11] }),
  attraction("yanzigou", "luding", c("燕子沟", "Yanzigou Valley"), "return", ["scenery", "hiking"], 6, 3.0, 115, 2500, "medium", c("贡嘎山东坡支线，应作为独立大半日活动，不与海螺沟重复堆叠。", "A Gongga east-slope side trip that needs most of a day and should not be stacked with Hailuogou."), LUDING_TRAVEL, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("yajiageng-redstone", "luding", c("雅家埂红石与山口走廊", "Yajiageng Redstone Corridor"), "return", ["scenery"], 4, 2.5, 95, 3000, "medium", c("山口天气与道路条件变化快，只在正式开放和允许停车的区域停留。", "Pass weather and road conditions change quickly; stop only in officially open areas with permitted parking."), LUDING_TRAVEL, { bestMonths: [5,6,7,8,9,10,11] }),
  attraction("labahe", "yaan", c("二郎山喇叭河", "Erlangshan Labahe"), "return", ["scenery", "wildlife", "hiking"], 7, 3.0, 145, 1800, "medium", c("雅安西部整日生态支线，受降雨和景区道路状态影响明显。", "A full-day ecological side trip west of Ya'an, strongly affected by rainfall and park-road status."), "https://www.yaan.gov.cn/zhangzhe/show/e25afce3-52ad-4115-91ca-79db493da68e.html", { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("pingtou-qiang", "maoxian", c("坪头羌寨", "Pingtou Qiang Village"), "jiuzhai", ["culture", "rest"], 2.5, 0.5, 20, 1700, "low", c("茂县附近的羌族村落停留，注意居民生活空间和停车秩序。", "A Qiang village stop near Mao County; respect residents and parking rules."), ABA_ROUTES, { bestMonths: [4,5,6,7,8,9,10], opening: c("公共村寨区域可通行；展陈和经营体验按当日安排。", "Public village areas are accessible; exhibitions and operated experiences follow same-day arrangements."), verifiedOn: "2026-08-30" }),
  attraction("moxi-town", "luding", c("磨西古镇", "Moxi Old Town"), "return", ["culture", "rest"], 2.5, 1.8, 80, 1600, "low", c("海螺沟方向支线上的住宿与历史停留，不与疲劳返程硬塞。", "An overnight and historic stop on the Hailuogou branch, not for a rushed return day."), LUDING_TRAVEL, { bestMonths: [3,4,5,6,7,8,9,10,11], opening: c("公共街区不设统一开放时段；场馆和经营项目按当日安排。", "Public streets have no single opening window; venues and operated activities follow same-day arrangements."), verifiedOn: "2026-08-30" }),
  attraction("mengding-mountain", "yaan", c("蒙顶山", "Mengding Mountain"), "return", ["scenery", "culture", "hiking"], 5, 1.2, 48, 1450, "medium", c("适合作为返程前增加一晚的茶文化与低山徒步活动。", "A tea-culture and lower-mountain outing best with an extra night before returning."), YAAN_ROUTES, { bestMonths: [3,4,5,6,7,8,9,10,11], opening: c("景区开放和索道状态以官方当日公告为准。", "Park and cableway status follow same-day official notices."), reservation: c("节假日前从景区官方售票入口核验购票与预约要求。", "Before holidays, verify ticketing and reservations through the official ticket channel."), verifiedOn: "2026-08-30" }),
  attraction("changlie-mountain", "maerkang", c("昌列山生态文化景区", "Changlie Mountain Eco-cultural Area"), "maerkang", ["culture", "scenery", "hiking"], 4, 0.8, 30, 3000, "medium", c("马尔康城郊的山地人文支线，道路弯多，不应在疲劳或雨雾时勉强上山。", "A mountainous cultural side trip near Barkam; the road has many bends, so skip it when tired or in rain and fog."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("maomuchu", "maerkang", c("毛木初景区", "Maomuchu Scenic Area"), "maerkang", ["scenery", "hiking"], 5, 1.4, 50, 2860, "medium", c("梭磨乡方向的海子与森林支线，建议在马尔康多住一晚后安排。", "A lake-and-forest side trip toward Suomo, best with an extra Barkam night."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("jiajin-mountain", "xiaojin", c("夹金山旅游景区", "Jiajin Mountain Scenic Area"), "aba", ["scenery", "culture", "hiking"], 5, 2.0, 80, 3500, "high", c("高山垭口与长征主题支线；开放和通行方式变化时必须以交警与属地公告为准。", "A high-pass and Long March side trip; follow current police and local access notices."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("majia-valley", "xiaojin", c("两河口玛嘉沟", "Lianghekou Majia Valley"), "aba", ["scenery", "hiking"], 8, 2.5, 105, 3500, "high", c("沟内海拔约3090至3900米，是独立整日徒步支线，不与四姑娘山沟区叠加。", "A full-day hiking branch rising from about 3,090 to 3,900 m; do not stack it with a Mount Siguniang valley."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("wenshan-yuji", "lixian", c("汶山石纽山禹迹景区", "Wenshan Shiniu Yu Heritage Area"), "maerkang", ["culture", "scenery"], 3, 0.8, 32, 2000, "low", c("羌族村寨、山地生态与禹文化组合，适合在理县低海拔过渡日安排。", "A combination of Qiang villages, mountain ecology and Yu heritage for a lower-altitude Li County transition day."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("jiarong-castle", "lixian", c("嘉绒古堡生态文化景区", "Jiarong Castle Eco-cultural Area"), "maerkang", ["culture", "scenery", "rest"], 3.5, 1.1, 42, 2200, "low", c("下孟乡方向的村寨组合，尊重居民空间并在正规区域停车。", "A village cluster toward Xiameng; respect residents and use formal parking."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("guantian-village", "lixian", c("和美官田景区", "Hemei Guantian Village"), "maerkang", ["culture", "rest"], 2, 0.4, 15, 2000, "low", c("理县近郊的农耕与藏居短停，可与较短转场日组合。", "A farming and Tibetan-dwelling stop near Li County that fits a shorter transfer day."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("aba-farming", "aba-county", c("坝上农耕生态景区", "Bashang Farming Eco Area"), "maerkang", ["culture", "scenery", "rest"], 2.5, 0.4, 15, 3290, "low", c("阿坝县城近郊的季节性农田景观，非花期不作为主要景点。", "A seasonal farming landscape near Ngawa County; do not treat it as a main attraction outside bloom season."), ABA_3A, { bestMonths: [6,7,8] }),
  attraction("nomadic-culture", "aba-county", c("游牧味道民俗文化景区", "Nomadic Culture Area"), "maerkang", ["culture", "rest"], 2.5, 0.7, 28, 3300, "low", c("以非遗和游牧文化为主，具体展演与经营体验按当日安排。", "Focused on intangible heritage and nomadic culture; performances and operated experiences follow same-day arrangements."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("rammed-earth-village", "aba-county", c("夯土古寨文化景区", "Rammed-earth Ancient Village"), "maerkang", ["culture", "scenery"], 3, 0.8, 32, 3350, "low", c("阿坝县近郊夯土建筑与民俗支线，村寨参观不进入居民私人空间。", "A rammed-earth architecture and culture side trip; do not enter private residential areas."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("baxi-meeting", "ruoergai", c("巴西会议旧址", "Baxi Meeting Site"), "grassland", ["culture"], 3, 1.2, 66, 3300, "low", c("若尔盖东部的长征历史支线，可与县城住宿日组合但需预留往返时间。", "A Long March history branch east of Ruoergai; combine with a town overnight and allow return time."), ABA_3A, { bestMonths: [5,6,7,8,9,10] }),
  attraction("yake-music-pasture", "hongyuan", c("雅克音乐牧场", "Yake Music Pasture"), "grassland", ["culture", "scenery", "rest"], 2, 0.3, 15, 3500, "low", c("红原县城北侧的草原文化短停；节庆活动与日常开放不是同一概念。", "A grassland-culture stop north of Hongyuan; festival events do not imply ordinary daily access."), ABA_3A, { bestMonths: [6,7,8,9] }),
  attraction("zhaogong-eco", "yingxiu", c("赵公福地生态旅游区", "Zhaogong Eco-tourism Area"), "aba", ["scenery", "hiking"], 4, 1.5, 60, 1500, "medium", c("汶川漩口方向山地生态支线，强降雨和地灾预警时取消。", "A mountain-ecology branch toward Xuankou; cancel during heavy rain or geohazard warnings."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("buwa-cultural", "wenchuan", c("布瓦文化旅游区", "Buwa Cultural Area"), "aba", ["culture", "scenery", "rest"], 3, 0.7, 28, 1700, "low", c("汶川县城北部的羌族碉楼和观景短停，适合与县城住宿组合。", "A Qiang watchtower and viewpoint stop north of Wenchuan town, suitable with a town overnight."), ABA_3A, { bestMonths: [3,4,5,6,7,8,9,10,11] }),
  attraction("chibusu-qiang", "maoxian", c("赤不苏原生态羌文化园", "Chibusu Qiang Cultural Area"), "jiuzhai", ["culture", "scenery"], 4, 1.8, 75, 2000, "medium", c("茂县西北部羌族村寨与峡谷支线，应增加半日至一日，不塞入九寨长转场。", "A Qiang village and canyon branch northwest of Mao County; allow half to one full day rather than adding it to a long Jiuzhaigou transfer."), ABA_3A, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("anxiang-snow", "maoxian", c("安乡冰雪运动休闲区", "Anxiang Snow Recreation Area"), "jiuzhai", ["scenery", "hiking"], 5, 1.7, 70, 2800, "medium", c("冰雪项目强季节性，普通观景与滑雪营业状态必须分开核验。", "Snow activities are highly seasonal; verify ordinary sightseeing and ski operations separately."), ABA_3A, { bestMonths: [1,2,3,12] }),
  attraction("qixiagou", "songpan", c("奇峡沟", "Qixia Valley"), "jiuzhai", ["scenery", "hiking"], 5, 1.4, 55, 3100, "medium", c("松潘方向山谷支线，适合作为黄龙或牟尼沟的替代选项，不在同一天叠加。", "A Songpan valley branch best treated as an alternative to Huanglong or Munigou, not stacked on the same day."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("minjiang-source", "chuanzhusi", c("岷江源湿地科普馆", "Minjiang Source Wetland Science Centre"), "jiuzhai", ["wildlife", "culture", "rest"], 2, 0.4, 16, 3000, "low", c("川主寺附近的湿地科普短停，适合与短转场组合，室内开放需当天确认。", "A wetland-science stop near Chuanzhusi that fits a short transfer day; confirm indoor opening that day."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("mianchi-dayu-altar", "wenchuan", c("绵虒大禹祭坛", "Mianchi Dayu Altar"), "aba", ["culture", "rest"], 2, 0.4, 15, 1450, "low", c("G213沿线的大禹文化短停，可与汶川低海拔过渡日组合。", "A short Dayu-culture stop along G213 that fits a lower-altitude Wenchuan transition day."), ABA_ROAD_SERVICES, { bestMonths: [3,4,5,6,7,8,9,10,11] }),
  attraction("jiuding-taiziling", "maoxian", c("九鼎山太子岭滑雪场", "Jiuding Mountain Taiziling Ski Area"), "jiuzhai", ["scenery", "hiking"], 6, 2.5, 100, 3000, "high", c("冰雪营业、普通观景和进山道路是三项独立状态，不能仅凭季节推断开放。", "Ski operations, ordinary sightseeing and mountain-road access are separate statuses and cannot be inferred from season alone."), ABA_ROAD_SERVICES, { bestMonths: [1,2,12], opening: c("仅在景区、雪场和道路三方状态均确认后安排。", "Plan only after separately confirming the park, ski operation and access road.") }),
  attraction("reerba-grassland", "ruoergai", c("热尔大坝草原", "Re'erba Grassland"), "grassland", ["scenery", "rest"], 2, 0.4, 18, 3440, "low", c("G213若尔盖段的草原短停，只进入允许通行和允许停车的区域。", "A short grassland stop on the Ruoergai section of G213; use permitted access and parking areas only."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("langmusi", "ruoergai", c("若尔盖郎木寺", "Ruoergai Langmusi"), "grassland", ["culture", "scenery"], 3, 2.5, 180, 3350, "medium", c("位于若尔盖北部远端支线，应增加半日至一日并避免夜间返程。", "A remote northern branch from Ruoergai requiring an extra half to full day and no night return."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("jiawuhai-panda", "jiuzhaigou", c("九寨沟甲勿海熊猫园", "Jiawuhai Panda Park"), "jiuzhai", ["wildlife", "scenery"], 4, 2, 100, 2400, "medium", c("位于G247方向，不等同九寨沟主景区；应作为独立支线安排。", "Located toward G247 and separate from the main Jiuzhaigou park; treat it as its own branch."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("yakesha-memorial", "hongyuan", c("亚克夏红军烈士墓", "Yakesha Red Army Memorial"), "grassland", ["culture"], 1.5, 0.6, 25, 3300, "low", c("G248沿线的纪念性短停，应保持肃静并以现场开放安排为准。", "A memorial stop along G248; remain respectful and follow on-site access arrangements."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("kepan-tianjie", "maerkang", c("柯盘天街文化旅游区", "Kepan Tianjie Cultural Area"), "maerkang", ["culture", "rest"], 2, 0.3, 12, 2650, "low", c("马尔康附近的嘉绒文化短停，适合与较短转场或城区住宿组合。", "A short Jiarong-culture stop near Barkam that fits a shorter transfer or town overnight."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("sanyuan-bridge", "maoxian", c("三元桥景区", "Sanyuan Bridge Scenic Area"), "jiuzhai", ["culture", "scenery"], 2.5, 0.7, 30, 1700, "low", c("茂县G347方向的人文山谷短支线，不与长距离九寨转场叠加。", "A short cultural-valley branch toward G347 near Mao County; do not stack it onto a long Jiuzhaigou transfer."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("zhu-de-residence", "aba-county", c("阿坝县朱德旧居", "Zhu De Former Residence in Ngawa"), "maerkang", ["culture"], 1.5, 0.5, 20, 3300, "low", c("阿坝县附近的红色历史短停，室内参观须按属地当日安排。", "A short historic stop near Ngawa County; indoor access follows same-day local arrangements."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("skula-cultural-town", "siguniang", c("斯古拉文旅城", "Skula Cultural Tourism Town"), "aba", ["culture", "rest"], 2, 0.1, 5, 3200, "low", c("四姑娘山镇附近的低强度文化休整，可放在抵达日而不替代三沟游览。", "A low-intensity cultural rest near Mount Siguniang Town for arrival day; it does not replace a valley visit."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10] }),
  attraction("love-sea", "jiuzhaigou", c("爱情海景区", "Love Sea Scenic Area"), "jiuzhai", ["scenery", "hiking"], 5, 1.5, 70, 2400, "medium", c("G544沿线的独立支线景区，应与九寨沟主景区分日或二选一。", "A separate branch along G544 that should be on a different day from the main Jiuzhaigou park or chosen instead."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("jiuzhai-huamei", "jiuzhaigou", c("九寨华美圣地旅游度假区", "Jiuzhai Huamei Resort Area"), "jiuzhai", ["culture", "rest"], 3, 0.7, 30, 2200, "low", c("度假区公共到访与具体经营项目开放不是同一状态，按需安排半日。", "Public resort access and individual operated activities have separate statuses; allow a half day when needed."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("jiuzhai-romance-town", "jiuzhaigou", c("九寨千古情小镇", "Jiuzhai Romance Town"), "jiuzhai", ["culture", "rest"], 2.5, 0.3, 12, 2050, "low", c("可作为沟口住宿日晚间文化活动，但演出场次和小镇公共开放须分别核验。", "An evening cultural option near the park entrance; verify show schedules separately from public town access."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("jiuzhai-cloud-top", "jiuzhaigou", c("九寨云顶旅游度假区", "Jiuzhai Cloud-top Resort"), "jiuzhai", ["scenery", "rest"], 4, 1.2, 55, 2600, "medium", c("属于九寨沟周边支线度假区，不应在九寨沟整日游后继续硬塞。", "A branch resort around Jiuzhaigou that should not be added after a full day in the main park."), ABA_ROAD_SERVICES, { bestMonths: [4,5,6,7,8,9,10,11] }),
  attraction("rigangqiao", "hongyuan", c("日干乔景区", "Rigangqiao Scenic Area"), "grassland", ["scenery", "wildlife"], 3.5, 1, 45, 3450, "medium", c("高原湿地与草原景观，只在允许区域活动，不进入湿地保护腹地。", "A plateau wetland and grassland landscape; remain in permitted areas and outside the protected interior."), ABA_ROAD_SERVICES, { bestMonths: [5,6,7,8,9,10] }),
  attraction("yading-scenic-area", "shangrila", c("稻城亚丁景区", "Daocheng Yading Scenic Area"), "daocheng", ["scenery", "hiking"], 8, 0, 0, 4100, "high", c("以香格里拉镇住宿区为当天起终点，按完整景区日安排；私家车停在景区规定停车区域，入园后交通、徒步线路和高海拔区域开放均以当日公告为准。", "Use Shangri-La Town as the day's start and finish and allow a full park day. Leave the private car in designated parking; internal transport, hiking routes and high-altitude access follow the same-day notice."), "https://www.daocheng.gov.cn/yb_tpjj/article/653697", { bestMonths: [4,5,6,7,8,9,10,11], opening: c("景区运营、内部交通与高海拔徒步线路是三个可能分别调整的状态；每周自动发现官方更新，购票和出发当天仍须再次核验。", "Park operation, internal transport and high-altitude hiking routes may change separately. Weekly discovery does not replace another check on the booking and travel day."), reservation: c("需要提前通过景区公布的官方渠道预约；预约、票务和入园时段按当日官方页面执行。", "Book in advance through a channel published by the park; reservation, ticketing and entry windows follow the same-day official page."), verifiedOn: "2026-08-31" }),
  attraction("haizishan-xingyicuo", "sangdui", c("海子山·兴伊措", "Haizi Mountain · Xingyicuo"), "daocheng", ["scenery", "wildlife"], 2, 0.4, 20, 4420, "high", c("理塘至稻城走廊上的高海拔生态停留；只使用开放道路和正式服务点，不进入保护区腹地。", "A high-altitude ecological stop on the Litang–Daocheng corridor. Use open roads and formal service points only; do not enter the protected interior."), "https://www.daocheng.gov.cn/lydt/article/480658", { bestMonths: [5,6,7,8,9,10], opening: c("自然保护与道路状态可能临时调整；仅在官方服务点开放、无地灾和冰雪管制时短停。", "Conservation and road access may change at short notice. Stop only when official facilities are open and no geohazard or ice control applies."), verifiedOn: "2026-08-31" }),
  attraction("sangdui-red-grass", "sangdui", c("桑堆红草湿地", "Sangdui Red-grass Wetland"), "daocheng", ["scenery", "wildlife", "rest"], 1.2, 0.2, 8, 3940, "low", c("红草景观季节性很强，只在允许停靠与开放步道活动。", "The red-grass landscape is strongly seasonal; use only permitted stopping areas and open paths."), "https://www.daocheng.gov.cn/lydt/article/261897", { bestMonths: [9,10], opening: c("属于季节性湿地景观；开放边界和停车位置按属地当日提示，不进入湿地保护区域。", "This is a seasonal wetland landscape. Follow same-day local access and parking directions and stay outside protected wetland areas."), verifiedOn: "2026-08-31" }),
  attraction("daocheng-white-pagoda", "daocheng", c("稻城白塔", "Daocheng White Pagoda"), "daocheng", ["culture", "rest"], 1, 0.1, 4, 3750, "low", c("县城附近的低强度文化短停，适合抵达或离开稻城时安排。", "A low-intensity cultural stop near town, suitable on arrival or departure."), "https://www.daocheng.gov.cn/ttxw/article/609762", { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], verifiedOn: "2026-08-31" }),
  attraction("yading-tianjie", "daocheng", c("亚丁天街", "Yading Tianjie"), "daocheng", ["culture", "rest"], 1.5, 0, 0, 3750, "low", c("稻城县城公共街区，可用于抵达后的轻松散步，不把具体商户作为规划推荐。", "A public street in Daocheng town for an easy arrival-day walk; the planner does not recommend individual businesses."), "https://www.daocheng.gov.cn/mzts/article/480828", { bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12], verifiedOn: "2026-08-31" }),
  attraction("peiguang-village", "daocheng", c("培光精品旅游村寨", "Peiguang Tourism Village"), "daocheng", ["culture", "scenery", "rest"], 2, 0.3, 12, 3760, "low", c("县城近郊的藏式村寨与湿地景观；尊重居民空间，只在公共区域活动。", "A Tibetan village and wetland landscape near town. Respect residents and remain in public areas."), "https://www.daocheng.gov.cn/mzts/article/480828", { bestMonths: [5,6,7,8,9,10], verifiedOn: "2026-08-31" }),
  attraction("sela-flower-sea", "daocheng", c("色拉花海", "Sela Flower Sea"), "daocheng", ["scenery", "rest"], 1.5, 0.3, 14, 3770, "low", c("强季节性花海，只作为花期内的顺路候选，不把经营性体验项目作为默认内容。", "A highly seasonal flower landscape, suggested only during bloom; operated experiences are not included by default."), "https://www.daocheng.gov.cn/mzts/article/480828", { bestMonths: [6,7,8], verifiedOn: "2026-08-31" }),
  attraction("zilong-village", "daocheng", c("自龙民俗文化村", "Zilong Folk Culture Village"), "daocheng", ["culture", "rest"], 2, 0.4, 16, 3700, "low", c("稻城近郊民俗与藏式建筑停留；宗教空间和居民院落是否进入以现场许可为准。", "A folk-culture and Tibetan-architecture stop near Daocheng; enter religious spaces or residential courtyards only with on-site permission."), "https://www.daocheng.gov.cn/mzts/article/480828", { bestMonths: [4,5,6,7,8,9,10], verifiedOn: "2026-08-31" }),
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
  { anchorId: "yajiang", name: c("雅江县城", "Yajiang town"), services: c("适合作为新都桥至理塘之间的低一些海拔过渡夜", "A lower-altitude transition night between Xinduqiao and Litang"), tradeoff: c("南行至稻城亚丁仍需多段高原驾驶", "Several high-altitude driving sections remain before Yading") },
  { anchorId: "litang", name: c("理塘县城", "Litang town"), services: c("G318与理亚公路交会补给节点", "A resupply node where G318 meets the road toward Yading"), tradeoff: c("住宿海拔约4010米，不适合作为低海拔首晚", "Sleeping altitude is about 4,010 m and unsuitable for a first night from low altitude") },
  { anchorId: "daocheng", name: c("稻城县城", "Daocheng town"), services: c("县城补给与医疗条件优于景区沿线", "Town supplies and medical access are stronger than along the park road"), tradeoff: c("距亚丁游客中心仍有约110公里级转场", "The Yading visitor centre still requires roughly a 110 km transfer") },
  { anchorId: "shangrila", name: c("香格里拉镇城区", "Shangri-La Town area"), services: c("适合亚丁入园前后住宿并减少当天接驳", "Suitable before or after a Yading visit and reduces the entry-day transfer"), tradeoff: c("旺季容量和停车条件需在预订平台自行核验", "Peak capacity and parking must be verified independently on a booking platform") },
];

export function overnightGuide(anchorId: string): Required<LodgingArea> {
  const anchor = routeAnchors[anchorId];
  const configured = lodgingAreas.find((area) => area.anchorId === anchorId);
  const place = anchor?.name ?? c("计划住宿地", "planned overnight stop");
  return {
    anchorId,
    name: configured?.name ?? c(`${place.zh}城区或镇区`, `${place.en} town area`),
    services: configured?.services ?? c("选择城区或镇区内交通方便、可停车的住宿片区", "Use a central town area with practical access and parking"),
    tradeoff: configured?.tradeoff ?? c("具体房态、价格、供氧和停车条件需在预订平台自行核验", "Verify room availability, price, oxygen provision and parking on a booking service"),
    stayAdvice: configured?.stayAdvice ?? c("优先选择有正规停车位、可取消、近主干道且不需夜间走窄路的住宿。", "Prefer cancellable lodging with formal parking, main-road access and no narrow-road night approach."),
    dining: configured?.dining ?? c(`抵达${place.zh}城区或镇区后再用晚餐；不要把偏远景区门口当作稳定餐饮点。`, `Have dinner after reaching ${place.en} town; do not rely on a remote park entrance for dependable meals.`),
  };
}

export const featuredAttractionIds = ["yading-scenic-area", "lianbaoyeze", "jiuzhaigou", "huanglong", "shuangqiao", "flower-lake", "moon-bay", "dagu-glacier", "bipenggou"] as const;

export const sourceSummary = [
  {
    agency: c("阿坝州政府公路服务设施清单", "Ngawa Government road-service list"),
    scope: c("公路服务区、停车区、厕所、热水与应急保通中心", "Road service areas, parking, toilets, water and emergency-maintenance centres"),
    url: ABA_ROAD_SERVICES,
    cadence: c("公告更新时复核", "Rechecked when notices change"),
  },
  {
    agency: c("OpenStreetMap 贡献者", "OpenStreetMap contributors"),
    scope: c("每周设施快照：加油、充电、厕所、医院和诊所；ODbL署名共享", "Weekly facility snapshot for fuel, charging, toilets, hospitals and clinics under ODbL"),
    url: "https://www.openstreetmap.org/copyright",
    cadence: c("每周自动更新", "Updated weekly"),
  },
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
    agency: c("稻城县人民政府", "Daocheng County Government"),
    scope: c("亚丁景区运营、稻城景点与属地交通更新入口", "Yading operations, Daocheng attractions and local transport updates"),
    url: "https://www.daocheng.gov.cn/lydt",
    cadence: c("每周自动发现，人工复核", "Discovered weekly, human-reviewed"),
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
