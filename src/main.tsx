import React, { FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  BatteryCharging,
  BedDouble,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Car,
  Compass,
  ExternalLink,
  Gauge,
  Fuel,
  Info,
  Languages,
  MountainSnow,
  Navigation,
  RefreshCw,
  Save,
  Share2,
  Printer,
  Sun,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
  MapPin,
  X,
} from "lucide-react";
import type { Copy, Locale, RegionId, Theme, Vehicle } from "./data";
import {
  attractions,
  anchorCoordinates,
  effortNames,
  featuredAttractionIds,
  overnightGuide,
  regionNames,
  routeAnchors,
  sourceSummary,
  themeNames,
} from "./data";
import { amapSearchUrl, serviceSnapshot, servicesForLegs, servicesNearAnchors } from "./services";
import type { PlannerInput, Strategy } from "./planner";
import { buildPlanOptions, getAttraction, getReturnDate } from "./planner";
import reviewedRoadEvents from "../data/reviewed-road-events.json";
import updateStatus from "../data/update-status.json";
import "./styles.css";

const text = (copy: Copy, locale: Locale) => copy[locale];
const defaultStartDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

const initialInput: PlannerInput = {
  days: 8,
  maxDrive: 6,
  priority: "comfort",
  avoidNight: true,
  autoSuggest: true,
  selectedAttractionIds: ["moon-bay", "flower-lake"],
  startDate: defaultStartDate,
  startAnchorId: "chengdu",
  endAnchorId: "chengdu",
  departureTime: "08:30",
  vehicle: "sedan",
  evRangeKm: 450,
  lockOrder: false,
  roadEvents: reviewedRoadEvents.events,
};

