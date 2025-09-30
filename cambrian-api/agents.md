# Cambrian API Documentation

This is a comprehensive API for blockchain and DeFi data, providing real-time and historical information across multiple chains including Solana, Base, and other EVM networks.

OpenAPI Schema: https://opabinia.cambrian.network/openapi.json

## Documentation Access

**For LLMs**: All documentation links below end with `/llms.txt` - this provides machine-readable markdown format.

**For Humans**: Remove the `/llms.txt` suffix from any link below to view the interactive documentation with a user-friendly interface and ability to test endpoints without providing an API key, which is otherwise required for making requests.

**Example**:
- LLM format: https://docs.cambrian.org/api/v1/solana/pool-transactions/llms.txt
- Human format: https://docs.cambrian.org/api/v1/solana/pool-transactions

## API Key Required

**IMPORTANT**: You need a Cambrian API key to use this API. Please obtain your API key from the Cambrian team before making requests to any endpoints. Signup for an API key here: https://form.typeform.com/to/FlAoEzva?typeform-source=www.docs.cambrian.org/llms.txt

## Available Endpoints

### Solana
#### Meteora dlmm
##### Pool
- GET /api/v1/solana/meteora-dlmm/pool - This endpoint returns basic pool information for a meteora pool.
  - Docs: https://docs.cambrian.org/api/v1/solana/meteora-dlmm/pool/llms.txt

##### Pool multi
- GET /api/v1/solana/meteora-dlmm/pool-multi - Get comprehensive overview metrics for multiple pools/pairs simultaneously within the same DEX. Returns pool details including price, volume, trades, and token information.
  - Docs: https://docs.cambrian.org/api/v1/solana/meteora-dlmm/pool-multi/llms.txt

##### Pools
- GET /api/v1/solana/meteora-dlmm/pools - This endpoint lists meteora pools
  - Docs: https://docs.cambrian.org/api/v1/solana/meteora-dlmm/pools/llms.txt


#### Raydium clmm
##### Pool
- GET /api/v1/solana/raydium-clmm/pool - This endpoint returns pool info for a specific raydium clmm pool. Among metrics returned are, tvl, apr24h, volume24h
  - Docs: https://docs.cambrian.org/api/v1/solana/raydium-clmm/pool/llms.txt

##### Pool multi
- GET /api/v1/solana/raydium-clmm/pool-multi - Get comprehensive overview metrics for multiple pools/pairs simultaneously within the same DEX. Returns pool details including price, volume, trades, and token information.
  - Docs: https://docs.cambrian.org/api/v1/solana/raydium-clmm/pool-multi/llms.txt

##### Pools
- GET /api/v1/solana/raydium-clmm/pools - This endpoint lists basic pool information for Raydium CLMM
  - Docs: https://docs.cambrian.org/api/v1/solana/raydium-clmm/pools/llms.txt


#### Tokens
- GET /api/v1/solana/tokens - Returns a paginated list of known tokens for the Solana chain.
  - Docs: https://docs.cambrian.org/api/v1/solana/tokens/llms.txt
##### Holder distribution over time
- GET /api/v1/solana/tokens/holder-distribution-over-time - This endpoint returns the distribution of token holders over a certain block range, at a certain interval, grouped by USD value tiers.
  - Docs: https://docs.cambrian.org/api/v1/solana/tokens/holder-distribution-over-time/llms.txt

##### Holders
- GET /api/v1/solana/tokens/holders - Returns a list of accounts currently holding a specific Solana token (identified by its program ID/mint address), sorted by their current balance (descending). This endpoint leverages pre-aggregated data for performance.
  - Docs: https://docs.cambrian.org/api/v1/solana/tokens/holders/llms.txt

##### Holders over time
- GET /api/v1/solana/tokens/holders-over-time - Returns a list of accounts holding a specific token (identified by its program ID/mint address) on Solana, providing snapshots at specified block intervals within a given range. First block gives full list of holders while subsequent blocks only provide holders that had balance changes in that interval. Results are sorted by block number (ascending) and then balance (descending) within each block.
  - Docs: https://docs.cambrian.org/api/v1/solana/tokens/holders-over-time/llms.txt

##### Security
- GET /api/v1/solana/tokens/security - Provides comprehensive security analysis for a token on Solana, including ownership concentration, holder distribution, and transaction metrics.
  - Docs: https://docs.cambrian.org/api/v1/solana/tokens/security/llms.txt


