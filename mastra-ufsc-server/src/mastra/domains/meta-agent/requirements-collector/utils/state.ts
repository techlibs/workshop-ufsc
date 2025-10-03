import { RequirementsState, defaultRequirementTemplates } from "../types";

export function initializeState(originalQuery: string): RequirementsState {
  return {
    originalQuery,
    requirements: [...defaultRequirementTemplates],
    pending: defaultRequirementTemplates.map(r => r.id),
    turns: 0,
    contextDocIds: [],
    complete: false,
  };
}

export function updateRequirement(state: RequirementsState, id: string, patch: Partial<RequirementsState["requirements"][number]>): RequirementsState {
  const idx = state.requirements.findIndex(r => r.id === id);
  if (idx === -1) return state;
  const updated = { ...state.requirements[idx], ...patch };
  const requirements = [...state.requirements];
  requirements[idx] = updated;
  const pending = requirements.filter(r => r.required && (r.value === undefined || r.value === null || r.value === ""))
    .map(r => r.id);
  return { ...state, requirements, pending, complete: pending.length === 0 };
}

export function incrementTurn(state: RequirementsState): RequirementsState {
  return { ...state, turns: state.turns + 1 };
}
