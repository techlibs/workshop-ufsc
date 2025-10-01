import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  concept: string;
}

interface Quiz {
  title: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  passingScore: number;
  estimatedTime: string;
}

const blockchainQuestions: QuizQuestion[] = [
  // Easy Questions
  {
    id: 1,
    question:
      "What is the primary characteristic that makes blockchain 'immutable'?",
    options: [
      "Data can be easily modified by administrators",
      "Once data is recorded, it cannot be altered retroactively",
      "Only authorized users can read the data",
      "Data is stored in a central location",
    ],
    correctAnswer: 1,
    explanation:
      "Blockchain's immutability comes from cryptographic hashing and the chain structure. Each block contains a hash of the previous block, making it computationally infeasible to alter past records without changing all subsequent blocks.",
    difficulty: "easy",
    concept: "blockchain",
  },
  {
    id: 2,
    question: "What does 'decentralization' mean in the context of blockchain?",
    options: [
      "All data is stored in one secure location",
      "No single entity has control over the entire network",
      "Only government agencies can access the data",
      "Data is encrypted and hidden from users",
    ],
    correctAnswer: 1,
    explanation:
      "Decentralization means the network operates without a central authority. Instead, control is distributed among many participants (nodes), making the system more resistant to censorship and single points of failure.",
    difficulty: "easy",
    concept: "blockchain",
  },
  {
    id: 3,
    question: "What is a smart contract?",
    options: [
      "A legal document stored on the blockchain",
      "A contract signed with digital signatures",
      "Self-executing code with terms directly written into it",
      "An agreement between blockchain miners",
    ],
    correctAnswer: 2,
    explanation:
      "Smart contracts are programs stored on a blockchain that automatically execute when predetermined conditions are met, without needing intermediaries.",
    difficulty: "easy",
    concept: "smart contract",
  },
  // Medium Questions
  {
    id: 4,
    question:
      "What is the main difference between Proof of Work (PoW) and Proof of Stake (PoS)?",
    options: [
      "PoW uses computational power, PoS uses token ownership",
      "PoW is faster than PoS",
      "PoS requires more energy than PoW",
      "PoW is only used for Bitcoin, PoS for all others",
    ],
    correctAnswer: 0,
    explanation:
      "PoW requires miners to solve complex mathematical problems using computational power, while PoS selects validators based on their stake (token holdings) in the network. PoS is generally more energy-efficient.",
    difficulty: "medium",
    concept: "consensus mechanism",
  },
  {
    id: 5,
    question: "What are gas fees in Ethereum?",
    options: [
      "Fees paid to store data permanently",
      "Transaction fees paid to validators for processing and validating transactions",
      "Monthly subscription fees for using the network",
      "Penalties for failed transactions",
    ],
    correctAnswer: 1,
    explanation:
      "Gas fees are payments made by users to compensate for the computational energy required to process and validate transactions on the Ethereum blockchain.",
    difficulty: "medium",
    concept: "gas fees",
  },
  {
    id: 6,
    question:
      "What is the purpose of a DAO (Decentralized Autonomous Organization)?",
    options: [
      "To mine cryptocurrencies more efficiently",
      "To provide centralized control over blockchain networks",
      "To enable community governance through token-based voting",
      "To store private keys securely",
    ],
    correctAnswer: 2,
    explanation:
      "DAOs enable decentralized governance where token holders can vote on proposals and decisions, removing the need for traditional hierarchical management structures.",
    difficulty: "medium",
    concept: "dao",
  },
  // Hard Questions
  {
    id: 7,
    question: "What is the primary benefit of using Layer 2 solutions?",
    options: [
      "They replace the need for Layer 1 blockchains entirely",
      "They provide scalability while inheriting security from Layer 1",
      "They make transactions completely free",
      "They eliminate the need for consensus mechanisms",
    ],
    correctAnswer: 1,
    explanation:
      "Layer 2 solutions process transactions off the main chain (Layer 1) to increase throughput and reduce costs, while still benefiting from the security guarantees of the underlying blockchain.",
    difficulty: "hard",
    concept: "layer 2",
  },
  {
    id: 8,
    question: "In DeFi, what is 'impermanent loss'?",
    options: [
      "Loss from a hack or exploit",
      "Loss from high gas fees",
      "Temporary loss from providing liquidity due to price divergence",
      "Permanent loss of private keys",
    ],
    correctAnswer: 2,
    explanation:
      "Impermanent loss occurs when providing liquidity to AMMs. If the price ratio of pooled assets changes, LPs may have less value than if they had simply held the assets.",
    difficulty: "hard",
    concept: "defi",
  },
];