#### Orca
##### Pools
- GET /api/v1/solana/orca/pools - Retrieves a list of all Orca pools registered in the backend database (orca_pool_registry_target). It provides essential static information about each pool.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pools/llms.txt
###### Fee metrics
- GET /api/v1/solana/orca/pools/fee-metrics - Retrieves core metrics like fees (total, token0, token1, USD), volume (token0, token1, USD), Total Value Locked (TVL) in USD, and calculated Fee APR for a specific Orca Whirlpool over a given timeframe.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pools/fee-metrics/llms.txt

###### Fee ranges
- GET /api/v1/solana/orca/pools/fee-ranges - Retrieves fee APR and swap utilization data categorized by price ranges relative to the current price for a specific Orca Whirlpool.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pools/fee-ranges/llms.txt

###### Historical data
- GET /api/v1/solana/orca/pools/historical-data - Retrieves historical daily fee and volume data (in USD) for a specific Orca Whirlpool over a specified timeframe.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pools/historical-data/llms.txt

###### Liquidity map
- GET /api/v1/solana/orca/pools/liquidity-map - Retrieves the distribution of net liquidity across price ticks for a specific Orca Whirlpool. Returns liquidity values at representative tick intervals based on the specified resolution. Pool Must be created after 2025-02-27
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pools/liquidity-map/llms.txt


##### Pool
- GET /api/v1/solana/orca/pool - Retrieves detailed metrics and information for a specific Solana pool (identified by its program ID/address) using the pre-calculated orca_pool_details_view.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pool/llms.txt

##### Pool multi
- GET /api/v1/solana/orca/pool-multi - Get comprehensive overview metrics for multiple pools/pairs simultaneously within the same DEX. Returns pool details including price, volume, trades, and token information.
  - Docs: https://docs.cambrian.org/api/v1/solana/orca/pool-multi/llms.txt


#### Ohlcv
##### Base quote
- GET /api/v1/solana/ohlcv/base-quote - Retrieve granular OHLCV data with separate base and quote token volumes for detailed trading analysis between any two SPL tokens. Provides the most detailed view of trading relationships with individual token flow tracking for advanced analytics.
  - Docs: https://docs.cambrian.org/api/v1/solana/ohlcv/base-quote/llms.txt

##### Pool
- GET /api/v1/solana/ohlcv/pool - Retrieve OHLCV data for individual pool contracts enabling pair-specific price analysis and liquidity venue performance tracking. Essential for liquidity providers analyzing their specific pool performance and traders focusing on particular trading venues.
  - Docs: https://docs.cambrian.org/api/v1/solana/ohlcv/pool/llms.txt

##### Token
- GET /api/v1/solana/ohlcv/token - Retrieve Open, High, Low, Close, and Volume data for any SPL token.
  - Docs: https://docs.cambrian.org/api/v1/solana/ohlcv/token/llms.txt


#### Price volume
##### Multi
- GET /api/v1/solana/price-volume/multi - Retrieve current USD price, timeframe volume, and percentage changes for any SPL token. Combines price and volume data in a single request to reduce API calls and improve application performance. Data aggregated across major Solana DEXs.
  - Docs: https://docs.cambrian.org/api/v1/solana/price-volume/multi/llms.txt

##### Single
- GET /api/v1/solana/price-volume/single - Retrieve current USD price, timeframe volume, and percentage changes for any SPL token. Combines price and volume data in a single request to reduce API calls and improve application performance. Data aggregated across major Solana DEXs.
  - Docs: https://docs.cambrian.org/api/v1/solana/price-volume/single/llms.txt


#### Holder token balances
- GET /api/v1/solana/holder-token-balances - This endpoint returns token balances in usd for a specific user wallet, sorted by balance descending
  - Docs: https://docs.cambrian.org/api/v1/solana/holder-token-balances/llms.txt

#### Latest block
- GET /api/v1/solana/latest-block - This endpoint returns latest block and block time
  - Docs: https://docs.cambrian.org/api/v1/solana/latest-block/llms.txt

#### Pool transactions
- GET /api/v1/solana/pool-transactions - Retrieve a paginated list of trades/transactions for a specified Solana pool address including swaps, add liquidity, and remove liquidity events
  - Docs: https://docs.cambrian.org/api/v1/solana/pool-transactions/llms.txt

