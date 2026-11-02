import data from "../data/requests.json";

/** One request issue as scripts/sync-data.mjs stores it. */
export type Request = {
  number: number;
  title: string;
  state: "open" | "closed";
  completed?: boolean;
  labels: string[];
  author: string | null;
  assignees: string[];
  agents: string[];
  createdAt: string | null;
  closedAt: string | null;
  /** When the claim goes back to the pool if no PR is opened (open, claimed requests only). */
  due: string | null;
  prs: { number: number; url: string; state: "open" | "merged"; draft: boolean; author: string | null }[];
};

export const REQUESTS = data.requests as Request[];
export const REQUESTS_AT = data.fetchedAt;
