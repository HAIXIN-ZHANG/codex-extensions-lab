import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { formatMessageLink, validateMessageLinks, validatePrSummary } from '../scripts/message-links.ts';

const url = 'https://github.com/example/app/pull/42';
const summary = `## Ticket\n\nJira: APP-123 Fix errors (https://issues.example.com/APP-123)\n\n## Background\n\nCombined errors run together.\n\n## What changed\n\n- Separate error reasons.\n\nFocused tests passed. Full types were not run.\n`;

test('formats plain titles with copyable original URLs and absolute file paths', () => {
  const result = formatMessageLink({label:'PR',title:'APP-123 Fix errors',url});
  assert.equal(result, `PR: APP-123 Fix errors (${url})`);
  assert.deepEqual(validateMessageLinks(result), []);
  const file = formatMessageLink({label:'File',title:'Report',url:'/tmp/My Report.md'});
  assert.deepEqual(validateMessageLinks(file), []);
});

test('rejects hidden destinations and incomplete resource references', () => {
  for (const value of [url, `PR: ${url}`, `[Fix](${url})`, `PR: [Fix](${url})`, `See [the PR](${url}).`]) {
    assert.ok(validateMessageLinks(value).length, value);
  }
});

test('accepts optional hyperlinks only with a matching visible original URL', () => {
  assert.deepEqual(validateMessageLinks(`PR: [APP-123 Fix errors](${url}) (${url})`), []);
  assert.ok(validateMessageLinks(`PR: [Fix](${url}) (https://example.org/other)`).length);
  assert.deepEqual(validateMessageLinks(`- Spec: Error contract (https://example.com/spec#errors)\n> PR: APP-123 Fix (${url})`), []);
});

test('preserves code and image embeds and rejects unsafe destinations', () => {
  assert.deepEqual(validateMessageLinks('```ts\nconst url = "https://example.com/api";\n```\n![UI](https://example.com/image.jpg)'), []);
  assert.deepEqual(validateMessageLinks('<img width="1089" alt="After" src="https://example.com/image.jpg" />'), []);
  assert.throws(() => formatMessageLink({label:'PR',title:'Fix',url:'javascript:alert(1)'}));
  assert.ok(validateMessageLinks('PR: Fix (https://user:secret@example.com)').length);
});

test('checks the selected PR heading order and concrete changes', () => {
  assert.deepEqual(validatePrSummary(summary), []);
  assert.deepEqual(validatePrSummary(summary + '\n## Screenshots\n\n![After](https://example.com/after.jpg)\n'), []);
  assert.ok(validatePrSummary(summary.replace('## Background', '## Summary')).length);
  assert.ok(validatePrSummary(summary.replace('- Separate error reasons.', '')).length);
  assert.ok(validatePrSummary(summary + '\n## Screenshots\n').length);
  assert.ok(validatePrSummary('Hi team, please review.\n' + summary).length);
});


test('CLI rejects a hidden-link message and accepts the corrected original-URL format', () => {
  const dir = mkdtempSync(join(tmpdir(), 'message-links-cli-'));
  const file = join(dir, 'message.md');
  const cli = new URL('../scripts/message-links.ts', import.meta.url);
  writeFileSync(file, `PR: [Fix errors](${url})`);
  const rejected = spawnSync(process.execPath, [cli.pathname, 'check-links', file], {encoding:'utf8'});
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /original URL/);
  writeFileSync(file, formatMessageLink({label:'PR',title:'APP-123 Fix errors',url}));
  const accepted = spawnSync(process.execPath, [cli.pathname, 'check-links', file], {encoding:'utf8'});
  assert.equal(accepted.status, 0);
});


test('requires a review paragraph and real screenshot syntax in the compact PR format', () => {
  const withoutEvidence = summary.split('Focused tests')[0];
  assert.ok(validatePrSummary(withoutEvidence).some(issue => issue.includes('validation paragraph')));
  assert.ok(validatePrSummary(summary + '\n## Screenshots\n\nTODO').some(issue => issue.includes('attached')));
  assert.deepEqual(validatePrSummary(summary + '\n## Screenshots\n\n<img src="https://example.com/after.jpg" />'), []);
  assert.ok(validatePrSummary(summary.replace('Focused tests', 'Extra paragraph.\n\nFocused tests')).length);
  assert.deepEqual(validatePrSummary(summary.replaceAll('\n', '\r\n')), []);
});

test('preserves inline commands while checking prose file references', () => {
  assert.deepEqual(validateMessageLinks('Run `curl https://example.com` locally.'), []);
  assert.ok(validateMessageLinks('See /tmp/example.md').length);
  assert.deepEqual(validateMessageLinks('File: Test report (/tmp/My Report.md)'), []);
});

test('the workplace clarification example follows the same link rules as saved drafts', async () => {
  const { readFile } = await import('node:fs/promises');
  const patterns = await readFile(new URL('../skills/skilldock-work-messages/references/patterns.md', import.meta.url), 'utf8');
  assert.deepEqual(validateMessageLinks(patterns), []);
});
