# 🔑 API Keys Guide - Top 100 Most Used APIs

Complete guide for obtaining API keys from the most popular services.

---

## 🤖 AI & LLM Providers

### OpenAI
**Purpose:** GPT models, ChatGPT, DALL-E, Whisper

1. Visit https://platform.openai.com/signup
2. Create account and verify email
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Add to `.env`: `OPENAI_API_KEY=sk-xxx`

**Pricing:** Pay-as-you-go, $5-$120/month depending on usage

---

### Anthropic (Claude)
**Purpose:** Claude AI models

1. Visit https://console.anthropic.com/
2. Sign up with email
3. Go to **API Keys**
4. Click **"Create Key"**
5. Copy key (starts with `sk-ant-`)
6. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-xxx`

**Pricing:** Pay-per-token, $0.25-$15 per million tokens

---

### Google Gemini
**Purpose:** Gemini AI models

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Get API Key"**
4. Create key or use existing
5. Copy the key
6. Add to `.env`: `GOOGLE_AI_API_KEY=xxx`

**Pricing:** Free tier available, then pay-as-you-go

---

### Cohere
**Purpose:** Text generation, embeddings

1. Visit https://dashboard.cohere.com/
2. Sign up with email
3. Navigate to **API Keys**
4. Copy trial key or create production key
5. Add to `.env`: `COHERE_API_KEY=xxx`

**Pricing:** Free tier: 100 API calls/minute

---

### Hugging Face
**Purpose:** ML models, datasets, inference

1. Visit https://huggingface.co/join
2. Create account
3. Go to **Settings → Access Tokens**
4. Click **"New token"**
5. Set permissions (read/write)
6. Copy token (starts with `hf_`)
7. Add to `.env`: `HUGGINGFACE_API_KEY=hf_xxx`

**Pricing:** Free for most models

---

## 🌐 Communication & Messaging

### Telegram Bot API
**Purpose:** Telegram bots, notifications

1. Open Telegram app
2. Search for `@BotFather`
3. Send `/newbot` command
4. Choose bot name and username (must end with `bot`)
5. Copy HTTP API token
6. Add to `.env`: `TELEGRAM_BOT_TOKEN=123456:ABCdef`

**Get Chat ID:**
- Send message to bot
- Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
- Copy `chat.id`
- Add to `.env`: `TELEGRAM_CHAT_ID=123456789`

**Pricing:** Free

---

### Twilio (WhatsApp, SMS)
**Purpose:** WhatsApp Business API, SMS

1. Visit https://www.twilio.com/try-twilio
2. Sign up with email/phone
3. Verify phone number
4. Go to **Console Dashboard**
5. Copy **Account SID** and **Auth Token**
6. For WhatsApp: Set up WhatsApp sandbox
7. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+5511999999999
```

**Pricing:** Free trial $15 credit, then pay-per-message

---

### Discord
**Purpose:** Discord bots, webhooks

1. Visit https://discord.com/developers/applications
2. Click **"New Application"**
3. Go to **Bot** section
4. Click **"Add Bot"**
5. Copy **Bot Token**
6. Enable required **Privileged Gateway Intents**
7. Add to `.env`: `DISCORD_BOT_TOKEN=xxx`

**Webhook:**
1. Go to Discord channel settings
2. **Integrations → Webhooks**
3. Create webhook, copy URL
4. Add to `.env`: `DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx`

**Pricing:** Free

---

### Slack
**Purpose:** Slack bots, notifications

1. Visit https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Go to **OAuth & Permissions**
5. Add Bot Token Scopes (chat:write, etc.)
6. Install app to workspace
7. Copy **Bot User OAuth Token**
8. Add to `.env`: `SLACK_BOT_TOKEN=xoxb-xxx`

**Pricing:** Free

---

## 📊 Development Tools

### GitHub
**Purpose:** Repository access, PRs, webhooks

1. Visit https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scopes:
   - ✅ `repo` (full repository access)
   - ✅ `workflow` (if using Actions)
4. Click **"Generate token"**
5. Copy token (starts with `ghp_`)
6. Add to `.env`: `GITHUB_TOKEN=ghp_xxx`

**For webhooks:**
- Generate random secret: `openssl rand -hex 20`
- Add to `.env`: `GITHUB_WEBHOOK_SECRET=xxx`

**Pricing:** Free

---

