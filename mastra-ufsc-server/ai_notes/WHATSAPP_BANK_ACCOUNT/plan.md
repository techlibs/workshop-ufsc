# WhatsApp Bank Chatbot Implementation Plan

## 🎯 Goal
Create a comprehensive banking chatbot that simulates a full-featured bank account system with multiple services (PIX, invoices, investments, stock market) accessible via WhatsApp messaging interface.

## 📋 Overview

This implementation creates a conversational banking assistant that:
1. **Understands user intent** through natural language
2. **Routes requests** to appropriate tools/workflows
3. **Performs banking operations** via specialized tools
4. **Provides interactive feedback** with options when needed

## 🏗️ Architecture

```
WhatsApp Message → Banking Agent → Workflow/Tools → Response

┌─────────────────────────────────────────────────────────┐
│                    User Message                         │
│              "Quero pagar minha fatura"                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Banking Agent (Main Router)                │
│  • Understands intent (payment, transfer, investment)   │
│  • Determines if clarification needed                   │
│  • Routes to appropriate tool/workflow                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│   Tools      │         │  Workflows   │
│  (Direct)    │         │  (Complex)   │
├──────────────┤         ├──────────────┤
│ • PIX        │         │ • Invoice    │
│ • Balance    │         │   Payment    │
│ • Statement  │         │ • Investment │
│ • Card Info  │         │   Flow       │
└──────────────┘         └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Response to User                       │
│  • Formatted message (with emojis)                     │
│  • Options menu (when clarification needed)            │
│  • Transaction confirmation                            │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
mastra-ufsc-server/
└── src/mastra/domains/
    └── bank-whatsapp/
        ├── agent.ts                    # Main banking agent
        ├── index.ts                    # Barrel exports
        │
        ├── data/
        │   ├── account-data.ts        # Mock account data
        │   ├── cards-data.ts          # Mock card data
        │   └── investment-data.ts     # Mock investment options
        │
        ├── services/
        │   ├── pix-service.ts         # PIX transaction logic
        │   ├── invoice-service.ts     # Invoice handling
        │   └── investment-service.ts  # Investment operations
        │
        ├── tools/
        │   ├── pix-tool.ts            # PIX transfers
        │   ├── balance-tool.ts        # Check balance
        │   ├── statement-tool.ts      # Account statement
        │   ├── card-info-tool.ts      # Card management
        │   ├── limits-tool.ts         # Check/adjust limits
        │   └── options-menu-tool.ts   # Display available options
        │
        ├── workflows/
        │   ├── invoice-payment.ts     # Invoice payment flow
        │   ├── investment-flow.ts     # Investment workflow
        │   └── transfer-flow.ts       # Complex transfers
        │
        └── utils/
            ├── account-manager.ts     # Account operations
            ├── validators.ts          # Input validation
            └── formatters.ts          # Response formatting
```

## 🔧 Implementation Steps

### Phase 1: Data Layer Setup

#### 1.1 Create Mock Account Data (`data/account-data.ts`)

```typescript
// Mock user account structure
export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  agency: string;
  balance: number;
  accountType: 'checking' | 'savings';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: Date;
  category: string;
  balance: number; // Balance after transaction
}

export interface Invoice {
  id: string;
  accountId: string;
  dueDate: Date;
  amount: number;
  minimumPayment: number;
  status: 'open' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

// Mock data - simulates database
export const mockAccounts: Map<string, BankAccount> = new Map([
  ['user-123', {
    id: 'acc-1',
    userId: 'user-123',
    accountNumber: '12345-6',
    agency: '0001',
    balance: 5420.50,
    accountType: 'checking',
    createdAt: new Date('2023-01-15')
  }]
]);

export const mockTransactions: Map<string, Transaction[]> = new Map([
  ['acc-1', [
    {
      id: 'tx-1',
      accountId: 'acc-1',
      type: 'credit',
      amount: 3500.00,
      description: 'Salário Empresa XYZ',
      date: new Date('2025-01-01'),
      category: 'salary',
      balance: 5420.50
    },
    {
      id: 'tx-2',
      accountId: 'acc-1',
      type: 'debit',
      amount: 150.00,
      description: 'Supermercado ABC',
      date: new Date('2025-01-05'),
      category: 'groceries',
      balance: 5270.50
    }
  ]]
]);
```

#### 1.2 Create Investment Data (`data/investment-data.ts`)

