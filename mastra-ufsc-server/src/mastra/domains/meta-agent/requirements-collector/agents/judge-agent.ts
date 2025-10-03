import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { RequirementItem, RequirementsState } from "../types";

export const requirementsJudgeAgent = new Agent({
  name: "Requirements Judge",
  description: "Evaluates which requirement fields are satisfied by current conversation context.",
  model: openai("gpt-4o-mini"),
  instructions: () => `You receive: (1) the user's original query, (2) current requirement list with possible partially filled values, (3) the latest user answer.\nReturn ONLY a JSON array of objects with: id, extractedValue (or null), confidence (0-1), rationale (short). Do not include markdown.`,
});

export async function judgeRequirements(params: {
  state: RequirementsState;
  latestUserMessage: string;
}): Promise<Pick<RequirementItem, "id" | "value" | "confidence">[]> {
  const { state, latestUserMessage } = params;
  const prompt = `ORIGINAL QUERY: ${state.originalQuery}\nPENDING: ${state.pending.join(", ")}\nREQUIREMENTS STATE:\n${state.requirements
    .map(r => `${r.id}: value=${r.value ?? "<none>"}`)
    .join("\n")}\nLATEST USER MESSAGE: ${latestUserMessage}`;
  const resp = await requirementsJudgeAgent.generate([
    { role: "user", content: prompt },
  ]);
  try {
    const parsed = JSON.parse(resp.text);
    return Array.isArray(parsed) ? parsed.map((p: any) => ({ id: p.id, value: p.extractedValue, confidence: p.confidence })) : [];
  } catch {
    return [];
  }
}
