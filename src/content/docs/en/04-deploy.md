---
title: Deploy plans
lede: Before every deploy or turn-off, Switch shows you a plan. This chapter explains each part of it, and what to do when a deploy is blocked.
group: Use it
order: 4
page: deploy
---

## What's in a plan

When you click Deploy or Preview deployment, Switch hands the prompt text to the adapter and asks it to **work things out without writing**, then shows the result:

- **Now → after**: the prompt this agent uses now on the left, the one it will use on the right.
- **A short summary**: whether it replaces the current prompt or is the first deploy; that what's there now is backed up first; that the agent needs a restart.
- **Details** (collapsed): which files are written, where backups go, configuration fingerprints (hashes before and after), and any adapter warnings.

Only when you click **Deploy** does the adapter actually run, using the plan you just previewed. If the prompt changed after the preview, the run is refused and you preview again.

## Turning a prompt off

**Turn off** at the top makes a turn-off plan: remove the prompt Switch deployed and put the configuration back the way it was before. Anything else you wrote in the configuration stays.

## When a deploy is blocked

If an adapter finds a write unsafe, it refuses and says why. The common cases:

| Message | Meaning | What to do |
| --- | --- | --- |
| The config was changed after the last deploy | Someone (or another tool) edited this agent's configuration by hand: drift | Use Tidy config or Clean up, as the dialog suggests |
| Keysmith's managed lines were moved or rewritten | Only the managed lines moved | Click **Tidy config**: it backs the file up, puts those lines back, and leaves your own settings as they are |
| No valid deployment record | The record was cleaned up or damaged | Use Clean up to clear the stale record |
| The config backup from before deploying is gone | It can't be restored exactly | Click **Keep current config and turn off**: only the part Keysmith wrote is removed |
| Permission denied | On Windows, the current user lacks Full Control of the agent's folder | Grant Full Control and try again |

A blocked deploy **changes no files**. The dialog shows the adapter's reason and tells you what to click next.

## After a deploy

- **Restart the agent.** Claude Code, Codex and Grok Build need a new session; ZCode needs to be reopened.
- **Records.** Every deploy and turn-off is logged; backups go in `~/.keysmith-switch/backups/<operation id>/`.
- **No duplicates.** If the text matches a prompt already in the library, Switch reuses that entry instead of quietly changing its title or tags.
