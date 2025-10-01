# AI Workflow System - Implementation Notes

## Overview
This folder contains AI-generated notes and documentation for the 4-Step Implementation Workflow System.

## Key Documents

### In `/plans/` folder:
1. **AI_WORKFLOW_SYSTEM.md** - Complete workflow specification
2. **LLM_WORKFLOW_INSTRUCTIONS.md** - Quick reference guide for LLM
3. **MASTRA_WORKFLOW_CONCEPT.md** - Future Mastra integration design

## Important Reminders

### For Every Implementation Request:
1. ✅ Always start with Phase 1 (Planning)
2. ✅ Always create agents using @agents.md
3. ✅ Never skip phases
4. ✅ Document everything in this ai_notes folder

### File Organization Pattern:
```
ai_notes/
└── WORKFLOW_SYSTEM/
    └── [FEATURE_NAME]/
        ├── 01_PLANNING/
        │   ├── agent_definition.md
        │   ├── architecture.md
        │   └── plan.json
        ├── 02_REVIEW/
        │   ├── review_report.md
        │   └── scores.json
        ├── 03_REFINEMENT/
        │   ├── changes.md
        │   └── refined_plan.json
        └── 04_IMPLEMENTATION/
            ├── code_structure.md
            ├── test_plan.md
            └── deployment.md
```

## Quick Start

When you receive an implementation request:

1. Check if it requires the 4-step workflow
2. Create subfolder: `ai_notes/WORKFLOW_SYSTEM/[FEATURE_NAME]/`
3. Start Phase 1 with agent creation
4. Document each phase in its respective folder
5. Reference `/plans/LLM_WORKFLOW_INSTRUCTIONS.md` for guidance

## Workflow Status Tracking

| Phase | Status | Agent Created | Output Location |
|-------|---------|--------------|-----------------|
| Planning | ⏳ Pending | ❌ No | `01_PLANNING/` |
| Review | ⏳ Pending | ❌ No | `02_REVIEW/` |
| Refinement | ⏳ Pending | ❌ No | `03_REFINEMENT/` |
| Implementation | ⏳ Pending | ❌ No | `04_IMPLEMENTATION/` |

## Remember

- Each phase requires its own specialized agent
- Minimum score of 80 to proceed to implementation
- All decisions must include rationale
- This is a conceptual workflow - Mastra integration is future work

---
Created: 2024-12-20
Status: Active
Version: 1.0.0

