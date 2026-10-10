---
title: Prompt library
lede: Create, search and edit prompts, adopt the prompt already running on your computer, and copy prompts between agents.
group: Use it
order: 3
page: library
---

## Create a prompt

- **Quick Deploy**: paste the text, add a title, preview and deploy. Or choose Save to library.
- **Drop a file**: drop a `.md`, `.markdown` or `.txt` file (up to 1 MB) on the Quick Deploy editor to fill it.

The title shows up in the list, the command palette and deploy plans, so pick one you'll recognize at a glance.

## Search, tags and sorting

The search box matches titles, text and tags. Tag buttons narrow the list to one kind; sort by Last used, Updated, Title or Created.

## Editing and history

Open a prompt to read it in full, edit it, or browse its edit history. History can compare two revisions and restore an older one.

When you edit the prompt that is deployed now, note that **saving changes only the library copy; deploy it again for the change to reach the agent**. The app reminds you after saving.

## Context menu

Right-click a prompt card (or use the “⋯” menu in its details) to open, edit, deploy, copy, copy to another tool, or delete it.

- The prompt that is live can't be deleted until you turn it off.
- Prompts from extension packs don't show their text and can only be deployed or deleted.

## Adopt what's already running

If an agent already runs a prompt (say, one you installed with the Keysmith command line) that isn't in your library, a **The prompt in use right now** card appears at the top. Click **Add to library and edit** and it becomes a normal library prompt you can edit, with history kept.

If Switch can't read that text back, it asks you to paste it in.

## Copy to another agent

To use the same rules in several agents, choose “Copy to another tool” from the card's context menu. The copy is independent; changing one leaves the other alone.

## Command palette

Press <kbd>⌘</kbd> <kbd>K</kbd> (<kbd>Ctrl</kbd> <kbd>K</kbd> on Windows):

- type an agent's name and press Enter to switch to it;
- type a prompt's title and press Enter to get its deploy plan;
- “New prompt for…”, Extensions, Input rewrite and Settings are there too.
