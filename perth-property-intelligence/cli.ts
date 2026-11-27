import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

type Observation = { kind: string; key: string; source_url: string; source_date: string; status: string; price_aud?: number; area_sqm?: number; [key: string]: unknown };
type Snapshot = { observed_at: string; observations: Observation[] };

function fail(message: string): never { throw new Error(message); }
function validDate(value: unknown): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?Z$/.test(value) && validDate(value.slice(0, 10)) && !Number.isNaN(Date.parse(value));
}
function number(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) fail(`${label} must be a finite non-negative number`);
  return value;
}
function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} is required`);
  return value;
}
export function validateSnapshot(value: unknown): Snapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Snapshot must be an object');
  const snapshot = value as Snapshot;
  if (!validTimestamp(snapshot.observed_at)) fail('observed_at must be a UTC ISO timestamp');
  if (!Array.isArray(snapshot.observations) || snapshot.observations.length === 0) fail('observations must be a non-empty array');
  const identities = new Set<string>();
  for (const o of snapshot.observations) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) fail('Invalid observation');
    if (!['market', 'lot'].includes(o.kind)) fail('kind must be market or lot');
    text(o.key, 'key');
    const identity = JSON.stringify([o.kind, o.key]);
    if (identities.has(identity)) fail('Duplicate observation identity');
    identities.add(identity);
    try { const url = new URL(text(o.source_url, 'source_url')); if (!['http:', 'https:'].includes(url.protocol)) fail('source_url must be HTTP(S)'); } catch { fail('source_url must be HTTP(S)'); }
    if (!validDate(o.source_date)) fail('source_date must be a valid date');
    if (o.source_date > snapshot.observed_at.slice(0, 10)) fail('source_date is later than observed_at');
    if (!['available', 'reserved', 'under_offer', 'sold', 'withdrawn', 'unknown'].includes(o.status)) fail('Invalid status');
    for (const field of ['price_aud', 'area_sqm', 'frontage_m', 'depth_m']) if (o[field] !== undefined) number(o[field], field);
    if (o.value !== undefined && (typeof o.value !== 'number' || !Number.isFinite(o.value))) fail('value must be a finite number');
  }
  return snapshot;
}
export function openDatabase(path: string): DatabaseSync {
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS snapshots (id INTEGER PRIMARY KEY, observed_at TEXT NOT NULL, sha256 TEXT NOT NULL UNIQUE, raw_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS observations (id INTEGER PRIMARY KEY, snapshot_id INTEGER NOT NULL REFERENCES snapshots(id), kind TEXT NOT NULL, key TEXT NOT NULL, observed_at TEXT NOT NULL, raw_json TEXT NOT NULL, UNIQUE(kind, key, observed_at));
    CREATE INDEX IF NOT EXISTS observations_identity ON observations(kind, key, observed_at);
    CREATE TRIGGER IF NOT EXISTS no_snapshot_update BEFORE UPDATE ON snapshots BEGIN SELECT RAISE(ABORT, 'snapshots are immutable'); END;
    CREATE TRIGGER IF NOT EXISTS no_snapshot_delete BEFORE DELETE ON snapshots BEGIN SELECT RAISE(ABORT, 'snapshots are immutable'); END;
    CREATE TRIGGER IF NOT EXISTS no_observation_update BEFORE UPDATE ON observations BEGIN SELECT RAISE(ABORT, 'observations are immutable'); END;
    CREATE TRIGGER IF NOT EXISTS no_observation_delete BEFORE DELETE ON observations BEGIN SELECT RAISE(ABORT, 'observations are immutable'); END;`);
  return db;
}
export function importSnapshot(db: DatabaseSync, raw: string): number {
  const snapshot = validateSnapshot(JSON.parse(raw));
  const timestamp = new Date(snapshot.observed_at).toISOString();
  const digest = createHash('sha256').update(raw).digest('hex');
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const o of snapshot.observations) {
      const latest = db.prepare('SELECT observed_at FROM observations WHERE kind = ? AND key = ? ORDER BY observed_at DESC LIMIT 1').get(o.kind, o.key);
      if (latest && timestamp <= String(latest.observed_at)) fail(`Stale or conflicting observation: ${o.kind}/${o.key}`);
    }
    const row = db.prepare('INSERT INTO snapshots (observed_at, sha256, raw_json) VALUES (?, ?, ?)').run(timestamp, digest, raw);
    const insert = db.prepare('INSERT INTO observations (snapshot_id, kind, key, observed_at, raw_json) VALUES (?, ?, ?, ?, ?)');
    for (const o of snapshot.observations) insert.run(row.lastInsertRowid, o.kind, o.key, timestamp, JSON.stringify(o));
    db.exec('COMMIT');
    return snapshot.observations.length;
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function model(input: unknown): object {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Model must be an object');
  const data = input as Record<string, unknown>;
  const gross = number(data.sale_gross, 'sale_gross');
  const saleCosts = number(data.sale_costs, 'sale_costs');
  const mortgage = number(data.mortgage_balance, 'mortgage_balance');
  if (!Array.isArray(data.plans) || data.plans.length === 0) fail('plans must be a non-empty array');
  const plans = data.plans.map((p: unknown) => {
    if (!p || typeof p !== 'object' || Array.isArray(p)) fail('Invalid plan');
    const plan = p as Record<string, unknown>;
    const name = text(plan.name, 'plan name');
    if (!Object.hasOwn(plan, 'purchase')) fail('purchase is required');
    let total = 0;
    for (const [key, value] of Object.entries(plan)) if (key !== 'name') total += number(value, key);
    return { name, total_cost: total, upgrade_gap: total - (gross - saleCosts), cash_required_after_debt: total - (gross - saleCosts - mortgage) };
  });
  return { sale_net_before_mortgage: gross - saleCosts, sale_net_after_mortgage: gross - saleCosts - mortgage, plans };
}
function main(args: string[]): void {
  const [command, file, input] = args;
  if (command === 'model' && file && !input) { console.log(JSON.stringify(model(JSON.parse(readFileSync(file, 'utf8'))), null, 2)); return; }
  if (!file || !['import', 'latest', 'history'].includes(command)) fail('Usage: cli.ts import DB SNAPSHOT | latest DB | history DB KEY | model INPUT');
  if ((command === 'import' || command === 'history') && !input) fail(`${command} requires an input`);
  const db = openDatabase(file);
  try {
    if (command === 'import') console.log(`Imported ${importSnapshot(db, readFileSync(input, 'utf8'))} observations.`);
    else if (command === 'history') console.log(JSON.stringify(db.prepare('SELECT kind, key, observed_at, raw_json FROM observations WHERE key = ? ORDER BY observed_at').all(input), null, 2));
    else console.log(JSON.stringify(db.prepare('SELECT o.kind, o.key, o.observed_at, o.raw_json FROM observations o WHERE NOT EXISTS (SELECT 1 FROM observations n WHERE n.kind=o.kind AND n.key=o.key AND n.observed_at>o.observed_at) ORDER BY o.kind, o.key').all(), null, 2));
  } finally { db.close(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
}
