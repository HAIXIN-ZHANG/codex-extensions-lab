import { cp, mkdir, readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { skills, repoRoot } from './catalog.ts';
// Bundle relative TypeScript dependencies by copying from their one canonical source.
// No compiler, runtime dependency, symlink, absolute author path or import outside the package.
export async function materializeSkill(skill: typeof skills[number], output: string) {
  await cp(skill.path, output, { recursive: true, force: false, errorOnExist: true });
  const seen = new Set<string>();
  async function bundle(source: string, dest: string) {
    if (seen.has(dest)) return; seen.add(dest);
    const text = await readFile(source, 'utf8');
    const pattern = /(\bfrom\s*|\bimport\s*)(['"])(\.[^'"]+\.ts)\2/g;
    const rewritten = new Map<string, string>();
    for (const match of text.matchAll(pattern)) {
      if (rewritten.has(match[3])) continue;
      const dependency = resolve(dirname(source), match[3]);
      const fromRoot = relative(repoRoot, dependency);
      if (!fromRoot || fromRoot === '..' || fromRoot.startsWith('..' + sep) || isAbsolute(fromRoot)) throw new Error('Dependency outside source repository');
      const inside = dependency.startsWith(skill.path + sep);
      const target = inside ? join(output, relative(skill.path, dependency)) : join(output, '_shared', relative(repoRoot, dependency));
      await mkdir(dirname(target), { recursive: true });
      await bundle(dependency, target);
      let specifier = relative(dirname(dest), target).split(sep).join('/');
      if (!specifier.startsWith('.')) specifier = './' + specifier;
      rewritten.set(match[3], specifier);
    }
    // Rewrite only the matched import specifiers, never other text that happens to contain them.
    const result = text.replace(pattern, (_all, prefix: string, quote: string, path: string) => prefix + quote + rewritten.get(path)! + quote);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, result);
  }
  async function walk(source: string, dest: string) {
    for (const entry of await readdir(source, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error('Symlink in skill source');
      if (entry.isDirectory()) await walk(join(source, entry.name), join(dest, entry.name));
      else if (entry.name.endsWith('.ts')) await bundle(join(source, entry.name), join(dest, entry.name));
    }
  }
  await walk(skill.path, output);
  if (['skilldock-polish', 'skilldock-pr-comms', 'skilldock-work-messages'].includes(skill.name)) {
    await bundle(join(repoRoot, 'scripts/message-links.ts'), join(output, 'scripts/message-links.ts'));
  }
}
