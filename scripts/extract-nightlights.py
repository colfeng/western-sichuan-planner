"""Offline extraction: python3 scripts/extract-nightlights.py TIFF anchors.json output.json.
Dependencies: rasterio, numpy. Input is the raw, unscaled NASA Black Marble
AllAngle_Composite_Snow_Free GeoTIFF mirror documented in DATA_LICENSES.md.
Never downloads map tiles; never runs in the weekly announcement workflow.
"""
import hashlib
import json
import math
import sys
from datetime import datetime, timezone
import numpy as np
import rasterio
from rasterio.windows import from_bounds

raster_path, anchors_path, output_path = sys.argv[1:]
with open(anchors_path) as f:
    anchors = json.load(f)
records = {}
with rasterio.open(raster_path) as ds:
    if ds.crs.to_epsg() != 4326 or ds.scales != (1.0,):
        raise ValueError('Expected unscaled WGS84 raw raster')
    for key, p in anchors.items():
        lat, lon = p['latitude'], p['longitude']
        dy, dx = 15 / 111.32, 15 / (111.32 * math.cos(math.radians(lat)))
        win = from_bounds(lon-dx, lat-dy, lon+dx, lat+dy, ds.transform).round_offsets().round_lengths()
        values = ds.read(1, window=win, masked=True)
        row, col = np.indices(values.shape)
        tr = ds.window_transform(win)
        x = tr.c + (col+.5)*tr.a
        y = tr.f + (row+.5)*tr.e
        distance = np.sqrt(((x-lon)*111.32*math.cos(math.radians(lat)))**2 + ((y-lat)*111.32)**2)
        valid = ~np.ma.getmaskarray(values) & np.isfinite(values.data) & (values.data >= 0)
        entry = dict(p)
        for label, region in [('near', distance <= 5), ('surrounding', (distance > 5) & (distance <= 15))]:
            selected = values.data[region & valid]
            coverage = float(np.count_nonzero(region & valid) / max(1,np.count_nonzero(region)))
            entry[label] = {'mean': round(float(selected.mean()),3) if coverage >= .8 else None,
                            'coverage': round(coverage,3), 'pixels': int(selected.size)}
        records[key] = entry
    resolution = abs(ds.transform.a)
hash_value = hashlib.file_digest(open(raster_path,'rb'),'sha256').hexdigest()
result = {'schemaVersion':1,'year':2025,'product':'NASA Black Marble VJ146A4 v2.0 · AllAngle_Composite_Snow_Free',
 'unit':'nW/cm²/sr','resolutionDegrees':resolution,'sourceUrl':'https://www2.lightpollutionmap.info/data/v2/viirs_2025_raw.zip',
 'sourceHelp':'https://www.lightpollutionmap.info/help.html','license':'CC0-1.0 (NASA source data)',
 'credit':'NASA Black Marble; raw GeoTIFF distribution: Jurij Stare, lightpollutionmap.info',
 'retrievedOn':'2026-09-05','processedAt':datetime.now(timezone.utc).isoformat(), 'rasterSha256':hash_value,
 'method':'Area pixel mean within 0–5 km and 5–15 km circles around approximate planner nodes; negative/nodata excluded; >=80% valid coverage required. Not sky brightness or Bortle.',
 'anchors':records}
with open(output_path,'w') as f:
    json.dump(result,f,ensure_ascii=False,indent=2,allow_nan=False)
    f.write('\n')
print(f'Extracted {len(records)} nodes')
