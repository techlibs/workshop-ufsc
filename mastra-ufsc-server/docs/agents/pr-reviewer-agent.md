# PR Reviewer Agent

Agent especializado em gerenciar Pull Requests do GitHub e enviar notificações via WhatsApp para revisão.

## 🎯 Propósito

O PR Reviewer Agent automatiza o processo de notificação de PRs, permitindo que equipes de desenvolvimento sejam alertadas sobre novos PRs e solicitações de revisão diretamente no WhatsApp.

## 🚀 Funcionalidades

### Core Features

1. **Listagem de PRs**
   - Lista PRs abertos, fechados ou todos
   - Filtragem por estado
   - Informações resumidas ou detalhadas

2. **Detalhes de PR Específico**
   - Informações completas de um PR por número
   - Estatísticas de mudanças
   - Reviewers solicitados
   - Status de merge

3. **Notificações WhatsApp**
   - Envio de mensagens formatadas
   - Templates predefinidos
   - Rate limiting para evitar spam
   - Deduplicação de mensagens

4. **Workflow Automatizado**
   - Busca PRs → Formata mensagem → Envia notificação
   - Suporte a templates customizados
   - Logging completo

## 📋 Pré-requisitos

### GitHub
- Personal Access Token com scope `repo`
- Acesso ao repositório que deseja monitorar

### WhatsApp (via Twilio)
- Conta Twilio ativa
- WhatsApp Business API habilitada
- Sandbox configurado (para testes)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione ao `.env`:

```env
# GitHub
GITHUB_TOKEN=ghp_seu_token_aqui
GITHUB_OWNER=seu-usuario
GITHUB_REPO=seu-repositorio

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+5511999999999
```

### 2. Obter GitHub Token

1. Acesse https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Selecione scope: `repo` (Full control of private repositories)
4. Gere e copie o token

### 3. Configurar Twilio WhatsApp

1. Crie conta em https://www.twilio.com/try-twilio
2. Acesse https://www.twilio.com/console/sms/whatsapp/sandbox
3. Siga as instruções para conectar seu WhatsApp
4. Copie Account SID e Auth Token

### 4. Registrar no Mastra

Em `src/mastra/index.ts`:

```typescript
import { prReviewerAgent, prNotificationWorkflow } from "./domains/pr-reviewer";

export const mastra = new Mastra({
  agents: {
    prReviewerAgent,
    // ... outros agents
  },
  workflows: {
    prNotificationWorkflow,
    // ... outros workflows
  },
  // ... resto da config
});
```

## 💬 Como Usar

### Via Playground (http://localhost:4111)

```bash
pnpm run dev
# Abra http://localhost:4111
# Selecione "PR Reviewer Agent"
```

### Via Código

```typescript
import { mastra } from "./src/mastra";

const agent = mastra.getAgent("prReviewerAgent");

// Listar PRs
const response = await agent.generate("Quais PRs estão abertos?");
console.log(response.text);

// Detalhes de um PR
const details = await agent.generate("Me dá os detalhes do PR #123");
console.log(details.text);

// Enviar notificação
const notification = await agent.generate(
  "Envia os PRs pendentes para o time no WhatsApp"
);
console.log(notification.text);
```

## 🛠️ Tools Disponíveis

### listPRsTool
Lista pull requests do repositório.

**Quando usar:** "Quais PRs estão abertos?", "Mostre os PRs"

### getPRDetailsTool
Busca detalhes de um PR específico.

**Quando usar:** "Me fala do PR #123", "Detalhes do PR 45"

### formatPRMessageTool
Formata PR para mensagem WhatsApp.

**Quando usar:** "Prepara mensagem sobre PRs", "Formata para enviar"

### sendWhatsAppTool
Envia mensagem via WhatsApp.

**Quando usar:** "Manda mensagem no WhatsApp", "Notifica no Zap"

## 🔄 Workflow

### prNotificationWorkflow

Fluxo completo automatizado:

1. **Busca PRs** do GitHub (com cache)
2. **Formata mensagem** usando templates
3. **Envia WhatsApp** com rate limiting

**Quando usar:** "Envia todos os PRs pro time", "Notifica sobre PRs pendentes"

## 📊 Features Técnicas

### Cache System
- TTL de 5 minutos para PRs
- Invalidação automática
- LRU eviction policy

### Rate Limiting
- 10 mensagens/minuto por destinatário
- Backpressure handling
- Wait-for-slot mechanism

### Idempotency
- Previne mensagens duplicadas por 1 hora
- Hash-based key generation
- Cleanup automático

### Error Handling
- Retry logic com exponential backoff
- Fallback strategies
- Logging estruturado

## 🧪 Testes

```bash
# E2E Tests
pnpm tsx tests/e2e/pr-reviewer-agent.e2e.ts

# Testes individuais
pnpm tsx -e "
import { mastra } from './src/mastra';
const agent = mastra.getAgent('prReviewerAgent');
const response = await agent.generate('Quais PRs estão abertos?');
console.log(response.text);
"
```

## 📝 Exemplos de Interação

### Português
```
User: "Quais PRs estão abertos no repositório?"
Agent: "📋 Encontrei 3 PRs abertos:
1. #45: Adiciona autenticação JWT
2. #46: Corrige bug de cache
3. #47: Atualiza documentação"

User: "Me dá os detalhes do PR #45"
Agent: "📋 PR #45: Adiciona autenticação JWT
✅ Mergeable
👤 Author: joao.silva
..."

User: "Manda todos os PRs para o time no WhatsApp"
Agent: "✅ Notificação enviada com sucesso!
📱 Mensagem ID: SM1234567890
👥 Destinatário: whatsapp:+5511999999999"
```

### English
```
User: "What PRs are open?"
Agent: "📋 Found 3 open PRs:
1. #45: Add JWT authentication
2. #46: Fix cache bug
3. #47: Update documentation"

User: "Send PR summary to WhatsApp"
Agent: "✅ Notification sent successfully!
📱 Message ID: SM1234567890"
```

## ⚠️ Troubleshooting

### "GitHub authentication failed"
- Verifique se GITHUB_TOKEN está correto
- Token precisa ter scope `repo`
- Token pode ter expirado

### "WhatsApp service not configured"
- Confirme variáveis TWILIO_* no .env
- Verifique credenciais no Twilio console
- WhatsApp sandbox precisa estar ativo

### "Rate limit exceeded"
- Aguarde 1 minuto entre mensagens
- Ajuste RATE_LIMIT_MAX_REQUESTS se necessário
- Verifique logs para padrões de uso

### "PR not found"
- Confirme número do PR
- Verifique se PR existe no repositório configurado
- Cache pode estar desatualizado (espere 5 min)

## 🔐 Segurança

- Tokens nunca expostos em logs
- Secrets gerenciados via SecretsManager
- Rate limiting previne abuse
- Idempotency previne duplicação
- Webhook signature validation (se usar webhooks)

## 🚀 Próximas Melhorias

- [ ] Suporte a GitHub Webhooks
- [ ] GraphQL queries para otimização
- [ ] Suporte a múltiplos repositórios
- [ ] Scheduler para notificações diárias
- [ ] Dashboard de métricas
- [ ] Suporte a Slack/Discord

## 📚 Recursos

- [GitHub REST API](https://docs.github.com/en/rest)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Mastra Documentation](https://mastra.ai/docs)

## 📄 Licença

Educational project for UFSC workshop.