### GitLab
**Purpose:** GitLab CI/CD, repository management

1. Visit https://gitlab.com/-/profile/personal_access_tokens
2. Enter token name
3. Select scopes: `api`, `read_repository`, `write_repository`
4. Click **"Create personal access token"**
5. Copy token (starts with `glpat-`)
6. Add to `.env`: `GITLAB_TOKEN=glpat-xxx`

**Pricing:** Free tier available

---

### Vercel
**Purpose:** Deployment, serverless functions

1. Visit https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Choose scope (account or team)
4. Copy token
5. Add to `.env`: `VERCEL_TOKEN=xxx`

**Pricing:** Free tier: 100GB bandwidth/month

---

### Stripe
**Purpose:** Payment processing

1. Visit https://dashboard.stripe.com/register
2. Complete registration
3. Go to **Developers → API Keys**
4. Toggle **"Test mode"** for development
5. Copy **Publishable** and **Secret** keys
6. Add to `.env`:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

**Pricing:** 2.9% + $0.30 per transaction

---

## 🎬 Media & Content

### TMDB (The Movie Database)
**Purpose:** Movie/TV show data

1. Visit https://www.themoviedb.org/
2. Create free account
3. Go to **Settings → API**
4. Request API key (choose Developer)
5. Fill application form
6. Copy **API Key (v3 auth)**
7. Add to `.env`: `TMDB_API_KEY=xxx`

**Pricing:** Free

---

### YouTube Data API
**Purpose:** YouTube video data, analytics

1. Visit https://console.cloud.google.com/
2. Create new project
3. Enable **YouTube Data API v3**
4. Go to **Credentials**
5. Create **API Key**
6. (Optional) Restrict key to YouTube API
7. Add to `.env`: `YOUTUBE_API_KEY=xxx`

**Pricing:** Free quota: 10,000 units/day

---

### Spotify
**Purpose:** Music data, playlists

1. Visit https://developer.spotify.com/dashboard
2. Log in with Spotify account
3. Click **"Create app"**
4. Fill app details and agree to terms
5. Copy **Client ID** and **Client Secret**
6. Add to `.env`:
```env
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
```

**Pricing:** Free

---

### Unsplash
**Purpose:** Free stock photos

1. Visit https://unsplash.com/developers
2. Create developer account
3. Create new application
4. Copy **Access Key**
5. Add to `.env`: `UNSPLASH_ACCESS_KEY=xxx`

**Pricing:** Free: 50 requests/hour

---

## 🗺️ Maps & Location

### Google Maps
**Purpose:** Maps, geocoding, places

1. Visit https://console.cloud.google.com/
2. Create project
3. Enable **Maps JavaScript API** (or other APIs)
4. Go to **Credentials → Create Credentials → API Key**
5. (Recommended) Restrict key to specific APIs
6. Add to `.env`: `GOOGLE_MAPS_API_KEY=xxx`

**Pricing:** $200 free credit/month

---

### Mapbox
**Purpose:** Maps, navigation, geocoding

1. Visit https://account.mapbox.com/auth/signup/
2. Create account
3. Go to **Account → Access tokens**
4. Copy default token or create new
5. Add to `.env`: `MAPBOX_ACCESS_TOKEN=pk.xxx`

**Pricing:** Free tier: 50,000 map loads/month

---

## 🌤️ Weather & Environment

### OpenWeatherMap
**Purpose:** Weather data

1. Visit https://home.openweathermap.org/users/sign_up
2. Create account and verify email
3. Go to **API keys** tab
4. Copy default key or create new
5. Add to `.env`: `OPENWEATHER_API_KEY=xxx`

**Pricing:** Free: 60 calls/minute

---

### WeatherAPI
**Purpose:** Weather, astronomy data

1. Visit https://www.weatherapi.com/signup.aspx
2. Sign up with email
3. Verify email
4. Copy API key from dashboard
5. Add to `.env`: `WEATHER_API_KEY=xxx`

**Pricing:** Free: 1M calls/month

---

## 💰 Blockchain & Crypto

### Infura (Ethereum)
**Purpose:** Ethereum, IPFS nodes

1. Visit https://infura.io/register
2. Create account
3. Create new project
4. Copy **Project ID** and **Project Secret**
5. Add to `.env`:
```env
INFURA_PROJECT_ID=xxx
INFURA_PROJECT_SECRET=xxx
```