```typescript
export interface InvestmentProduct {
  id: string;
  name: string;
  type: 'CDB' | 'LCI' | 'LCA' | 'FII' | 'Stock';
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  expectedReturn: string;
  liquidity: string;
  description: string;
}

export const investmentProducts: InvestmentProduct[] = [
  {
    id: 'inv-1',
    name: 'CDB Liquidez Diária',
    type: 'CDB',
    riskLevel: 'low',
    minInvestment: 100,
    expectedReturn: '100% do CDI',
    liquidity: 'Diária',
    description: 'Investimento de baixo risco com liquidez imediata'
  },
  {
    id: 'inv-2',
    name: 'FII Shopping Centers',
    type: 'FII',
    riskLevel: 'medium',
    minInvestment: 500,
    expectedReturn: '8-12% ao ano',
    liquidity: 'D+0',
    description: 'Fundo imobiliário focado em shopping centers'
  }
  // ... more products
];
```

### Phase 2: Service Layer

#### 2.1 PIX Service (`services/pix-service.ts`)

```typescript
export interface PixTransferRequest {
  accountId: string;
  pixKey: string;
  pixKeyType: 'cpf' | 'email' | 'phone' | 'random';
  amount: number;
  description?: string;
}

export interface PixTransferResult {
  success: boolean;
  transactionId: string;
  message: string;
  newBalance: number;
}

export class PixService {
  async transfer(request: PixTransferRequest): Promise<PixTransferResult> {
    // Validate account
    const account = mockAccounts.get(request.accountId);
    if (!account) {
      return {
        success: false,
        transactionId: '',
        message: '❌ Conta não encontrada',
        newBalance: 0
      };
    }

    // Check balance
    if (account.balance < request.amount) {
      return {
        success: false,
        transactionId: '',
        message: `❌ Saldo insuficiente. Saldo atual: R$ ${account.balance.toFixed(2)}`,
        newBalance: account.balance
      };
    }

    // Process transfer
    const transactionId = `pix-${Date.now()}`;
    account.balance -= request.amount;

    // Create transaction record
    const transaction: Transaction = {
      id: transactionId,
      accountId: request.accountId,
      type: 'debit',
      amount: request.amount,
      description: `PIX para ${request.pixKey}`,
      date: new Date(),
      category: 'transfer',
      balance: account.balance
    };

    // Add to transaction history
    const transactions = mockTransactions.get(account.id) || [];
    transactions.unshift(transaction);
    mockTransactions.set(account.id, transactions);

    return {
      success: true,
      transactionId,
      message: `✅ Transferência realizada com sucesso!\n\n💰 Valor: R$ ${request.amount.toFixed(2)}\n👤 Destino: ${request.pixKey}\n🆔 ID: ${transactionId}\n💵 Novo saldo: R$ ${account.balance.toFixed(2)}`,
      newBalance: account.balance
    };
  }

  async validatePixKey(key: string, type: string): Promise<boolean> {
    // Simple validation logic
    switch (type) {
      case 'cpf':
        return /^\d{11}$/.test(key.replace(/\D/g, ''));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
      case 'phone':
        return /^\d{10,11}$/.test(key.replace(/\D/g, ''));
      default:
        return true; // Random keys are always valid format
    }
  }
}
```

### Phase 3: Tools Implementation

#### 3.1 Balance Tool (`tools/balance-tool.ts`)

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mockAccounts } from "../data/account-data";

