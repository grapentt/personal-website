import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { asset } from '../app/site';
import { counterGroups, counterKey, StatsSnapshot } from '../app/counters';
import { isOptedOut, setOptedOut } from '../app/analytics';

type CounterStats = StatsSnapshot['counters'][string];
const EMPTY: CounterStats = { total: 0, weekly: 0, monthly: 0, daily: [] };
const fmt = (n: number) => n.toLocaleString('en-GB');

/** The last 30 days of a counter as a small bar chart. */
const Spark = ({ daily, until }: { daily: [string, number][]; until: Date }) => {
  const byDay = new Map(daily);
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(until);
    d.setUTCDate(d.getUTCDate() - 29 + i);
    return byDay.get(d.toISOString().slice(0, 10)) ?? 0;
  });
  const max = Math.max(1, ...days);
  return (
    <svg className="spark" viewBox="0 0 90 20" role="img" aria-label={`last 30 days, peak ${max} per day`}>
      {days.map((v, i) => (v ? <rect key={i} x={i * 3} y={20 - (18 * v) / max} width={2.2} height={(18 * v) / max} /> : <rect key={i} x={i * 3} y={19.4} width={2.2} height={0.6} className="zero" />))}
    </svg>
  );
};

/**
 * Unlisted page with the anonymous view counts (hits.sh). Not linked from anywhere and
 * not indexed; reachable at /stats. The numbers are a snapshot taken at the last deploy
 * (refreshed daily); each row links to the live numbers on hits.sh.
 */
const StatsPage = () => {
  const [snapshot, setSnapshot] = useState<StatsSnapshot | null | 'missing'>(null);
  const [optedOut, setOptedOutState] = useState(isOptedOut());

  useEffect(() => {
    fetch(asset('stats.json'), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : 'missing'))
      .then(setSnapshot)
      .catch(() => setSnapshot('missing'));
  }, []);

  const data = snapshot && snapshot !== 'missing' ? snapshot : null;
  const stats = (name: string) => data?.counters[name] ?? EMPTY;
  const until = data ? new Date(data.generatedAt) : new Date();
  const groups = counterGroups();
  const sum = (id: string, field: 'total' | 'weekly' | 'monthly', filter = (_: string) => true) =>
    groups.find((g) => g.id === id)!.counters.filter((c) => filter(c.name)).reduce((s, c) => s + stats(c.name)[field], 0);

  const tiles = [
    { label: 'Page views', value: sum('pages', 'total'), sub: `${fmt(sum('pages', 'weekly'))} this week · ${fmt(sum('pages', 'monthly'))} this month` },
    { label: 'Article views', value: sum('pages', 'total', (n) => n.startsWith('/blog/')), sub: `${fmt(sum('pages', 'weekly', (n) => n.startsWith('/blog/')))} this week` },
    { label: 'Films played', value: sum('films', 'total', (n) => n.endsWith('/play')), sub: `${fmt(sum('films', 'total', (n) => n.endsWith('/finish')))} watched to the end` },
    { label: 'CV downloads', value: stats('/event/download/cv').total, sub: `${fmt(stats('/event/download/cv').weekly)} this week` },
  ];

  const toggleOptOut = () => {
    setOptedOut(!optedOut);
    setOptedOutState(!optedOut);
  };

  return (
    <div className="container page stats-page">
      <Helmet>
        <title>Stats</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="page-header">
        <p className="eyebrow">Private · not linked</p>
        <h1>Stats</h1>
        <p className="lede">
          Anonymous counts from hits.sh: no cookies, no visitor data. Each page view and each event counts once per page view.
        </p>
        <p className="smallprint stats-meta">
          {snapshot === null && 'Loading the snapshot…'}
          {snapshot === 'missing' && 'No snapshot on this build. It is fetched at every deploy; locally, run npm run stats.'}
          {data && `Snapshot from ${until.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}, refreshed daily. Live numbers: follow the ↗ links.`}
          {data && data.failed.length > 0 && ` ${data.failed.length} counters could not be read.`}
        </p>
      </header>

      <div className="stats-tiles">
        {tiles.map((t) => (
          <div key={t.label} className="stats-tile">
            <span>{t.label}</span>
            <strong>{fmt(t.value)}</strong>
            <small>{t.sub}</small>
          </div>
        ))}
      </div>

      {groups.map((group) => (
        <section key={group.id} className="stats-group">
          <h2>{group.title}</h2>
          <div className="stats-table-wrap">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Counter</th>
                  <th className="num">Total</th>
                  <th className="num">Week</th>
                  <th className="num">Month</th>
                  <th>Last 30 days</th>
                  <th aria-label="Live" />
                </tr>
              </thead>
              <tbody>
                {group.counters.map((c) => {
                  const s = stats(c.name);
                  return (
                    <tr key={c.name} className={s.total ? undefined : 'is-zero'}>
                      <td>
                        {c.label}
                        <code>{c.name}</code>
                      </td>
                      <td className="num">{fmt(s.total)}</td>
                      <td className="num">{fmt(s.weekly)}</td>
                      <td className="num">{fmt(s.monthly)}</td>
                      <td><Spark daily={s.daily} until={until} /></td>
                      <td><a href={`https://hits.sh/${counterKey(c.name)}/`} target="_blank" rel="noreferrer" title="Live numbers on hits.sh">↗</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="stats-group">
        <h2>This browser</h2>
        <p className="smallprint">
          {optedOut ? 'Your visits from this browser are not counted.' : 'Your visits from this browser are counted like everyone else’s.'}{' '}
          <button type="button" className="button" onClick={toggleOptOut}>
            {optedOut ? 'Count my visits again' : 'Don’t count my visits'}
          </button>
        </p>
      </section>
    </div>
  );
};

export default StatsPage;
