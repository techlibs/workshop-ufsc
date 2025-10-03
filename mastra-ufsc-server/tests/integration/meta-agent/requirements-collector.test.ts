// Basic smoke test for meta-agent requirements collector workflow
import { describe, it, expect } from "vitest";
import { metaAgentRequirementsCollectorWorkflow } from "../../../src/mastra/domains/meta-agent/requirements-collector";

describe("meta-agent requirements collector", () => {
  it("runs initialization and finalize producing structured output", async () => {
  const wf = metaAgentRequirementsCollectorWorkflow;
  const run = await wf.createRunAsync();
  const exec = await run.start({ inputData: { query: "Create a workflow that processes weather data and recommends clothing" } });
  expect(exec.status).toBe("success");
  const output = (exec as any).result;
  expect(output?.meta?.originalQuery).toContain("weather data");
  expect(Array.isArray(output?.requirements)).toBe(true);
  });
});