export const balanceTool = createTool({
  id: "check-balance",
  description: "Check the current account balance and provides account information",
  inputSchema: z.object({
    userId: z.string().describe("User ID to check balance for")
  }),
  outputSchema: z.object({
    balance: z.number(),
    accountInfo: z.string(),
    formattedMessage: z.string()
  }),
  execute: async ({ context }) => {
    const { userId } = context;
    const account = mockAccounts.get(userId);

    if (!account) {
      return {
        balance: 0,
        accountInfo: '',
        formattedMessage: '❌ Conta não encontrada'
      };
    }

    const formattedMessage = `
💰 **Saldo da Conta**
━━━━━━━━━━━━━━━━━━━━━

💵 Saldo disponível: R$ ${account.balance.toFixed(2)}
🏦 Agência: ${account.agency}
📋 Conta: ${account.accountNumber}
📊 Tipo: ${account.accountType === 'checking' ? 'Conta Corrente' : 'Conta Poupança'}
    `.trim();

    return {
      balance: account.balance,
      accountInfo: `${account.agency} / ${account.accountNumber}`,
      formattedMessage
    };
  }
});
```

#### 3.2 PIX Tool (`tools/pix-tool.ts`)

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { PixService } from "../services/pix-service";

const pixService = new PixService();

export const pixTool = createTool({
  id: "pix-transfer",
  description: "Make a PIX transfer to another account using PIX key (CPF, email, phone, or random key)",
  inputSchema: z.object({
    userId: z.string().describe("User ID making the transfer"),
    pixKey: z.string().describe("PIX key (CPF, email, phone, or random key)"),
    pixKeyType: z.enum(['cpf', 'email', 'phone', 'random']).describe("Type of PIX key"),
    amount: z.number().positive().describe("Amount to transfer"),
    description: z.string().optional().describe("Optional transfer description")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    transactionId: z.string().optional(),
    newBalance: z.number().optional()
  }),
  execute: async ({ context }) => {
    const { userId, pixKey, pixKeyType, amount, description } = context;

    // Validate PIX key format
    const isValidKey = await pixService.validatePixKey(pixKey, pixKeyType);
    if (!isValidKey) {
      return {
        success: false,
        message: `❌ Chave PIX inválida. Verifique o formato da chave ${pixKeyType}.`
      };
    }

    // Get account ID from user ID
    const account = mockAccounts.get(userId);
    if (!account) {
      return {
        success: false,
        message: '❌ Conta não encontrada'
      };
    }

    // Execute transfer
    const result = await pixService.transfer({
      accountId: account.id,
      pixKey,
      pixKeyType,
      amount,
      description
    });

    return {
      success: result.success,
      message: result.message,
      transactionId: result.transactionId,
      newBalance: result.newBalance
    };
  }
});
```

