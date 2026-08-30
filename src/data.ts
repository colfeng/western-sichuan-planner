export type Locale = "zh" | "en";

export type Copy = { zh: string; en: string };

export type DayPlan = {
  day: number;
  route: Copy;
  driveHours: number;
  distanceKm: number;
  sleepAltitude: number;
  stops: Copy[];
  landscape: Copy;
  note: Copy;
};

export type PlanProfile = {
  days: number;
  title: Copy;
  subtitle: Copy;
  recommended: boolean;
  schedule: DayPlan[];
};

const c = (zh: string, en: string): Copy => ({ zh, en });

export const planProfiles: PlanProfile[] = [
  {
    days: 3,
    title: c("三日试走版", "3-day sampler"),
    subtitle: c("时间紧张，不建议新手单司机选择", "Compressed and not recommended for a solo novice driver"),
    recommended: false,
    schedule: [
      {
        day: 1,
        route: c("成都 → 卧龙", "Chengdu → Wolong"),
        driveHours: 2.7,
        distanceKm: 135,
        sleepAltitude: 2000,
        stops: [c("都江堰服务区", "Dujiangyan rest area"), c("卧龙镇", "Wolong")],
        landscape: c("平原、峡谷与森林", "Plain, gorge and forest"),
        note: c("首晚保持较低海拔，为第二天翻越山口留出适应时间。", "Stay lower on the first night before gaining altitude the next day."),
      },
      {
        day: 2,
        route: c("卧龙 → 四姑娘山 → 丹巴", "Wolong → Mount Siguniang → Danba"),
        driveHours: 5.6,
        distanceKm: 205,
        sleepAltitude: 1900,
        stops: [c("猫鼻梁正规观景台", "Maobiliang viewpoint"), c("四姑娘山镇", "Siguniangshan Town")],
        landscape: c("雪山、高山峡谷与藏寨", "Snow peaks, alpine gorge and Tibetan villages"),
        note: c("行程偏长，只安排短停；遇雨雾应直接取消观景绕行。", "A long day: keep stops short and drop scenic detours in rain or fog."),
      },
      {
        day: 3,
        route: c("丹巴 → 成都", "Danba → Chengdu"),
        driveHours: 6.4,
        distanceKm: 350,
        sleepAltitude: 500,
        stops: [c("泸定或康定方向正规休息区", "Formal rest stop near Luding or Kangding")],
        landscape: c("河谷与横断山区地貌", "River valleys and Hengduan mountain terrain"),
        note: c("返程明显超过舒适驾驶时长，应每90–120分钟停车休息。", "The return exceeds the comfort target; stop every 90–120 minutes."),
      },
    ],
  },
  {
    days: 4,
    title: c("四日平衡版", "4-day balanced route"),
    subtitle: c("保留核心景观，但返程仍然较长", "Keeps the highlights, with a relatively long final return"),
    recommended: false,
    schedule: [
      {
        day: 1,
        route: c("成都 → 都江堰 → 卧龙", "Chengdu → Dujiangyan → Wolong"),
        driveHours: 2.8,
        distanceKm: 140,
        sleepAltitude: 2000,
        stops: [c("都江堰服务区", "Dujiangyan rest area"), c("卧龙镇", "Wolong")],
        landscape: c("水利古城、峡谷与森林", "Heritage waterways, gorge and forest"),
        note: c("轻松进入山区，避免第一天直接住到3200米。", "Enter the mountains gently instead of sleeping at 3,200 m on night one."),
      },
      {
        day: 2,
        route: c("卧龙 → 巴朗山沿线 → 四姑娘山镇", "Wolong → Balang Mountain corridor → Siguniangshan Town"),
        driveHours: 2.3,
        distanceKm: 95,
        sleepAltitude: 3200,
        stops: [c("猫鼻梁正规观景台", "Maobiliang viewpoint"), c("双桥沟", "Shuangqiao Valley")],
        landscape: c("高山森林与雪峰", "Alpine forest and snow peaks"),
        note: c("第二晚升至高海拔；如有明显不适，停止上升并下撤。", "Night two gains altitude; stop ascending and descend if symptoms are significant."),
      },
      {
        day: 3,
        route: c("四姑娘山镇 → 小金 → 丹巴", "Siguniangshan Town → Xiaojin → Danba"),
        driveHours: 3.2,
        distanceKm: 120,
        sleepAltitude: 1900,
        stops: [c("小金县城", "Xiaojin County"), c("中路藏寨或甲居藏寨", "Zhonglu or Jiaju Tibetan Village")],
        landscape: c("峡谷、河谷与藏寨", "Gorge, river valley and Tibetan villages"),
        note: c("下午回落至较低海拔，安排恢复性住宿。", "Descend for a lower-altitude recovery night."),
      },
      {
        day: 4,
        route: c("丹巴 → 成都", "Danba → Chengdu"),
        driveHours: 6.4,
        distanceKm: 350,
        sleepAltitude: 500,
        stops: [c("正规服务区两次休息", "Two formal rest-area breaks")],
        landscape: c("河谷与山地公路", "River valley and mountain roads"),
        note: c("最疲劳的一天，不增加景点，不在路肩临停拍照。", "The most tiring day: add no attractions and never stop on the shoulder for photos."),
      },
    ],
  },
  {
    days: 5,
    title: c("五日舒适版", "5-day comfort route"),
    subtitle: c("新手单司机优先，逐渐适应海拔并降低景观重复", "Best for a solo novice: gradual altitude gain with varied landscapes"),
    recommended: true,
    schedule: [
      {
        day: 1,
        route: c("成都 → 都江堰 → 卧龙", "Chengdu → Dujiangyan → Wolong"),
        driveHours: 2.8,
        distanceKm: 140,
        sleepAltitude: 2000,
        stops: [c("都江堰服务区", "Dujiangyan rest area"), c("卧龙镇", "Wolong")],
        landscape: c("平原、水系、峡谷与森林", "Plain, waterways, gorge and forest"),
        note: c("首日只进入山区，不追赶高海拔景点。", "Use day one to enter the mountains without chasing high-altitude sights."),
      },
      {
        day: 2,
        route: c("卧龙 → 四姑娘山镇", "Wolong → Siguniangshan Town"),
        driveHours: 2.3,
        distanceKm: 95,
        sleepAltitude: 3200,
        stops: [c("猫鼻梁正规观景台", "Maobiliang viewpoint"), c("双桥沟", "Shuangqiao Valley")],
        landscape: c("高山森林与雪峰", "Alpine forest and snow peaks"),
        note: c("把高海拔住宿放到第二晚；晚上不安排剧烈活动。", "Move the high-altitude night to day two and avoid strenuous evening activity."),
      },
      {
        day: 3,
        route: c("四姑娘山镇 → 小金 → 丹巴", "Siguniangshan Town → Xiaojin → Danba"),
        driveHours: 3.2,
        distanceKm: 120,
        sleepAltitude: 1900,
        stops: [c("小金县城补给", "Resupply in Xiaojin"), c("中路藏寨", "Zhonglu Tibetan Village")],
        landscape: c("峡谷、河流与藏寨", "Gorge, river and Tibetan villages"),
        note: c("以主路为主，下午下降到较低海拔恢复。", "Prefer main roads and descend for recovery in the afternoon."),
      },
      {
        day: 4,
        route: c("丹巴周边慢游", "Slow day around Danba"),
        driveHours: 1.8,
        distanceKm: 55,
        sleepAltitude: 1900,
        stops: [c("甲居藏寨", "Jiaju Tibetan Village"), c("丹巴县城", "Danba County")],
        landscape: c("藏寨、人文与河谷", "Tibetan villages, culture and valley"),
        note: c("恢复日，不重复追逐雪山；只使用正规停车场。", "A recovery day focused on culture rather than another snow-peak chase; use formal parking."),
      },
      {
        day: 5,
        route: c("丹巴 → 成都", "Danba → Chengdu"),
        driveHours: 6.4,
        distanceKm: 350,
        sleepAltitude: 500,
        stops: [c("泸定方向休息点", "Rest stop toward Luding"), c("高速服务区", "Expressway service area")],
        landscape: c("横断山河谷至成都平原", "Hengduan valleys to the Chengdu Plain"),
        note: c("唯一超过6小时的驾驶日；不增加景点，最晚18:30前结束陌生山路。", "The only 6+ hour day: add no attractions and finish unfamiliar mountain roads before 18:30."),
      },
    ],
  },
];

export const sourceSummary = [
  {
    agency: c("甘孜州交通运输局", "Garzê Prefecture Transport Bureau"),
    scope: c("甘孜州道路施工与交通管制公告", "Roadworks and traffic-control notices in Garzê"),
    url: "https://jtj.gzz.gov.cn/zwgk",
  },
  {
    agency: c("阿坝州人民政府", "Ngawa Prefecture Government"),
    scope: c("交通运输信息公示与管制公告", "Transport disclosures and traffic-control notices"),
    url: "https://www.abazhou.gov.cn/abazhou/c109640/bmxxgk_list.shtml",
  },
];
