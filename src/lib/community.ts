import community from "../data/community.json";
import type { Lang } from "../i18n/ui";

/** One agent a pack targets. Matches the pack format's tool names. */
export type Tool = "claude" | "codex" | "grok" | "zcode" | "pi" | "dsh";

export type Localized = Partial<Record<"zh-CN" | "zh-TW" | "en", string>>;

export type PackMeta = {
  author: { handle: string; name?: string; url?: string };
  summary: Localized;
  category?: string;
  source_url?: string;
  submitted_at?: string;
  /** The request issue this pack answers, and who asked for it. */
  request?: { issue: number; by?: string };
};

export type Pack = {
  id: string;
  version: string;
  min_app_version: string;
  kind: "prompts" | "rules";
  name: Localized;
  description: Localized;
  tools: Tool[];
  item_count: number;
  url: string;
  sha256: string;
  size: number;
  opaque?: boolean;
  meta: PackMeta;
  // Optional, rendered when present so the detail page lights up if the index
  // gains them later; the current index carries only item_count.
  license?: { spdx?: string };
  items?: { id: string; tool: Tool; title: Localized; tags?: string[] }[];
};

export const COMMUNITY_REPO = "https://github.com/Jia-Ethan/keysmith-community-packs";
export const CONTRIBUTING = `${COMMUNITY_REPO}/blob/main/CONTRIBUTING.md`;
export const CONTRIBUTING_EN = `${COMMUNITY_REPO}/blob/main/CONTRIBUTING.en.md`;
/** Open, confirmed requests waiting for someone to build them. */
export const REQUEST_POOL = `${COMMUNITY_REPO}/issues?q=is%3Aissue+is%3Aopen+label%3Aready`;
export const REQUEST_NEW = `${COMMUNITY_REPO}/issues/new?template=request.yml`;

export function requestUrl(issue: number): string {
  return `${COMMUNITY_REPO}/issues/${issue}`;
}

export const PACKS = (community.packs as Pack[])
  .slice()
  .sort((a, b) => (a.meta.submitted_at ?? "").localeCompare(b.meta.submitted_at ?? "") || a.id.localeCompare(b.id))
  .reverse();

/** The pack's content on GitHub — the canonical place to read and copy it while
 *  in-app install does not exist yet. */
export function packSource(pack: Pack): string {
  return `${COMMUNITY_REPO}/tree/main/packs/${pack.id}`;
}

/** Pick a localized string, preferring the page language, then the other
 *  Chinese variant, then English, then anything present. */
export function pick(value: Localized | undefined, lang: Lang): string {
  if (!value) return "";
  const order = lang === "zh" ? ["zh-CN", "zh-TW", "en"] : ["en", "zh-CN", "zh-TW"];
  for (const key of order) {
    const text = value[key as keyof Localized];
    if (text) return text;
  }
  const first = Object.values(value).find(Boolean);
  return first ?? "";
}

export const TOOL_LABEL: Record<Tool, string> = {
  claude: "Claude Code",
  codex: "Codex",
  grok: "Grok Build",
  zcode: "ZCode",
  pi: "pi",
  dsh: "DSH",
};

/** The accent each agent uses in the app; packs with several tools fall back to
 *  the site accent. Mirrors tokens.css --agent-*. */
export const TOOL_ACCENT: Partial<Record<Tool, string>> = {
  claude: "var(--agent-claude)",
  codex: "var(--agent-codex)",
  grok: "var(--agent-grok)",
  zcode: "var(--agent-zcode)",
};

export function packAccent(pack: Pack): string {
  return pack.tools.length === 1 ? (TOOL_ACCENT[pack.tools[0]] ?? "var(--accent)") : "var(--accent)";
}
