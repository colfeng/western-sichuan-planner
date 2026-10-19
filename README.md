# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## V0.9.0 scope / V0.9.0 范围

- Static React site deployed with GitHub Pages
- 142 selectable stops across 10 regions, including Hongyuan, Ruoergai,
  Jiuzhaigou, Huanglong, Lianbaoyeze and Daocheng Yading
- 34 planning anchors and 40 bidirectional road edges instead of fixed loops
- User-selectable start and end anchors, planned daily departure time, estimated
  finish time and a per-day sunset safety margin
- Graph-based route connection with a user-lockable must-see order
- Browser-side constraint planner: must-see places, trip length, daily driving cap,
  date-specific daylight window, altitude gain, activity time, vehicle type,
  EV range, and viable overnight nodes
- Three explainable alternatives: comfort, scenery, and culture
- Explicit conflict messages instead of silently dropping must-see places
- Chinese and English interface
- Curated route graph and explainable planning rules
- One GitHub Actions workflow: pushes to `main` build/deploy; one weekly scheduled
  run checks official road and attraction entry points, validates data, tests and
  opens or updates a review pull request without deploying unmerged data
- One stable weekly review branch and pull request instead of accumulating PRs
- Human review through pull requests before road events affect plans
- Reviewed closures exclude mapped road edges; restrictions and delays add route weight
- Compatible short stops can share a day; full-day attractions remain protected
  from being over-packed
- Optional en-route suggestions fill safe free time only when the stop lies on the
  computed route, matches the season/theme and leaves a usable daily buffer
- Every day shows an ordered road sequence with road name, baseline distance and
  time; the sequence is explicitly not presented as a geographic map
- A chronological breakfast-to-check-in agenda separates morning and afternoon
  driving, visits, formal rests, lunch, dinner and the overnight area
- The hero uses original project-authored SVG artwork with documented provenance;
  earlier raster files with undocumented provenance are no longer distributed
- Every attraction has aligned season, opening, review-date and official-source
  fields; reservation guidance appears only when a reservation or permission
  requirement has been identified
- Public towns, villages and roadside stops are explicitly distinguished from
  managed scenic areas instead of inventing ticket or opening-hour claims
- External Amap URI links for route rechecking; no embedded map SDK or visitor key
- Each day names an overnight town/area, meal location, formal rest points and
  lodging criteria without endorsing an individual hotel or restaurant
- Rest, meal and planned EV charging time are included in the daylight and
  finish-time calculation and shown as separate chronological roadbook entries
- Government-published road rest areas are mapped to route segments
- A weekly ODbL-attributed OpenStreetMap/Overpass snapshot discovers fuel,
  charging, toilet and medical facilities
- EV plans split each day into battery legs and name every required charging town.
  A day is blocked when no reachable charging town fits the conservative budget;
  snapshot candidates remain explicitly unverified until checked live
- A keyboard-accessible side drawer shows a schematic route-node elevation
  profile, planned attraction exposure altitude, daily drive/visit/rest/charge
  allocation and sleeping-altitude progression; it is explicitly not continuous
  terrain or navigation-grade elevation
- Road notices receive suggested edge IDs, impact type, dates and confidence;
  human review is still mandatory before a notice changes a route
- Local save, shareable URL, printing and browser PDF export
- No account, comments, payment, or real-time-navigation claims

## Local development / 本地开发

```bash
npm install
npm run dev
```

## Production build / 生产构建

```bash
npm run build
```

## Planner tests / 规划算法测试

```bash
npm test
```

The current distance values are manually curated comparison baselines. Displayed
driving times add a 10–20% road-planning margin before breaks, but remain estimates,
not a licensed navigation dataset or turn-by-turn directions.

The unified weekly crawler writes minimal road and attraction candidates to
`data/pending-updates.json` and records source health in `data/update-status.json`.
A maintainer must verify the original official page. The crawler suggests dates,
impact type and affected edge IDs, but they must be reviewed before copying an event into
`data/reviewed-road-events.json`. Pending attraction records may be displayed as
clearly labelled, unreviewed official-update links only after the weekly review
pull request is merged, but never affect routes or become opening-status claims automatically. The Ngawa road feed keeps only
links dated within the last 180 days when a publication date can be read, so an
archive page cannot refill the review pull request with stale notices.
Empty official pages, empty Overpass results and suspiciously large facility-count
drops preserve the previous snapshot instead of silently replacing it. Candidates
missing from one otherwise successful weekly response remain for a 21-day grace
period, and an open weekly review PR is used as the next run's starting snapshot.
Attraction notices are displayed only when the crawler suggests an explicit
attraction ID; county-wide notices are not attached by shared domain. The newest
applicable publication wins, and date-specific capacity notices expire.

The facility snapshot in `data/osm-service-points.json` is derived from
OpenStreetMap and remains subject to ODbL 1.0. Presence in the snapshot is not a
claim that a business is open, a charger is working, or a connector is free.
See `DATA_LICENSES.md`.

Road information is a planning baseline, not real-time navigation. Always verify
weather, traffic-control notices, and navigation immediately before departure.
Bilingual Western Sichuan self-driving trip planner

### V0.9.0 观星参考 / Stargazing

每日日程的住宿安排后可打开“今晚观星”。本地计算黑夜与银河核心窗口、
月光条件和方向，并显示2025年NASA夜光区域比较。跨午夜标为次日，全部使用
北京时间。候选窗口考虑晚餐入住和次日休息间隔；它不会自动增加夜间活动或
改变驾驶路线。抽屉支持键盘、Escape关闭、焦点恢复和手机布局。
天气仅提供官方查询入口，不宣称当晚适合观星；夜间场地开放、遮挡须现场核验。
详见 DATA_LICENSES.md。周更任务保持不变，不重新下载年度夜光大文件。

### 周更维护 / Weekly maintenance

周任务仍为每周一一次；GitHub 调度可能延迟，页面显示实际检查时间。
可在 Actions 中选择本流水线，Run workflow，并勾选 refresh_data 立即补跑。
维护工具也可以将 `automation/run-weekly-refresh` 推进到包含当前 main 的新提交，
复用同一个抓取、校验、测试和审核 PR 流程；它不会直接部署或自动批准封路建议。
失败时可下载 `weekly-data-snapshot` 查看本次候选、来源检查与设施快照，保留14天。
旧数据会迁移到当前字段格式；测试时钟与生产日期分离，避免样例公告过期导致整个周任务停止。

纯粹修改上述三份自动快照文件的 PR 不重复启动另一轮检查；机器人创建的
PR 检查需要 GitHub 人工批准，容易在等待中到期。完整抓取、数据校验、测试和
构建已在生成该 PR 的原任务中完成，合并后 main 仍再次校验并部署。
任何代码、配置或其他文件变化仍执行 PR 检查。手工数据 PR 也遵循同一文件过滤，
审核时应查看生成它的周任务结果；未经验证的手工修改需先本地校验。
