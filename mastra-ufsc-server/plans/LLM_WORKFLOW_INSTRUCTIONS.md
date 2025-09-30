# LLM Workflow Instructions - Quick Reference Guide

## 🎯 Core Principle
**EVERY implementation request MUST follow the 4-phase workflow with mandatory agent creation at each phase.**

---

## 📋 Phase-by-Phase Instructions

### PHASE 1: Planning
```
WHEN: User requests any implementation
ACTION: 
1. Create Planning Agent using @agents.md
2. Generate comprehensive plan with:
   - Architecture design
   - Task breakdown
   - Resource requirements
   - Success metrics
OUTPUT: Structured plan in JSON format
SAVE TO: plans/[feature-name]_plan.json
```

### PHASE 2: Review
```
WHEN: Plan is complete
ACTION:
1. Create Review Agent using @agents.md
2. Evaluate plan against 5 criteria:
   - Technical Feasibility (30%)
   - Implementation Efficiency (25%)
   - Resource Optimization (20%)
   - Risk Assessment (15%)
   - Compliance & Standards (10%)
OUTPUT: Scored report with recommendations
SAVE TO: plans/[feature-name]_review.json
```

### PHASE 3: Refinement
```
WHEN: Review score < 80 OR critical issues found
ACTION:
1. Create Refinement Agent using @agents.md
2. Apply improvements by priority
3. Re-evaluate changes
4. Document modifications
OUTPUT: Enhanced plan with change log
SAVE TO: plans/[feature-name]_refined.json
```

### PHASE 4: Implementation
```
WHEN: Plan approved (score >= 80)
ACTION:
1. Create Implementation Agent using @agents.md
2. Follow pre-implementation checklist
3. Generate code progressively
4. Include tests and documentation
OUTPUT: Production-ready implementation
```

---

## 🚨 Critical Rules

1. **NO SHORTCUTS** - All 4 phases are mandatory
2. **AGENT FIRST** - Always create agent before phase execution
3. **DOCUMENT EVERYTHING** - Every decision needs rationale
4. **QUALITY GATES** - Score >= 80 to proceed to implementation

---

## 💡 Example Interaction Pattern

```typescript
// User: "Create a user authentication system"

// LLM Response:
// Step 1: Creating Planning Agent...
const planningAgent = new Agent({
  name: "Auth System Planning Agent",
  instructions: "You are specialized in designing authentication architectures...",
  // ... (using @agents.md pattern)
});

// Step 2: Generating plan...
const authPlan = await planningAgent.generatePlan({
  feature: "user-authentication",
  requirements: [...],
  constraints: [...]
});

// Step 3: Saving plan...
await savePlan("plans/user-auth_plan.json", authPlan);

// Continue with Phase 2...
```

---

## 📂 File Structure Convention

```
plans/
├── [feature-name]_plan.json         # Phase 1 output
├── [feature-name]_review.json       # Phase 2 output
├── [feature-name]_refined.json      # Phase 3 output (if needed)
└── [feature-name]_implementation.md # Phase 4 documentation
```

---

## 🔄 Mastra Workflow Integration (Future)

**Note:** This workflow is designed for future Mastra automation:
- Each phase = Workflow node
- Agents = Node executors
- Review scores = Branching conditions
- Plans = Workflow state

**Current Status:** Manual execution with LLM guidance

---

## ✅ Quick Checklist for LLM

Before responding to any implementation request:
- [ ] Have I identified this as an implementation request?
- [ ] Am I starting with Phase 1 (Planning)?
- [ ] Will I create a Planning Agent first?
- [ ] Do I have a clear output location for the plan?
- [ ] Am I following the 4-phase structure?

---

## 📊 Success Metrics

- Planning completeness: All 4 sections present
- Review thoroughness: All 5 criteria evaluated
- Refinement effectiveness: Score improvement >= 15 points
- Implementation quality: 0 critical bugs, >80% test coverage

---

**Remember:** This workflow ensures systematic, high-quality implementations with full traceability.
