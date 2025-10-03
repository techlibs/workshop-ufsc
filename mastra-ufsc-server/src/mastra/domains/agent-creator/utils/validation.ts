// src/mastra/domains/agent-creator/utils/validation.ts
import { AgentTemplate } from '../templates/agent-templates';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class AgentValidator {
  static validateAgentName(name: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar se o nome é válido
    if (!name || name.trim().length === 0) {
      errors.push('Nome do agente é obrigatório');
    }

    // Verificar formato do nome
    if (name && !/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
      errors.push('Nome do agente deve conter apenas letras, números, hífens e underscores');
    }

    // Verificar tamanho
    if (name && name.length > 50) {
      warnings.push('Nome muito longo, considere usar um nome mais curto');
    }

    // Verificar palavras reservadas
    const reservedWords = ['agent', 'mastra', 'core', 'api', 'service', 'util'];
    if (name && reservedWords.includes(name.toLowerCase())) {
      warnings.push('Nome pode conflitar com palavras reservadas do sistema');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateAgentDescription(description: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!description || description.trim().length === 0) {
      errors.push('Descrição do agente é obrigatória');
    }

    if (description && description.length < 10) {
      warnings.push('Descrição muito curta, considere adicionar mais detalhes');
    }

    if (description && description.length > 500) {
      warnings.push('Descrição muito longa, considere resumir');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateInstructions(instructions: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!instructions || instructions.trim().length === 0) {
      errors.push('Instruções do agente são obrigatórias');
    }

    if (instructions && instructions.length < 50) {
      warnings.push('Instruções muito curtas, considere adicionar mais detalhes');
    }

    // Verificar se contém elementos essenciais
    const essentialElements = ['capacidades', 'diretrizes', 'comportamento'];
    const hasEssentialElements = essentialElements.some(element => 
      instructions.toLowerCase().includes(element)
    );

    if (!hasEssentialElements) {
      warnings.push('Instruções devem incluir capacidades e diretrizes claras');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateTemplate(template: AgentTemplate): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar nome
    const nameValidation = this.validateAgentName(template.name);
    errors.push(...nameValidation.errors);
    warnings.push(...nameValidation.warnings);

    // Validar descrição
    const descValidation = this.validateAgentDescription(template.description);
    errors.push(...descValidation.errors);
    warnings.push(...descValidation.warnings);

    // Validar instruções
    const instValidation = this.validateInstructions(template.instructions);
    errors.push(...instValidation.errors);
    warnings.push(...instValidation.warnings);

    // Validar ferramentas
    if (!template.tools || template.tools.length === 0) {
      warnings.push('Agente sem ferramentas pode ter funcionalidade limitada');
    }

    // Validar dependências
    if (!template.dependencies || template.dependencies.length === 0) {
      warnings.push('Agente sem dependências externas pode ser muito simples');
    }

    // Validar variáveis de ambiente
    const requiredEnvVars = template.envVars.filter(v => v.required);
    if (requiredEnvVars.length === 0) {
      warnings.push('Agente sem variáveis de ambiente obrigatórias pode não precisar de configuração');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateCustomization(customization: {
    agentName?: string;
    description?: string;
    instructions?: string;
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (customization.agentName) {
      const nameValidation = this.validateAgentName(customization.agentName);
      errors.push(...nameValidation.errors);
      warnings.push(...nameValidation.warnings);
    }

    if (customization.description) {
      const descValidation = this.validateAgentDescription(customization.description);
      errors.push(...descValidation.errors);
      warnings.push(...descValidation.warnings);
    }

    if (customization.instructions) {
      const instValidation = this.validateInstructions(customization.instructions);
      errors.push(...instValidation.errors);
      warnings.push(...instValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
