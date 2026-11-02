// Request-pool logic shared by the build (scripts/sync-data.mjs) and the page's
// live refresh (src/scripts/requests.ts). Plain JS so Node can import it without a
// build step. Everything here reads GitHub data as untrusted text: it only ever
// returns plain strings, numbers and booleans for the page to render as text.

export const REQUEST_REPO = "Jia-Ethan/keysmith-community-packs";
export const DEADLINE_DAYS = 14;

const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?:\[bot\])?$/;
const AGENTS = [
  ["claude code", "claude"],
  ["codex", "codex"],
  ["grok build", "grok"],
  ["zcode", "zcode"],
  ["pi", "pi"],
  ["dsh", "dsh"],
  ["都行", "any"],
  ["any of them", "any"],
];

/** A GitHub login, or null if it doesn't look like one. */
export function login(value) {
  return typeof value === "string" && LOGIN.test(value) ? value : null;
}

/** The title without the form's "[需求]" prefix. */
export function cleanTitle(title) {
  return String(title ?? "")
    .replace(/^\s*\[(需求|request)\]\s*/i, "")
    .trim();
}

/** The agents ticked in the request form's "Which agent(s)" checkboxes. */
export function agentsFromBody(body) {
  const text = String(body ?? "");
  const start = text.search(/^#{1,6}\s.*which agent/im);
  if (start < 0) return [];
  const rest = text.slice(start).split("\n").slice(1);
  const out = [];
  for (const line of rest) {
    if (/^#{1,6}\s/.test(line)) break;
    const m = /^\s*[-*]\s*\[[xX]\]\s*(.+?)\s*$/.exec(line);
    if (!m) continue;
    const name = m[1].toLowerCase();
    for (const [needle, key] of AGENTS) {
      if (name.split("/").some((part) => part.trim() === needle) && !out.includes(key)) out.push(key);
    }
  }
  return out.includes("any") ? ["any"] : out;
}

/** Where a request stands, from its labels. Mirrors the request board bot. */
export function statusOf(item) {
  if (item.state === "closed") return "done";
  const labels = item.labels ?? [];
  if (labels.includes("in-review")) return "review";
  if (labels.includes("claimed") && (item.assignees ?? []).length) return "claimed";
  if (labels.includes("ready")) return "ready";
  if (labels.includes("needs-info")) return "info";
  return "triage";
}

export const STATUS_ORDER = ["ready", "review", "claimed", "triage", "info", "done"];

/** The pool's order: open work by status, newest first; finished work last. */
export function sortRequests(items) {
  return items.slice().sort((a, b) => {
    const sa = STATUS_ORDER.indexOf(statusOf(a));
    const sb = STATUS_ORDER.indexOf(statusOf(b));
    if (sa !== sb) return sa - sb;
    const ka = statusOf(a) === "done" ? a.closedAt : a.createdAt;
    const kb = statusOf(b) === "done" ? b.closedAt : b.createdAt;
    return String(kb ?? "").localeCompare(String(ka ?? "")) || b.number - a.number;
  });
}

/** One request from the REST issues list (what the browser can fetch without a token). */
export function fromRest(issue) {
  return {
    number: Number(issue.number),
    title: cleanTitle(issue.title),
    state: issue.state === "closed" ? "closed" : "open",
    completed: issue.state === "closed" ? issue.state_reason === "completed" : undefined,
    labels: (issue.labels ?? []).map((l) => (typeof l === "string" ? l : l?.name)).filter((n) => typeof n === "string"),
    author: login(issue.user?.login),
    assignees: (issue.assignees ?? []).map((a) => login(a?.login)).filter(Boolean),
    agents: agentsFromBody(issue.body),
    createdAt: issue.created_at ?? null,
    closedAt: issue.closed_at ?? null,
    due: null,
    prs: [],
  };
}

/** Keep what only the build knows (deadline, linked PRs) when a live refresh still agrees with it. */
export function mergeLive(live, snapshot, truncated = false) {
  const old = new Map(snapshot.map((r) => [r.number, r]));
  const merged = live.map((r) => {
    const was = old.get(r.number);
    if (!was) return r;
    const sameHolder = statusOf(r) === "claimed" && statusOf(was) === "claimed" && r.assignees.join() === was.assignees.join();
    return {
      ...r,
      agents: r.agents.length ? r.agents : was.agents,
      due: sameHolder ? was.due : null,
      prs: statusOf(r) === statusOf(was) ? was.prs : [],
    };
  });
  // One page of the live list can't hold everything: older finished requests the
  // page didn't reach stay as the build saw them.
  if (truncated) {
    const seen = new Set(live.map((r) => r.number));
    const oldest = Math.min(...live.map((r) => r.number));
    merged.push(...snapshot.filter((r) => !seen.has(r.number) && r.number < oldest));
  }
  return merged;
}

/** "11 月 16 日" / "Nov 16"; the year is added when it isn't this year. */
export function shortDate(iso, lang, now = new Date()) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear() !== now.getUTCFullYear();
  if (lang === "zh") return `${year ? `${d.getUTCFullYear()} 年 ` : ""}${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(year ? { year: "numeric" } : {}), timeZone: "UTC" });
}

/** Only links that point where they should: an issue or PR in GitHub, or a user's profile. */
export function issueUrl(number) {
  return `https://github.com/${REQUEST_REPO}/issues/${Number(number)}`;
}
export function profileUrl(who) {
  return login(who) ? `https://github.com/${who}` : null;
}
export function prUrl(pr) {
  const n = Number(pr?.number);
  return Number.isInteger(n) && n > 0 ? `https://github.com/${REQUEST_REPO}/pull/${n}` : null;
}

/** "11 月 2 日 14:08 UTC" / "Nov 2, 14:08 UTC". */
export function stamp(iso, lang) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const hm = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
  return lang === "zh" ? `${shortDate(iso, lang, d)} ${hm}` : `${shortDate(iso, lang, d)}, ${hm}`;
}

