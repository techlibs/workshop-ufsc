import type { PullRequest } from "../types/pr-types";

export const messageTemplates = {
  prOpened: (pr: PullRequest) => `
🆕 *New PR Opened*

${pr.title}

#${pr.number} by ${pr.user.login}
Branch: ${pr.head.ref} → ${pr.base.ref}

Please review when you have time!

${pr.html_url}
  `.trim(),

  prReadyForReview: (pr: PullRequest) => `
✅ *PR Ready for Review*

${pr.title}

#${pr.number} by ${pr.user.login}
Branch: ${pr.head.ref} → ${pr.base.ref}

This PR is now ready for your review!

${pr.html_url}
  `.trim(),

  reviewRequested: (pr: PullRequest, reviewer: string) => `
👀 *Review Requested*

Hi @${reviewer}!

Your review is requested on:
*${pr.title}*

#${pr.number} by ${pr.user.login}
Branch: ${pr.head.ref} → ${pr.base.ref}

Please review at your earliest convenience.

${pr.html_url}
  `.trim(),

  prSummary: (prs: PullRequest[]) => {
    if (prs.length === 0) {
      return "✅ *All caught up!*\n\nNo pending PRs to review.";
    }

    let message = `📋 *${prs.length} PR(s) Pending Review*\n\n`;

    prs.forEach((pr, index) => {
      message += `${index + 1}. ${pr.title}\n`;
      message += `   #${pr.number} by ${pr.user.login}\n`;
      message += `   ${pr.html_url}\n\n`;
    });

    return message.trim();
  },

  dailyDigest: (prs: PullRequest[]) => {
    const total = prs.length;
    const drafts = prs.filter((pr) => pr.draft).length;
    const ready = total - drafts;

    let message = `🌅 *Daily PR Digest*\n\n`;
    message += `📊 Summary:\n`;
    message += `• Total PRs: ${total}\n`;
    message += `• Ready for review: ${ready}\n`;
    message += `• Drafts: ${drafts}\n\n`;

    if (ready > 0) {
      message += `*PRs needing attention:*\n\n`;

      const readyPRs = prs.filter((pr) => !pr.draft);
      readyPRs.forEach((pr, index) => {
        message += `${index + 1}. ${pr.title}\n`;
        message += `   #${pr.number} by ${pr.user.login}\n`;
        message += `   ${pr.html_url}\n\n`;
      });
    }

    return message.trim();
  },

  prMerged: (pr: PullRequest) => `
🎉 *PR Merged*

${pr.title}

#${pr.number} has been successfully merged!

Great work ${pr.user.login}! 🚀
  `.trim(),

  error: (errorMessage: string) => `
⚠️ *Error*

${errorMessage}

Please check the configuration or contact support.
  `.trim(),
};