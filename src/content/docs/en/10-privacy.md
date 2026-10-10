---
title: Data and privacy
lede: Where your data lives, which network addresses the app contacts, and when it sends nothing at all.
group: Reference
order: 10
page: privacy
---

## Where data lives

| Path | Contents |
| --- | --- |
| `~/.keysmith-switch/keysmith-switch.db` | The prompt library and operation log |
| `~/.keysmith-switch/prompts/<tool>/<prompt-id>.md` | Prompt text |
| `~/.keysmith-switch/backups/<operation-id>/` | Backups taken before deploys |
| `~/.keysmith-switch/snapshots/` | Versions saved before cleanups |
| `~/.keysmith-switch/logs/` | Logs (the relay's is `relay.log`) |
| `~/.keysmith-switch/input-rewrite/` | Input rewrite's rule snapshot, port and forwarding addresses, and each agent's connection record |

On Windows, `~` is `%USERPROFILE%`. Uninstalling the app **doesn't** delete this folder. To remove your data completely, delete it by hand after uninstalling; it also holds the versions saved before cleanups.

## Network addresses the app contacts

Keysmith Switch has no account, analytics or telemetry. Prompt text is never uploaded. It goes online only in these cases:

| When | Where | Why |
| --- | --- | --- |
| After launch, then every 6 hours | `github.com/Jia-Ethan/keysmith-switch-releases` | Check for updates (reads `latest.json`) |
| After launch, then every 6 hours | `raw.githubusercontent.com/Jia-Ethan/keysmith-switch-releases` | Read announcements |
| After you turn on Extensions | `github.com/Jia-Ethan/keysmith-switch-extensions` | Read the pack list and download packs you choose |
| When you confirm an update | `github.com/Jia-Ethan/keysmith-switch-releases` | Download the update |
| When you open Settings, if npm is installed | The npm registry (via your `npm` command) | Look up the latest Claude Code and Codex versions |
| When you send feedback | `github.com` | Open a prefilled issue form for you to review and submit |

None of these requests contains your prompts, rules or configuration.

## The input rewrite relay

The [input rewrite](/en/docs/rewrite/) relay listens only on `127.0.0.1` and forwards requests to the model address you configured. It doesn't store or log request content, rules or credentials.

## When sending feedback

Feedback goes to public GitHub issues. Don't include tokens, cookies, private paths, complete configuration or prompt text. Please don't disclose security issues publicly in Discussions.
