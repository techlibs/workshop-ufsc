# Tool Refactoring - Geocoding & City Nickname Support

## Problem Addressed

1. **Error**: "Location 'floripa' not found" - informal city names weren't recognized
2. **Code Duplication**: Both `weather-tool.ts` and `forecast-tool.ts` had identical geocoding logic
3. **Tool Confusion**: Unclear distinction between weather-tool and forecast-tool

## Solution

### 1. Created Shared Utilities

**`utils/city-mapper.ts`**
- Maps common city nicknames to official names
- Examples: floripa → Florianópolis, sampa → São Paulo
- Easily extensible for more nicknames

**`utils/geocoding.ts`**
- Shared geocoding function to avoid duplication
- Integrates city nickname mapping
- Better error messages with suggestions

### 2. Tool Distinctions Clarified

| Tool | Purpose | Returns |
|------|---------|---------|
| **weather-tool** | Current conditions | Temperature, feels like, humidity, wind |
| **forecast-tool** | Future predictions | Min/max temps, precipitation chance |

**NOT redundant** - they serve different use cases!

### 3. Refactored Both Tools

- Removed duplicate geocoding code
- Added nickname support to both tools
- Updated descriptions to clarify functionality
- Now both tools can handle "floripa" correctly

## Usage

Now you can use informal city names:

```typescript
// All of these work:
{ city: "floripa" }      // → Florianópolis
{ city: "Florianópolis" } // → Florianópolis
{ city: "sampa" }        // → São Paulo
```

## Files Changed

- ✅ Created: `src/mastra/utils/city-mapper.ts`
- ✅ Created: `src/mastra/utils/geocoding.ts`
- ✅ Modified: `src/mastra/tools/forecast-tool.ts`
- ✅ Modified: `src/mastra/tools/weather-tool.ts`

## Testing

Try running the workflow with:
```bash
pnpm test-weather-workflow-logging
```

With input: `{ city: "floripa" }`

It should now work correctly! 🎉
