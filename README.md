<div align="center">

<img src="https://img.shields.io/badge/STOCKLENS-0F172A?style=for-the-badge&labelColor=0F172A&color=00D9A5" height="48" alt="StockLens"/>

<h1>StockLens</h1>
<h3>Evidence-First Multi-Agent Financial Intelligence Platform</h3>

<p>StockLens does not tell investors what to think. It shows the evidence, connects the signals, explains the reasoning, and makes uncertainty visible.</p>

<p>
  <img src="https://img.shields.io/badge/status-in%20development-2EA44F?style=for-the-badge&labelColor=0F172A"/>
  <img src="https://img.shields.io/badge/architecture-multi--agent%20AI-8B5CF6?style=for-the-badge&labelColor=0F172A"/>
  <img src="https://img.shields.io/badge/data%20policy-evidence%20only-00D9A5?style=for-the-badge&labelColor=0F172A"/>
  <img src="https://img.shields.io/badge/license-MIT-EF4444?style=for-the-badge&labelColor=0F172A"/>
</p>

<p>
  <img src="https://img.shields.io/badge/frontend-Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/backend-Django-092E20?style=flat-square&logo=django&logoColor=white"/>
  <img src="https://img.shields.io/badge/database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/auth-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
</p>

<sub><b>Getting Started</b> &nbsp;·&nbsp; <b>API Reference</b> &nbsp;·&nbsp; <b>Architecture</b> &nbsp;·&nbsp; <b>Roadmap</b></sub>

</div>

<br/>

<table align="center">
<tr>
<td align="center" width="20%"><b>7</b><br/><sub>Specialized AI Agents</sub></td>
<td align="center" width="20%"><b>100%</b><br/><sub>Traceable Conclusions</sub></td>
<td align="center" width="20%"><b>0</b><br/><sub>Fabricated Data Points</sub></td>
<td align="center" width="20%"><b>3</b><br/><sub>Independent Providers</sub></td>
<td align="center" width="20%"><b>P0–P2</b><br/><sub>Staged Delivery</sub></td>
</tr>
</table>

<br/>

---

## Table of Contents

