import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface StudyModule {
  week: number;
  title: string;
  topics: string[];
  objectives: string[];
  practicalExercises: string[];
  resources: string[];
  milestone: string;
}

interface StudyPlan {
  title: string;
  duration: string;
  level: string;
  overview: string;
  prerequisites: string[];
  modules: StudyModule[];
  finalProject: string;
  assessmentStrategy: string[];
}

const generateBlockchainStudyPlan = (
  level: string,
  duration: number
): StudyPlan => {
  const weeks = Math.floor(duration / 7);

  if (level === "beginner") {
    return {
      title: "Blockchain Fundamentals Study Plan",
      duration: `${weeks} weeks`,
      level: "Beginner",
      overview:
        "A comprehensive introduction to blockchain technology, covering basic concepts, cryptocurrencies, and practical applications.",
      prerequisites: [
        "Basic computer literacy",
        "Understanding of internet concepts",
      ],
      modules: [
        {
          week: 1,
          title: "Introduction to Blockchain",
          topics: [
            "What is blockchain?",
            "History and evolution",
            "Decentralization concepts",
            "Blockchain vs traditional databases",
          ],
          objectives: [
            "Understand blockchain fundamentals",
            "Identify use cases",
            "Grasp decentralization benefits",
          ],
          practicalExercises: [
            "Explore blockchain explorers",
            "Create a crypto wallet",
            "Trace a Bitcoin transaction",
          ],
          resources: [
            "Bitcoin whitepaper",
            "Blockchain basics videos",
            "Interactive blockchain demo",
          ],
          milestone: "Explain blockchain to a non-technical person",
        },
        {
          week: 2,
          title: "Cryptocurrencies and Consensus",
          topics: [
            "Bitcoin basics",
            "Consensus mechanisms",
            "Mining vs Staking",
            "Cryptocurrency wallets",
          ],
          objectives: [
            "Understand how cryptocurrencies work",
            "Compare consensus mechanisms",
            "Security fundamentals",
          ],
          practicalExercises: [
            "Set up different wallets",
            "Participate in a testnet",
            "Calculate mining profitability",
          ],
          resources: [
            "Consensus mechanism comparisons",
            "Wallet security guides",
            "Testnet faucets",
          ],
          milestone: "Complete a testnet transaction",
        },
        {
          week: 3,
          title: "Smart Contracts and DApps",
          topics: [
            "Smart contract basics",
            "Ethereum introduction",
            "DApp architecture",
            "Gas and fees",
          ],
          objectives: [
            "Understand programmable blockchains",
            "Identify DApp components",
            "Estimate transaction costs",
          ],
          practicalExercises: [
            "Deploy a simple smart contract",
            "Interact with existing DApps",
            "Monitor gas prices",
          ],
          resources: ["Ethereum documentation", "Remix IDE", "DApp tutorials"],
          milestone: "Deploy and interact with a smart contract",
        },
      ],
      finalProject:
        "Create a presentation explaining blockchain technology and build a simple DApp interface",
      assessmentStrategy: [
        "Weekly quizzes",
        "Practical exercises",
        "Final project presentation",
      ],
    };
  } else if (level === "intermediate") {
    return {
      title: "Advanced Blockchain Development",
      duration: `${weeks} weeks`,
      level: "Intermediate",
      overview:
        "Deep dive into blockchain development, smart contract programming, and DeFi protocols.",
      prerequisites: [
        "Basic blockchain knowledge",
        "Programming experience",
        "Understanding of web development",
      ],
      modules: [
        {
          week: 1,
          title: "Solidity Programming",
          topics: [
            "Solidity syntax",
            "Data types and structures",
            "Functions and modifiers",
            "Events and logging",
          ],
          objectives: [
            "Write Solidity contracts",
            "Implement access control",
            "Handle events properly",
          ],
          practicalExercises: [
            "Build an ERC-20 token",
            "Create a voting contract",
            "Implement multi-sig wallet",
          ],
          resources: [
            "Solidity documentation",
            "OpenZeppelin contracts",
            "Security best practices",
          ],
          milestone: "Deploy a functional ERC-20 token",
        },
        {
          week: 2,
          title: "DeFi Protocols",
          topics: [
            "AMMs and DEXs",
            "Lending protocols",
            "Yield farming",
            "Flash loans",
          ],
          objectives: [
            "Understand DeFi mechanics",
            "Analyze protocol risks",
            "Calculate yields",
          ],
          practicalExercises: [
            "Fork Uniswap",
            "Build a simple lending pool",
            "Execute a flash loan",
          ],
          resources: [
            "DeFi protocol whitepapers",
            "TVL analytics",
            "Security audit reports",
          ],
          milestone: "Build a basic AMM",
        },
      ],
      finalProject:
        "Develop a complete DeFi protocol with lending and swapping features",
      assessmentStrategy: [
        "Code reviews",
        "Security assessments",
        "Protocol design evaluation",
      ],
    };
  } else {
    return {
      title: "Blockchain Architecture and Research",
      duration: `${weeks} weeks`,
      level: "Advanced",
      overview:
        "Cutting-edge blockchain research, scalability solutions, and protocol design.",
      prerequisites: [
        "Strong blockchain development experience",
        "Computer science background",
        "Cryptography basics",
      ],
      modules: [
        {
          week: 1,
          title: "Scalability Solutions",
          topics: [
            "Layer 2 architectures",
            "Rollups",
            "Sharding",
            "Cross-chain bridges",
          ],
          objectives: [
            "Design scalability solutions",
            "Analyze trade-offs",
            "Implement bridges",
          ],
          practicalExercises: [
            "Deploy on L2",
            "Build a state channel",
            "Create cross-chain messages",
          ],
          resources: [
            "Research papers",
            "L2 documentation",
            "Bridge architectures",
          ],
          milestone: "Design a novel scalability solution",
        },
      ],
      finalProject:
        "Research and implement a novel blockchain protocol or significant improvement",
      assessmentStrategy: [
        "Research paper",
        "Implementation quality",
        "Performance benchmarks",
      ],
    };
  }
};

