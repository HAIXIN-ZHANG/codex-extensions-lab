import { isMain } from './_shared/paths.ts';
// Legacy entrypoint retained for v0.1 installations and existing commands.
export * from './engine.ts';
import { runCLI } from './cli.ts';
if (await isMain(import.meta.url)) await runCLI();