#### Pool transactions time bounded
- GET /api/v1/solana/pool-transactions-time-bounded - Get detailed transaction data for any SPL token across major Solana DEXs with precise Unix timestamp filtering for historical analysis and event-driven research.
  - Docs: https://docs.cambrian.org/api/v1/solana/pool-transactions-time-bounded/llms.txt

#### Price current
- GET /api/v1/solana/price-current - Retrieves the latest available USD price for a given Solana token program address
  - Docs: https://docs.cambrian.org/api/v1/solana/price-current/llms.txt

#### Price hour
- GET /api/v1/solana/price-hour - Aggregated USD price of a Solana token by program address, grouped by the specified interval (e.g., 1H, 1D, 1W, etc). Returns the average price for each interval.
  - Docs: https://docs.cambrian.org/api/v1/solana/price-hour/llms.txt

#### Price multi
- GET /api/v1/solana/price-multi - Retrieves the latest available USD prices for multiple Solana token program addresses (comma-separated)
  - Docs: https://docs.cambrian.org/api/v1/solana/price-multi/llms.txt

#### Price unix
- GET /api/v1/solana/price-unix - Retrieve historical price data for a specified Solana token at the nearest hour to a specific Unix timestamp. Returns the price, actual update time, and 24-hour price change. Essential for time-specific price analysis, backtesting, and historical data queries.
  - Docs: https://docs.cambrian.org/api/v1/solana/price-unix/llms.txt

#### Token details
- GET /api/v1/solana/token-details - Retrieves comprehensive details about a Solana token, including price history, trade statistics, holder information, and other key metrics
  - Docs: https://docs.cambrian.org/api/v1/solana/token-details/llms.txt

#### Token details multi
- GET /api/v1/solana/token-details-multi - Retrieve comprehensive details for multiple Solana tokens simultaneously. Returns the same data structure as the single token_details endpoint but for multiple tokens in a single API call. Maximum 50 tokens per request.
  - Docs: https://docs.cambrian.org/api/v1/solana/token-details-multi/llms.txt

#### Token mint burn transactions
- GET /api/v1/solana/token-mint-burn-transactions - Returns paginated list of mint and burn transactions for a specified Solana token, providing complete supply change audit trail with transaction details, amounts, and timing information. Essential for tracking token supply dynamics and compliance monitoring.
  - Docs: https://docs.cambrian.org/api/v1/solana/token-mint-burn-transactions/llms.txt

#### Token pool search
- GET /api/v1/solana/token-pool-search - Find pools containing a specific token and retrieve comprehensive trading statistics including 24h volume, trade counts, and buy/sell ratios. Essential for token analysis, liquidity discovery, and identifying the most active trading venues for any token.
  - Docs: https://docs.cambrian.org/api/v1/solana/token-pool-search/llms.txt

#### Token transactions
- GET /api/v1/solana/token-transactions - Retrieve a paginated list of trades/transactions for a specified Solana token address across all DEXes
  - Docs: https://docs.cambrian.org/api/v1/solana/token-transactions/llms.txt

#### Token transactions time bounded
- GET /api/v1/solana/token-transactions-time-bounded - Get detailed transaction data for any SPL token with precise Unix timestamp filtering for historical analysis and event-driven research.
  - Docs: https://docs.cambrian.org/api/v1/solana/token-transactions-time-bounded/llms.txt

#### Trade statistics
- GET /api/v1/solana/trade-statistics - Get instant trade analytics and performance metrics for any SPL tokens. View buy/sell volume breakdowns, trade counts, and USD values across customizable timeframes (1h to 30d). Perfect for portfolio tracking, performance dashboards, and quick market analysis. Query single tokens or multiple tokens at once using comma-separated addresses. Includes buy-to-sell ratios for comprehensive market insights.
  - Docs: https://docs.cambrian.org/api/v1/solana/trade-statistics/llms.txt

#### Traders
##### Leaderboard
- GET /api/v1/solana/traders/leaderboard - Leaderboard of the top traders by trade count, buy/sell/total volume for any SPL token across major Solana DEXs, for a specified recent interval. Supports front-end sorting of columns. Available columns for sorting are: total_volume, buy_volume, sell_volume, trade_count.
  - Docs: https://docs.cambrian.org/api/v1/solana/traders/leaderboard/llms.txt


