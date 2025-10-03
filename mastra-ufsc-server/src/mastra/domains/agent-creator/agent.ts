// src/mastra/domains/agent-creator/agent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { ModerationProcessor, PIIDetector } from "@mastra/core/processors";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { AgentTemplateEngine, AGENT_TEMPLATES } from "./templates/agent-templates";
import { CodeGenerator } from "./services/code-generator";
import { AgentValidator } from "./utils/validation";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Função para obter __dirname de forma segura
function getCurrentDir(): string {
  try {
    const filename = fileURLToPath(import.meta.url);
    return dirname(filename);
  } catch {
    return process.cwd();
  }
}

// Função para validar código gerado
function validateGeneratedCode(code: string, fileName: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Verificar imports básicos necessários
  if (fileName.includes('agent.ts')) {
    if (!code.includes('import { z } from "zod"')) {
      errors.push('Missing Zod import (z)');
    }
    if (!code.includes('import { createTool }')) {
      errors.push('Missing createTool import');
    }
    if (!code.includes('import { Agent }')) {
      errors.push('Missing Agent import');
    }
  }
  
  // Verificar se há referências a classes não importadas
  if (code.includes('new ApiService()') && !code.includes('import { ApiService }')) {
    errors.push('ApiService used but not imported');
  }
  
  if (code.includes('new TelegramService()') && !code.includes('import { TelegramService }')) {
    errors.push('TelegramService used but not imported');
  }
  
  if (code.includes('new EmailService()') && !code.includes('import { EmailService }')) {
    errors.push('EmailService used but not imported');
  }
  
  if (code.includes('new DatabaseService()') && !code.includes('import { DatabaseService }')) {
    errors.push('DatabaseService used but not imported');
  }
  
  // Verificar sintaxe básica
  if (code.includes('z.object({') && !code.includes('import { z }')) {
    errors.push('Zod schema used but z not imported');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Função para instalar dependências automaticamente
async function installDependencies(dependencies: string[]): Promise<{ success: boolean; error?: string }> {
  if (!dependencies || dependencies.length === 0) {
    return { success: true };
  }

  try {
    const { spawn } = await import('child_process');
    const path = await import('path');
    
    return new Promise((resolve) => {
      const child = spawn('pnpm', ['add', ...dependencies], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      let errorOutput = '';
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ 
            success: false, 
            error: `Failed to install dependencies: ${errorOutput}` 
          });
        }
      });

      child.on('error', (error) => {
        resolve({ 
          success: false, 
          error: `Failed to spawn pnpm: ${error.message}` 
        });
      });
    });
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Função para registrar agente automaticamente no Mastra
async function registerAgentInMastra(agentName: string, agentClassName: string): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  
  // Encontrar o caminho correto para o arquivo mastra/index.ts
  let mastraIndexPath = 'src/mastra/index.ts';
  
  // Tentar diferentes caminhos possíveis
  const currentDir = getCurrentDir();
  const possiblePaths = [
    'src/mastra/index.ts',
    './src/mastra/index.ts',
    path.join(process.cwd(), 'src/mastra/index.ts'),
    path.join(currentDir, '../../index.ts'),
    path.join(currentDir, '../../../index.ts')
  ];
  
  let foundPath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      foundPath = testPath;
      break;
    }
  }
  
  if (!foundPath) {
    throw new Error(`Arquivo src/mastra/index.ts não encontrado. Tentou os seguintes caminhos: ${possiblePaths.join(', ')}`);
  }
  
  mastraIndexPath = foundPath;
  
  let mastraContent = fs.readFileSync(mastraIndexPath, 'utf8');
  
  // Validar se o arquivo tem a estrutura esperada
  if (!mastraContent.includes('export const mastra = new Mastra')) {
    throw new Error('Arquivo mastra/index.ts não tem a estrutura esperada (export const mastra = new Mastra)');
  }
  
  if (!mastraContent.includes('agents: {')) {
    throw new Error('Arquivo mastra/index.ts não tem a seção agents esperada');
  }
  
  // Adicionar import do novo agente
  const importLine = `import { ${agentClassName}Agent } from "./domains/${agentName}";`;
  
  // Verificar se o import já existe
  if (!mastraContent.includes(importLine)) {
    // Encontrar a última linha de import e adicionar o novo
    const importRegex = /import.*from.*domains.*;/g;
    const imports = mastraContent.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = mastraContent.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      
      mastraContent = mastraContent.slice(0, insertIndex) + '\n' + importLine + mastraContent.slice(insertIndex);
    }
  }
  
  // Adicionar agente na lista de agentes
  const agentsRegex = /agents:\s*{([^}]*)}/;
  const agentsMatch = mastraContent.match(agentsRegex);
  
  if (agentsMatch) {
    const agentsContent = agentsMatch[1];
    const agentEntry = `    ${agentClassName}Agent,`;
    
    // Verificar se o agente já está registrado
    if (!agentsContent.includes(agentEntry)) {
      // Encontrar a última entrada de agente e adicionar o novo
      const agentEntries = agentsContent.match(/\s+\w+Agent,/g);
      
      if (agentEntries && agentEntries.length > 0) {
        const lastAgentEntry = agentEntries[agentEntries.length - 1];
        const lastAgentIndex = agentsContent.lastIndexOf(lastAgentEntry);
        const insertIndex = lastAgentIndex + lastAgentEntry.length;
        
        const newAgentsContent = agentsContent.slice(0, insertIndex) + '\n' + agentEntry + agentsContent.slice(insertIndex);
        mastraContent = mastraContent.replace(agentsRegex, `agents: {${newAgentsContent}}`);
      }
    }
  }
  
  // Salvar arquivo modificado
  fs.writeFileSync(mastraIndexPath, mastraContent, 'utf8');
}

