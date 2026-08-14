<div align="center"> <img src="https://img.shields.io/badge/-STOCKLENS-0A0E17?style=for-the-badge&labelColor=0A0E17&color=6366F1" height="60"/> <br/>
StockLens
Explainable AI Market Intelligence

<sub>Evidence  →  Multi-Agent Analysis  →  Explainable Research  →  Investor Intelligence</sub>

<br/> <p> <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/TypeScript-1E293B?style=for-the-badge&logo=typescript&logoColor=3178C6"/> <img src="https://img.shields.io/badge/Django-0B3D0B?style=for-the-badge&logo=django&logoColor=44B78B"/> <img src="https://img.shields.io/badge/PostgreSQL-1E2A47?style=for-the-badge&logo=postgresql&logoColor=4169E1"/> <img src="https://img.shields.io/badge/Supabase-16302A?style=for-the-badge&logo=supabase&logoColor=3ECF8E"/> </p> <p> <img src="https://img.shields.io/badge/status-active_development-6366F1?style=flat-square"/> <img src="https://img.shields.io/badge/architecture-multi--agent-8B5CF6?style=flat-square"/> <img src="https://img.shields.io/badge/philosophy-evidence--first-EC4899?style=flat-square"/> <img src="https://img.shields.io/badge/license-MIT-64748B?style=flat-square"/> </p> </div> <br/> <div align="center"> <table> <tr> <td align="center" width="230"> <h3>🧭</h3> <b>Evidence-First</b><br/> <sub>No fabricated data — ever</sub> </td> <td align="center" width="230"> <h3>🧩</h3> <b>Multi-Agent</b><br/> <sub>Domain-isolated reasoning</sub> </td> <td align="center" width="230"> <h3>🔍</h3> <b>Explainable</b><br/> <sub>Every conclusion is traceable</sub> </td> <td align="center" width="230"> <h3>🛡️</h3> <b>Fail-Closed</b><br/> <sub>Safe by design, not by luck</sub> </td> </tr> </table> </div> <br/>
<br/>
01 The Idea

StockLens is an evidence-driven financial intelligence platform that converts fragmented market information into structured, explainable research.

Instead of routing a stock question straight into an LLM, StockLens runs it through a disciplined research pipeline:

<div align="center">
 COLLECT   →   NORMALIZE   →   ANALYZE   →   VALIDATE   →   REASON   →   EXPLAIN
</div>

The model is a reasoning layer — never the source of market truth.

<br/> <table> <tr><th align="left" width="180">Domain</th><th align="left">What it covers</th></tr> <tr><td>📈 <b>Technical</b></td><td>Trend, momentum, indicators, volatility</td></tr> <tr><td>🏦 <b>Fundamental</b></td><td>Earnings, valuation, growth, financial health</td></tr> <tr><td>📰 <b>News</b></td><td>Events, catalysts, sentiment</td></tr> <tr><td>⚠️ <b>Risk</b></td><td>Volatility, drawdown, leverage, liquidity, concentration</td></tr> <tr><td>💼 <b>Portfolio</b></td><td>Holdings, exposure, research context</td></tr> <tr><td>🔔 <b>Monitoring</b></td><td>Watchlists, threshold-based alerts</td></tr> </table> <br/>
<br/>
02 System Architecture
👤 Investor
Next.js Web App
Django REST API
Supabase Auth
Authorization & Ownership
Analysis Orchestrator
Market Data Adapter
Fundamentals Adapter
News & Sentiment Adapter
Technical Agent
Fundamental Agent
News Agent
Risk Agent
Evidence Layer
Evidence Validation
Research Synthesis Agent
Explainability Engine
Supabase PostgreSQL
Research Reports
Portfolio Intelligence
Watchlists
Alert Engine
<div align="center">

Client → API Gateway → Identity + Authorization → Orchestrator → Adapters → Agents → Evidence → Validation → Synthesis → Explainability → Persistence → Investor Actions