#### Trending tokens
- GET /api/v1/solana/trending-tokens - Retrieves a list of trending Solana tokens, ordered by price change in 24hs, trade volume in 24hs or current price.
  - Docs: https://docs.cambrian.org/api/v1/solana/trending-tokens/llms.txt

#### Wallet balance history
- GET /api/v1/solana/wallet-balance-history - Returns paginated list of balance changes for a specified wallet address, providing complete audit trail of portfolio changes with transaction details, pre/post balances, and timing information. Essential for portfolio tracking and compliance monitoring.
  - Docs: https://docs.cambrian.org/api/v1/solana/wallet-balance-history/llms.txt


### Deep42
#### Agents
##### Cambrian
- GET /api/v1/deep42/agents/cambrian - Maps user questions to appropriate Cambrian API endpoints or provides guidance from llms.txt documentation. Specializes in Solana and Base blockchain data including prices, tokens, pools, and trading analytics.
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/cambrian/llms.txt

##### Deep research
- GET /api/v1/deep42/agents/deep-research - Generate twitter threads and comprehensive research reports
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/deep-research/llms.txt

##### Github
- GET /api/v1/deep42/agents/github - Advanced GitHub intelligence agent with natural language processing and intelligent code analysis. Supports multiple execution modes for optimal performance
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/github/llms.txt

##### Research
- GET /api/v1/deep42/agents/research - Advanced 7-stage research pipeline orchestrating web search, alpha intelligence, social signals, and GitHub data for comprehensive research workflows. Based on TweetGeneration pipeline patterns with multi-agent orchestration.
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/research/llms.txt

##### Social data
- GET /api/v1/deep42/agents/social-data - Cryptocurrency social media intelligence and alpha signal detection. Analyzes social sentiment, tracks influential accounts, identifies emerging opportunities, and evaluates viral claims in the cryptocurrency space. Provides alpha signal scoring, token social performance analysis, influencer credibility assessment, and trending signal detection.
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/social-data/llms.txt

##### Twitter user alpha metrics
- GET /api/v1/deep42/agents/twitter-user-alpha-metrics - Twitter user alpha metrics analysis with structured data output. Returns individual fields for each metric instead of formatted text.
  - Docs: https://docs.cambrian.org/api/v1/deep42/agents/twitter-user-alpha-metrics/llms.txt


#### Social data
##### Alpha tweet detection
- GET /api/v1/deep42/social-data/alpha-tweet-detection - Fast alpha tweet detection using either high-quality curated data (6-factor scoring) or broader coverage (4-factor estimated scoring) with 0-100 scale scores
  - Docs: https://docs.cambrian.org/api/v1/deep42/social-data/alpha-tweet-detection/llms.txt

##### Influencer credibility
- GET /api/v1/deep42/social-data/influencer-credibility - Returns top crypto influencers ranked by track record, accuracy, and influence metrics
  - Docs: https://docs.cambrian.org/api/v1/deep42/social-data/influencer-credibility/llms.txt

##### Sentiment shifts
- GET /api/v1/deep42/social-data/sentiment-shifts - Identifies tokens with significant sentiment changes that could signal market movements
  - Docs: https://docs.cambrian.org/api/v1/deep42/social-data/sentiment-shifts/llms.txt

##### Token analysis
- GET /api/v1/deep42/social-data/token-analysis - Comprehensive social intelligence report for a single cryptocurrency token
  - Docs: https://docs.cambrian.org/api/v1/deep42/social-data/token-analysis/llms.txt

##### Trending momentum
- GET /api/v1/deep42/social-data/trending-momentum - Identifies tokens with rapidly increasing social signals and momentum indicators
  - Docs: https://docs.cambrian.org/api/v1/deep42/social-data/trending-momentum/llms.txt


#### Discovery
##### Project metadata
- GET /api/v1/deep42/discovery/project-metadata - Provides complete metadata for cryptocurrency projects including confidence scores, validation metrics, social intelligence, technology assessment, trending metrics, discovery timeline, and risk assessment. Consolidates all available project intelligence into a single comprehensive response.
  - Docs: https://docs.cambrian.org/api/v1/deep42/discovery/project-metadata/llms.txt