#### 3.3 Options Menu Tool (`tools/options-menu-tool.ts`)

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const optionsMenuTool = createTool({
  id: "show-options-menu",
  description: "Display available banking options when user request is unclear or when showing main menu",
  inputSchema: z.object({
    context: z.enum(['main', 'payments', 'investments', 'transfers']).optional().describe("Context for showing specific menu")
  }),
  outputSchema: z.object({
    message: z.string(),
    options: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const menuContext = context.context || 'main';

    const menus = {
      main: {
        message: `
🏦 **Bem-vindo ao Sicredi Digital**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Como posso ajudar você hoje?

1️⃣ 💰 **Saldo e Extrato**
   • Ver saldo
   • Extrato detalhado
   • Limites disponíveis

2️⃣ 💸 **Transferências**
   • PIX
   • TED/DOC
   • Entre contas

3️⃣ 📄 **Pagamentos**
   • Pagar fatura do cartão
   • Boletos
   • Contas (água, luz, etc)

4️⃣ 📈 **Investimentos**
   • Ver investimentos atuais
   • Novos investimentos
   • Comprar ações
   • Fundos imobiliários

5️⃣ 💳 **Cartões**
   • Informações do cartão
   • Fatura detalhada
   • Limites

Digite o número ou descreva o que precisa! 😊
        `.trim(),
        options: ['saldo', 'pix', 'pagamentos', 'investimentos', 'cartões']
      },
      payments: {
        message: `
📄 **Opções de Pagamento**
━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Fatura do cartão de crédito
2️⃣ Boletos bancários
3️⃣ Contas (água, luz, gás, etc)
4️⃣ Tributos e impostos

O que você gostaria de pagar?
        `.trim(),
        options: ['fatura', 'boleto', 'contas', 'impostos']
      },
      investments: {
        message: `
📈 **Opções de Investimento**
━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **Renda Fixa**
   • CDB
   • LCI/LCA
   • Tesouro Direto

2️⃣ **Renda Variável**
   • Ações
   • Fundos Imobiliários (FII)
   • ETFs

3️⃣ **Ver meus investimentos**

Qual opção te interessa?
        `.trim(),
        options: ['renda-fixa', 'ações', 'FII', 'ver-investimentos']
      },
      transfers: {
        message: `
💸 **Transferências**
━━━━━━━━━━━━━━━━━

1️⃣ PIX (instantâneo)
2️⃣ TED (mesmo dia)
3️⃣ DOC (próximo dia útil)
4️⃣ Transferência entre suas contas

Qual tipo de transferência?
        `.trim(),
        options: ['pix', 'ted', 'doc', 'entre-contas']
      }
    };

    const menu = menus[menuContext];
    return {
      message: menu.message,
      options: menu.options
    };
  }
});
```

### Phase 4: Workflow Implementation

#### 4.1 Invoice Payment Workflow (`workflows/invoice-payment.ts`)

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { mockAccounts, mockInvoices } from "../data/account-data";

// Step 1: Get invoice details
const getInvoiceStep = createStep({
  id: "get-invoice",
  description: "Retrieve invoice information for the user",
  inputSchema: z.object({
    userId: z.string()
  }),
  outputSchema: z.object({
    invoiceId: z.string(),
    dueDate: z.string(),
    amount: z.number(),
    minimumPayment: z.number(),
    status: z.string(),
    hasInvoice: z.boolean()
  }),
  execute: async ({ inputData }) => {
    const account = mockAccounts.get(inputData.userId);
    
    if (!account) {
      return {
        invoiceId: '',
        dueDate: '',
        amount: 0,
        minimumPayment: 0,
        status: 'not-found',
        hasInvoice: false
      };
    }

    // Get open invoice
    const invoices = mockInvoices.get(account.id) || [];
    const openInvoice = invoices.find(inv => inv.status === 'open');

    if (!openInvoice) {
      return {
        invoiceId: '',
        dueDate: '',
        amount: 0,
        minimumPayment: 0,
        status: 'no-open-invoice',
        hasInvoice: false
      };
    }

    return {
      invoiceId: openInvoice.id,
      dueDate: openInvoice.dueDate.toLocaleDateString('pt-BR'),
      amount: openInvoice.amount,
      minimumPayment: openInvoice.minimumPayment,
      status: openInvoice.status,
      hasInvoice: true
    };
  }
});

// Step 2: Present payment options
const presentPaymentOptionsStep = createStep({
  id: "present-payment-options",
  description: "Show payment options to user",
  inputSchema: z.object({
    invoiceId: z.string(),
    dueDate: z.string(),
    amount: z.number(),
    minimumPayment: z.number(),
    hasInvoice: z.boolean()
  }),
  outputSchema: z.object({
    message: z.string(),
    canProceed: z.boolean()
  }),
  resumeSchema: z.object({
    paymentType: z.enum(['total', 'minimum', 'custom']),
    customAmount: z.number().optional()
  }),
  suspendSchema: z.object({
    reason: z.string()
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!inputData.hasInvoice) {
      return {
        message: '✅ Você não tem faturas em aberto no momento!',
        canProceed: false
      };
    }

    // If no resume data, ask user for payment type
    if (!resumeData) {
      const message = `
📄 **Fatura do Cartão de Crédito**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Valor total: R$ ${inputData.amount.toFixed(2)}
💳 Pagamento mínimo: R$ ${inputData.minimumPayment.toFixed(2)}
📅 Vencimento: ${inputData.dueDate}

**Opções de pagamento:**
1️⃣ Pagar valor total (R$ ${inputData.amount.toFixed(2)})
2️⃣ Pagar mínimo (R$ ${inputData.minimumPayment.toFixed(2)})
3️⃣ Valor personalizado

Como deseja pagar?
      `.trim();

      return await suspend({
        reason: message
      });
    }

    // Process payment based on user choice
    const { paymentType, customAmount } = resumeData;
    let paymentAmount = 0;

    switch (paymentType) {
      case 'total':
        paymentAmount = inputData.amount;
        break;
      case 'minimum':
        paymentAmount = inputData.minimumPayment;
        break;
      case 'custom':
        if (!customAmount || customAmount < inputData.minimumPayment) {
          return {
            message: `❌ Valor inválido. O pagamento mínimo é R$ ${inputData.minimumPayment.toFixed(2)}`,
            canProceed: false
          };
        }
        paymentAmount = customAmount;
        break;
    }

    return {
      message: `Processando pagamento de R$ ${paymentAmount.toFixed(2)}...`,
      canProceed: true
    };
  }
});

// Step 3: Process payment
const processPaymentStep = createStep({
  id: "process-payment",
  description: "Execute the invoice payment",
  inputSchema: z.object({
    message: z.string(),
    canProceed: z.boolean()
  }),
  outputSchema: z.object({
    result: z.string()
  }),
  execute: async ({ inputData }) => {
    if (!inputData.canProceed) {
      return {
        result: inputData.message
      };
    }

    // Simulate payment processing
    const transactionId = `pay-${Date.now()}`;
    
    const result = `
✅ **Pagamento Realizado com Sucesso!**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Comprovante: ${transactionId}
📅 Data: ${new Date().toLocaleDateString('pt-BR')}
💰 ${inputData.message}

O valor será debitado da sua conta em alguns instantes.
    `.trim();

    return { result };
  }
});

// Create workflow
export const invoicePaymentWorkflow = createWorkflow({
  id: "invoice-payment-workflow",
  description: "Complete flow for paying credit card invoice",
  inputSchema: z.object({
    userId: z.string()
  }),
  outputSchema: z.object({
    result: z.string()
  })
})
  .then(getInvoiceStep)
  .then(presentPaymentOptionsStep)
  .then(processPaymentStep)
  .commit();
```

### Phase 5: Main Agent

#### 5.1 Banking Agent (`agent.ts`)

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

// Import tools
import { balanceTool } from "./tools/balance-tool";
import { pixTool } from "./tools/pix-tool";
import { statementTool } from "./tools/statement-tool";
import { cardInfoTool } from "./tools/card-info-tool";
import { optionsMenuTool } from "./tools/options-menu-tool";

// Import workflows
import { invoicePaymentWorkflow } from "./workflows/invoice-payment";
import { investmentWorkflow } from "./workflows/investment-flow";

export const bankWhatsappAgent = new Agent({
  name: "Sicredi Banking Assistant",
  description: "A comprehensive banking assistant that handles account operations, payments, transfers, and investments",
  instructions: `
You are a helpful and professional banking assistant for Sicredi Bank, interacting via WhatsApp. Your goal is to help users manage their bank accounts, make payments, transfers, and investments efficiently.

**Core Responsibilities:**

1. **Intent Understanding**
   - Understand user requests in Portuguese (primary), English, and Spanish
   - Identify if the user wants to:
     • Check balance or statement
     • Make transfers (PIX, TED, DOC)
     • Pay invoices or bills
     • Manage investments
     • Get card information
   - When intent is unclear, use optionsMenuTool to present options

2. **Workflow vs Tools Decision**
   
   **Use WORKFLOWS for:**
   - Invoice payments (requires user confirmation and options)
   - Investment operations (needs recommendation and confirmation)
   - Complex transfers with multiple steps
   
   **Use TOOLS for:**
   - Quick balance checks (balanceTool)
   - PIX transfers (pixTool)
   - Statement retrieval (statementTool)
   - Card information (cardInfoTool)
   - Display menus (optionsMenuTool)

3. **User Experience**
   - Always be polite, professional, and clear
   - Use emojis to make messages more engaging (but not excessive)
   - Confirm important transactions before executing
   - Provide clear error messages when something goes wrong
   - Format monetary values properly: R$ X.XXX,XX

4. **Security**
   - Never ask for passwords or sensitive data
   - Always confirm transaction details before execution
   - Use user ID from runtime context (never ask for it)

**Response Guidelines:**

✅ DO:
- Greet users warmly
- Confirm transaction details before execution
- Provide clear next steps
- Use structured formatting for readability
- Offer help if user seems stuck

❌ DON'T:
- Execute transactions without confirmation
- Share account details publicly
- Make assumptions about user intent
- Use technical jargon

**Example Interactions:**

User: "qual meu saldo?"
→ Use balanceTool to get balance, respond with formatted message

User: "quero pagar minha fatura"
→ Use invoicePaymentWorkflow to guide through payment process

User: "fazer um pix"
→ Ask for PIX key, amount, then use pixTool

User: "preciso de ajuda"
→ Use optionsMenuTool to show main menu

**Language Support:**
- Portuguese (preferred): Use "você", "seu/sua"
- English: Professional but friendly tone
- Spanish: Formal "usted" form

Remember: You're helping people manage their money. Be accurate, clear, and trustworthy!
  `,
  model: openai("gpt-4o"),
  
  tools: {
    balanceTool,
    pixTool,
    statementTool,
    cardInfoTool,
    optionsMenuTool
  },
  
  workflows: {
    invoicePaymentWorkflow,
    investmentWorkflow
  },
  
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./bank-memory.db"
    }),
    options: {
      semanticRecall: { topK: 5, messageRange: 3 },
      workingMemory: { enabled: true }
    }
  })
});
```

### Phase 6: Integration & Testing

#### 6.1 Register in Mastra (`src/mastra/index.ts`)

```typescript
import { bankWhatsappAgent } from "./domains/bank-whatsapp";
import { 
  invoicePaymentWorkflow, 
  investmentWorkflow 
} from "./domains/bank-whatsapp/workflows";

