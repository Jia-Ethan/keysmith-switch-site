# Keysmith Switch 官网

[Keysmith Switch](https://github.com/Jia-Ethan/keysmith-switch) 的产品网站：首页、下载、更新日志、文档、帮助，中文（`/`）与英文（`/en/`）两套。静态站点，Astro 7 构建。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 输出到 dist/，并生成中文标题用的字体子集
npm run preview
node scripts/check-dist.mjs   # 检查 dist/ 里的链接、资源与中英文页面配对
```

`SITE_URL` 和 `BASE_PATH` 决定站点地址，例如 GitHub Pages 项目页：

```bash
SITE_URL=https://jia-ethan.github.io BASE_PATH=/keysmith-switch-site npm run build
```

## 部署

推送到 `main` 后，GitHub Actions（`.github/workflows/deploy.yml`）会同步发布数据、构建、检查链接，再发布到 GitHub Pages。每天还会自动重建一次，拿到新版本和星标数；在 Actions 页也可以手动运行。站点地址和路径由 Pages 设置决定，换成自定义域名时不用改代码。

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