</div> <br/>
<br/>
03 Core Workflow
<table> <tr><th>#</th><th align="left">Stage</th><th align="left">Responsibility</th></tr> <tr><td><code>01</code></td><td><b>Request</b></td><td>Investor initiates research for a stock</td></tr> <tr><td><code>02</code></td><td><b>Resolve</b></td><td>Symbol mapped to the canonical <code>Stock</code> entity</td></tr> <tr><td><code>03</code></td><td><b>Authenticate</b></td><td>Supabase token validated when applicable</td></tr> <tr><td><code>04</code></td><td><b>Orchestrate</b></td><td>Analysis Orchestrator builds the research pipeline</td></tr> <tr><td><code>05</code></td><td><b>Acquire</b></td><td>Market, fundamentals & news adapters collect source data</td></tr> <tr><td><code>06</code></td><td><b>Analyze</b></td><td>Technical, Fundamental, News, Risk agents run independently</td></tr> <tr><td><code>07</code></td><td><b>Normalize</b></td><td>Agent outputs become structured evidence</td></tr> <tr><td><code>08</code></td><td><b>Validate</b></td><td>Source, timestamp, completeness, consistency checks</td></tr> <tr><td><code>09</code></td><td><b>Synthesize</b></td><td>Research Agent performs cross-domain reasoning</td></tr> <tr><td><code>10</code></td><td><b>Explain</b></td><td>Conclusions linked back to supporting evidence</td></tr> <tr><td><code>11</code></td><td><b>Persist</b></td><td>Research report stored in PostgreSQL</td></tr> <tr><td><code>12</code></td><td><b>Act</b></td><td>Portfolio, watchlist & alert workflows consume the research</td></tr> </table> <br/>
Parallel Analysis Pipeline
🎯 Research Request
Analysis Orchestrator
Market Data
Fundamentals
News
Technical Agent
Fundamental Agent
News / Sentiment Agent
Risk Agent
Evidence Aggregation
Evidence Validation
Research Synthesis
Explainability
✅ Final Report

Why parallel agents? Independent research domains execute concurrently — cutting latency while keeping each responsibility isolated and independently testable.

<br/>
<br/>
04 Evidence-First AI
<table> <tr> <td width="50%" valign="top">

⚠️ Traditional AI

User Prompt
     ↓
    LLM
     ↓
Generated Opinion
</td> <td width="50%" valign="top">

✅ StockLens

Real Sources
     ↓
Provider Adapters
     ↓
Normalized Evidence
     ↓
Specialized Analysis
     ↓
Validation
     ↓
LLM Reasoning
     ↓
Explainable Research
</td> </tr> </table>
🔒 Non-negotiable rule

StockLens never fabricates prices, indicators, fundamentals, news, or confidence scores. If a required provider is unavailable, the system returns a structured error instead of generating substitute data.

json
{
  "error": "market_data_provider_not_configured",
  "detail": "The market_data provider is not configured."
}
<br/>
<br/>
05 Multi-Agent Intelligence
<table> <tr><th align="left">Agent</th><th align="left">Owns</th><th align="left">Key Outputs</th></tr> <tr><td>📊 <b>Technical</b></td><td>Market behavior</td><td>Trend, RSI, moving averages, MACD, momentum, volatility</td></tr> <tr><td>🏛️ <b>Fundamental</b></td><td>Business quality</td><td>Earnings, valuation, growth, margins, leverage</td></tr> <tr><td>📰 <b>News</b></td><td>External events</td><td>News, sentiment, catalysts, event impact</td></tr> <tr><td>⚠️ <b>Risk</b></td><td>Downside analysis</td><td>Drawdown, volatility, liquidity, concentration</td></tr> <tr><td>🧠 <b>Synthesis</b></td><td>Cross-domain reasoning</td><td>Overall research view & summary</td></tr> <tr><td>🔍 <b>Explainability</b></td><td>Traceability</td><td>Conclusion → Evidence → Reason</td></tr> </table>
Input Data → Domain-Specific Agent → Structured Findings → Evidence References

<sub>Each agent has a hard boundary — keeping the system modular, testable, and provider-independent.</sub>

<br/>
<br/>
06 Technology Stack
<div align="center">

Frontend

<img src="https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js"/> <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/Zustand-593D88?style=flat-square"/> <img src="https://img.shields.io/badge/Recharts-FF6384?style=flat-square"/> <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white"/>

<br/><br/>

Backend & Platform