export const mastra = new Mastra({
  workflows: { 
    // ... existing workflows
    invoicePaymentWorkflow,
    investmentWorkflow
  },
  agents: {
    // ... existing agents
    bankWhatsappAgent
  },
  // ... rest of config
});
```

#### 6.2 Test Script (`tests/e2e/bank-whatsapp.e2e.ts`)

```typescript
import { mastra } from "../../src/mastra";
import { RuntimeContext } from "@mastra/core/runtime-context";

async function testBankAgent() {
  const agent = mastra.getAgent("bankWhatsappAgent");
  const runtimeContext = new RuntimeContext();
  
  // Set user context
  runtimeContext.set("userId", "user-123");

  console.log("\n=== Test 1: Check Balance ===");
  const balanceResponse = await agent.generate(
    "qual meu saldo?",
    { runtimeContext }
  );
  console.log(balanceResponse.text);

  console.log("\n=== Test 2: Make PIX ===");
  const pixResponse = await agent.generate(
    "quero fazer um pix de R$ 100 para o CPF 12345678900",
    { runtimeContext }
  );
  console.log(pixResponse.text);

  console.log("\n=== Test 3: Request Help ===");
  const helpResponse = await agent.generate(
    "não sei o que fazer",
    { runtimeContext }
  );
  console.log(helpResponse.text);

  console.log("\n=== Test 4: Invoice Payment (Workflow) ===");
  const invoiceResponse = await agent.generate(
    "quero pagar minha fatura do cartão",
    { runtimeContext }
  );
  console.log(invoiceResponse.text);
}

