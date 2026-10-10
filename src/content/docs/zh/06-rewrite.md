---
title: 输入替换
lede: 照常在 Agent 里打字，发给模型之前按你的规则做字面替换；输入框和会话历史里仍是你打的原文。
group: 进阶
order: 6
page: rewrite
---

## 它是怎么工作的

打开输入替换后，Switch 会在本机运行一个中转服务 `keysmith-relay`，它**只监听 `127.0.0.1`**。连接一个 Agent，就是只改它的一个配置项，让它把请求发给这个中转服务。中转服务按你的规则替换你输入的文字，再转发到原来的地址，响应原样流式返回。

中转服务开机自启（macOS 用 LaunchAgent，Windows 用登录启动项），Switch 不打开也能工作。所有 Agent 都断开后，中转服务会被移除。

## 连接一个 Agent

在左侧栏打开 **输入替换**，每个 Agent 一行，点 **连接…**。连接前会先告诉你要改哪个文件的哪一项：

| Agent | 连接时改动的配置 |
| --- | --- |
| Claude Code | `~/.claude/settings.json` 的 `env.ANTHROPIC_BASE_URL`（设置了 `CLAUDE_CONFIG_DIR` 时用那个目录） |
| Codex | `~/.codex/config.toml`：新增 `[model_providers.keysmith-relay]`（复制你原来的 provider，只改 `base_url`），并把顶层 `model_provider` 指向它 |
| ZCode | `~/.zcode/v2/provider_config.json`：每个个人 provider 的 `baseUrl` |
| Grok Build | `~/.grok/config.toml` 末尾，一对 `# === keysmith-switch input rewrite ===` 标记之间：给每个模型加一张 `[model."<id>"] base_url` |

每次写配置前都会在旁边留一份备份。

## 只改你打的字

只替换你自己输入的文字，包括历史里你之前说过的话。以下内容都不动：

- 助手回复和工具输出；
- Agent 自带的上下文，例如 Claude Code 的 `<system-reminder>`、Codex 的环境和 AGENTS.md、ZCode 的技能列表、Grok 的 `<user_info>`；
- 以 `/` 开头的斜杠命令及其展开内容；
- ZCode 子代理、Grok 会话标题等 Agent 自己发出的辅助请求。

## 规则怎么匹配

- 字面匹配，区分大小写；
- 同一位置有多条规则能匹配时，取最长的一条；
- 替换后的文字不会再被替换；
- 「我的规则」排在最前，其余规则表按你排的顺序；
- 每张规则表可以选择只对哪些 Agent 生效。

「我的规则」默认是空的。顶部的总开关关掉后，不会替换任何内容，你的规则会保留。

## 规则包

[拓展](/docs/extensions/)仓库也可以发布规则包。安装前会先列出全部规则；已经启用的规则包有更新时，要你在输入替换页看过差异、确认后才会切换。规则包是只读的，想改可以复制到「我的规则」。

## 断开

**断开** 只还原 Switch 自己写过、而且现在仍是当时写入值的那几项；如果其他工具在此期间改过，就保持原样。规则会保留。

部署或停用提示词都不会碰上表里的配置项。清理某个 Agent 前，会先断开它的输入替换。

## 不存会话

中转服务不保存、不记录请求内容、规则或鉴权信息。用订阅账号登录时，登录令牌会经过本机中转，同样不保存、不记录。

## 目前的限制

- **Claude Code**：不支持 Bedrock 和 Vertex。
- **Codex**：需要使用自定义 provider（`wire_api = "responses"`）；用 Codex 内置的 OpenAI 登录时暂时不能连接。
- **ZCode**：不支持账号登录的 Coding Plan，需要一个使用 API key 的 provider。
- **Grok Build**：需要先运行过一次，让它拉取过模型列表；以后新增的模型要重新连接才会经过中转。如果你自己配置的模型把 Grok 自带的模型当作上游，这样的模型会留在中转之外，详情里会列出来。
