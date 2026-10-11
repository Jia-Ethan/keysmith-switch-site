# Keysmith Switch 官网

[Keysmith Switch](https://github.com/Jia-Ethan/keysmith-switch) 的产品网站（<https://keysmithswitch.com/>）：首页、下载、更新日志、文档、帮助，中文（`/`）与英文（`/en/`）两套。静态站点，Astro 7 构建。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 输出到 dist/，并生成中文标题用的字体子集
npm run preview
node scripts/check-dist.mjs   # 检查 dist/ 里的链接、资源与中英文页面配对
```

`SITE_URL` 和 `BASE_PATH` 决定站点地址。按线上域名构建：

```bash
SITE_URL=https://keysmithswitch.com npm run build
```

不用自定义域名、发布到 GitHub Pages 项目页时，再加上路径：`BASE_PATH=/keysmith-switch-site`。

## 部署

推送到 `main` 后，GitHub Actions（`.github/workflows/deploy.yml`）会同步发布数据、构建、检查链接，再发布到 GitHub Pages。每天还会自动重建一次，拿到新版本和星标数；在 Actions 页也可以手动运行。站点地址和路径由 Pages 设置决定，换成自定义域名时不用改代码。现在的自定义域名是 `keysmithswitch.com`，在 Cloudflare 注册并解析，HTTPS 也由 Cloudflare 提供。

## 内容从哪里来

| 内容 | 来源 | 更新方式 |
| --- | --- | --- |
| 版本号、安装包大小、下载链接、更新日志 | `keysmith-switch-releases` 的 GitHub Releases | `npm run sync` 写入 `src/data/releases.json`；页面打开时还会再查一次最新版，有新版本就替换下载链接 |
| GitHub 星标数 | 各仓库的 GitHub API | `npm run sync` 写入 `src/data/repos.json` |
| 文档 | `src/content/docs/{zh,en}/*.md` | 直接编辑；每章 frontmatter 里有 `title`、`lede`、`group`、`order`、`page` |
| 帮助问答 | `src/data/help.ts` | 直接编辑 |
| 界面文案 | `src/i18n/ui.ts` | 直接编辑 |
| 产品短片与功能导览视频 | 用 App 的真实界面录制，见下文 | `recording/` |

文档写的是 App 当前版本的真实行为，改动前请先对照 `keysmith-switch` 的源码与发布说明。

## App 更新后要检查什么

版本号、安装包、下载链接、更新日志和星标数会自动同步，其余内容写的是某个 App 版本的实际行为，App 改了要跟着改。发版后对照 App 仓库的发布说明和改动过的源码，按下表检查（`zh` 和 `en` 两套都要改）：

| App 的改动 | 要检查的文件 |
| --- | --- |
| 适配器版本（`ToolKind::expected_version`） | `src/components/AgentCards.astro`；`src/content/docs/*/02-concepts.md`、`08-agents.md` |
| 某个 Agent 的写入方式、限制 | `src/i18n/ui.ts` 的 `cards.agents`；`src/content/docs/*/08-agents.md` |
| 部署、清理、回滚、输入替换、拓展的行为或界面文案 | `src/content/docs/*/` 对应章节；`src/data/help.ts`；`src/i18n/ui.ts` 的 `tour` |
| 界面明显改版 | 重新录制导览视频和短片，见下一节；必要时改 `recording/scenes.mjs` 和 `recording/demo-backend.mjs` |
| 系统要求、安装方式、首次打开的提示 | `src/i18n/ui.ts` 的 `dl`、`download`；`src/content/docs/*/01-quickstart.md`；`src/data/help.ts` |
| 联网行为（检查更新、公告、拓展等） | `src/content/docs/*/10-privacy.md`、`09-how-it-works.md`；`src/data/help.ts`；`src/i18n/ui.ts` 的 `principles` |
| 社区与反馈渠道 | `src/lib/release.ts`；`src/components/Nav.astro`、`Footer.astro`；`src/data/help.ts` |
| 支持的 Agent 增减 | 以上大部分，加上 `src/assets/agents/` 的图标 |

改完后运行 `npm run build`、`node scripts/check-dist.mjs` 和 `npx astro check`，在本地看一遍中英文页面再合并。

## 录制产品视频

视频是 Keysmith Switch 真实前端在浏览器里运行、由脚本操作录下来的，不是手工剪辑的素材。

1. 在 `keysmith-switch` 仓库运行前端：`npm ci && npx vite --port 1420`。
2. `recording/demo-backend.mjs` 在浏览器里替代 Tauri 后端，提供演示数据（不会读写任何真实文件）。
3. 录制：`node recording/record.mjs --all`（或 `--scene plan --lang zh --theme dark`）。逐帧推进虚拟时间截图，2× 像素，结果完全可复现。
4. 编码：`node recording/encode.mjs`，输出 H.264 MP4 和 WebP 封面到 `public/media/`，并把短片的章节时间写进 `src/data/film.json`。

分镜在 `recording/scenes.mjs`，选择器用的是 App 自己的 `data-testid`。App 界面改版后，重新录制即可。

## 设计

版式、节奏和交互参考了 [mirasim.ai](https://mirasim.ai)：暖纸色背景、衬线标题、等宽字体导航、编号功能导览、页脚四栏。代码、文案、图形和视频都是为 Keysmith Switch 自己写的；没有复用 Mirasim 的代码、图片或品牌元素。

字体：Source Serif 4、IBM Plex Mono、Geist Sans（SIL OFL，经 Fontsource 自托管），中文标题用 Noto Serif SC 的子集。Agent 图标与 App 中使用的一致，版权归各自所有者。

## 许可

内容与 Keysmith Switch 一样按 PolyForm Noncommercial 1.0.0 授权。

Required Notice: Copyright 2026 Jia-Ethan
