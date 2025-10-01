# Project Reorganization Plan

## Overview
This document tracks the reorganization of the Mastra UFSC Server project to improve structure, maintainability, and clarity.

## Goals
1. **Clean root directory** - Remove test files and redundant READMEs
2. **Domain-driven structure** - Group related code by feature/domain
3. **Organized testing** - Separate unit, integration, and e2e tests
4. **Consolidated documentation** - Single source of truth for docs

## Migration Phases

### Phase 1: Setup New Structure ✅
- Create new directory structure
- Create migration tracking

### Phase 2: Move Tests 🚧
- Move test files to `tests/` directory
- Update test imports

### Phase 3: Reorganize Domains 🚧
- Create domain folders
- Move agents, tools, and utils to domains
- Update imports

### Phase 4: Consolidate Documentation 🚧
- Merge READMEs into docs/
- Organize ai_notes
- Clean root directory

### Phase 5: Cleanup & Verification 🚧
- Remove old files
- Verify all imports work
- Run tests

## Progress Tracking

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| Phase 1 | ✅ Complete | 2024-12-20 | 2024-12-20 | Structure created |
| Phase 2 | 🚧 In Progress | 2024-12-20 | - | Moving tests |
| Phase 3 | ⏳ Pending | - | - | - |
| Phase 4 | ⏳ Pending | - | - | - |
| Phase 5 | ⏳ Pending | - | - | - |

## File Mapping
See `file-mapping.md` for detailed source → destination mapping.

