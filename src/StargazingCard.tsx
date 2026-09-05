import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Moon, Sparkles, X, ExternalLink } from 'lucide-react';
import type { Locale } from './data';
import { anchorCoordinates, routeAnchors } from './data';
import type { PlanDay } from './planner';
import { calculateSky, clockMinutes, fitSkyWindows, skyTime } from './stargazing';
import type { SkyWindow } from './stargazing';
import lights from '../data/nightlights.json';

export function StargazingCard({day, locale, nextDeparture}: {day: PlanDay; locale: Locale; nextDeparture?: string}) {
  const zh = locale === 'zh';
  const t = (cn: string, en: string) => zh ? cn : en;
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(24);
  const coord = anchorCoordinates[day.endAnchorId];
  const sky = useMemo(() => {
    try { return coord ? calculateSky(day.date, coord.latitude, coord.longitude) : null; }
    catch { return null; }
  }, [day.date, coord]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, [open]);
  // Sum durations, rather than parsing the wrapped final clock, to retain midnight rollover.
  const finish = clockMinutes(day.departureTime) + day.agenda.reduce((sum, item) => sum + (clockMinutes(item.endTime)-clockMinutes(item.startTime)+1440)%1440, 0);
  const ready = finish + 90; // existing dinner ends finish+75m; another 15m for settling in
  const fit = sky ? fitSkyWindows(sky.moonFreeWindows, ready, nextDeparture) : [];
  const range = (w: SkyWindow) => `${skyTime(w.start,locale)} – ${skyTime(w.end,locale)}`;
  const ranges = (ws: SkyWindow[]) => ws.length ? ws.map(range).join(' / ') : t('此夜无满足条件的连续30分钟窗口','No qualifying 30-minute window this night');
  const node = lights.anchors[day.endAnchorId as keyof typeof lights.anchors];
  const sample = sky?.samples[Math.min(sampleIndex, sky.samples.length-1)];
  const name = routeAnchors[day.endAnchorId].name[locale];
  const status = !sky ? t('天文数据不可用','Astronomy unavailable') : !sky.coreWindows.length
    ? t('本夜无合适的银河核心窗口','No suitable core window this night') : !sky.moonFreeWindows.length
    ? t('银河核心有窗口，月光可能干扰','Core window exists; moonlight may interfere') : !fit.length
    ? t('有天文窗口，但与入住或休息安排冲突','Sky window conflicts with arrival or rest')
    : t('有少月光天文窗口 · 天气待确认','Low-moonlight window · weather unverified');
  return <section className="sky-card" aria-label={t('今晚观星','Stargazing tonight')}>
    <div className="sky-card-heading"><Moon size={19}/><div><b>{t('今晚观星','Stargazing tonight')} · {name}</b><p>{status}</p></div></div>
    {fit.length > 0 && <p className="sky-window">{ranges(fit)}</p>}
    <p className="sky-caption">{t('仅供住宿区附近观星参考，场地夜间开放与遮挡待核验。不会自动加入日程或安排夜间驾驶。','For observing near your overnight area. Night access and terrain obstruction are unverified. No activity or night drive is added automatically.')}</p>
    <div className="sky-actions"><button type="button" aria-haspopup="dialog" onClick={() => {dialog.current?.showModal(); setOpen(true);}}><Sparkles size={15}/>{t('观星详情与夜光背景','Sky details & night-light background')}</button><a href="https://www.weather.com.cn/" target="_blank" rel="noopener noreferrer">{t('官方天气查询','Official weather lookup')}<ExternalLink size={14}/></a></div>
    <dialog ref={dialog} className="sky-dialog" aria-labelledby={`sky-title-${day.day}`} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) e.currentTarget.close();}}}>
      {open && <>
        <button type="button" autoFocus className="drawer-close" aria-label={t('关闭观星详情','Close sky details')} onClick={()=>dialog.current?.close()}><X size={20}/></button>
        <p className="mini-label">NIGHT SKY / {t('夜空参考','STARGAZING')}</p>
        <h2 id={`sky-title-${day.day}`}>{name} · {t('今晚观星','Night sky')}</h2>
        <p>{day.date} → {t('次日早晨 · 全部为北京时间 UTC+8','next morning · all times China Standard Time UTC+8')}</p>
        <p className="sky-status">{status}</p>
        {sky && <>
          <dl className="sky-facts"><div><dt>{t('天文黑夜窗口','Astronomical darkness')}</dt><dd>{ranges(sky.darkWindows)}</dd></div><div><dt>{t('银河核心天文窗口','Core geometry window')}</dt><dd>{ranges(sky.coreWindows)}</dd></div><div><dt>{t('月亮在地平线下时的核心窗口','Core window with Moon below horizon')}</dt><dd>{ranges(sky.moonFreeWindows)}</dd></div><div><dt>{t('兼顾入住与休息的候选时段','Candidate window after arrival and before rest')}</dt><dd>{ranges(fit)}</dd></div><div><dt>{t('22:00 月面照明比例','Moon illumination at 22:00')}</dt><dd>{Math.round(sky.moonFraction*100)}%</dd></div><div><dt>{t('本夜月升 / 月落','Moonrise / moonset this night')}</dt><dd>{sky.moonrise === null ? '—' : skyTime(sky.moonrise,locale)} / {sky.moonset === null ? '—' : skyTime(sky.moonset,locale)}</dd></div></dl>
          <p className="sky-caption">{t('月升月落的“—”表示这个夜间区间内没有对应事件。按18:00至次日08:00每10分钟估算；太阳低于−18°、银河核心高于10°。少月光窗口另要求月亮低于−1°，并保留至少30分钟。无核心窗口不代表看不到其他银河区域。','“—” means no corresponding lunar event in this interval. Samples every 10 minutes from 18:00 to next-day 08:00; Sun below −18°, galactic core above 10°. Low-moonlight windows also require Moon below −1° and at least 30 minutes. No core window does not mean other parts of the Milky Way are invisible.')}</p>
          <section className="sky-chart-section"><h3>{t('夜间高度变化','Night-time altitude')}</h3><svg viewBox="0 0 600 235" role="img" aria-label={t('银河核心、月亮和太阳高度随北京时间的变化；下方可逐时查看数值','Core, Moon and Sun altitude by China Standard Time; inspect values with the slider below')}>
            {[-30,0,30,60,90].map(v=><g key={v}><line x1="38" x2="574" y1={190-(v+30)*1.3} y2={190-(v+30)*1.3} className="sky-grid"/><text x="4" y={194-(v+30)*1.3}>{v}°</text></g>)}
            {fit.map(w=><rect key={w.start} x={38+(w.start-1080)/840*536} y="192" width={(w.end-w.start)/840*536} height="8" className="sky-band"/>)}
            {(['core','moon','sun'] as const).map(kind=><polyline key={kind} className={`sky-line ${kind}`} points={sky.samples.map(s=>`${38+(s.minute-1080)/840*536},${190-(Math.max(-30,Math.min(90,s[kind]))+30)*1.3}`).join(' ')}/>)}
            {[1080,1320,1560,1800,1920].map(m=><text key={m} x={38+(m-1080)/840*536} y="222" textAnchor="middle">{m===1440?'00:00':`${String(Math.floor(m/60)%24).padStart(2,'0')}:00`}</text>)}
          </svg><p className="sky-legend">{t('实线：银河核心 · 虚线：月亮 · 点线：太阳 · 底部色带：候选时段','Solid: core · dashed: Moon · dotted: Sun · bottom band: candidate window')}</p>
          <label className="sky-slider">{t('查看时刻','Inspect time')}<input type="range" min="0" max={sky.samples.length-1} value={sampleIndex} onChange={e=>setSampleIndex(+e.target.value)} aria-valuetext={sample ? skyTime(sample.minute,locale) : ''}/></label>
          {sample && <p className="sky-reading" aria-live="polite">{skyTime(sample.minute,locale)} · {t('核心高度','Core altitude')} {sample.core.toFixed(0)}° · {t('方位角','Azimuth')} {sample.azimuth.toFixed(0)}° · {t('月亮高度','Moon altitude')} {sample.moon.toFixed(0)}°</p>}
          <p className="sky-caption">{t('方位角：北0°、东90°、南180°、西270°。曲线低于−30°的部分裁切显示；未模拟山体、建筑或树木遮挡。','Azimuth: N 0°, E 90°, S 180°, W 270°. Curves below −30° are clipped; mountains, buildings and trees are not modelled.')}</p></section>
        </>}
        <section className="sky-light-section"><h3>{t('夜间灯光背景 · 2025','Night-light background · 2025')}</h3>
          {node ? <div className="sky-light-bars">{(['near','surrounding'] as const).map((key,i)=> <div key={key}><span>{i===0?t('住宿节点周围0–5公里','Within 0–5 km of the overnight node'):t('周围5–15公里','Surrounding 5–15 km')}</span><b>{node[key].mean === null ? t('数据不足','Insufficient data') : node[key].mean.toFixed(2)} <small>nW/cm²/sr</small></b><div className="sky-bar-track"><i style={{width:node[key].mean === null ? '0%' : `${Math.min(100,Math.log10(1+node[key].mean)/Math.log10(101)*100)}%`}}/></div></div>)}</div> : <p>{t('此节点暂无夜光数据，不能据此判断为低光污染。','No night-light data for this node; this does not imply low light pollution.')}</p>}
          <p className="sky-caption">{t('同一固定对数刻度（0–100，超出截断），数值为区域有效像元均值。15角秒栅格约400–460米；代表历史向上辐射亮度，不是天空亮度、波特尔等级或现场照明实测。节点为区域代表坐标，不是推荐观星点。','Fixed logarithmic scale (0–100, capped); means of valid regional pixels. The 15-arcsecond grid is roughly 400–460 m. Historical upward radiance, not sky brightness, Bortle class or on-site measurements. Coordinates represent areas, not recommended observing spots.')}</p>
          <p className="sky-caption">NASA Black Marble VJ146A4 v2.0 · CC0 · {t('数据分发','Distribution')}: Jurij Stare / lightpollutionmap.info · {t('获取日期','Retrieved')} {lights.retrievedOn}. <a href={lights.sourceHelp} target="_blank" rel="noopener noreferrer">{t('来源与方法','Source & method')}</a></p>
        </section>
        <section><h3>{t('天气与夜间活动','Weather & night access')}</h3><p>{t('天气未接入。请在官方天气网站查询上述住宿地所属县市，临行与当晚再次查看最新预报和预警；周更公告不代表当晚天气。','Weather is not integrated. Search the overnight county or town on the official weather website, and recheck forecasts and warnings before travel and that evening. Weekly notices do not describe tonight’s weather.')}</p><a href="https://www.weather.com.cn/" target="_blank" rel="noopener noreferrer">{t('打开中国天气网（中文）','Open China Weather (Chinese)')} ↗</a></section>
        <p className="sky-caption">{t('候选窗口从当天行程结束90分钟后起算，给晚餐、入住留余量。','Candidate windows begin 90 minutes after the day’s agenda ends, allowing for dinner and check-in.')}{nextDeparture ? t(`按次日${nextDeparture}出发预留8小时休息间隔；这不是个人睡眠需求建议。`,`An 8-hour rest interval is reserved before next-day departure at ${nextDeparture}; this is not individual sleep advice.`) : t('末日没有次日计划，未校验次日休息间隔。','No following day is planned, so its rest interval is not checked.')}</p>
        <p className="drawer-disclaimer">{t('仅供行程参考，不保证看到银河或获得特定拍摄效果。实际条件受云雾、月光、山体遮挡、现场灯光和管理要求影响。夜间开放与步行安全须现场确认；不安排夜间山路驾驶或进入关闭景区。本说明不排除依法不能免除的责任。','Planning reference only; no guarantee of Milky Way visibility or photographic results. Clouds, moonlight, terrain, local lighting and access rules affect conditions. Confirm night access and walking safety locally; do not add mountain night drives or enter closed parks. This notice does not exclude liability that cannot legally be excluded.')}</p>
        <p className="sky-caption">{t('天文计算','Astronomy')}: <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer">Astronomy Engine 2.1.19 · MIT</a></p>
      </>}
    </dialog>
  </section>;
}
