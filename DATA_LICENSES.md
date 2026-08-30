# Data licences and provenance

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
