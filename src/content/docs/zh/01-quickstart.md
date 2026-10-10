---
title: 快速上手
lede: 下载、打开、把第一条提示词部署到 Agent，五分钟左右走完一遍。
group: 开始
order: 1
page: quickstart
---

## 安装 Keysmith Switch

Keysmith Switch 是一个桌面 App，支持 macOS（Apple Silicon，macOS 12 及以上）和 Windows（10 / 11，x64）。四个 Agent 的适配器都已经打包在 App 里，不需要另外安装 Python 或其他依赖。

1. **下载安装包。** 从[下载页](/download/)获取当前稳定版：macOS 是 `.dmg`，Windows 是 `-setup.exe`。所有安装包都发布在公开仓库 `keysmith-switch-releases` 里，同一版本的每个入口拿到的是同一个文件。
2. **打开它。** macOS：把 Keysmith Switch 拖进「应用程序」。安装包没有经过 Apple 公证，第一次打开会被拦下：打开「系统设置 → 隐私与安全性」，在页面下方点「仍要打开」并确认。Windows：运行安装程序，如果 SmartScreen 提示「Windows 已保护你的电脑」，点「更多信息 → 仍要运行」。安装在当前用户目录，不需要管理员权限。
3. **校验文件（可选）。** 每个版本都附带 `SHA256SUMS.txt`，打开安装包之前可以先比对。

```bash
# macOS
shasum -a 256 ~/Downloads/Keysmith.Switch_*_aarch64.dmg
# Windows（PowerShell）
Get-FileHash .\Keysmith.Switch_*_x64-setup.exe -Algorithm SHA256
```

> 安装包没有使用 Apple Developer ID、公证或 Windows Authenticode。应用内更新用独立的 minisign 密钥签名，这不是平台代码签名。

## 第一次启动

第一次打开时，Switch 会检查四个内置适配器是否可用，并扫描机器上已有的 Keysmith 提示词文件（例如 `~/.claude/keysmith/`、`~/.grok/rules/`）。找到的文件会列出来让你勾选导入，**导入只是放进提示词库，不会自动激活**。没有找到也没关系，直接完成设置即可。

## 部署第一条提示词

1. 在左侧选择一个 Agent，比如 Claude Code。窗口会换成这个 Agent 的颜色，顶部显示它现在用的是什么提示词。
2. 点右上角的 **快速部署**，填一个标题，把提示词粘贴进去；也可以拖入一个 `.md` 文件。
3. 点 **生成部署预览**。Switch 会请适配器先算出部署计划：现在 → 部署后，以及会备份哪些内容。这一步不写任何文件。
4. 看清楚之后点 **部署**。写入完成后，顶部会显示「当前已部署」。
5. **重启这个 Agent**（或开一个新会话），新的提示词才会生效。

只想先存起来、不部署，可以点「仅保存到库」。

## 接下来

- [提示词库](/docs/library/)：标签、搜索、编辑和版本历史。
- [部署计划](/docs/deploy/)：计划里每一项是什么意思，以及被拦截时怎么办。
- [清理与回滚](/docs/cleanup/)：把 Agent 清回空白，再一键回滚。
