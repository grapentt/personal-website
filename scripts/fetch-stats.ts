// Fetch a snapshot of every view counter from hits.sh into public/stats.json, for the
// unlisted /stats page. Runs in the deploy workflow (and daily on a schedule). It never
// fails the build: a counter that cannot be read is listed in `failed`.
// Run with `npm run stats`.

import { writeFileSync } from 'node:fs';
import { counterGroups, counterKey, StatsSnapshot } from '../src/app/counters';

interface UrnResponse {
  total?: number;
  weekly?: number;
  monthly?: number;
  items?: { data: { day: string; value: number }[] }[];
}

const snapshot: StatsSnapshot = { generatedAt: new Date().toISOString(), counters: {}, failed: [] };
const names = counterGroups().flatMap((g) => g.counters.map((c) => c.name));

await Promise.all(names.map(async (name, i) => {
  await new Promise((r) => setTimeout(r, 60 * i)); // be gentle with a free service
  try {
    const response = await fetch(`https://hits.sh/api/urns/${counterKey(name)}`, { headers: { accept: 'application/json' } });
    if (response.status === 404) {
      snapshot.counters[name] = { total: 0, weekly: 0, monthly: 0, daily: [] }; // never counted yet
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as UrnResponse;
    const daily = new Map<string, number>();
    for (const item of data.items ?? []) for (const { day, value } of item.data) daily.set(day, value);
    snapshot.counters[name] = {
      total: data.total ?? 0,
      weekly: data.weekly ?? 0,
      monthly: data.monthly ?? 0,
      daily: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-90),
    };
  } catch (err) {
    snapshot.failed.push(name);
    console.warn(`could not read ${name}:`, (err as Error).message);
  }
}));

writeFileSync(new URL('../public/stats.json', import.meta.url), JSON.stringify(snapshot));
console.info(`stats.json: ${Object.keys(snapshot.counters).length} counters, ${snapshot.failed.length} failed`);
