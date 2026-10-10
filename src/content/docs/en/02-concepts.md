---
title: Core concepts
lede: The prompt library, deploys, adapters and versions. Once these four are clear, the rest follows.
group: Get started
order: 2
page: concepts
---

## Prompt library

Each agent has its own set of prompts. A prompt is a piece of Markdown plus a title, tags and its edit history. The library is kept in `~/.keysmith-switch/` on your computer and is never uploaded.

Prompts are shown in two groups: **Deployed now** (the one that is live in this agent) and **Library** (the rest).

## Deploys

Deploying hands one prompt from the library to an agent. Each agent has at most one prompt deployed by Switch at a time; deploying another replaces it.

A deploy always takes two steps: a **preview** (worked out, nothing written), then, once you confirm, the **real run**. Turning a prompt off works the same way.

## Adapters

Switch never edits an agent's configuration itself. Each agent's open-source adapter does the writing:

| Agent | Adapter | Version |
| --- | --- | --- |
| Claude Code | claude-keysmith | 7.2 |
| Codex | codex-keysmith | 0.6.0 |
| Grok Build | grok-keysmith | 0.7.0 |
| ZCode | zcode-keysmith | 0.3.2 |

Adapter versions are pinned to the app: if they don't match, confirming a deploy is refused rather than risking the write. Adapters own the target format, backups, drift detection and recovery; Switch owns the library, versions, hash checks, plan previews and the operation log.

## Drift

If someone (or another tool) edits an agent's configuration by hand after a deploy, Switch notices that it no longer matches what was deployed. That's **drift**. The prompt usually still works, but to avoid overwriting your edits, deploys are blocked and the app tells you what to click next. See [Deploy plans](/en/docs/deploy/).

## Versions

Before a cleanup, Switch saves the state as a **version**: the deployed prompt's text, the memory file's exact bytes and so on. Roll back to it or delete it under Settings → Versions. Don't confuse:

- **Edit history**: a prompt's own revisions, shown in the prompt's details.
- **Versions**: snapshots of an agent's whole state before a cleanup, under Settings → Versions.
