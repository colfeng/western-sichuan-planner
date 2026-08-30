import React, { FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  ExternalLink,
  Gauge,
  Languages,
  MapPinned,
  MountainSnow,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { Copy, Locale, RegionId, Theme } from "./data";
import {
  attractions,
  effortNames,
  regionNames,
  routeAnchors,
  sourceSummary,
  themeNames,
} from "./data";
import type { PlannerInput, Strategy } from "./planner";
import { buildPlanOptions, getAttraction } from "./planner";
import "./styles.css";

const text = (copy: Copy, locale: Locale) => copy[locale];

const initialInput: PlannerInput = {
  days: 5,
  maxDrive: 5,
  priority: "comfort",
  avoidNight: true,
  selectedAttractionIds: ["shuangqiao", "jiaju"],
};

const ui = {
  zh: {
    brand: "川西自驾规划器",
    brandEn: "Western Sichuan Planner",
    planner: "规划行程",
    places: "选择景点",
    sources: "数据来源",
    support: "支持项目",
    eyebrow: "36个可选停留 · 约束规划 · 中英双语",
    heading: "由你选择想看的地方，规划器负责判断怎样走得完。",
    intro: "首条走廊覆盖成都、卧龙、四姑娘山、丹巴，并可扩展至塔公—康定环线。结果根据驾驶上限、游玩时长、海拔和住宿节点实时分日。",
    updated: "V0.2规划基线 · 非实时导航",
    controls: "设定旅行约束",
    days: "旅行天数",
    drive: "单日最多驾驶",
    priority: "主要偏好",
    comfort: "轻松与安全",
    scenery: "景观丰富",
    culture: "人文与村落",
    avoidNight: "18:30后不走陌生山路",
    update: "按这些条件重新规划",
    dirty: "选择有变化，更新后才会应用",
    applied: "新约束已进入计算",
    attractionTitle: "选择必去景点",
    attractionIntro: "选择的是硬约束；算法建议的顺路景点会单独标记，你不必全部接受。",
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
    compact: "丹巴—泸定短环线",
    grand: "塔公—康定大环线",
    totalDrive: "总驾驶",
    totalDistance: "基线里程",
    suggested: "算法建议",
    mustSee: "你的必去",
    routeOverview: "行程骨架",
    conflicts: "需要你决定",
    minimumDays: "按当前必去景点，建议至少增加到",
    dayUnit: "天",
    allGood: "当前日程满足你的驾驶上限与日照窗口；出发前仍须复核天气和正式导航。",
    pureDrive: "纯驾驶",
    activities: "游玩",
    distance: "约",
    sleepAltitude: "住宿海拔",
    roads: "道路基线",
    stops: "当天安排",
    transit: "转场与正规休息",
    suggestedStop: "建议",
    selectedStop: "必去",
    dayReasonAltitude: "控制住宿海拔变化，并把高强度活动与长驾驶拆开。",
    dayReasonDrive: "按连续行车90–120分钟安排正规休息，不用压缩休息追回时间。",
    disclaimerTitle: "规划结果不是通行承诺",
    disclaimer: "里程和时间是用于比较方案的基线估计，并非实时导航。出发前24小时必须再次核对交警公告、天气、景区开放状态和正式导航；遇暴雨、浓雾或地灾预警时删减活动。",
    sourceTitle: "规划数据要能回到官方来源",
    sourceIntro: "景点种子数据来自景区官网与地方政府公开信息；道路公告每周自动发现，但未经人工审核不会改变路线。",
    humanReview: "人工确认后生效",
    original: "查看官方入口",
    supportTitle: "帮助这个独立项目继续维护",
    supportBody: "本站并非慈善组织。未来的自愿支持将用于数据维护和持续开发，不属于慈善捐赠，不提供公益捐赠票据，也不会影响免费功能。",
    comingSoon: "支持通道尚未开放",
    footer: "独立个人项目 · 安全约束优先于景点数量",
  },
  en: {
    brand: "Western Sichuan Planner",
    brandEn: "川西自驾规划器",
    planner: "Plan a trip",
    places: "Choose places",
    sources: "Sources",
    support: "Support",
    eyebrow: "36 selectable stops · Constraint planning · Bilingual",
    heading: "Choose what you want to see. Let the planner decide what can actually fit.",
    intro: "The first corridor covers Chengdu, Wolong, Mount Siguniang and Danba, with an optional Tagong–Kangding loop. Days are rebuilt from driving caps, visit time, altitude and viable overnight nodes.",
    updated: "V0.2 planning baseline · Not live navigation",
    controls: "Set trip constraints",
    days: "Trip length",
    drive: "Daily driving cap",
    priority: "Main preference",
    comfort: "Comfort & safety",
    scenery: "Landscape variety",
    culture: "Culture & villages",
    avoidNight: "No unfamiliar mountain roads after 18:30",
    update: "Rebuild with these constraints",
    dirty: "Selections changed; rebuild to apply them",
    applied: "New constraints are now calculated",
    attractionTitle: "Choose must-see places",
    attractionIntro: "Your choices are hard constraints. Optional en-route suggestions are marked separately and can be ignored.",
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
    compact: "Danba–Luding compact loop",
    grand: "Tagong–Kangding grand loop",
    totalDrive: "Total driving",
    totalDistance: "Baseline distance",
    suggested: "Planner suggestions",
    mustSee: "Your must-sees",
    routeOverview: "Route skeleton",
    conflicts: "Decision needed",
    minimumDays: "For the current must-sees, allow at least",
    dayUnit: "days",
    allGood: "This schedule fits your driving cap and daylight window. Recheck weather and formal navigation before departure.",
    pureDrive: "Driving",
    activities: "Activities",
    distance: "Approx.",
    sleepAltitude: "Sleep altitude",
    roads: "Road baseline",
    stops: "Day plan",
    transit: "Transit and formal rest stops",
    suggestedStop: "Suggested",
    selectedStop: "Must-see",
    dayReasonAltitude: "Controls sleeping-altitude changes and separates demanding activities from long drives.",
    dayReasonDrive: "Plan a formal stop every 90–120 minutes; never recover time by cutting rest.",
    disclaimerTitle: "A plan is not a promise that the road is open",
    disclaimer: "Distance and time are comparison baselines, not live navigation. Within 24 hours of departure, recheck police notices, weather, attraction status and formal navigation. Drop activities during heavy rain, dense fog or geohazard alerts.",
    sourceTitle: "Planning data should trace back to official sources",
    sourceIntro: "Seed attraction data comes from official attraction and local-government sources. A weekly job discovers road notices, but none affect routes before human review.",
    humanReview: "Active after human review",
    original: "Open official source",
    supportTitle: "Help maintain this independent project",
    supportBody: "This is not a charitable organization. Future voluntary support will fund data maintenance and development. It is not a charitable donation, carries no tax-deductible receipt and never changes access to free features.",
    comingSoon: "Support channel not open yet",
    footer: "Independent project · Safety constraints outrank attraction count",
  },
};

const regionFilters: Array<"all" | RegionId> = ["all", "gateway", "aba", "danba", "kangding", "return"];
const themeFilters: Array<"all" | Theme> = ["all", "scenery", "culture", "wildlife", "hiking", "rest"];

function sameInput(a: PlannerInput, b: PlannerInput): boolean {
  return a.days === b.days
    && a.maxDrive === b.maxDrive
    && a.priority === b.priority
    && a.avoidNight === b.avoidNight
    && [...a.selectedAttractionIds].sort().join("|") === [...b.selectedAttractionIds].sort().join("|");
}

function App() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [draft, setDraft] = useState<PlannerInput>(initialInput);
  const [applied, setApplied] = useState<PlannerInput>(initialInput);
  const [activeStrategy, setActiveStrategy] = useState<Strategy>("comfort");
  const [regionFilter, setRegionFilter] = useState<"all" | RegionId>("all");
  const [themeFilter, setThemeFilter] = useState<"all" | Theme>("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const copy = ui[locale];
  const dirty = !sameInput(draft, applied);
  const heroImage = `${import.meta.env.BASE_URL}images/western-sichuan-road.webp`;

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

  const toggleAttraction = (id: string) => {
    setDraft((current) => ({
      ...current,
      selectedAttractionIds: current.selectedAttractionIds.includes(id)
        ? current.selectedAttractionIds.filter((item) => item !== id)
        : [...current.selectedAttractionIds, id],
    }));
  };

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
          <div className="image-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 37, 32, .52), rgba(12, 37, 32, .03)), url(${heroImage})` }} role="img" aria-label={locale === "zh" ? "川西雪山与山谷公路" : "An alpine road and snow peaks in Western Sichuan"}>
            <div className="route-badge"><MountainSnow size={19} /><span>Chengdu<br /><b>四姑娘山 · Danba · Kangding</b></span></div>
          </div>
        </section>

        <form className="planning-workbench" onSubmit={submit}>
          <section className="planner-card">
            <div className="section-heading">
              <span className="step-number">01</span>
              <h2>{copy.controls}</h2>
            </div>

            <label>
              <span>{copy.days}</span>
              <div className="segmented days-segmented" role="group" aria-label={copy.days}>
                {[3, 4, 5, 6, 7].map((value) => (
                  <button type="button" key={value} className={draft.days === value ? "active" : ""} onClick={() => setDraft({ ...draft, days: value })}>
                    {value}{locale === "zh" ? "天" : "d"}
                  </button>
                ))}
              </div>
            </label>

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
                  {draft.selectedAttractionIds.map((id) => {
                    const item = getAttraction(id);
                    return item ? <button type="button" key={id} onClick={() => toggleAttraction(id)}>{text(item.name, locale)}<X size={12} /></button> : null;
                  })}
                </div>
                <button className="clear-button" type="button" onClick={() => setDraft({ ...draft, selectedAttractionIds: [] })}>{copy.clear}</button>
              </div>
            )}

            <div className="attraction-grid">
              {visibleAttractions.map((item) => {
                const selected = selectedSet.has(item.id);
                return (
                  <button className={`attraction-card ${selected ? "selected" : ""}`} type="button" key={item.id} aria-pressed={selected} onClick={() => toggleAttraction(item.id)}>
                    <span className="card-check">{selected ? <Check size={14} /> : <span />}</span>
                    <span className="card-copy">
                      <b>{text(item.name, locale)}</b>
                      <small>{text(item.summary, locale)}</small>
                      <span className="card-metrics">
                        <i><Clock3 size={12} />{copy.hours} {item.visitHours}h</i>
                        <i><MountainSnow size={12} />{item.altitude}m</i>
                        {item.detourHours > 0 && <i><Route size={12} />+{item.detourHours}h</i>}
                      </span>
                    </span>
                    <span className={`effort effort-${item.effort}`}>{text(effortNames[item.effort], locale)}</span>
                  </button>
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
            <span className="constraint-summary"><CalendarDays size={16} />{applied.days}{copy.dayUnit} · ≤ {applied.maxDrive}h/day · {activePlan.selectedAttractionIds.length} {copy.mustSee}</span>
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
                <span><b>{activePlan.routeKind === "compact" ? copy.compact : copy.grand}</b><small>{copy.routeOverview}</small></span>
                <span><b>{activePlan.totalDriveHours} h</b><small>{copy.totalDrive}</small></span>
                <span><b>{activePlan.totalDistanceKm} km</b><small>{copy.totalDistance}</small></span>
              </div>
            </div>

            <div className="route-strip" aria-label={copy.routeOverview}>
              {activePlan.routeAnchorIds.map((anchorId, index) => (
                <div className="route-node" key={anchorId}>
                  <span className={activePlan.schedule.some((day) => day.endAnchorId === anchorId && day.day < applied.days) ? "overnight" : ""} />
                  <b>{text(routeAnchors[anchorId].name, locale)}</b>
                  {index < activePlan.routeAnchorIds.length - 1 && <i />}
                </div>
              ))}
            </div>

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

            {activePlan.suggestedAttractionIds.length > 0 && (
              <div className="suggestion-row"><Sparkles size={16} /><b>{copy.suggested}</b>{activePlan.suggestedAttractionIds.map((id) => {
                const item = getAttraction(id);
                return item ? <span key={id}>{text(item.name, locale)}</span> : null;
              })}</div>
            )}

            <div className="timeline">
              {activePlan.schedule.map((day) => (
                <article className="day-card" key={day.day}>
                  <div className="day-rail"><span>D{day.day}</span><i /></div>
                  <div className="day-content">
                    <div className="day-topline">
                      <div>
                        <p>{text(routeAnchors[day.startAnchorId].name, locale)} → {text(routeAnchors[day.endAnchorId].name, locale)}</p>
                        <h3>{day.attractionIds.length > 0 ? day.attractionIds.map((id) => text(getAttraction(id)!.name, locale)).join(" · ") : copy.transit}</h3>
                      </div>
                      <span className="sleep-badge"><MountainSnow size={14} />{copy.sleepAltitude} {day.sleepAltitude}m</span>
                    </div>
                    <div className="metrics">
                      <span><Clock3 size={15} /> {copy.pureDrive} {day.driveHours}h</span>
                      <span><Sparkles size={15} /> {copy.activities} {day.activityHours}h</span>
                      <span><Gauge size={15} /> {copy.distance} {day.distanceKm}km</span>
                    </div>
                    <div className="day-detail">
                      <div>
                        <b>{copy.stops}</b>
                        <div className="stop-list">
                          {day.attractionIds.length === 0 && <span>{copy.transit}</span>}
                          {day.attractionIds.map((id) => {
                            const item = getAttraction(id)!;
                            const suggested = activeSuggestedSet.has(id) && !activeSelectedSet.has(id);
                            return <span key={id}>{text(item.name, locale)}<em>{suggested ? copy.suggestedStop : copy.selectedStop}</em></span>;
                          })}
                        </div>
                      </div>
                      <div><b>{copy.roads}</b><p>{day.roads.join(" · ") || "—"}</p></div>
                      <div><b>{locale === "zh" ? "安排逻辑" : "Planning logic"}</b><p>{day.sleepAltitude > 2600 ? copy.dayReasonAltitude : copy.dayReasonDrive}</p></div>
                    </div>
                  </div>
                </article>
              ))}
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

      <footer><span>{copy.footer}</span><span>v0.2 · 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