// --- One row of the pool, as a plain tree ------------------------------------
// The build renders the tree with an Astro component and the live refresh with
// DOM calls, so the markup lives here once. A node is a string (text) or
// { t: tag, c: class, h: href, a: attributes, k: children }. Text from GitHub only
// ever lands in strings; hrefs only come from the *Url helpers above.

export const TAGS = ["li", "div", "p", "span", "a", "strong"];
const AGENT_LABEL = { claude: "Claude Code", codex: "Codex", grok: "Grok Build", zcode: "ZCode", pi: "pi", dsh: "DSH" };

/** Split "{who} 正在做" into text and the nodes for each slot. */
export function fill(template, slots) {
  const out = [];
  for (const part of String(template).split(/(\{[a-z]+\})/)) {
    if (!part) continue;
    const key = /^\{([a-z]+)\}$/.exec(part)?.[1];
    if (key && key in slots) out.push(slots[key]);
    else out.push(part);
  }
  return out;
}

function who(name) {
  const url = profileUrl(name);
  return url ? { t: "a", c: "rq-who", h: url, k: [`@${name}`] } : "";
}

function prLink(pr, s) {
  const url = prUrl(pr);
  if (!url) return "";
  return { t: "a", h: url, k: [`#${Number(pr.number)}${pr.draft ? ` (${s.draft})` : ""}`] };
}

function statusLine(item, status, s, lang, now) {
  const days = String(DEADLINE_DAYS);
  if (status === "ready") return fill(s.readyLine, { days });
  if (status === "claimed") {
    const people = item.assignees.flatMap((a, i) => (i ? [", ", who(a)] : [who(a)]));
    const line = fill(s.claimedLine, { who: { t: "span", k: people } });
    if (item.due) line.push(" · ", { t: "span", c: "rq-due", k: fill(s.dueLine, { date: shortDate(item.due, lang, now) }) });
    return line;
  }
  if (status === "review") {
    const open = item.prs.filter((p) => p.state === "open");
    if (!open.length) return [s.reviewPending];
    const links = open.flatMap((p, i) => (i ? [", ", prLink(p, s)] : [prLink(p, s)]));
    const line = fill(s.reviewLine, { pr: { t: "span", k: links } });
    const authors = [...new Set(open.map((p) => p.author).filter(Boolean))];
    if (authors.length) line.push(" · ", ...authors.flatMap((a, i) => (i ? [", ", who(a)] : [who(a)])));
    return line;
  }
  if (status === "triage") return [s.triageLine];
  if (status === "info") return [s.infoLine];
  const merged = item.prs.filter((p) => p.state === "merged");
  if (!merged.length) return [s.doneLine];
  return fill(s.doneBy, { pr: { t: "span", k: merged.flatMap((p, i) => (i ? [", ", prLink(p, s)] : [prLink(p, s)])) } });
}

/** The tree for one request. `s` is the page's strings (t(lang).requests). */
export function rowTree(item, s, lang, now = new Date()) {
  const status = statusOf(item);
  const issue = issueUrl(item.number);
  const agents = item.agents.map((a) => ({ t: "span", c: "chip", k: [a === "any" ? s.anyAgent : (AGENT_LABEL[a] ?? a)] }));
  const by = [];
  if (item.author) by.push(...fill(s.by, { who: who(item.author) }));
  if (item.createdAt) by.push(by.length ? " · " : "", shortDate(item.createdAt, lang, now));
  const action =
    status === "ready"
      ? { t: "a", c: "btn-line", h: issue, k: [s.claim] }
      : { t: "a", c: "link-more", h: issue, k: [{ t: "span", k: [s.view] }] };
  return {
    t: "li",
    c: `rq-row is-${status}`,
    a: { "data-status": status },
    k: [
      {
        t: "div",
        c: "rq-main",
        k: [
          {
            t: "div",
            c: "rq-top",
            k: [{ t: "span", c: `rq-pill is-${status}`, k: [s.status[status]] }, { t: "span", c: "rq-num mono", k: [`#${Number(item.number)}`] }, ...agents],
          },
          { t: "a", c: "rq-title", h: issue, k: [item.title || `#${Number(item.number)}`] },
          { t: "p", c: "rq-line", k: statusLine(item, status, s, lang, now) },
          ...(by.length ? [{ t: "p", c: "rq-by mono", k: by }] : []),
        ],
      },
      { t: "div", c: "rq-act", k: [action] },
    ],
  };
}

/** How many requests sit under each filter. */
export function counts(items) {
  const out = { all: items.length, ready: 0, claimed: 0, review: 0, done: 0 };
  for (const item of items) {
    const st = statusOf(item);
    if (st in out) out[st] += 1;
  }
  return out;
}
