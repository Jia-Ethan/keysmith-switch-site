// Storyboards for the tour clips and the hero film. Each scene drives the real
// UI through the demo backend; selectors are the app's own data-testids.
const T = (zh, en) => (ctx) => (ctx.zh ? zh : en);

const NEW_PROMPT = {
  title: T("测试优先的工程师", "Test-first engineer"),
  body: T(
    "先写一个会失败的测试，再写刚好让它通过的实现。\n每次改动后跑完整的测试集，失败就先修好再继续。\n不顺手重构无关代码。",
    "Write a failing test first, then just enough code to make it pass.\nRun the full suite after every change; fix failures before moving on.\nLeave unrelated code alone.",
  ),
};

/** Agents: switching agents recolors the window; tags and search narrow the list. */
const agents = {
  id: "agents",
  async run(r, ctx) {
    await r.wait(700);
    await r.click('[data-testid="nav-codex"]', { after: 1100 });
    await r.click('[data-testid="nav-grok"]', { after: 1100 });
    await r.click('[data-testid="nav-zcode"]', { after: 1300 });
    await r.click('[data-testid="nav-claude"]', { after: 1000 });
    await r.click('[data-testid="prompt-search"]', { after: 200 });
    await r.type(ctx.zh ? "写作" : "writing");
    await r.wait(1200);
    for (let i = 0; i < (ctx.zh ? 2 : 7); i++) await r.press("Backspace", 40);
    await r.wait(900);
  },
};

/** Plan: Quick Deploy, paste, preview, confirm, celebration. */
const plan = {
  id: "plan",
  async run(r, ctx) {
    await r.wait(500);
    await r.click('[data-testid="quick-deploy-open"]', { after: 650 });
    await r.click('[data-testid="quick-deploy-title"]', { move: 450, after: 150 });
    await r.selectText('[data-testid="quick-deploy-title"]');
    await r.type(NEW_PROMPT.title(ctx), { cps: 12 });
    await r.click('[data-testid="markdown-editor"] .cm-content', { move: 500, after: 200 });
    await r.paste(NEW_PROMPT.body(ctx));
    await r.wait(700);
    await r.click('[data-testid="quick-deploy-submit"]', { after: 1900 });
    await r.click('[data-testid="quick-deploy-confirm"]', { move: 800, after: 2600 });
    await r.wait(600);
  },
};

/** Cleanup: open the cleanup plan, acknowledge, confirm, then roll back from Versions. */
const cleanup = {
  id: "cleanup",
  async run(r) {
    await r.wait(500);
    await r.click('[data-testid="hero-cleanup"]', { after: 1500 });
    await r.scroll('[data-testid="cleanup-plan"]', 160, 600);
    await r.wait(500);
    await r.click('[data-testid="cleanup-ack"]', { after: 400 });
    await r.click('[data-testid="cleanup-confirm"]', { after: 1700 });
    await r.click('[data-testid="cleanup-open-versions"]', { after: 1300 });
    await r.click('[data-testid^="version-rollback-"]', { after: 1500 });
    await r.click('[data-testid="rollback-confirm"]', { after: 1800 });
    await r.wait(500);
  },
};

/** Palette: ⌘K, jump to an agent, ⌘K again, deploy a prompt by name. */
const palette = {
  id: "palette",
  async run(r, ctx) {
    await r.wait(500);
    await r.keys(["⌘", "K"], ["Meta", "k"]);
    await r.wait(300);
    await r.type("codex", { cps: 10 });
    await r.wait(500);
    await r.press("Enter", 1300);
    await r.keys(["⌘", "K"], ["Meta", "k"]);
    await r.type(ctx.zh ? "迁移" : "migra", { cps: 9 });
    await r.wait(500);
    await r.press("Enter", 1900);
    await r.click('[data-testid="quick-deploy-confirm"]', { move: 700, after: 2400 });
  },
};

