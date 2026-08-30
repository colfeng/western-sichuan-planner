import React, { FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
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
  ShieldCheck,
} from "lucide-react";
import { Copy, Locale, planProfiles, sourceSummary } from "./data";
import "./styles.css";

const text = (copy: Copy, locale: Locale) => copy[locale];

const ui = {
  zh: {
    brand: "川西自驾规划器",
    brandEn: "Western Sichuan Planner",
    planner: "规划行程",
    sources: "数据来源",
    support: "支持项目",
    eyebrow: "安全优先 · 可解释规划 · 中英双语",
    heading: "先决定怎样安全地走，再决定沿途看什么。",
    intro: "把驾驶时间、海拔适应、道路风险和景观差异放进同一个多日规划中。首版从成都—四姑娘山—丹巴走廊开始。",
    updated: "示例数据 · 尚未接入实时路况",
    formTitle: "生成示范行程",
    days: "旅行天数",
    drive: "单日最多驾驶",
    priority: "主要偏好",
    comfort: "轻松与安全",
    scenery: "景观丰富",
    culture: "人文与藏寨",
    avoidNight: "18:30后不走陌生山路",
    generate: "重新生成方案",
    generated: "已按你的约束重新评估",
    recommendation: "规划建议",
    recommended: "推荐",
    notRecommended: "谨慎选择",
    pureDrive: "纯驾驶",
    distance: "约",
    altitude: "住宿海拔",
    stops: "途中停留",
    reason: "为什么这样安排",
    disclaimerTitle: "这不是实时导航",
    disclaimer: "道路状态是规划基线。出发前24小时必须再次核对交警公告、天气和正式导航；遇暴雨、浓雾或地灾预警时删减行程，不压缩休息时间赶路。",
    sourceTitle: "每条道路结论都应当可以回到原文",
    sourceIntro: "首版只维护官方来源白名单。自动任务每周发现新增公告，但不会未经人工审核就修改正式路线。",
    cadence: "每周检查",
    humanReview: "人工确认后生效",
    original: "查看官方入口",
    supportTitle: "帮助这个独立项目继续维护",
    supportBody: "本站并非慈善组织。未来的自愿支持将用于服务器、数据维护和持续开发，不属于慈善捐赠，不提供公益捐赠票据，也不会影响免费功能。",
    comingSoon: "支持通道尚未开放",
    footer: "独立个人项目 · 道路信息仅作出行规划参考",
  },
  en: {
    brand: "Western Sichuan Planner",
    brandEn: "川西自驾规划器",
    planner: "Plan a trip",
    sources: "Sources",
    support: "Support",
    eyebrow: "Safety-first · Explainable · Bilingual",
    heading: "Decide how to travel safely before deciding what to see.",
    intro: "Plan driving time, altitude acclimatization, road risk and landscape variety together. Phase one starts with the Chengdu–Mount Siguniang–Danba corridor.",
    updated: "Sample data · No live traffic connection yet",
    formTitle: "Build a sample itinerary",
    days: "Trip length",
    drive: "Daily driving cap",
    priority: "Main preference",
    comfort: "Comfort & safety",
    scenery: "Landscape variety",
    culture: "Culture & villages",
    avoidNight: "No unfamiliar mountain roads after 18:30",
    generate: "Rebuild itinerary",
    generated: "Re-evaluated against your constraints",
    recommendation: "Planning recommendation",
    recommended: "Recommended",
    notRecommended: "Use caution",
    pureDrive: "Driving",
    distance: "Approx.",
    altitude: "Sleep altitude",
    stops: "Stops",
    reason: "Why this arrangement",
    disclaimerTitle: "This is not live navigation",
    disclaimer: "Road status is a planning baseline. Recheck police notices, weather and official navigation within 24 hours of departure. Drop activities during heavy rain, dense fog or geohazard alerts—never recover time by cutting rest.",
    sourceTitle: "Every road claim should trace back to its source",
    sourceIntro: "Phase one maintains a whitelist of official sources. A weekly job discovers new notices, but no route changes until a human approves them.",
    cadence: "Weekly check",
    humanReview: "Active after human review",
    original: "Open official source",
    supportTitle: "Help maintain this independent project",
    supportBody: "This is not a charitable organization. Future voluntary support will fund hosting, data maintenance and development. It is not a charitable donation, carries no tax-deductible receipt and never changes access to free features.",
    comingSoon: "Support channel not open yet",
    footer: "Independent personal project · Road information is for trip-planning reference only",
  },
};

