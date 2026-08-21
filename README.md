<div align="center">

# 🔮 STOCKLENS

### ⚡ Explainable AI Market Intelligence ⚡

### `Evidence` → `Multi-Agent Analysis` → `Explainable Research` → `Investor Intelligence`

<br/>

<img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
<img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=000000"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=44B78B"/>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=000000"/>

<br/><br/>

<img src="https://img.shields.io/badge/STATUS-ACTIVE_DEVELOPMENT-brightgreen?style=for-the-badge&labelColor=1E293B"/>
<img src="https://img.shields.io/badge/ARCHITECTURE-MULTI--AGENT-blueviolet?style=for-the-badge&labelColor=1E293B"/>
<img src="https://img.shields.io/badge/DESIGN-EVIDENCE--FIRST-orange?style=for-the-badge&labelColor=1E293B"/>
<img src="https://img.shields.io/badge/LICENSE-MIT-ff69b4?style=for-the-badge&labelColor=1E293B"/>

<br/><br/>

### 🚫 *Not another AI chatbot that talks about stocks.*
### ✅ *A financial intelligence system that proves what it says.*

</div>

<br/>

---

<br/>

## 🧭 01 · The Idea

**StockLens** is an evidence-driven financial intelligence platform that converts fragmented market information into structured, explainable research.

Instead of firing a stock question straight at an LLM, StockLens routes it through a disciplined research pipeline:

<div align="center">

### 🟦 `Collect` → 🟩 `Normalize` → 🟨 `Analyze` → 🟧 `Validate` → 🟥 `Reason` → 🟪 `Explain`

</div>

> 💡 **The model is a reasoning layer. It is never the source of market truth.**

### 🎯 What StockLens Analyzes

| 🧩 Domain | 📊 Coverage |
|:---:|---|
| 📈 **Technical** | Trend, momentum, indicators, volatility |
| 🏦 **Fundamental** | Earnings, valuation, growth, financial health |
| 📰 **News** | Events, catalysts, sentiment |
| ⚠️ **Risk** | Volatility, drawdown, leverage, liquidity, concentration |
| 💼 **Portfolio** | Holdings, exposure, research context |
| 🔔 **Monitoring** | Watchlists, threshold-based alerts |

<br/>

---

<br/>

## ⚔️ 02 · Why StockLens

<table>
<tr>
<td width="50%" valign="top">

### 📉 Traditional Platforms
```
Charts + Metrics + News
```
Data dump. No reasoning. You do all the work.

</td>
<td width="50%" valign="top">

### 🤖 Generic AI Products
```
Prompt + Context → Generated Answer
```
Confident-sounding. Not always grounded.

</td>
</tr>
</table>

### 🔥 StockLens = Both, Fused Into One Evidence-Driven Pipeline

```mermaid
flowchart TB
    A[🌐 Real Market Data] --> B[🤖 Specialized Agents]
    B --> C[✅ Evidence Validation]
    C --> D[🧠 Cross-Domain Reasoning]
    D --> E[📝 Explainable Research]
    E --> F[🎯 Investor Intelligence]

    classDef step fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef final fill:#7C3AED,stroke:#4C1D95,color:#fff,stroke-width:2px

    class A,B,C,D,E step
    class F final
```

<br/>

---

<br/>

## 🗺️ 03 · Roadmap

```mermaid
flowchart TB
    A[🚀 StockLens MVP] --> B[📈 Market Data]
    A --> C[🏦 Fundamentals]
    A --> D[📰 News and Sentiment]
    B --> E[⚙️ Technical and Risk]
    C --> E
    D --> E
    E --> F[🧠 Evidence-Grounded AI]
    F --> G[⚡ Real-Time Events]
    G --> H[🔔 Smart Alerts]
    G --> I[💼 Portfolio Risk]
    H --> J[🗃️ Research Memory]
    I --> J
    J --> K[🎯 Personalization]
    K --> L[🏆 Backtesting and Intelligence]

    classDef base fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef mid fill:#334155,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef final fill:#059669,stroke:#065F46,color:#fff,stroke-width:2px

    class A,B,C,D base
    class E,F,G,H,I,J,K mid
    class L final
```

