// Demo backend for recording the app's real UI without Tauri. Injected with
// page.evaluateOnNewDocument before the app loads, so the frontend sees a
// Tauri runtime and calls this instead. Self-contained on purpose: puppeteer
// serializes the function source.
export function installDemo(cfg) {
  const lang = cfg.lang;
  const zh = lang === "zh";
  try {
    localStorage.setItem("keysmith-switch-theme", cfg.theme);
  } catch {}

  const now = () => new Date().toISOString();
  const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
  const delay = (value, ms = 260) => new Promise((r) => setTimeout(() => r(value), ms));

  const SEED = zh
    ? [
        ["claude", "严谨的代码审查员", "你是一位严谨的资深代码审查员。先说明风险，再给出最小改动的修复建议，避免无关重构。", ["代码", "审查"], 12],
        ["claude", "中文写作润色", "把用户给出的文字润色得更自然、简洁，保留原意，不添加新事实。", ["写作"], 240],
        ["claude", "每日站会助手", "根据昨天的提交与今天的计划，生成三句话的站会发言。", ["效率"], 2880],
        ["codex", "重构小能手", "只做行为不变的重构；每一步都跑测试确认。", ["重构"], 60],
        ["codex", "迁移助手", "把旧接口的调用逐个换成新接口，保持行为不变，不顺手改别的代码。", ["迁移"], 1440],
        ["grok", "资料检索员", "先列出要查证的问题，再给出带出处的结论；查不到就直说。", ["检索"], 20],
        ["grok", "命令行老手", "优先给出可以直接运行的命令，并说明每个参数的作用。", ["终端"], 600],
        ["zcode", "全栈脚手架", "为新项目生成最小可运行的全栈脚手架，并解释每个目录的用途。", ["脚手架"], 30],
      ]
    : [
        ["claude", "Careful code reviewer", "You are a careful senior code reviewer. Name the risk first, then suggest the smallest fix. No unrelated refactors.", ["code", "review"], 12],
        ["claude", "Plain-English editor", "Make the text clearer and shorter. Keep the meaning and add no new facts.", ["writing"], 240],
        ["claude", "Daily stand-up helper", "From yesterday's commits and today's plan, write a three-sentence stand-up update.", ["productivity"], 2880],
        ["codex", "Refactor, same behavior", "Only refactor without changing behavior; run the tests after every step.", ["refactor"], 60],
        ["codex", "Migration assistant", "Replace calls to the old API with the new one, one at a time. Keep behavior the same and leave other code alone.", ["migration"], 1440],
        ["grok", "Research assistant", "List the questions to check first, then give conclusions with sources. Say so when you can't find out.", ["research"], 20],
        ["grok", "Shell veteran", "Prefer commands that run as-is, and explain what each flag does.", ["terminal"], 600],
        ["zcode", "Full-stack scaffold", "Generate the smallest full-stack scaffold that runs, and explain what each folder is for.", ["scaffold"], 30],
      ];

  const store = {
    prompts: SEED.map(([tool, title, content, tags, mins], i) => ({
      id: `p${i + 1}`,
      tool,
      title,
      content,
      tags,
      active: false,
      lastUsedAt: ago(mins),
      updatedAt: ago(mins),
      createdAt: ago(mins + 600),
      excerpt: content.slice(0, 80),
    })),
    live: {
      claude: { id: "p1", title: SEED[0][1], body: SEED[0][2] },
      grok: { id: "p6", title: SEED[5][1], body: SEED[5][2] },
      zcode: { id: null, title: "", body: zh ? "回答前先复述需求；不确定的地方先提问，再动手。" : "Restate the request before answering; ask about anything unclear before starting." },
    },
    ops: new Map(),
  };
  let lastId = SEED.length;
  const nextId = () => `p${++lastId}`;
  const summary = (p) => {
    const { content: _c, ...rest } = p;
    return rest;
  };

  const FILES = {
    claude: { prompt: "~/.claude/keysmith/claude-project-rules.md", config: "~/.claude/CLAUDE.md" },
    codex: { prompt: "~/.codex/gpt-unrestricted.md", config: "~/.codex/config.toml" },
    grok: { prompt: "~/.grok/rules/99-keysmith.md", config: "~/.grok/config.toml" },
    zcode: { prompt: "~/.zcode-keysmith/system-role.md", config: "~/.zcode-keysmith/config.json" },
  };
  const envelope = (tool, command, over = {}) => ({
    schema: "keysmith-switch/adapter-v1",
    tool,
    command,
    ok: true,
    preview: true,
    available: true,
    unavailableReason: null,
    adapterVersion: { claude: "7.2", codex: "0.6.0", grok: "0.7.0", zcode: "0.3.2" }[tool],
    cliPath: null,
    argv: [],
    exitCode: 0,
    status: store.live[tool] ? "active" : "inactive",
    recoveryRequired: false,
    scopes: [{ id: "user", supported: true, reason: null }],
    targetPaths: [{ path: FILES[tool].prompt, role: "prompt", exists: true }],
    plannedFiles: [
      { path: FILES[tool].prompt, action: "write", detail: "" },
      { path: FILES[tool].config, action: "write", detail: "" },
    ],
    backups: [{ target: FILES[tool].config, backupPath: `~/.keysmith-switch/backups/op/${tool}.bak`, planned: true }],
    conflicts: [],
    warnings: [],
    blockers: [],
    currentFingerprint: "3f9a1c7e52d4",
    targetFingerprint: "b81e04d9a6c2",
    doctor: { ok: true, checks: [] },
    reloadRequired: true,
    reloadHint: null,
    error: null,
    redactedStderr: "",
    ...over,
  });

  const settings = {
    language: zh ? "zh-CN" : "en",
    updateChannel: "stable",
    advancedToolsEnabled: false,
    defaultClaudeScope: "user",
    recentProjectDirs: [],
    updaterEndpointOverride: null,
    autoCheckUpdates: true,
    theme: "system",
    firstRunCompleted: true,
    extensionsEnabled: false,
  };

  // Announcements: real release items from the public feed, none pinned.
  const annMarks = { read: new Set(), dismissed: new Set() };
  const annItems = zh
    ? [
        { id: "2026-10-v0.6.3", kind: "release", publishedAt: "2026-10-09T16:49:29Z", title: "v0.6.3：Windows 上切换不再卡顿", body: "修复 Windows 上点切换入口、进设置页时卡顿甚至无响应；操作被拒绝时会直接写出原因。", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.6.3" },
        { id: "2026-10-v0.6.0", kind: "release", publishedAt: "2026-10-07T23:19:49Z", title: "v0.6.0：输入替换支持 Grok Build", body: "Claude Code、Codex、ZCode、Grok Build 四个 Agent 都可以使用输入替换了。", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.6.0" },
        { id: "2026-10-v0.4.0", kind: "release", publishedAt: "2026-10-06T13:28:15Z", title: "v0.4.0：新模块「输入替换」", body: "照常打字，发给模型前按你的规则替换字面文字，输入框和会话历史仍显示原文。", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.4.0" },
      ]
    : [
        { id: "2026-10-v0.6.3", kind: "release", publishedAt: "2026-10-09T16:49:29Z", title: "v0.6.3: no more stalls when switching on Windows", body: "Switching agents and opening Settings on Windows no longer stalls, and refused operations now say why.", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.6.3" },
        { id: "2026-10-v0.6.0", kind: "release", publishedAt: "2026-10-07T23:19:49Z", title: "v0.6.0: input rewrite for Grok Build", body: "Input rewrite now works with all four agents: Claude Code, Codex, ZCode and Grok Build.", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.6.0" },
        { id: "2026-10-v0.4.0", kind: "release", publishedAt: "2026-10-06T13:28:15Z", title: "v0.4.0: input rewrite", body: "Type as usual; your rules replace literal text before the model sees it, while the input box and history keep what you typed.", link: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases/tag/v0.4.0" },
      ];
  const annView = () => {
    const items = annItems.map((it) => ({ ...it, pinned: false, tools: [], read: annMarks.read.has(it.id), dismissed: annMarks.dismissed.has(it.id) }));
    return { items, unread: items.filter((i) => !i.read).length, fetchedAt: now(), error: null };
  };

  // Extensions: the four official prompt packs as published in the real index.
  const extPacks = ["claude", "codex", "grok", "zcode"].map((tool) => ({
    id: `keysmith.${tool}`,
    kind: "prompts",
    version: "0.2.1",
    minAppVersion: "0.2.5",
    name: { claude: "Claude Keysmith", codex: "Codex Keysmith", grok: "Grok Keysmith", zcode: "ZCode Keysmith" }[tool],
    description: "",
    tools: [tool],
    itemCount: 1,
    size: { claude: 3075, codex: 4267, grok: 9129, zcode: 6334 }[tool],
    official: true,
    compatible: true,
    installedVersion: null,
    updateAvailable: false,
  }));
  const extView = () => ({ packs: extPacks.map((p) => ({ ...p })), updates: 0, error: null, checkedAt: now() });

  const rewrite = {
    enabled: true,
    codexEnabled: true,
    tables: [
      {
        id: "user",
        kind: "user",
        title: "",
        enabled: true,
        priority: 0,
        packId: null,
        packVersion: null,
        tools: null,
        rules: zh ? [{ from: "星火项目", to: "项目 A" }] : [{ from: "Project Falcon", to: "the project" }],
        pending: null,
      },
    ],
    link: { state: "unlinked" },
    claudeLink: { state: "unlinked" },
    zcodeLink: { state: "unlinked" },
    grokLink: { state: "unlinked" },
    running: false,
  };
  const rewriteView = () => ({
    enabled: rewrite.enabled,
    codexEnabled: rewrite.codexEnabled,
    claudeEnabled: true,
    grokEnabled: true,
    zcodeEnabled: true,
    tables: rewrite.tables,
    claude: { link: rewrite.claudeLink, service: { installed: rewrite.running, running: rewrite.running }, upstreamHost: "api.anthropic.com", unsupported: null, settingsPath: "~/.claude/settings.json" },
    grok: { link: rewrite.grokLink, service: { installed: rewrite.running, running: rewrite.running }, hosts: ["cli-chat-proxy.grok.com"], unsupported: null, configPath: "~/.grok/config.toml" },
    zcode: { link: rewrite.zcodeLink, service: { installed: rewrite.running, running: rewrite.running }, providers: [{ name: "Gateway", host: "gateway.example.com" }], unsupported: null, configPath: "~/.zcode/v2/provider_config.json" },
    codex: { link: rewrite.link, service: { installed: rewrite.running, running: rewrite.running }, provider: { id: "custom", name: "custom", baseUrl: "https://gateway.example.com/v1" }, unsupported: null, codexDir: "~/.codex" },
  });

  let claudeMemoryBytes = 1342;
  const snapshots = [];

  const notes063 = zh
    ? "Keysmith Switch v0.6.3：修复 Windows 上切换入口、打开设置时卡顿；操作被拒绝时直接写出原因；Grok Build 清理后不再一直显示「部署中」；连接输入替换后，Grok 自定义模型不再发出登录令牌。"
    : "Keysmith Switch v0.6.3: switching agents and opening Settings on Windows no longer stalls; refused operations say why; Grok Build no longer shows “Deployed” after a cleanup; with input rewrite connected, Grok custom models no longer send the sign-in token.";

  async function handle(cmd, args) {
    switch (cmd) {
      case "get_settings":
        return settings;
      case "update_settings":
        Object.assign(settings, args.patch ?? args);
        return settings;
      case "announcements_state":
        return annView();
      case "announcements_refresh":
        return delay(annView(), 500);
      case "announcements_mark":
        for (const id of args.ids ?? []) {
          annMarks.read.add(id);
          if (args.dismiss) annMarks.dismissed.add(id);
        }
        return annView();
      case "extensions_state":
        return extView();
      case "extensions_refresh":
        return delay(extView(), 900);
      case "extension_install": {
        const pack = extPacks.find((p) => p.id === args.packId);
        pack.installedVersion = pack.version;
        return delay({ view: extView(), report: { added: pack.itemCount, updated: 0, copied: 0, linked: 0, kept: 0, removed: 0 } }, 1000);
      }
      case "extension_uninstall": {
        const pack = extPacks.find((p) => p.id === args.packId);
        pack.installedVersion = null;
        return delay({ view: extView(), report: { added: 0, updated: 0, copied: 0, linked: 0, kept: 0, removed: 1 } }, 600);
      }
      case "extension_preview_rules":
        return delay([], 300);
      case "rewrite_state":
        return rewriteView();
      case "rewrite_set_switches":
        if (args.enabled !== undefined) rewrite.enabled = args.enabled;
        if (args.codexEnabled !== undefined) rewrite.codexEnabled = args.codexEnabled;
        return rewriteView();
      case "rewrite_save_user_rules":
        rewrite.tables[0] = { ...rewrite.tables[0], rules: args.rules };
        return delay(rewriteView(), 120);
      case "rewrite_connect_codex":
        rewrite.link = { state: "linked", provider: "custom" };
        rewrite.running = true;
        return delay(rewriteView(), 800);
      case "rewrite_disconnect_codex":
        rewrite.link = { state: "unlinked" };
        return delay(rewriteView(), 500);
      case "rewrite_connect_claude":
        rewrite.claudeLink = { state: "linked" };
        rewrite.running = true;
        return delay(rewriteView(), 700);
      case "rewrite_disconnect_claude":
        rewrite.claudeLink = { state: "unlinked" };
        return delay(rewriteView(), 500);
      case "rewrite_connect_zcode":
        rewrite.zcodeLink = { state: "linked", unrouted: 0 };
        rewrite.running = true;
        return delay(rewriteView(), 700);
      case "rewrite_disconnect_zcode":
        rewrite.zcodeLink = { state: "unlinked" };
        return delay(rewriteView(), 500);
      case "rewrite_connect_grok":
        rewrite.grokLink = { state: "linked", unrouted: 0 };
        rewrite.running = true;
        return delay(rewriteView(), 700);
      case "rewrite_disconnect_grok":
        rewrite.grokLink = { state: "unlinked" };
        return delay(rewriteView(), 500);
      case "rewrite_set_table_tools":
        rewrite.tables = rewrite.tables.map((t) => (t.id === args.id ? { ...t, tools: args.tools } : t));
        return rewriteView();
      case "rewrite_set_table_enabled":
        rewrite.tables = rewrite.tables.map((t) => (t.id === args.id ? { ...t, enabled: args.enabled } : t));
        return rewriteView();
      case "rewrite_reorder_tables":
      case "rewrite_copy_to_user":
      case "rewrite_accept_update":
        return rewriteView();
      case "get_about":
        return {
          app: { name: "Keysmith Switch", version: "0.6.2", channel: "stable", preview: false, signed: false, identifier: "com.jia-ethan.keysmith-switch", website: "", github: "" },
          adapters: [
            { tool: "claude", version: "7.2", bundled: true, path: null },
            { tool: "codex", version: "0.6.0", bundled: true, path: null },
            { tool: "grok", version: "0.7.0", bundled: true, path: null },
            { tool: "zcode", version: "0.3.2", bundled: true, path: null },
          ],
          official: [],
        };
      case "get_startup_report":
        return { firstRun: false, candidates: [], recovery: null, sidecar: { pythonRequired: false, tools: [] } };
      case "list_tools":
        return { tools: ["claude", "codex", "grok", "zcode"].map((id) => ({ id, name: id, adapterVersion: envelope(id, "x").adapterVersion, available: true, unavailableReason: null, supportedScopes: ["user"], cliPath: null })) };
      case "harness_state": {
        const live = store.live[args.tool];
        return delay({ tool: args.tool, deployed: Boolean(live), error: null, promptId: live?.id ?? null, promptTitle: live?.id ? live.title : null }, 320);
      }
      case "tool_status":
        return envelope(args.tool, "status", { preview: false });
      case "adopt_live_prompt": {
        const live = store.live[args.tool];
        const created = { id: nextId(), tool: args.tool, title: args.title, content: live.body, tags: [], active: false, lastUsedAt: null, updatedAt: now(), createdAt: now(), excerpt: live.body.slice(0, 80) };
        store.prompts.push(created);
        live.id = created.id;
        live.title = created.title;
        return delay(created, 420);
      }
      case "update_prompt": {
        const p = store.prompts.find((x) => x.id === args.id);
        Object.assign(p, { title: args.title ?? p.title, content: args.content ?? p.content, tags: args.tags ?? p.tags, updatedAt: now() });
        if (store.live[p.tool]?.id === p.id) store.live[p.tool].title = p.title;
        return p;
      }
      case "list_prompts": {
        let list = store.prompts.filter((p) => p.tool === args.tool);
        if (args.query) list = list.filter((p) => (p.title + p.content + p.tags.join(" ")).toLowerCase().includes(String(args.query).toLowerCase()));
        if (args.tag) list = list.filter((p) => p.tags.includes(args.tag));
        if (args.sort === "updated") list = [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        else list = [...list].sort((a, b) => ((a.lastUsedAt ?? "") < (b.lastUsedAt ?? "") ? 1 : -1));
        return delay({ prompts: list.map(summary) }, 180);
      }
      case "list_activations": {
        const live = store.live[args.tool];
        return { activations: live?.id ? [{ id: "a1", tool: args.tool, promptId: live.id, promptTitle: live.title, scope: "user", projectDir: null, active: true, createdAt: now(), fingerprint: null }] : [] };
      }
      case "list_operations":
        return { operations: [] };
      case "get_prompt":
        return store.prompts.find((p) => p.id === args.id);
      case "prompt_history": {
        const p = store.prompts.find((x) => x.id === args.id);
        return { versions: [{ version: 2, createdAt: p?.updatedAt ?? now(), title: p?.title ?? "", summary: null }, { version: 1, createdAt: p?.createdAt ?? now(), title: p?.title ?? "", summary: null }] };
      }
      case "prompt_diff":
        return { unified: "", summary: "" };
      case "create_pasted_prompt":
      case "create_prompt": {
        const created = { id: nextId(), tool: args.tool, title: args.title, content: args.content, tags: args.tags ?? [], active: false, lastUsedAt: null, updatedAt: now(), createdAt: now(), excerpt: String(args.content).slice(0, 80) };
        store.prompts.push(created);
        return delay(created, 160);
      }
      case "copy_prompt": {
        const src = store.prompts.find((p) => p.id === args.id);
        const created = { ...src, id: nextId(), tool: args.targetTool, lastUsedAt: null, updatedAt: now(), createdAt: now() };
        store.prompts.push(created);
        return delay(created);
      }
      case "delete_prompt":
        store.prompts = store.prompts.filter((p) => p.id !== args.id);
        return delay({ ok: true });
      case "plan_activate": {
        const p = store.prompts.find((x) => x.id === args.promptId);
        const operationId = `op${store.ops.size + 1}`;
        store.ops.set(operationId, { kind: "activate", tool: p.tool, promptId: p.id });
        return delay({ operationId, envelope: envelope(p.tool, "plan-activate") }, 380);
      }
      case "plan_deactivate": {
        const operationId = `op${store.ops.size + 1}`;
        store.ops.set(operationId, { kind: "deactivate", tool: args.tool, promptId: null });
        return delay({ operationId, envelope: envelope(args.tool, "plan-deactivate") }, 300);
      }
      case "activate":
      case "deactivate": {
        const op = store.ops.get(args.operationId);
        if (op.kind === "activate") {
          const p = store.prompts.find((x) => x.id === op.promptId);
          store.live[op.tool] = { id: p.id, title: p.title, body: p.content };
          p.lastUsedAt = now();
        } else delete store.live[op.tool];
        return delay({ operationId: args.operationId, envelope: envelope(op.tool, cmd, { preview: false }) }, 700);
      }
      case "plan_cleanup": {
        const tool = args.tool;
        const live = store.live[tool];
        // What a cleanup lists for each agent, after the tables in src-tauri/src/cleanup.rs.
        const EXTRAS = {
          claude: [
            [".claude/rules", 4, 6144, "saved"],
            [".claude/skills", 9, 18432, "saved"],
            [".claude/settings.json", 1, 1180, "saved-without-login"],
            [".claude/projects", 312, 12582912, "erased"],
          ],
          codex: [
            [".codex/rules", 3, 4096, "saved"],
            [".codex/skills", 6, 12288, "saved"],
            [".codex/sessions", 284, 10485760, "erased"],
          ],
          grok: [
            [".grok/rules", 2, 3072, "saved"],
            [".grok/skills", 5, 9216, "saved"],
            [".grok/config.toml", 1, 940, "saved-without-login"],
            [".grok/sessions", 128, 6291456, "erased"],
          ],
          zcode: [
            [".zcode/skills", 7, 14336, "saved"],
            [".zcode/commands", 3, 2048, "saved"],
            [".zcode/v2/provider_config.json", 1, 860, "saved-without-login"],
            [".zcode/cli/db", 41, 8388608, "erased"],
          ],
        };
        const extras = EXTRAS[tool].map(([name, files, bytes, kind]) => ({ name, path: `/Users/you/${name}`, files, bytes, kind }));
        const memoryFile = { claude: ".claude/CLAUDE.md", codex: ".codex/AGENTS.md" }[tool];
        const memory = memoryFile && (tool !== "claude" || claudeMemoryBytes > 0) ? { path: `/Users/you/${memoryFile}`, bytes: tool === "claude" ? claudeMemoryBytes : 2210, lines: tool === "claude" ? 31 : 48, sha256: "m1", mode: 420 } : null;
        const memories = tool === "codex" ? { path: "/Users/you/.codex/memories", files: 2778, bytes: 41943040 } : null;
        return delay({ operationId: `cleanup-${tool}`, tool, deployment: { present: Boolean(live), title: live?.title || null, restorable: Boolean(live) }, memory, memories, extras, loginInKeychain: tool === "claude" || tool === "codex" || tool === "zcode", agentRunning: false, nothingToDo: false, blockers: [] }, 450);
      }
      case "confirm_cleanup": {
        const tool = String(args.operationId).replace("cleanup-", "");
        const live = store.live[tool];
        const id = `20261010T0${snapshots.length + 1}2000Z-${tool}-a1b2c3`;
        snapshots.unshift({
          id,
          createdAt: now(),
          tool,
          kind: "cleanup",
          deployment: { present: Boolean(live), title: live?.title || null, restorable: Boolean(live) },
          memory: tool === "claude" ? { path: "/Users/you/.claude/CLAUDE.md", bytes: claudeMemoryBytes, lines: 31, sha256: "m1", mode: 420 } : null,
          extras: [
            { name: `.${tool}/rules`, files: 4, bytes: 6144, kind: "saved" },
            { name: `.${tool}/skills`, files: 9, bytes: 18432, kind: "saved" },
          ],
        });
        delete store.live[tool];
        if (tool === "claude") claudeMemoryBytes = 0;
        return delay({ snapshotId: id, deactivated: Boolean(live), memoryCleared: tool === "claude", memoriesCleared: false }, 1000);
      }
      case "list_snapshots":
        return snapshots;
      case "plan_rollback": {
        const snap = snapshots.find((s) => s.id === args.snapshotId);
        const live = store.live[snap.tool];
        return delay({ operationId: `rollback-${snap.id}`, snapshot: snap, currentTitle: live?.title || null, replacesDeployment: Boolean(live), memory: snap.memory ? { restoreBytes: snap.memory.bytes, currentBytes: claudeMemoryBytes, currentDiffers: true } : null, memories: null, extras: 2, agentRunning: false, savesCurrent: Boolean(live) || claudeMemoryBytes > 0, blockers: [] }, 400);
      }
      case "confirm_rollback": {
        const snap = snapshots.find((s) => `rollback-${s.id}` === args.operationId);
        if (snap.deployment.present) store.live[snap.tool] = { id: null, title: snap.deployment.title || "", body: "" };
        if (snap.memory) claudeMemoryBytes = snap.memory.bytes;
        return delay({ savedSnapshotId: null, redeployed: snap.deployment.present, memoryRestored: Boolean(snap.memory), memoriesRestored: false, extrasRestored: 2 }, 900);
      }
      case "delete_snapshot": {
        const i = snapshots.findIndex((s) => s.id === args.snapshotId);
        if (i >= 0) snapshots.splice(i, 1);
        return { ok: true };
      }
      case "check_app_update":
        return delay(
          {
            available: true,
            currentVersion: "0.6.2",
            latestVersion: "0.6.3",
            notes: notes063,
            size: 43319807,
            channel: "stable",
            restartRequired: true,
            progress: null,
            error: null,
            releasePage: "https://github.com/Jia-Ethan/keysmith-switch-releases/releases",
            installMode: "inApp",
            reason: null,
          },
          900,
        );
      default:
        return {};
    }
  }

  window.__TAURI_INTERNALS__ = {
    invoke: (cmd, args) => handle(cmd, args || {}),
    transformCallback: () => 0,
    unregisterCallback: () => {},
    convertFileSrc: (p) => p,
    metadata: { currentWindow: { label: "main" }, currentWebview: { label: "main", windowLabel: "main" } },
  };
  window.__TAURI_EVENT_PLUGIN_INTERNALS__ = { unregisterListener: () => {} };
}
