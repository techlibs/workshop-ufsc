import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Comprehensive blockchain knowledge base
const blockchainConcepts: Record<
  string,
  {
    definition: string;
    keyFeatures: string[];
    examples: string[];
    relatedConcepts: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
  }
> = {
  blockchain: {
    definition:
      "A blockchain is a distributed, immutable ledger that records transactions across a network of computers. Each block contains a cryptographic hash of the previous block, creating a chain of blocks that cannot be altered retroactively.",
    keyFeatures: [
      "Decentralization: No single point of control",
      "Immutability: Records cannot be changed once written",
      "Transparency: All transactions are visible to network participants",
      "Consensus Mechanisms: Nodes agree on the state of the ledger",
    ],
    examples: [
      "Bitcoin: The first and most well-known blockchain implementation",
      "Ethereum: A programmable blockchain with smart contracts",
      "Hyperledger: Enterprise-focused blockchain frameworks",
    ],
    relatedConcepts: [
      "distributed ledger",
      "consensus",
      "cryptography",
      "decentralization",
    ],
    difficulty: "beginner",
  },
  "smart contract": {
    definition:
      "A smart contract is a self-executing contract with the terms directly written into code. It automatically executes when predetermined conditions are met, without the need for intermediaries.",
    keyFeatures: [
      "Self-executing: Runs automatically when conditions are met",
      "Immutable: Cannot be changed once deployed",
      "Transparent: Code is visible on the blockchain",
      "Trustless: No need for intermediaries",
    ],
    examples: [
      "DeFi protocols: Automated lending and borrowing",
      "NFT marketplaces: Automated royalty payments",
      "Supply chain: Automatic payment upon delivery confirmation",
    ],
    relatedConcepts: ["ethereum", "solidity", "gas fees", "DApps"],
    difficulty: "intermediate",
  },
  "consensus mechanism": {
    definition:
      "A consensus mechanism is a protocol that ensures all nodes in a blockchain network agree on the current state of the ledger. It prevents double-spending and maintains network security.",
    keyFeatures: [
      "Agreement: All nodes reach consensus on valid transactions",
      "Security: Protects against malicious actors",
      "Finality: Determines when transactions are irreversible",
      "Incentives: Rewards honest participants",
    ],
    examples: [
      "Proof of Work (PoW): Bitcoin's energy-intensive mining",
      "Proof of Stake (PoS): Ethereum's energy-efficient validation",
      "Proof of Authority (PoA): Used in private blockchains",
    ],
    relatedConcepts: [
      "mining",
      "staking",
      "validators",
      "Byzantine fault tolerance",
    ],
    difficulty: "intermediate",
  },
  defi: {
    definition:
      "Decentralized Finance (DeFi) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks or brokers.",
    keyFeatures: [
      "Permissionless: Anyone can access DeFi services",
      "Composable: DeFi protocols can be combined like Lego blocks",
      "Transparent: All transactions and code are public",
      "Non-custodial: Users retain control of their assets",
    ],
    examples: [
      "Uniswap: Decentralized exchange for token swapping",
      "Aave: Lending and borrowing platform",
      "MakerDAO: Stablecoin creation system",
    ],
    relatedConcepts: ["liquidity pools", "yield farming", "AMM", "stablecoins"],
    difficulty: "advanced",
  },
  nft: {
    definition:
      "Non-Fungible Tokens (NFTs) are unique digital assets on a blockchain that represent ownership of specific items, whether digital or physical. Unlike cryptocurrencies, each NFT is unique and cannot be exchanged on a one-to-one basis.",
    keyFeatures: [
      "Uniqueness: Each token has distinct properties",
      "Ownership: Blockchain proves ownership",
      "Transferability: Can be bought, sold, or traded",
      "Programmability: Can include smart contract functionality",
    ],
    examples: [
      "Digital Art: Beeple's $69 million artwork",
      "Gaming Assets: In-game items and characters",
      "Domain Names: ENS (Ethereum Name Service)",
    ],
    relatedConcepts: ["ERC-721", "metadata", "IPFS", "digital ownership"],
    difficulty: "beginner",
  },
  dao: {
    definition:
      "A Decentralized Autonomous Organization (DAO) is an organization governed by smart contracts and token holders, without centralized leadership. Decisions are made through community voting.",
    keyFeatures: [
      "Decentralized Governance: Token holders vote on proposals",
      "Transparency: All decisions and funds are on-chain",
      "Autonomous: Operates based on coded rules",
      "Global Participation: Anyone can join by acquiring tokens",
    ],
    examples: [
      "MakerDAO: Governs the DAI stablecoin",
      "Uniswap DAO: Manages the Uniswap protocol",
      "ConstitutionDAO: Attempted to buy the US Constitution",
    ],
    relatedConcepts: [
      "governance tokens",
      "proposals",
      "treasury",
      "voting mechanisms",
    ],
    difficulty: "advanced",
  },
  "gas fees": {
    definition:
      "Gas fees are transaction costs paid to validators/miners for processing and validating transactions on a blockchain. They prevent spam and compensate network participants.",
    keyFeatures: [
      "Variable Pricing: Fees fluctuate based on network demand",
      "Priority System: Higher fees get processed faster",
      "Network Security: Prevents spam attacks",
      "Validator Incentive: Rewards network maintainers",
    ],
    examples: [
      "Ethereum: Gas paid in ETH for smart contract execution",
      "Bitcoin: Transaction fees paid to miners",
      "Layer 2: Reduced fees on Polygon, Optimism",
    ],
    relatedConcepts: ["wei", "gwei", "base fee", "priority fee"],
    difficulty: "intermediate",
  },
  "layer 2": {
    definition:
      "Layer 2 solutions are protocols built on top of existing blockchains (Layer 1) to improve scalability and reduce transaction costs while inheriting the security of the main chain.",
    keyFeatures: [
      "Scalability: Higher transaction throughput",
      "Lower Costs: Reduced gas fees",
      "Inherited Security: Relies on Layer 1 security",
      "Fast Finality: Quicker transaction confirmation",
    ],
    examples: [
      "Polygon: Ethereum sidechain with PoS consensus",
      "Optimism: Optimistic rollup for Ethereum",
      "Lightning Network: Bitcoin payment channels",
    ],
    relatedConcepts: ["rollups", "sidechains", "state channels", "bridges"],
    difficulty: "advanced",
  },
};