<br/>

---

<br/>

## 🏗️ 04 · System Architecture

```mermaid
flowchart TB
    U[👤 Investor] --> FE[💻 Next.js Web App]
    FE --> API[🔌 Django REST API]

    API --> AUTH[🔐 Supabase Auth]
    API --> ACL[🛡️ Authorization and Ownership]

    ACL --> ORCH[🧭 Analysis Orchestrator]

    ORCH --> MD[📈 Market Data Adapter]
    ORCH --> FUND[🏦 Fundamentals Adapter]
    ORCH --> NEWS[📰 News and Sentiment Adapter]

    MD --> TECH[⚙️ Technical Agent]
    FUND --> FA[💰 Fundamental Agent]
    NEWS --> NA[🗞️ News Agent]
    ORCH --> RISK[⚠️ Risk Agent]

    TECH --> EVIDENCE[📚 Evidence Layer]
    FA --> EVIDENCE
    NA --> EVIDENCE
    RISK --> EVIDENCE

    EVIDENCE --> VALIDATE[✅ Evidence Validation]
    VALIDATE --> SYNTH[🧠 Research Synthesis Agent]
    SYNTH --> EXPLAIN[💡 Explainability Engine]
    EXPLAIN --> DB[(🗄️ Supabase PostgreSQL)]

    DB --> REPORTS[📝 Research Reports]
    DB --> PORTFOLIO[💼 Portfolio Intelligence]
    DB --> WATCHLIST[👁️ Watchlists]
    DB --> ALERTS[🔔 Alert Engine]

    REPORTS --> FE
    PORTFOLIO --> FE
    WATCHLIST --> FE
    ALERTS --> FE

    classDef entry fill:#334155,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef core fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef agent fill:#7C3AED,stroke:#4C1D95,color:#fff,stroke-width:2px
    classDef data fill:#0F766E,stroke:#0B3A3A,color:#fff,stroke-width:2px
    classDef out fill:#B45309,stroke:#78350F,color:#fff,stroke-width:2px

    class U,FE entry
    class API,AUTH,ACL,ORCH core
    class TECH,FA,NA,RISK,SYNTH,EXPLAIN agent
    class MD,FUND,NEWS,EVIDENCE,VALIDATE,DB data
    class REPORTS,PORTFOLIO,WATCHLIST,ALERTS out
```

<div align="center">

**⚡ Architecture in one line ⚡**

`Client → API Gateway → Identity & Authorization → Analysis Orchestrator → Provider Adapters → Specialized Agents → Evidence Layer → Validation → AI Synthesis → Explainability → Persistent Research → Investor Actions`

</div>

<br/>

---

<br/>

## 🔄 05 · Core Workflow

| # | 🚦 Stage | 🎯 System Responsibility |
|:---:|---|---|
| 01 | 📥 **Request** | Investor initiates research for a stock |
| 02 | 🔎 **Resolve** | Symbol is mapped to the canonical `Stock` entity |
| 03 | 🔐 **Authenticate** | Supabase token is validated when applicable |
| 04 | 🧭 **Orchestrate** | Analysis Orchestrator creates the research pipeline |
| 05 | 📡 **Acquire** | Market, fundamentals, and news adapters collect source data |
| 06 | 🤖 **Analyze** | Technical, Fundamental, News, and Risk agents work independently |
| 07 | 🧱 **Normalize** | Agent outputs become structured evidence |
| 08 | ✅ **Validate** | Source, timestamp, completeness, and consistency are checked |
| 09 | 🧠 **Synthesize** | Research Agent performs cross-domain reasoning |
| 10 | 💡 **Explain** | Conclusions are connected to supporting evidence |
| 11 | 💾 **Persist** | Research report is stored in PostgreSQL |
| 12 | ⚡ **Act** | Portfolio, watchlist, and alert workflows use the research |

### 🌀 Parallel Analysis Pipeline