function App() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [days, setDays] = useState(5);
  const [maxDrive, setMaxDrive] = useState(5);
  const [priority, setPriority] = useState("comfort");
  const [avoidNight, setAvoidNight] = useState(true);
  const [notice, setNotice] = useState(false);
  const copy = ui[locale];
  const selected = useMemo(
    () => planProfiles.find((profile) => profile.days === days) ?? planProfiles[2],
    [days],
  );
  const heroImage = `${import.meta.env.BASE_URL}images/western-sichuan-road.webp`;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setNotice(true);
    window.setTimeout(() => setNotice(false), 2600);
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
            <div className="route-badge"><MountainSnow size={19} /><span>Chengdu<br /><b>四姑娘山 · Danba</b></span></div>
          </div>
        </section>

        <section className="planner-grid">
          <form className="planner-card" onSubmit={submit}>
            <div className="section-heading">
              <span className="step-number">01</span>
              <h2>{copy.formTitle}</h2>
            </div>

            <label>
              <span>{copy.days}</span>
              <div className="segmented" role="group" aria-label={copy.days}>
                {[3, 4, 5].map((value) => (
                  <button type="button" key={value} className={days === value ? "active" : ""} onClick={() => setDays(value)}>
                    {value} {locale === "zh" ? "天" : "days"}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span>{copy.drive}</span>
              <div className="range-row">
                <input type="range" min="3" max="7" step="1" value={maxDrive} onChange={(event) => setMaxDrive(Number(event.target.value))} />
                <output>{maxDrive} h</output>
              </div>
            </label>

            <label>
              <span>{copy.priority}</span>
              <div className="select-wrap">
                <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option value="comfort">{copy.comfort}</option>
                  <option value="scenery">{copy.scenery}</option>
                  <option value="culture">{copy.culture}</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            <label className="check-row">
              <input type="checkbox" checked={avoidNight} onChange={(event) => setAvoidNight(event.target.checked)} />
              <span className="fake-check"><Check size={14} /></span>
              <span>{copy.avoidNight}</span>
            </label>

            <button className="primary-button" type="submit">{copy.generate}<ArrowRight size={18} /></button>
            {notice && <p className="toast" role="status"><Check size={16} />{copy.generated}</p>}
          </form>

          <div className="result-column">
            <div className="result-header">
              <div>
                <p className="mini-label">{copy.recommendation}</p>
                <h2>{text(selected.title, locale)}</h2>
                <p>{text(selected.subtitle, locale)}</p>
              </div>
              <span className={`status-pill ${selected.recommended ? "good" : "warn"}`}>
                {selected.recommended ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                {selected.recommended ? copy.recommended : copy.notRecommended}
              </span>
            </div>

            <div className="timeline">
              {selected.schedule.map((day) => {
                const exceedsCap = day.driveHours > maxDrive;
                return (
                  <article className="day-card" key={day.day}>
                    <div className="day-rail"><span>D{day.day}</span><i /></div>
                    <div className="day-content">
                      <div className="day-topline">
                        <h3>{text(day.route, locale)}</h3>
                        {exceedsCap && <span className="cap-warning"><AlertTriangle size={13} /> {locale === "zh" ? "超过你的上限" : "Over your cap"}</span>}
                      </div>
                      <div className="metrics">
                        <span><Clock3 size={15} /> {copy.pureDrive} {day.driveHours}h</span>
                        <span><Gauge size={15} /> {copy.distance} {day.distanceKm}km</span>
                        <span><MountainSnow size={15} /> {copy.altitude} {day.sleepAltitude}m</span>
                      </div>
                      <p className="landscape"><MapPinned size={15} />{text(day.landscape, locale)}</p>
                      <div className="day-detail">
                        <p><b>{copy.stops}</b>{day.stops.map((stop) => text(stop, locale)).join(" · ")}</p>
                        <p><b>{copy.reason}</b>{text(day.note, locale)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="safety-callout">
          <ShieldCheck size={25} />
          <div><h2>{copy.disclaimerTitle}</h2><p>{copy.disclaimer}</p></div>
        </aside>

        <section className="sources-section" id="sources">
          <div className="section-heading wide-heading">
            <span className="step-number">02</span>
            <div><h2>{copy.sourceTitle}</h2><p>{copy.sourceIntro}</p></div>
          </div>
          <div className="source-grid">
            {sourceSummary.map((source) => (
              <article className="source-card" key={source.url}>
                <div className="source-icon"><ShieldCheck size={20} /></div>
                <h3>{text(source.agency, locale)}</h3>
                <p>{text(source.scope, locale)}</p>
                <div className="source-tags"><span>{copy.cadence}</span><span>{copy.humanReview}</span></div>
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

      <footer><span>{copy.footer}</span><span>v0.1 · 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
