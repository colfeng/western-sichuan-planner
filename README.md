# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## Phase 1 scope / 第一阶段范围

- Static React site deployed with GitHub Pages
- Browser-side itinerary planning
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

Road information is a planning baseline, not real-time navigation. Always verify
weather, traffic-control notices, and navigation immediately before departure.
Bilingual Western Sichuan self-driving trip planner
