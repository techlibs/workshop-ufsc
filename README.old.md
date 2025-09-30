### Cambrian minimal CLI

Small TypeScript CLI to query Cambrian API (Solana).

### Requirements
- Node 18+
- pnpm
- Cambrian API key

### Setup
1) Create a `.env` file in the project root with:

```bash
CAMBRIAN_API_KEY=your-key-here
```

2) Install deps:

```bash
pnpm install
```

### Usage
- Latest block:

```bash
pnpm latest-block
```

- Current price for a token (SPL mint address):

```bash
pnpm price -- -a <SOLANA_TOKEN_MINT>
```

- Help:

```bash
pnpm cambrian help
```

Notes:
- Add `--raw` to print raw JSON.
- You can override the API base URL with `--base-url https://opabinia.cambrian.network`.


