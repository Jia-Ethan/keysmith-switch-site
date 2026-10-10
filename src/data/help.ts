import type { Lang } from "../i18n/ui";

export type Qa = { q: string; a: string };
export type HelpSection = { id: string; title: string; items: Qa[] };

// Answers are short Markdown: paragraphs, "- " lists, **bold**, `code`, [links](/docs/...).
export const HELP: Record<Lang, HelpSection[]> = {
  zh: [
    {
      id: "quick",
      title: "快速解答",
      items: [
        {
          q: "支持哪些系统？",
          a: "macOS（Apple Silicon，macOS 12 及以上）和 Windows（10 / 11，x64）。暂时没有 Intel Mac 和 Linux 版本。",
        },
        {
          q: "支持哪些 Agent？",
          a: "Claude Code、Codex、Grok Build 和 ZCode。每个 Agent 由各自的开源适配器负责写入，见[各 Agent 的写入细节](/docs/agents/)。",
        },
        {
          q: "收费吗？",
          a: "不收费，没有订阅，也不用注册账号。源码按 PolyForm Noncommercial 1.0.0 公开：个人使用、学习和研究可以自由使用；商业使用需另行取得授权。",
        },
        {
          q: "需要装 Python 或别的依赖吗？",
          a: "不需要。四个适配器都已打包在 App 里。Switch 也不会替你安装 Agent 本身，Agent 请从各自的官方渠道安装。",
        },
        {
          q: "会改坏我的配置吗？",
          a: "每次写入前都会先给你看部署计划，确认后才写；写之前自动备份。停用时只还原 Switch 写过的部分，你自己写的内容不动。适配器发现不安全时会拒绝写入，并且不改动任何文件。",
        },
        {
          q: "我的提示词会被上传吗？",
          a: "不会。提示词只存在本机的 `~/.keysmith-switch/`。App 只在检查更新、读取公告时访问 GitHub；打开「拓展」后才会读取拓展源。完整列表见[数据与隐私](/docs/privacy/)。",
        },
        {
          q: "怎么确认下载的文件没被篡改？",
          a: "每个版本都附带 `SHA256SUMS.txt`，打开安装包之前比对一下哈希即可。命令见[快速上手](/docs/quickstart/)。",
        },
      ],
    },
    {
      id: "install",
      title: "安装与打开",
      items: [
        {
          q: "macOS 提示「无法打开」或「无法验证开发者」",
          a: "安装包没有经过 Apple 公证，第一次打开会被拦下。打开「系统设置 → 隐私与安全性」，在页面下方找到 Keysmith Switch，点「仍要打开」并确认。macOS 14 及更早版本也可以在「应用程序」里右键点它，选「打开」。只需要做一次。",
        },
        {
          q: "Windows 提示「Windows 已保护你的电脑」",
          a: "安装包没有 Authenticode 签名，SmartScreen 会提示。点「更多信息」，再点「仍要运行」。安装在当前用户目录，不需要管理员权限。",
        },
        {
          q: "杀毒软件报毒怎么办？",
          a: "适配器是用 PyInstaller 打包的 Python 程序，部分杀毒软件会启发式误报。请先用 `SHA256SUMS.txt` 核对安装包，确认来自官方 Releases；仍有疑问可以在 GitHub 上查看源码和构建流程。",
        },
        {
          q: "怎么更新？",
          a: "已安装 v0.1.3 及以上的版本，可以在 App 里检查更新，有新版本时设置处会出现红点；更新包安装前会先校验签名，装不装由你确认。也可以随时从[下载页](/download/)下载新版本覆盖安装，提示词库不会受影响。",
        },
        {
          q: "检查更新超时",
          a: "Windows 上从 v0.3.7 起会读取系统代理，设置了 `https_proxy` 或 `all_proxy` 时优先使用环境变量。更早的版本检查更新不走代理，请手动下载新版本安装一次，之后的更新就会正常。",
        },
        {
          q: "怎么卸载？",
          a: "macOS 把 App 移到废纸篓，Windows 在「设置 → 应用」里卸载。卸载不会删除 `~/.keysmith-switch/`；想连数据一起删，先在 App 设置里「清除全部数据」。卸载前建议先在 App 里停用各 Agent 的提示词、断开输入替换。",
        },
      ],
    },
    {
      id: "deploy",
      title: "部署与停用",
      items: [
        {
          q: "部署了，但 Agent 里没有生效",
          a: "部署后要**重启 Agent**：Claude Code、Codex、Grok Build 开一个新会话，ZCode 重新打开 App。已经打开的会话不会重新读取提示词。",
        },
        {
          q: "部署被拦下，提示配置被改过",
          a: "部署之后有人（或别的工具，例如 cc-switch）改过这个 Agent 的配置，这叫漂移。为了不覆盖你的修改，部署会被拦下。按弹窗提示操作：\n\n- 只是托管的几行被挪动：点「整理配置」；\n- 记录已经乱了：点「清理」从头开始（会删除这个 Agent 的登录和会话历史，先看清清理计划）。",
        },
        {
          q: "停用时提示找不到部署记录或备份",
          a: "如果部署前的配置备份已经不在（例如被清理删掉了），可以选「保留当前配置并停用」，只移除 Keysmith 写入的那一段。找不到部署记录时，可以用「清理」清掉过期的记录。",
        },
        {
          q: "Windows 上提示权限不足",
          a: "当前用户对 Agent 的主目录没有完全控制权限（Windows ACL 限制）。授予完全控制权限后重试。",
        },
        {
          q: "编辑了正在用的提示词，Agent 里没变",
          a: "保存只改库里的内容。要再部署一次，修改才会写进 Agent。保存后页面会提醒你。",
        },
        {
          q: "ZCode 部署失败",
          a: "请确认 ZCode 已经从官方渠道安装、至少打开过一次，并且用 API 登录（ZCode 只支持 API 登录）。部署被拒绝时，弹窗会写出适配器给出的具体原因。",
        },
      ],
    },
    {
      id: "cleanup",
      title: "清理与回滚",
      items: [
        {
          q: "清理会删掉什么？",
          a: "清理把 Agent 清回刚安装的样子：移除部署的提示词、你自己加的规则和配置；登录、会话历史、插件和缓存会直接删除，不保存。清理前会先列出全部内容，详见[清理与回滚](/docs/cleanup/)。",
        },
        {
          q: "清理之后还能找回来吗？",
          a: "可以找回大部分：清理前会先存一个版本，在「设置 → 版本」里回滚，提示词、记忆文件、规则和配置都会放回去。登录和会话历史不会回来，需要重新登录。",
        },
        {
          q: "清理时提示 Agent 正在运行",
          a: "先退出这个 Agent 再清理：它运行时，会话、记忆和登录正在使用中。",
        },
      ],
    },
    {
      id: "rewrite",
      title: "输入替换",
      items: [
        {
          q: "连接后 Agent 连不上模型",
          a: "输入替换页会显示每个 Agent 的状态。如果提示中转服务没在运行，点「重新连接」；也可以随时「断开」，Agent 会恢复直接连接。",
        },
        {
          q: "为什么显示「被绕过」？",
          a: "其他工具改过 Switch 写入的那一项，例如切换了 Codex 的 provider，或改了 Claude Code 的 `ANTHROPIC_BASE_URL`。点「重新连接」即可。",
        },
        {
          q: "为什么我的 Agent 不能连接？",
          a: "目前的限制：Claude Code 不支持 Bedrock 和 Vertex；Codex 需要自定义 provider（`wire_api = \"responses\"`）；ZCode 不支持账号登录的 Coding Plan；Grok Build 要先运行过一次。",
        },
      ],
    },
    {
      id: "feedback",
      title: "反馈与求助",
      items: [
        {
          q: "怎么反馈问题或提需求？",
          a: "在 App 的「设置 → 关于」里点「问题上报」或「提需求」，会打开预填好的 GitHub 表单，你检查后提交。也可以到 [GitHub Discussions](https://github.com/Jia-Ethan/keysmith-switch/discussions/3) 留言，或在 [LINUX DO](https://linux.do) 社区讨论。",
        },
        {
          q: "反馈时要注意什么？",
          a: "GitHub issue 是公开的。不要填写 token、cookie、私人路径、完整配置或提示词正文。安全漏洞请不要在 Discussion 中公开披露。",
        },
      ],
    },
  ],
  en: [
    {
      id: "quick",
      title: "Quick answers",
      items: [
        {
          q: "Which systems does it run on?",
          a: "macOS (Apple Silicon, macOS 12 or later) and Windows (10 / 11, x64). There's no Intel Mac or Linux build yet.",
        },
        {
          q: "Which agents does it support?",
          a: "Claude Code, Codex, Grok Build and ZCode. Each agent is written to by its own open-source adapter; see [How each agent is written](/en/docs/agents/).",
        },
        {
          q: "Does it cost anything?",
          a: "No. There's no subscription and no account. The source is available under PolyForm Noncommercial 1.0.0: free for personal use, learning and research; commercial use needs a separate license.",
        },
        {
          q: "Do I need Python or anything else?",
          a: "No. The four adapters ship inside the app. Switch doesn't install the agents themselves; get those from their official sources.",
        },
        {
          q: "Could it break my configuration?",
          a: "Every write starts with a plan you review, and nothing is written until you confirm. Everything is backed up first. Turning a prompt off undoes only what Switch wrote; your own content stays. When an adapter finds a write unsafe, it refuses and changes no files.",
        },
        {
          q: "Are my prompts uploaded?",
          a: "No. Prompts live only in `~/.keysmith-switch/` on your computer. The app talks to GitHub only to check for updates and read announcements, and reads the extension source only after you turn Extensions on. The full list is in [Data and privacy](/en/docs/privacy/).",
        },
        {
          q: "How do I check a download wasn't tampered with?",
          a: "Every release includes `SHA256SUMS.txt`; compare the hash before opening the installer. The commands are in the [Quickstart](/en/docs/quickstart/).",
        },
      ],
    },
    {
      id: "install",
      title: "Installing and opening",
      items: [
        {
          q: "macOS says it can't be opened or verified",
          a: "The app isn't notarized by Apple, so macOS stops it the first time. Open System Settings → Privacy & Security, find Keysmith Switch near the bottom, click Open Anyway and confirm. On macOS 14 and earlier you can also right-click it in Applications and choose Open. You only do this once.",
        },
        {
          q: "Windows says “Windows protected your PC”",
          a: "The installer has no Authenticode signature, so SmartScreen warns. Click More info, then Run anyway. It installs for the current user without administrator rights.",
        },
        {
          q: "My antivirus flags it",
          a: "The adapters are Python programs packaged with PyInstaller, which some antivirus heuristics flag by mistake. Check the installer against `SHA256SUMS.txt` to confirm it came from the official Releases; the source and build pipeline are on GitHub if you want to look further.",
        },
        {
          q: "How do I update?",
          a: "From v0.1.3 on, check for updates in the app; a red dot in Settings means a new version is out. Updates are signature-checked before installing, and only install when you confirm. You can also download a new version from the [download page](/en/download/) and install over the old one; your library is unaffected.",
        },
        {
          q: "Checking for updates times out",
          a: "On Windows, from v0.3.7 on, the system proxy is used, and `https_proxy` or `all_proxy` take priority when set. Earlier versions check without a proxy; download and install a new version by hand once, and later updates work.",
        },
        {
          q: "How do I uninstall?",
          a: "On macOS, move the app to the Trash; on Windows, uninstall it from Settings → Apps. Uninstalling keeps `~/.keysmith-switch/`; to remove your data too, use Clear all data in the app's settings first. Before uninstalling, turn off each agent's prompt and disconnect input rewrite in the app.",
        },
      ],
    },
    {
      id: "deploy",
      title: "Deploying and turning off",
      items: [
        {
          q: "I deployed, but the agent doesn't use it",
          a: "**Restart the agent** after deploying: start a new session in Claude Code, Codex or Grok Build, and reopen ZCode. Sessions already open don't reload the prompt.",
        },
        {
          q: "A deploy is blocked because the config changed",
          a: "Someone (or another tool, such as cc-switch) edited this agent's configuration after the last deploy. That's drift, and the deploy is blocked so your edits aren't overwritten. Follow the dialog:\n\n- if only the managed lines moved, click Tidy config;\n- if the record is a mess, Clean up to start over (this deletes the agent's login and session history; read the cleanup plan first).",
        },
        {
          q: "Turning off says the record or backup is missing",
          a: "If the config backup from before deploying is gone (a cleanup may have removed it), choose Keep current config and turn off; only the part Keysmith wrote is removed. If the deployment record is missing, Clean up clears the stale record.",
        },
        {
          q: "Windows says permission denied",
          a: "The current user lacks Full Control of the agent's folder (a Windows ACL restriction). Grant Full Control and try again.",
        },
        {
          q: "I edited the live prompt, but the agent didn't change",
          a: "Saving changes only the library copy. Deploy it again to write the change to the agent; the app reminds you after saving.",
        },
        {
          q: "Deploying to ZCode fails",
          a: "Make sure ZCode is installed from its official source, has been opened at least once, and is signed in with an API key (ZCode supports API sign-in only). When a deploy is refused, the dialog shows the adapter's exact reason.",
        },
      ],
    },
    {
      id: "cleanup",
      title: "Clean up and roll back",
      items: [
        {
          q: "What does cleanup delete?",
          a: "Cleanup returns an agent to a fresh install: the deployed prompt, the rules and configuration you added are removed; logins, session history, plugins and caches are deleted, not saved. Everything is listed before it runs; see [Clean up and roll back](/en/docs/cleanup/).",
        },
        {
          q: "Can I get it back afterwards?",
          a: "Most of it. A version is saved first; roll back under Settings → Versions and the prompt, memory file, rules and configuration come back. Logins and session history don't; sign in again.",
        },
        {
          q: "Cleanup says the agent is running",
          a: "Quit the agent first: while it runs, its sessions, memories and login are in use.",
        },
      ],
    },
    {
      id: "rewrite",
      title: "Input rewrite",
      items: [
        {
          q: "After connecting, the agent can't reach the model",
          a: "The Input rewrite page shows each agent's status. If it says the relay isn't running, click Reconnect; you can also Disconnect any time and the agent connects directly again.",
        },
        {
          q: "Why does it say “bypassed”?",
          a: "Another tool changed the setting Switch wrote, for example switching Codex's provider or changing Claude Code's `ANTHROPIC_BASE_URL`. Click Reconnect.",
        },
        {
          q: "Why can't my agent connect?",
          a: "Current limits: Claude Code doesn't support Bedrock or Vertex; Codex needs a custom provider (`wire_api = \"responses\"`); ZCode doesn't support Coding Plan sign-in; Grok Build must have run once.",
        },
      ],
    },
    {
      id: "feedback",
      title: "Feedback and help",
      items: [
        {
          q: "How do I report a problem or ask for a feature?",
          a: "In the app, open Settings → About and choose Report a problem or Request a feature; a prefilled GitHub form opens for you to review and submit. You can also post in [GitHub Discussions](https://github.com/Jia-Ethan/keysmith-switch/discussions/3) or join the conversation on [LINUX DO](https://linux.do).",
        },
        {
          q: "What should I leave out of feedback?",
          a: "GitHub issues are public. Don't include tokens, cookies, private paths, complete configuration or prompt text. Please don't disclose security issues publicly in Discussions.",
        },
      ],
    },
  ],
};
