import { z } from "zod";

// Core requirement item schema
export const RequirementItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  // Whether the user must explicitly provide this (vs can be inferred)
  required: z.boolean().default(true),
  // Collected user-provided raw value
  value: z.any().optional(),
  // Model normalized / parsed value
  normalized: z.any().optional(),
  // Confidence score 0-1 for the normalized value
  confidence: z.number().min(0).max(1).optional(),
  // Source provenance trail (messages, web, mcp, rag docs)
  sources: z.array(z.string()).default([]),
});

export type RequirementItem = z.infer<typeof RequirementItemSchema>;

export const RequirementsStateSchema = z.object({
  originalQuery: z.string(),
  requirements: z.array(RequirementItemSchema),
  // IDs of requirements still missing value
  pending: z.array(z.string()),
  // Iteration count for interview loop
  turns: z.number().int().nonnegative(),
  // Accumulated context docs ids
  contextDocIds: z.array(z.string()).default([]),
  // Whether collection is complete
  complete: z.boolean().default(false),
});
export type RequirementsState = z.infer<typeof RequirementsStateSchema>;

export const FinalRequirementsOutputSchema = z.object({
  meta: z.object({
    originalQuery: z.string(),
    collectedAt: z.string(),
    totalTurns: z.number(),
    version: z.string().default("1.0.0"),
  }),
  requirements: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.any(),
      normalized: z.any().optional(),
      confidence: z.number().optional(),
      sources: z.array(z.string()).default([]),
    })
  ),
  contexts: z.object({
    web: z.array(z.object({ id: z.string(), url: z.string(), title: z.string(), snippet: z.string().optional() })).default([]),
    mastraDocs: z.array(z.object({ path: z.string(), summary: z.string() })).default([]),
    ragSelected: z.array(z.object({ id: z.string(), relevance: z.number(), excerpt: z.string() })).default([]),
  }),
});
export type FinalRequirementsOutput = z.infer<typeof FinalRequirementsOutputSchema>;

// Helper for initial requirement template list (can be expanded later or be dynamic)
export const defaultRequirementTemplates: RequirementItem[] = [
  {
    id: "workflow_goal",
    label: "Workflow Goal",
    description: "High-level objective or purpose of the target workflow",
    required: true,
    sources: [],
  },
  {
    id: "primary_inputs",
    label: "Primary Inputs",
    description: "Key inputs (user data, external APIs) required for the workflow",
    required: true,
    sources: [],
  },
  {
    id: "expected_outputs",
    label: "Expected Outputs",
    description: "Structured description of what the workflow should produce",
    required: true,
    sources: [],
  },
  {
    id: "tools_needed",
    label: "Tools Needed",
    description: "List of Mastra tools or external integrations required",
    required: true,
    sources: [],
  },
  {
    id: "agents_interaction",
    label: "Agents Interaction",
    description: "Which agents will participate and how they coordinate",
    required: false,
    sources: [],
  },
  {
    id: "human_in_loop_points",
    label: "Human-in-the-Loop Points",
    description: "Situations requiring user approval or manual input",
    required: false,
    sources: [],
  },
  {
    id: "error_strategies",
    label: "Error & Retry Strategies",
    description: "Fallbacks, retry policies, and failure handling",
    required: false,
    sources: [],
  },
  {
    id: "performance_constraints",
    label: "Performance Constraints",
    description: "Latency expectations, cost limits, or throughput needs",
    required: false,
    sources: [],
  },
];