export const blockchainConceptsTool = createTool({
  id: "explain-blockchain-concept",
  description:
    "Explains blockchain concepts with definitions, features, examples, and related topics. Use this to learn about blockchain technology, cryptocurrencies, DeFi, NFTs, and more.",
  inputSchema: z.object({
    concept: z
      .string()
      .describe(
        "The blockchain concept to explain (e.g., 'smart contract', 'defi', 'consensus mechanism')"
      ),
    depth: z
      .enum(["basic", "detailed", "comprehensive"])
      .optional()
      .default("detailed")
      .describe("Level of detail for the explanation"),
  }),
  outputSchema: z.object({
    concept: z.string(),
    definition: z.string(),
    keyFeatures: z.array(z.string()).optional(),
    examples: z.array(z.string()).optional(),
    relatedConcepts: z.array(z.string()).optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    additionalResources: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const { concept, depth = "detailed" } = context;
    const searchTerm = concept.toLowerCase();

    // Find exact match or partial match
    let conceptData = blockchainConcepts[searchTerm];

    if (!conceptData) {
      // Try to find partial matches
      const matchingKey = Object.keys(blockchainConcepts).find(
        (key) => key.includes(searchTerm) || searchTerm.includes(key)
      );

      if (matchingKey) {
        conceptData = blockchainConcepts[matchingKey];
      }
    }

    if (!conceptData) {
      // Provide a helpful response for unknown concepts
      return {
        concept: concept,
        definition: `I don't have a specific entry for "${concept}" in my knowledge base. However, I can help you learn about related blockchain concepts like: blockchain, smart contracts, consensus mechanisms, DeFi, NFTs, DAOs, gas fees, and Layer 2 solutions.`,
        relatedConcepts: [
          "blockchain",
          "smart contract",
          "defi",
          "nft",
          "consensus mechanism",
        ],
        additionalResources: [
          "Try searching for one of the related concepts",
          "Ask about specific aspects of blockchain technology",
        ],
      };
    }

    // Build response based on depth
    const response: any = {
      concept: concept,
      definition: conceptData.definition,
      difficulty: conceptData.difficulty,
    };

    if (depth === "detailed" || depth === "comprehensive") {
      response.keyFeatures = conceptData.keyFeatures;
      response.examples = conceptData.examples;
    }

    if (depth === "comprehensive") {
      response.relatedConcepts = conceptData.relatedConcepts;
      response.additionalResources = [
        `Explore related concepts: ${conceptData.relatedConcepts.join(", ")}`,
        "Practice with real blockchain explorers like Etherscan",
        "Join blockchain developer communities",
        "Try building a simple smart contract",
      ];
    }

    return response;
  },
});

