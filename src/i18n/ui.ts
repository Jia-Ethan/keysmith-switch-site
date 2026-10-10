export const LANGS = ["zh", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** Rich headline: plain text, `em` (italic in English, accent in Chinese), `brush` (highlighter). */
export type Seg = { t: string; em?: boolean; brush?: boolean };

const zh = {
  htmlLang: "zh-CN",
  ogLocale: "zh_CN",
  langName: "中文",
  meta: {
    siteName: "Keysmith Switch",
    title: "Keysmith Switch — AI 编程 Agent 的提示词管理器",
    description:
      "Keysmith Switch 是一个桌面 App，管好你所有 AI 编程 Agent 的提示词：粘贴提示词，先看部署计划，确认后部署到 Claude Code、Codex、Grok Build 和 ZCode。",
  },
  nav: {
    skip: "跳到正文",
    product: "产品",
    download: "下载",
    changelog: "更新日志",
    docs: "文档",
    docsIndex: "文档",
    help: "帮助",
    community: "社区",
    github: "GitHub",
    discussions: "讨论区",
    linuxdo: "LINUX DO",
    getHelp: "获取帮助",
    cta: "下载 Keysmith Switch",
    ctaShort: "下载",
    menu: "菜单",
    theme: "主题",
    themeLight: "浅色",
    themeDark: "深色",
    themeToggle: "切换浅色 / 深色",
    language: "语言",
    stars: "GitHub 星标",
  },
  hero: {
    kicker: "Keysmith Switch，AI 编程 Agent 的提示词管理器",
    title: [
      { t: "四个 Agent。" },
      { t: "一个提示词库。", em: true },
      { t: "先看", brush: true },
      { t: "，再部署。", em: true },
    ] as Seg[],
    allDownloads: "全部下载",
  },
  dl: {
    mac: "免费下载 macOS 版",
    win: "免费下载 Windows 版",
    any: "免费下载",
    hintMac: "Apple Silicon / macOS 12+",
    hintWin: "Windows 10 / 11 / x64",
  },
  film: {
    label: "产品短片",
    pause: "暂停",
    play: "播放",
    chapters: [
      [{ t: "一个库，" }, { t: "四个 Agent。", em: true }],
      [{ t: "粘贴提示词，" }, { t: "先看部署计划。", em: true }],
      [{ t: "⌘K，" }, { t: "想做什么都在这里。", em: true }],
      [{ t: "清理之前，" }, { t: "先存一个版本。", em: true }],
    ] as Seg[][],
  },
  tour: {
    heading: "Keysmith Switch 功能导览",
    pause: "暂停",
    play: "播放",
    fullscreen: "全屏",
    items: [
      {
        id: "agents",
        title: "一个库，管四个 Agent",
        body: "提示词按 Agent 分开管理，带标签、搜索和排序。在左侧一键切换，整个窗口跟着换成那个 Agent 的颜色。",
      },
      {
        id: "plan",
        title: "部署前先看计划",
        body: "每次部署都先告诉你：现在用的是什么、部署后变成什么、会备份什么。你确认之后才会写入。",
      },
      {
        id: "cleanup",
        title: "清理之前先存版本",
        body: "「清理」把 Agent 清回空白，动手前先存一个版本。设置里的「版本」页可以回滚，回滚本身也能撤销。",
      },
      {
        id: "palette",
        title: "⌘K 直达任何操作",
        body: "新建提示词、切换 Agent、部署某一条，键盘就能完成。",
      },
      {
        id: "rewrite",
        title: "输入替换",
        body: "照常打字，发给模型前按你的规则替换；输入框和历史里仍是原文。每个 Agent 单独连接，随时可以断开。",
      },
      {
        id: "extensions",
        title: "拓展包",
        body: "可选的官方提示词包，独立于 App 更新。安装只会放进提示词库，不会自动部署。",
      },
      {
        id: "adopt",
        title: "收下机器上已有的提示词",
        body: "Agent 里已经生效、但不在库里的提示词，会显示为「现在正在用的提示词」。收入库后就能编辑，也能保留历史版本。",
      },
      {
        id: "updates",
        title: "公告与应用内更新",
        body: "铃铛里看公告，重要的会置顶。有新版本时设置处出现红点，点一下就能更新，装不装由你确认。",
      },
    ],
  },
  belt: {
    heading: "GitHub 上的 Keysmith 系列",
  },
  principles: {
    title: [{ t: "它会改什么，" }, { t: "都先告诉你。", em: true }] as Seg[],
    items: [
      {
        title: "适配器负责写",
        body: "部署和停用都由各 Agent 的开源适配器写入。Switch 负责管理提示词库、版本、部署计划和操作记录。",
      },
      {
        title: "写入前先备份",
        body: "部署前自动备份，清理和回滚前先存版本。停用、断开时只还原 Switch 自己写过的部分。",
      },
      {
        title: "不暗中改写",
        body: "交给适配器的只有提示词正文。相同正文复用已有条目，不会悄悄改它的标题和标签。",
      },
      {
        title: "提示词不出本机",
        body: "提示词来自你粘贴的内容或本地文件，不会上传，也没有统计或遥测。App 会联网的每一种情况都列在文档里。",
      },
    ],
    more: "工作原理详见文档",
  },
  cards: {
    title: [{ t: "一个提示词库，" }, { t: "按各家的格式写入。", em: true }] as Seg[],
    platforms: "macOS · Windows",
    source: "适配器源码",
    filesLabel: "会碰到的文件",
    more: "各 Agent 的写入细节",
    agents: {
      claude: {
        who: "在用户级 CLAUDE.md 里放一段托管导入",
        yes: [
          "提示词写进 ~/.claude/keysmith/，CLAUDE.md 里加一段带标记的导入块",
          "停用时只移除这一段，你写的其他内容不动",
          "清理可以清空 CLAUDE.md，要先勾选确认，动手前存版本",
          "输入替换只改 settings.json 里的一项地址",
        ],
        no: ["输入替换不支持 Bedrock 和 Vertex"],
        files: ["CLAUDE.md", "keysmith/", "settings.json"],
      },
      codex: {
        who: "通过 config.toml 的 model_instructions_file 生效",
        yes: [
          "提示词放进 ~/.codex/，config.toml 写入 model_instructions_file",
          "写入前备份 config.toml；会干扰加载的 hooks.json 先隔离并留备份",
          "清理可以清空 AGENTS.md；memories 文件夹要单独勾选",
          "输入替换新增一个 provider，原来的不改",
        ],
        no: ["输入替换需要使用自定义 provider"],
        files: ["config.toml", "AGENTS.md", "memories/", "hooks.json"],
      },
      grok: {
        who: "写进每个会话都会读取的 home rules",
        yes: [
          "提示词写进 ~/.grok/rules/99-keysmith.md，每个 Grok 会话都会读取",
          "在 config.toml 里用一段标记关闭 Claude / Cursor 兼容层，并隔离 hooks",
          "停用时只移除自己写入的文件和标记段",
          "输入替换在一对标记之间为每个模型写入转发地址",
        ],
        no: ["输入替换要先运行一次 Grok，让它拉取模型列表"],
        files: ["rules/99-keysmith.md", "config.toml", "hooks/"],
      },
      zcode: {
        who: "作为真正的 system 角色生效",
        yes: [
          "提示词写进 ~/.zcode-keysmith/system-role.md，作为 system 角色生效",
          "新版 ZCode 需要改动它自带的一个文件，改之前先备份，停用时还原",
          "会设置几项环境变量，停用时恢复原来的值",
          "输入替换改 provider_config.json 里的服务地址",
        ],
        no: ["输入替换不支持账号登录的 Coding Plan"],
        files: ["system-role.md", "provider_config.json"],
      },
    },
  },
  footer: {
    blurb:
      "Keysmith Switch 是一个桌面 App，管好你所有 AI 编程 Agent 的提示词：粘贴提示词，先看部署计划，确认后部署到 Claude Code、Codex、Grok Build 和 ZCode。",
    product: "产品",
    tour: "产品导览",
    extensions: "拓展包",
    resources: "资源",
    releases: "全部版本",
    source: "源码",
    keysmith: "Keysmith 系列",
    community: "社区",
    rights: "源码公开，按 PolyForm Noncommercial 1.0.0 授权。",
    license: "许可",
    privacy: "隐私",
    notices: "第三方声明",
  },
  download: {
    title: "下载",
    h1: [{ t: "Keysmith Switch，" }, { t: "适用于 macOS 与 Windows", em: true }] as Seg[],
    lead: "原生桌面应用，支持 macOS 与 Windows。四个 Agent 的适配器都已装在 App 里，装好就能用，不需要另外安装任何东西。",
    noteLead: "不用注册，也不用登录。",
    note: "装好打开就能用。提示词库保存在本机的 ~/.keysmith-switch/，卸载 App 也不会删除它。",
    tourLink: "看看产品导览",
    pick: "选择平台",
    macTitle: "macOS",
    winTitle: "Windows",
    intelTitle: "Intel Mac",
    linuxTitle: "Linux",
    notYet: "暂不提供",
    macSpec: "Apple Silicon / macOS 12+",
    winSpec: "Windows 10 / 11 / x64",
    other: "历史版本",
    allReleases: "全部版本",
    insideTitle: "装好之后有什么",
    inside: [
      {
        title: "一个提示词库",
        body: "按 Agent 分开管理，带标签、搜索和编辑历史。第一次打开时，会找出机器上已有的 Keysmith 提示词，让你选择导入。",
      },
      {
        title: "四个内置适配器",
        body: "Claude Code、Codex、Grok Build、ZCode 的适配器都随 App 一起安装和更新，不需要单独下载。",
      },
      {
        title: "应用内更新",
        body: "有新版本时设置处出现红点，点一下就能更新，装不装由你确认。提示词库不受影响。",
      },
    ],
    firstOpen: [
      {
        label: "macOS / 第一次打开",
        body: "第一次打开时，macOS 可能提示无法打开，或无法验证开发者。打开「系统设置 → 隐私与安全性」，在页面下方找到 Keysmith Switch，点「仍要打开」并确认，之后就能正常打开。macOS 14 及更早版本也可以在「应用程序」里右键点它，选「打开」。",
      },
      {
        label: "Windows / 安装提示",
        body: "Windows 可能弹出「Windows 已保护你的电脑」。点「更多信息」，再点「仍要运行」即可。它装在你自己的用户目录下，不需要管理员权限。",
      },
      {
        label: "杀毒软件 / 误报",
        body: "少数杀毒软件可能把 Keysmith Switch 误报为病毒。从本页下载的就是误报：在杀毒软件的隔离区里恢复文件，再把 Keysmith Switch 加入信任区（白名单）即可。不确定的话，到 GitHub 上留言问我们。",
      },
    ],
    signNote: "安装包只在本页和 GitHub 上的官方发布页提供。从其他地方拿到的安装包，请不要打开。",
    agentTitle: "复制给智能体安装",
    agentPrompt:
      "请先阅读 https://github.com/Jia-Ethan/keysmith-switch 的 README 与发布边界，再从公开 Releases 安装当前稳定版。操作前检查系统架构、现有版本和数据目录，列出准确的下载、安装与备份路径；覆盖现有应用或写入托管配置前等待确认。安装后最小验证安装包 SHA-256、应用启动、既有提示词数据和“检查更新”。除非明确要求，不要从源码构建。",
    copy: "复制",
    copied: "已复制",
  },
  changelog: {
    title: "更新日志",
    lead: "Keysmith Switch 会在 App 里检查更新。下面每一条都是一个稳定版，写着和上一版相比改了什么。",
    latest: "下载最新版",
    stable: "稳定版",
    version: "版本",
    more: (n: number) => `还有 ${n} 条`,
    less: "收起",
    onGithub: "在 GitHub 上查看",
    downloads: "下载",
    langNote: "",
  },
  help: {
    title: "帮助",
    contents: "目录",
  },
  docs: {
    title: "Keysmith Switch 文档",
    search: "搜索文档",
    chapter: "第",
    chapterSuffix: "章",
    onThisPage: "本页内容",
    prev: "上一章",
    next: "下一章",
    edit: "文档有误或看不懂？到讨论区告诉我们",
    noResults: "没有找到",
  },
  notFound: {
    title: "这个页面不存在。",
    body: "链接可能过期了，或者地址里有错字。可以从这里继续：",
    home: "首页",
  },
  common: {
    newWindow: "（在新窗口打开）",
    stars: (n: string) => `${n} 颗星`,
  },
};

type Dict = typeof zh;

const en: Dict = {
  htmlLang: "en",
  ogLocale: "en_US",
  langName: "English",
  meta: {
    siteName: "Keysmith Switch",
    title: "Keysmith Switch — the prompt manager for your coding agents",
    description:
      "Keysmith Switch is a desktop app for your coding agents' prompts: paste one in, read the deploy plan, and confirm to deploy it to Claude Code, Codex, Grok Build or ZCode.",
  },
  nav: {
    skip: "Skip to content",
    product: "Product",
    download: "Download",
    changelog: "Changelog",
    docs: "Docs",
    docsIndex: "Documentation",
    help: "Help",
    community: "Community",
    github: "GitHub",
    discussions: "Discussions",
    linuxdo: "LINUX DO",
    getHelp: "Get help",
    cta: "Get Keysmith Switch",
    ctaShort: "Download",
    menu: "Menu",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeToggle: "Switch between light and dark",
    language: "Language",
    stars: "GitHub stars",
  },
  hero: {
    kicker: "Keysmith Switch, the prompt manager for your coding agents",
    title: [
      { t: "Four agents. " },
      { t: "One prompt library. ", em: true },
      { t: "Look", em: true, brush: true },
      { t: " before you deploy.", em: true },
    ],
    allDownloads: "All downloads",
  },
  dl: {
    mac: "Download free for macOS",
    win: "Download free for Windows",
    any: "Download free",
    hintMac: "Apple Silicon / macOS 12+",
    hintWin: "Windows 10 / 11 / x64",
  },
  film: {
    label: "Product film",
    pause: "Pause",
    play: "Play",
    chapters: [
      [{ t: "One library, " }, { t: "four agents.", em: true }],
      [{ t: "Paste a prompt, " }, { t: "read the plan first.", em: true }],
      [{ t: "⌘K, " }, { t: "and it's right there.", em: true }],
      [{ t: "Clean up, " }, { t: "with a version saved first.", em: true }],
    ],
  },
  tour: {
    heading: "A tour of Keysmith Switch",
    pause: "Pause",
    play: "Play",
    fullscreen: "Full screen",
    items: [
      {
        id: "agents",
        title: "One library for four agents",
        body: "Prompts are kept per agent, with tags, search and sorting. Switch agents from the rail and the whole window takes on that agent's color.",
      },
      {
        id: "plan",
        title: "See the plan before anything is written",
        body: "Every deploy starts with a plan: what the agent uses now, what it will use after, and what gets backed up. Nothing is written until you confirm.",
      },
      {
        id: "cleanup",
        title: "Clean up, with a version saved first",
        body: "Clean up returns an agent to a blank slate and saves a version first. Roll back from Settings → Versions; a rollback can be undone too.",
      },
      {
        id: "palette",
        title: "⌘K for everything",
        body: "Create a prompt, switch agents or deploy one, all from the keyboard.",
      },
      {
        id: "rewrite",
        title: "Input rewrite",
        body: "Type as usual. Your rules are applied before the model sees your words; the input box and history keep what you typed. Connect each agent on its own and disconnect any time.",
      },
      {
        id: "extensions",
        title: "Extension packs",
        body: "Optional official prompt packs that update apart from the app. Installing only adds prompts to your library; nothing is deployed for you.",
      },
      {
        id: "adopt",
        title: "Adopt what's already running",
        body: "A prompt that is live in an agent but not in your library shows up as “The prompt in use right now”. Add it to the library to edit it and keep its history.",
      },
      {
        id: "updates",
        title: "Announcements and in-app updates",
        body: "Announcements arrive under the bell, and important ones are pinned. A red dot in Settings means a new version is out; one click updates, and only when you say so.",
      },
    ],
  },
  belt: {
    heading: "The Keysmith family on GitHub",
  },
  principles: {
    title: [{ t: "Whatever it changes, " }, { t: "you see it first.", em: true }],
    items: [
      {
        title: "Adapters do the writing",
        body: "Deploys and turn-offs are written by each agent's open-source adapter. Switch looks after the library, versions, deploy plans and the record of what it did.",
      },
      {
        title: "Backed up before it's written",
        body: "Deploys back up first; cleanups and rollbacks save a version first. Turning off and disconnecting undo only what Switch wrote.",
      },
      {
        title: "No quiet edits",
        body: "Adapters receive only the prompt text. The same text reuses the existing entry instead of quietly changing its title or tags.",
      },
      {
        title: "Prompts stay on your computer",
        body: "Prompts come from what you paste or local files and are never uploaded. No analytics, no telemetry; every case where the app goes online is listed in the docs.",
      },
    ],
    more: "How it works, in the docs",
  },
  cards: {
    title: [{ t: "One prompt library, " }, { t: "written in each agent's own format.", em: true }],
    platforms: "macOS · Windows",
    source: "Adapter source",
    filesLabel: "Files it touches",
    more: "How each agent is written",
    agents: {
      claude: {
        who: "A managed import in your user-level CLAUDE.md",
        yes: [
          "The prompt goes in ~/.claude/keysmith/, imported by a marked block in CLAUDE.md",
          "Turning it off removes only that block; the rest of the file stays",
          "Clean up can empty CLAUDE.md, after you tick a box, with a version saved first",
          "Input rewrite changes only one address in settings.json",
        ],
        no: ["Input rewrite does not support Bedrock or Vertex"],
        files: ["CLAUDE.md", "keysmith/", "settings.json"],
      },
      codex: {
        who: "Loaded through model_instructions_file in config.toml",
        yes: [
          "The prompt goes in ~/.codex/ and config.toml gets model_instructions_file",
          "config.toml is backed up first; a hooks.json that would interfere is set aside with a backup",
          "Clean up can empty AGENTS.md; the memories folder needs its own checkbox",
          "Input rewrite adds a provider and leaves yours unchanged",
        ],
        no: ["Input rewrite needs a custom provider"],
        files: ["config.toml", "AGENTS.md", "memories/", "hooks.json"],
      },
      grok: {
        who: "Written to home rules that every session reads",
        yes: [
          "The prompt goes in ~/.grok/rules/99-keysmith.md, read by every Grok session",
          "A marked block in config.toml turns off the Claude / Cursor compat layers and sets hooks aside",
          "Turning it off removes only the file and block it wrote",
          "Input rewrite writes each model's forwarding address between a pair of markers",
        ],
        no: ["Input rewrite needs Grok to have run once and fetched its model list"],
        files: ["rules/99-keysmith.md", "config.toml", "hooks/"],
      },
      zcode: {
        who: "Applied as a true system role",
        yes: [
          "The prompt goes in ~/.zcode-keysmith/system-role.md and acts as the system role",
          "Newer ZCode builds need one of ZCode's own files changed; it's backed up first and restored when turned off",
          "A few environment variables are set and put back when turned off",
          "Input rewrite changes the service address in provider_config.json",
        ],
        no: ["Input rewrite does not support Coding Plan sign-in"],
        files: ["system-role.md", "provider_config.json"],
      },
    },
  },
  footer: {
    blurb:
      "Keysmith Switch is a desktop app for your coding agents' prompts: paste one in, read the deploy plan, and confirm to deploy it to Claude Code, Codex, Grok Build or ZCode.",
    product: "Product",
    tour: "Product tour",
    extensions: "Extension packs",
    resources: "Resources",
    releases: "All releases",
    source: "Source code",
    keysmith: "Keysmith",
    community: "Community",
    rights: "Source available under PolyForm Noncommercial 1.0.0.",
    license: "License",
    privacy: "Privacy",
    notices: "Third-party notices",
  },
  download: {
    title: "Download",
    h1: [{ t: "Keysmith Switch for " }, { t: "macOS and Windows", em: true }],
    lead: "A native desktop app for macOS and Windows. The adapters for all four agents come inside it, so it works as soon as it's installed; there's nothing else to set up.",
    noteLead: "No account, no sign-in.",
    note: "Install it and open it. Your library lives in ~/.keysmith-switch/ on your computer and stays there even if you uninstall the app.",
    tourLink: "See the product tour",
    pick: "Pick your platform",
    macTitle: "macOS",
    winTitle: "Windows",
    intelTitle: "Intel Mac",
    linuxTitle: "Linux",
    notYet: "Not available yet",
    macSpec: "Apple Silicon / macOS 12+",
    winSpec: "Windows 10 / 11 / x64",
    other: "Past releases",
    allReleases: "All releases",
    insideTitle: "What's inside",
    inside: [
      {
        title: "A prompt library",
        body: "Kept per agent, with tags, search and edit history. On first launch it finds Keysmith prompts already on your computer and lets you choose which to import.",
      },
      {
        title: "Four built-in adapters",
        body: "The adapters for Claude Code, Codex, Grok Build and ZCode install and update with the app; there's nothing to download separately.",
      },
      {
        title: "In-app updates",
        body: "A red dot in Settings means a new version is out. One click updates, and only when you say so. Your library stays as it is.",
      },
    ],
    firstOpen: [
      {
        label: "macOS / First launch",
        body: "The first time, macOS may say the app can't be opened or that its developer can't be verified. Open System Settings → Privacy & Security, find Keysmith Switch near the bottom, click Open Anyway and confirm. After that it opens normally. On macOS 14 and earlier you can also right-click it in Applications and choose Open.",
      },
      {
        label: "Windows / Install warning",
        body: "Windows may show “Windows protected your PC”. Click More info, then Run anyway. It installs into your own user folder and doesn't need administrator rights.",
      },
      {
        label: "Antivirus / False alarms",
        body: "A few antivirus programs may flag Keysmith Switch by mistake. If you downloaded it from this page, it's a false alarm: restore the file from quarantine and add Keysmith Switch to the trusted list (allowlist). Not sure? Ask us on GitHub.",
      },
    ],
    signNote: "Installers are only offered on this page and the official GitHub releases page. Don't open an installer you got anywhere else.",
    agentTitle: "Have your agent install it",
    agentPrompt:
      "Read the README and release boundaries at https://github.com/Jia-Ethan/keysmith-switch first, then install the current stable version from the public Releases. Before acting, check the system architecture, any existing version and the data folder, and list the exact download, install and backup paths; wait for confirmation before replacing an existing app or writing managed configuration. After installing, do a minimal check of the installer's SHA-256, that the app starts, that existing prompt data is intact, and “Check for updates”. Do not build from source unless asked.",
    copy: "Copy",
    copied: "Copied",
  },
  changelog: {
    title: "Changelog",
    lead: "Keysmith Switch checks for updates in the app. Each entry below is a stable release and what changed since the one before it.",
    latest: "Download latest build",
    stable: "Stable releases",
    version: "Version",
    more: (n: number) => `${n} more`,
    less: "Show less",
    onGithub: "View on GitHub",
    downloads: "Downloads",
    langNote: "Release notes are written in Chinese. Your browser can translate this page.",
  },
  help: {
    title: "Help",
    contents: "Contents",
  },
  docs: {
    title: "Keysmith Switch Documentation",
    search: "Search the docs",
    chapter: "Chapter",
    chapterSuffix: "",
    onThisPage: "On this page",
    prev: "Previous",
    next: "Next",
    edit: "Something wrong or unclear? Tell us in Discussions",
    noResults: "Nothing found",
  },
  notFound: {
    title: "This page doesn't exist.",
    body: "The link may be out of date, or the address may have a typo. Pick up from one of these:",
    home: "Home",
  },
  common: {
    newWindow: "(opens in a new window)",
    stars: (n: string) => `${n} stars`,
  },
};

export const ui: Record<Lang, Dict> = { zh, en };

export function t(lang: Lang): Dict {
  return ui[lang];
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Site path for a page in a language; `path` has no language prefix ("/download/"). */
export function href(lang: Lang, path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${lang === "zh" ? "" : "/en"}${p}`;
}

/** The same page in the other language. */
export function swapLang(pathname: string, to: Lang): string {
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;
  const bare = rel.replace(/^\/en(?=\/|$)/, "") || "/";
  return href(to, bare);
}

export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\//, "")}`;
}
