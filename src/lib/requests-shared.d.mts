// Types for requests-shared.mjs (plain JS so Node can run it at build time).
import type { Request } from "./requests";

export type RowNode = string | { t: string; c?: string; h?: string; a?: Record<string, string>; k?: RowNode[] };
export type Status = "ready" | "claimed" | "review" | "triage" | "info" | "done";

export const REQUEST_REPO: string;
export const DEADLINE_DAYS: number;
export const STATUS_ORDER: Status[];
export const TAGS: string[];
export function login(value: unknown): string | null;
export function cleanTitle(title: unknown): string;
export function agentsFromBody(body: unknown): string[];
export function statusOf(item: Request): Status;
export function sortRequests(items: Request[]): Request[];
export function fromRest(issue: any): Request;
export function mergeLive(live: Request[], snapshot: Request[], truncated?: boolean): Request[];
export function shortDate(iso: string, lang: "zh" | "en", now?: Date): string;
export function stamp(iso: string, lang: "zh" | "en"): string;
export function issueUrl(number: number): string;
export function profileUrl(who: string): string | null;
export function prUrl(pr: { number: number }): string | null;
export function fill(template: string, slots: Record<string, RowNode>): RowNode[];
export function rowTree(item: Request, s: any, lang: "zh" | "en", now?: Date): RowNode;
export function counts(items: Request[]): Record<"all" | "ready" | "claimed" | "review" | "done", number>;
