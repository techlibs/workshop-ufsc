// mastra.config.ts
import { defineConfig } from "mastra";

export default defineConfig({
  // Configurações específicas para deploy
  build: {
    // Otimizações para produção
    minify: true,
    sourcemap: false,
  },
  // Configurações de banco de dados para deploy
  database: {
    // Em produção, usar sempre memória para evitar problemas de arquivo
    url: ":memory:",
  },
  // Configurações de logging para produção
  logging: {
    level: "info",
  },
});