| | | |
|---|---|---|
| [01 · About](#about) | [08 · Explainability Engine](#explainability-engine) | [15 · Frontend Experience](#frontend-experience) |
| [02 · The Problem](#the-problem) | [09 · Tech Stack](#tech-stack) | [16 · Portfolio, Watchlist & Alerts](#portfolio-watchlist--alerts) |
| [03 · Product Philosophy](#product-philosophy) | [10 · Data Provider Architecture](#data-provider-architecture) | [17 · Project Structure](#project-structure) |
| [04 · Core Differentiator](#core-differentiator) | [11 · Database Schema](#database-schema) | [18 · Getting Started](#getting-started) |
| [05 · System Workflow](#system-workflow) | [12 · API Reference](#api-reference) | [19 · Roadmap](#roadmap) |
| [06 · Multi-Agent Research Pipeline](#multi-agent-research-pipeline) | [13 · Authentication & Authorization](#authentication--authorization) | [20 · Engineering Principles](#engineering-principles) |
| [07 · Evidence Layer & Validation](#evidence-layer--validation) | [14 · Safe Failure Architecture](#safe-failure-architecture) | |

---

## About

**StockLens** is a production-grade financial research platform that transforms scattered market signals — price action, fundamentals, news, and risk — into a single, explainable investment thesis.

Rather than surfacing raw metrics or generating a one-shot AI opinion, StockLens runs independent, specialized agents over validated real-world evidence, then synthesizes their findings into a research report where every conclusion is traceable back to its source.

> **This is not an AI chatbot bolted onto a ticker search.**
> It is a financial intelligence command center — engineered the way a serious fintech product should be.

---

## The Problem

Investors already have data everywhere:

| Signal | Typically lives in |
|---|---|
| Price charts | Trading terminals |
| Technical indicators | Charting tools |
| Financial statements | Broker apps |
| Company fundamentals | Screener platforms |
| News & sentiment | Aggregators, social feeds |
| Risk metrics | Nowhere consistent |
| Portfolio exposure | Spreadsheets |

The problem was never data availability. It is the absence of a system that explains **how these signals connect** and **why they lead to a particular view.**

---

## Product Philosophy

```
DATA → EVIDENCE → SPECIALIZED ANALYSIS → VALIDATION → AI REASONING → EXPLANATION → INVESTOR INTELLIGENCE
```

The LLM is treated strictly as a reasoning layer over validated evidence — never as the source of market truth.

**User journey**

```
Landing Page → Search Stock → Stock Intelligence Page → Analyze Stock
   → Analysis Orchestrator → Parallel Research Agents → Evidence Layer
   → AI Synthesis → Explainable Research Report → Portfolio / Watchlist / Alert
```

Every screen is designed to answer five questions:

| # | Question |
|---|---|
| 1 | What is happening? |
| 2 | Why is it happening? |
| 3 | What evidence supports it? |
| 4 | What are the risks? |
| 5 | What could invalidate this view? |

---

## Core Differentiator

<table>
<tr>
<th align="center">Traditional Platform</th>
<th align="center">Generic AI Tool</th>
<th align="center">StockLens</th>
</tr>
<tr>
<td valign="top">

```
Charts
Metrics
News
```
No synthesis.

</td>
<td valign="top">

```
Prompt
  ↓
LLM
  ↓
Answer
```
No evidence.

</td>
<td valign="top">

```
Real Data
  ↓
Specialized Agents
  ↓
Evidence
  ↓
Validation
  ↓
Cross-Domain Reasoning
  ↓
Explainability
```
Fully traceable.

</td>
</tr>
</table>

---

## System Workflow

### High-Level Architecture

```mermaid
flowchart TD
    A["Investor"] --> B["Next.js Frontend"]
    B --> C["Django REST API Gateway"]
    C --> D["Auth & Authorization"]
    D --> E["Analysis Orchestrator"]
    E --> F["Market Data Adapter"]
    E --> G["Fundamentals Adapter"]
    E --> H["News Adapter"]
    F --> I["Technical Agent"]
    G --> J["Fundamental Agent"]
    H --> K["News Agent"]
    I --> L["Risk Agent"]
    J --> L
    K --> L
    L --> M["Evidence Layer"]
    M --> N["Evidence Validation"]
    N --> O["Research Synthesis Agent"]
    O --> P["Explainability Engine"]
    P --> Q["Research Report"]
    Q --> R["Supabase PostgreSQL"]
    R --> S["Portfolio"]
    R --> T["Watchlist"]
    R --> U["Alerts"]

    classDef user fill:#8B5CF6,stroke:#5B21B6,color:#fff,stroke-width:2px
    classDef gateway fill:#0EA5E9,stroke:#0369A1,color:#fff,stroke-width:2px
    classDef orchestrator fill:#F97316,stroke:#C2410C,color:#fff,stroke-width:2px
    classDef agent fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px
    classDef evidence fill:#00D9A5,stroke:#047857,color:#0F172A,stroke-width:2px
    classDef output fill:#F59E0B,stroke:#B45309,color:#fff,stroke-width:2px
    classDef store fill:#22C55E,stroke:#15803D,color:#fff,stroke-width:2px

    class A user
    class B,C,D gateway
    class E orchestrator
    class F,G,H,I,J,K,L agent
    class M,N evidence
    class O,P,Q output
    class R,S,T,U store
```

### Analysis Orchestrator — Parallel Agent Execution

```mermaid
flowchart LR
    A["Analysis Request"] --> B["Resolve Stock"]
    B --> C["Check Provider Availability"]
    C --> D{"Trigger Agents in Parallel"}
    D --> E["Technical Agent"]
    D --> F["Fundamental Agent"]
    D --> G["News Agent"]
    E --> H["Collect Evidence"]
    F --> H
    G --> H
    H --> I["Risk Agent"]
    I --> J["Validate Results"]
    J --> K["Send to Synthesis"]
    K --> L["Store Final Report"]

    classDef request fill:#0EA5E9,stroke:#0369A1,color:#fff,stroke-width:2px
    classDef decision fill:#F59E0B,stroke:#B45309,color:#fff,stroke-width:2px
    classDef agent fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px
    classDef process fill:#8B5CF6,stroke:#5B21B6,color:#fff,stroke-width:2px
    classDef done fill:#22C55E,stroke:#15803D,color:#fff,stroke-width:2px

    class A,B,C request
    class D decision
    class E,F,G agent
    class H,I,J,K process
    class L done
```

### Explainability Trace

```mermaid
flowchart TD
    A["Overall Signal: NEUTRAL"] --> B["Key Drivers"]
    A --> C["Contradicting Signals"]
    A --> D["Uncertainty"]
    B --> E["Earnings growth positive"]
    B --> F["Technical momentum stable"]
    C --> G["Valuation elevated"]
    C --> H["News sentiment mixed"]
    E --> I["Evidence: Earnings Metric"]
    F --> J["Evidence: RSI"]
    G --> K["Evidence: Valuation Metric"]
    H --> L["Evidence: News Events"]

    classDef signal fill:#F59E0B,stroke:#B45309,color:#fff,stroke-width:2px
    classDef positive fill:#22C55E,stroke:#15803D,color:#fff,stroke-width:2px
    classDef negative fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px
    classDef evidence fill:#00D9A5,stroke:#047857,color:#0F172A,stroke-width:2px

    class A signal
    class B,E,F positive
    class C,G,H negative
    class D signal
    class I,J,K,L evidence
```

---

## Multi-Agent Research Pipeline

| Agent | Analyzes | Key Outputs |
|---|---|---|
| **Technical Agent** | Historical OHLCV, volume, price action | SMA, EMA, RSI, MACD, Bollinger Bands, momentum, volatility, trend, support/resistance |
| **Fundamental Agent** | Financial statements & company health | Revenue, EPS, P/E, P/B, ROE, margins, debt, cash flow, growth |
| **News & Sentiment Agent** | Provider-backed news & events | Title, source, URL, published time, sentiment, sentiment score, catalysts |
| **Risk Agent** | Volatility, drawdown, liquidity, leverage, concentration, sector & market exposure | Risk factor, severity, evidence, explanation, potential impact |
| **Research Synthesis Agent** | Cross-domain reasoning over all evidence | Technical / fundamental / news / risk views, overall signal, key drivers, contradictions, uncertainty |

> **Golden rule.** No agent may fabricate a value. If a data point is unavailable, the agent reports it as missing — never estimated.

---

## Evidence Layer & Validation

Every agent output is normalized into a single evidence schema:

```json
{
  "source": "string",
  "source_type": "market_data | fundamentals | news | risk",
  "timestamp": "ISO-8601",
  "metric": "string",
  "value": "any",
  "interpretation": "string",
  "confidence": "HIGH | MEDIUM | LIMITED",
  "reference": "string"
}
```

Before synthesis, evidence is validated against:

| Check | Purpose |
|---|---|
| Source availability | Confirms the provider actually returned data |
| Timestamp freshness | Prevents stale evidence from driving a live signal |
| Data completeness | Flags partial records before they reach synthesis |
| Schema correctness | Rejects malformed evidence at the boundary |
| Conflicting signals | Surfaces contradictions instead of averaging them away |
| Provider reliability | Tracks source trustworthiness over time |

Invalid or missing evidence is flagged — never silently replaced.

---

## Explainability Engine

Every conclusion in a StockLens report is traceable to its underlying evidence.

```
Overall View: NEUTRAL

Why?
  + Earnings growth remains positive
  + Technical momentum is stable
  − Valuation remains elevated
  − Recent news sentiment is mixed

Evidence:
  → Earnings metric
  → RSI
  → Valuation metric
  → Recent news events
```

Confidence is layered, never invented:

| Layer | Measures |
|---|---|
| **Data Confidence** | How complete is the underlying evidence |
| **Model Confidence** | How consistent is the agent reasoning |
| **Market Uncertainty** | How volatile or ambiguous is the current signal |

If evidence is incomplete, the system reports it plainly:

```
Confidence: LIMITED
Reason: Historical data is unavailable for the requested period.
```

StockLens says "insufficient evidence" rather than producing a confident, fabricated answer.

---

## Tech Stack

<table>
<tr>
<td valign="top" width="25%">

**Frontend**

<img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black"/><br/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/Recharts-8884D8?style=for-the-badge&logo=chartdotjs&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white"/>

</td>
<td valign="top" width="25%">

**Backend**

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/DRF-A30000?style=for-the-badge&logo=django&logoColor=white"/>

**Data & Auth**

<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/><br/>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>

</td>
<td valign="top" width="25%">

**AI Architecture**

<img src="https://img.shields.io/badge/Multi--Agent%20System-8B5CF6?style=for-the-badge"/><br/>
<img src="https://img.shields.io/badge/Evidence%20Layer-00D9A5?style=for-the-badge"/><br/>
<img src="https://img.shields.io/badge/Explainability-F59E0B?style=for-the-badge"/>

</td>
<td valign="top" width="25%">

**External Integrations**
*(all via adapters)*

<img src="https://img.shields.io/badge/Market%20Data-0EA5E9?style=for-the-badge"/><br/>
<img src="https://img.shields.io/badge/Fundamentals-22C55E?style=for-the-badge"/><br/>
<img src="https://img.shields.io/badge/News-F97316?style=for-the-badge"/><br/>
<img src="https://img.shields.io/badge/LLM%20Provider-8B5CF6?style=for-the-badge"/>

</td>
</tr>
</table>

---

## Data Provider Architecture

```mermaid
flowchart LR
    A["External Provider"] --> B["Provider Adapter"]
    B --> C["Normalized Internal Schema"]
    C --> D["Agent"]

    classDef ext fill:#94A3B8,stroke:#475569,color:#0F172A,stroke-width:2px
    classDef adapter fill:#0EA5E9,stroke:#0369A1,color:#fff,stroke-width:2px
    classDef schema fill:#00D9A5,stroke:#047857,color:#0F172A,stroke-width:2px
    classDef agent fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px

    class A ext
    class B adapter
    class C schema
    class D agent
```

Required adapters: `MarketDataAdapter`, `FundamentalsAdapter`, `NewsAdapter`. The core research engine never depends on a single vendor — providers can be swapped without rewriting analysis logic.

---

## Database Schema

**Core entities:** `User` · `UserProfile` · `Stock` · `Portfolio` · `PortfolioHolding` · `Watchlist` · `WatchlistItem` · `Alert` · `AnalysisReport` · `NewsArticle`

```mermaid
erDiagram
    USER ||--|| USERPROFILE : has
    USER ||--o{ PORTFOLIO : owns
    USER ||--o{ WATCHLIST : owns
    USER ||--o{ ALERT : sets
    USER ||--o{ ANALYSISREPORT : owns
    PORTFOLIO ||--o{ PORTFOLIOHOLDING : contains
    PORTFOLIOHOLDING }o--|| STOCK : references
    WATCHLIST ||--o{ WATCHLISTITEM : contains
    WATCHLISTITEM }o--|| STOCK : references
    ALERT }o--|| STOCK : monitors
    ANALYSISREPORT }o--|| STOCK : covers
    ANALYSISREPORT ||--o{ NEWSARTICLE : cites
```

**Key constraints**

| Constraint | Rule |
|---|---|
| Stock symbol | Globally unique |
| User profile | One per user |
| Portfolio holdings | Unique per `(portfolio, stock)` |
| Watchlist items | Unique per `(watchlist, stock)` |
| News article URL | Unique |
| Holding quantity | Must be positive |
| Buy price | Non-negative |
| Private reports | Strictly owner-scoped |

---

## API Reference

**Public**

```http
GET  /api/health/
GET  /api/stocks/
GET  /api/stocks/{symbol}/
GET  /api/stocks/{symbol}/technicals/
GET  /api/stocks/{symbol}/fundamentals/
GET  /api/stocks/{symbol}/news/
POST /api/stocks/{symbol}/analyze/
GET  /api/analysis/{id}/
```

**Authenticated**

```http
GET/PATCH                     /api/profile/
GET/POST/PUT/PATCH/DELETE     /api/portfolios/
GET/POST/PUT/PATCH/DELETE     /api/watchlists/
GET/POST/PUT/PATCH/DELETE     /api/alerts/
```

**Status codes**

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `204` | Deleted |
| `400` | Invalid Input |
| `401` | Authentication Failure |
| `403` | Forbidden |
| `404` | Not Found |
| `501` | Synthesis Not Configured |
| `503` | Provider Not Configured |

---

## Authentication & Authorization

```mermaid
flowchart LR
    A["Supabase Auth"] --> B["Bearer Token"]
    B --> C["Django Token Validation"]
    C --> D["Local User"]
    D --> E["Owner-Scoped Querysets"]

    classDef auth fill:#3ECF8E,stroke:#047857,color:#0F172A,stroke-width:2px
    classDef token fill:#0EA5E9,stroke:#0369A1,color:#fff,stroke-width:2px
    classDef access fill:#8B5CF6,stroke:#5B21B6,color:#fff,stroke-width:2px

    class A auth
    class B,C token
    class D,E access
```

Supported flows: Google OAuth, email/password, session management, access tokens. Anonymous users can access public stock research; authenticated users unlock portfolios, watchlists, alerts, and private history.

**Private resources:** Profile · Portfolio · Portfolio holdings · Watchlists · Alerts · Private analysis reports

> A private report belonging to another user returns `404`, never `403` — its existence is never leaked.

---

## Safe Failure Architecture

> **Missing data is always better than fake data.**

If a provider isn't configured, StockLens fails loudly and honestly instead of guessing:

```json
{
  "error": "market_data_provider_not_configured",
  "detail": "The market_data provider is not configured."
}
```

Local demo data may be used for frontend visualization only — production analysis always runs on real, provider-backed data.

---

## Frontend Experience

Designed as a high-end financial intelligence terminal, not a generic SaaS dashboard.

| Page | Shows |
|---|---|
| **Landing** | Value proposition, evidence-first architecture, example research output |
| **Dashboard** | Market overview, watchlist, recent research, portfolio snapshot, alerts |
| **Stock Research** | Price, chart, technicals, fundamentals, news, risk, AI research, evidence |
| **Portfolio** | Holdings, allocation, exposure, risk, research insights |
| **Watchlist** | Stocks, latest signals, changes, alerts |
| **Research History** | Previous analyses, timestamps, signal drift over time |

**Design language:** dark-first premium interface, strong typography, dense but readable data, subtle borders, professional cards, minimal gradients, controlled motion, high-quality charts, real skeleton loaders, accessible contrast.

**Deliberately avoided:** glassmorphism overload, decorative gradients, sparkle iconography, chatbot styling, over-rounded cards.

---

## Portfolio, Watchlist & Alerts

```mermaid
flowchart LR
    A["Portfolio"] --> B["Stock Exposure"]
    B --> C["Risk"]
    C --> D["Diversification"]
    D --> E["Portfolio Intelligence"]

    F["Market Event"] --> G["Alert Engine"]
    G --> H["Condition Match"]
    H --> I["Notification"]

    classDef flow1 fill:#8B5CF6,stroke:#5B21B6,color:#fff,stroke-width:2px
    classDef flow2 fill:#F97316,stroke:#C2410C,color:#fff,stroke-width:2px

    class A,B,C,D,E flow1
    class F,G,H,I flow2
```

| Feature | Detail |
|---|---|
| **Portfolio** | Tracks quantity, average buy price, exposure, composition |
| **Watchlist** | Named lists — `Long Term`, `AI Stocks`, `Indian Tech`, `High Growth` |
| **Alerts** | Threshold-based — `PRICE_ABOVE` · `PRICE_BELOW` · `RSI_ABOVE` · `RSI_BELOW` |

```
Stock: AAPL
Condition: PRICE_ABOVE
Threshold: 4250
Status: ACTIVE
```

---

## Project Structure

```
stocklens/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   └── types/
│
├── backend/
│   ├── config/
│   ├── apps/
│   │   ├── users/
│   │   ├── stocks/
│   │   ├── portfolios/
│   │   ├── watchlists/
│   │   ├── alerts/
│   │   └── analysis/
│   │
│   ├── services/
│   │   ├── adapters/
│   │   ├── agents/
│   │   ├── orchestrator/
│   │   └── synthesis/
│   │
│   └── manage.py
│
├── docs/
├── .env.example
├── README.md
└── docker-compose.yml
```

Domain logic is kept strictly separate from API views.

---

## Getting Started

**Backend**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

cd backend
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

**Frontend**

```powershell
npm install
npm run dev
```

**Validation**

```bash
python manage.py check
python manage.py test --settings=config.test_settings

npm run lint
npx tsc --noEmit
npm run build
```

---

## Roadmap

| Phase | Scope |
|---|---|
| **P0 — Core** | Auth, stock search & detail, technical/fundamental/news/risk analysis, orchestration, evidence layer, explainable reports, PostgreSQL persistence |
| **P1 — Personal Intelligence** | Portfolio, watchlist, alerts, research history |
| **P2 — Advanced** | Real-time monitoring, background workers, portfolio optimization, research memory, backtesting, personalization |

**Scaling path** — introducible without major architectural change: Redis · Celery / Task Queue · Streaming Events · Background Workers · Provider Failover.

---

## Engineering Principles

| Principle | Over |
|---|---|
| Evidence | Assumptions |
| Explainability | Black Box |
| Real Data | Fabricated Data |
| Modularity | Vendor Lock-in |
| Parallelism | Sequential Bottlenecks |
| Security | Convenience |
| Observable | Silent |
| Fail-Safe | Hallucinated |

<div align="center">

<br/>

<img src="https://img.shields.io/badge/Technically%20Deep-0F172A?style=for-the-badge&labelColor=0F172A&color=00D9A5"/>
<img src="https://img.shields.io/badge/Visually%20Premium-0F172A?style=for-the-badge&labelColor=0F172A&color=8B5CF6"/>
<img src="https://img.shields.io/badge/Explainable-0F172A?style=for-the-badge&labelColor=0F172A&color=F59E0B"/>
<img src="https://img.shields.io/badge/Demo%20Ready-0F172A?style=for-the-badge&labelColor=0F172A&color=EF4444"/>

<h3>StockLens — Evidence In. Intelligence Out.</h3>

</div>
