# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## V0.3 scope / V0.3 范围

- Static React site deployed with GitHub Pages
- 55 selectable stops across 8 regions, including Hongyuan, Ruoergai,
  Jiuzhaigou, Huanglong and Lianbaoyeze
- 28 planning anchors and 31 bidirectional road edges instead of two fixed loops
- Graph-based route connection with a user-lockable must-see order
- Browser-side constraint planner: must-see places, trip length, daily driving cap,
  date-specific daylight window, altitude gain, activity time, vehicle type,
  EV range, and viable overnight nodes
- Three explainable alternatives: comfort, scenery, and culture
- Explicit conflict messages instead of silently dropping must-see places
- Chinese and English interface
- Curated route graph and explainable planning rules
- Weekly official-road-notice discovery through GitHub Actions
- Human review through pull requests before road events affect plans
- Reviewed closures exclude mapped road edges; restrictions and delays add route weight
- Official-source links, seasonal hints and reservation notes for major new attractions
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

The weekly crawler only writes minimal candidate records to
`data/pending-events.json`. A maintainer must verify the official source, dates,
impact type and affected road-edge IDs before copying a record into
`data/reviewed-road-events.json`. Pending records never affect the planner.

Road information is a planning baseline, not real-time navigation. Always verify
weather, traffic-control notices, and navigation immediately before departure.
Bilingual Western Sichuan self-driving trip planner
