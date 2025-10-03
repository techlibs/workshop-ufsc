# Telegram Agent

Agente especializado em integração com Telegram para envio de mensagens

## Funcionalidades

- Envio de mensagens via Telegram
- Rate limiting automático
- Sistema de fila com retry
- Suporte a webhooks
- Validação de configuração

## Instalação

1. Instale as dependências:
```bash
pnpm add node-telegram-bot-api
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
# Edite o .env com suas configurações
```

3. Registre o agente no Mastra:
```typescript
import { motivational-message-senderAgent } from './domains/motivational-message-sender';

export const mastra = new Mastra({
  agents: { motivational-message-senderAgent }
});
```

## Uso

```typescript
const agent = mastra.getAgent("motivational-message-senderAgent");

// Exemplo de uso
const agent = mastra.getAgent("telegramAgent");

// Enviar mensagem simples
await agent.generate("Envie 'Olá mundo!' via Telegram");

// Enviar para chat específico
await agent.generate("Envie 'Teste' para o chat 123456789");
```

## Configuração

### Variáveis de Ambiente

- **TELEGRAM_BOT_TOKEN**: Token do bot do Telegram obtido do @BotFather (obrigatório)
- **TELEGRAM_CHAT_ID**: ID do chat padrão para envio de mensagens (opcional)

## Testes

Execute os testes:
```bash
npx tsx tests/motivational-message-sender.test.ts
```