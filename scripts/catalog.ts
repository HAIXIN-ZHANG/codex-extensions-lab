import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
export const repoRoot = fileURLToPath(new URL('../', import.meta.url));
export const skills = [
  'polish', 'job-opportunity-search', 'property-opportunity-search',
  'product-spike', 'product-design-brief', 'technical-design', 'prompt-rewriting',
].map(name => ({ name, path: join(repoRoot, 'skills', name) }));
skills.push({ name: 'english-learning', path: join(repoRoot, 'plugins/english-learning/skills/english-learning') });