const ui = {
  zh: {
    brand: "川西自驾规划器",
    brandEn: "Western Sichuan Planner",
    planner: "规划行程",
    places: "选择景点",
    sources: "数据来源",
    support: "支持项目",
    eyebrow: `${attractions.length}个可选停留 · 多走廊道路图 · 中英双语`,
    heading: "由你选择想看的地方，规划器负责判断怎样走得完。",
    intro: "路线网已覆盖红原、若尔盖、九寨沟、黄龙、黑水、阿坝县、莲宝叶则及川西南部走廊。规划器根据任意起终点、日期日照、驾驶上限、游玩时长、海拔和住宿节点动态连线。",
    updated: "V0.6分日路线与顺路推荐 · 规划基线并非实时导航",
    controls: "设定旅行约束",
    days: "旅行天数",
    dates: "出发 / 返程",
    endpoints: "起点 / 终点",
    start: "起点",
    end: "终点",
    departure: "每日计划出发",
    vehicle: "车辆类型",
    sedan: "轿车",
    suv: "SUV / 四驱",
    ev: "纯电动车",
    range: "标称续航",
    drive: "单日最多驾驶",
    priority: "主要偏好",
    comfort: "轻松与安全",
    scenery: "景观丰富",
    culture: "人文与村落",
    avoidNight: "按当天日落保留30分钟安全余量",
    autoSuggest: "时间允许时，自动加入顺路景点",
    orderHint: "顺序会影响路线；用箭头调整后将按此顺序计算",
    update: "按这些条件重新规划",
    dirty: "选择有变化，更新后才会应用",
    applied: "新约束已进入计算",
    attractionTitle: "选择必去景点",
    attractionIntro: "选择的是硬约束；算法建议的顺路景点会单独标记，你不必全部接受。",
    featured: "核心景点快速选择",
    search: "搜索景点、城镇或主题",
    allRegions: "全部区域",
    allThemes: "全部类型",
    selected: "已选",
    clear: "清空",
    hours: "游玩",
    altitude: "海拔",
    detour: "绕行驾驶",
    noMatches: "没有符合筛选条件的景点",
    planTitle: "动态生成的候选方案",
    planIntro: "三个方案都必须包含你的必去景点；绿色表示当前约束可完成，橙色表示需要取舍。",
    feasible: "约束内可完成",
    conflict: "存在硬冲突",
    score: "匹配度",
    network: "多走廊动态路线",
    totalDrive: "总驾驶",
    totalDistance: "基线里程",
    suggested: "算法建议",
    mustSee: "你的必去",
    routeOverview: "分日道路顺序",
    routeTruth: "下方按规划器实际采用的道路分段排列，显示道路编号、基线里程和驾驶时间；它是顺序清单，不是按真实方位或比例绘制的地图。",
    selectedAndSuggested: "必去 / 自动补充",
    conflicts: "需要你决定",
    minimumDays: "按当前必去景点，建议至少增加到",
    dayUnit: "天",
    allGood: "当前日程满足你的驾驶上限与日照窗口；出发前仍须复核天气和正式导航。",
    pureDrive: "纯驾驶",
    activities: "游玩",
    plannedBreak: "休息",
    mealBreak: "用餐",
    distance: "约",
    sleepAltitude: "住宿海拔",
    roads: "道路基线",
    daylight: "日照",
    estimatedWindow: "预计时段",
    margin: "日落余量",
    freeTime: "机动余量",
    navigate: "在高德核对路线",
    stops: "当天安排",
    mainActivities: "怎么玩",
    roadRest: "在哪里休息",
    mealPlan: "在哪里用餐",
    overnight: "今晚住哪里",
    serviceTools: "沿途设施核验",
    fuelSearch: "查加油站",
    chargeSearch: "查充电站",
    toiletSearch: "查厕所",
    hospitalSearch: "查医院",
    officialRest: "官方公路休息点",
    noOfficialRest: "当前道路基线没有匹配到官方服务区；仍须每90–120分钟进入正规停车区休息。",
    evTitle: "电动车当天补能计划",
    evSafeBudget: "保守里程预算",
    evUsage: "预计使用",
    evCharge: "建议在到达后补能",
    evFallback: "若充电站不可用，备用住宿/补能节点",
    evEstimate: "按高原20–22 kWh/100km、有效60kW粗估",
    osmEmpty: "开放地图设施快照尚未返回具体点位，先用高德实时核验。",
    osmUpdated: serviceSnapshot.updatedAt ? `开放地图设施快照：${serviceSnapshot.updatedAt.slice(0, 10)}，共${serviceSnapshot.count}个点位` : "开放地图设施快照等待首次周更新",
    transit: "转场与正规休息",
    suggestedStop: "建议",
    selectedStop: "必去",
    agendaTitle: "当天时间表（估算）",
    agendaIntro: "早餐和晚餐位于行车窗口外；午餐、途中休息已计入当天总时长。",
    breakfast: "早餐",
    breakfastHint: "在住宿地附近完成早餐，并在计划出发前预留装车和检查车辆时间。",
    morning: "上午",
    afternoon: "下午",
    driveBlock: "行车",
    visitBlock: "游玩",
    restBlock: "途中休息",
    lunchBlock: "午餐",
    lunchHint: "优先选择县城、镇区或正规服务区；不依赖偏远景区门口临时解决。",
    dinner: "晚餐",
    checkIn: "入住",
    suggestedApplied: "已自动加入顺路景点",
    noSuggestedApplied: "当前路线、季节、日照与强度约束下，没有找到可以安全加入的顺路景点。",
    dayReasonAltitude: "控制住宿海拔变化，并把高强度活动与长驾驶拆开。",
    dayReasonDrive: "按连续行车90–120分钟安排正规休息，不用压缩休息追回时间。",
    disclaimerTitle: "规划结果不是通行承诺",
    disclaimer: "里程和时间是用于比较方案的基线估计，并非实时导航。出发前24小时必须再次核对交警公告、天气、景区开放状态和正式导航；遇暴雨、浓雾或地灾预警时删减活动。",
    sourceTitle: "规划数据要能回到官方来源",
    sourceIntro: "同一个每周任务检查道路与景区官方入口，并更新开放地图中的加油、充电、厕所和医疗设施快照。公告会自动给出道路分段与影响候选，但未经人工审核不会改变路线。",
    humanReview: "人工确认后生效",
    noReviewedEvents: "当前没有生效中的人工审核道路事件",
    original: "查看官方入口",
    supportTitle: "帮助这个独立项目继续维护",
    supportBody: "本站并非慈善组织。未来的自愿支持将用于数据维护和持续开发，不属于慈善捐赠，不提供公益捐赠票据，也不会影响免费功能。",
    comingSoon: "支持通道尚未开放",
    save: "保存到本机",
    share: "复制分享链接",
    print: "打印 / PDF",
    saved: "已保存",
    shared: "链接已复制",
    lodgingTitle: "每日住宿落点",
    lodgingIntro: "明确写出当天应住的县城或镇区，并说明晚餐位置和选房条件；不替你指定某一家商户。",
    reservation: "预约提醒",
    bestMonths: "推荐月份",
    details: "查看资料详情",
    opening: "开放说明",
    checkedOn: "最后核验",
    sourceLink: "官方来源",
    close: "关闭",
    weeklyStatus: "统一周更新状态",
    weeklyStatusBody: updateStatus.sourceResults.length > 0
      ? `最近一次记录检查了 ${updateStatus.successfulSources}/${updateStatus.totalSources} 个官方入口；定时运行可能延迟，候选信息须审核后生效。`
      : `统一周任务已配置，共 ${updateStatus.totalSources} 个官方入口；首次检查结果将在审核合并后显示。`,
    footer: "数据与产品维护：colfeng · 安全约束优先于景点数量",
  },
  en: {
    brand: "Western Sichuan Planner",
    brandEn: "川西自驾规划器",
    planner: "Plan a trip",
    places: "Choose places",
    sources: "Sources",
    support: "Support",
    eyebrow: `${attractions.length} selectable stops · Multi-corridor graph · Bilingual`,
    heading: "Choose what you want to see. Let the planner decide what can actually fit.",
    intro: "The graph now covers Hongyuan, Ruoergai, Jiuzhaigou, Huanglong, Heishui, Ngawa County, Lianbaoyeze and the southern corridors. Any start/end, dates, daylight, driving caps, visit time, altitude and overnight nodes affect the route.",
    updated: "V0.6 daily routes and en-route suggestions · Planning baseline, not live navigation",
    controls: "Set trip constraints",
    days: "Trip length",
    dates: "Departure / return",
    endpoints: "Start / end",
    start: "Start",
    end: "End",
    departure: "Planned daily departure",
    vehicle: "Vehicle",
    sedan: "Sedan",
    suv: "SUV / 4WD",
    ev: "Battery EV",
    range: "Rated range",
    drive: "Daily driving cap",
    priority: "Main preference",
    comfort: "Comfort & safety",
    scenery: "Landscape variety",
    culture: "Culture & villages",
    avoidNight: "Keep a 30-minute margin before that day's sunset",
    autoSuggest: "Automatically add en-route places when time allows",
    orderHint: "Order affects the route. Using the arrows locks this order.",
    update: "Rebuild with these constraints",
    dirty: "Selections changed; rebuild to apply them",
    applied: "New constraints are now calculated",
    attractionTitle: "Choose must-see places",
    attractionIntro: "Your choices are hard constraints. Optional en-route suggestions are marked separately and can be ignored.",
    featured: "Quick-select key places",
    search: "Search places, towns or themes",
    allRegions: "All regions",
    allThemes: "All types",
    selected: "Selected",
    clear: "Clear",
    hours: "Visit",
    altitude: "Altitude",
    detour: "Detour driving",
    noMatches: "No places match these filters",
    planTitle: "Dynamically generated options",
    planIntro: "All three plans must include your must-see places. Green fits the current constraints; amber requires a trade-off.",
    feasible: "Fits constraints",
    conflict: "Hard conflict",
    score: "Match",
    network: "Dynamic multi-corridor route",
    totalDrive: "Total driving",
    totalDistance: "Baseline distance",
    suggested: "Planner suggestions",
    mustSee: "Your must-sees",
    routeOverview: "Road sequence by day",
    routeTruth: "The sequence below uses the planner's actual road-graph segments with road number, baseline distance and driving time. It is an ordered list, not a geographically scaled map.",
    selectedAndSuggested: "Must-see / auto-added",
    conflicts: "Decision needed",
    minimumDays: "For the current must-sees, allow at least",
    dayUnit: "days",
    allGood: "This schedule fits your driving cap and daylight window. Recheck weather and formal navigation before departure.",
    pureDrive: "Driving",
    activities: "Activities",
    plannedBreak: "Rest",
    mealBreak: "Meals",
    distance: "Approx.",
    sleepAltitude: "Sleep altitude",
    roads: "Road baseline",
    daylight: "Daylight",
    estimatedWindow: "Estimated window",
    margin: "Sunset margin",
    freeTime: "Buffer",
    navigate: "Check route in Amap",
    stops: "Day plan",
    mainActivities: "What to do",
    roadRest: "Where to rest",
    mealPlan: "Where to eat",
    overnight: "Where to stay tonight",
    serviceTools: "Verify roadside facilities",
    fuelSearch: "Find fuel",
    chargeSearch: "Find charging",
    toiletSearch: "Find toilets",
    hospitalSearch: "Find hospitals",
    officialRest: "Official road rest points",
    noOfficialRest: "No official service area is mapped to this baseline segment. Still stop in a formal parking area every 90–120 minutes.",
    evTitle: "Daily EV charging plan",
    evSafeBudget: "Conservative distance budget",
    evUsage: "Planned use",
    evCharge: "Top up after arrival",
    evFallback: "Fallback overnight/charging node if unavailable",
    evEstimate: "Rough estimate at 20–22 kWh/100 km and an effective 60 kW",
    osmEmpty: "The open-map facility snapshot has no returned points yet; verify live in Amap.",
    osmUpdated: serviceSnapshot.updatedAt ? `Open-map snapshot: ${serviceSnapshot.updatedAt.slice(0, 10)}, ${serviceSnapshot.count} points` : "Open-map facility snapshot awaits its first weekly refresh",
    transit: "Transit and formal rest stops",
    suggestedStop: "Suggested",
    selectedStop: "Must-see",
    agendaTitle: "Estimated day timeline",
    agendaIntro: "Breakfast and dinner sit outside the driving window; lunch and road rests are included in the day's total time.",
    breakfast: "Breakfast",
    breakfastHint: "Eat near the overnight area and leave time for loading and a vehicle check before departure.",
    morning: "Morning",
    afternoon: "Afternoon",
    driveBlock: "Drive",
    visitBlock: "Visit",
    restBlock: "Road rest",
    lunchBlock: "Lunch",
    lunchHint: "Prefer a town or formal service area; do not rely on a remote park entrance.",
    dinner: "Dinner",
    checkIn: "Check in",
    suggestedApplied: "Automatically added en-route places",
    noSuggestedApplied: "No en-route place safely fits the current route, season, daylight and activity constraints.",
    dayReasonAltitude: "Controls sleeping-altitude changes and separates demanding activities from long drives.",
    dayReasonDrive: "Plan a formal stop every 90–120 minutes; never recover time by cutting rest.",
    disclaimerTitle: "A plan is not a promise that the road is open",
    disclaimer: "Distance and time are comparison baselines, not live navigation. Within 24 hours of departure, recheck police notices, weather, attraction status and formal navigation. Drop activities during heavy rain, dense fog or geohazard alerts.",
    sourceTitle: "Planning data should trace back to official sources",
    sourceIntro: "One weekly job checks official road and attraction sources and refreshes open-map fuel, charging, toilet and medical facilities. Notices receive suggested road segments and impacts, but never change routes before human review.",
    humanReview: "Active after human review",
    noReviewedEvents: "No human-reviewed road event is currently active",
    original: "Open official source",
    supportTitle: "Help maintain this independent project",
    supportBody: "This is not a charitable organization. Future voluntary support will fund data maintenance and development. It is not a charitable donation, carries no tax-deductible receipt and never changes access to free features.",
    comingSoon: "Support channel not open yet",
    save: "Save locally",
    share: "Copy share link",
    print: "Print / PDF",
    saved: "Saved",
    shared: "Link copied",
    lodgingTitle: "Daily overnight stop",
    lodgingIntro: "Each day names the town area, dinner location and lodging criteria without selecting an individual business for you.",
    reservation: "Reservation",
    bestMonths: "Best months",
    details: "Open data details",
    opening: "Opening note",
    checkedOn: "Last reviewed",
    sourceLink: "Official source",
    close: "Close",
    weeklyStatus: "Unified weekly update status",
    weeklyStatusBody: updateStatus.sourceResults.length > 0
      ? `The latest recorded run checked ${updateStatus.successfulSources}/${updateStatus.totalSources} official entry points. Scheduled runs may be delayed and candidates require review.`
      : `The unified weekly job is configured for ${updateStatus.totalSources} official entry points. Its first result will appear after review and merge.`,
    footer: "Data and product maintained by colfeng · Safety constraints outrank attraction count",
  },
};

