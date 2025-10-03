// src/mastra/shared/config/database.ts
import { LibSQLStore } from "@mastra/libsql";

export function createDatabaseConfig() {
  // Detectar ambiente
  const isProduction = process.env.NODE_ENV === 'production';
  const isDeploy = process.env.VERCEL || process.env.NETLIFY || process.env.RAILWAY;
  
  // Para deploy em plataformas cloud, usar sempre memória
  if (isDeploy || isProduction) {
    console.log('🔧 Usando banco em memória para produção/deploy');
    return new LibSQLStore({
      url: ":memory:",
    });
  }
  
  // Para desenvolvimento local, usar arquivo
  console.log('🔧 Usando banco em arquivo para desenvolvimento');
  return new LibSQLStore({
    url: "file:./mastra.db",
  });
}
