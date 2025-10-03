import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { ragStore } from "../utils/ragStore";

export const contextRetrieverAgent = new Agent({
  name: "Context Retriever",
  description: "Transforms search results & docs into concise task-relevant summaries.",
  model: openai("gpt-4o-mini"),
  instructions: () => `You receive raw search result snippets or documentation excerpts. Produce a distilled bullet list of the most actionable implementation hints for building Mastra workflows. Keep to <150 words.`,
});

export async function summarizeAndIndex(source: string, content: string) {
  // Summarize via LLM (can be batched later)
  const resp = await contextRetrieverAgent.generate([
    { role: "user", content },
  ]);
  ragStore.add([{ id: `${source}:${Date.now()}`, content: resp.text, source }]);
  return resp.text;
}
