---
title: 数据与隐私
lede: 数据存在哪里、App 会访问哪些网络地址、哪些情况下什么都不发。
group: 参考
order: 10
page: privacy
---

## 数据存在哪里

| 路径 | 内容 |
| --- | --- |
| `~/.keysmith-switch/keysmith-switch.db` | 提示词库与操作记录 |
| `~/.keysmith-switch/prompts/<tool>/<prompt-id>.md` | 提示词正文 |
| `~/.keysmith-switch/backups/<operation-id>/` | 部署前的备份 |
| `~/.keysmith-switch/snapshots/` | 清理前保存的版本 |
| `~/.keysmith-switch/logs/` | 日志（中转服务日志为 `relay.log`） |
| `~/.keysmith-switch/input-rewrite/` | 输入替换的规则快照、端口与转发地址、各 Agent 的连接记录 |

Windows 上的 `~` 是 `%USERPROFILE%`。卸载 App **不会**删除这个文件夹；只有设置里的「清除全部数据」会删除它（清理前保存的版本除外）。

## App 会访问的网络地址

Keysmith Switch 没有账号、统计或遥测。提示词正文不会上传到任何地方。它只会在下面这些情况下联网：

| 什么时候 | 访问哪里 | 做什么 |
| --- | --- | --- |
| 启动后，以及每 6 小时 | `github.com/Jia-Ethan/keysmith-switch-releases` | 检查更新（读取 `latest.json`） |
| 启动后，以及每 6 小时 | `raw.githubusercontent.com/Jia-Ethan/keysmith-switch-releases` | 读取公告 |
| 你打开「拓展」之后 | `github.com/Jia-Ethan/keysmith-switch-extensions` | 读取拓展列表、下载你选择的包 |
| 你确认安装更新时 | `github.com/Jia-Ethan/keysmith-switch-releases` | 下载更新包 |
| 打开「设置」时，且本机装了 npm | npm 官方源（通过本机的 `npm` 命令） | 查询 Claude Code、Codex 的最新版本号 |
| 你提交反馈时 | `github.com` | 打开预填好的 issue 表单，由你检查后提交 |

这些请求都不包含你的提示词、规则或配置。

## 输入替换的中转服务

[输入替换](/docs/rewrite/)的中转服务只监听 `127.0.0.1`，把请求转发到你原来配置的模型地址。它不保存、不记录请求内容、规则或鉴权信息。

## 反馈时请注意

反馈会提交到公开的 GitHub issue。不要填写 token、cookie、私人路径、完整配置或提示词正文。安全问题请不要在 Discussion 中公开披露。
