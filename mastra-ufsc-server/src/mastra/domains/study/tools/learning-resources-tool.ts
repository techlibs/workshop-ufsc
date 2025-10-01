import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface LearningResource {
  title: string;
  type:
    | "documentation"
    | "tutorial"
    | "video"
    | "course"
    | "book"
    | "paper"
    | "tool"
    | "community";
  url: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
  free: boolean;
  estimatedTime?: string;
  prerequisites?: string[];
}

const blockchainResources: LearningResource[] = [
  // Documentation
  {
    title: "Bitcoin Whitepaper",
    type: "paper",
    url: "https://bitcoin.org/bitcoin.pdf",
    description:
      "The original Bitcoin whitepaper by Satoshi Nakamoto. Essential reading for understanding blockchain fundamentals.",
    level: "intermediate",
    topics: ["blockchain", "bitcoin", "consensus", "peer-to-peer"],
    free: true,
    estimatedTime: "1 hour",
    prerequisites: ["Basic cryptography concepts"],
  },
  {
    title: "Ethereum Documentation",
    type: "documentation",
    url: "https://ethereum.org/developers",
    description:
      "Official Ethereum documentation covering smart contracts, DApps, and the Ethereum ecosystem.",
    level: "intermediate",
    topics: ["ethereum", "smart contracts", "web3", "solidity"],
    free: true,
    prerequisites: ["Blockchain basics", "Programming knowledge"],
  },
  // Tutorials
  {
    title: "CryptoZombies",
    type: "tutorial",
    url: "https://cryptozombies.io/",
    description:
      "Interactive coding school that teaches you to build DApps on Ethereum through building a zombie game.",
    level: "beginner",
    topics: ["solidity", "smart contracts", "ethereum", "web3"],
    free: true,
    estimatedTime: "10-15 hours",
  },
  {
    title: "Buildspace",
    type: "tutorial",
    url: "https://buildspace.so/",
    description:
      "Project-based learning platform for Web3 development with guided tutorials and community support.",
    level: "beginner",
    topics: ["web3", "smart contracts", "nfts", "daos"],
    free: true,
    estimatedTime: "Varies by project",
  },
  // Videos
  {
    title: "Blockchain Basics by Anders Brownworth",
    type: "video",
    url: "https://andersbrownworth.com/blockchain/",
    description:
      "Visual demonstration of blockchain concepts including hashing, blocks, and distributed networks.",
    level: "beginner",
    topics: ["blockchain", "hashing", "distributed systems"],
    free: true,
    estimatedTime: "30 minutes",
  },
  // Courses
  {
    title: "Blockchain Specialization - Coursera",
    type: "course",
    url: "https://www.coursera.org/specializations/blockchain",
    description:
      "Comprehensive blockchain specialization covering fundamentals, smart contracts, and DApps.",
    level: "intermediate",
    topics: [
      "blockchain",
      "smart contracts",
      "decentralization",
      "cryptography",
    ],
    free: false,
    estimatedTime: "4 months",
    prerequisites: ["Basic programming"],
  },
  {
    title: "MIT OpenCourseWare - Blockchain and Money",
    type: "course",
    url: "https://ocw.mit.edu/courses/sloan-school-of-management/15-s12-blockchain-and-money-fall-2018/",
    description:
      "MIT course by Gary Gensler covering blockchain technology, cryptocurrencies, and potential use cases.",
    level: "intermediate",
    topics: ["blockchain", "cryptocurrency", "finance", "regulation"],
    free: true,
    estimatedTime: "24 lectures",
  },
  // Books
  {
    title: "Mastering Bitcoin",
    type: "book",
    url: "https://github.com/bitcoinbook/bitcoinbook",
    description:
      "Comprehensive technical book about Bitcoin by Andreas Antonopoulos. Available free online.",
    level: "advanced",
    topics: ["bitcoin", "blockchain", "cryptography", "consensus"],
    free: true,
    prerequisites: ["Programming experience", "Basic cryptography"],
  },
  {
    title: "Mastering Ethereum",
    type: "book",
    url: "https://github.com/ethereumbook/ethereumbook",
    description:
      "Technical guide to Ethereum, smart contracts, and DApp development by Andreas Antonopoulos and Gavin Wood.",
    level: "advanced",
    topics: ["ethereum", "smart contracts", "evm", "web3"],
    free: true,
    prerequisites: ["Blockchain basics", "Programming experience"],
  },
  // Tools
  {
    title: "Remix IDE",
    type: "tool",
    url: "https://remix.ethereum.org/",
    description:
      "Browser-based IDE for Solidity development with built-in compiler, debugger, and deployment tools.",
    level: "beginner",
    topics: ["solidity", "smart contracts", "ethereum", "development"],
    free: true,
  },
  {
    title: "Hardhat",
    type: "tool",
    url: "https://hardhat.org/",
    description:
      "Professional Ethereum development environment for compiling, testing, and deploying smart contracts.",
    level: "intermediate",
    topics: ["ethereum", "testing", "deployment", "development"],
    free: true,
    prerequisites: ["Node.js", "JavaScript/TypeScript"],
  },
  // Communities
  {
    title: "r/ethereum",
    type: "community",
    url: "https://www.reddit.com/r/ethereum/",
    description:
      "Active Reddit community for Ethereum discussions, news, and technical questions.",
    level: "beginner",
    topics: ["ethereum", "community", "news", "discussion"],
    free: true,
  },
  {
    title: "Ethereum Stack Exchange",
    type: "community",
    url: "https://ethereum.stackexchange.com/",
    description:
      "Q&A platform for Ethereum developers with high-quality technical discussions.",
    level: "intermediate",
    topics: ["ethereum", "solidity", "web3", "troubleshooting"],
    free: true,
  },
];

