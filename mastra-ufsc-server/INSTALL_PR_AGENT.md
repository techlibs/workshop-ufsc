# 📦 Instalação - PR Reviewer Agent

## 1. Instalar Dependências Necessárias

```bash
# Na pasta mastra-ufsc-server
pnpm add @octokit/rest twilio dotenv

# Ou usando npm
npm install @octokit/rest twilio dotenv
```

## 2. Configurar Variáveis de Ambiente

### 2.1 Copiar arquivo de exemplo
```bash
# O arquivo env.example já foi atualizado com as variáveis necessárias
cp env.example .env
```

### 2.2 Preencher credenciais no .env

Edite `.env` e adicione:

```env
# GitHub
GITHUB_TOKEN=ghp_seu_token_aqui
GITHUB_OWNER=seu-usuario-github
GITHUB_REPO=seu-repositorio

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=seu_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+5511999999999
```

## 3. Obter Credenciais

### GitHub Token

1. Acesse: https://github.com/settings/tokens
2. Clique "Generate new token" → "Generate new token (classic)"
3. Dê um nome: "PR Reviewer Agent"
4. Selecione scope: **`repo`** (Full control of private repositories)
5. Gere e copie o token (começa com `ghp_`)

### Twilio WhatsApp

1. Crie conta em: https://www.twilio.com/try-twilio
2. No console, vá em: **Messaging → Try it out → Send a WhatsApp message**
3. Siga instruções para conectar seu número WhatsApp ao sandbox
4. Copie:
   - **Account SID** (começa com `AC`)
   - **Auth Token**
   - **From number** (formato: `whatsapp:+14155238886`)

## 4. Registrar Agent no Mastra

Edite `src/mastra/index.ts` e adicione:

```typescript
import { prReviewerAgent, prNotificationWorkflow } from "./domains/pr-reviewer";

export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    prNotificationWorkflow, // 🆕 Adicionar
  },
  agents: {
    weatherAgent,
    inventoryAgent,
    defiAgent,
    movieAgent,
    beachAgent,
    studyAgent,
    prReviewerAgent, // 🆕 Adicionar
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
```

## 5. Testar

```bash
# Rodar servidor de desenvolvimento
pnpm run dev

# Abrir playground em: http://localhost:4111
# Selecionar: "PR Reviewer Agent"
```

## 6. Testar via E2E

```bash
pnpm tsx tests/e2e/pr-reviewer-agent.e2e.ts
```

## 7. Validar Instalação

Execute no playground ou via código:

```typescript
import { mastra } from "./src/mastra";

const agent = mastra.getAgent("prReviewerAgent");
const response = await agent.generate("Quais PRs estão abertos?");
console.log(response.text);
```

**Resultado esperado:**
- Lista de PRs do seu repositório
- Ou mensagem informando que não há PRs abertos

## 📝 Troubleshooting

### Erro: "Module not found: @octokit/rest"
```bash
pnpm install @octokit/rest
```

### Erro: "Module not found: twilio"
```bash
pnpm install twilio
```

### Erro: "GitHub authentication failed"
- Verifique se GITHUB_TOKEN está correto no .env
- Token precisa ter scope `repo`
- Token pode ter expirado (gere novo)

### Erro: "WhatsApp service not configured"
- Confirme todas variáveis TWILIO_* no .env
- Verifique se WhatsApp está conectado no Twilio Sandbox
- Teste enviar mensagem manual pelo console Twilio

### Erro: "Agent not found"
- Confirme que adicionou em src/mastra/index.ts
- Reinicie o servidor (`pnpm run dev`)

## ✅ Checklist de Instalação

- [ ] Dependências instaladas (`@octokit/rest`, `twilio`)
- [ ] Arquivo `.env` configurado
- [ ] GitHub Token gerado e adicionado
- [ ] Twilio configurado (opcional para testes)
- [ ] Agent registrado em `src/mastra/index.ts`
- [ ] Servidor rodando (`pnpm run dev`)
- [ ] Agent testado no playground

## 🎉 Pronto!

Agent instalado com sucesso! Veja a documentação completa em:
`docs/agents/pr-reviewer-agent.md`