<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"/> <img src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white"/> <img src="https://img.shields.io/badge/DRF-A30000?style=flat-square"/> <img src="https://img.shields.io/badge/Supabase_Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=black"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/> </div> <br/> <table> <tr><th align="left">Layer</th><th align="left">Architecture</th></tr> <tr><td>Market Data</td><td>Provider Adapter</td></tr> <tr><td>Fundamentals</td><td>Provider Adapter</td></tr> <tr><td>News</td><td>Provider Adapter</td></tr> <tr><td>Technical Intelligence</td><td>Technical Agent</td></tr> <tr><td>Risk Intelligence</td><td>Risk Agent</td></tr> <tr><td>AI Research</td><td>Evidence-Grounded LLM Synthesis</td></tr> <tr><td>Explainability</td><td>Evidence → Conclusion Mapping</td></tr> </table> <br/>
<br/>
07 Data Architecture
has
owns
contains
identifies
owns
contains
tracks
creates
triggers
requests
analyzed_in
has
USER
bigint
id
PK
string
username
UK
string
email
USER_PROFILE
bigint
id
PK
uuid
supabase_user_id
UK
string
display_name
decimal
investment_amount
string
experience_level
string
risk_tolerance
string
investment_horizon
boolean
onboarding_completed
PORTFOLIO
bigint
id
PK
bigint
user_id
FK
string
name
datetime
created_at
PORTFOLIO_HOLDING
bigint
id
PK
bigint
portfolio_id
FK
bigint
stock_id
FK
decimal
quantity
decimal
average_buy_price
STOCK
bigint
id
PK
string
symbol
UK
string
name
string
exchange
string
sector
string
industry
WATCHLIST
bigint
id
PK
bigint
user_id
FK
string
name
datetime
created_at
WATCHLIST_ITEM
bigint
id
PK
bigint
watchlist_id
FK
bigint
stock_id
FK
datetime
added_at
ALERT
bigint
id
PK
bigint
user_id
FK
bigint
stock_id
FK
string
alert_type
decimal
threshold
boolean
is_active
datetime
triggered_at
ANALYSIS_REPORT
bigint
id
PK
bigint
stock_id
FK
bigint
user_id
FK
json
technical_analysis
json
fundamental_analysis
json
news_analysis
json
risk_analysis
string
overall_signal
text
summary
datetime
created_at
NEWS_ARTICLE
bigint
id
PK
bigint
stock_id
FK
string
title
string
source
string
url
UK
datetime
published_at
string
sentiment
decimal
sentiment_score
<div align="center">
User
 ├── Profile
 ├── Portfolio ─── Holdings ─── Stock
 ├── Watchlist ─── Items ────── Stock
 ├── Alerts ─────────────────── Stock
 └── Research Reports ───────── Stock
</div>

<sub>Ownership stays isolated at the database/queryset layer.</sub>

<br/>
<br/>
08 API Design

Public Research

http
GET  /api/health/
GET  /api/stocks/
GET  /api/stocks/{symbol}/
GET  /api/stocks/{symbol}/technicals/
GET  /api/stocks/{symbol}/fundamentals/
GET  /api/stocks/{symbol}/news/
POST /api/stocks/{symbol}/analyze/
GET  /api/analysis/{id}/

Authenticated Resources

http
GET/PATCH                 /api/profile/
GET/POST/PUT/PATCH/DELETE /api/portfolios/
GET/POST/PUT/PATCH/DELETE /api/watchlists/
GET/POST/PUT/PATCH/DELETE /api/alerts/

Principles: REST over HTTPS · JSON everywhere · Django trailing-slash convention · Bearer-token auth · Owner-scoped querysets · Stable provider error envelope

