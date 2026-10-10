---
title: Extension packs
lede: Extension packs are official prompt packs and rule packs that update on their own, apart from the app. Installing only adds to your library; nothing is deployed for you.
group: Go further
order: 7
page: extensions
---

## Turn extensions on

Extensions are **off by default**. The app reads the official source only after you click “Turn on extension packs” on the **Extensions** page in the sidebar; while off, it doesn't touch the network.

Once on, the app downloads the list and the packs you choose, and uploads nothing of yours.

## Install and update

- Each card shows the name, official badge, item count, size, version and install status.
- **Installing only adds prompts to your library; nothing is deployed.** You still review a plan and confirm before deploying.
- When updates are out, the Extensions button shows how many; with two or more you can update them all at once.
- **Prompts you've edited are never overwritten by an update**; the new text is saved beside yours.
- Uninstalling removes prompts you haven't edited and no agent is using; edited or running ones stay.

The text of prompts from extension packs isn't shown and can't be edited, but they deploy normally.

## Safety boundaries

- **Data only.** Packs contain no executable code.
- **A fixed official source.** The official source is an HTTPS address built into the app, and archive downloads must sit under it. “Official” in the UI only means it came from that address.
- **Checked item by item.** The index lists each pack's size and hash; after downloading, the app checks every item against the format rules again. A pack that breaks the rules isn't installed.
- **Never deployed for you.** Packs aren't signed: if the publishing account were compromised, someone could publish prompts. That's why installing only adds to the library, and you still confirm before deploying.

## Rule packs

Besides prompt packs, the source can publish rule packs for [input rewrite](/en/docs/rewrite/), declaring which agents they apply to with `tools`. Every rule is listed before you install; choose “Install and turn on” or “Install only”. When a pack you've turned on has an update, it switches only after you confirm.

## Source repository

The source repository is [keysmith-switch-extensions](https://github.com/Jia-Ethan/keysmith-switch-extensions); the pack format is in its `SPEC.md`.
