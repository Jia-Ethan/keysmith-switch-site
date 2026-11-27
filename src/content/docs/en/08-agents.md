---
title: How each agent is written
lede: Where each agent's prompt goes, which files its adapter touches, and what turning off and cleaning up put back.
group: Reference
order: 8
page: agents
---

Deploys and turn-offs are written by each agent's open-source adapter; scoped cleanup snapshots, emptying instruction files and the one setting input rewrite changes are handled by Switch itself, see [How it works](/en/docs/how-it-works/). This is how the current versions behave (all six adapter versions are pinned to the app). Switch deploys **user-level** settings only and never writes into a project folder.

## Claude Code · claude-keysmith 7.2

- **Prompt**: written to `~/.claude/keysmith/` and imported by a marked block in `~/.claude/CLAUDE.md`:

  ```markdown
  <!-- claude-keysmith:start name=claude-project-rules -->
  @keysmith/claude-project-rules.md
  <!-- claude-keysmith:end name=claude-project-rules -->
  ```

  Everything outside the markers (your own rules) is left alone.
- **Turn off**: removes only that block and Keysmith's prompt file.
- **Clean up**: defaults to turning off Keysmith's deployment only. Optionally empties `CLAUDE.md` (with an extra confirmation box), moves `rules`/`agents`/`commands`/`hooks`/`skills`/`output-styles` or session history (`.claude/projects`, `.claude/sessions`, `history.jsonl`) into a recoverable local version; only deletes plugins, caches, keychain logins and sanitizes `settings.json`/`.claude.json` when you explicitly tick the irreversible logins & caches section.
- **The adapter never touches**: the Claude Code program, network settings, credentials, MCP configuration or running processes.
- **Input rewrite**: changes only `env.ANTHROPIC_BASE_URL` in `settings.json`; Bedrock and Vertex aren't supported.

## Codex · codex-keysmith 0.6.0

- **Prompt**: placed in `~/.codex/`, with `model_instructions_file` written to `config.toml`. `config.toml` is backed up first.
- **Hooks**: a `hooks.json` that could interfere with loading the instructions is set aside, with a timestamped backup.
- **Turn off**: removes the managed line and the prompt file, and restores the hooks.
- **Clean up**: defaults to turning off Keysmith's deployment only. Optionally empties `~/.codex/AGENTS.md` (with confirmation), moves the `memories` folder, custom setup (including harness-pack skills in shared `~/.agents/skills`), or session folders and `state_5.sqlite` databases (with `-wal`/`-shm` sidecars as complete groups) into a local version. `config.toml` always stays.
- **Input rewrite**: adds `[model_providers.keysmith-relay]`, a copy of your provider with only `base_url` changed; needs a custom provider (`wire_api = "responses"`).

## Grok Build · grok-keysmith 0.8.0

- **Prompt**: written to `~/.grok/rules/99-keysmith.md`. These home rules are read by every Grok session, independent of `AGENTS.md` and any persona card.
- **Compat layers & user area**: a block marked `# === grok-keysmith compat isolation begin/end ===` in `config.toml` turns off the Claude / Cursor compatibility layers and sets `~/.grok/hooks/*.json` aside. Settings you add after deploying (such as fallback models with API keys) can live in the user area without triggering drift and stay when turning off.
- **Turn off**: removes only the file and block it wrote; if the pre-deploy config backup is gone, choose “Keep current config and turn off”.
- **Clean up**: defaults to turning off Keysmith's deployment only. Optionally moves `rules`/`agents`/`skills`/`commands`, memory folders or sessions & `worktrees.db` (with sidecars) into a local version. Grok's own program binaries and your projects are never touched.
- **Input rewrite's region**: the part between `# === keysmith-switch input rewrite ===` markers belongs to Switch. The adapter never writes inside it and keeps it through deploys, turn-offs, tidying and recovery. Grok must have run once and fetched its model list.

## ZCode · zcode-keysmith 0.3.5

- **Prompt**: written to `~/.zcode-keysmith/system-role.md` and applied as a true system role, ahead of ZCode's own system prompt.
- **Newer ZCode (3.12–4.0+)**: on both macOS and Windows, backs up ZCode's `zcode.cjs` first, then patches the runtime anchor for your build so it reads the managed file first, and restores the original on turn-off without overriding `ZCODE_AGENT_SERVER_COMMAND`.
- **Older ZCode**: still uses a wrapper and environment variables (LaunchAgent on macOS, user env vars on Windows); previous values are recorded and put back on turn-off.
- **Clean up**: defaults to turning off Keysmith's deployment only. If the ZCode runtime still carries the patch marker or cannot be verified restored, `~/.zcode-keysmith/backups` is protected from deletion. Projects in `~/.zcode/workspace` are never touched.
- **No recovery**: the ZCode adapter has no interrupted-run recovery.
- **Input rewrite**: changes `baseUrl` of each personal provider in `~/.zcode/v2/provider_config.json`; Coding Plan sign-in isn't supported.

## pi · pi-keysmith 0.2.0

- **Prompt**: written to global `~/.pi/agent/SYSTEM.md`, backed up first and restored on turn-off.
- **Boundaries & clean up**: `~/.pi/agent` is never created if absent; `APPEND_SYSTEM.md`, `AGENTS.md`, settings and sessions stay untouched. Clean up only turns off Keysmith's deployment.
- **Input rewrite**: not supported yet.

## DSH · dsh-keysmith 0.4.1

- **Prompt**: installs a managed Cordis plugin into DSH's profile directory—targeting `profiles/desktop` once DSH Desktop exists, otherwise `profiles/web`. If an earlier deploy lives in `profiles/web`, the hero prompts you to redeploy into `profiles/desktop` in one click.
- **Boundaries & clean up**: `~/.dsh` is never created if absent; `AGENTS.md`, `settings.yaml`, `.credentials.yaml`, sessions and storage stay untouched. Clean up only turns off Keysmith's deployment.
- **Input rewrite**: not supported yet.

## Adapter source

All six adapters are MIT-licensed and also work on their own from the command line:

- [claude-keysmith](https://github.com/Jia-Ethan/claude-keysmith)
- [codex-keysmith](https://github.com/Jia-Ethan/codex-keysmith)
- [grok-keysmith](https://github.com/Jia-Ethan/grok-keysmith)
- [zcode-keysmith](https://github.com/Jia-Ethan/zcode-keysmith)
- [pi-keysmith](https://github.com/Jia-Ethan/pi-keysmith)
- [dsh-keysmith](https://github.com/Jia-Ethan/dsh-keysmith)
