export type Locale = "zh" | "en";

export type Copy = { zh: string; en: string };
export type Theme = "scenery" | "culture" | "wildlife" | "hiking" | "rest";
export type Effort = "low" | "medium" | "high";
export type RegionId = "gateway" | "aba" | "danba" | "kangding" | "return";

export type RouteAnchor = {
  id: string;
  name: Copy;
  altitude: number;
  canStay: boolean;
  region: RegionId;
};

export type RouteLeg = {
  from: string;
  to: string;
  hours: number;
  km: number;
  road: string;
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
};

export const c = (zh: string, en: string): Copy => ({ zh, en });

export const regionNames: Record<RegionId, Copy> = {
  gateway: c("成都门户", "Chengdu gateway"),
  aba: c("阿坝段", "Ngawa section"),
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
  { id: "chengdu-start", name: c("成都", "Chengdu"), altitude: 500, canStay: true, region: "gateway" },
  { id: "dujiangyan", name: c("都江堰", "Dujiangyan"), altitude: 720, canStay: true, region: "gateway" },
  { id: "yingxiu", name: c("映秀", "Yingxiu"), altitude: 900, canStay: true, region: "aba" },
  { id: "wolong", name: c("卧龙", "Wolong"), altitude: 2000, canStay: true, region: "aba" },
  { id: "balang", name: c("巴朗山沿线", "Balang corridor"), altitude: 3500, canStay: false, region: "aba" },
  { id: "siguniang", name: c("四姑娘山镇", "Mount Siguniang Town"), altitude: 3200, canStay: true, region: "aba" },
  { id: "xiaojin", name: c("小金", "Xiaojin"), altitude: 2360, canStay: true, region: "aba" },
  { id: "danba", name: c("丹巴", "Danba"), altitude: 1900, canStay: true, region: "danba" },
  { id: "bamei", name: c("八美", "Bamei"), altitude: 3500, canStay: true, region: "kangding" },
  { id: "tagong", name: c("塔公", "Tagong"), altitude: 3730, canStay: true, region: "kangding" },
  { id: "xinduqiao", name: c("新都桥", "Xinduqiao"), altitude: 3460, canStay: true, region: "kangding" },
  { id: "kangding", name: c("康定", "Kangding"), altitude: 2560, canStay: true, region: "kangding" },
  { id: "luding", name: c("泸定", "Luding"), altitude: 1330, canStay: true, region: "return" },
  { id: "yaan", name: c("雅安", "Ya'an"), altitude: 600, canStay: true, region: "return" },
  { id: "chengdu-end", name: c("成都", "Chengdu"), altitude: 500, canStay: true, region: "gateway" },
];

export const routeAnchors = Object.fromEntries(anchors.map((anchor) => [anchor.id, anchor]));

const leg = (from: string, to: string, hours: number, km: number, road: string): RouteLeg => ({ from, to, hours, km, road });

const outboundLegs: RouteLeg[] = [
  leg("chengdu-start", "dujiangyan", 1.2, 70, "S9 / G4217"),
  leg("dujiangyan", "yingxiu", 0.8, 45, "G4217"),
  leg("yingxiu", "wolong", 1.2, 55, "G350"),
  leg("wolong", "balang", 1.3, 58, "G350"),
  leg("balang", "siguniang", 1.0, 42, "G350"),
  leg("siguniang", "xiaojin", 1.2, 55, "G350"),
  leg("xiaojin", "danba", 2.2, 105, "G350"),
];

export const compactRoute: RouteLeg[] = [
  ...outboundLegs,
  leg("danba", "luding", 4.0, 200, "S211"),
  leg("luding", "yaan", 1.7, 105, "G4218"),
  leg("yaan", "chengdu-end", 1.9, 140, "G5"),
];

export const grandRoute: RouteLeg[] = [
  ...outboundLegs,
  leg("danba", "bamei", 3.3, 150, "G350"),
  leg("bamei", "tagong", 0.7, 35, "G248"),
  leg("tagong", "xinduqiao", 1.4, 65, "G248 / G318"),
  leg("xinduqiao", "kangding", 1.8, 78, "G318"),
  leg("kangding", "luding", 1.1, 55, "G4218 / G318"),
  leg("luding", "yaan", 1.7, 105, "G4218"),
  leg("yaan", "chengdu-end", 1.9, 140, "G5"),
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
): Attraction => ({ id, anchorId, name, region, themes, visitHours, detourHours, detourKm, altitude, effort, summary, sourceUrl });

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
    agency: c("甘孜州交通运输局 · 阿坝州人民政府", "Garzê Transport Bureau · Ngawa Government"),
    scope: c("道路施工、封闭、放行和绕行候选公告", "Candidate notices for works, closures, reopening and detours"),
    url: "https://jtj.gzz.gov.cn/zwgk",
    cadence: c("每周自动发现", "Discovered weekly"),
  },
];

export const strategySuggestions = {
  comfort: ["maobiliang", "shuangqiao", "xiaojin-supply", "jiaju", "danba-town", "luding-bridge"],
  scenery: ["maobiliang", "shuangqiao", "zhonglu", "moshi-park", "tagong-grassland", "xinduqiao-corridor", "luding-bridge"],
  culture: ["yingxiu-memorial", "wolong-museum", "dawei-meeting", "jiaju", "suopo", "tagong-monastery", "kangding-old-town", "luding-bridge"],
} as const;