##### Search projects
- GET /api/v1/deep42/discovery/search-projects - Search discovered cryptocurrency projects by various criteria including technology stack, funding stage, social activity level, market category, and discovery confidence. Supports complex filtering and ranking options.
  - Docs: https://docs.cambrian.org/api/v1/deep42/discovery/search-projects/llms.txt

##### Social associations
- GET /api/v1/deep42/discovery/social-associations - Analyzes social media connections, influencer networks, and community associations for discovered cryptocurrency projects. Identifies key opinion leaders, community clusters, and viral propagation patterns.
  - Docs: https://docs.cambrian.org/api/v1/deep42/discovery/social-associations/llms.txt


#### Github
##### Repository market data
- GET /api/v1/deep42/github/repository-market-data - Provides combined market data and GitHub metrics for cryptocurrency projects or individual repositories. Can query by token symbol OR GitHub repository URL. Aggregates hourly or daily data showing token price, market cap, volume alongside GitHub repository stars and development activity.
  - Docs: https://docs.cambrian.org/api/v1/deep42/github/repository-market-data/llms.txt


#### Intelligence
- GET /api/v1/deep42/intelligence - Multi-source intelligence analysis combining social data, alpha signals, discovery intelligence, knowledge graph insights, developer analytics, and market data with cross-validation and confidence scoring. Consolidates capabilities from multiple agent endpoints into a single powerful intelligence engine.
  - Docs: https://docs.cambrian.org/api/v1/deep42/intelligence/llms.txt

#### Market intelligence
##### Developer activity
- GET /api/v1/deep42/market-intelligence/developer-activity - Direct data service providing real-time developer activity metrics from Neo4j knowledge graph, including commits, contributions, and development statistics collected by GitHub Actions
  - Docs: https://docs.cambrian.org/api/v1/deep42/market-intelligence/developer-activity/llms.txt


#### Tools
##### Alpha tweet detection
- GET /api/v1/deep42/tools/alpha-tweet-detection - Advanced alpha tweet detection and scoring system based on Dify workflows
  - Docs: https://docs.cambrian.org/api/v1/deep42/tools/alpha-tweet-detection/llms.txt


#### Workflows
##### Content generation pipeline
- GET /api/v1/deep42/workflows/content-generation-pipeline - Execute a comprehensive 7-stage research and content generation workflow for cryptocurrency and DeFi topics. Includes web research, GitHub analysis, governance forums, and competitive intelligence.
  - Docs: https://docs.cambrian.org/api/v1/deep42/workflows/content-generation-pipeline/llms.txt



### Evm
#### Aero
##### V2
###### Fee metrics
- GET /api/v1/evm/aero/v2/fee-metrics - Shows daily historical data to understand the fees over time on a pool.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/fee-metrics/llms.txt

###### Pool
- GET /api/v1/evm/aero/v2/pool - Get information for a specific Aerodorme V2 pool address
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/pool/llms.txt

###### Pool volume
- GET /api/v1/evm/aero/v2/pool-volume - Helpful for aggregate statistics over a particular timeframe, with hourly data to understand distribution of recent activity.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/pool-volume/llms.txt

###### Pools
- GET /api/v1/evm/aero/v2/pools - This endpoint returns a paginated list of liquidity pools with summary metrics.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/pools/llms.txt

###### Provider positions
- GET /api/v1/evm/aero/v2/provider-positions - Shows details for the positions a user has active.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/provider-positions/llms.txt

###### Provider summary
- GET /api/v1/evm/aero/v2/provider-summary - Provides a comprehensive overview of a liquidity provider's activity on a specific DEX and chain. Includes current summary statistics, portfolio diversity analysis (top pools, token exposure, concentration), position size distribution, historical performance metrics (fees, APR, IL over various periods), and a breakdown of fees and APR per pool.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/provider-summary/llms.txt

###### Providers
- GET /api/v1/evm/aero/v2/providers - This endpoint returns a paginated list of liquidity providers with summary metrics about their positions and performance.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v2/providers/llms.txt


##### V3
###### Pool
- GET /api/v1/evm/aero/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/aero/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v3/pools/llms.txt


##### V3 pool
- GET /api/v1/evm/aero/v3-pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v3-pool/llms.txt

##### V3 pools
- GET /api/v1/evm/aero/v3-pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/aero/v3-pools/llms.txt


