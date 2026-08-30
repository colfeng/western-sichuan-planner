# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## V0.2 scope / V0.2 范围

- Static React site deployed with GitHub Pages
- 36 selectable stops across the Chengdu–Wolong–Mount Siguniang–Danba corridor
- Optional Tagong–Xinduqiao–Kangding grand loop
- Browser-side constraint planner: must-see places, trip length, daily driving cap,
  daylight window, altitude gain, activity time, and viable overnight nodes
- Three explainable alternatives: comfort, scenery, and culture
- Explicit conflict messages instead of silently dropping must-see places
- Chinese and English interface
- Curated route graph and explainable planning rules
- Weekly official-road-notice discovery through GitHub Actions
- Human review through pull requests before road events affect plans
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

The current distance and driving-time values are comparison baselines for route
planning. They are not a licensed navigation dataset and must not be used as
turn-by-turn directions.

Road information is a planning baseline, not real-time navigation. Always verify
weather, traffic-control notices, and navigation immediately before departure.
Bilingual Western Sichuan self-driving trip planner