const aiAgentResources: LearningResource[] = [
  // Documentation
  {
    title: "OpenAI API Documentation",
    type: "documentation",
    url: "https://platform.openai.com/docs",
    description:
      "Official documentation for OpenAI's API, including function calling and assistants.",
    level: "beginner",
    topics: ["openai", "api", "function calling", "gpt"],
    free: true,
    prerequisites: ["API basics"],
  },
  {
    title: "LangChain Documentation",
    type: "documentation",
    url: "https://python.langchain.com/docs/get_started/introduction",
    description:
      "Comprehensive documentation for LangChain, a framework for developing applications with LLMs.",
    level: "intermediate",
    topics: ["langchain", "agents", "chains", "memory", "tools"],
    free: true,
    prerequisites: ["Python", "LLM basics"],
  },
  {
    title: "Anthropic Claude Documentation",
    type: "documentation",
    url: "https://docs.anthropic.com/",
    description:
      "Documentation for Claude API including tool use, system prompts, and best practices.",
    level: "beginner",
    topics: ["claude", "anthropic", "tools", "prompts"],
    free: true,
  },
  // Tutorials
  {
    title: "Building AI Agents with LangChain",
    type: "tutorial",
    url: "https://www.deeplearning.ai/short-courses/langchain/",
    description:
      "Free course by DeepLearning.AI on building LLM applications with LangChain.",
    level: "intermediate",
    topics: ["langchain", "agents", "rag", "chains"],
    free: true,
    estimatedTime: "1-2 hours",
    prerequisites: ["Python", "Basic ML knowledge"],
  },
  {
    title: "Function Calling Tutorial - OpenAI",
    type: "tutorial",
    url: "https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models",
    description:
      "Official OpenAI cookbook tutorial on implementing function calling with GPT models.",
    level: "beginner",
    topics: ["function calling", "tools", "openai", "gpt"],
    free: true,
    estimatedTime: "30 minutes",
  },
  // Papers
  {
    title: "ReAct: Synergizing Reasoning and Acting",
    type: "paper",
    url: "https://arxiv.org/abs/2210.03629",
    description:
      "Research paper introducing the ReAct pattern for language model agents.",
    level: "advanced",
    topics: ["react", "agents", "reasoning", "research"],
    free: true,
    estimatedTime: "1-2 hours",
    prerequisites: ["ML background", "Agent concepts"],
  },
  {
    title: "Retrieval-Augmented Generation",
    type: "paper",
    url: "https://arxiv.org/abs/2005.11401",
    description:
      "Original RAG paper by Facebook AI Research introducing the concept.",
    level: "advanced",
    topics: ["rag", "retrieval", "memory", "research"],
    free: true,
    prerequisites: ["NLP knowledge", "ML background"],
  },
  // Videos
  {
    title: "Building Production-Ready LLM Applications",
    type: "video",
    url: "https://www.youtube.com/watch?v=kP7qGAr_sD8",
    description:
      "Comprehensive talk on building robust LLM applications with proper engineering practices.",
    level: "intermediate",
    topics: ["production", "engineering", "best practices", "llm"],
    free: true,
    estimatedTime: "1 hour",
  },
  // Courses
  {
    title: "LangChain for LLM Application Development",
    type: "course",
    url: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/",
    description:
      "Short course by Andrew Ng and Harrison Chase on building LLM apps with LangChain.",
    level: "intermediate",
    topics: ["langchain", "llm", "applications", "development"],
    free: true,
    estimatedTime: "1-2 hours",
    prerequisites: ["Python", "API experience"],
  },
  {
    title: "Building AI Agents in LangGraph",
    type: "course",
    url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
    description:
      "Learn to build stateful, multi-actor AI agents using LangGraph.",
    level: "advanced",
    topics: ["langgraph", "agents", "state management", "workflows"],
    free: true,
    estimatedTime: "2-3 hours",
    prerequisites: ["LangChain knowledge", "Python"],
  },
  // Tools
  {
    title: "LangSmith",
    type: "tool",
    url: "https://www.langchain.com/langsmith",
    description:
      "Platform for debugging, testing, and monitoring LLM applications in production.",
    level: "intermediate",
    topics: ["debugging", "monitoring", "testing", "production"],
    free: false,
    prerequisites: ["LangChain experience"],
  },
  {
    title: "Flowise",
    type: "tool",
    url: "https://flowiseai.com/",
    description:
      "Low-code tool for building LLM applications with a visual interface.",
    level: "beginner",
    topics: ["low-code", "visual", "chatbots", "agents"],
    free: true,
  },
  {
    title: "AutoGPT",
    type: "tool",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
    description:
      "Experimental open-source autonomous AI agent that can perform tasks with minimal input.",
    level: "advanced",
    topics: ["autonomous", "agents", "experimental", "open-source"],
    free: true,
    prerequisites: ["Python", "API keys", "Agent understanding"],
  },
  // Communities
  {
    title: "r/LocalLLaMA",
    type: "community",
    url: "https://www.reddit.com/r/LocalLLaMA/",
    description:
      "Reddit community focused on running and developing with local language models.",
    level: "intermediate",
    topics: ["local llm", "open source", "community", "discussion"],
    free: true,
  },
  {
    title: "LangChain Discord",
    type: "community",
    url: "https://discord.gg/langchain",
    description:
      "Official Discord server for LangChain developers with active discussions and support.",
    level: "intermediate",
    topics: ["langchain", "community", "support", "collaboration"],
    free: true,
  },
];