const aiAgentQuestions: QuizQuestion[] = [
  // Easy Questions
  {
    id: 1,
    question: "What is an AI agent?",
    options: [
      "A simple chatbot that responds to keywords",
      "An autonomous system that perceives, decides, and acts to achieve goals",
      "A database of pre-written responses",
      "A human customer service representative",
    ],
    correctAnswer: 1,
    explanation:
      "AI agents are autonomous systems that can perceive their environment, make decisions based on their goals, and take actions. They go beyond simple chatbots by incorporating reasoning, tool use, and goal-oriented behavior.",
    difficulty: "easy",
    concept: "ai agent",
  },
  {
    id: 2,
    question: "What does the 'ReAct' pattern stand for in AI agents?",
    options: [
      "Response and Action",
      "Reasoning and Acting",
      "React JavaScript framework",
      "Reactive Programming",
    ],
    correctAnswer: 1,
    explanation:
      "ReAct stands for Reasoning and Acting. It's a pattern where agents alternate between thinking about what to do (reasoning) and taking actions, then observing results.",
    difficulty: "easy",
    concept: "react pattern",
  },
  {
    id: 3,
    question: "What is 'tool calling' in the context of AI agents?",
    options: [
      "Agents making phone calls",
      "Using development tools to build agents",
      "Agents invoking external functions or APIs to extend capabilities",
      "Debugging agent code",
    ],
    correctAnswer: 2,
    explanation:
      "Tool calling allows AI agents to invoke external functions, APIs, or services to perform tasks beyond text generation, like searching the web, running calculations, or accessing databases.",
    difficulty: "easy",
    concept: "tool calling",
  },
  // Medium Questions
  {
    id: 4,
    question:
      "What is the main advantage of using RAG (Retrieval Augmented Generation) in AI agents?",
    options: [
      "It makes agents run faster",
      "It reduces the cost of API calls",
      "It grounds responses in factual data and reduces hallucinations",
      "It eliminates the need for prompts",
    ],
    correctAnswer: 2,
    explanation:
      "RAG enhances AI agents by retrieving relevant information from knowledge bases before generating responses, which helps ensure accuracy and reduces the likelihood of hallucinated information.",
    difficulty: "medium",
    concept: "retrieval augmented generation",
  },
  {
    id: 5,
    question: "In multi-agent systems, what is a key challenge?",
    options: [
      "Agents cannot communicate with each other",
      "Coordination and avoiding conflicts between agents",
      "Agents always agree on everything",
      "Only one agent can be active at a time",
    ],
    correctAnswer: 1,
    explanation:
      "Multi-agent systems face challenges in coordination, communication efficiency, and conflict resolution when multiple agents work together on complex tasks.",
    difficulty: "medium",
    concept: "multi-agent systems",
  },
  {
    id: 6,
    question:
      "What type of memory allows an agent to maintain context across multiple conversations?",
    options: [
      "RAM memory",
      "Working memory only",
      "Long-term persistent memory",
      "Cache memory",
    ],
    correctAnswer: 2,
    explanation:
      "Long-term persistent memory, often implemented using databases or vector stores, allows agents to retain information across sessions and conversations, enabling personalization and learning.",
    difficulty: "medium",
    concept: "agent memory",
  },
  // Hard Questions
  {
    id: 7,
    question:
      "What is the purpose of 'semantic memory' in advanced agent architectures?",
    options: [
      "To store the agent's source code",
      "To remember the exact text of conversations",
      "To store learned facts and knowledge in vector representations",
      "To track API usage limits",
    ],
    correctAnswer: 2,
    explanation:
      "Semantic memory stores learned facts and knowledge as vector embeddings, allowing agents to retrieve relevant information based on meaning rather than exact matches.",
    difficulty: "hard",
    concept: "agent memory",
  },
  {
    id: 8,
    question:
      "In agent frameworks, what is the main trade-off when choosing between different architectures?",
    options: [
      "Cost vs performance only",
      "Flexibility vs ease of use and standardization",
      "Programming language choice",
      "Cloud vs local deployment",
    ],
    correctAnswer: 1,
    explanation:
      "Agent frameworks involve trade-offs between flexibility (custom implementations) and standardization (using established patterns). More flexible frameworks require more expertise but offer greater customization.",
    difficulty: "hard",
    concept: "agent frameworks",
  },
];

