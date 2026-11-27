import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { importSnapshot, model, openDatabase, validateSnapshot } from '../cli.ts';

const observation = { kind: 'lot', key: 'estate:1', source_url: 'https://example.org', source_date: '2026-01-01', status: 'available', price_aud: 500000 };
function snapshot(time: string, observations = [observation]): string { return JSON.stringify({ observed_at: time, observations }); }

test('imports preserve raw evidence and reject stale batches atomically', () => {
  const folder = mkdtempSync(join(tmpdir(), 'property-research-'));
  const db = openDatabase(join(folder, 'test.sqlite'));
  try {
    const raw = snapshot('2026-01-02T01:00:00Z');
    assert.equal(importSnapshot(db, raw), 1);
    assert.equal(db.prepare('SELECT raw_json FROM snapshots').get()?.raw_json, raw);
    assert.throws(() => importSnapshot(db, snapshot('2026-01-01T01:00:00Z', [{ ...observation, key: 'estate:2' }, observation])), /Stale/);
    assert.equal(db.prepare('SELECT count(*) AS count FROM observations').get()?.count, 1);
    assert.equal(importSnapshot(db, snapshot('2026-01-03T01:00:00Z', [{ ...observation, status: 'unknown' }])), 1);
    assert.throws(() => db.exec('DELETE FROM observations'), /immutable/);
    assert.equal(db.prepare('SELECT count(*) AS count FROM observations').get()?.count, 2);
  } finally { db.close(); rmSync(folder, { recursive: true, force: true }); }
});

test('rejects unsupported status, invalid dates and duplicate identities', () => {
  const create = (items: unknown[]) => ({ observed_at: '2026-01-02T01:00:00Z', observations: items });
  assert.throws(() => validateSnapshot(create([{ ...observation, status: 'disappeared' }])), /status/);
  assert.throws(() => validateSnapshot(create([{ ...observation, source_date: '2026-02-30' }])), /source_date/);
  assert.throws(() => validateSnapshot(create([observation, observation])), /Duplicate/);
});

test('calculates the upgrade gap separately from mortgage payoff', () => {
  assert.deepEqual(model({ sale_gross: 1000000, sale_costs: 25000, mortgage_balance: 300000, plans: [{ name: 'existing', purchase: 1500000, transfer_tax: 60000 }] }), {
    sale_net_before_mortgage: 975000, sale_net_after_mortgage: 675000,
    plans: [{ name: 'existing', total_cost: 1560000, upgrade_gap: 585000, cash_required_after_debt: 885000 }],
  });
  assert.throws(() => model({ sale_gross: 1, sale_costs: 0, mortgage_balance: 0, plans: [{ name: 'bad', purchase: -1 }] }), /non-negative/);
});

test('CLI imports, queries history and evaluates supplied scenarios from another directory', () => {
  const folder = mkdtempSync(join(tmpdir(), 'property-research-cli-'));
  const cli = fileURLToPath(new URL('../cli.ts', import.meta.url));
  const db = join(folder, 'research.sqlite');
  const input = join(folder, 'snapshot.json');
  const run = (...args: string[]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: folder, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  try {
    writeFileSync(input, snapshot('2026-01-02T01:00:00Z'));
    assert.match(run('import', db, input), /Imported 1 observations/);
    const latest = JSON.parse(run('latest', db));
    assert.equal(latest.length, 1);
    assert.equal(JSON.parse(latest[0].raw_json).status, 'available');
    writeFileSync(input, snapshot('2026-01-03T01:00:00Z', [{ ...observation, status: 'unknown' }]));
    run('import', db, input);
    assert.equal(JSON.parse(run('history', db, 'estate:1')).length, 2);
    const scenario = { sale_gross: 1000000, sale_costs: 25000, mortgage_balance: 300000, plans: [{ name: 'example', purchase: 1500000 }] };
    writeFileSync(input, JSON.stringify(scenario));
    assert.deepEqual(JSON.parse(run('model', input)), model(scenario));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
