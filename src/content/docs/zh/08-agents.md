---
title: 各 Agent 的写入细节
lede: 每个 Agent 的提示词放在哪里、适配器会碰哪些文件、停用和清理分别还原什么。
group: 参考
order: 8
page: agents
---

部署和停用都由各自的开源适配器完成；清理时的分项快照移动、清空指令文件与输入替换改写的那一个配置项由 Switch 自己处理，见[工作原理](/docs/how-it-works/)。下面是当前版本（六个适配器版本与 App 锁定在一起）的行为。Switch 部署的都是**用户级**设置，不会写进任何项目目录。

## Claude Code · claude-keysmith 7.2

- **提示词**：写进 `~/.claude/keysmith/`，再在 `~/.claude/CLAUDE.md` 里加一段带标记的导入块：

  ```markdown
  <!-- claude-keysmith:start name=claude-project-rules -->
  @keysmith/claude-project-rules.md
  <!-- claude-keysmith:end name=claude-project-rules -->
  ```

  标记之外的内容（你自己写的规则）不会动。
- **停用**：只移除这一段导入块和 Keysmith 的提示词文件。
- **清理**：默认只停用 Keysmith 部署；可按需勾选清空 `CLAUDE.md`（需额外确认）、移走 `rules`/`agents`/`commands`/`hooks`/`skills`/`output-styles`、或将 `.claude/projects`/`.claude/sessions`/`history.jsonl` 等会话历史移入本地版本；勾选高危「登录凭证、含密钥配置与缓存」时才删除插件、缓存、钥匙串登录并脱敏备份 `settings.json`/`.claude.json`。
- **适配器不碰**：Claude Code 程序本身、网络设置、凭证、MCP 配置和正在运行的进程。
- **输入替换**：只改 `settings.json` 里的 `env.ANTHROPIC_BASE_URL`；不支持 Bedrock 和 Vertex。

## Codex · codex-keysmith 0.6.0

- **提示词**：放进 `~/.codex/`，并在 `config.toml` 里写入 `model_instructions_file`。写入前会备份 `config.toml`。
- **hooks**：如果 `hooks.json` 可能干扰指令加载，会先隔离并留下带时间戳的备份。
- **停用**：移除托管的那一行和提示词文件，还原被隔离的 hooks。
- **清理**：默认只停用 Keysmith 部署；可按需勾选清空 `~/.codex/AGENTS.md`（需额外确认）、移走 `memories` 文件夹、自定义扩展（含组件包写在共享 `~/.agents/skills` 中的技能），或将会话目录与 `state_5.sqlite` 等数据库（连同 `-wal`/`-shm` 附属文件）整组移入本地版本。`config.toml` 始终保留在原处。
- **输入替换**：新增 `[model_providers.keysmith-relay]`，复制你原来的 provider 只改 `base_url`；需要自定义 provider（`wire_api = "responses"`）。

## Grok Build · grok-keysmith 0.8.0

- **提示词**：写进 `~/.grok/rules/99-keysmith.md`。这是 home rules，每个 Grok 会话都会读取，不依赖 `AGENTS.md` 或任何角色卡。
- **兼容层与用户区域**：在 `config.toml` 里用 `# === grok-keysmith compat isolation begin/end ===` 关闭 Claude / Cursor 兼容层并隔离 `~/.grok/hooks/*.json`；部署后自己加的配置（如 API key 备用模型）可以放进「用户区域」，不算漂移，停用时会保留。
- **停用**：只移除自己写入的文件和标记段；如果部署前的配置备份已经不在，可以「保留当前配置并停用」。
- **清理**：默认只停用 Keysmith 部署；可按需勾选移走 `rules`/`agents`/`skills`/`commands`、记忆目录，或将会话目录与 `worktrees.db`（含附属文件）移入本地版本。Grok 程序本体及项目目录永不动。
- **输入替换的区域**：`# === keysmith-switch input rewrite ===` 标记之间是 Switch 的区域。适配器从不写进去，部署、停用、整理和恢复时都会保留这一段。需要先运行一次 Grok 拉取模型列表。

## ZCode · zcode-keysmith 0.3.5

- **提示词**：写进 `~/.zcode-keysmith/system-role.md`，作为真正的 system 角色生效，优先于 ZCode 自带的 system prompt。
- **新版 ZCode（3.12–4.0+）**：在 macOS 和 Windows 上均先备份 ZCode 自带的 `zcode.cjs`，再按对应版本运行时锚点修补，让它优先读取托管文件；停用时还原，不再写入会触发孤立存储故障的 `ZCODE_AGENT_SERVER_COMMAND`。
- **旧版 ZCode**：仍使用 wrapper 与环境变量（macOS 用 LaunchAgent，Windows 写用户环境变量）；部署前记下原值，停用时还原。
- **清理**：默认只停用 Keysmith 部署；若 ZCode runtime 仍带补丁标记或无法确认已恢复，会保护 `~/.zcode-keysmith/backups` 不被删除。`~/.zcode/workspace` 中的项目永不动。
- **不支持恢复**（recover）：ZCode 适配器没有中断恢复功能。
- **输入替换**：改 `~/.zcode/v2/provider_config.json` 里每个个人 provider 的 `baseUrl`；不支持账号登录的 Coding Plan。

## pi · pi-keysmith 0.2.0

- **提示词**：写入全局 `~/.pi/agent/SYSTEM.md`，部署前先备份，停用时按原样还原。
- **目录边界与清理**：`~/.pi/agent` 不存在时不会自动创建；`APPEND_SYSTEM.md`、`AGENTS.md`、设置和会话都不动，清理时仅停用 Keysmith 部署。
- **输入替换**：暂不支持。

## DSH · dsh-keysmith 0.4.1

- **提示词**：将托管 Cordis 插件部署到 DSH 的配置档目录：检测到 DSH Desktop 配置档（`profiles/desktop`）时优先部署到其中，否则使用 `profiles/web`；如果此前部署在旧的 `profiles/web`，App 顶部会提示一键重新部署迁入 `profiles/desktop`。
- **目录边界与清理**：`~/.dsh` 不存在时不会自动创建；`AGENTS.md`、`settings.yaml`、`.credentials.yaml`、会话和存储均不纳入清理表，清理时只停用 Keysmith 部署。
- **输入替换**：暂不支持。

## 适配器源码

六个适配器都以 MIT 协议开源，可以单独使用命令行版本：

- [claude-keysmith](https://github.com/Jia-Ethan/claude-keysmith)
- [codex-keysmith](https://github.com/Jia-Ethan/codex-keysmith)
- [grok-keysmith](https://github.com/Jia-Ethan/grok-keysmith)
- [zcode-keysmith](https://github.com/Jia-Ethan/zcode-keysmith)
- [pi-keysmith](https://github.com/Jia-Ethan/pi-keysmith)
- [dsh-keysmith](https://github.com/Jia-Ethan/dsh-keysmith)
