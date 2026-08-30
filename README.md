# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## V0.4 scope / V0.4 范围

- Static React site deployed with GitHub Pages
- 70 selectable stops across 9 regions, including Hongyuan, Ruoergai,
  Jiuzhaigou, Huanglong, Heishui and Lianbaoyeze
- 29 planning anchors and 33 bidirectional road edges instead of fixed loops
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
- One GitHub Actions workflow: push builds/deploys; one weekly scheduled run checks
  official road and attraction entry points, validates data, tests and builds
- One stable weekly review branch and pull request instead of accumulating PRs
- Human review through pull requests before road events affect plans
- Reviewed closures exclude mapped road edges; restrictions and delays add route weight
- Per-attraction source drawer with explicit field-audit status, seasonal hints,
  opening notes, reservation notes and review date where available
- External Amap URI links for route rechecking; no embedded map SDK or visitor key
- Overnight-area comparison without individual hotel or restaurant endorsements
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

The current distance and driving-time values are manually curated comparison baselines for route
planning. They are not a licensed navigation dataset and must not be used as
turn-by-turn directions.

The unified weekly crawler writes minimal road and attraction candidates to
`data/pending-updates.json` and records source health in `data/update-status.json`.
A maintainer must verify the original official page. Road dates, impact type and
affected edge IDs must be reviewed before copying an event into
`data/reviewed-road-events.json`. Pending records never affect the planner and
never become opening-status claims automatically.

Road information is a planning baseline, not real-time navigation. Always verify
weather, traffic-control notices, and navigation immediately before departure.
Bilingual Western Sichuan self-driving trip planner