testBankAgent().catch(console.error);
```

## 📊 Mock Data Scenarios

Include diverse scenarios in mock data:

1. **Account Types**: Checking, Savings
2. **Transaction Types**: Salary, Shopping, Transfers, Investments
3. **Invoice States**: Open, Paid, Overdue
4. **Investment Products**: Low/Medium/High risk options
5. **Card Info**: Credit cards with different limits
6. **Edge Cases**: 
   - Insufficient balance
   - Invalid PIX keys
   - No open invoices
   - Investment minimum not met

## 🎯 Key Implementation Patterns

### Pattern 1: Intent Classification
```typescript
// Agent decides based on keywords and context
if (message.includes('saldo')) → balanceTool
if (message.includes('pix')) → pixTool
if (message.includes('fatura')) → invoicePaymentWorkflow
if (unclear) → optionsMenuTool
```

### Pattern 2: Suspend/Resume for User Input
```typescript
// In workflow step
if (!resumeData) {
  return await suspend({
    reason: "What payment option do you want?"
  });
}

// Later, resume with user choice
await run.resume({
  step: 'payment-step',
  resumeData: { paymentType: 'total' }
});
```

### Pattern 3: Runtime Context for User Data
```typescript
// Set in middleware/API
runtimeContext.set("userId", "user-123");

// Access in tools/workflows
const userId = runtimeContext.get("userId");
```

## 🚀 Next Steps

1. **Create base structure**: Follow the folder structure outlined above
2. **Implement mock data**: Start with account and transaction data
3. **Build services**: Implement PIX, invoice, investment services
4. **Create tools**: Implement each tool one by one
5. **Build workflows**: Start with invoice payment workflow
6. **Create agent**: Wire everything together
7. **Test**: Run E2E tests and iterate
8. **Document**: Create user guide and API docs

## 📝 Additional Features to Consider

1. **WhatsApp Integration**: Add actual WhatsApp API integration
2. **Notifications**: Send proactive alerts (invoice due, low balance)
3. **Analytics**: Track most used features
4. **Multi-language**: Full i18n support
5. **Voice**: Support voice messages
6. **Receipts**: Generate PDF receipts
7. **Scheduling**: Schedule transfers/payments
8. **Budgeting**: Personal finance insights

## 🔒 Security Considerations

1. Use environment variables for sensitive data
2. Implement rate limiting
3. Validate all user inputs
4. Log all transactions
5. Implement transaction limits
6. Add multi-factor authentication for large transactions
7. Encrypt sensitive data at rest

---

**Implementation Time Estimate**: 
- Phase 1-2: 2-3 days
- Phase 3-4: 3-4 days  
- Phase 5-6: 2-3 days
- **Total**: ~7-10 days for full implementation

**Priority Order**:
1. Mock data + Balance tool (basic functionality)
2. PIX tool (most used feature)
3. Options menu tool (UX foundation)
4. Invoice payment workflow (complex interaction)
5. Other tools and workflows (iterative)