export const learningResourcesTool = createTool({
  id: "find-learning-resources",
  description:
    "Finds relevant learning resources for blockchain or AI agents including documentation, tutorials, courses, tools, and communities.",
  inputSchema: z.object({
    topic: z
      .enum(["blockchain", "ai-agents", "both"])
      .describe("The main topic to find resources for"),
    resourceTypes: z
      .array(
        z.enum([
          "documentation",
          "tutorial",
          "video",
          "course",
          "book",
          "paper",
          "tool",
          "community",
        ])
      )
      .optional()
      .describe("Specific types of resources to include"),
    level: z
      .enum(["beginner", "intermediate", "advanced", "all"])
      .default("all")
      .describe("Difficulty level of resources"),
    specificTopics: z
      .array(z.string())
      .optional()
      .describe(
        "Specific subtopics to focus on (e.g., 'smart contracts', 'rag')"
      ),
    freeOnly: z.boolean().default(false).describe("Only show free resources"),
    maxResults: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Maximum number of resources to return"),
  }),
  outputSchema: z.object({
    resources: z.array(
      z.object({
        title: z.string(),
        type: z.enum([
          "documentation",
          "tutorial",
          "video",
          "course",
          "book",
          "paper",
          "tool",
          "community",
        ]),
        url: z.string(),
        description: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        topics: z.array(z.string()),
        free: z.boolean(),
        estimatedTime: z.string().optional(),
        prerequisites: z.array(z.string()).optional(),
      })
    ),
    summary: z.object({
      totalFound: z.number(),
      byType: z.record(z.string(), z.number()),
      byLevel: z.record(z.string(), z.number()),
    }),
    recommendations: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const {
      topic,
      resourceTypes,
      level,
      specificTopics,
      freeOnly,
      maxResults,
    } = context;

    // Combine resource pools based on topic
    let allResources: LearningResource[] = [];
    if (topic === "blockchain") {
      allResources = [...blockchainResources];
    } else if (topic === "ai-agents") {
      allResources = [...aiAgentResources];
    } else {
      allResources = [...blockchainResources, ...aiAgentResources];
    }

    // Apply filters
    let filteredResources = allResources;

    // Filter by resource types
    if (resourceTypes && resourceTypes.length > 0) {
      filteredResources = filteredResources.filter((r) =>
        resourceTypes.includes(r.type)
      );
    }

    // Filter by level
    if (level !== "all") {
      filteredResources = filteredResources.filter((r) => r.level === level);
    }

    // Filter by specific topics
    if (specificTopics && specificTopics.length > 0) {
      filteredResources = filteredResources.filter((r) =>
        r.topics.some((topic) =>
          specificTopics.some(
            (specific) =>
              topic.toLowerCase().includes(specific.toLowerCase()) ||
              specific.toLowerCase().includes(topic.toLowerCase())
          )
        )
      );
    }

    // Filter by free/paid
    if (freeOnly) {
      filteredResources = filteredResources.filter((r) => r.free);
    }

    // Sort by relevance (prioritize exact topic matches)
    if (specificTopics && specificTopics.length > 0) {
      filteredResources.sort((a, b) => {
        const aMatches = a.topics.filter((t) =>
          specificTopics.some((s) => t.toLowerCase().includes(s.toLowerCase()))
        ).length;
        const bMatches = b.topics.filter((t) =>
          specificTopics.some((s) => t.toLowerCase().includes(s.toLowerCase()))
        ).length;
        return bMatches - aMatches;
      });
    }

    // Limit results
    const selectedResources = filteredResources.slice(0, maxResults);

    // Generate summary statistics
    const byType: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    selectedResources.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      byLevel[r.level] = (byLevel[r.level] || 0) + 1;
    });

    // Generate recommendations
    const recommendations: string[] = [];

    if (level === "beginner" || level === "all") {
      recommendations.push(
        "Start with interactive tutorials and visual demonstrations"
      );
      recommendations.push("Join communities early to get help when stuck");
    }

    if (level === "intermediate" || level === "all") {
      recommendations.push(
        "Focus on building projects to solidify your understanding"
      );
      recommendations.push(
        "Read documentation thoroughly before implementation"
      );
    }

    if (level === "advanced" || level === "all") {
      recommendations.push(
        "Dive into research papers for cutting-edge concepts"
      );
      recommendations.push(
        "Contribute to open-source projects to gain real-world experience"
      );
    }

    if (topic === "blockchain" || topic === "both") {
      recommendations.push(
        "Use testnets for hands-on practice without real costs"
      );
    }

    if (topic === "ai-agents" || topic === "both") {
      recommendations.push(
        "Experiment with different LLM providers to understand their strengths"
      );
    }

    // Add specific recommendations based on resource types found
    if (byType.tool && byType.tool > 0) {
      recommendations.push(
        "Practice with the tools mentioned to get hands-on experience"
      );
    }

    if (byType.paper && byType.paper > 0) {
      recommendations.push(
        "Research papers provide deep insights but require patience and background knowledge"
      );
    }

    return {
      resources: selectedResources,
      summary: {
        totalFound: filteredResources.length,
        byType,
        byLevel,
      },
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  },
});

