# AI-Oriented 4-Step Implementation Workflow System

## System Overview
This workflow implements a structured approach to solution development through four distinct phases, ensuring quality and systematic implementation with proper agent utilization.

---

## PHASE 1: STRATEGIC PLANNING AND ARCHITECTURE

### Instruction Set for LLM:
```
When receiving any implementation request, you MUST:

1. **MANDATORY AGENT CREATION**
   - ALWAYS create a new specialized agent using @agents.md
   - Define agent role, capabilities, and constraints
   - Specify agent interaction protocols
   
2. **PLAN GENERATION REQUIREMENTS**
   Create a comprehensive implementation plan containing:
   
   a) **Architecture Definition**
      - System components and their relationships
      - Data flow diagrams
      - Technology stack selection
      - Integration points
   
   b) **Task Decomposition**
      - Break down into atomic, executable tasks
      - Define dependencies and sequencing
      - Estimate complexity scores (1-10)
      - Identify parallelizable operations
   
   c) **Resource Allocation**
      - Required tools and APIs
      - Computational requirements
      - Time estimates per component
      - Risk assessment matrix
   
   d) **Success Metrics**
      - Define measurable KPIs
      - Set acceptance criteria
      - Establish performance benchmarks
      - Create validation checkpoints

   e) **API Keys & External Dependencies**
      - List all required external services/APIs you MUST search in  ../../getting-started/api-keys-guide.md
      - Reference `docs/getting-started/api-keys-guide.md` for setup instructions
      - Document where to obtain each API key
      - Specify required scopes/permissions
      - Update `shared/config/env.ts` with getter functions

OUTPUT FORMAT: Structured JSON plan with nested hierarchies
```

---

## PHASE 2: INTELLIGENT REVIEW AND ANALYSIS

### Review Agent Instructions:
```
Create a REVIEW AGENT via @agents.md specialized in:

EVALUATION CRITERIA MATRIX:

1. **Technical Feasibility (Weight: 30%)**
   - Architectural soundness
   - Scalability potential
   - Security considerations
   - Performance optimization opportunities

2. **Implementation Efficiency (Weight: 25%)**
   - Code reusability score
   - Modularity assessment
   - Maintenance complexity
   - Testing coverage potential

3. **Resource Optimization (Weight: 20%)**
   - Computational efficiency
   - Memory usage projections
   - API call minimization
   - Cost-benefit analysis

4. **Risk Assessment (Weight: 15%)**
   - Failure point identification
   - Mitigation strategy completeness
   - Rollback procedure clarity
   - Edge case coverage

5. **Compliance & Standards (Weight: 10%)**
   - Best practices adherence
   - Documentation completeness
   - Code style consistency
   - Accessibility standards

ANALYSIS OUTPUT:
- Generate scored report (0-100 per criteria)
- Provide improvement recommendations ranked by impact
- Flag critical issues requiring immediate attention
- Suggest optimization opportunities
```

---

## PHASE 3: ADAPTIVE REVIEW APPLICATION

### Refinement Agent Protocol:
```
IF review_score < 80 OR critical_issues_exist:
   
   CREATE REFINEMENT AGENT using @agents.md with capabilities:
   
   1. **Priority-Based Modifications**
      - Address critical issues first
      - Apply high-impact improvements
      - Optimize bottlenecks
      - Enhance error handling
   
   2. **Iterative Enhancement Process**
      WHILE plan_quality < threshold:
         - Apply targeted improvements
         - Re-evaluate affected components
         - Update dependency chains
         - Validate modifications
         - Document changes with rationale
   
   3. **Change Tracking**
      - Maintain version history
      - Log modification reasons
      - Track improvement metrics
      - Generate delta reports

   4. **Validation Loop**
      - Re-run Phase 2 analysis
      - Compare before/after metrics
      - Ensure no regression
      - Confirm issue resolution

OUTPUT: Enhanced plan with change log and improvement metrics
```

---

## PHASE 4: SYSTEMATIC IMPLEMENTATION