const generateAIAgentStudyPlan = (
  level: string,
  duration: number
): StudyPlan => {
  const weeks = Math.floor(duration / 7);

  if (level === "beginner") {
    return {
      title: "AI Agents Fundamentals",
      duration: `${weeks} weeks`,
      level: "Beginner",
      overview:
        "Introduction to AI agents, covering basic concepts, tools, and simple implementations.",
      prerequisites: ["Basic programming knowledge", "Familiarity with APIs"],
      modules: [
        {
          week: 1,
          title: "Introduction to AI Agents",
          topics: [
            "What are AI agents?",
            "LLMs and agent capabilities",
            "Agent components",
            "Use cases",
          ],
          objectives: [
            "Understand agent architecture",
            "Identify agent applications",
            "Set up development environment",
          ],
          practicalExercises: [
            "Use ChatGPT API",
            "Build a simple chatbot",
            "Experiment with prompts",
          ],
          resources: [
            "OpenAI documentation",
            "LangChain tutorials",
            "Agent examples",
          ],
          milestone: "Build a basic conversational agent",
        },
        {
          week: 2,
          title: "Tools and Function Calling",
          topics: [
            "Tool integration",
            "Function calling",
            "API connections",
            "Error handling",
          ],
          objectives: [
            "Implement tool calling",
            "Handle tool responses",
            "Build robust agents",
          ],
          practicalExercises: [
            "Add calculator tool",
            "Integrate weather API",
            "Build search tool",
          ],
          resources: [
            "Function calling guides",
            "API documentation",
            "Tool examples",
          ],
          milestone: "Create an agent with 3+ tools",
        },
      ],
      finalProject:
        "Build a personal assistant agent with multiple tools and capabilities",
      assessmentStrategy: [
        "Code functionality",
        "Agent reliability",
        "User experience",
      ],
    };
  } else if (level === "intermediate") {
    return {
      title: "Advanced AI Agent Development",
      duration: `${weeks} weeks`,
      level: "Intermediate",
      overview:
        "Deep dive into agent architectures, memory systems, and production deployment.",
      prerequisites: [
        "AI agent basics",
        "Strong programming skills",
        "API development experience",
      ],
      modules: [
        {
          week: 1,
          title: "Agent Architectures",
          topics: [
            "ReAct pattern",
            "Plan-and-Execute",
            "Multi-agent systems",
            "Agent communication",
          ],
          objectives: [
            "Implement different patterns",
            "Design agent systems",
            "Optimize performance",
          ],
          practicalExercises: [
            "Build ReAct agent",
            "Create agent pipeline",
            "Implement agent routing",
          ],
          resources: [
            "Architecture papers",
            "Framework documentation",
            "Design patterns",
          ],
          milestone: "Implement 2+ agent architectures",
        },
        {
          week: 2,
          title: "Memory and RAG",
          topics: [
            "Memory systems",
            "Vector databases",
            "RAG implementation",
            "Context management",
          ],
          objectives: [
            "Build memory systems",
            "Implement RAG",
            "Manage conversation state",
          ],
          practicalExercises: [
            "Add persistent memory",
            "Build RAG pipeline",
            "Implement context window",
          ],
          resources: [
            "Vector DB tutorials",
            "RAG papers",
            "Memory architectures",
          ],
          milestone: "Deploy agent with long-term memory",
        },
      ],
      finalProject:
        "Build a production-ready agent system with memory, RAG, and monitoring",
      assessmentStrategy: [
        "System design",
        "Performance metrics",
        "Scalability assessment",
      ],
    };
  } else {
    return {
      title: "AI Agent Research and Innovation",
      duration: `${weeks} weeks`,
      level: "Advanced",
      overview:
        "Cutting-edge agent research, novel architectures, and advanced implementations.",
      prerequisites: [
        "Extensive agent development experience",
        "ML/AI background",
        "Research skills",
      ],
      modules: [
        {
          week: 1,
          title: "Advanced Agent Systems",
          topics: [
            "Agent swarms",
            "Emergent behaviors",
            "Self-improving agents",
            "Cognitive architectures",
          ],
          objectives: [
            "Research novel approaches",
            "Design complex systems",
            "Evaluate agent intelligence",
          ],
          practicalExercises: [
            "Build agent swarm",
            "Implement self-reflection",
            "Create evaluation framework",
          ],
          resources: [
            "Research papers",
            "Academic courses",
            "Open research problems",
          ],
          milestone: "Publish research or novel implementation",
        },
      ],
      finalProject:
        "Design and implement a novel agent architecture or significant advancement",
      assessmentStrategy: [
        "Innovation assessment",
        "Research quality",
        "Real-world impact",
      ],
    };
  }
};