#### Alien
##### V3
###### Pool
- GET /api/v1/evm/alien/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/alien/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/alien/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/alien/v3/pools/llms.txt


##### V3 pool
- GET /api/v1/evm/alien/v3-pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/alien/v3-pool/llms.txt

##### V3 pools
- GET /api/v1/evm/alien/v3-pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/alien/v3-pools/llms.txt


#### Sushi
##### V3
###### Pool
- GET /api/v1/evm/sushi/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/sushi/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/sushi/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/sushi/v3/pools/llms.txt


##### V3 pool
- GET /api/v1/evm/sushi/v3-pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/sushi/v3-pool/llms.txt


#### Tvl
##### Status
- GET /api/v1/evm/tvl/status - Retuns the tokens hold by an address
  - Docs: https://docs.cambrian.org/api/v1/evm/tvl/status/llms.txt

##### Top
- GET /api/v1/evm/tvl/top - Returns top token holders for a given token address.
  - Docs: https://docs.cambrian.org/api/v1/evm/tvl/top/llms.txt

##### Top owners
- GET /api/v1/evm/tvl/top-owners - Returns top token holders for a given token address.
  - Docs: https://docs.cambrian.org/api/v1/evm/tvl/top-owners/llms.txt


#### Clones
##### V3
###### Pool
- GET /api/v1/evm/clones/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/clones/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/clones/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/clones/v3/pools/llms.txt



#### Pancake
##### V3
###### Pool
- GET /api/v1/evm/pancake/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/pancake/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/pancake/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/pancake/v3/pools/llms.txt



#### Uniswap
##### V3
###### Pool
- GET /api/v1/evm/uniswap/v3/pool - Returns current pool TVL(Total Value Locked), Swap Volume, Fees APR (Annual Percentage Rate), Price Tick Utilization, Number of Swaps and Unique users for recent time range (5 minutes, 1 hour, 1 day, 1 week, 1 month and 1 year).
  - Docs: https://docs.cambrian.org/api/v1/evm/uniswap/v3/pool/llms.txt

###### Pools
- GET /api/v1/evm/uniswap/v3/pools - Returns a list of all liquidity pools, including token pairs, fee tiers, and creation timestamps.
  - Docs: https://docs.cambrian.org/api/v1/evm/uniswap/v3/pools/llms.txt



#### Chains
- GET /api/v1/evm/chains - Returns information about supported EVM blockchain networks
  - Docs: https://docs.cambrian.org/api/v1/evm/chains/llms.txt

#### Dexes
- GET /api/v1/evm/dexes - List of DEXes on EVM compatible chains
  - Docs: https://docs.cambrian.org/api/v1/evm/dexes/llms.txt

#### Price current
- GET /api/v1/evm/price-current - Returns current price of a token calculated based on uniswap v3 and clones liquidity pools.
  - Docs: https://docs.cambrian.org/api/v1/evm/price-current/llms.txt

#### Price hour
- GET /api/v1/evm/price-hour - Returns historical hourly price data for a specified EVM token. Limitations: Maximum 1000 hours of historical data, timestamps are in UTC format. Use /evm/tokens endpoint to get list of valid token addresses.
  - Docs: https://docs.cambrian.org/api/v1/evm/price-hour/llms.txt

#### Tokens
- GET /api/v1/evm/tokens - Returns a list of all whitelisted tokens for the specified EVM chain, including their contract addresses, symbols, names, and decimal places.
  - Docs: https://docs.cambrian.org/api/v1/evm/tokens/llms.txt


### Perp risk engine
- GET /api/v1/perp-risk-engine - Calculates liquidation risk probability for leveraged cryptocurrency positions using Monte Carlo simulations with historical price data. Supports both long and short positions with configurable risk horizons (1h, 1d, 1w, 1mo). Lookback period and simulation parameters are automatically determined based on risk horizon. Returns detailed risk metrics including liquidation price, volatility analysis, and visualization data for the probability assessment.
  - Docs: https://docs.cambrian.org/api/v1/perp-risk-engine/llms.txt

## Key Resources
- Full API documentation: https://docs.cambrian.org
- OpenAPI specification: https://opabinia.cambrian.network/openapi.json

## Contact
For questions or support, visit: https://discord.com/channels/1375182661202481172/1376641098516271155