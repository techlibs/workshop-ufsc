# Copilot Instructions for Cambrian API TypeScript Client

## Project Overview
- This is a modular TypeScript client for the Cambrian API, which provides blockchain and DeFi data for Solana, Base, and EVM-compatible networks.
- The client is designed for easy extension and type safety, with a clear separation between core client logic, examples, and utilities.
- All API endpoints and their documentation are listed in `agents.md` (read this for endpoint details and usage patterns).

## Key Files & Structure
- `src/client/cambrian-client.ts`: Core API client. Add new Cambrian endpoints here as methods.
- `src/client/types.ts`: TypeScript types for API responses and requests.
- `src/examples/solana/` and `src/examples/evm/`: Example scripts for Solana and EVM endpoints. Use these as templates for new scripts.
- `src/utils/env.ts`: Loads environment variables (API key, base URL).
- `.env`: Store your `CAMBRIAN_API_KEY` here. Optionally override `CAMBRIAN_BASE_URL`.
- `agents.md`: Full API endpoint documentation and usage notes.

## Developer Workflows
- **Install dependencies:** `pnpm install`
- **Run examples:** `pnpm tsx src/examples/{solana|evm}/*.ts`
- **Type checking:** `pnpm typecheck`
- **Watch mode:** `pnpm dev`
- **Add new endpoints:** Extend `cambrian-client.ts` and update types in `types.ts`.
- **API key:** Required for all requests. Set in `.env`.

## Project Conventions
- All API calls are wrapped in the client for consistency and type safety.
- Use async/await for all API interactions.
- Example scripts should be minimal, focusing on demonstrating endpoint usage.
- Prefer updating `agents.md` when adding new endpoints or changing API usage patterns.
- Use the OpenAPI schema (see `README.md` and `agents.md`) for reference when adding endpoints.

## Integration & Extensibility
- To add a new endpoint: 
  1. Add a method to `cambrian-client.ts`.
  2. Define/extend types in `types.ts`.
  3. Add an example script in `src/examples/`.
  4. Document in `agents.md`.
- All requests require an API key; handle missing/invalid keys gracefully.
- Use the utility in `env.ts` for environment variable access.

## References
- [Cambrian API Docs](https://docs.cambrian.org)
- [OpenAPI Schema](https://opabinia.cambrian.network/openapi.json)
- For endpoint details, always check `agents.md`.

---

For questions or unclear conventions, see `README.md` and `agents.md`, or ask for clarification in the Cambrian Discord.
