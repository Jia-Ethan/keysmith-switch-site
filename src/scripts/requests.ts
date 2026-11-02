// The request pool page: status filters, and a live refresh from GitHub so the
// list doesn't wait for the next site build. The refresh uses the public API (no
// token, 60 requests an hour per visitor), cached for a few minutes; if it fails
// the built list stays. Everything from GitHub is rendered as text.
import { fromRest, mergeLive, sortRequests, counts, rowTree, stamp, TAGS, REQUEST_REPO, type RowNode as Node } from "../lib/requests-shared.mjs";
import type { Request } from "../lib/requests";

const API = `https://api.github.com/repos/${REQUEST_REPO}/issues?labels=request&state=all&per_page=100&sort=created&direction=desc`;
const CACHE_KEY = "ks-requests";
const TTL = 5 * 60 * 1000;

function build(node: Node): globalThis.Node {
  if (typeof node === "string") return document.createTextNode(node);
  const el = document.createElement(TAGS.includes(node.t) ? node.t : "span");
  if (node.c) el.className = node.c;
  if (node.t === "a" && node.h && node.h.startsWith("https://github.com/")) {
    el.setAttribute("href", node.h);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }
  for (const [k, v] of Object.entries(node.a ?? {})) if (k.startsWith("data-")) el.setAttribute(k, v);
  for (const child of node.k ?? []) el.append(build(child));
  return el;
}

function readJson(sel: string) {
  try {
    return JSON.parse(document.querySelector(sel)?.textContent ?? "null");
  } catch {
    return null;
  }
}

const board = document.querySelector<HTMLElement>("[data-rq-board]");
if (board) {
  const lang = board.dataset.lang === "en" ? "en" : "zh";
  const s = readJson("[data-rq-strings]");
  const snapshot = readJson("[data-rq-snapshot]") ?? [];
  const list = board.querySelector<HTMLElement>("[data-rq-list]")!;
  const empty = board.querySelector<HTMLElement>("[data-rq-empty]")!;
  const buttons = [...board.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  let filter = "all";

  const apply = () => {
    let shown = 0;
    for (const row of list.querySelectorAll<HTMLElement>("[data-status]")) {
      const st = row.dataset.status;
      const on = filter === "all" || st === filter;
      row.hidden = !on;
      if (on) shown++;
    }
    const total = list.querySelectorAll("[data-status]").length;
    empty.textContent = total ? (empty.dataset.emptyFilter ?? "") : (empty.dataset.emptyAll ?? "");
    empty.hidden = shown > 0;
  };

  for (const b of buttons) {
    b.addEventListener("click", () => {
      filter = b.dataset.filter ?? "all";
      for (const o of buttons) o.setAttribute("aria-pressed", String(o === b));
      apply();
    });
  }

  // A link like /requests/#ready opens on that filter.
  const start = location.hash.slice(1);
  buttons.find((b) => b.dataset.filter === start)?.click();

  const render = (items: Request[], at: string) => {
    const sorted = sortRequests(items);
    list.replaceChildren(...sorted.map((item) => build(rowTree(item, s, lang))));
    const n = counts(sorted) as Record<string, number>;
    for (const el of board.querySelectorAll<HTMLElement>("[data-count]")) el.textContent = String(n[el.dataset.count ?? ""] ?? 0);
    const st = board.querySelector("[data-rq-stamp]");
    if (st) st.textContent = s.updated.replace("{date}", stamp(at, lang));
    apply();
  };

  const refresh = async () => {
    let raw: any[] | null = null;
    let at = new Date().toISOString();
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
      if (cached && Date.now() - cached.t < TTL) ({ raw, at } = cached);
    } catch {}
    if (!raw) {
      try {
        const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) return;
        raw = await res.json();
        if (!Array.isArray(raw)) return;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), at, raw }));
        } catch {}
      } catch {
        return;
      }
    }
    const live = raw!
      .filter((i) => i && !i.pull_request)
      .map(fromRest)
      .filter((r) => r.state === "open" || r.completed);
    render(mergeLive(live, snapshot, raw!.length >= 100), at);
  };

  if (s) refresh();
}
