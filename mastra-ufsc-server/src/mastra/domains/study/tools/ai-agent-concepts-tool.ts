import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Comprehensive AI agent knowledge base
const aiAgentConcepts: Record<
  string,
  {
    definition: string;
    keyComponents: string[];
    capabilities: string[];
    examples: string[];
    architectureTypes: string[];
    challenges: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
  }
> = {
  "ai agent": {
    definition:
      "An AI agent is an autonomous software entity that perceives its environment, makes decisions, and takes actions to achieve specific goals. It combines language models with tools, memory, and reasoning capabilities.",
    keyComponents: [
      "Perception: Ability to understand inputs and context",
      "Reasoning: Decision-making based on goals and constraints",
      "Action: Executing tasks through tools and APIs",
      "Memory: Maintaining state and learning from interactions",
    ],
    capabilities: [
      "Natural language understanding and generation",
      "Tool usage and API integration",
      "Multi-step task planning and execution",
      "Context retention across conversations",
    ],
    examples: [
      "GitHub Copilot: Code generation assistant",
      "AutoGPT: Autonomous task completion",
      "LangChain Agents: Flexible agent framework",
    ],
    architectureTypes: ["ReAct", "Plan-and-Execute", "Multi-Agent Systems"],
    challenges: ["Hallucination", "Tool reliability", "Context limitations"],
    difficulty: "beginner",
  },
  "react pattern": {
    definition:
      "ReAct (Reasoning and Acting) is an agent pattern that interleaves reasoning traces with action execution. The agent thinks step-by-step about what to do, then takes an action, observes the result, and continues.",
    keyComponents: [
      "Thought: Agent reasoning about the current situation",
      "Action: Selecting and executing a tool or action",
      "Observation: Processing the result of the action",
      "Loop: Repeating until task completion",
    ],
    capabilities: [
      "Step-by-step problem solving",
      "Transparent reasoning process",
      "Error recovery through observation",
      "Dynamic action selection",
    ],
    examples: [
      "LangChain ReAct Agent: Standard implementation",
      "OpenAI Function Calling: Built-in ReAct-like behavior",
      "Anthropic's Claude with tools: ReAct-style execution",
    ],
    architectureTypes: ["Sequential", "Iterative", "Tool-augmented"],
    challenges: [
      "Reasoning loops",
      "Action selection errors",
      "Observation misinterpretation",
    ],
    difficulty: "intermediate",
  },
  "tool calling": {
    definition:
      "Tool calling is the ability of AI agents to invoke external functions, APIs, or services to extend their capabilities beyond text generation. It enables agents to interact with the real world and access current information.",
    keyComponents: [
      "Tool Definition: Schema and description of available tools",
      "Tool Selection: Agent decides which tool to use",
      "Parameter Generation: Agent creates valid tool inputs",
      "Result Integration: Processing tool outputs",
    ],
    capabilities: [
      "API integration for real-time data",
      "Code execution for calculations",
      "Database queries for information retrieval",
      "External service orchestration",
    ],
    examples: [
      "Web search tools for current information",
      "Calculator tools for mathematical operations",
      "Database tools for structured data access",
    ],
    architectureTypes: ["Function Calling", "Tool Use", "API Integration"],
    challenges: [
      "Tool selection accuracy",
      "Parameter validation",
      "Error handling",
    ],
    difficulty: "intermediate",
  },
  "agent memory": {
    definition:
      "Agent memory systems enable AI agents to store, retrieve, and utilize information across conversations and sessions. This includes short-term working memory and long-term persistent storage.",
    keyComponents: [
      "Working Memory: Current conversation context",
      "Episodic Memory: Past interactions and events",
      "Semantic Memory: Learned facts and knowledge",
      "Procedural Memory: Learned skills and methods",
    ],
    capabilities: [
      "Context retention across conversations",
      "Personalization based on user history",
      "Learning from past experiences",
      "Improved task performance over time",
    ],
    examples: [
      "ChatGPT's conversation history",
      "MemGPT: Long-term memory management",
      "Pinecone/Weaviate: Vector databases for semantic memory",
    ],
    architectureTypes: ["In-context", "External Storage", "Hybrid Systems"],
    challenges: [
      "Memory management",
      "Relevance filtering",
      "Privacy concerns",
    ],
    difficulty: "advanced",
  },
  "multi-agent systems": {
    definition:
      "Multi-agent systems consist of multiple AI agents working together to solve complex problems. Each agent has specialized capabilities and they coordinate through communication and shared goals.",
    keyComponents: [
      "Agent Specialization: Each agent has specific expertise",
      "Communication Protocols: How agents share information",
      "Coordination Mechanisms: Task allocation and synchronization",
      "Shared Environment: Common workspace or knowledge base",
    ],
    capabilities: [
      "Parallel task execution",
      "Specialized problem solving",
      "Emergent collective intelligence",
      "Scalable complexity handling",
    ],
    examples: [
      "AutoGen: Microsoft's multi-agent framework",
      "CrewAI: Role-based agent collaboration",
      "MetaGPT: Software development agent teams",
    ],
    architectureTypes: [
      "Hierarchical",
      "Peer-to-peer",
      "Blackboard",
      "Market-based",
    ],
    challenges: [
      "Coordination overhead",
      "Communication efficiency",
      "Conflict resolution",
    ],
    difficulty: "advanced",
  },
  "prompt engineering": {
    definition:
      "Prompt engineering is the practice of designing and optimizing inputs to AI models to achieve desired outputs. For agents, this includes system prompts, tool descriptions, and interaction patterns.",
    keyComponents: [
      "System Instructions: Agent behavior definition",
      "Tool Descriptions: Clear tool purpose and usage",
      "Context Management: Relevant information inclusion",
      "Output Formatting: Structured response guidance",
    ],
    capabilities: [
      "Behavior customization",
      "Performance optimization",
      "Error reduction",
      "Consistency improvement",
    ],
    examples: [
      "Chain-of-thought prompting for reasoning",
      "Few-shot examples for tool usage",
      "Role-playing for specialized agents",
    ],
    architectureTypes: [
      "Zero-shot",
      "Few-shot",
      "Chain-of-thought",
      "Tree-of-thought",
    ],
    challenges: [
      "Prompt sensitivity",
      "Model dependency",
      "Context length limits",
    ],
    difficulty: "intermediate",
  },
  "agent frameworks": {
    definition:
      "Agent frameworks are software libraries and platforms that provide infrastructure for building AI agents. They handle common patterns like tool integration, memory management, and execution loops.",
    keyComponents: [
      "Agent Definition: Classes and interfaces for agents",
      "Tool Registry: Managing available tools",
      "Execution Engine: Running agent loops",
      "Integration Layer: Connecting to LLMs and services",
    ],
    capabilities: [
      "Rapid agent development",
      "Standardized patterns",
      "Built-in tool libraries",
      "Production deployment support",
    ],
    examples: [
      "LangChain: Comprehensive agent framework",
      "Mastra: Modern agent development platform",
      "Semantic Kernel: Microsoft's AI orchestration",
    ],
    architectureTypes: ["Library-based", "Platform-based", "Low-code/No-code"],
    challenges: [
      "Framework lock-in",
      "Performance overhead",
      "Customization limits",
    ],
    difficulty: "intermediate",
  },
  "retrieval augmented generation": {
    definition:
      "RAG (Retrieval Augmented Generation) enhances AI agents by retrieving relevant information from external knowledge bases before generating responses. This grounds the agent's outputs in factual data.",
    keyComponents: [
      "Document Store: Repository of knowledge",
      "Embedding Model: Converting text to vectors",
      "Vector Database: Efficient similarity search",
      "Retrieval Pipeline: Query and ranking system",
    ],
    capabilities: [
      "Access to current information",
      "Reduced hallucination",
      "Domain-specific expertise",
      "Source attribution",
    ],
    examples: [
      "Perplexity AI: Web-scale RAG for search",
      "ChatGPT with browsing: Real-time information retrieval",
      "Enterprise chatbots with document stores",
    ],
    architectureTypes: [
      "Dense Retrieval",
      "Sparse Retrieval",
      "Hybrid",
      "Graph RAG",
    ],
    challenges: [
      "Retrieval quality",
      "Context integration",
      "Latency",
      "Index maintenance",
    ],
    difficulty: "advanced",
  },
};

