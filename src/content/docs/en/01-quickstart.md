---
title: Quickstart
lede: Download it, open it, and deploy your first prompt to an agent. About five minutes end to end.
group: Get started
order: 1
page: quickstart
---

## Install Keysmith Switch

Keysmith Switch is a desktop app for macOS (Apple Silicon, macOS 12 or later) and Windows (10 / 11, x64). The four agent adapters ship inside the app, so there's no Python or anything else to install.

1. **Download the installer.** Get the current stable version from the [download page](/en/download/): a `.dmg` for macOS, a `-setup.exe` for Windows. Every installer is published in the public `keysmith-switch-releases` repository, so every entry point hands out the same file for a version.
2. **Open it.** On macOS, drag Keysmith Switch into Applications. The app isn't notarized by Apple, so macOS stops it the first time: open System Settings → Privacy & Security and click Open Anyway near the bottom. On Windows, run the installer; if SmartScreen says “Windows protected your PC”, click More info → Run anyway. It installs for the current user and doesn't need administrator rights.
3. **Verify the file (optional).** Every release includes `SHA256SUMS.txt`. Compare before you open anything.

```bash
# macOS
shasum -a 256 ~/Downloads/Keysmith.Switch_*_aarch64.dmg
# Windows (PowerShell)
Get-FileHash .\Keysmith.Switch_*_x64-setup.exe -Algorithm SHA256
```

> The installers are not signed with an Apple Developer ID, notarized, or signed with Windows Authenticode. In-app updates are signed with a separate minisign key, which is not platform code signing.

## First launch

On first launch, Switch checks that the four bundled adapters work and looks for Keysmith prompt files already on your computer (such as `~/.claude/keysmith/` or `~/.grok/rules/`). Anything it finds is listed for you to tick and import. **Importing only adds to the library; nothing is activated.** If nothing turns up, just finish setup.

## Deploy your first prompt

1. Pick an agent on the left, say Claude Code. The window takes on that agent's color, and the top shows the prompt it uses now.
2. Click **Quick Deploy** at the top right, give it a title and paste your prompt, or drop in a `.md` file.
3. Click **Preview deployment**. Switch asks the adapter to work out a plan first: now → after, and what gets backed up. Nothing is written in this step.
4. Read it, then click **Deploy**. When it's done, the top shows “Currently deployed”.
5. **Restart the agent** (or start a new session) to pick up the new prompt.

To keep a prompt without deploying it, choose Save to library.

## Next

- [Prompt library](/en/docs/library/): tags, search, editing and version history.
- [Deploy plans](/en/docs/deploy/): what each part of a plan means, and what to do when a deploy is blocked.
- [Clean up and roll back](/en/docs/cleanup/): return an agent to a blank slate, then roll back in one click.
