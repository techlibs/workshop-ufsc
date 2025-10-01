import type { PullRequest } from "../types/pr-types";

export class PRFormatter {
  formatPRForList(pr: PullRequest): string {
    const status = pr.draft ? "🔖 Draft" : "📝 Open";
    const labels = pr.labels.map((l) => `[${l.name}]`).join(" ");

    return `${status} #${pr.number}: ${pr.title}
👤 ${pr.user.login} | ${labels}
🔗 ${pr.html_url}`;
  }

  formatPRForDetails(pr: PullRequest): string {
    const reviewers = pr.requested_reviewers.map((r) => `@${r.login}`).join(", ");
    const status = pr.draft ? "🔖 Draft" : pr.mergeable ? "✅ Mergeable" : "⚠️ Conflicts";

    return `📋 PR #${pr.number}: ${pr.title}

${status}
👤 Author: ${pr.user.login}
🌿 Branch: ${pr.head.ref} → ${pr.base.ref}
👥 Reviewers: ${reviewers || "None"}

📊 Changes:
  • ${pr.commits} commit(s)
  • +${pr.additions} / -${pr.deletions}
  • ${pr.changed_files} file(s)

💬 ${pr.comments} comment(s) | ${pr.review_comments} review comment(s)

${pr.body ? `\n📝 Description:\n${pr.body.slice(0, 300)}${pr.body.length > 300 ? "..." : ""}` : ""}

🔗 ${pr.html_url}`;
  }

  formatPRForWhatsApp(pr: PullRequest, includeDetails: boolean = false): string {
    if (includeDetails) {
      return this.formatPRForDetails(pr);
    }

    const status = pr.draft ? "🔖 Draft" : "📝 Open for Review";

    return `${status}

*${pr.title}*

#${pr.number} by ${pr.user.login}
${pr.head.ref} → ${pr.base.ref}

${pr.html_url}`;
  }

  formatMultiplePRsForWhatsApp(prs: PullRequest[]): string {
    if (prs.length === 0) {
      return "✅ No open PRs requiring review!";
    }

    let message = `📋 *${prs.length} PR(s) requiring review:*\n\n`;

    prs.forEach((pr, index) => {
      message += `${index + 1}. *${pr.title}*\n`;
      message += `   #${pr.number} by ${pr.user.login}\n`;
      message += `   ${pr.html_url}\n\n`;
    });

    return message;
  }

  formatPRSummary(prs: PullRequest[]): string {
    const total = prs.length;
    const drafts = prs.filter((pr) => pr.draft).length;
    const ready = total - drafts;

    return `📊 PR Summary:
Total: ${total}
Ready for review: ${ready}
Drafts: ${drafts}`;
  }
}

export const prFormatter = new PRFormatter();