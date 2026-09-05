import * as Astronomy from 'astronomy-engine';

export type SkySample = { minute: number; sun: number; moon: number; core: number; azimuth: number };
export type SkyWindow = { start: number; end: number };
const STEP = 10;
export function clockMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || +match[1] > 23 || +match[2] > 59) throw new Error('Invalid clock time');
  return +match[1] * 60 + +match[2];
}
export function skyTime(minute: number, locale: 'zh' | 'en'): string {
  const value = Math.round(minute);
  const days = Math.floor(value / 1440);
  const clock = `${String(Math.floor(value / 60) % 24).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  return `${days > 0 ? (locale === 'zh' ? '次日 ' : 'Next day ') : ''}${clock}`;
}
// Both interval endpoints must satisfy the criterion. Ten-minute sampling is
// deliberately conservative; it does not claim minute-accurate visibility.
export function skyWindows(samples: SkySample[], predicate: (sample: SkySample) => boolean): SkyWindow[] {
  const windows: SkyWindow[] = [];
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i], b = samples[i + 1];
    if (!predicate(a) || !predicate(b)) continue;
    const previous = windows.at(-1);
    if (previous?.end === a.minute) previous.end = b.minute;
    else windows.push({ start: a.minute, end: b.minute });
  }
  return windows.filter(w => w.end - w.start >= 30);
}
export function fitSkyWindows(windows: SkyWindow[], readyMinute: number, nextDeparture?: string): SkyWindow[] {
  // Eight hours is an itinerary buffer, not an individual medical sleep requirement.
  const latest = nextDeparture ? 1440 + clockMinutes(nextDeparture) - 8 * 60 : 32 * 60;
  return windows.map(w => ({ start: Math.max(w.start, Math.ceil(readyMinute / STEP) * STEP), end: Math.min(w.end, Math.floor(latest / STEP) * STEP) }))
    .filter(w => w.end - w.start >= 30);
}
export function calculateSky(date: string, latitude: number, longitude: number) {
  const base = Date.parse(`${date}T00:00:00+08:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(base) || new Date(base + 8 * 3600000).toISOString().slice(0,10) !== date
    || !Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw new Error('Invalid sky input');
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const at = (minute: number) => new Date(base + minute * 60000);
  const samples: SkySample[] = [];
  for (let minute = 18 * 60; minute <= 32 * 60; minute += STEP) {
    const instant = at(minute);
    const sunEq = Astronomy.Equator(Astronomy.Body.Sun, instant, observer, true, true);
    const moonEq = Astronomy.Equator(Astronomy.Body.Moon, instant, observer, true, true);
    // Galactic l=0,b=0 transformed from J2000 to equator-of-date before Horizon.
    const coreJ2000 = Astronomy.RotateVector(Astronomy.Rotation_GAL_EQJ(), Astronomy.VectorFromSphere(new Astronomy.Spherical(0, 0, 1), instant));
    const coreEq = Astronomy.EquatorFromVector(Astronomy.RotateVector(Astronomy.Rotation_EQJ_EQD(instant), coreJ2000));
    const core = Astronomy.Horizon(instant, observer, coreEq.ra, coreEq.dec);
    samples.push({ minute, sun: Astronomy.Horizon(instant, observer, sunEq.ra, sunEq.dec).altitude,
      moon: Astronomy.Horizon(instant, observer, moonEq.ra, moonEq.dec).altitude, core: core.altitude, azimuth: core.azimuth });
  }
  const geometry = (s: SkySample) => s.sun <= -18 && s.core >= 10;
  const event = (direction: number) => {
    const found = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, direction, at(18 * 60), 14 / 24);
    return found ? Math.round((found.date.getTime() - base) / 60000) : null;
  };
  return { samples, darkWindows: skyWindows(samples, s => s.sun <= -18), coreWindows: skyWindows(samples, geometry),
    moonFreeWindows: skyWindows(samples, s => geometry(s) && s.moon <= -1),
    moonFraction: Astronomy.Illumination(Astronomy.Body.Moon, at(22 * 60)).phase_fraction,
    moonrise: event(1), moonset: event(-1) };
}