export const quizGeneratorTool = createTool({
  id: "generate-quiz",
  description:
    "Generates interactive quizzes to test knowledge on blockchain or AI agent concepts. Can create custom quizzes based on specific topics and difficulty levels.",
  inputSchema: z.object({
    topic: z
      .enum(["blockchain", "ai-agents", "mixed"])
      .describe("The topic for the quiz"),
    difficulty: z
      .enum(["easy", "medium", "hard", "mixed"])
      .describe("Difficulty level of questions"),
    numberOfQuestions: z
      .number()
      .min(3)
      .max(20)
      .default(5)
      .describe("Number of questions in the quiz"),
    specificConcepts: z
      .array(z.string())
      .optional()
      .describe("Specific concepts to focus on"),
    includeExplanations: z
      .boolean()
      .default(true)
      .describe("Include explanations with answers"),
  }),
  outputSchema: z.object({
    quiz: z.object({
      title: z.string(),
      topic: z.string(),
      difficulty: z.string(),
      questions: z.array(
        z.object({
          id: z.number(),
          question: z.string(),
          options: z.array(z.string()),
          correctAnswer: z.number(),
          explanation: z.string().optional(),
          difficulty: z.enum(["easy", "medium", "hard"]),
          concept: z.string(),
        })
      ),
      passingScore: z.number(),
      estimatedTime: z.string(),
    }),
    studyTips: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const {
      topic,
      difficulty,
      numberOfQuestions,
      specificConcepts,
      includeExplanations = true,
    } = context;

    let availableQuestions: QuizQuestion[] = [];

    // Select question pool based on topic
    if (topic === "blockchain") {
      availableQuestions = [...blockchainQuestions];
    } else if (topic === "ai-agents") {
      availableQuestions = [...aiAgentQuestions];
    } else {
      availableQuestions = [...blockchainQuestions, ...aiAgentQuestions];
    }

    // Filter by difficulty if not mixed
    if (difficulty !== "mixed") {
      availableQuestions = availableQuestions.filter(
        (q) => q.difficulty === difficulty
      );
    }

    // Filter by specific concepts if provided
    if (specificConcepts && specificConcepts.length > 0) {
      availableQuestions = availableQuestions.filter((q) =>
        specificConcepts.some((concept) =>
          q.concept.toLowerCase().includes(concept.toLowerCase())
        )
      );
    }

    // Shuffle and select questions
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(
      0,
      Math.min(numberOfQuestions, availableQuestions.length)
    );

    // Re-number questions
    const numberedQuestions = selectedQuestions.map((q, index) => ({
      ...q,
      id: index + 1,
      explanation: includeExplanations ? q.explanation : undefined,
    }));

    // Generate quiz metadata
    const quizTitle =
      topic === "mixed"
        ? "Blockchain & AI Agents Knowledge Quiz"
        : topic === "blockchain"
          ? "Blockchain Technology Quiz"
          : "AI Agents Concepts Quiz";

    const estimatedTimePerQuestion =
      difficulty === "hard" ? 2 : difficulty === "medium" ? 1.5 : 1;
    const estimatedTime = `${Math.ceil(numberedQuestions.length * estimatedTimePerQuestion)} minutes`;

    const passingScore =
      difficulty === "hard" ? 70 : difficulty === "medium" ? 75 : 80;

    // Generate study tips based on quiz content
    const studyTips: string[] = [];

    if (difficulty === "easy" || difficulty === "mixed") {
      studyTips.push(
        "Review basic concepts before attempting harder questions"
      );
      studyTips.push("Start with fundamentals and build up your knowledge");
    }

    if (difficulty === "hard" || difficulty === "mixed") {
      studyTips.push("Practice with real-world examples and implementations");
      studyTips.push("Deep dive into technical documentation");
    }

    if (topic === "blockchain" || topic === "mixed") {
      studyTips.push("Explore blockchain explorers to see concepts in action");
      studyTips.push("Try interacting with testnet applications");
    }

    if (topic === "ai-agents" || topic === "mixed") {
      studyTips.push("Build simple agents to understand concepts practically");
      studyTips.push("Experiment with different agent frameworks");
    }

    // Add tips for missed concepts
    const uniqueConcepts = [
      ...new Set(numberedQuestions.map((q) => q.concept)),
    ];
    if (uniqueConcepts.length > 0) {
      studyTips.push(
        `Focus on these key concepts: ${uniqueConcepts.join(", ")}`
      );
    }

    return {
      quiz: {
        title: quizTitle,
        topic: topic,
        difficulty: difficulty,
        questions: numberedQuestions,
        passingScore,
        estimatedTime,
      },
      studyTips: studyTips.length > 0 ? studyTips : undefined,
    };
  },
});

