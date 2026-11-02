// Pulls release and repository facts from GitHub into src/data/ so builds
// work offline. Run before `astro build` in CI; commit the output locally.
import { writeFile, mkdir } from "node:fs/promises";
import { REQUEST_REPO, DEADLINE_DAYS, cleanTitle, agentsFromBody, login, fromRest } from "../src/lib/requests-shared.mjs";

const OWNER = "Jia-Ethan";
const RELEASES_REPO = "keysmith-switch-releases";
const REPOS = ["keysmith-switch", "codex-keysmith", "claude-keysmith", "grok-keysmith", "zcode-keysmith", "keysmith-switch-extensions"];
// The community gallery reads the registry's committed index straight from the
// default branch. No release needed; new packs appear on the next site build.
const COMMUNITY_INDEX = "https://raw.githubusercontent.com/Jia-Ethan/keysmith-community-packs/main/community-index.json";
const headers = { Accept: "application/vnd.github+json", "User-Agent": "keysmith-switch-site" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function releases() {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await get(`/repos/${OWNER}/${RELEASES_REPO}/releases?per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all
    .filter((r) => !r.draft && !r.prerelease)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name,
      date: r.published_at,
      url: r.html_url,
      body: r.body ?? "",
      assets: r.assets.map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url })),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function repos() {
  const out = {};
  for (const name of REPOS) {
    const r = await get(`/repos/${OWNER}/${name}`);
    out[name] = { stars: r.stargazers_count, url: r.html_url, description: r.description };
  }
  return out;
}

// The gallery still builds if the registry is unreachable: keep whatever
// src/data/community.json already holds rather than failing the whole sync.
async function community() {
  try {
    const res = await fetch(COMMUNITY_INDEX, { headers: { "User-Agent": "keysmith-switch-site" } });
    if (!res.ok) throw new Error(`${res.status}`);
    const index = await res.json();
    if (typeof index !== "object" || !Array.isArray(index.packs)) throw new Error("unexpected shape");
    return index;
  } catch (err) {
    console.warn(`community index: keeping existing src/data/community.json (${err.message})`);
    return null;
  }
}

// The request pool: every request issue, its claim deadline and the PRs linked to it.
// With a token (CI) this is one GraphQL query per 50 requests; without one it falls
// back to the public REST list, which has no deadlines or PR links. Like the
// community index, a failure keeps the committed copy.
const REQUEST_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    issues(labels: ["request"], first: 50, after: $cursor, orderBy: { field: CREATED_AT, direction: DESC }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title state stateReason body createdAt closedAt
        author { login }
        labels(first: 30) { nodes { name } }
        assignees(first: 10) { nodes { login } }
        timelineItems(itemTypes: [LABELED_EVENT, UNLABELED_EVENT], last: 100) {
          nodes {
            __typename
            ... on LabeledEvent { createdAt label { name } }
            ... on UnlabeledEvent { createdAt label { name } }
          }
        }
        closedByPullRequestsReferences(includeClosedPrs: true, first: 10) {
          nodes { number url state isDraft closedAt author { login } }
        }
      }
    }
  }
}`;

function latest(events, type, label) {
  const times = events.filter((e) => e?.__typename === type && e.label?.name === label && e.createdAt).map((e) => e.createdAt);
  return times.sort().at(-1) ?? null;
}

function fromGraphql(n) {
  const labels = n.labels.nodes.map((l) => l.name);
  const assignees = n.assignees.nodes.map((a) => login(a.login)).filter(Boolean);
  const prs = (n.closedByPullRequestsReferences?.nodes ?? []).filter(Boolean);
  const events = n.timelineItems?.nodes ?? [];
  // The bot's clock: from the claim, restarted when a review ended without a merge.
  let due = null;
  const claimedAt = latest(events, "LabeledEvent", "claimed");
  if (n.state === "OPEN" && labels.includes("claimed") && !labels.includes("in-review") && claimedAt && !prs.some((p) => p.state === "MERGED")) {
    const starts = [claimedAt, latest(events, "UnlabeledEvent", "in-review"), ...prs.filter((p) => p.state === "CLOSED").map((p) => p.closedAt)];
    const start = starts.filter(Boolean).sort().at(-1);
    due = new Date(Date.parse(start) + DEADLINE_DAYS * 86400000).toISOString();
  }
  return {
    number: n.number,
    title: cleanTitle(n.title),
    state: n.state === "CLOSED" ? "closed" : "open",
    completed: n.state === "CLOSED" ? n.stateReason === "COMPLETED" : undefined,
    labels,
    author: login(n.author?.login),
    assignees,
    agents: agentsFromBody(n.body),
    createdAt: n.createdAt,
    closedAt: n.closedAt,
    due,
    prs: prs
      .filter((p) => p.state === "OPEN" || p.state === "MERGED")
      .filter((p) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/.test(p.url))
      .map((p) => ({ number: p.number, url: p.url, state: p.state.toLowerCase(), draft: !!p.isDraft, author: login(p.author?.login) })),
  };
}

async function requests() {
  const [owner, name] = REQUEST_REPO.split("/");
  try {
    let all = null;
    if (process.env.GITHUB_TOKEN) {
      try {
        all = await requestsGraphql(owner, name);
      } catch (err) {
        // Deadlines and PR links need GraphQL; the plain list still beats a stale copy.
        console.warn(`requests: GraphQL failed, using the plain list (${err.message})`);
        all = null;
      }
    }
    if (!all) {
      const list = await get(`/repos/${REQUEST_REPO}/issues?labels=request&state=all&per_page=100&sort=created&direction=desc`);
      all = list.filter((i) => !i.pull_request).map(fromRest);
    }
    // Closed as not planned / duplicate: not part of the pool.
    return all.filter((r) => r.state === "open" || r.completed);
  } catch (err) {
    console.warn(`requests: keeping existing src/data/requests.json (${err.message})`);
    return null;
  }
}

async function requestsGraphql(owner, name) {
  const all = [];
  for (let cursor = null; ; ) {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ query: REQUEST_QUERY, variables: { owner, name, cursor } }),
    });
    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(`${res.status} ${JSON.stringify(json.errors ?? json).slice(0, 200)}`);
    const page = json.data.repository.issues;
    all.push(...page.nodes.filter(Boolean).map(fromGraphql));
    if (!page.pageInfo.hasNextPage) return all;
    cursor = page.pageInfo.endCursor;
  }
}

await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
const [rel, rep, com, req] = await Promise.all([releases(), repos(), community(), requests()]);
if (req) await writeFile(new URL("../src/data/requests.json", import.meta.url), JSON.stringify({ fetchedAt: new Date().toISOString(), requests: req }, null, 2) + "\n");
await writeFile(new URL("../src/data/releases.json", import.meta.url), JSON.stringify(rel, null, 2) + "\n");
await writeFile(new URL("../src/data/repos.json", import.meta.url), JSON.stringify({ fetchedAt: new Date().toISOString(), repos: rep }, null, 2) + "\n");
if (com) await writeFile(new URL("../src/data/community.json", import.meta.url), JSON.stringify(com, null, 2) + "\n");
console.log(
  `releases: ${rel.length} (latest ${rel[0]?.tag}), repos: ${Object.keys(rep).length}, community packs: ${com ? com.packs.length : "unchanged"}, requests: ${req ? req.length : "unchanged"}`,
);
