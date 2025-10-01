export interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed" | "merged";
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  body: string | null;
  labels: Array<{
    name: string;
    color: string;
  }>;
  requested_reviewers: Array<{
    login: string;
  }>;
  assignees: Array<{
    login: string;
  }>;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  draft: boolean;
  mergeable: boolean | null;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface PRNotificationRequest {
  prNumber?: number;
  recipient: string;
  includeDetails?: boolean;
  priority?: "low" | "normal" | "high";
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  from?: string;
}

export interface NotificationResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  prNumber: number;
  recipient: string;
  timestamp: string;
}

export interface PRFilterOptions {
  state?: "open" | "closed" | "all";
  sort?: "created" | "updated" | "popularity" | "long-running";
  direction?: "asc" | "desc";
  base?: string;
  head?: string;
  author?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface WebhookEvent {
  action: string;
  pull_request: PullRequest;
  sender: {
    login: string;
  };
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
}