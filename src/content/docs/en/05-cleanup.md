---
title: Clean up and roll back
lede: Clean up returns an agent to a fresh install. A version is saved first, so you can roll back in one click, and a rollback can be undone too.
group: Use it
order: 5
page: cleanup
---

## When to clean up

- To start an agent over: remove the prompt Keysmith deployed, plus the rules, custom agents, commands, hooks and skills you added.
- When drift blocks a deploy and you'd rather not untangle it by hand, cleaning up clears the stale deployment record.

**Quit the agent first.** While it runs, its sessions, memories and login are in use, and cleanup stops.

## What cleanup does

Click **Clean up** at the top of an agent's page. Switch lists everything this cleanup touches, in three kinds:

1. **Saved, then removed**: your own setup, such as `rules`, `agents`, `commands`, `skills` and `hooks`. Moved whole into the version and put back on rollback.
2. **Saved without the login, then removed**: files like `settings.json` and `config.toml` that hold settings and possibly keys. Every key, token and account is stripped before saving; if login data is still detected, cleanup stops and changes nothing.
3. **Deleted, not saved**: login files, the login in the system keychain, session history, plugins and caches. You'll sign in again afterwards.

Also:

- **Claude Code** empties `~/.claude/CLAUDE.md` and **Codex** empties `~/.codex/AGENTS.md`, including what you wrote there. You tick “I understand…” before continuing.
- **Codex's memories folder** has its own checkbox, off by default. When ticked, the whole folder is **moved** into the version (not copied, not deleted, so nothing is lost however large it is) and an empty folder is left behind.
- Codex's `config.toml` stays where it is: it holds your models, providers and trusted projects, and Codex can't be deployed to without it.

## Never touched

- Any file in your projects, including git projects and ZCode's `~/.zcode/workspace`;
- your prompt library;
- the agent app itself;
- links (symlinks) and folders containing a git project, which stay where they are.

## Versions and rollback

Versions saved before a cleanup are under **Settings → Versions**, stored in `~/.keysmith-switch/snapshots/`.

Pick one and click **Roll back**. Switch first lists what comes back:

- the prompt deployed then, deployed again (if its text was saved);
- the memory file, exactly as it was;
- the memories folder, copied back (the version stays whole, so you can roll back again);
- rules, skills, configuration and the rest.

If a rollback would overwrite what's there now, **the current state is saved as a version first**, so the rollback itself can be undone. Logins and session history were deleted by the cleanup and don't come back; sign in again afterwards. If you've already signed in again, your current configuration files aren't overwritten.

Versions are plain files in `~/.keysmith-switch/snapshots/`. Delete ones you don't need on the Versions page.

## Input rewrite and cleanup

Before cleaning up an agent, Switch disconnects its [input rewrite](/en/docs/rewrite/) so it connects directly again; a rollback restores your original address. Your rules are kept.
