import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
export const repoRoot = fileURLToPath(new URL('../', import.meta.url));
export const skills = [
  ['skilldock-polish', 'polish'],
  ['skilldock-prompt-rewrite', 'prompt-rewriting'],
  ['skilldock-job-search', 'job-opportunity-search'],
  ['skilldock-property-search', 'property-opportunity-search'],
  ['skilldock-product-discovery', 'product-spike'],
  ['skilldock-ux-brief', 'product-design-brief'],
  ['skilldock-tech-design', 'technical-design'],
].map(([name, legacyName]) => ({ name, legacyName, path: join(repoRoot, 'skills', name) }));
skills.push({ name: 'skilldock-english', legacyName: 'english-learning', path: join(repoRoot, 'plugins/skilldock-english/skills/skilldock-english') });
skills.push({ name: 'skilldock-update', legacyName: 'skilldock-update', path: join(repoRoot, 'plugins/skilldock-updates/skills/skilldock-update') });