/** Rewrite: connect Codex, add a rule. */
const rewrite = {
  id: "rewrite",
  async run(r, ctx) {
    await r.wait(400);
    await r.click('[data-testid="nav-rewrite"]', { after: 1200 });
    await r.click('[data-testid="rewrite-connect-codex"]', { after: 1300 });
    await r.click('[data-testid="rewrite-connect-confirm"]', { move: 600, after: 1500 });
    await r.click('[data-testid="rewrite-add"]', { after: 500 });
    await r.click('[data-testid="rewrite-from-1"]', { move: 500, after: 150 });
    await r.type(ctx.zh ? "帮我" : "pls", { cps: 9 });
    await r.click('[data-testid="rewrite-to-1"]', { move: 450, after: 150 });
    await r.type(ctx.zh ? "请" : "please", { cps: 9 });
    await r.press("Tab", 1400);
  },
};

/** Extensions: turn on, install a pack. */
const extensions = {
  id: "extensions",
  async run(r) {
    await r.wait(400);
    await r.click('[data-testid="nav-extensions"]', { after: 1100 });
    await r.click('[data-testid="extensions-enable"]', { after: 1600 });
    await r.click('[data-testid="extension-install-keysmith.claude"]', { after: 1700 });
    await r.click('[data-testid="extension-install-keysmith.grok"]', { after: 1700 });
    await r.wait(500);
  },
};

/** Adopt: ZCode runs a prompt not in the library; add it and open the editor. */
const adopt = {
  id: "adopt",
  async run(r) {
    await r.wait(400);
    await r.click('[data-testid="nav-zcode"]', { after: 1500 });
    await r.moveTo('[data-testid="prompt-live-unrecorded"]', 700);
    await r.wait(700);
    await r.click('[data-testid="prompt-live-adopt"]', { after: 2200 });
    await r.wait(800);
  },
};

/** Updates: the bell, then Settings → About with an update ready. */
const updates = {
  id: "updates",
  async run(r) {
    await r.wait(600);
    await r.click('[data-testid="nav-announcements"]', { after: 1800 });
    await r.click('[data-testid="nav-settings"]', { after: 1000 });
    await r.click('[data-testid="settings-nav-about"]', { after: 2400 });
    await r.wait(800);
  },
};

/** Hero film: a calmer cut through the main ideas, at 1920x1080. */
const film = {
  id: "film",
  viewport: { width: 1600, height: 900 },
  scale: 1.2,
  async run(r, ctx) {
    r.mark(0);
    await r.wait(900);
    await r.click('[data-testid="nav-codex"]', { move: 900, after: 900 });
    await r.click('[data-testid="nav-grok"]', { move: 600, after: 900 });
    await r.click('[data-testid="nav-claude"]', { move: 700, after: 1100 });
    r.mark(1);
    await r.click('[data-testid="quick-deploy-open"]', { move: 1000, after: 650 });
    await r.click('[data-testid="quick-deploy-title"]', { move: 500, after: 150 });
    await r.selectText('[data-testid="quick-deploy-title"]');
    await r.type(NEW_PROMPT.title(ctx), { cps: 12 });
    await r.click('[data-testid="markdown-editor"] .cm-content', { move: 500, after: 200 });
    await r.paste(NEW_PROMPT.body(ctx));
    await r.wait(600);
    await r.click('[data-testid="quick-deploy-submit"]', { after: 2300 });
    await r.click('[data-testid="quick-deploy-confirm"]', { move: 800, after: 2600 });
    r.mark(2);
    await r.keys(["⌘", "K"], ["Meta", "k"]);
    await r.type("zcode", { cps: 10 });
    await r.press("Enter", 1600);
    r.mark(3);
    await r.click('[data-testid="hero-cleanup"]', { move: 900, after: 2600 });
    await r.press("Escape", 900);
    await r.click('[data-testid="nav-claude"]', { move: 1000, after: 1600 });
  },
};

export const SCENES = [agents, plan, cleanup, palette, rewrite, extensions, adopt, updates, film];