### Implementation Agent Framework:
```
CREATE IMPLEMENTATION AGENT via @agents.md configured for:

1. **PRE-IMPLEMENTATION CHECKLIST**
   ✓ All review items addressed
   ✓ Dependencies validated
   ✓ Environment configured
   ✓ Rollback plan established
   ✓ Monitoring setup complete

2. **EXECUTION PROTOCOL**

   a) **Environment & API Keys Setup**
      - For each external API/service required:
        1. Consult `docs/getting-started/api-keys-guide.md` for setup instructions
        2. Add getter function to `shared/config/env.ts` with validation
        3. Update `docs/getting-started/environment-setup.md` with:
           - Copy exact setup steps from `api-keys-guide.md` for that API
           - Include where to get the key
           - Show example `.env` configuration
           - Add troubleshooting tips
        4. Add variable to `.env` file
      - Follow this pattern for EVERY external dependency
      - Never use `process.env.XXX` directly - always use getter functions

   b) **Component Generation**
      - Follow modular architecture
      - Implement error boundaries
      - Add comprehensive logging
      - Include inline documentation
      - Apply defensive programming
   
   c) **Progressive Implementation**
      - Start with core functionality
      - Layer additional features
      - Implement in testable chunks
      - Validate at each milestone
      - Maintain backwards compatibility
   
   d) **Quality Assurance Integration**
      - Unit test generation
      - Integration test scenarios
      - Performance benchmarking
      - Security scanning
      - Documentation generation

3. **DELIVERY SPECIFICATION**
   - Production-ready code
   - Comprehensive documentation
   - Deployment instructions
   - Configuration templates
   - Monitoring dashboards

4. **POST-IMPLEMENTATION**
   - Generate implementation report
   - Document lessons learned
   - Create maintenance guide
   - Establish monitoring alerts
   - Schedule review cycles
```

---

## CRITICAL INSTRUCTIONS FOR LLM

### ⚠️ MANDATORY REQUIREMENTS:

1. **EVERY request MUST trigger agent creation via @agents.md**
   - No exceptions to this rule
   - Each phase requires its specialized agent
   - Agents must be properly configured before proceeding

2. **WORKFLOW INTEGRITY**
   - Never skip phases
   - Always complete previous phase before advancing
   - Maintain phase isolation (no cross-phase contamination)
   - Document inter-phase transitions

3. **TRACEABILITY AND AUDITABILITY**
   - Log all decisions with rationale
   - Maintain change history
   - Create rollback points
   - Enable process reconstruction

4. **FAILURE HANDLING**
   - Implement graceful degradation
   - Define fallback strategies
   - Create recovery procedures
   - Log failure patterns for learning

---

## MASTRA AI WORKFLOW INTEGRATION NOTE

### 📝 Implementation Consideration:
**This workflow architecture is designed for future integration with Mastra AI workflow automation.**

Key Mastra compatibility features included:
- Modular phase design for workflow nodes
- Clear input/output specifications
- Event-driven triggers between phases
- Standardized data formats for inter-node communication
- Webhook-ready checkpoints
- API-first design principles

**Current Status:** Architecture and prompt design only - no Mastra implementation included.

When ready to implement in Mastra:
1. Each phase becomes a workflow node
2. Review scores trigger conditional branching
3. Agents integrate as workflow executors
4. Monitoring dashboard connects to workflow metrics
5. Automated triggers based on completion criteria

---

## USAGE EXAMPLE

### Example 1: GitHub-Telegram PR Notifier Agent

```
User Request: "Build a GitHub-Telegram PR notification agent"

LLM Response Flow:

1. "Creating Planning Agent via @agents.md..."

2. "Analyzing requirements... Identified external dependencies:
   - GitHub API (for PR data)
   - Telegram Bot API (for notifications)

   Consulting docs/getting-started/api-keys-guide.md..."

3. "Plan generated with API dependencies:
   {
     "apiDependencies": [
       {
         "service": "GitHub",
         "keys": ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"],
         "setupGuide": "docs/getting-started/api-keys-guide.md#github"
       },
       {
         "service": "Telegram",
         "keys": ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],
         "setupGuide": "docs/getting-started/api-keys-guide.md#telegram"
       }
     ]
   }"

4. "Creating Review Agent... Score: 75/100. Missing env variable documentation."

5. "Applying refinements:
   - Adding getter functions to shared/config/env.ts
   - Updating docs/getting-started/environment-setup.md with:
     * GitHub setup instructions (copied from api-keys-guide.md)
     * Telegram setup instructions (copied from api-keys-guide.md)
   Enhanced score: 92/100"

6. "Creating Implementation Agent..."

7. "Implementing:
   ✓ Added getTelegramBotToken() to shared/config/env.ts
   ✓ Added getGitHubToken() to shared/config/env.ts
   ✓ Updated environment-setup.md with Telegram section
   ✓ Updated environment-setup.md with GitHub section
   ✓ Created telegram-service.ts using getter functions
   ✓ Created github-service.ts using getter functions"
```

### Example 2: Simple Data Pipeline (No External APIs)

```
User Request: "Build a data processing pipeline"

LLM Response Flow:
1. "Creating specialized Planning Agent via @agents.md..."
2. "No external APIs required - skipping env setup steps"
3. "Generating implementation plan..."
4. "Review complete. Score: 88/100"
5. "Creating Implementation Agent..."
6. "Executing systematic implementation..."
```

---

## PERFORMANCE METRICS

Track these KPIs for workflow optimization:
- Phase completion times
- Review score improvements
- Implementation success rates
- Defect escape rates
- Agent utilization efficiency
- Rework percentages
- Documentation coverage

---

## VERSION: 1.0.0
## LAST UPDATED: 2025
## STATUS: Ready for LLM Integration