// Tool para listar templates disponíveis
const listAgentTemplatesTool = createTool({
  id: "list-agent-templates",
  description: "Lista todos os templates de agentes disponíveis",
  inputSchema: z.object({
    category: z.string().optional().describe("Categoria para filtrar (opcional)"),
    search: z.string().optional().describe("Termo de busca (opcional)")
  }),
  outputSchema: z.object({
    templates: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
      features: z.array(z.string())
    })),
    total: z.number()
  }),
  execute: async ({ context }) => {
    const { category, search } = context;
    
    let templates = AGENT_TEMPLATES;
    
    if (category) {
      templates = AgentTemplateEngine.getTemplatesByCategory(category as any);
    }
    
    if (search) {
      templates = AgentTemplateEngine.searchTemplates(search);
    }
    
    return {
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        features: template.features
      })),
      total: templates.length
    };
  }
});

// Tool para obter detalhes de um template
const getTemplateDetailsTool = createTool({
  id: "get-template-details",
  description: "Obtém detalhes completos de um template específico",
  inputSchema: z.object({
    templateId: z.string().describe("ID do template")
  }),
  outputSchema: z.object({
    template: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
      features: z.array(z.string()),
      tools: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string()
      })),
      dependencies: z.array(z.string()),
      envVars: z.array(z.object({
        name: z.string(),
        description: z.string(),
        required: z.boolean(),
        example: z.string()
      })),
      instructions: z.string(),
      exampleUsage: z.string()
    }).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { templateId } = context;
    
    const template = AgentTemplateEngine.getTemplateById(templateId);
    
    if (!template) {
      return {
        error: `Template '${templateId}' não encontrado`
      };
    }
    
    return {
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        features: template.features,
        tools: template.tools.map(tool => ({
          id: tool.id,
          name: tool.name,
          description: tool.description
        })),
        dependencies: template.dependencies,
        envVars: template.envVars,
        instructions: template.instructions,
        exampleUsage: template.exampleUsage
      }
    };
  }
});

