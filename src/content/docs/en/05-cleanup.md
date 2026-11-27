---
title: Clean up and roll back
lede: Clean up uses scoped, opt-in categories that default to Keysmith's own deployment only. Any opted-in sessions, memories or skills are saved to a local version first so you can roll back in one click—and undo a rollback too.
group: Use it
order: 5
page: cleanup
---

## When to clean up

- Switching or deploying prompts with Keysmith **never** touches your session history, memories, skills or logins.
- When drift or a stale deployment record blocks a deploy, leave the default **Keysmith prompt deployment & leftovers** ticked—it touches none of your personal data and doesn't require quitting the agent.
- When you want to reset more of an agent's user-level state, explicitly tick the categories you want below.

## What cleanup does

Click **Clean up** at the top of an agent's page. A live banner at the top lists **what stays untouched**, and everything available is split into two distinct sections:

### Recoverable (saved to Settings → Versions before removal)

1. **Keysmith prompt deployment & leftovers** (selected by default): turns off the deployed prompt and removes Keysmith's own manifests or wrappers without touching personal data or requiring the agent to quit.
2. **User instruction file** (off by default): Claude Code's `~/.claude/CLAUDE.md`, Codex's `~/.codex/AGENTS.md`, etc. Requires an extra confirmation box; saved byte-for-byte before clearing.
3. **Agent memories folder** (off by default): `~/.codex/memories`, `.grok/memory*`, `.zcode/cli/memories`. **Moved whole (same-volume rename)** into the version with nothing copied or deleted; quit the agent first.
4. **Custom setup & extensions (Skills / Rules / Agents)** (off by default): `skills`, `rules`, `agents`, `commands`, `hooks` and `output-styles`. Moved whole into the version—**never touches logins or disconnects input rewrite**.
5. **Session history & chat transcripts** (off by default): past chats, session folders and state databases (such as `.claude/projects`, `.codex/sessions`, `state_5.sqlite`, `.grok/worktrees.db` and their SQLite `-wal`/`-shm` sidecars). Moved as atomic same-volume groups into a local version so you can restore them in one click under **Settings → Versions**; quit the agent first.

### Permanent deletion (not recoverable, separate red section)

- **Logins, keyed configs & caches** (off by default; requires an explicit irreversible confirmation checkbox and quitting the agent first):
  - Permanently deletes auth files (`auth.json`, `.credentials.json`), system keychain logins, plugins and caches without saving them.
  - Config files that may hold logins or API keys (`.claude.json`, `settings.json`, `.grok/config.toml`, `.zcode/v2/*.json`) have every key, token and account stripped to save a **sanitized copy** before the original is removed. Original credentials cannot be recovered and you'll sign in again afterwards. If login data is still detected after stripping, cleanup stops and changes nothing.

Also:

- **Codex's `config.toml`** always stays where it is: it holds your models, providers and trusted projects, and Codex can't be deployed to without it.
- **`pi` and `DSH`** keep all of their own settings, credentials, sessions and storage untouched; cleanup only turns off Keysmith's deployment.

## Never touched

- Any file in your projects, including git projects and ZCode's `~/.zcode/workspace`;
- your prompt library;
- the agent app itself;
- symlinks, Windows junctions (including any symlinked ancestor directory), and folders containing a git project or credential file, which stay where they are.

## Versions and rollback

Versions saved before a cleanup live under **Settings → Versions**, stored locally in `~/.keysmith-switch/snapshots/` (plain local files; never exported in backups and never uploaded).

Pick one and click **Roll back**. Switch first lists what comes back:

- the prompt deployed then, deployed again (if its text was saved);
- the user instruction file, byte-for-byte;
- the memories folder and session history (with SQLite databases and their `-wal`/`-shm` sidecars staged and verified as complete groups; the version itself stays intact);
- rules, skills, commands, hooks and other extensions;
- sanitized config copies only when **no newer config exists** at that path, so a fresh sign-in is never overwritten.

If a rollback overwrites current files or restores paths that didn't exist before rolling back, **the current state is saved as a “Before rollback” version first** (recording previously absent paths as well), so undoing a rollback safely moves newly added paths into a new safety version instead of deleting them. Versions never store logins; if logins were deleted during cleanup, sign in again afterwards.

Delete versions you no longer need on the Versions page (this also frees space held by any saved sessions or memories).

## Input rewrite and cleanup

Switch disconnects an agent's [input rewrite](/en/docs/rewrite/) only when you tick **Logins, keyed configs & caches**, before saving the sanitized config copy, so a rollback restores your original upstream address while keeping your rules. Cleaning only Keysmith's deployment or pure skills/rules folders leaves input rewrite connected.
