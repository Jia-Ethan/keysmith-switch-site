// Refreshes version, sizes and download links from the GitHub API, so a site
// built before a release still hands out the newest build. Failures are silent:
// the build-time values stay.
type GhAsset = { name: string; size: number; browser_download_url: string };
type GhRelease = { tag_name: string; assets: GhAsset[]; html_url: string };

const API = "https://api.github.com/repos/Jia-Ethan/keysmith-switch-releases/releases/latest";
const CACHE_KEY = "ks-latest";
const TTL = 30 * 60 * 1000;

const pick = (r: GhRelease, re: RegExp) => r.assets.find((a) => re.test(a.name));
const mb = (n: number) => `${Math.round(n / 1024 / 1024)} MB`;

function newer(a: string, b: string): boolean {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d > 0;
  }
  return false;
}

function apply(r: GhRelease) {
  const built = document.querySelector<HTMLMetaElement>('meta[name="ks-version"]')?.content ?? "";
  const v = r.tag_name.replace(/^v/, "");
  if (!built || !newer(v, built)) return;
  const mac = pick(r, /_aarch64\.dmg$/);
  const win = pick(r, /_x64-setup\.exe$/);
  const sums = pick(r, /^SHA256SUMS/);
  for (const el of document.querySelectorAll("[data-ver]")) el.textContent = v;
  for (const [kind, asset] of [["mac", mac], ["win", win], ["sums", sums]] as const) {
    if (!asset) continue;
    for (const a of document.querySelectorAll<HTMLAnchorElement>(`[data-dl="${kind}"]`)) a.href = asset.browser_download_url;
    for (const el of document.querySelectorAll(`[data-size="${kind}"]`)) el.textContent = mb(asset.size);
  }
}

async function run() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && Date.now() - cached.at < TTL) return apply(cached.r);
  } catch {}
  try {
    const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return;
    const r = (await res.json()) as GhRelease;
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), r }));
    } catch {}
    apply(r);
  } catch {}
}

if (document.querySelector("[data-dl]")) run();