// Tool para gerar código do agente
const generateAgentCodeTool = createTool({
  id: "generate-agent-code",
  description: "Gera código completo para um novo agente baseado em template",
  inputSchema: z.object({
    templateId: z.string().describe("ID do template base"),
    customizations: z.object({
      agentName: z.string().optional().describe("Nome personalizado do agente"),
      description: z.string().optional().describe("Descrição personalizada"),
      instructions: z.string().optional().describe("Instruções personalizadas"),
      additionalFeatures: z.array(z.string()).optional().describe("Funcionalidades adicionais")
    }).optional().describe("Personalizações do agente")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    generatedAgent: z.object({
      agentCode: z.string(),
      serviceCode: z.string().optional(),
      utilsCode: z.string().optional(),
      envExample: z.string(),
      packageJson: z.string(),
      readme: z.string(),
      testCode: z.string()
    }).optional(),
    validation: z.object({
      isValid: z.boolean(),
      errors: z.array(z.string()),
      warnings: z.array(z.string())
    }).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { templateId, customizations } = context;
    
    try {
      // Obter template
      const template = AgentTemplateEngine.getTemplateById(templateId);
      if (!template) {
        return {
          success: false,
          error: `Template '${templateId}' não encontrado`
        };
      }
      
      // Validar customizações
      const validation = AgentValidator.validateCustomization(customizations || {});
      
      // Gerar código
      const generatedAgent = CodeGenerator.generateAgent(template, customizations);
      
      return {
        success: true,
        generatedAgent,
        validation
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
    }
  }
});

// Tool para validar configuração de agente
const validateAgentConfigTool = createTool({
  id: "validate-agent-config",
  description: "Valida configuração de um agente antes da geração",
  inputSchema: z.object({
    agentName: z.string().describe("Nome do agente"),
    description: z.string().describe("Descrição do agente"),
    instructions: z.string().describe("Instruções do agente"),
    templateId: z.string().optional().describe("ID do template base")
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    errors: z.array(z.string()),
    warnings: z.array(z.string()),
    suggestions: z.array(z.string()).optional()
  }),
  execute: async ({ context }) => {
    const { agentName, description, instructions, templateId } = context;
    
    // Validar configuração básica
    const nameValidation = AgentValidator.validateAgentName(agentName);
    const descValidation = AgentValidator.validateAgentDescription(description);
    const instValidation = AgentValidator.validateInstructions(instructions);
    
    const errors = [
      ...nameValidation.errors,
      ...descValidation.errors,
      ...instValidation.errors
    ];
    
    const warnings = [
      ...nameValidation.warnings,
      ...descValidation.warnings,
      ...instValidation.warnings
    ];
    
    const suggestions: string[] = [];
    
    // Sugestões baseadas no template
    if (templateId) {
      const template = AgentTemplateEngine.getTemplateById(templateId);
      if (template) {
        suggestions.push(`Template '${template.name}' inclui: ${template.features.join(', ')}`);
        suggestions.push(`Dependências necessárias: ${template.dependencies.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }
});

// Tool para criar estrutura de arquivos
const createAgentStructureTool = createTool({
  id: "create-agent-structure",
  description: "Cria estrutura de arquivos para um novo agente e salva na pasta domains",
  inputSchema: z.object({
    agentName: z.string().describe("Nome do agente"),
    templateId: z.string().describe("ID do template base"),
    autoRegister: z.boolean().optional().default(true).describe("Registrar automaticamente no Mastra")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    filesCreated: z.array(z.object({
      path: z.string(),
      content: z.string(),
      type: z.string(),
      saved: z.boolean()
    })).optional(),
    registrationStatus: z.object({
      registered: z.boolean(),
      error: z.string().optional()
    }).optional(),
    dependencyStatus: z.object({
      success: z.boolean(),
      error: z.string().optional()
    }).optional(),
    instructions: z.string().optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { agentName, templateId, autoRegister } = context;
    
    try {
      const template = AgentTemplateEngine.getTemplateById(templateId);
      if (!template) {
        return {
          success: false,
          error: `Template '${templateId}' não encontrado`
        };
      }
      
      const normalizedAgentName = agentName.toLowerCase().replace(/\s+/g, '-');
      const agentClassName = normalizedAgentName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      
      const generatedAgent = CodeGenerator.generateAgent(template, {
        agentName: normalizedAgentName
      });
      
      // Criar diretório do agente usando caminho absoluto
      const fs = await import('fs');
      const path = await import('path');
      
      // Encontrar o diretório raiz do projeto
      let projectRoot = process.cwd();
      const currentDir = getCurrentDir();
      const possibleRoots = [
        process.cwd(),
        path.join(process.cwd(), '..'),
        path.join(process.cwd(), '../..'),
        path.join(currentDir, '../../../..'),
        path.join(currentDir, '../../../../..')
      ];
      
      // Verificar qual diretório contém src/mastra
      for (const testRoot of possibleRoots) {
        if (fs.existsSync(path.join(testRoot, 'src/mastra'))) {
          projectRoot = testRoot;
          break;
        }
      }
      
      const agentDir = path.join(projectRoot, 'src/mastra/domains', normalizedAgentName);
      
      // Criar diretórios necessários
      const dirs = [
        agentDir,
        path.join(agentDir, 'services'),
        path.join(agentDir, 'utils'),
        path.join(agentDir, 'tools'),
        path.join(agentDir, 'data')
      ];
      
      for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }
      
      const filesToCreate = [
        {
          path: path.join(agentDir, 'agent.ts'),
          content: generatedAgent.agentCode,
          type: 'agent'
        },
        {
          path: path.join(agentDir, 'index.ts'),
          content: `export { ${agentClassName}Agent } from './agent';`,
          type: 'index'
        }
      ];
      
      if (generatedAgent.serviceCode) {
        filesToCreate.push({
          path: path.join(agentDir, 'services', `${normalizedAgentName}-service.ts`),
          content: generatedAgent.serviceCode,
          type: 'service'
        });
      }
      
      if (generatedAgent.utilsCode) {
        filesToCreate.push({
          path: path.join(agentDir, 'utils', 'env-config.ts'),
          content: generatedAgent.utilsCode,
          type: 'utils'
        });
      }
      
      // Salvar arquivos
      const filesCreated = [];
      const validationErrors: string[] = [];
      
      for (const file of filesToCreate) {
        try {
          // Validar código antes de salvar
          const validation = validateGeneratedCode(file.content, file.path);
          if (!validation.valid) {
            validationErrors.push(...validation.errors.map(err => `${file.path}: ${err}`));
          }
          
          fs.writeFileSync(file.path, file.content, 'utf8');
          filesCreated.push({
            ...file,
            saved: true
          });
        } catch (error) {
          filesCreated.push({
            ...file,
            saved: false
          });
        }
      }
      
      // Se há erros de validação, retornar erro
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation errors found:\n${validationErrors.join('\n')}`,
          filesCreated
        };
      }
      
      // Instalar dependências automaticamente
      let dependencyStatus = { success: true };
      if (template.dependencies && template.dependencies.length > 0) {
        dependencyStatus = await installDependencies(template.dependencies);
      }
      
      // Salvar arquivos de configuração na raiz do projeto
      const configFiles = [
        {
          path: path.join(projectRoot, `env.${normalizedAgentName}.example`),
          content: generatedAgent.envExample,
          type: 'env'
        },
        {
          path: path.join(projectRoot, `README.${normalizedAgentName}.md`),
          content: generatedAgent.readme,
          type: 'readme'
        }
      ];
      
      for (const file of configFiles) {
        try {
          fs.writeFileSync(file.path, file.content, 'utf8');
          filesCreated.push({
            ...file,
            saved: true
          });
        } catch (error) {
          filesCreated.push({
            ...file,
            saved: false
          });
        }
      }
      
      // Registrar no Mastra se solicitado
      let registrationStatus: { registered: boolean; error?: string } = { registered: false };
      if (autoRegister) {
        try {
          await registerAgentInMastra(normalizedAgentName, agentClassName);
          registrationStatus = { registered: true };
        } catch (error) {
          registrationStatus = { 
            registered: false, 
            error: error instanceof Error ? error.message : "Erro desconhecido" 
          };
        }
      }
      
      return {
        success: true,
        filesCreated,
        registrationStatus,
        dependencyStatus,
        instructions: `✅ Agente '${normalizedAgentName}' criado com sucesso!
        
📁 Arquivos criados em: src/mastra/domains/${normalizedAgentName}/
📁 Arquivos de configuração: env.${normalizedAgentName}.example, README.${normalizedAgentName}.md
${registrationStatus.registered ? '✅ Registrado automaticamente no Mastra' : '⚠️ Registro manual necessário'}
${dependencyStatus.success ? '✅ Dependências instaladas automaticamente' : '⚠️ Instalação manual de dependências necessária'}

🔧 Próximos passos:
${!dependencyStatus.success ? `1. Instale dependências: pnpm add ${template.dependencies.join(' ')}` : ''}
${!dependencyStatus.success ? '2. ' : '1. '}Configure variáveis no .env usando env.${normalizedAgentName}.example
${!dependencyStatus.success ? '3. ' : '2. '}Reinicie o servidor para carregar o novo agente
${!dependencyStatus.success ? '4. ' : '3. '}Teste: mastra.getAgent("${agentClassName}Agent")`
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
    }
  }
});

// Tool para listar agentes criados
const listCreatedAgentsTool = createTool({
  id: "list-created-agents",
  description: "Lista todos os agentes criados na pasta domains",
  inputSchema: z.object({}),
  outputSchema: z.object({
    agents: z.array(z.object({
      name: z.string(),
      path: z.string(),
      hasAgentFile: z.boolean(),
      hasIndexFile: z.boolean(),
      hasServices: z.boolean(),
      hasUtils: z.boolean(),
      lastModified: z.string().optional()
    })),
    total: z.number()
  }),
  execute: async ({ context }) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const domainsDir = 'src/mastra/domains';
      const agents = [];
      
      if (fs.existsSync(domainsDir)) {
        const entries = fs.readdirSync(domainsDir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const agentPath = path.join(domainsDir, entry.name);
            const agentFiles = fs.readdirSync(agentPath);
            
            const agentInfo = {
              name: entry.name,
              path: agentPath,
              hasAgentFile: agentFiles.includes('agent.ts'),
              hasIndexFile: agentFiles.includes('index.ts'),
              hasServices: fs.existsSync(path.join(agentPath, 'services')),
              hasUtils: fs.existsSync(path.join(agentPath, 'utils')),
              lastModified: fs.statSync(agentPath).mtime.toISOString()
            };
            
            agents.push(agentInfo);
          }
        }
      }
      
      return {
        agents,
        total: agents.length
      };
      
    } catch (error) {
      return {
        agents: [],
        total: 0
      };
    }
  }
});