export const studyPlanGeneratorTool = createTool({
  id: "generate-study-plan",
  description:
    "Generates personalized study plans for learning blockchain or AI agents based on experience level and available time.",
  inputSchema: z.object({
    topic: z
      .enum(["blockchain", "ai-agents"])
      .describe("The main topic to study"),
    experienceLevel: z
      .enum(["beginner", "intermediate", "advanced"])
      .describe("Current experience level"),
    availableTime: z
      .number()
      .min(7)
      .max(180)
      .describe("Available time in days"),
    learningGoals: z
      .array(z.string())
      .optional()
      .describe("Specific learning goals"),
    preferredStyle: z
      .enum(["theoretical", "practical", "balanced"])
      .optional()
      .default("balanced")
      .describe("Preferred learning style"),
  }),
  outputSchema: z.object({
    studyPlan: z.object({
      title: z.string(),
      duration: z.string(),
      level: z.string(),
      overview: z.string(),
      prerequisites: z.array(z.string()),
      modules: z.array(
        z.object({
          week: z.number(),
          title: z.string(),
          topics: z.array(z.string()),
          objectives: z.array(z.string()),
          practicalExercises: z.array(z.string()),
          resources: z.array(z.string()),
          milestone: z.string(),
        })
      ),
      finalProject: z.string(),
      assessmentStrategy: z.array(z.string()),
    }),
    customRecommendations: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const {
      topic,
      experienceLevel,
      availableTime,
      learningGoals,
      preferredStyle = "balanced",
    } = context;

    let studyPlan: StudyPlan;

    if (topic === "blockchain") {
      studyPlan = generateBlockchainStudyPlan(experienceLevel, availableTime);
    } else {
      studyPlan = generateAIAgentStudyPlan(experienceLevel, availableTime);
    }

    // Adjust based on available time
    const totalWeeks = Math.floor(availableTime / 7);
    if (totalWeeks < studyPlan.modules.length) {
      // Compress modules
      studyPlan.modules = studyPlan.modules.slice(0, totalWeeks);
      studyPlan.duration = `${totalWeeks} weeks (compressed)`;
    } else if (totalWeeks > studyPlan.modules.length) {
      // Add practice/review weeks
      const extraWeeks = totalWeeks - studyPlan.modules.length;
      studyPlan.modules.push({
        week: studyPlan.modules.length + 1,
        title: "Advanced Practice and Review",
        topics: [
          "Deep dive into chosen topics",
          "Personal project development",
          "Community contribution",
        ],
        objectives: [
          "Master advanced concepts",
          "Build portfolio",
          "Contribute to open source",
        ],
        practicalExercises: [
          "Complete personal project",
          "Contribute to open source",
          "Mentor others",
        ],
        resources: [
          "Advanced tutorials",
          "Open source projects",
          "Community forums",
        ],
        milestone: "Complete significant project or contribution",
      });
      studyPlan.duration = `${totalWeeks} weeks (extended with practice)`;
    }

    // Adjust based on learning style
    if (preferredStyle === "practical") {
      studyPlan.modules.forEach((module) => {
        module.practicalExercises = [
          ...module.practicalExercises,
          "Additional hands-on project",
        ];
        module.topics = module.topics.slice(0, -1); // Reduce theory
      });
    } else if (preferredStyle === "theoretical") {
      studyPlan.modules.forEach((module) => {
        module.topics = [...module.topics, "Deep theoretical exploration"];
        module.resources = [...module.resources, "Academic papers"];
      });
    }

    // Custom recommendations based on goals
    const customRecommendations: string[] = [];

    if (
      learningGoals?.some(
        (goal) =>
          goal.toLowerCase().includes("job") ||
          goal.toLowerCase().includes("career")
      )
    ) {
      customRecommendations.push("Focus on building a portfolio of projects");
      customRecommendations.push("Contribute to open source projects");
      customRecommendations.push("Network with professionals in the field");
    }

    if (
      learningGoals?.some(
        (goal) =>
          goal.toLowerCase().includes("startup") ||
          goal.toLowerCase().includes("business")
      )
    ) {
      customRecommendations.push(
        "Study real-world use cases and business models"
      );
      customRecommendations.push("Connect with entrepreneurs in the space");
      customRecommendations.push("Focus on practical, marketable applications");
    }

    if (experienceLevel === "beginner") {
      customRecommendations.push("Join beginner-friendly communities");
      customRecommendations.push(
        "Don't rush - take time to understand fundamentals"
      );
      customRecommendations.push("Practice regularly with small projects");
    }

    return {
      studyPlan,
      customRecommendations:
        customRecommendations.length > 0 ? customRecommendations : undefined,
    };
  },
});

