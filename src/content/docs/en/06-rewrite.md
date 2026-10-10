---
title: Input rewrite
lede: Type in your agent as usual. Your rules replace literal text before the model sees it; the input box and session history keep what you typed.
group: Go further
order: 6
page: rewrite
---

## How it works

With input rewrite on, Switch runs a relay on your computer, `keysmith-relay`, that **listens only on `127.0.0.1`**. Connecting an agent changes exactly one of its settings so it sends requests to the relay. The relay rewrites the text you typed according to your rules, forwards the request to the original address, and streams the response back unchanged.

The relay starts with your computer (a LaunchAgent on macOS, a login item on Windows), so it works even when Switch is closed. Once every agent is disconnected, the relay is removed.

## Connect an agent

Open **Input rewrite** in the sidebar. Each agent has a row; click **Connect…**. Before anything changes, you see exactly which setting in which file:

| Agent | What connecting changes |
| --- | --- |
| Claude Code | `env.ANTHROPIC_BASE_URL` in `~/.claude/settings.json` (the `CLAUDE_CONFIG_DIR` folder when that's set) |
| Codex | `~/.codex/config.toml`: adds `[model_providers.keysmith-relay]` (a copy of your provider with only `base_url` changed) and points the top-level `model_provider` at it |
| ZCode | `~/.zcode/v2/provider_config.json`: `baseUrl` of each personal provider |
| Grok Build | The end of `~/.grok/config.toml`, between a pair of `# === keysmith-switch input rewrite ===` markers: a `[model."<id>"] base_url` table per model |

A backup is left beside each file before it's written.

## Only what you type

Only text you typed is replaced, including your earlier messages in the history. Left alone:

- assistant replies and tool output;
- context the agent adds itself, such as Claude Code's `<system-reminder>`, Codex's environment and AGENTS.md, ZCode's skill list, Grok's `<user_info>`;
- slash commands starting with `/` and what they expand to;
- helper requests the agent sends itself, such as ZCode sub-agents and Grok session titles.

## How rules match

- Literal matches, case-sensitive;
- where several rules match at the same spot, the longest wins;
- replaced text isn't replaced again;
- My rules come first, other tables follow in the order you set;
- each table can apply to only some agents.

My rules start empty. The master switch at the top turns everything off; your rules are kept.

## Rule packs

The [extensions](/en/docs/extensions/) source can also publish rule packs. Every rule is listed before you install. When a pack you've turned on has an update, it switches only after you review the change on the Input rewrite page and accept it. Rule packs are read-only; copy one into My rules to change it.

## Disconnect

**Disconnect** restores only the values Switch wrote that still hold what it wrote; if another tool changed them in the meantime, they're left alone. Your rules are kept.

Deploying or turning off prompts never touches the settings above. Cleaning up an agent disconnects its input rewrite first.

## No session storage

The relay doesn't store or log request content, rules or credentials. With subscription sign-in, your sign-in token passes through the local relay and is likewise never stored or logged.

## Current limits

- **Claude Code**: Bedrock and Vertex aren't supported.
- **Codex**: needs a custom provider (`wire_api = "responses"`); Codex's built-in OpenAI sign-in can't be connected yet.
- **ZCode**: Coding Plan sign-in isn't supported; add a provider that uses an API key.
- **Grok Build**: Grok must have run once and fetched its model list; models added later go through the relay only after you reconnect. Models you configured on top of one of Grok's own models are kept out of the relay and listed in the details.