// Tool para corrigir agentes existentes
const fixExistingAgentsTool = createTool({
  id: "fix-existing-agents",
  description: "Corrige nomes de variáveis em agentes já criados",
  inputSchema: z.object({
    agentName: z.string().describe("Nome do agente a ser corrigido")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    fixed: z.array(z.object({
      file: z.string(),
      oldName: z.string(),
      newName: z.string(),
      fixed: z.boolean()
    })),
    error: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { agentName } = context;
    
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const normalizedAgentName = agentName.toLowerCase().replace(/\s+/g, '-');
      const agentClassName = normalizedAgentName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      
      const agentDir = `src/mastra/domains/${normalizedAgentName}`;
      const fixed = [];
      
      // Corrigir agent.ts
      const agentFilePath = path.join(agentDir, 'agent.ts');
      if (fs.existsSync(agentFilePath)) {
        let agentContent = fs.readFileSync(agentFilePath, 'utf8');
        const oldExportPattern = new RegExp(`export const ${normalizedAgentName.replace(/-/g, '-')}Agent`, 'g');
        const newExportName = `${agentClassName}Agent`;
        
        if (agentContent.match(oldExportPattern)) {
          agentContent = agentContent.replace(oldExportPattern, `export const ${newExportName}`);
          fs.writeFileSync(agentFilePath, agentContent, 'utf8');
          fixed.push({
            file: agentFilePath,
            oldName: `${normalizedAgentName}Agent`,
            newName: newExportName,
            fixed: true
          });
        }
      }
      
      // Corrigir index.ts
      const indexPath = path.join(agentDir, 'index.ts');
      if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        const oldImportPattern = new RegExp(`export \\{ ${normalizedAgentName.replace(/-/g, '-')}Agent \\}`, 'g');
        const newImportName = `${agentClassName}Agent`;
        
        if (indexContent.match(oldImportPattern)) {
          indexContent = indexContent.replace(oldImportPattern, `export { ${newImportName} }`);
          fs.writeFileSync(indexPath, indexContent, 'utf8');
          fixed.push({
            file: indexPath,
            oldName: `${normalizedAgentName}Agent`,
            newName: newImportName,
            fixed: true
          });
        }
      }
      
      // Corrigir registro no Mastra
      const mastraIndexPath = 'src/mastra/index.ts';
      if (fs.existsSync(mastraIndexPath)) {
        let mastraContent = fs.readFileSync(mastraIndexPath, 'utf8');
        
        // Corrigir import
        const oldImportPattern = new RegExp(`import \\{ ${normalizedAgentName.replace(/-/g, '-')}Agent \\}`, 'g');
        const newImportName = `${agentClassName}Agent`;
        
        if (mastraContent.match(oldImportPattern)) {
          mastraContent = mastraContent.replace(oldImportPattern, `import { ${newImportName} }`);
          fixed.push({
            file: mastraIndexPath,
            oldName: `${normalizedAgentName}Agent`,
            newName: newImportName,
            fixed: true
          });
        }
        
        // Corrigir registro na lista de agentes
        const oldAgentPattern = new RegExp(`\\s+${normalizedAgentName.replace(/-/g, '-')}Agent,`, 'g');
        if (mastraContent.match(oldAgentPattern)) {
          mastraContent = mastraContent.replace(oldAgentPattern, `    ${newImportName},`);
          fixed.push({
            file: mastraIndexPath,
            oldName: `${normalizedAgentName}Agent`,
            newName: newImportName,
            fixed: true
          });
        }
        
        fs.writeFileSync(mastraIndexPath, mastraContent, 'utf8');
      }
      
      return {
        success: true,
        fixed
      };
      
    } catch (error) {
      return {
        success: false,
        fixed: [],
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
    }
  }
});