**Pricing:** Free: 100k requests/day

---

### Alchemy (Blockchain)
**Purpose:** Ethereum, Polygon nodes

1. Visit https://www.alchemy.com/
2. Sign up
3. Create new app
4. Choose network (Ethereum, Polygon, etc.)
5. Copy **API Key** and **HTTPS URL**
6. Add to `.env`: `ALCHEMY_API_KEY=xxx`

**Pricing:** Free tier: 300M compute units/month

---

### CoinGecko
**Purpose:** Crypto prices, market data

1. Visit https://www.coingecko.com/en/api
2. Click **"Get Your Free API Key"**
3. Sign up with email
4. Verify email
5. Copy API key from dashboard
6. Add to `.env`: `COINGECKO_API_KEY=xxx`

**Pricing:** Free: 30 calls/minute

---

### Etherscan
**Purpose:** Ethereum blockchain explorer API

1. Visit https://etherscan.io/register
2. Create account
3. Go to **API-KEYs**
4. Create new API key
5. Add to `.env`: `ETHERSCAN_API_KEY=xxx`

**Pricing:** Free: 5 calls/second

---

## 📧 Email & Communication

### SendGrid
**Purpose:** Transactional emails

1. Visit https://signup.sendgrid.com/
2. Create account
3. Go to **Settings → API Keys**
4. Click **"Create API Key"**
5. Choose **Full Access** or custom permissions
6. Copy key (starts with `SG.`)
7. Add to `.env`: `SENDGRID_API_KEY=SG.xxx`

**Pricing:** Free: 100 emails/day

---

### Mailgun
**Purpose:** Email automation

1. Visit https://signup.mailgun.com/
2. Sign up and verify
3. Go to **API Keys** section
4. Copy **Private API Key**
5. Note your **Domain** (sandbox for testing)
6. Add to `.env`:
```env
MAILGUN_API_KEY=xxx
MAILGUN_DOMAIN=sandboxXXX.mailgun.org
```

**Pricing:** Free: 5,000 emails/month (first 3 months)

---

### Resend
**Purpose:** Modern email API

1. Visit https://resend.com/signup
2. Create account
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Copy key (starts with `re_`)
6. Add to `.env`: `RESEND_API_KEY=re_xxx`

**Pricing:** Free: 100 emails/day

---

## 🔐 Authentication & Security

### Auth0
**Purpose:** Authentication as a service

1. Visit https://auth0.com/signup
2. Create account
3. Create new application
4. Go to **Settings**
5. Copy **Domain**, **Client ID**, **Client Secret**
6. Add to `.env`:
```env
AUTH0_DOMAIN=xxx.auth0.com
AUTH0_CLIENT_ID=xxx
AUTH0_CLIENT_SECRET=xxx
```

**Pricing:** Free: 7,500 active users

---

### Clerk
**Purpose:** User management, authentication

1. Visit https://dashboard.clerk.com/sign-up
2. Create account
3. Create new application
4. Copy **Publishable Key** and **Secret Key**
5. Add to `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
```

**Pricing:** Free: 10,000 monthly active users

---

## 📊 Analytics & Monitoring

### Google Analytics
**Purpose:** Web analytics

1. Visit https://analytics.google.com/
2. Sign in with Google account
3. Create property
4. Get **Measurement ID** (starts with `G-`)
5. Add to `.env`: `GA_MEASUREMENT_ID=G-XXXXXXXXXX`

**Pricing:** Free

---

### Mixpanel
**Purpose:** Product analytics

1. Visit https://mixpanel.com/register/
2. Create account
3. Create project
4. Go to **Project Settings**
5. Copy **Project Token**
6. Add to `.env`: `MIXPANEL_TOKEN=xxx`

**Pricing:** Free: 100k events/month

---

### Sentry
**Purpose:** Error tracking

1. Visit https://sentry.io/signup/
2. Create account
3. Create new project
4. Copy **DSN** (Data Source Name)
5. Add to `.env`: `SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx`

**Pricing:** Free: 5k errors/month

---

## 🗄️ Databases & Storage

### Supabase
**Purpose:** PostgreSQL database, auth, storage

