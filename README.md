# Western Sichuan Planner / 川西自驾规划器

A bilingual, safety-first self-driving itinerary planner for Western Sichuan.

一个中英双语、以安全约束为核心的川西自驾行程规划器。

## V0.8.1 scope / V0.8.1 范围

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
