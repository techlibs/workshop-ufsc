# Weather Workflow Refactoring - Using Tools in Steps

## Problem
The `fetchWeather` step in the workflow was duplicating logic from `weatherTool`:
- Both performed geocoding lookups
- Both had the same `getWeatherCondition` function
- Similar API calls with slightly different parameters

## Solution
Created a `forecastTool` and used it inside the workflow step.

### Changes Made:

1. **Created `forecast-tool.ts`**
   - Dedicated tool for getting forecast data (min/max temps, precipitation)
   - Returns the exact schema needed by the workflow
   - Handles all geocoding and weather API calls

2. **Refactored `weather-workflow.ts`**
   - Removed all duplicate code (geocoding, API calls, weather condition mapping)
   - Now uses `forecastTool.execute()` to get weather data
   - Simplified from ~200 lines to ~50 lines in the execute function
   - Kept all logging and error handling

3. **Updated `weather-agent.ts`**
   - Added `forecastTool` to available tools
   - Updated instructions to clarify when to use each tool:
     - `weatherTool`: Current conditions (temp, humidity, wind)
     - `forecastTool`: Forecast data (min/max, precipitation)
     - `weatherWorkflow`: Activity planning

## Benefits

1. **No Code Duplication**: Single source of truth for weather fetching logic
2. **Cleaner Architecture**: Each tool has a specific purpose
3. **Easier Maintenance**: Update weather logic in one place
4. **Better Testing**: Can test tools independently
5. **Reusability**: Tools can be used by agents or workflows

## Code Comparison

### Before (Duplicate Logic):
```typescript
// In workflow step
const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputData.city)}&count=1`;
const geocodingResponse = await fetch(geocodingUrl);
// ... 150+ lines of geocoding and weather fetching

// In weather tool
const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
const geocodingResponse = await fetch(geocodingUrl);
// ... similar logic
```

### After (Using Tool):
```typescript
// In workflow step
const forecast = await forecastTool.execute({
  context: { location: inputData.city },
  mastra,
});
```

## Tool Separation

Now we have clear separation:
- **weatherTool**: Current weather conditions
- **forecastTool**: Forecast with min/max temps and precipitation
- **weatherWorkflow**: Combines forecast + AI for activity planning

The workflow step is now much simpler and focuses on orchestration rather than implementation details.
