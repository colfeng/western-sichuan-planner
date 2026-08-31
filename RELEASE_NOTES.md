# Release notes

## V0.7.1 — clearer drive and visit timelines

- Attraction detours are now shown as separate outbound drive, visit and return
  drive blocks instead of hiding branch-road time inside the visit.
- Lunch is scheduled at the route anchor before a long attraction detour when
  appropriate, avoiding implausible back-and-forth timeline displays.
- Road legs longer than about two hours now place the planned rest along the
  route and visibly continue the drive afterwards, rather than resting only on arrival.

## V0.7.0 — executable timelines, EV legs, and Daocheng Yading

- A visit split by lunch now shows the duration of each timeline segment and the
  attraction's single full-day total, so it can no longer look like two complete visits.
- EV cards list each battery leg and every required charging town. Days with no
  reachable charging node are blocked; unverified charger candidates are labelled.
- Displayed driving time now adds a 10–20% planning margin by road type before
  meal and rest breaks.
- Weekly attraction checks can deploy display-only official-update links with an
  explicit unreviewed/not-real-time label. They never alter route feasibility.
- Added the Yajiang–Litang–Daocheng–Shangri-La Town–Yading corridor and eight
  officially sourced Daocheng-area stops, bringing the catalogue to 123.
- The information-use notice now covers crawler delay, charger availability and
  non-excludable legal responsibility.

## V0.6.3 — road-baseline calibration

- Recalibrated the simplified road graph against published G4217, G4218, G544, G0615 and related corridor mileages available on 2026-08-31.
- Removed obsolete distance inflation on the Wenchuan–Barkam, northern grassland, Jiuzhaigou and western loop corridors while keeping meals, rest and live road controls separate.
- Added the opened Lixiao Road and the Hongyuan–Ngawa County corridor so plans no longer make obsolete detours through Wenchuan or Barkam.
- Fixed long, lightly filled itineraries incorrectly reporting no route when they only needed additional rest days at valid overnight nodes.
- Added corridor-range, geometry and seven-scenario network regression tests without changing the page layout.

## V0.6.2 — rest and meal scheduling

- Lunch now substitutes for one short driving break instead of duplicating it.
- Adjacent rest and meal blocks at the same place are merged into one stop.
- Consecutive short rest blocks are shown as one continuous rest period.

## V0.6.1 — English mobile layout

- Long English version, route, status and lodging text can wrap without forcing
  horizontal overflow.
- The English mobile header keeps the brand and language switch separated down
  to 320 px.
- English hero typography, daily timelines, result statistics, support panel
  and footer use compact phone-specific layouts.

## V0.6.0 — daily route clarity and en-route suggestions

- 115 selectable attractions, including 15 additional officially listed stops in
  Aba Prefecture.
- A broken pseudo-map-style connector was replaced by a per-day ordered road
  sequence showing actual planner edges, road labels, baseline kilometres and
  driving hours.
- A breakfast-to-check-in timeline clearly separates morning and afternoon
  driving, visits, formal rests, lunch, dinner and lodging area.
- Optional en-route suggestions now fill genuinely usable free time while
  respecting season, theme, daily activity, attraction-count and buffer limits.
- Must-see and automatically suggested attractions are labelled separately in
  both the overview and each day's reasoning.
- The Mount Siguniang hero image now uses a compatible local JPEG and descriptive
  alternative text.

## V0.5.0 — readable roadbooks and service data

- 100 selectable attractions, with Lianbaoyeze in the key-place quick picker.
- Reservation guidance is shown only for attractions with an identified booking
  or permission requirement.
- Compatible short attractions may share one day; full-day attractions remain
  protected from over-packing.
- Daily plans now state activities, formal road rest points, meal location,
  overnight town/area and lodging-selection criteria.
- Rest and meal time are included in finish-time and daylight calculations.
- EV days show a conservative range budget, charging-time estimate, target town,
  fallback node and external live-check links.
- 22 government-published road service points are mapped to route edges.
- One weekly job also refreshes an attributed OpenStreetMap facility snapshot.
- Road notices receive machine-generated segment/impact candidates, but human
  review remains mandatory before any route is changed.
- The Ngawa road source uses its latest listing and excludes detectably stale
  archive links before they enter the review queue.
