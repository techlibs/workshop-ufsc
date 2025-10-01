import { Octokit } from "@octokit/rest";
import type { PullRequest, PRFilterOptions } from "../types/pr-types";
import { cache } from "./cache-service";
import { secrets } from "../config/secrets";

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor() {
    this.octokit = new Octokit({
      auth: secrets.get("GITHUB_TOKEN"),
    });
    this.owner = secrets.get("GITHUB_OWNER");
    this.repo = secrets.get("GITHUB_REPO");
  }

  async listPullRequests(
    options: PRFilterOptions = {}
  ): Promise<PullRequest[]> {
    const cacheKey = `prs:${this.owner}:${this.repo}:${JSON.stringify(options)}`;

    const cached = cache.get<PullRequest[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.octokit.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: options.state || "open",
      sort: options.sort || "created",
      direction: options.direction || "desc",
      base: options.base,
      head: options.head,
      per_page: 100,
    });

    const prs = response.data as unknown as PullRequest[];

    cache.set(cacheKey, prs, 60000);

    return prs;
  }

  async getPullRequest(prNumber: number): Promise<PullRequest> {
    const cacheKey = `pr:${this.owner}:${this.repo}:${prNumber}`;

    const cached = cache.get<PullRequest>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.octokit.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
    });

    const pr = response.data as unknown as PullRequest;

    cache.set(cacheKey, pr, 60000);

    return pr;
  }

  async getOpenPRs(): Promise<PullRequest[]> {
    return this.listPullRequests({ state: "open" });
  }

  async getPRsByReviewer(reviewer: string): Promise<PullRequest[]> {
    const allPRs = await this.getOpenPRs();

    return allPRs.filter((pr) =>
      pr.requested_reviewers.some((r) => r.login === reviewer)
    );
  }

  async invalidateCache(prNumber?: number): void {
    if (prNumber) {
      cache.invalidate(`pr:${this.owner}:${this.repo}:${prNumber}`);
    } else {
      cache.invalidate(`prs:${this.owner}:${this.repo}`);
    }
  }

  getRepoInfo(): { owner: string; repo: string } {
    return { owner: this.owner, repo: this.repo };
  }
}

export const githubService = new GitHubService();