export const aiAgentConceptsTool = createTool({
  id: "explain-ai-agent-concept",
  description:
    "Explains AI agent concepts including architectures, patterns, memory systems, and frameworks. Use this to learn about building and understanding AI agents.",
  inputSchema: z.object({
    concept: z
      .string()
      .describe(
        "The AI agent concept to explain (e.g., 'react pattern', 'multi-agent systems', 'rag')"
      ),
    focusArea: z
      .enum(["definition", "implementation", "examples", "challenges"])
      .optional()
      .describe("Specific aspect to focus on"),
  }),
  outputSchema: z.object({
    concept: z.string(),
    definition: z.string(),
    keyComponents: z.array(z.string()).optional(),
    capabilities: z.array(z.string()).optional(),
    examples: z.array(z.string()).optional(),
    architectureTypes: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    implementationTips: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const { concept, focusArea } = context;
    const searchTerm = concept.toLowerCase();

    // Find exact match or partial match
    let conceptData =
      aiAgentConcepts[searchTerm] ||
      aiAgentConcepts[searchTerm.replace(/-/g, " ")] ||
      aiAgentConcepts[searchTerm.replace(/_/g, " ")];

    if (!conceptData) {
      // Try to find partial matches
      const matchingKey = Object.keys(aiAgentConcepts).find(
        (key) =>
          key.includes(searchTerm) ||
          searchTerm.includes(key) ||
          (searchTerm === "rag" && key.includes("retrieval augmented"))
      );

      if (matchingKey) {
        conceptData = aiAgentConcepts[matchingKey];
      }
    }

    if (!conceptData) {
      // Provide helpful response for unknown concepts
      return {
        concept: concept,
        definition: `I don't have a specific entry for "${concept}". Here are the AI agent concepts I can explain: AI agents, ReAct pattern, tool calling, agent memory, multi-agent systems, prompt engineering, agent frameworks, and RAG (Retrieval Augmented Generation).`,
        examples: Object.keys(aiAgentConcepts),
        implementationTips: [
          "Try searching for one of the listed concepts",
          "Ask about specific aspects of AI agent development",
        ],
      };
    }

    // Build focused response based on focusArea
    let response: any = {
      concept: concept,
      definition: conceptData.definition,
      difficulty: conceptData.difficulty,
    };

    switch (focusArea) {
      case "implementation":
        response.keyComponents = conceptData.keyComponents;
        response.architectureTypes = conceptData.architectureTypes;
        response.implementationTips = [
          "Start with a simple prototype",
          "Test each component independently",
          "Use established frameworks when possible",
          `Consider the ${conceptData.architectureTypes.join(", ")} approaches`,
        ];
        break;

      case "examples":
        response.examples = conceptData.examples;
        response.capabilities = conceptData.capabilities;
        response.implementationTips = [
          "Study existing implementations",
          "Start with framework examples",
          "Build incrementally",
        ];
        break;

      case "challenges":
        response.challenges = conceptData.challenges;
        response.implementationTips = [
          "Plan for error handling",
          "Implement logging and monitoring",
          "Test edge cases thoroughly",
          "Consider fallback strategies",
        ];
        break;

      default: // "definition" or undefined - comprehensive view
        response.keyComponents = conceptData.keyComponents;
        response.capabilities = conceptData.capabilities;
        response.examples = conceptData.examples;
        response.challenges = conceptData.challenges;
        response.architectureTypes = conceptData.architectureTypes;
    }

    return response;
  },
});

