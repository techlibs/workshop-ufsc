// test-simple-registration.ts
import { mastra } from "./src/mastra";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testSimpleRegistration() {
  console.log("🔍 Testando Registro Simples...\n");

  try {
    // Testar se conseguimos acessar o arquivo mastra/index.ts
    const fs = await import('fs');
    const path = await import('path');
    
    console.log("📁 Verificando caminhos possíveis para mastra/index.ts:");
    
    const possiblePaths = [
      'src/mastra/index.ts',
      './src/mastra/index.ts',
      path.join(process.cwd(), 'src/mastra/index.ts'),
      path.join(__dirname, '../../index.ts'),
      path.join(__dirname, '../../../index.ts')
    ];
    
    let foundPath = null;
    for (const testPath of possiblePaths) {
      const exists = fs.existsSync(testPath);
      console.log(`  ${exists ? '✅' : '❌'} ${testPath}`);
      if (exists && !foundPath) {
        foundPath = testPath;
      }
    }
    
    if (foundPath) {
      console.log(`\n✅ Arquivo encontrado em: ${foundPath}`);
      
      // Ler o conteúdo do arquivo
      const content = fs.readFileSync(foundPath, 'utf8');
      console.log(`📄 Tamanho do arquivo: ${content.length} caracteres`);
      
      // Verificar se há imports de domains
      const importRegex = /import.*from.*domains.*;/g;
      const imports = content.match(importRegex);
      console.log(`📦 Imports de domains encontrados: ${imports ? imports.length : 0}`);
      
      if (imports) {
        console.log("📋 Imports existentes:");
        imports.forEach((imp, index) => {
          console.log(`  ${index + 1}. ${imp}`);
        });
      }
      
      // Verificar se há seção de agents
      const agentsRegex = /agents:\s*{([^}]*)}/;
      const agentsMatch = content.match(agentsRegex);
      if (agentsMatch) {
        console.log(`\n🤖 Seção de agents encontrada`);
        console.log(`📝 Conteúdo: ${agentsMatch[1].substring(0, 100)}...`);
      } else {
        console.log(`\n⚠️ Seção de agents não encontrada`);
      }
      
    } else {
      console.log("\n❌ Arquivo mastra/index.ts não encontrado em nenhum caminho");
    }
    
    // Testar criação de diretório
    console.log("\n📁 Testando criação de diretório...");
    const testDir = path.join(process.cwd(), 'src/mastra/domains/test-dir');
    console.log(`Caminho do teste: ${testDir}`);
    
    try {
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
        console.log("✅ Diretório criado com sucesso");
        
        // Remover o diretório de teste
        fs.rmSync(testDir, { recursive: true });
        console.log("✅ Diretório de teste removido");
      } else {
        console.log("⚠️ Diretório já existe");
      }
    } catch (error) {
      console.log("❌ Erro ao criar diretório:", error);
    }

  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testSimpleRegistration().catch(console.error);