```mermaid
flowchart TB
    A[📥 Research Request] --> B[🧭 Analysis Orchestrator]
    B --> C1[📈 Market Data]
    B --> C2[🏦 Fundamentals]
    B --> C3[📰 News]
    C1 --> D1[⚙️ Technical Agent]
    C2 --> D2[💰 Fundamental Agent]
    C3 --> D3[🗞️ News and Sentiment Agent]
    D1 --> E[⚠️ Risk Agent]
    D2 --> E
    D3 --> E
    E --> F[📚 Evidence Aggregation]
    F --> G[✅ Evidence Validation]
    G --> H[🧠 Research Synthesis]
    H --> I[💡 Explainability]
    I --> J[📝 Final Report]

    classDef start fill:#334155,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef mid fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef final fill:#059669,stroke:#065F46,color:#fff,stroke-width:2px

    class A,B start
    class C1,C2,C3,D1,D2,D3,E,F,G,H mid
    class J final
```

> ⚡ **Why parallel agents?** Independent research domains execute concurrently, reducing latency while keeping responsibilities isolated and independently testable.

<br/>

---

<br/>

## 🧬 06 · Evidence-First AI

<table>
<tr>
<td width="50%" valign="top">

#### ❌ Traditional AI Approach
```
User Prompt → LLM → Generated Opinion
```

</td>
<td width="50%" valign="top">

#### ✅ StockLens Approach
```
Real Sources → Provider Adapters →
Normalized Evidence → Specialized Analysis →
Validation → LLM Reasoning →
Explainable Research
```

</td>
</tr>
</table>

> 🚨 **Non-negotiable rule.** StockLens never fabricates prices, indicators, fundamentals, news, or confidence scores. If a required provider is unavailable, the system returns a structured error instead of generating substitute data.

```json
{
  "error": "market_data_provider_not_configured",
  "detail": "The market_data provider is not configured."
}
```

<br/>

---

<br/>

## 🤖 07 · Multi-Agent Intelligence

| 🧠 Agent | 🎯 Owns | 📊 Key Outputs |
|---|---|---|
| ⚙️ **Technical Agent** | Market behavior | Trend, RSI, moving averages, MACD, momentum, volatility |
| 💰 **Fundamental Agent** | Business quality | Earnings, valuation, growth, margins, leverage |
| 🗞️ **News Agent** | External events | News, sentiment, catalysts, event impact |
| ⚠️ **Risk Agent** | Downside analysis | Drawdown, volatility, liquidity, concentration |
| 🧠 **Synthesis Agent** | Cross-domain reasoning | Overall research view and summary |
| 💡 **Explainability Engine** | Traceability | Conclusion → Evidence → Reason |

<div align="center">

**Agent Design**

`Input Data → Domain-Specific Agent → Structured Findings → Evidence References`

</div>

Each agent has a clear boundary — keeping the system **modular**, **testable**, and **provider-independent**. 🧩

<br/>

---

<br/>

## 🛠️ 08 · Technology Stack

### 🎨 Frontend

| 🔧 Technology | 🎯 Role |
|---|---|
| ⚡ Next.js 16 | Application framework |
| ⚛️ React 19 | UI layer |
| 🟦 TypeScript | Type-safe development |
| 🎨 Tailwind CSS | Design system |
| 🐻 Zustand | Client state |
| 📊 Recharts | Market visualization |
| 🎬 Framer Motion | Interaction and motion |

### ⚙️ Backend & Platform

| 🔧 Technology | 🎯 Role |
|---|---|
| 🐍 Python | Backend runtime |
| 🎸 Django | Application framework |
| 🔌 Django REST Framework | API layer |
| 🔐 Supabase Auth | Authentication and identity |
| 🗄️ Supabase PostgreSQL | Persistent data layer |

### 🧠 AI & Data

| 🧩 Layer | 🏛️ Architecture |
|---|---|
| 📈 Market Data | Provider Adapter |
| 🏦 Fundamentals | Provider Adapter |
| 📰 News | Provider Adapter |
| ⚙️ Technical Intelligence | Technical Agent |
| ⚠️ Risk Intelligence | Risk Agent |
| 🧠 AI Research | Evidence-Grounded LLM Synthesis |
| 💡 Explainability | Evidence → Conclusion Mapping |

