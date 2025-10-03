# Guia de Uso do Agent Creator (Corrigido)

## 🎯 Problema Resolvido

O erro `Stream finished with reason tool-calls, try increasing maxSteps` foi corrigido!

## 🔧 Soluções Implementadas

### 1. Instruções Otimizadas
- ✅ Instruções mais diretas e objetivas
- ✅ Uso de uma ferramenta por vez
- ✅ Exemplos claros de uso

### 2. MaxSteps Adequados
- ✅ **Listar templates**: `maxSteps: 2`
- ✅ **Criar agente**: `maxSteps: 8`
- ✅ **Mostrar detalhes**: `maxSteps: 3`
- ✅ **Listar agentes**: `maxSteps: 2`

## 🚀 Como Usar Agora

### Exemplo 1: Listar Templates
```typescript
const agent = mastra.getAgent("agentCreatorAgent");

const response = await agent.generate(
  "Liste templates disponíveis",
  { maxSteps: 2 }
);
```

### Exemplo 2: Criar Agente
```typescript
const response = await agent.generate(
  "Crie agente notification baseado no telegram-agent",
  { maxSteps: 8 }
);
```

### Exemplo 3: Mostrar Detalhes
```typescript
const response = await agent.generate(
  "Mostre detalhes do telegram-agent",
  { maxSteps: 3 }
);
```

### Exemplo 4: Listar Agentes Criados
```typescript
const response = await agent.generate(
  "Liste agentes criados",
  { maxSteps: 2 }
);
```

## 📋 Templates Disponíveis

1. **telegram-agent**: Integração com Telegram
2. **email-agent**: Envio de emails
3. **database-agent**: Operações de banco de dados
4. **api-agent**: Integração com APIs externas

## 💡 Dicas Importantes

- ✅ Seja direto nas instruções
- ✅ Use maxSteps adequado para cada operação
- ✅ Evite múltiplas ferramentas em sequência
- ✅ O agente agora funciona sem erros!

## 🎉 Resultado

O Agent Creator agora funciona perfeitamente e cria agentes que são automaticamente registrados no Mastra!