const regionFilters: Array<"all" | RegionId> = ["all", "gateway", "aba", "maerkang", "heishui", "grassland", "jiuzhai", "danba", "kangding", "return"];
const themeFilters: Array<"all" | Theme> = ["all", "scenery", "culture", "wildlife", "hiking", "rest"];
const shiftTime = (value: string, hours: number) => {
  const [hour, minute] = value.split(":").map(Number); const total = (hour * 60 + minute + Math.round(hours * 60) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};
const isMorning = (value: string) => Number(value.slice(0, 2)) < 12;

function loadInitialInput(): PlannerInput {
  try {
    const shared = new URLSearchParams(window.location.search).get("plan");
    const raw = shared ? decodeURIComponent(window.atob(shared)) : window.localStorage.getItem("western-sichuan-plan-v06") ?? window.localStorage.getItem("western-sichuan-plan-v05") ?? window.localStorage.getItem("western-sichuan-plan-v04") ?? window.localStorage.getItem("western-sichuan-plan-v03");
    if (!raw) return initialInput;
    const value = JSON.parse(raw) as Partial<PlannerInput>;
    if (!Array.isArray(value.selectedAttractionIds)) return initialInput;
    return { ...initialInput, ...value, selectedAttractionIds: value.selectedAttractionIds.filter((id) => typeof id === "string") };
  } catch {
    return initialInput;
  }
}

const startingInput = loadInitialInput();

function sameInput(a: PlannerInput, b: PlannerInput): boolean {
  return a.days === b.days
    && a.maxDrive === b.maxDrive
    && a.priority === b.priority
    && a.avoidNight === b.avoidNight
    && a.autoSuggest === b.autoSuggest
    && a.startDate === b.startDate
    && a.startAnchorId === b.startAnchorId
    && a.endAnchorId === b.endAnchorId
    && a.departureTime === b.departureTime
    && a.vehicle === b.vehicle
    && a.evRangeKm === b.evRangeKm
    && a.lockOrder === b.lockOrder
    && a.selectedAttractionIds.join("|") === b.selectedAttractionIds.join("|");
}

function App() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [draft, setDraft] = useState<PlannerInput>(startingInput);
  const [applied, setApplied] = useState<PlannerInput>(startingInput);
  const [activeStrategy, setActiveStrategy] = useState<Strategy>("comfort");
  const [regionFilter, setRegionFilter] = useState<"all" | RegionId>("all");
  const [themeFilter, setThemeFilter] = useState<"all" | Theme>("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [detailAttractionId, setDetailAttractionId] = useState<string | null>(null);
  const copy = ui[locale];
  const dirty = !sameInput(draft, applied);
  const heroImage = `${import.meta.env.BASE_URL}images/mount-siguniang-road.jpg`;

  const options = useMemo(() => buildPlanOptions(applied), [applied]);
  const activePlan = options.find((option) => option.id === activeStrategy) ?? options[0];
  const selectedSet = useMemo(() => new Set(draft.selectedAttractionIds), [draft.selectedAttractionIds]);
  const activeSuggestedSet = useMemo(() => new Set(activePlan.suggestedAttractionIds), [activePlan.suggestedAttractionIds]);
  const activeSelectedSet = useMemo(() => new Set(activePlan.selectedAttractionIds), [activePlan.selectedAttractionIds]);

  const visibleAttractions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return attractions.filter((item) => {
      const regionMatches = regionFilter === "all" || item.region === regionFilter;
      const themeMatches = themeFilter === "all" || item.themes.includes(themeFilter);
      const searchMatches = !normalized || [item.name.zh, item.name.en, item.summary.zh, item.summary.en]
        .some((value) => value.toLowerCase().includes(normalized));
      return regionMatches && themeMatches && searchMatches;
    });
  }, [query, regionFilter, themeFilter]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setApplied({ ...draft, selectedAttractionIds: [...draft.selectedAttractionIds] });
    setActiveStrategy(draft.priority);
    setNotice(true);
    window.setTimeout(() => setNotice(false), 2400);
  };

  const moveAttraction = (id: string, direction: -1 | 1) => {
    setDraft((current) => {
      const values = [...current.selectedAttractionIds];
      const index = values.indexOf(id);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= values.length) return current;
      [values[index], values[next]] = [values[next], values[index]];
      return { ...current, selectedAttractionIds: values, lockOrder: true };
    });
  };

  const savePlan = () => {
    window.localStorage.setItem("western-sichuan-plan-v06", JSON.stringify(applied));
    setActionNotice(copy.saved);
    window.setTimeout(() => setActionNotice(""), 1800);
  };

  const sharePlan = async () => {
    const encoded = window.btoa(encodeURIComponent(JSON.stringify(applied)));
    const url = `${window.location.origin}${window.location.pathname}?plan=${encodeURIComponent(encoded)}`;
    await navigator.clipboard.writeText(url);
    setActionNotice(copy.shared);
    window.setTimeout(() => setActionNotice(""), 1800);
  };

  const toggleAttraction = (id: string) => {
    setDraft((current) => ({
      ...current,
      selectedAttractionIds: current.selectedAttractionIds.includes(id)
        ? current.selectedAttractionIds.filter((item) => item !== id)
        : [...current.selectedAttractionIds, id],
    }));
  };

  const amapNavigationUrl = (startAnchorId: string, endAnchorId: string) => {
    const from = anchorCoordinates[startAnchorId];
    const to = anchorCoordinates[endAnchorId];
    const fromName = routeAnchors[startAnchorId].name.zh;
    const toName = routeAnchors[endAnchorId].name.zh;
    return `https://uri.amap.com/navigation?from=${from.longitude},${from.latitude},${encodeURIComponent(fromName)}&to=${to.longitude},${to.latitude},${encodeURIComponent(toName)}&mode=car&policy=1&callnative=1`;
  };

  const detailAttraction = detailAttractionId ? getAttraction(detailAttractionId) : undefined;
  const overnightAnchors = Object.values(routeAnchors).filter((anchor) => anchor.canStay);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#planner" aria-label={copy.brand}>
          <span className="brand-mark"><Route size={21} /></span>
          <span><strong>{copy.brand}</strong><small>{copy.brandEn}</small></span>
        </a>
        <nav aria-label={locale === "zh" ? "主要导航" : "Main navigation"}>
          <a href="#planner">{copy.planner}</a>
          <a href="#places">{copy.places}</a>
          <a href="#sources">{copy.sources}</a>
          <a href="#support">{copy.support}</a>
        </nav>
        <button className="language-button" onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>
          <Languages size={17} /> {locale === "zh" ? "EN" : "中文"}
        </button>
      </header>

      <main>
        <section className="intro-band" id="planner">
          <div className="intro-copy">
            <p className="eyebrow"><Compass size={16} /> {copy.eyebrow}</p>
            <h1>{copy.heading}</h1>
            <p className="lede">{copy.intro}</p>
            <span className="data-stamp"><RefreshCw size={14} /> {copy.updated}</span>
          </div>
          <div className="image-panel">
            <img src={heroImage} alt={locale === "zh" ? "四姑娘山雪峰与川西高原公路" : "Mount Siguniang peaks and an alpine road in Western Sichuan"} />
            <div className="route-badge"><MountainSnow size={19} /><span>Mount Siguniang<br /><b>四姑娘山 · 巴朗山 · 川西公路</b></span></div>
          </div>
        </section>

        <form className="planning-workbench" onSubmit={submit}>
          <section className="planner-card">
            <div className="section-heading">
              <span className="step-number">01</span>
              <h2>{copy.controls}</h2>
            </div>

            <label>
              <span>{copy.endpoints}</span>
              <div className="endpoint-grid">
                <div className="select-wrap">
                  <select aria-label={copy.start} value={draft.startAnchorId} onChange={(event) => setDraft({ ...draft, startAnchorId: event.target.value })}>
                    {overnightAnchors.map((anchor) => <option value={anchor.id} key={`start-${anchor.id}`}>{copy.start} · {text(anchor.name, locale)}</option>)}
                  </select>
                  <ChevronDown size={17} />
                </div>
                <ArrowRight size={15} />
                <div className="select-wrap">
                  <select aria-label={copy.end} value={draft.endAnchorId} onChange={(event) => setDraft({ ...draft, endAnchorId: event.target.value })}>
                    {overnightAnchors.map((anchor) => <option value={anchor.id} key={`end-${anchor.id}`}>{copy.end} · {text(anchor.name, locale)}</option>)}
                  </select>
                  <ChevronDown size={17} />
                </div>
              </div>
            </label>

            <label>
              <span>{copy.dates}</span>
              <div className="date-row">
                <input type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} />
                <ArrowRight size={14} />
                <output>{getReturnDate(draft)}</output>
              </div>
            </label>

            <label>
              <span>{copy.departure}</span>
              <input className="time-input" type="time" min="05:30" max="12:00" step="900" value={draft.departureTime} onChange={(event) => setDraft({ ...draft, departureTime: event.target.value })} />
            </label>

            <label>
              <span>{copy.days}</span>
              <div className="segmented days-segmented" role="group" aria-label={copy.days}>
                {[3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button type="button" key={value} className={draft.days === value ? "active" : ""} onClick={() => setDraft({ ...draft, days: value })}>
                    {value}{locale === "zh" ? "天" : "d"}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span>{copy.vehicle}</span>
              <div className="select-wrap">
                <Car size={16} className="select-leading" />
                <select className="with-leading" value={draft.vehicle} onChange={(event) => setDraft({ ...draft, vehicle: event.target.value as Vehicle })}>
                  <option value="sedan">{copy.sedan}</option>
                  <option value="suv">{copy.suv}</option>
                  <option value="ev">{copy.ev}</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            {draft.vehicle === "ev" && <label>
              <span>{copy.range}</span>
              <div className="range-row">
                <input type="range" min="250" max="700" step="25" value={draft.evRangeKm} onChange={(event) => setDraft({ ...draft, evRangeKm: Number(event.target.value) })} />
                <output>{draft.evRangeKm} km</output>
              </div>
            </label>}

            <label>
              <span>{copy.drive}</span>
              <div className="range-row">
                <input type="range" min="3" max="7" step="0.5" value={draft.maxDrive} onChange={(event) => setDraft({ ...draft, maxDrive: Number(event.target.value) })} />
                <output>{draft.maxDrive} h</output>
              </div>
            </label>

            <label>
              <span>{copy.priority}</span>
              <div className="select-wrap">
                <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Strategy })}>
                  <option value="comfort">{copy.comfort}</option>
                  <option value="scenery">{copy.scenery}</option>
                  <option value="culture">{copy.culture}</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            <label className="check-row">
              <input type="checkbox" checked={draft.avoidNight} onChange={(event) => setDraft({ ...draft, avoidNight: event.target.checked })} />
              <span className="fake-check"><Check size={14} /></span>
              <span>{copy.avoidNight}</span>
            </label>

            <label className="check-row">
              <input type="checkbox" checked={draft.autoSuggest} onChange={(event) => setDraft({ ...draft, autoSuggest: event.target.checked })} />
              <span className="fake-check"><Check size={14} /></span>
              <span>{copy.autoSuggest}</span>
            </label>

            <button className="primary-button" type="submit">{copy.update}<ArrowRight size={18} /></button>
            {dirty && <p className="form-state pending"><AlertTriangle size={15} />{copy.dirty}</p>}
            {notice && <p className="form-state success" role="status"><Check size={15} />{copy.applied}</p>}
          </section>

          <section className="attraction-panel" id="places">
            <div className="selection-heading">
              <div>
                <p className="mini-label">MUST-SEE / 必去</p>
                <h2>{copy.attractionTitle}</h2>
                <p>{copy.attractionIntro}</p>
              </div>
              <div className="selection-count"><b>{draft.selectedAttractionIds.length}</b><span>{copy.selected}</span></div>
            </div>

            <div className="featured-picks" aria-label={copy.featured}>
              <b>{copy.featured}</b>
              <div>{featuredAttractionIds.map((id) => {
                const item = getAttraction(id)!;
                const selected = draft.selectedAttractionIds.includes(id);
                return <button type="button" key={id} className={selected ? "active" : ""} onClick={() => toggleAttraction(id)}>{selected && <Check size={12} />}{text(item.name, locale)}</button>;
              })}</div>
            </div>

            <div className="filter-bar">
              <label className="search-box">
                <Search size={17} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} />
                {query && <button type="button" aria-label="Clear" onClick={() => setQuery("")}><X size={15} /></button>}
              </label>
              <div className="select-wrap theme-select">
                <select value={themeFilter} onChange={(event) => setThemeFilter(event.target.value as "all" | Theme)}>
                  {themeFilters.map((theme) => <option value={theme} key={theme}>{theme === "all" ? copy.allThemes : text(themeNames[theme], locale)}</option>)}
                </select>
                <ChevronDown size={17} />
              </div>
            </div>

            <div className="region-tabs" role="group" aria-label={copy.allRegions}>
              {regionFilters.map((region) => (
                <button type="button" key={region} className={regionFilter === region ? "active" : ""} onClick={() => setRegionFilter(region)}>
                  {region === "all" ? copy.allRegions : text(regionNames[region], locale)}
                </button>
              ))}
            </div>

            {draft.selectedAttractionIds.length > 0 && (
              <div className="selected-strip">
                <span>{copy.selected}</span>
                <div>
                  {draft.selectedAttractionIds.map((id, index) => {
                    const item = getAttraction(id);
                    return item ? <span className="selected-item" key={id}>
                      <b>{index + 1}. {text(item.name, locale)}</b>
                      <button type="button" disabled={index === 0} aria-label="Move up" onClick={() => moveAttraction(id, -1)}><ArrowUp size={11} /></button>
                      <button type="button" disabled={index === draft.selectedAttractionIds.length - 1} aria-label="Move down" onClick={() => moveAttraction(id, 1)}><ArrowDown size={11} /></button>
                      <button type="button" aria-label="Remove" onClick={() => toggleAttraction(id)}><X size={11} /></button>
                    </span> : null;
                  })}
                </div>
                <button className="clear-button" type="button" onClick={() => setDraft({ ...draft, selectedAttractionIds: [] })}>{copy.clear}</button>
                <small className="order-hint">{copy.orderHint}</small>
              </div>
            )}

            <div className="attraction-grid">
              {visibleAttractions.map((item) => {
                const selected = selectedSet.has(item.id);
                return (
                  <article className={`attraction-card ${selected ? "selected" : ""}`} key={item.id}>
                    <button className="card-select" type="button" aria-pressed={selected} onClick={() => toggleAttraction(item.id)}>
                      <span className="card-check">{selected ? <Check size={14} /> : <span />}</span>
                      <span className="card-copy">
                        <b>{text(item.name, locale)}</b>
                        <small>{text(item.summary, locale)}</small>
                        <span className="card-metrics">
                          <i><Clock3 size={13} />{copy.hours} {item.visitHours}h</i>
                          <i><MountainSnow size={13} />{item.altitude}m</i>
                          {item.detourHours > 0 && <i><Route size={13} />+{item.detourHours}h</i>}
                        </span>
                        <span className="data-badges">
                          <span className="season-line">{copy.bestMonths} {item.bestMonths.join("/")}</span>
                          {item.reservation && <span className="reservation-line">{copy.reservation}</span>}
                        </span>
                      </span>
                      <span className={`effort effort-${item.effort}`}>{text(effortNames[item.effort], locale)}</span>
                    </button>
                    <button className="detail-button" type="button" onClick={() => setDetailAttractionId(item.id)}><Info size={14} />{copy.details}</button>
                  </article>
                );
              })}
              {visibleAttractions.length === 0 && <p className="empty-state">{copy.noMatches}</p>}
            </div>
          </section>
        </form>

        <section className="results-section" aria-live="polite">
          <div className="results-title">
            <div>
              <p className="mini-label">02 / CALCULATED</p>
              <h2>{copy.planTitle}</h2>
              <p>{copy.planIntro}</p>
            </div>
            <span className="constraint-summary"><CalendarDays size={16} />{text(routeAnchors[applied.startAnchorId].name, locale)} → {text(routeAnchors[applied.endAnchorId].name, locale)} · {applied.startDate} · {applied.days}{copy.dayUnit} · {applied.departureTime}</span>
          </div>

          <div className="plan-tabs" role="tablist">
            {options.map((option) => (
              <button type="button" role="tab" aria-selected={activePlan.id === option.id} className={activePlan.id === option.id ? "active" : ""} key={option.id} onClick={() => setActiveStrategy(option.id)}>
                <span className={`option-dot ${option.feasible ? "good" : "bad"}`} />
                <span><b>{text(option.title, locale)}</b><small>{option.feasible ? copy.feasible : copy.conflict}</small></span>
                <strong>{option.score}<small>%</small></strong>
              </button>
            ))}
          </div>

          <div className="result-column">
            <div className="result-header">
              <div>
                <div className="title-line"><h2>{text(activePlan.title, locale)}</h2><span className={`status-pill ${activePlan.feasible ? "good" : "warn"}`}>{activePlan.feasible ? <ShieldCheck size={15} /> : <AlertTriangle size={15} />}{activePlan.feasible ? copy.feasible : copy.conflict}</span></div>
                <p>{text(activePlan.subtitle, locale)}</p>
              </div>
              <div className="plan-stats">
                <span><b>{copy.network}</b><small>{copy.routeOverview}</small></span>
                <span><b>{activePlan.selectedAttractionIds.length} / {activePlan.suggestedAttractionIds.length}</b><small>{copy.selectedAndSuggested}</small></span>
                <span><b>{activePlan.totalDriveHours} h</b><small>{copy.totalDrive}</small></span>
                <span><b>{activePlan.totalDistanceKm} km</b><small>{copy.totalDistance}</small></span>
              </div>
            </div>

            <div className="plan-actions">
              <button type="button" onClick={savePlan}><Save size={15} />{copy.save}</button>
              <button type="button" onClick={sharePlan}><Share2 size={15} />{copy.share}</button>
              <button type="button" onClick={() => window.print()}><Printer size={15} />{copy.print}</button>
              {actionNotice && <span role="status"><Check size={14} />{actionNotice}</span>}
            </div>

            <section className="route-overview" aria-label={copy.routeOverview}>
              <div className="route-overview-heading"><div><b>{copy.routeOverview}</b><p>{copy.routeTruth}</p></div><Route size={19} /></div>
              <div className="route-days">
                {activePlan.schedule.map((day) => <div className="route-day" key={`route-${day.day}`}>
                  <span className="route-day-label">D{day.day}</span>
                  <div className="route-sequence">
                    <b className="route-place start">{text(routeAnchors[day.startAnchorId].name, locale)}</b>
                    {day.routeSteps.map((step, index) => <React.Fragment key={`${day.day}-${step.legId}-${index}`}>
                      <span className="route-leg"><small>{step.road}</small><i /><em>{step.distanceKm}km · {step.driveHours}h</em></span>
                      <b className={`route-place ${index === day.routeSteps.length - 1 ? "stay" : ""}`}>{text(routeAnchors[step.toAnchorId].name, locale)}</b>
                    </React.Fragment>)}
                    {day.routeSteps.length === 0 && <span className="same-place">{locale === "zh" ? "同一区域活动，无主干道转场" : "Same-area activities; no main-road transfer"}</span>}
                  </div>
                </div>)}
              </div>
            </section>

            <div className={`decision-panel ${activePlan.feasible ? "ok" : "attention"}`}>
              {activePlan.feasible ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
              <div>
                <h3>{activePlan.feasible ? copy.feasible : copy.conflicts}</h3>
                {activePlan.warnings.length === 0 ? <p>{copy.allGood}</p> : (
                  <ul>{activePlan.warnings.map((warning) => <li key={warning.code}>{text(warning.message, locale)}</li>)}</ul>
                )}
                {!activePlan.feasible && activePlan.minimumDays && activePlan.minimumDays > applied.days && <p className="minimum-days">{copy.minimumDays} <b>{activePlan.minimumDays} {copy.dayUnit}</b>。</p>}
              </div>
            </div>

            {applied.autoSuggest && (
              <div className={`suggestion-row ${activePlan.suggestedAttractionIds.length === 0 ? "empty" : ""}`}><Sparkles size={16} /><b>{activePlan.suggestedAttractionIds.length > 0 ? copy.suggestedApplied : copy.noSuggestedApplied}</b>{activePlan.suggestedAttractionIds.map((id) => {
                const item = getAttraction(id);
                return item ? <span key={id}>{text(item.name, locale)}</span> : null;
              })}</div>
            )}

            <div className="timeline">
              {activePlan.schedule.map((day) => {
                const guide = overnightGuide(day.endAnchorId);
                const startGuide = overnightGuide(day.startAnchorId);
                const restPoints = servicesForLegs(day.legIds);
                const nearbyServices = servicesNearAnchors([day.startAnchorId, ...day.viaAnchorIds, day.endAnchorId], undefined, 5);
                const dinnerStart = shiftTime(day.estimatedArrivalTime, 0.25);
                const dinnerEnd = shiftTime(day.estimatedArrivalTime, 1.25);
                return <article className="day-card" key={day.day}>
                  <div className="day-rail"><span>D{day.day}</span><i /></div>
                  <div className="day-content">
                    <div className="day-topline">
                      <div>
                        <p>{day.date} · {text(routeAnchors[day.startAnchorId].name, locale)} → {text(routeAnchors[day.endAnchorId].name, locale)}</p>
                        <h3>{day.attractionIds.length > 0 ? day.attractionIds.map((id) => text(getAttraction(id)!.name, locale)).join(" · ") : copy.transit}</h3>
                      </div>
                      <span className="sleep-badge"><MountainSnow size={14} />{copy.sleepAltitude} {day.sleepAltitude}m</span>
                    </div>
                    <div className="metrics">
                      <span><Clock3 size={15} /> {copy.pureDrive} {day.driveHours}h</span>
                      <span><Sparkles size={15} /> {copy.activities} {day.activityHours}h</span>
                      {day.restHours > 0 && <span><Coffee size={15} /> {copy.plannedBreak} {day.restHours}h</span>}
                      {day.mealHours > 0 && <span><Utensils size={15} /> {copy.mealBreak} {day.mealHours}h</span>}
                      <span><Gauge size={15} /> {copy.distance} {day.distanceKm}km</span>
                      <span><Sun size={15} /> {copy.daylight} {day.sunrise}–{day.sunset}</span>
                      <span><Clock3 size={15} /> {copy.estimatedWindow} {day.departureTime}–{day.estimatedArrivalTime}</span>
                      <span><ShieldCheck size={15} /> {copy.freeTime} {day.freeHours}h</span>
                      <span className={day.daylightMarginMinutes >= 0 ? "margin-positive" : "margin-negative"}><Sun size={15} /> {copy.margin} {day.daylightMarginMinutes >= 0 ? "+" : ""}{day.daylightMarginMinutes} min</span>
                    </div>

                    <section className="day-agenda">
                      <div className="agenda-heading"><div><b>{copy.agendaTitle}</b><p>{copy.agendaIntro}</p></div><Clock3 size={18} /></div>
                      <div className="agenda-list">
                        <div className="agenda-item meal-item">
                          <time>{shiftTime(day.departureTime, -0.75)}–{shiftTime(day.departureTime, -0.25)}</time>
                          <span className="agenda-dot"><Utensils size={14} /></span>
                          <div><span className="agenda-phase">{copy.breakfast}</span><b>{text(startGuide.name, locale)}</b><p>{copy.breakfastHint}</p></div>
                        </div>
                        {day.agenda.map((item, index) => {
                          const attraction = item.attractionId ? getAttraction(item.attractionId) : undefined;
                          const phase = item.kind === "lunch" ? copy.lunchBlock : isMorning(item.startTime) ? copy.morning : copy.afternoon;
                          const kind = item.kind === "drive" ? copy.driveBlock : item.kind === "visit" ? copy.visitBlock : item.kind === "rest" ? copy.restBlock : copy.lunchBlock;
                          const title = item.kind === "drive" && item.fromAnchorId && item.toAnchorId
                            ? `${text(routeAnchors[item.fromAnchorId].name, locale)} → ${text(routeAnchors[item.toAnchorId].name, locale)}`
                            : item.kind === "visit" && attraction ? text(attraction.name, locale)
                              : text(routeAnchors[item.anchorId].name, locale);
                          const detail = item.kind === "drive"
                            ? `${item.road} · ${item.distanceKm}km · ${item.driveHours}h`
                            : item.kind === "visit" && attraction
                              ? `${locale === "zh" ? "游玩" : "Visit"} ${attraction.visitHours}h${attraction.detourHours > 0 ? ` · ${locale === "zh" ? "含支线往返驾驶" : "branch driving"} ${attraction.detourHours}h` : ""}`
                              : item.kind === "rest"
                                ? (locale === "zh" ? "进入正规服务区或停车区休息，不在路肩停车。" : "Use a formal service or parking area; never stop on the shoulder.")
                                : copy.lunchHint;
                          return <div className={`agenda-item ${item.kind}`} key={`${day.day}-agenda-${index}`}>
                            <time>{item.startTime}–{item.endTime}</time>
                            <span className="agenda-dot">{item.kind === "drive" ? <Navigation size={14} /> : item.kind === "visit" ? <Sparkles size={14} /> : item.kind === "rest" ? <Coffee size={14} /> : <Utensils size={14} />}</span>
                            <div><span className="agenda-phase">{phase} · {kind}</span><b>{title}</b><p>{detail}</p></div>
                          </div>;
                        })}
                        <div className="agenda-item meal-item">
                          <time>{dinnerStart}–{dinnerEnd}</time>
                          <span className="agenda-dot"><Utensils size={14} /></span>
                          <div><span className="agenda-phase">{copy.dinner}</span><b>{text(guide.name, locale)}</b><p>{text(guide.dining, locale)}</p></div>
                        </div>
                        <div className="agenda-item stay-item">
                          <time>{dinnerEnd}{locale === "zh" ? "后" : "+"}</time>
                          <span className="agenda-dot"><BedDouble size={14} /></span>
                          <div><span className="agenda-phase">{copy.checkIn}</span><b>{text(guide.name, locale)} · {day.sleepAltitude}m</b><p>{text(guide.stayAdvice, locale)}</p><small>{text(guide.tradeoff, locale)}</small></div>
                        </div>
                      </div>
                    </section>

                    <div className="roadbook-grid">
                      <article>
                        <span className="roadbook-icon"><Sparkles size={16} /></span>
                        <div><b>{locale === "zh" ? "为什么这样安排" : "Why this order"}</b>
                        <div className="stop-list">
                          {day.attractionIds.length === 0 && <span>{copy.transit}</span>}
                          {day.attractionIds.map((id) => {
                            const item = getAttraction(id)!;
                            const suggested = activeSuggestedSet.has(id) && !activeSelectedSet.has(id);
                            return <span key={id}>{text(item.name, locale)} · {item.visitHours}h<em>{suggested ? copy.suggestedStop : copy.selectedStop}</em></span>;
                          })}
                        </div>
                        <p>{day.roads.join(" · ") || "—"} · {day.sleepAltitude > 2600 ? copy.dayReasonAltitude : copy.dayReasonDrive}</p></div>
                      </article>
                      <article>
                        <span className="roadbook-icon"><Coffee size={16} /></span>
                        <div><b>{copy.roadRest}</b>{restPoints.length > 0 ? <ul className="service-list">{restPoints.map((point) => <li key={point.id}><a href={point.sourceUrl} target="_blank" rel="noreferrer">{text(point.name, locale)}</a><small>{point.road} {point.kilometer}</small></li>)}</ul> : <p>{copy.noOfficialRest}</p>}</div>
                      </article>
                    </div>

                    {day.evPlan && <section className="ev-day-plan">
                      <div className="ev-title"><BatteryCharging size={20} /><div><b>{copy.evTitle}</b><small>{copy.evEstimate}</small></div></div>
                      <div className="ev-numbers"><span><b>{day.evPlan.safeBudgetKm} km</b><small>{copy.evSafeBudget}</small></span><span><b>{day.evPlan.usagePercent}%</b><small>{copy.evUsage}</small></span><span><b>{day.evPlan.estimatedChargeMinutes} min</b><small>{copy.evCharge} · {text(routeAnchors[day.evPlan.chargeAnchorId].name, locale)}</small></span></div>
                      <div className="ev-meter"><i style={{ width: `${Math.min(100, day.evPlan.usagePercent)}%` }} /></div>
                      <p><AlertTriangle size={14} />{copy.evFallback}：<b>{text(routeAnchors[day.evPlan.fallbackAnchorId].name, locale)}</b>。{nearbyServices.filter((point) => point.types.includes("charging")).length === 0 && copy.osmEmpty}</p>
                    </section>}

                    <div className="service-tools">
                      <b><MapPin size={15} />{copy.serviceTools}</b>
                      <div>
                        <a href={amapSearchUrl(day.endAnchorId, locale === "zh" ? "加油站" : "fuel station")} target="_blank" rel="noreferrer"><Fuel size={14} />{copy.fuelSearch}</a>
                        <a href={amapSearchUrl(day.endAnchorId, locale === "zh" ? "充电站" : "charging station")} target="_blank" rel="noreferrer"><BatteryCharging size={14} />{copy.chargeSearch}</a>
                        <a href={amapSearchUrl(day.endAnchorId, locale === "zh" ? "公共厕所" : "public toilet")} target="_blank" rel="noreferrer">{copy.toiletSearch}</a>
                        <a href={amapSearchUrl(day.endAnchorId, locale === "zh" ? "医院" : "hospital")} target="_blank" rel="noreferrer">{copy.hospitalSearch}</a>
                        {day.startAnchorId !== day.endAnchorId && <a href={amapNavigationUrl(day.startAnchorId, day.endAnchorId)} target="_blank" rel="noreferrer"><Navigation size={14} />{copy.navigate}</a>}
                      </div>
                      {nearbyServices.length > 0 && <p>{nearbyServices.map((point) => <a key={point.id} href={point.sourceUrl} target="_blank" rel="noreferrer">{text(point.name, locale)}</a>)}</p>}
                      <small>{copy.osmUpdated} · <a href={serviceSnapshot.attributionUrl} target="_blank" rel="noreferrer">© OpenStreetMap contributors / ODbL</a></small>
                    </div>
                  </div>
                </article>;
              })}
              {activePlan.schedule.length === 0 && <p className="empty-schedule">{text(activePlan.warnings[0].message, locale)}</p>}
            </div>
          </div>
        </section>

        <aside className="safety-callout">
          <ShieldCheck size={25} />
          <div><h2>{copy.disclaimerTitle}</h2><p>{copy.disclaimer}</p></div>
        </aside>

        <section className="sources-section" id="sources">
          <div className="section-heading wide-heading">
            <span className="step-number">03</span>
            <div><h2>{copy.sourceTitle}</h2><p>{copy.sourceIntro}</p></div>
          </div>
          <div className="update-status-card">
            <span className="source-icon"><RefreshCw size={20} /></span>
            <div><b>{copy.weeklyStatus}</b><p>{copy.weeklyStatusBody}</p><small>{locale === "zh" ? "状态记录" : "Status record"}: {updateStatus.lastAttemptAt.slice(0, 10)}</small></div>
          </div>
          <div className="source-grid">
            {sourceSummary.map((source) => (
              <article className="source-card" key={source.url}>
                <div className="source-icon"><ShieldCheck size={20} /></div>
                <h3>{text(source.agency, locale)}</h3>
                <p>{text(source.scope, locale)}</p>
                <div className="source-tags"><span>{text(source.cadence, locale)}</span><span>{copy.humanReview}</span></div>
                <a href={source.url} target="_blank" rel="noreferrer">{copy.original}<ExternalLink size={15} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="support-section" id="support">
          <div className="support-icon"><Coffee size={27} /></div>
          <div><p className="mini-label">SUPPORT / 支持</p><h2>{copy.supportTitle}</h2><p>{copy.supportBody}</p></div>
          <button disabled>{copy.comingSoon}</button>
        </section>
      </main>

      {detailAttraction && <div className="detail-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setDetailAttractionId(null); }}>
        <section className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="attraction-detail-title">
          <button className="drawer-close" type="button" aria-label={copy.close} onClick={() => setDetailAttractionId(null)}><X size={20} /></button>
          <p className="mini-label">PLACE DATA / 景点资料</p>
          <h2 id="attraction-detail-title">{text(detailAttraction.name, locale)}</h2>
          <p className="drawer-summary">{text(detailAttraction.summary, locale)}</p>
          <div className="drawer-metrics">
            <span><Clock3 size={17} />{copy.hours} {detailAttraction.visitHours}h</span>
            <span><MountainSnow size={17} />{copy.altitude} {detailAttraction.altitude}m</span>
            <span><Gauge size={17} />{text(effortNames[detailAttraction.effort], locale)}</span>
          </div>
          <dl className="detail-list">
            <div><dt>{copy.bestMonths}</dt><dd>{detailAttraction.bestMonths.join(" / ")}</dd></div>
            <div><dt>{copy.opening}</dt><dd>{text(detailAttraction.opening, locale)}</dd></div>
            {detailAttraction.reservation && <div><dt>{copy.reservation}</dt><dd>{text(detailAttraction.reservation, locale)}</dd></div>}
            <div><dt>{copy.checkedOn}</dt><dd>{detailAttraction.verifiedOn}</dd></div>
          </dl>
          <a className="official-source-button" href={detailAttraction.sourceUrl} target="_blank" rel="noreferrer"><ShieldCheck size={17} />{copy.sourceLink}<ExternalLink size={15} /></a>
          <p className="drawer-disclaimer">{copy.disclaimer}</p>
        </section>
      </div>}

      <footer><span>{copy.footer}</span><span>v0.6 · 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
