import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { RequirementsState } from "../types";

export const interviewerAgent = new Agent({
  name: "Requirements Interviewer",
  description: "Asks the next best clarifying question to fill missing requirement information.",
  model: openai("gpt-4o-mini"),
  instructions: () => `You are gathering software workflow requirements. Ask ONE concise question at a time about an unfilled required field. If all required fields are filled, respond with EXACT TEXT: DONE` ,
});

export function buildInterviewPrompt(state: RequirementsState): string {
  const pending = state.requirements.filter(r => r.required && !r.value);
  if (!pending.length) return "All requirements filled. Respond with DONE.";
  const list = pending.map(r => `- ${r.id}: ${r.description}`).join("\n");
  return `Pending fields:\n${list}\nAsk the most logical next question to clarify exactly one field.`;
}
