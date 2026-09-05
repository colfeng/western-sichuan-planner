import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { calculateSky, fitSkyWindows, skyTime } from '../src/stargazing.ts';
import { anchorCoordinates } from '../src/data.ts';

test('sky times explicitly preserve midnight and use the trip timezone', () => {
  assert.equal(skyTime(1470,'zh'),'次日 00:30');
  assert.equal(skyTime(1440,'en'),'Next day 00:00');
  const old = process.env.TZ;
  try {
    process.env.TZ='America/Los_Angeles'; const a=calculateSky('2026-09-10',32.9,101.7);
    process.env.TZ='Asia/Shanghai'; const b=calculateSky('2026-09-10',32.9,101.7);
    assert.deepEqual(a,b);
  } finally { if(old===undefined) delete process.env.TZ; else process.env.TZ=old; }
});
test('arrival after midnight and next-day rest can remove a nominal window',()=>{
  const windows=[{start:1380,end:1500},{start:1740,end:1830}];
  assert.deepEqual(fitSkyWindows(windows,1450,'08:30'),[]); // only 20 minutes left before rest
  assert.deepEqual(fitSkyWindows(windows,1380,'08:30'),[{start:1380,end:1470}]);
  assert.deepEqual(fitSkyWindows(windows,1500),[{start:1740,end:1830}]);
});
test('known eclipse dates have the expected lunar illumination',()=>{
  assert.ok(calculateSky('2024-04-08',30.57,104.07).moonFraction < .01);
  assert.ok(calculateSky('2024-03-25',30.57,104.07).moonFraction > .99);
});
test('winter core is near the Sun, rather than an all-year night recommendation',()=>{
  assert.equal(calculateSky('2026-12-15',32.9,101.7).coreWindows.length,0);
  assert.ok(calculateSky('2026-09-10',32.9,101.7).moonFreeWindows.length > 0);
});
test('all route nodes and seasons produce finite angles and qualifying windows',()=>{
  for(const p of Object.values(anchorCoordinates)) for(const date of ['2026-03-15','2026-06-15','2026-09-15','2026-12-15']) {
    const sky=calculateSky(date,p.latitude,p.longitude);
    for(const s of sky.samples) {
      for(const k of ['sun','moon','core'] as const) assert.ok(Number.isFinite(s[k]) && Math.abs(s[k])<=90);
      assert.ok(s.azimuth>=0 && s.azimuth<=360);
    }
    for(const w of sky.moonFreeWindows) {
      assert.ok(w.end-w.start>=30);
      for(const s of sky.samples.filter(s=>s.minute>=w.start&&s.minute<=w.end)) assert.ok(s.sun<=-18&&s.moon<=-1&&s.core>=10);
    }
    for(const event of [sky.moonrise,sky.moonset]) if(event!==null) assert.ok(event>=1080&&event<=1920);
  }
});
test('invalid dates and coordinates fail instead of fabricating an estimate',()=>{
  assert.throws(()=>calculateSky('2026-02-30',32,102));
  assert.throws(()=>calculateSky('2026-09-10',NaN,102));
  assert.throws(()=>calculateSky('2026-09-10',32,999));
});
test('night-light snapshot covers coordinates without converting nodata to darkness',()=>{
  const data=JSON.parse(readFileSync(new URL('../data/nightlights.json',import.meta.url),'utf8'));
  assert.equal(data.schemaVersion,1);
  assert.match(data.rasterSha256,/^[a-f0-9]{64}$/);
  for(const [id,p] of Object.entries(anchorCoordinates)) {
    const item=data.anchors[id]; assert.ok(item,`missing ${id}`);
    assert.equal(item.longitude,p.longitude); assert.equal(item.latitude,p.latitude);
    for(const key of ['near','surrounding']) {
      const v=item[key]; assert.ok(v.coverage>=0 && v.coverage<=1);
      if(v.coverage<.8) assert.equal(v.mean,null);
      else assert.ok(Number.isFinite(v.mean)&&v.mean>=0&&v.pixels>0);
    }
  }
});
