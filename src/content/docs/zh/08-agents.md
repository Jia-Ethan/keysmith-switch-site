---
title: 各 Agent 的写入细节
lede: 每个 Agent 的提示词放在哪里、适配器会碰哪些文件、停用和清理分别还原什么。
group: 参考
order: 8
page: agents
---

所有写入都由各自的开源适配器完成。下面是当前版本（适配器版本和 App 锁定在一起）的行为。Switch 部署的都是**用户级**设置，不会写进任何项目目录。

## Claude Code · claude-keysmith 7.2

- **提示词**：写进 `~/.claude/keysmith/`，再在 `~/.claude/CLAUDE.md` 里加一段带标记的导入块：

  ```markdown
  <!-- claude-keysmith:start name=claude-project-rules -->
  @keysmith/claude-project-rules.md
  <!-- claude-keysmith:end name=claude-project-rules -->
  ```

  标记之外的内容（你自己写的规则）不会动。
- **停用**：只移除这一段导入块和 Keysmith 的提示词文件。
- **清理**：可以清空整个 `CLAUDE.md`（要先勾选确认），并保存/移除 `rules`、`agents`、`commands`、`hooks`、`skills`、`output-styles`；删除会话、插件、缓存和系统钥匙串里的登录。
- **适配器不碰**：Claude Code 程序本身、网络设置、凭证、MCP 配置和正在运行的进程。
- **输入替换**：只改 `settings.json` 里的 `env.ANTHROPIC_BASE_URL`；不支持 Bedrock 和 Vertex。

## Codex · codex-keysmith 0.6.0

- **提示词**：放进 `~/.codex/`，并在 `config.toml` 里写入 `model_instructions_file`。写入前会备份 `config.toml`。
- **hooks**：如果 `hooks.json` 可能干扰指令加载，会先隔离并留下带时间戳的备份。
- **停用**：移除托管的那一行和提示词文件，还原被隔离的 hooks。
- **清理**：可以清空 `~/.codex/AGENTS.md`（要先勾选确认）；`memories` 文件夹要单独勾选，且要先退出 Codex。`config.toml` 保留在原处。
- **输入替换**：新增 `[model_providers.keysmith-relay]`，复制你原来的 provider 只改 `base_url`；需要自定义 provider（`wire_api = "responses"`）。

## Grok Build · grok-keysmith 0.7.0

- **提示词**：写进 `~/.grok/rules/99-keysmith.md`。这是 home rules，每个 Grok 会话都会读取，不依赖 `AGENTS.md` 或任何角色卡。
- **兼容层**：在 `config.toml` 里用一段 `# === grok-keysmith compat isolation begin/end ===` 标记关闭 Claude / Cursor 兼容层，并隔离 `~/.grok/hooks/*.json`，避免它们干扰提示词。
- **停用**：只移除自己写入的文件和那一段标记；如果部署前的配置备份已经不在，可以「保留当前配置并停用」。
- **输入替换的区域**：`# === keysmith-switch input rewrite ===` 标记之间是 Switch 的区域。适配器从不写进去，部署、停用、整理和恢复时都会保留这一段。
- **输入替换**：需要先运行一次 Grok，让它拉取模型列表。

## ZCode · zcode-keysmith 0.3.2

- **提示词**：写进 `~/.zcode-keysmith/system-role.md`，作为真正的 system 角色生效，优先于 ZCode 自带的 system prompt。
- **新版 ZCode（3.12 及以上）**：先备份 ZCode 自带的 `zcode.cjs`，再修补它，让它优先读取上面的文件；停用时还原。
- **环境变量**：macOS 用 LaunchAgent 设置，Windows 写用户环境变量。部署前会记下原来的值（包括 `NODE_OPTIONS`），停用时还原。
- **不支持恢复**（recover）：ZCode 适配器没有中断恢复功能。
- **输入替换**：改 `~/.zcode/v2/provider_config.json` 里每个个人 provider 的 `baseUrl`；不支持账号登录的 Coding Plan。

## 适配器源码

四个适配器都以 MIT 协议开源，可以单独使用命令行版本：

- [claude-keysmith](https://github.com/Jia-Ethan/claude-keysmith)
- [codex-keysmith](https://github.com/Jia-Ethan/codex-keysmith)
- [grok-keysmith](https://github.com/Jia-Ethan/grok-keysmith)
- [zcode-keysmith](https://github.com/Jia-Ethan/zcode-keysmith)