export const agentCreatorAgent = new Agent({
  name: "agent-creator-agent",
  description: "Agente especializado em criar novos agentes Mastra baseados em templates",
  instructions: `Você é um assistente especializado em criar novos agentes para o framework Mastra.

CAPACIDADES:
- listAgentTemplates: Lista templates disponíveis
- getTemplateDetails: Mostra detalhes de um template específico
- generateAgentCode: Gera código completo do agente
- validateAgentConfig: Valida configurações antes da geração
- createAgentStructure: Cria arquivos e registra no Mastra automaticamente
- listCreatedAgents: Lista agentes já criados
- fixExistingAgents: Corrige agentes com problemas

TEMPLATES DISPONÍVEIS:
- telegram-agent: Integração com Telegram
- email-agent: Envio de emails
- database-agent: Operações de banco de dados
- api-agent: Integração com APIs externas

INSTRUÇÕES IMPORTANTES:
- Use UMA ferramenta por vez
- Seja direto e objetivo
- Para criar agente: use createAgentStructure diretamente
- Para listar: use listAgentTemplates ou listCreatedAgents
- Para detalhes: use getTemplateDetails

EXEMPLOS DE USO:
- "Liste templates disponíveis" → use listAgentTemplates
- "Crie agente notification baseado no telegram-agent" → use createAgentStructure
- "Mostre detalhes do telegram-agent" → use getTemplateDetails
- "Liste agentes criados" → use listCreatedAgents`,

  model: openai("gpt-4o-mini"),
  
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./agent-creator-memory.db"
    })
  }),

  tools: {
    listAgentTemplates: listAgentTemplatesTool,
    getTemplateDetails: getTemplateDetailsTool,
    generateAgentCode: generateAgentCodeTool,
    validateAgentConfig: validateAgentConfigTool,
    createAgentStructure: createAgentStructureTool,
    fixExistingAgents: fixExistingAgentsTool
  },

  inputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4o-mini"),
      threshold: 0.7,
      strategy: 'block',
      categories: ['sexual', 'harassment', 'violence']
    }),
    new PIIDetector({
      model: openai("gpt-4o-mini"),
      threshold: 0.6,
      strategy: 'redact',
      detectionTypes: ['email', 'phone', 'name', 'address']
    })
  ],

  outputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4o-mini"),
      threshold: 0.7,
      strategy: 'block',
      categories: ['sexual', 'harassment', 'violence']
    }),
    new PIIDetector({
      model: openai("gpt-4o-mini"),
      threshold: 0.6,
      strategy: 'redact',
      detectionTypes: ['email', 'phone', 'name', 'address']
    })
  ]
});
