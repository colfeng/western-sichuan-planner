# Data licences and provenance

## Original interface artwork

`public/images/western-sichuan-original.svg` is original vector artwork created
specifically for this repository on 2026-08-31 from geometric SVG paths. It
does not contain a copied photograph, map tile, third-party logo, font, or
stock-asset component. Copyright © 2026 colfeng. The two earlier raster files
with undocumented provenance were removed in V0.8.1 and are not distributed by
the site.

## OpenStreetMap facility snapshot

`data/osm-service-points.json` is a weekly, minimal extract derived from
OpenStreetMap through Overpass API. It contains only the object identifier,
facility type, coordinates, a name when supplied, nearest planner anchor and a
link to the original object.

- Data: © OpenStreetMap contributors
- Licence: Open Data Commons Open Database License 1.0 (ODbL)
- Attribution and licence information: https://www.openstreetmap.org/copyright

Downstream reuse of this extract must preserve the attribution and comply with
ODbL. The website does not claim live opening, charger availability, connector
compatibility or data completeness.

## Government road-service points

`data/official-service-points.json` is a manually structured list of names,
road kilometre markers and stated service types from an official Ngawa
Prefecture Government road-condition notice. The repository stores structured
facts and the source URL, not the article body or images.

## Attraction and road notices

Attraction records retain an official source URL. The weekly notice crawler
stores titles, URLs, discovery time and machine-generated mapping suggestions;
it does not republish complete articles. Machine suggestions require human
review before affecting a route.

Attraction notices carry explicit suggested attraction IDs. A notice discovered
on a county-wide or source-wide page is not displayed on an individual
attraction merely because it shares the same government domain. Date-specific
capacity notices may also carry an expiry date and disappear from the public
detail view automatically; this does not substitute for a same-day official
check.

## V0.9.0 night-light background

`data/nightlights.json` is an offline numeric extract of NASA Black Marble
VJ146A4 v2.0, AllAngle_Composite_Snow_Free, annual 2025. Downloaded 2026-09-05
from the raw GeoTIFF distribution explicitly linked in FAQ 30 at
https://www.lightpollutionmap.info/help.html:
https://www2.lightpollutionmap.info/data/v2/viirs_2025_raw.zip
Attribution: NASA Black Marble; raw GeoTIFF distribution by Jurij Stare,
lightpollutionmap.info. NASA source data: CC0-1.0. No website map tiles, styled
sky-brightness model, screenshots, commercial basemap, or user observations are
included. NASA data-use guidance:
https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance

The JSON records the source TIFF SHA-256, unit, 15-arcsecond resolution, year,
method and valid-pixel coverage. `scripts/extract-nightlights.py` reproduces
0–5 km and 5–15 km pixel means around the existing approximate planner coordinates.
Export coordinates with `node --input-type=module -e "import {anchorCoordinates}
from './src/data.ts'; console.log(JSON.stringify(anchorCoordinates))"` to a JSON
file, then run the Python script with TIFF, coordinates JSON and output JSON paths.
The script requires rasterio and numpy; these are offline processing dependencies,
not runtime or weekly crawler dependencies. Less than 80% coverage yields null,
not zero. The snapshot is not a Bortle scale, sky brightness, live measurement,
or a recommendation to enter a particular site. An annual source release is
manually reviewed before replacing this static file.

## Local astronomy and weather links

Astronomy Engine 2.1.19, Copyright (c) 2019–2023 Don Cross, MIT licence.
The complete upstream notice is distributed as `public/astronomy-engine-LICENSE.txt`
alongside the production JavaScript bundle. No external astronomy API is
called. Galactic l=0,b=0 is transformed J2000 → equator of date → local horizon;
all trip times use fixed China Standard Time (UTC+8). Coordinates are regional
planner nodes; local terrain, trees, buildings and refraction are not modelled
for the sampled curves. Moonrise/set are library horizon estimates. Ten-minute
sampling, minimum 30-minute windows, Sun ≤−18°, core ≥10°, and optionally Moon
≤−1° are transparent planning criteria, not calibrated visibility probabilities.

Weather is only a standard outbound link to https://www.weather.com.cn/.
No forecasts, warnings, weather imagery or commercial API responses are scraped,
rehosted or embedded by this feature. No visitor geolocation is requested.