<br/>

---

<br/>

## 🗄️ 09 · Database Schema

```mermaid
erDiagram
    USER ||--o| USER_PROFILE : has
    USER ||--o{ PORTFOLIO : owns
    PORTFOLIO ||--o{ PORTFOLIO_HOLDING : contains
    STOCK ||--o{ PORTFOLIO_HOLDING : identifies
    USER ||--o{ WATCHLIST : owns
    WATCHLIST ||--o{ WATCHLIST_ITEM : contains
    STOCK ||--o{ WATCHLIST_ITEM : tracks
    USER ||--o{ ALERT : creates
    STOCK ||--o{ ALERT : triggers
    USER o|--o{ ANALYSIS_REPORT : requests
    STOCK ||--o{ ANALYSIS_REPORT : analyzed_in
    STOCK ||--o{ NEWS_ARTICLE : has

    USER {
        bigint id PK
        string username UK
        string email
    }
    USER_PROFILE {
        bigint id PK
        uuid supabase_user_id UK
        string display_name
        decimal investment_amount
        string experience_level
        string risk_tolerance
        string investment_horizon
        boolean onboarding_completed
    }
    STOCK {
        bigint id PK
        string symbol UK
        string name
        string exchange
        string sector
        string industry
    }
    PORTFOLIO {
        bigint id PK
        bigint user_id FK
        string name
        datetime created_at
    }
    PORTFOLIO_HOLDING {
        bigint id PK
        bigint portfolio_id FK
        bigint stock_id FK
        decimal quantity
        decimal average_buy_price
    }
    WATCHLIST {
        bigint id PK
        bigint user_id FK
        string name
        datetime created_at
    }
    WATCHLIST_ITEM {
        bigint id PK
        bigint watchlist_id FK
        bigint stock_id FK
        datetime added_at
    }
    ALERT {
        bigint id PK
        bigint user_id FK
        bigint stock_id FK
        string alert_type
        decimal threshold
        boolean is_active
        datetime triggered_at
    }
    ANALYSIS_REPORT {
        bigint id PK
        bigint stock_id FK
        bigint user_id FK
        json technical_analysis
        json fundamental_analysis
        json news_analysis
        json risk_analysis
        string overall_signal
        text summary
        datetime created_at
    }
    NEWS_ARTICLE {
        bigint id PK
        bigint stock_id FK
        string title
        string source
        string url UK
        datetime published_at
        string sentiment
        decimal sentiment_score
    }
```

<div align="center">

**🔗 Data Ownership**

```
👤 User
 ├── 🪪 Profile
 ├── 💼 Portfolio ── Holdings ── Stock
 ├── 👁️ Watchlist ── Items ───── Stock
 ├── 🔔 Alerts ────────────────  Stock
 └── 📝 Research Reports ──────  Stock
```

</div>

The ownership model keeps private financial resources isolated at the **database** and **queryset** layer. 🔒

<br/>

---

<br/>

## 🔌 10 · API Design

### 🌍 Public Research

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

### 🔐 Authenticated Resources

```http
GET    /api/profile/
PATCH  /api/profile/
GET    /api/portfolios/
POST   /api/portfolios/
PUT    /api/portfolios/{id}/
PATCH  /api/portfolios/{id}/
DELETE /api/portfolios/{id}/
GET    /api/watchlists/
POST   /api/watchlists/
PUT    /api/watchlists/{id}/
PATCH  /api/watchlists/{id}/
DELETE /api/watchlists/{id}/
GET    /api/alerts/
POST   /api/alerts/
PUT    /api/alerts/{id}/
PATCH  /api/alerts/{id}/
DELETE /api/alerts/{id}/
```

### 📐 API Principles

- 🌐 REST over HTTPS
- 📦 JSON request and response format
- 🔚 Django trailing-slash convention
- 🔑 Bearer-token authentication
- 🛡️ Owner-scoped querysets
- 📋 Stable provider error envelope

<br/>

---

<br/>

## 🛡️ 11 · Security and Ownership

