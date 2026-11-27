# SkillDock · Australian English · v0.2.0

This local plugin packages one teaching skill and its TypeScript helpers. It supports bilingual grammar chapters, on-demand life and workplace scenarios with Australian usage, source-backed materials, saved chapter revisions and local synthesized listening audio. Full lessons target approximately 20–30 minutes of reading for an experienced adult, adapting to the topic and learner's feedback, with separate practice and explained answers. Learners can ask about examples, submit partial answers, request hints or practise a conversation; quick questions receive proportionate answers. The host AI supplies teaching and authorized web research; the helpers manage files and speech rather than calling a paid language model API.

Short workplace rehearsals cover meetings, clarification, reviews and stakeholder communication without requiring a full lesson or saved plan. Direct editing stays concise; teaching requests explain language and register. Confidential work content stays out of public learning records; reusable examples should be generic or anonymized.

The separate [public learning records](learning-records/README.md) support named Markdown plans shared through Git. They are not part of the installed skill folder or the local helper archive.

## Use now as an independent skill

From the repository root:

```sh
node scripts/install-skills.ts skilldock-english
```

Use `$skilldock-english` in a client that discovers that skill. Node.js 24+ is needed for helpers, not for plain conversation. Local synthesis uses macOS `say` and `afconvert` with an already installed `en_AU` voice such as Karen. No new voice, package or service is installed. On other systems, the skill can still teach and link source audio while explaining the local synthesis limitation.

## Plugin installation

The portable root `plugin.json` and `skills/` layout follow [OpenAI's packaging guidance](https://developers.openai.com/plugins/build/plugins). The repository marketplace is under `.agents/plugins/marketplace.json`. In a compatible Codex CLI:

```sh
codex plugin marketplace add /absolute/path/to/codex-extensions-lab
codex plugin add skilldock-english@codex-extensions-lab
```

This registers/installs local capabilities, not a cloud service. Use either the standalone skill install or the plugin to avoid duplicate skill entries. Restart or begin a new chat if discovery does not refresh. The manifest has no registered remote MCP endpoint, and this local package is not published to the public plugin directory. Desktop discovery and enabled state should be verified in the actual client.

## Files and portability

The private local helper archive lives outside this repository under `CODEX_HOME/extension-data/english-learning`, default `~/.codex/extension-data/english-learning`. An optional `ENGLISH_LEARNING_HOME` overrides that directory. Optional private teaching preferences live in `extension-profiles/english-learning.md` under `CODEX_HOME`. The separately published Markdown plans remain in `learning-records/` and are not automatically imported into this archive.

The [tools reference](skills/skilldock-english/references/tools.md) documents commands, JSON requests, revision checks, archive validation and recovery. Exports contain `.md` for reading, `.html` for offline reading/listening, and `.json` for importing to another local environment. The HTML renders Markdown as readable plain text to avoid executing lesson content, not as a full Markdown layout engine.

Automatic device sync, remote MCP/authentication and phone-native access are future integration work. Use manual file transfer now; opening exported HTML or attaching Markdown in another AI client does not itself update the computer's progress. The plugin does not record the learner or grade pronunciation. Word/PDF are host-assisted optional outputs, not bundled converters.

## Cross-agent packaging

Codex and Claude native manifests share this skill source. Generated packages include the path resolver and local helpers. `ENGLISH_LEARNING_HOME` remains the explicit archive override; otherwise `SKILLDOCK_HOME` is used when set, with the legacy data root preserved when unset. No data moves automatically. See [cross-agent setup](../../docs/cross-agent.md) for packaging, invocation and actual-client verification limits.
