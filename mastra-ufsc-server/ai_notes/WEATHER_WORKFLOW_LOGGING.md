# Weather Workflow Enhanced Logging

## Overview
Added comprehensive logging to the weather workflow to help debug issues where the workflow was getting stuck without response.

## Changes Made

### 1. **Step-Level Logging**
- Added logger access via `mastra?.getLogger()` in both steps
- Added `runId` parameter to track specific workflow runs
- Added start/completion timing for performance monitoring

### 2. **fetchWeather Step Enhancements**

#### Entry/Exit Logging
- Logs when the step starts with the input city
- Logs successful completion with total duration

#### API Call Logging
- **Geocoding API**: 
  - Logs URL and city before the call
  - Logs response status and duration
  - Logs error details if the call fails
  - Logs location details when found

- **Weather API**:
  - Logs URL and coordinates before the call
  - Logs response status and duration
  - Logs error details if the call fails
  - Logs weather data summary when received

#### Timeout Handling
- Added 10-second timeout for both API calls
- Uses AbortController to cancel requests
- Specific error message for timeout scenarios

#### Error Context
- Enhanced error messages with context (city, location, status codes)
- Stack traces for debugging
- Response body logging for API errors

### 3. **planActivities Step Enhancements**

#### Agent Logging
- Logs when retrieving the weather agent
- Logs before calling the AI agent with prompt length
- Logs agent response with duration and response length

#### Timeout Handling
- Added 30-second timeout for AI agent generation
- Uses Promise.race to implement timeout
- Clear error message if agent times out

#### Error Handling
- Comprehensive error logging with location context
- Stack traces for debugging
- Total duration tracking even on errors

### 4. **Workflow-Level Enhancements**

#### Retry Configuration
```typescript
retryConfig: {
  attempts: 3,
  delay: 2000,
}
```
- Automatically retries failed steps up to 3 times
- 2-second delay between retries

## Log Levels Used

- **info**: Major workflow events (start, completion, API calls)
- **debug**: Detailed data (API responses, data points)
- **warn**: Non-critical issues (location not found)
- **error**: Failures with full context

## Performance Metrics

Each step and API call now logs duration:
- Individual API call durations
- Step execution durations
- Total workflow duration

## Testing

Created `test-weather-workflow-logging.ts` to verify:
- Successful workflow execution with valid city
- Error handling with invalid city
- Event watching for real-time monitoring
- Performance timing

## Debugging Tips

1. **Check logs for timeout errors**: Look for "timed out" messages
2. **Monitor API response times**: Check duration logs to identify slow APIs
3. **Verify agent availability**: Check "Weather agent retrieved" log
4. **Track workflow progress**: Use runId to filter logs for specific runs
5. **Check retry attempts**: Workflow will retry up to 3 times on failure

## Example Log Output

```
[fetchWeather] Starting weather fetch { city: 'Santa Catarina', runId: 'run_123', step: 'fetch-weather' }
[fetchWeather] Calling geocoding API { url: '...', city: 'Santa Catarina', runId: 'run_123' }
[fetchWeather] Geocoding API response received { status: 200, duration: '523ms', runId: 'run_123' }
[fetchWeather] Location found { name: 'Santa Catarina', latitude: -27.5, longitude: -48.5, runId: 'run_123' }
[fetchWeather] Weather fetch completed successfully { location: 'Santa Catarina', totalDuration: '1243ms', runId: 'run_123' }
[planActivities] Starting activity planning { location: 'Santa Catarina', runId: 'run_123' }
[planActivities] AI agent response received { responseLength: 850, duration: '2341ms', runId: 'run_123' }
[planActivities] Activity planning completed successfully { totalDuration: '2456ms', runId: 'run_123' }
```