<br/>
<br/>
09 Security & Ownership
Supabase Auth
Access Token
Django Validation
Local User Provisioning
Authorization
Owner-Scoped Queryset
🔒 Private Resource
🔑 Authentication delegated to Supabase
🛂 Application authorization controlled by Django
🚫 Supabase passwords never stored by Django
🔒 Portfolios, watchlists, alerts, reports are owner-scoped
🙈 Provider secrets never reach the frontend
🧾 Sensitive config lives in environment variables
🕵️ Unauthorized private reports return 404 — never leak existence
<br/>
<br/>
10 Portfolio Intelligence
STOCKLENS
Stock Research
Portfolio
Watchlist
Risk & Alerts
📊 Investor Dashboard
<table> <tr><th align="left">💼 Portfolio</th><th align="left">👁️ Watchlist</th><th align="left">🔔 Alerts</th></tr> <tr valign="top"> <td>
Holdings
Quantity
Average buy price
Stock exposure
</td> <td>
Named stock collections
Research access
Future event monitoring
</td> <td>
Price thresholds
RSI thresholds
Active/inactive state
Trigger timestamps
</td> </tr> </table> <br/>
<br/>
11 Production Safety

StockLens follows a fail-closed intelligence model.

<table> <tr><th align="left">Condition</th><th align="center">Response</th></tr> <tr><td>Invalid input</td><td align="center"><code>400</code></td></tr> <tr><td>Authentication failure</td><td align="center"><code>401</code></td></tr> <tr><td>Authorization failure</td><td align="center"><code>403</code></td></tr> <tr><td>Resource unavailable</td><td align="center"><code>404</code></td></tr> <tr><td>Synthesis unavailable</td><td align="center"><code>501</code></td></tr> <tr><td>Provider unavailable</td><td align="center"><code>503</code></td></tr> <tr><td>Successful read/update</td><td align="center"><code>200</code></td></tr> <tr><td>Resource created</td><td align="center"><code>201</code></td></tr> <tr><td>Resource deleted</td><td align="center"><code>204</code></td></tr> </table>
⚖️ Core rule

Missing evidence is acceptable. Fabricated evidence is not.

<sub>Provider integrations are isolated behind adapters — the core system stays independent of any single vendor.</sub>

<br/>
<br/>
12 Development
<table> <tr><td width="50%" valign="top">

⚙️ Backend

powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

cd backend
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
</td> <td width="50%" valign="top">

🎨 Frontend

powershell
Copy-Item .env.local.example .env.local

npm install
npm run dev
</td> </tr> </table>

Local services

Service	URL
Frontend	http://localhost:3000
Backend	http://127.0.0.1:8000
Health API	http://127.0.0.1:8000/api/health/

Validation

bash
python manage.py check
python manage.py test --settings=config.test_settings

npm run lint
npx tsc --noEmit
npm run build
<br/>
<br/>
13 Roadmap
StockLens MVP
Market Data
Fundamentals
News / Sentiment
Technical + Risk
Evidence-Grounded AI
Real-Time Events
Smart Alerts
Portfolio Risk
Research Memory
Personalization
🚀 Backtesting &Intelligence
<br/>
<br/>
14 Engineering Principles
<div align="center">
Principle	Decision
Evidence > Assumptions	AI reasons over validated data
Explainability > Black Box	Conclusions remain traceable
Real Data > Fabricated Data	Missing providers fail explicitly
Modularity > Lock-in	Provider adapters isolate integrations
Parallelism > Bottlenecks	Independent agents execute concurrently
Ownership > Shared State	Private resources remain user-scoped
Safe Failure > Silent Failure	Errors are explicit and structured
</div> <br/>
<br/>
15 Why StockLens
<table> <tr><td width="33%" align="center" valign="top">

Traditional Platforms

Charts +
Metrics +
News
</td><td width="33%" align="center" valign="top">

Generic AI Products

Prompt +
Context →
Generated Answer
</td><td width="33%" align="center" valign="top">

StockLens

Evidence →
Multi-Agent →
Explainable
Research
</td></tr> </table>
📡 Real Market Data
🧩 Specialized Agents
✅ Evidence Validation
🧠 Cross-DomainReasoning
🔍 Explainable Research
💡 Investor Intelligence

StockLens is not an AI chatbot that talks about stocks. It is a financial intelligence system that builds an evidence layer first, reasons across multiple research domains, and explains every major conclusion.

<br/>
<br/> <div align="center">
StockLens
Research with evidence. Reason with intelligence.
<br/>

<sub>⚠️ <b>Disclaimer:</b> StockLens is a research and market-intelligence platform. It does not guarantee investment returns and does not constitute financial advice.</sub>

</div>
