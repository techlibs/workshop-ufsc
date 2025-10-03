import Bottleneck from 'bottleneck';
import pLimit from 'p-limit';
import { parse } from 'node-html-parser';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import crypto from 'node:crypto';

interface RobotsRuleCacheEntry { expires: number; allowed: boolean; }

export interface FetchedPage {
  id: string;
  url: string;
  ok: boolean;
  status: number;
  contentType?: string;
  rawHtml?: string;
  readableText?: string;
  title?: string;
  error?: string;
}

export interface FetcherOptions {
  qps?: number;               // Queries per second global
  concurrency?: number;       // Parallel fetch concurrency cap
  userAgent?: string;         // Custom UA for politeness
  robotsTtlMs?: number;       // Cache TTL for robots decisions
  timeoutMs?: number;         // Per-request timeout
  maxBytes?: number;          // Hard cap on response size
}

export class MetaAgentFetcher {
  private limiter: Bottleneck;
  private concurrency: ReturnType<typeof pLimit>;
  private robotsCache = new Map<string, RobotsRuleCacheEntry>();
  private opts: Required<FetcherOptions>;

  constructor(opts: FetcherOptions = {}) {
    this.opts = {
      qps: opts.qps ?? Number(process.env.SEARCH_QPS || 2),
      concurrency: opts.concurrency ?? Number(process.env.SEARCH_CONCURRENCY || 4),
      userAgent: opts.userAgent ?? 'MetaAgentRequirementsCollectorBot/1.0 (+https://example.com/bot)',
      robotsTtlMs: opts.robotsTtlMs ?? (Number(process.env.ROBOTS_TTL_MIN || 30) * 60_000),
      timeoutMs: opts.timeoutMs ?? 15_000,
      maxBytes: opts.maxBytes ?? 2_000_000,
    };
    this.limiter = new Bottleneck({ minTime: 1000 / this.opts.qps });
    this.concurrency = pLimit(this.opts.concurrency);
  }

  async fetchAll(urls: string[]): Promise<FetchedPage[]> {
    return Promise.all(urls.map(u => this.concurrency(() => this.limiter.schedule(() => this.fetch(u)))));
  }

  private async fetch(url: string): Promise<FetchedPage> {
    try {
      if (!(await this.isAllowed(url))) {
        return { id: this.hash(url), url, ok: false, status: 0, error: 'Blocked by robots.txt' };
      }

      const controller = new AbortController();
      const to = setTimeout(() => controller.abort(), this.opts.timeoutMs);
      const resp = await fetch(url, { headers: { 'User-Agent': this.opts.userAgent }, signal: controller.signal });
      clearTimeout(to);
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('text/html')) {
        return { id: this.hash(url), url, ok: false, status: resp.status, contentType: ct, error: 'Non-HTML content skipped' };
      }
      const buf = await resp.arrayBuffer();
      if (buf.byteLength > this.opts.maxBytes) {
        return { id: this.hash(url), url, ok: false, status: resp.status, contentType: ct, error: 'Exceeded maxBytes' };
      }
      const html = Buffer.from(buf).toString('utf8');
      const { text, title } = this.readable(html, url);
      return { id: this.hash(url), url, ok: resp.ok, status: resp.status, contentType: ct, rawHtml: html, readableText: text, title };
    } catch (e: any) {
      return { id: this.hash(url), url, ok: false, status: 0, error: e.message };
    }
  }

  private readable(html: string, url: string): { text: string; title?: string } {
    try {
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const art = reader.parse();
      if (art?.textContent) return { text: art.textContent.trim(), title: art.title };
      // fallback: simplistic text extraction
      const root = parse(html);
      return { text: root.text.trim().replace(/\s+/g, ' ').slice(0, 50_000) };
    } catch {
      return { text: '' };
    }
  }

  private async isAllowed(urlStr: string): Promise<boolean> {
    try {
      const u = new URL(urlStr);
      const base = `${u.protocol}//${u.host}`;
      const cache = this.robotsCache.get(base);
      const now = Date.now();
      if (cache && cache.expires > now) return cache.allowed;
      const robotsUrl = `${base}/robots.txt`;
      const resp = await fetch(robotsUrl, { headers: { 'User-Agent': this.opts.userAgent }, redirect: 'follow' });
      if (!resp.ok) {
        this.robotsCache.set(base, { allowed: true, expires: now + this.opts.robotsTtlMs });
        return true; // assume allowed if cannot fetch
      }
      const body = await resp.text();
      const allowed = this.simpleRobotsAllow(body, u.pathname);
      this.robotsCache.set(base, { allowed, expires: now + this.opts.robotsTtlMs });
      return allowed;
    } catch {
      return true; // fail-open
    }
  }

  // Very naive robots parser (Disallow lines). Replace with robust lib if needed.
  private simpleRobotsAllow(content: string, path: string): boolean {
    const lines = content.split(/\n+/).map(l => l.trim());
    const disallows: string[] = [];
    let applies = false;
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      if (/User-agent:\s*\*/i.test(line)) { applies = true; }
      else if (/User-agent:/i.test(line)) { applies = false; }
      if (applies) {
        const m = line.match(/^Disallow:\s*(.*)$/i);
        if (m) disallows.push(m[1].trim());
      }
    }
    return !disallows.some(rule => rule && path.startsWith(rule));
  }

  private hash(input: string) { return crypto.createHash('sha1').update(input).digest('hex'); }
}
