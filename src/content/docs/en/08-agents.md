---
title: How each agent is written
lede: Where each agent's prompt goes, which files its adapter touches, and what turning off and cleaning up put back.
group: Reference
order: 8
page: agents
---

Every write is made by that agent's open-source adapter. This is how the current versions behave (adapter versions are pinned to the app). Switch deploys **user-level** settings only and never writes into a project folder.

## Claude Code · claude-keysmith 7.2

- **Prompt**: written to `~/.claude/keysmith/` and imported by a marked block in `~/.claude/CLAUDE.md`:

  ```markdown
  <!-- claude-keysmith:start name=claude-project-rules -->
  @keysmith/claude-project-rules.md
  <!-- claude-keysmith:end name=claude-project-rules -->
  ```

  Everything outside the markers (your own rules) is left alone.
- **Turn off**: removes only that block and Keysmith's prompt file.
- **Clean up**: can empty `CLAUDE.md` (after you tick a box) and saves/removes `rules`, `agents`, `commands`, `hooks`, `skills` and `output-styles`; deletes sessions, plugins, caches and the login in the system keychain.
- **The adapter never touches**: the Claude Code program, network settings, credentials, MCP configuration or running processes.
- **Input rewrite**: changes only `env.ANTHROPIC_BASE_URL` in `settings.json`; Bedrock and Vertex aren't supported.

## Codex · codex-keysmith 0.6.0

- **Prompt**: placed in `~/.codex/`, with `model_instructions_file` written to `config.toml`. `config.toml` is backed up first.
- **Hooks**: a `hooks.json` that could interfere with loading the instructions is set aside, with a timestamped backup.
- **Turn off**: removes the managed line and the prompt file, and restores the hooks.
- **Clean up**: can empty `~/.codex/AGENTS.md` (after you tick a box); the `memories` folder needs its own checkbox and Codex must be closed. `config.toml` stays.
- **Input rewrite**: adds `[model_providers.keysmith-relay]`, a copy of your provider with only `base_url` changed; needs a custom provider (`wire_api = "responses"`).

## Grok Build · grok-keysmith 0.7.0

- **Prompt**: written to `~/.grok/rules/99-keysmith.md`. These home rules are read by every Grok session, independent of `AGENTS.md` and any persona card.
- **Compat layers**: a block marked `# === grok-keysmith compat isolation begin/end ===` in `config.toml` turns off the Claude / Cursor compatibility layers, and `~/.grok/hooks/*.json` are set aside so they can't interfere.
- **Turn off**: removes only the file and block it wrote; if the pre-deploy config backup is gone, choose “Keep current config and turn off”.
- **Input rewrite's region**: the part between `# === keysmith-switch input rewrite ===` markers belongs to Switch. The adapter never writes inside it and keeps it through deploys, turn-offs, tidying and recovery.
- **Input rewrite**: Grok must have run once and fetched its model list.

## ZCode · zcode-keysmith 0.3.2

- **Prompt**: written to `~/.zcode-keysmith/system-role.md` and applied as a true system role, ahead of ZCode's own system prompt.
- **Newer ZCode (3.12 and later)**: ZCode's `zcode.cjs` is backed up, then patched to read the file above first, and restored when turned off.
- **Environment variables**: set by a LaunchAgent on macOS and as user variables on Windows. The previous values (including `NODE_OPTIONS`) are recorded first and put back when turned off.
- **No recovery**: the ZCode adapter has no interrupted-run recovery.
- **Input rewrite**: changes `baseUrl` of each personal provider in `~/.zcode/v2/provider_config.json`; Coding Plan sign-in isn't supported.

## Adapter source

All four adapters are MIT-licensed and also work on their own from the command line:

- [claude-keysmith](https://github.com/Jia-Ethan/claude-keysmith)
- [codex-keysmith](https://github.com/Jia-Ethan/codex-keysmith)
- [grok-keysmith](https://github.com/Jia-Ethan/grok-keysmith)
- [zcode-keysmith](https://github.com/Jia-Ethan/zcode-keysmith)
