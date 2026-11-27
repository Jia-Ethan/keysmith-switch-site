---
title: How it works
lede: Adapters do the writing; Switch does the managing. This chapter follows one deploy from paste to write, and the boundary kept at each step.
group: Reference
order: 9
page: how-it-works
---

## The steps of one deploy

```text
Paste a prompt or pick a local .md
        ↓
Prompt library (versions · hash checks)
        ↓
Deploy plan (now → after) ── you confirm ──→ agent adapter ──→ agent config
                                                └── backed up before writing
```

1. **Into the library**: the prompt is saved in `~/.keysmith-switch/` with a hash of its text.
2. **Preview**: Switch writes the text to a temporary file and hands it to the adapter's preview command. The adapter works out what it would write and back up, and writes nothing.
3. **Confirm**: you click Deploy in the plan. If the text changed in between (the hash no longer matches), the run is refused.
4. **Run**: the adapter writes using the same plan, backing up first; the temporary file is then removed.
5. **Record**: the result goes in the operation log and the top of the page shows “Currently deployed”.

## Boundaries it keeps

- **Adapters write; Switch manages.** Every prompt deploy and turn-off goes through the six agent adapters; the app never edits an agent's prompt configuration itself. The only exceptions: moving or emptying the exact paths you opt into during [cleanup](/en/docs/cleanup/) (after verifying no symlink or Windows junction along the path, grouping SQLite databases with their `-wal`/`-shm` sidecars, and redacting credentials before saving snapshots); plain-text component packs you confirm in [Extensions](/en/docs/extensions/); and the one setting [input rewrite](/en/docs/rewrite/) changes when connecting.
- **Adapters get only the text.** Library Markdown carries metadata; the temporary file handed to an adapter holds only the prompt text and is removed after the preview or run.
- **No quiet edits.** The same text for the same agent reuses the existing entry; if that entry has a different title or tags, the original is returned and deployed, and its metadata is left alone.
- **Official text is never deployed for you.** Switch never deploys an official prompt on its own, and Quick Deploy never fetches from other Keysmith repositories. Official prompt packs can be installed as optional [extension packs](/en/docs/extensions/); once in the library, they still deploy only when you confirm.
- **Pinned versions.** Each adapter's version must match the version the app expects, or confirming a deploy is refused.

## Where adapters come from

The six adapters ship inside the app as sidecars (pinned in `third_party/keysmith/`), so you don't install the matching Keysmith repositories or Python. They're open-source MIT projects, each with its own command-line version.

## In-app updates

- After launch, the app checks the public `keysmith-switch-releases` repository for the latest stable version, then again every 6 hours, or when the window comes back to the front more than an hour after the last check.
- Updates are signed with a separate production minisign key and verified before installing; on a bad signature, no network or an interrupted download, the current version stays.
- Installing is up to you. Both macOS and Windows read the system HTTP proxy automatically.