```mermaid
flowchart TB
    A[🔐 Supabase Auth] --> B[🎫 Access Token]
    B --> C[✅ Django Validation]
    C --> D[👤 Local User Provisioning]
    D --> E[🛡️ Authorization]
    E --> F[🔒 Owner-Scoped Queryset]
    F --> G[🗝️ Private Resource]

    classDef step fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef final fill:#DC2626,stroke:#7F1D1D,color:#fff,stroke-width:2px

    class A,B,C,D,E,F step
    class G final
```

### 🔒 Security Guarantees

- 🔐 Authentication is delegated to Supabase
- 🛡️ Django controls application authorization
- 🚫 Supabase passwords are never stored by Django
- 🔑 Private portfolios, watchlists, alerts, and reports are owner-scoped
- 🙈 Provider secrets never reach the frontend
- 🗝️ Environment variables hold sensitive configuration
- 🕵️ Unauthorized private reports return `404` to avoid resource enumeration

<br/>

---

<br/>

## 💼 12 · Portfolio Intelligence

StockLens is designed to evolve from stock research into **investor-level intelligence**. 🚀

```mermaid
flowchart TB
    S[🔮 StockLens] --> A[📈 Stock Research]
    S --> B[💼 Portfolio]
    S --> C[👁️ Watchlist]
    A --> D[⚠️ Risk and Alerts]
    B --> D
    C --> D
    D --> E[🎛️ Investor Dashboard]

    classDef root fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef mid fill:#334155,stroke:#0F172A,color:#fff,stroke-width:2px
    classDef final fill:#7C3AED,stroke:#4C1D95,color:#fff,stroke-width:2px

    class S root
    class A,B,C,D mid
    class E final
```

| 💼 Portfolio | 👁️ Watchlist | 🔔 Alerts |
|---|---|---|
| Holdings | Named stock collections | Price thresholds |
| Quantity | Research access | RSI thresholds |
| Average buy price | Future event monitoring | Active/inactive state |
| Stock exposure | | Trigger timestamps |

<br/>

---

<br/>

## 💻 13 · Development

### ⚙️ Backend

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

cd backend
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

### 🎨 Frontend

```powershell
Copy-Item .env.local.example .env.local

npm install
npm run dev
```

### 🌐 Local Services

| 🖥️ Service | 🔗 URL |
|---|---|
| 🎨 Frontend | `http://localhost:3000` |
| ⚙️ Backend | `http://127.0.0.1:8000` |
| ❤️ Health API | `http://127.0.0.1:8000/api/health/` |

### ✅ Validation

```bash
python manage.py check
python manage.py test --settings=config.test_settings

npm run lint
npx tsc --noEmit
npm run build
```

<br/>

---

<br/>

## 🚨 14 · Production Safety

StockLens follows a **fail-closed** intelligence model.

| ⚡ Condition | 🚦 Response |
|---|:---:|
| ❌ Invalid input | `400` |
| 🔐 Authentication failure | `401` |
| 🛡️ Authorization failure | `403` |
| 🔍 Resource unavailable | `404` |
| 🧠 Synthesis unavailable | `501` |
| 📡 Provider unavailable | `503` |
| ✅ Successful read/update | `200` |
| 🆕 Resource created | `201` |
| 🗑️ Resource deleted | `204` |

> 🔑 **Core rule.** Missing evidence is acceptable. Fabricated evidence is not.

Provider integrations are isolated behind adapters so the core system remains **independent of any single data vendor**. 🧩

<br/>

---

<br/>

<div align="center">

# 🔮 StockLens

### ✨ Research with evidence. Reason with intelligence. ✨

<br/>

<img src="https://img.shields.io/badge/Made_with-💜-7C3AED?style=for-the-badge&labelColor=1E293B"/>
<img src="https://img.shields.io/badge/Evidence--First-✅-059669?style=for-the-badge&labelColor=1E293B"/>
<img src="https://img.shields.io/badge/Fail--Closed-🔒-DC2626?style=for-the-badge&labelColor=1E293B"/>

<br/><br/>

<sub>**⚠️ Disclaimer:** StockLens is a research and market-intelligence platform. It does not guarantee investment returns and does not constitute financial advice.</sub>

</div>