1. Visit https://supabase.com/dashboard
2. Sign up with GitHub/email
3. Create new project
4. Go to **Project Settings → API**
5. Copy **URL** and **anon/public key**
6. Add to `.env`:
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
```

**Pricing:** Free: 500MB database, 1GB storage

---

### MongoDB Atlas
**Purpose:** MongoDB cloud database

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Create account
3. Create free cluster
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string
7. Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db`

**Pricing:** Free: 512MB storage

---

### Cloudinary
**Purpose:** Image/video storage, optimization

1. Visit https://cloudinary.com/users/register/free
2. Create account
3. Go to **Dashboard**
4. Copy **Cloud Name**, **API Key**, **API Secret**
5. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

**Pricing:** Free: 25 credits/month

---

## 🔍 Search & Data

### Algolia
**Purpose:** Search as a service

1. Visit https://www.algolia.com/users/sign_up
2. Create account
3. Create application
4. Go to **API Keys**
5. Copy **Application ID** and **Admin API Key**
6. Add to `.env`:
```env
ALGOLIA_APP_ID=xxx
ALGOLIA_API_KEY=xxx
```

**Pricing:** Free: 10k searches/month

---

### Pinecone
**Purpose:** Vector database for AI

1. Visit https://www.pinecone.io/
2. Sign up
3. Create project
4. Go to **API Keys**
5. Copy **API Key** and **Environment**
6. Add to `.env`:
```env
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-east-1-aws
```

**Pricing:** Free: 1 index, 100k vectors

---

## 📝 Content & CMS

### Notion API
**Purpose:** Notion workspace automation

1. Visit https://www.notion.so/my-integrations
2. Click **"New integration"**
3. Name integration and select workspace
4. Copy **Internal Integration Token**
5. Share Notion page with integration
6. Add to `.env`: `NOTION_API_KEY=secret_xxx`

**Pricing:** Free

---

### Contentful
**Purpose:** Headless CMS

1. Visit https://www.contentful.com/sign-up/
2. Create account
3. Create space
4. Go to **Settings → API keys**
5. Add API key
6. Copy **Space ID** and **Access Token**
7. Add to `.env`:
```env
CONTENTFUL_SPACE_ID=xxx
CONTENTFUL_ACCESS_TOKEN=xxx
```

**Pricing:** Free: 25k records, 25k API calls/month

---

## Quick Setup Template

Add this to your `.env` file and replace with your actual keys:

```env
# AI & LLM
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_AI_API_KEY=xxx

# Communication
TELEGRAM_BOT_TOKEN=123456:ABCxxx
TELEGRAM_CHAT_ID=123456789
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
DISCORD_BOT_TOKEN=xxx
SLACK_BOT_TOKEN=xoxb-xxx

# Development
GITHUB_TOKEN=ghp_xxx
GITLAB_TOKEN=glpat-xxx
VERCEL_TOKEN=xxx

# Media
TMDB_API_KEY=xxx
YOUTUBE_API_KEY=xxx
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx

# Maps & Weather
GOOGLE_MAPS_API_KEY=xxx
OPENWEATHER_API_KEY=xxx

# Blockchain
INFURA_PROJECT_ID=xxx
ALCHEMY_API_KEY=xxx

# Email
SENDGRID_API_KEY=SG.xxx
RESEND_API_KEY=re_xxx

# Auth
AUTH0_DOMAIN=xxx.auth0.com
AUTH0_CLIENT_ID=xxx

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
MONGODB_URI=mongodb+srv://xxx

# Search
ALGOLIA_APP_ID=xxx
PINECONE_API_KEY=xxx
```

---

## 📚 Additional Resources

- [Environment Setup](./environment-setup.md) - Basic setup guide
- [Security Best Practices](#security) - How to protect your API keys
- [Rate Limits & Quotas](#limits) - Understanding API limits

## 🔒 Security Best Practices

1. **Never commit `.env` to git**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use environment-specific files**
   - `.env.local` - Local development
   - `.env.production` - Production (use secrets manager)

3. **Rotate keys regularly**
   - Set calendar reminders
   - Revoke unused keys

4. **Use secrets managers in production**
   - AWS Secrets Manager
   - Google Secret Manager
   - Vercel Environment Variables
   - Railway/Render env vars

5. **Restrict API key permissions**
   - Use minimum required scopes
   - Set IP restrictions when possible
   - Use separate keys for dev/prod

---

**Last Updated:** 2025-10-01
**Maintained by:** Mastra UFSC Team
